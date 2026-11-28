<div align="center">

# Little Widgets

**说一句话，桌面上就多一张会自己更新的小卡片。**

一个 DeepSeek Harness（DSH）插件 · `dsh-little-widgets`

**中文** · [English](https://github.com/Howell5/dsh-little-widgets/blob/main/README.en.md)

<img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/demo.gif" alt="演示：输入一句话，新建一张植物浇水卡片" width="760">

<sub>演示：板面上的卡片是真实插件代码和真实数据；新卡的生成过程为示意，已加速。</sub>

</div>

## 这是什么

在 DSH 里让 agent 查完天气、看完服务状态、算完汇率，结果就沉到聊天记录里了，下次还得再问一遍。

Little Widgets 在 DSH 左侧加一个「**小组件**」页：一面可以拖拽的卡片墙。每张卡片都是你**用一句话描述出来的**，agent 在这张卡自己的会话里写好取数代码和界面，之后它会**按你定的频率自己刷新**。打开 DSH 看一眼，今天该知道的事都在上面。

<img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/board.png" alt="Little Widgets 板面：天气、世界时钟、待办、汇率、服务商状态、植物浇水" width="100%">

## 能拿它做什么

新建卡片时有 32 个现成模板，点一下就填好描述；也可以完全用自己的话写。

| 分类 | 模板举例 | 你也可以这样说 |
|---|---|---|
| **今天** | 天气 · 今天穿什么、未来 7 天带伞、世界时钟 | 「上海天气，告诉我今天穿什么」 |
| **工作** | 服务健康、本机资源、Docker 容器、Git 未提交 / 未推送、待办清单 | 「盯着我本机 3000 和 8080 两个服务，挂了标红」 |
| **钱** | 美元汇率、自选股、全球指数、黄金 · 白银 | 「看我的自选股，列表 + 近 7 日走势」 |
| **信息** | Hacker News、arXiv 新论文、订阅更新、GitHub 今日热门 | 「每天 10 点给我 arXiv 上 agent 相关的新论文」 |
| **生活** | 植物浇水、倒垃圾日、旅行倒计时、NBA 比分、月相 | 「我家有龟背竹、绿萝和多肉，提醒我哪盆该浇水了」 |
| **数字资产** | 域名 · 证书到期、DNS 变更监控、服务商状态 | 「我这几个域名的证书还有几天过期」 |

越是那些**没人会专门做成 App 的小事**，越适合做成一张卡。

<img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/cards.png" alt="三张卡片特写：天气、待办、植物浇水" width="100%">

## 三步用起来

<table>
<tr>
<td width="46%"><img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/templates.png" alt="新建卡片：按分类挑模板，选更新频率"></td>
<td>

**1. 说你想看什么**
点板面右上角的 **＋**，按分类挑一个模板，或者直接用自己的话写。

**2. 选多久更新一次**
30 秒、5 分钟、1 小时、每天固定时刻，或者不自动更新。点「创建」，agent 在后台把卡片做出来，做好了它自己出现在板上。

**3. 不满意就再说一句**
点卡片上的 ✎ 进入它的会话，说「只看港股」「再加个 7 天走势」就改好了。拖标题换位置，拖右下角改大小。

</td>
</tr>
</table>

## 安装

```bash
dsh plugin --profile desktop add dsh-little-widgets
```

要求 DSH `>=0.2.2-rc.3`。装完重启一次 DSH，左侧出现「小组件」。

> 插件原名 **Open Desktop**（`dsh-open-desktop`）。从旧包升级：
> `dsh plugin --profile desktop remove dsh-open-desktop && dsh plugin --profile desktop add dsh-little-widgets`
> 卡片和会话都不用动：只有旧目录 `~/.dsh/open-desktop/` 时插件会继续用它，旧的「Open-Desktop」工作区会自动改名为「Little-Widgets」。

## 为什么是卡片，不是 dashboard

- **数据是真的**：每张卡都标着数据多久前更新、是否取数失败，不会拿一张旧截图假装是实时的。取数失败时显示上次成功的数据并标「数据陈旧」。
- **每张卡各管各的**：刷新频率、数据来源、界面都属于这张卡自己，一张坏了不影响别的。
- **能交互**：待办可以勾选、增删、双击编辑；自选股、仓库、服务这类卡点一行就能进详情，状态重启后还在。
- **能慢慢长**：卡片背后是一个完整的工作目录，今天只是一个数字，明天可以让 agent 加图表、加提醒。

## 它是怎么工作的

每张卡片 = 一条 DSH 会话 + 一个工作目录：

```
~/.dsh/little-widgets/cards/<id>/
  card.json     标题、尺寸、顺序、刷新方式
  view/         卡片界面：index.html + style.css + view.js（沙箱 iframe 里渲染）
  data/         数据文件
  ...           agent 写的取数脚本、服务等任何代码
```

刷新方式有四种，可以组合：内置模板、本机命令（`command`）、读文件（`file`）、请求接口（`url`），间隔从 5 秒到 7 天，或每天固定时刻。

卡片发布前会跑一遍静态检查：写死的颜色、外链资源、小于 11px 的字号、直接 `fetch`、`window.open`、JS 语法错误都会被打回，保证每张卡长得像一家人。

## 权限与安全

- 卡片的取数命令是**你让 agent 写进那张卡的 `card.json`** 的，插件本身不预置、不执行任何命令。
- 没有遥测、没有统计上报、没有默认外联。
- 卡片的网络请求走宿主代理，受 CSP 和每张卡自己的白名单约束；`view/` 里不能直连网络、不能加载外链资源。
- 插件注册的 HTTP 路由（`/little-widgets/api` 等）经过 DSH 的准入检查，并拒绝跨站请求：浏览器带来的 `Sec-Fetch-Site` 不是 `same-origin` / `none` 一律 403。
- 卡片想保存交互状态时，只能写自己目录下的 `data/state.json`（JSON，≤64KB），宿主不暴露任意路径。

## 开发

```bash
npm install
npm run build        # src/client/ → client.js（esbuild，react 由宿主注入）
npm test
npm run harness      # 可选：普通浏览器里的拖拽验证台
```

`client.js` 是构建产物，不要直接改；改 `src/client/`。Host 代码在 `host/`，Host ⇄ Client 契约见 [CONTRACT.md](CONTRACT.md)。

## 兼容性

- DSH `>=0.2.2-rc.3 <0.3.0-0`
- 已验证：macOS desktop profile
- 目前界面只有中文

## License

MIT
