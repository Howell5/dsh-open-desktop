# Open Desktop

把 DeepSeek Harness 的中栏变成**可拖拽的数据卡片墙**。

每张卡片不是静态组件，而是**一条真实 session 的持久展示位**：agent 在卡片目录里写代码（取数脚本、服务、前端），内容用 `view/` 里的 HTML/CSS/JS 在沙箱 iframe 中渲染。

![Open Desktop 板面](https://cdn.jsdelivr.net/gh/Howell5/dsh-open-desktop@main/docs/hero.png)

## 安装

```bash
dsh plugin --profile desktop add dsh-open-desktop
```

要求 DSH `>=0.2.2-rc.3`。装完重启一次 DSH，侧栏出现「小组件」。

## 它解决什么

- **会话用完就沉底** → 卡片把结果留在板上，一眼能看到今天的数据。
- **dashboard 要手写** → 用一句话 + 模板新建，agent 在卡片自己的会话里把视图做出来。
- **看板容易假** → 每张卡有真实的数据年龄、失败状态和刷新节奏，不是静态截图。

## 特性

- **Bento 板面**：12 列网格，拖拽排序、拖右下角改尺寸；虚线占位表示目标位置，松手换位。
- **每卡独立刷新**：`template` / `command` / `file` / `url` 四种数据源，或每天固定时刻；属性弹窗里直接改频率。
- **唯一渲染路径**：`view/index.html + style.css + view.js`，沙箱 iframe + CSP，外链资源会被门禁打回。
- **设计系统注入**：`--od-*` token、`od-*` 组件类、`window.od` 运行时；卡片只写内容，不重画外壳。
- **31 张模板**：今天 / 工作 / 钱 / 信息 / 生活 / 数字资产；工作 6 张（含待办清单），其余每类 5 张。
- **交互卡**：待办清单可以勾选、增删、双击编辑；状态写回卡片自己的 `data/state.json`（`dshWidget.save`）。
- **两层卡片**：总览点一行进入详情（个股 / 仓库 / 服务…），`od-back` 返回；时间窗切片、选中项写回 `data/state.json`（浅合并、不触发重取），重启后还停在原处。
- **原生会话**：点「修改」进入卡片自己的 DSH 会话，顶部可预览卡片或返回板面。

## 交互

拖拽时目标格子留出同尺寸虚线占位，其余卡片实时让位；支持触屏长按和键盘（空格拿起 / 方向键移动 / 空格放下 / Escape 取消）。


卡片 `⋯ → 属性…` 可以改标题、尺寸和刷新频率；选「每天」时时间下拉固定在第二行，不会挤动「更多」。


## 卡片模型

```
$DSH_HOME/open-desktop/
  cards/<id>/card.json     # 标题/尺寸/顺序/刷新约定
  cards/<id>/view/         # 唯一渲染源：index.html + style.css + view.js
  cards/<id>/data/         # 数据文件（agent 自由写入）
  cards/<id>/...           # 其它任何代码
```

发布前 `card_finish` 会跑静态门禁：裸色值、外链资源、小于 11px 字号、直接 `fetch`、`window.open`、JS 语法错误都会被打回。

## 开发

```bash
npm install
npm run build        # src/client/ → client.js（esbuild，react 由宿主注入）
npm test             # 217 条测试
npm run harness      # 可选：普通浏览器里的拖拽验证台
```

`client.js` 是构建产物，不要直接改；改 `src/client/`。Host 代码在 `host/`。

## 兼容性

- DSH `>=0.2.2-rc.3 <0.3.0-0`
- 已验证：macOS desktop profile，DSH `0.2.2-rc.3`

## License

MIT
