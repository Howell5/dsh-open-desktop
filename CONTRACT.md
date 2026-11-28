# Little Widgets v4 · Host ⇄ Client 契约

> 卡片是一条 DSH session 的持久展示位。板面是同一组卡片的网格视图。
> 卡片内容只有一种来源：`view/` 里的前端代码，在沙箱 iframe 中渲染。
> 数据目录：`$DSH_HOME/little-widgets/`，默认 `~/.dsh/little-widgets/`；可通过 `dataDir` 配置。

## 1. card.json（侧车，唯一真相源）

```json
{
  "version": 3,
  "id": "session-card-xxxx",
  "sessionId": "session-card-xxxx",
  "title": "WiFi 质量",
  "size": { "w": 6, "h": 5 },
  "order": 0,
  "refresh": { "template": "wifi", "everyMs": 60000 },
  "viewWarnings": [],
  "building": false,
  "createdAt": 0,
  "updatedAt": 0
}
```

`id` 和目录稳定；`sessionId` 指向当前执行器，确认旧执行器不存在时可更换，临时恢复失败不更换。
`size` 是 12 列网格中的跨度，宽高均为 3..12。
`refresh` 支持 `template/command/file/url`，取数优先级按此顺序；`everyMs` 为刷新间隔
（5 秒–7 天），空对象不自动刷新。`dailyAt`（`"HH:MM"`，本机时区）优先于 `everyMs`：
卡片在每天这个时刻取数，创建后先立刻取一次；重启或休眠后重新计算下一次时刻，不累积漂移。
`viewWarnings` 是 `card_finish` 门禁产生的非阻断警告（裸色值等硬错误会直接打回）。

没有 `view` 字段，也没有 `view.kind`。视图文件固定位于
`cards/<id>/view/{index.html,style.css,view.js,README.md}`；Host 将内容内联进 State，Client 始终用
沙箱 iframe + CSP + 设计系统渲染。`v2` 卡片启动时由 `migrateViews` 无损迁移：删除 `view.kind`、
保留已有 custom 文件、为没有视图的卡片写入一份可运行的默认脚手架。

## 2. HTTP

- `GET /little-widgets/stream`：SSE，连接即推全量 State，之后每次变更推送；20s 保活。
- `GET /little-widgets/card-stream?id=<cardId>`：兜底卡片对话的逐字流：`ready` → `live {turn,step,text}` → `end`。历史与工具卡片走 `card-turns`；原生会话使用 DSH 自己的流。
- `POST /little-widgets/api`：Origin 校验、只收 POST、256KB 上限；返回 `{ ok, value, state }`。

动作：`state` / `card-create {text,title?,size?}` / `card-session {id}` / `card-prompt {id,text}` /
`card-update {id,title?,size?,order?,refresh?}` / `card-remove {id}` / `card-reorder {ids}` /
`card-data {id,value}` /
`card-refresh {id?}` / `card-inspect {id}` / `card-turns {id}` / `card-view {id}` / `card-chat {id}` /
`card-chat-close` / `card-cancel {id}` / `pause {paused}` / `open` / `renderer-fetch {id,url}` / `client-log {...}`。

`card-session` 准备卡片执行器、实际目录及工具，返回 `{ sessionId }`。Client 以返回的 ID 执行 `sessions.retain()`，等待 `reference.ready` 后调用 `uiWorkspace.openSession()`；通过 `layout.beginNavigation()` 接入原生导航取消，用户切换会话或面板后，旧请求不再跳转，其引用会被释放。删除卡片会使尚未完成的准备失效，异步等待结束后不能重新附加工具。

## 3. State

```json
{
  "version": 1, "serverNow": 0, "openAt": 0, "chatOpenCardId": null,
  "paused": false,
  "cards": [],
  "data": { "<cardId>": { "value": {}, "fetchedAt": 0, "ttl": 0, "sourceRef": "template:wifi", "error": null } },
  "templates": [],
  "design": { "css": "/* … */", "js": "/* … */" }
}
```

`cards` 是上面的侧车结构，另带内联视图 `view: { html, css, js, missing }`；所有卡片都带，不存在
只有 custom 才带的情况。`templates` 提供 id/title/description/defaultEveryMs/fields。
`design` 是注入每个 iframe 的设计系统（`theme.css` + `runtime.js`），由 Host 在启动时读取一次。
板面和会话预览共享同一个客户端 store；SSE 与轮询更新同一份状态。返回板面的定位请求只保存在客户端，不修改 Host 的 `openAt`，避免重新打开会话。

