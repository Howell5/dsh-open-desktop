// Little Widgets · 卡片会话里的 card_* 工具
//
// 只负责修改卡片配置（标题/尺寸/刷新方式/完成/删除/目录）。
// 数据怎么取、页面怎么渲染，都由 agent 在卡片目录里写代码决定。
import { normalizeRefresh, normalizeSize } from './paths.js'
import { TEMPLATE_LIST } from './templates.js'
import { readViewSync } from './views.js'
import { lintView } from './view-lint.js'

const text = (value) => [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }]
const TEMPLATE_IDS = TEMPLATE_LIST.map((item) => item.id)

export function createCardTools({ ctx, paths, cards, refresh, sessionId, cardId = sessionId }) {
  const guard = (exec) => {
    const agentId = exec?.agent?.id
    if (agentId !== undefined && String(agentId) !== String(sessionId)) {
      throw Object.assign(new Error('card_* 工具只能操作它所属的卡片'), { code: 'wrong-card' })
    }
  }
  const requireCard = () => {
    const card = cards.get(cardId)
    if (card === null) throw Object.assign(new Error('这张卡片的 card.json 不存在'), { code: 'card-missing' })
    return card
  }
  const touch = (fields) => cards.patch(cardId, fields)

  return [
    {
      name: 'card_read',
      description: '读取这张卡片当前的 card.json 与最近一次数据。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        const files = readViewSync(paths, cardId)
        return {
          card: requireCard(),
          data: refresh?.snapshot?.().data?.[cardId] ?? null,
          view: {
            missing: files.html.trim() === '',
            html: files.html.slice(0, 8000),
            css: files.css.slice(0, 8000),
            js: files.js.slice(0, 16000),
          },
        }
      },
    },
    {
      name: 'card_update',
      description: '修改卡片标题 / 尺寸 {w,h} / 顺序。尺寸 3..12（12 列网格）。卡片内容由 view/ 下的前端代码渲染。',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          size: { type: 'object', properties: { w: { type: 'integer' }, h: { type: 'integer' } }, required: ['w', 'h'] },
          order: { type: 'integer' },
        },
        additionalProperties: false,
      },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        const card = requireCard()
        const fields = {}
        if (typeof args?.title === 'string' && args.title.trim() !== '') fields.title = args.title.trim().slice(0, 60)
        if (args?.size !== undefined) fields.size = normalizeSize(args.size)
        if (args?.order !== undefined && Number.isFinite(args.order)) fields.order = Math.max(0, Math.round(args.order))
        if (Object.keys(fields).length === 0) throw Object.assign(new Error('没有要修改的字段'), { code: 'empty-update' })
        const next = await touch(fields)
        try { refresh?.sync(cards.list()) } catch { /* 忽略 */ }
        return { card: next, previousTitle: card.title }
      },
    },
    {
      name: 'card_set_refresh',
      description: '告诉 Host 如何刷新这张卡片的数据。四种方式（可只给一种）：template 内置模板（crypto/news/clock/wifi/script）；command 在卡片目录执行命令（stdout 当数据）；file 读卡片目录下 JSON 文件；url 请求接口（返回 JSON）。everyMs 控制间隔（毫秒，最长 7 天）；dailyAt 用 "HH:MM" 指定每天固定时刻，优先于 everyMs。',
      parameters: {
        type: 'object',
        properties: {
          everyMs: { type: 'integer' },
          dailyAt: { type: 'string' },
          template: { type: 'string', enum: TEMPLATE_IDS },
          params: { type: 'object' },
          command: { type: 'string' },
          file: { type: 'string' },
          url: { type: 'string' },
        },
        additionalProperties: false,
      },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        requireCard()
        const spec = normalizeRefresh(args)
        if (Object.keys(spec).length === 0) throw Object.assign(new Error('需要提供 template/command/file/url 之一'), { code: 'empty-refresh' })
        await touch({ refresh: spec })
        try { refresh?.sync(cards.list()) } catch { /* 忽略 */ }
        return { refresh: spec }
      },
    },
    {
      name: 'card_refresh',
      description: '立即刷新这张卡片的数据。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        requireCard()
        try { refresh?.refresh([cards.get(cardId)]) } catch { /* 忽略 */ }
        return { refreshed: true }
      },
    },
    {
      name: 'card_check',
      description: '检查 view/ 里的前端代码：写死颜色、外链资源、小于 11px 字号、语法错误、内部滚动等。返回 errors / warnings。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        requireCard()
        const lint = lintView(readViewSync(paths, cardId))
        return { ok: lint.ok, errors: lint.errors, warnings: lint.warnings }
      },
    },
    {
      name: 'card_finish',
      description: '完成卡片并放上板面（解除构建中状态）。会先检查 view/ 里的前端代码，有硬错误会返回给 Agent 修改。',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          size: { type: 'object', properties: { w: { type: 'integer' }, h: { type: 'integer' } }, required: ['w', 'h'] },
        },
        additionalProperties: false,
      },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        requireCard()
        const lint = lintView(readViewSync(paths, cardId))
        if (!lint.ok) {
          const lines = lint.errors.map((item) => '· ' + item.message).join('\n')
          throw Object.assign(new Error(`视图没有通过检查，先改 view/ 里的代码：\n${lines}`), {
            code: 'view-lint',
            issues: lint.errors,
          })
        }
        const fields = { building: false, viewWarnings: lint.warnings.map((item) => item.message) }
        if (typeof args?.title === 'string' && args.title.trim() !== '') fields.title = args.title.trim().slice(0, 60)
        if (args?.size !== undefined) fields.size = normalizeSize(args.size)
        const next = await touch(fields)
        try { refresh?.sync(cards.list()) } catch { /* 忽略 */ }
        return { finished: true, card: next, warnings: lint.warnings }
      },
    },
    {
      name: 'card_remove',
      description: '删除这张卡片（目录进回收站，7 天后清理）。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        const card = requireCard()
        await cards.remove(cardId)
        try { refresh?.sync(cards.list()) } catch { /* 忽略 */ }
        return { removed: card.title }
      },
    },
    {
      name: 'card_open_folder',
      description: '返回这张卡片的工作目录（数据、代码、视图都在这里）。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      output: { schema: { type: 'object' }, render: (args, value) => text(value) },
      async execute(args, exec) {
        guard(exec)
        return { dir: paths.cardDir(cardId), view: paths.viewDir(cardId), data: paths.dataDir(cardId) }
      },
    },
  ]
}
