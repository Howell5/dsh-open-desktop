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