`card-data` 是卡片 view 的交互状态写回，语义是**浅合并**：

- `value` 必须是 JSON；与已有的 `data/state.json` 逐键合并，不整体覆盖。同一张卡可以同时存时间窗、选中项、勾选状态，各自 save 自己那几个键。
- 合并后序列化 ≤64KB，Host 原子写入 `cards/<id>/data/state.json`。
- **不触发重新取数**：视图刚改完状态，本地已是新的；再跑一遍采集只会让点击变慢，还可能用旧快照覆盖视图。
- view 里用 `window.dshWidget.save(value)` 调用；只允许写这张卡自己的 `data/`，不暴露任意路径。

需要跨重启恢复的卡片（例如个股详情停在 NVDA 1M），由采集器读一次 `data/state.json`，把内容回显到取数结果的 `saved` 字段，视图启动时只应用一次。

## 4. 工作区、目录与权限

插件启动时用 `workspaceRegistry.resolveByPath()` / `create()` 注册或复用路径为 `paths.cards`、默认名称为 **Little-Widgets** 的工作区。新会话只传 `workspaceId` 创建，不同时传 `cwd`。

- 原始 `session.header.cwd` 是工作区根目录，用于 DSH 归属与 sandbox workspace root。
- `workingDirectory.set(agent, paths.cardDir(cardId))` 设置实际执行目录，必须在首条 prompt 之前完成。
- DSH 普通文件/命令工具采用实际目录；目录切换不会改变已启动进程或权限。
- `workspace-write` 覆盖整个 `cards/`；单卡子目录不是权限隔离边界。刷新命令沿用 Host 现有执行方式，插件不提供旧实验版的三档卡片审批系统。

DSH `0.2.2-rc.2` 的 workspace attachment 要求原始 cwd 严格匹配工作区路径，不接受子目录继承归属，也没有公开的无损跨工作区迁移接口。插件启动时迁移旧卡片会话：备份日志、仅改写会话头中的 `cwd` 为 `cards/` 根、把会话存储移到对应项目目录、重新索引并 `attachSession`。会话 ID、事件与卡片映射保持不变；任何一步失败都回滚目录并保留原文件。普通会话不参与迁移。

## 5. 卡片会话的工具与提示

卡片 session 注册 `card_read` / `card_update` / `card_set_refresh` / `card_refresh` /
`card_check` / `card_finish` / `card_remove` / `card_open_folder`。
`card_finish` 先对 `view/` 跑静态门禁：裸色值、外链资源、小于 11px 字号、直接 `fetch` /
`window.open`、JS 语法错误、空视图是硬错误，会打回并列出问题；其余（内部滚动、
`position: fixed`、命名色）写入 `viewWarnings`。`card_check` 可在完成前自检。
新建卡片时 `view/` 会写入一份可运行的默认脚手架（按数据形状排版 + `od.fitRows` 截断）。
首条消息前置“卡片任务”指令；插件启动时扫描已有会话，并在原生 `agent/created` 生命周期中使用事件携带的 agent 幂等附加工具、提示和实际目录。启动时暂时恢复失败后，从原生侧栏再次打开也会补齐；`agent/disposed` 会释放对应工具。
卡片标题通过 `sessionTitle.rename()` 同步，包括板面改名和 card_* 工具改名；同步失败写入 Host 日志。

## 6. 原生会话顶部入口

Client 向 `conversation.session.header.actions` 追加操作，不替换原生标题、消息或输入框。只有 `sessionId` 与当前卡片映射匹配的会话显示：

- **预览这张卡片**：原生 dialog 顶层浮窗，复用 `CardContent`、当前数据与主题；关闭按钮、Escape 或点击背景退出，保留当前会话。
- **返回板面**：`ctx.layout.selectPanel('little-widgets')`，滚动并聚焦对应卡片，短暂高亮；遵循减少动画偏好。

普通会话、已删除卡片及被替换的旧执行器不显示这些操作。原生会话服务不可用时，“修改”入口保留轻量卡片对话作为兜底。
