# 这张卡片的视图

卡片内容只有一种形式：这里的**前端代码**。宿主把它放进沙箱 iframe 渲染，
并先注入一套设计系统（`window.od` + `od-*` 类 + `--od-*` token）。

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 视图的 DOM 骨架 |
| `style.css` | 这张卡自己的样式，只写布局/结构 |
| `view.js` | 渲染逻辑；默认视图会按数据形状自动排版 |
| `README.md` | 本说明 |

## 数据接口

```js
window.dshWidget.data          // 当前取数结果（任意 JSON）
window.dshWidget.onData = fn   // 每次刷新时调用 fn(value)
window.dshWidget.tokens        // 宿主主题 token
window.dshWidget.size          // { w, h } 卡片网格尺寸
window.dshWidget.fetch(url)    // 走宿主代理请求 http(s)，返回 Promise
window.dshWidget.save(value)   // 交互卡写回自己的 data/state.json（JSON，≤64KB）
```

- 不要在卡片里直接 `fetch()` / `XMLHttpRequest`：CSP 会拦掉，用 `dshWidget.fetch`。
- 待办、清单这类要增删改的卡：用 `dshWidget.save(value)` 写回，`card_set_refresh` 配 `file="data/state.json"`；不要用 `localStorage`（沙箱不允许）。
- 不要用 `window.open`：链接写成 `<a href="https://…">`，宿主会接管打开。
- 每次刷新只替换内容，不要重载页面。

## 命令刷新：只用绝对路径

`command` 的每一段都写绝对路径：

```
/usr/bin/python3 /Users/you/.dsh/open-desktop/cards/<id>/collect.py
```

不要写 `python3 collect.py`——它依赖 `PATH` 和当前工作目录。宿主一升级，`PATH` 里的解释器就可能换掉（Homebrew 的 3.14 和系统的 3.9 行为不一样），卡片会突然报「命令失败」，而且看不出原因。

## 设计系统

最常用的类（完整定义见宿主注入的 `theme.css`）：

| 类 | 用途 |
|---|---|
| `od-view` | 视图根容器（默认视图已经用了） |
| `od-hero` / `od-metric-label` / `od-metric-value` | 顶部大指标 |
| `od-delta-pill` | 涨跌胶囊；`data-tone="up\|down\|warn"` |
| `od-rows` / `od-row` / `od-row-label` / `od-row-value` / `od-row-sub` | 列表行 |
| `od-rank` | 行首序号 |
| `od-list-head` / `od-list-count` | 列表头 |
| `od-table-head` / `od-table-row` / `od-th` / `od-td` | 表格 |
| `od-status-rows` / `od-status-row` / `od-status-dot` | 状态列表 |
| `od-badge` / `od-chip` | 徽章 / 胶囊标签 |
| `od-range` | 切片切换（1D / 1W / 1M / 1Y…）；`aria-pressed="true"` 是当前档 |
| `od-back` | 从详情层返回总览层 |
| `od-empty` / `od-skel` | 空态 / 骨架屏 |
| `od-up` / `od-down` / `od-warn` | 语义色 |
| `od-mono` / `od-num` / `od-label` / `od-muted` | 排版辅助 |

辅助函数（`window.od`）：

```js
od.el(tag, className, text)        // 创建元素
od.row(item, { rank })             // 列表行（item: {label,value,delta,sub,href,tone}）
od.hero({ label, value, delta, tone })
od.statusRow({ label, value, sub, state })
od.fitRows(container, items, renderRow)  // 放不下时自动截断 + 「还有 N 项」
od.textBlock(text)                 // 自动按高度裁行的长文本
od.sparkline(values, { tone })     // 内联 SVG 走势
od.formatNumber(value, digits)
od.formatPercent(value, digits)
od.empty(message, hint)
```

## 两层视图：总览 ⇄ 详情

常驻卡片最多两层，不要跳到网页或新窗口：

1. **总览**：一张卡能一眼看完的摘要（列表 / 指标 / 走势）。
2. **详情**：点某一行进入，卡片原地换成该项的细节 + 一个 `od-back` 返回。

```html
<button class="od-back" id="back">‹ 自选</button>
<div class="od-range" id="range"><button data-r="1D" aria-pressed="true">1D</button>…</div>
```

```js
// 交互后立刻写回；Host 是浅合并，多个状态键互不覆盖
window.dshWidget.save({ focus: 'NVDA', range: '1M' });
```

**让刷新不跳回总览**：采集器读一次 `data/state.json`，把内容放进取数结果的
`saved` 字段；视图启动时只应用一次。这样重启 DSH 后还停在你上次看的那只票上。

**切时间窗要瞬时**：把 1D / 1W / 1M / 1Y 的序列一次性取回来（长跨度可以按周 / 月聚合），
在视图里切片；不要每切一次就发请求。

## 硬规则（宿主 lint 会检查）

1. 颜色、字号、间距来自 `--od-*` token；**不要写死颜色**（`#fff`、`rgb(...)`）。
2. 字号不小于 11px（`--od-text-xs`）。
3. 不加载外链资源：`<script src>`、`<link>`、`url(https://…)`、`@import` 都会被拦。
4. 内容必须放得下：不要依赖滚动条；用 `od.fitRows` 或自己按高度截断。
5. 视图总大小不超过 200KB。

改完可以调用 `card_check` 自检；`card_finish` 会自动跑同样的检查，出错会被打回。

## 最省事的做法

大多数卡片只需要：

1. 在卡片目录写取数脚本，用 `card_set_refresh` 告诉 Host 怎么刷新；
2. 保留默认的 `view/`，让默认视图按数据形状渲染；
3. 只有默认排版不够用时，才改 `view/style.css` 或 `view.js`。
