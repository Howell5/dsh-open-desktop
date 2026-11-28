// Little Widgets v3 · 卡片会话事件 → Turn 视图
//
// 复用 v2 已验证的折叠与「人话化」逻辑：Session 事件（turn/step/user/assistant/tool）
// 折叠成 Turn → Step →（正文 + 工具卡片），历史摘要里的裸 id / 英文 key 也会被清洗。
// 与 v3 的唯一耦合点是「卡片信息」：由调用方传入 card，不依赖旧 runtime。
import { SIZE_PRESETS, normalizeSize } from './paths.js'
import { TEMPLATE_LIST } from './templates.js'

const TOOL_VERBS = {
  card_read: '读取卡片',
  card_update: '修改卡片',
  card_set_refresh: '设置刷新',
  card_refresh: '刷新数据',
  card_finish: '完成卡片',
  card_remove: '删除卡片',
  card_open_folder: '查看卡片目录',
  bash: '执行命令',
  read: '读文件',
  write: '写文件',
  edit: '改文件',
  glob: '查文件',
  grep: '搜索内容',
  web_search: '搜索网页',
  web_fetch: '抓取网页',
  ask_user_question: '询问用户',
  skill: '读取技能',
  subagent: '派子任务',
  spawn_teammate: '派队友',
}

const rendererLabel = () => '前端视图'

const textOf = (content) => {
  if (!Array.isArray(content)) return ''
  const parts = []
  for (const block of content) {
    if (block && block.type === 'text' && typeof block.text === 'string') parts.push(block.text)
  }
  return parts.join('\n').trim()
}

const preview = (text, max = 400) => {
  const clean = String(text ?? '').trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

function parseLooseJson(raw) {
  const text = String(raw ?? '').trim()
  if (text === '') return null
  const candidates = [text]
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first >= 0 && last > first) candidates.push(text.slice(first, last + 1))
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
    } catch {
      // 试下一个
    }
  }
  return null
}

const shortId = (id) => String(id ?? '').slice(0, 12)

// 模板字段英文 key → 中文标签（历史摘要里可能残留英文 key）
const FIELD_LABELS = (() => {
  const labels = {}
  for (const template of TEMPLATE_LIST) {
    for (const field of Array.isArray(template.fields) ? template.fields : []) {
      if (field && typeof field.name === 'string') labels[field.name] = field.label || field.name
    }
  }
  return labels
})()

const humanizeFieldKeys = (text) => String(text ?? '').replace(
  /\b(coins|cities|zones|label|url|ids)\b(?=\s|：|:)/g,
  (key) => FIELD_LABELS[key] || key,
)

/** 把工具摘要里的人话再修一遍：裸 id 换成卡片标题，JSON blob 换成「字段：值」。 */
export function humanizeArgs(text, widgets) {
  let out = String(text ?? '')
  if (out === '') return out
  out = humanizeFieldKeys(out)
  const list = Array.isArray(widgets) ? widgets : []
  const findWidget = (id) => list.find((widget) => widget.id === id) || null
  const idMatch = out.match(/w_[a-z0-9]{6,}/)
  const widget = idMatch !== null ? findWidget(idMatch[0]) : null
  const fieldLabels = {}
  const template = widget !== null ? TEMPLATE_LIST.find((item) => item.id === widget.template) : null
  if (template && Array.isArray(template.fields)) {
    for (const field of template.fields) {
      if (field && typeof field.name === 'string') fieldLabels[field.name] = field.label || field.name
    }
  }
  out = out.replace(/^\{[\s\S]*\}$/, (raw) => {
    try {
      const parsed = JSON.parse(raw)
      if (parsed === null || typeof parsed !== 'object') return raw
      const pairs = Object.keys(parsed).map((key) => {
        const label = fieldLabels[key] || key
        const value = parsed[key]
        const shown = value === null || value === undefined ? '' : String(value)
        return label + '：' + (shown.length > 24 ? shown.slice(0, 24) + '…' : shown)
      })
      return pairs.join(' · ')
    } catch {
      return ''
    }
  })
  out = out.replace(/w_[a-z0-9]{6,}/g, (id) => {
    const found = findWidget(id)
    return found !== null ? '「' + found.title + '」' : '（已删除的卡片）'
  })
  out = out.replace(/模板 (crypto|news|clock|probe)/g, (whole, id) => {
    const found = TEMPLATE_LIST.find((item) => item.id === id)
    return found ? '模板 ' + found.title : whole
  })
  return out
    .replace(/卡片\s+（已删除的卡片）/g, '（已删除的卡片）')
    .replace(/\s*·\s*·\s*/g, ' · ')
    .replace(/^\s*·\s*/, '')
    .trim()
}
const sizeText = (size) => {
  if (typeof size === 'string' && SIZE_PRESETS[size]) return SIZE_PRESETS[size].w + '×' + SIZE_PRESETS[size].h
  const normalized = normalizeSize(size, SIZE_PRESETS.M)
  return normalized.w + '×' + normalized.h
}
const viewText = (view) => {
  if (view === undefined || view === null) return ''
  if (typeof view === 'string') return rendererLabel(view)
  if (typeof view === 'object' && typeof view.kind === 'string') return rendererLabel(view.kind)
  return ''
}

const clipText = (text, max) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max) + '…' : clean
}

const firstText = (args, keys) => {
  for (const key of keys) {
    const value = args?.[key]
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
  }
  return ''
}

const everyText = (ms) => {
  const value = Number(ms)
  if (!Number.isFinite(value) || value <= 0) return ''
  if (value < 60000) return Math.max(1, Math.round(value / 1000)) + ' 秒'
  if (value < 3600000) return Math.round(value / 60000) + ' 分钟'
  return Math.round(value / 3600000) + ' 小时'
}

/** `/usr/bin/python3 /x/gh_activity.py` → `python3 gh_activity.py` */
const commandBrief = (command) => {
  const parts = String(command ?? '').trim().split(/\s+/).filter((part) => part !== '')
  return parts.map((part) => (part.includes('/') ? part.split('/').filter((item) => item !== '').pop() ?? part : part)).join(' ')
}

/** 刷新约定 → 人话（「每 15 分钟 · 命令 gh_activity.py」）。 */
const refreshText = (spec) => {
  if (spec === undefined || spec === null || typeof spec !== 'object') return ''
  const parts = []
  if (typeof spec.everyMs === 'number' && spec.everyMs > 0) parts.push('每 ' + everyText(spec.everyMs))
  if (typeof spec.template === 'string' && spec.template !== '') {
    const found = TEMPLATE_LIST.find((item) => item.id === spec.template)
    parts.push('模板 ' + (found ? found.title : spec.template))
  }
  if (typeof spec.command === 'string' && spec.command.trim() !== '') parts.push('命令 ' + clipText(commandBrief(spec.command), 48))
  if (typeof spec.file === 'string' && spec.file.trim() !== '') parts.push('文件 ' + clipText(spec.file, 40))
  if (typeof spec.url === 'string' && spec.url.trim() !== '') parts.push('接口 ' + clipText(spec.url, 48))
  return parts.join(' · ')
}

/** 卡片配置 → 人话（标题 / 尺寸 / 渲染器 / 刷新）。 */
const cardBrief = (card) => {
  if (card === undefined || card === null || typeof card !== 'object') return ''
  const parts = []
  if (typeof card.title === 'string' && card.title !== '') parts.push('标题 ' + card.title)
  if (card.size !== undefined) parts.push('尺寸 ' + sizeText(card.size))
  const view = viewText(card.view)
  if (view !== '') parts.push(view)
  const refresh = refreshText(card.refresh)
  if (refresh !== '') parts.push(refresh)
  return parts.join(' · ')
}

/** 去掉 `cd xxx &&` 之类的前缀，只留真正执行的命令。 */
const stripShellPrefix = (command) => {
  let text = String(command ?? '').trim()
  for (let guard = 0; guard < 3; guard += 1) {
    const match = text.match(/^cd\s+[^\s&]+\s*&&\s*/)
    if (match === null) break
    text = text.slice(match[0].length)
  }
  return text
}

function summarizeArgs(name, raw) {
  const args = parseLooseJson(raw)
  if (args === null) return ''
  const parts = []
  if (name === 'board_add') {
    if (typeof args.template === 'string') parts.push('模板 ' + args.template)
    if (typeof args.title === 'string') parts.push('标题 ' + args.title)
    if (args.size !== undefined) parts.push('尺寸 ' + sizeText(args.size))
    if (args.view !== undefined) parts.push(viewText(args.view))
  } else if (name === 'board_update') {
    // 动词已经说明动作，摘要里不必再重复「卡片」（humanize 会把 id 换成「标题」）
    if (typeof args.id === 'string') parts.push(shortId(args.id))
    if (typeof args.title === 'string') parts.push('标题 ' + args.title)
    if (args.size !== undefined) parts.push('尺寸 ' + sizeText(args.size))
    if (args.values && typeof args.values === 'object') parts.push(JSON.stringify(args.values))
    if (args.view !== undefined) parts.push(viewText(args.view))
  } else if (name === 'board_remove') {
    if (typeof args.id === 'string') parts.push(shortId(args.id))
  } else if (name === 'board_refresh') {
    parts.push(typeof args.id === 'string' ? shortId(args.id) : '全部')
  } else if (name === 'card_update') {
    if (typeof args.title === 'string' && args.title !== '') parts.push('标题 ' + args.title)
    if (args.size !== undefined) parts.push('尺寸 ' + sizeText(args.size))
    const view = viewText(args.view)
    if (view !== '') parts.push(view)
    if (Number.isFinite(args.order)) parts.push('顺序 ' + args.order)
  } else if (name === 'card_set_refresh') {
    const refresh = refreshText(args)
    if (refresh !== '') parts.push(refresh)
  } else if (name === 'card_finish') {
    if (typeof args.title === 'string' && args.title !== '') parts.push('标题 ' + args.title)
    if (args.size !== undefined) parts.push('尺寸 ' + sizeText(args.size))
  } else if (name === 'bash' || name === 'pwsh' || name === 'exec_command') {
    const command = stripShellPrefix(firstText(args, ['command', 'cmd', 'script']))
    const detail = command !== '' ? command : firstText(args, ['description', 'summary'])
    if (detail !== '') parts.push(clipText(detail, 90))
  } else if (name === 'write_stdin') {
    const input = firstText(args, ['input', 'text'])
    if (input !== '') parts.push(clipText(input, 60))
  } else if (name === 'read' || name === 'write' || name === 'edit' || name === 'apply_patch') {
    const file = firstText(args, ['file_path', 'path', 'file', 'filename', 'target'])
    if (file !== '') parts.push(clipText(file, 70))
  } else if (name === 'glob' || name === 'grep' || name === 'search') {
    const pattern = firstText(args, ['pattern', 'query', 'q', 'glob'])
    if (pattern !== '') parts.push(clipText(pattern, 50))
    const at = firstText(args, ['path', 'cwd', 'directory'])
    if (at !== '') parts.push('于 ' + clipText(at, 36))
  } else if (name === 'web_search') {
    const query = firstText(args, ['query', 'q'])
    if (query !== '') parts.push(clipText(query, 60))
  } else if (name === 'web_fetch') {
    const url = firstText(args, ['url', 'href'])
    if (url !== '') parts.push(clipText(url, 60))
  } else if (name === 'ask_user_question') {
    const question = firstText(args, ['question', 'text', 'prompt'])
    if (question !== '') parts.push(clipText(question, 60))
  } else if (name === 'skill') {
    const skill = firstText(args, ['name', 'skill'])
    if (skill !== '') parts.push(clipText(skill, 40))
  } else {
    // 兜底：参数里第一个像人话的字符串，别让工具行只剩一个动词
    const generic = firstText(args, ['description', 'summary', 'query', 'command', 'path', 'file_path', 'name', 'title', 'text', 'url'])
    if (generic !== '') parts.push(clipText(generic, 60))
  }
  return parts.filter((part) => part !== '').join(' · ').slice(0, 140)
}


function summarizeResult(name, raw, failed) {
  if (failed) {
    const text = String(raw ?? '').replace(/\s+/g, ' ').trim()
    if (/ASK_ABORTED|aborted/i.test(text)) return '已中止'
    return '失败：' + (text === '' ? '未知原因' : text.slice(0, 100))
  }
  const value = parseLooseJson(raw)
  if (value !== null) {
    // applyRemove 同时返回 applied 与 removed，先判 removed 才能显示被删卡片标题
    if (typeof value.removed === 'string') return '已删除「' + value.removed + '」'
    if (name === 'card_read') {
      const brief = cardBrief(value.card)
      if (brief !== '') return brief
    }
    if (name === 'card_update' || name === 'card_finish') {
      const brief = cardBrief(value.card)
      if (brief !== '') return (name === 'card_finish' ? '已上板 · ' : '已更新 · ') + brief
    }
    if (name === 'card_set_refresh') {
      const brief = refreshText(value.refresh)
      return brief === '' ? '已设置刷新' : '已设置刷新 · ' + brief
    }
    if (name === 'card_refresh' && value.refreshed === true) return '已刷新'
    if (name === 'card_open_folder' && typeof value.dir === 'string') return clipText(value.dir, 90)
    if (value.applied === true) {
      const diff = Array.isArray(value.diff)
        ? value.diff.map((item) => {
          const field = String(item.field ?? '')
          const from = field === '渲染器' ? rendererLabel(item.from) : String(item.from ?? '空')
          const to = field === '渲染器' ? rendererLabel(item.to) : String(item.to ?? '空')
          return field + ' ' + from + ' → ' + to
        }).join(' · ')
        : ''
      return diff === '' ? '已生效' : '已生效 · ' + diff
    }
    if (typeof value.undone === 'string') return '已撤销：' + value.undone
    if (name === 'board_design' && typeof value.guide === 'string') return '已读取设计规范'
    if (typeof value.refreshed === 'string') return '已刷新'
    if (Array.isArray(value.widgets)) return '板上 ' + value.widgets.length + ' 张卡片'
    if (typeof value.summary === 'string') return value.summary
  }
  return String(raw ?? '').replace(/\s+/g, ' ').slice(0, 120)
}


/** 把 Session 事件折叠成 Turn → Step →（assistant 正文 + 工具卡片）。纯函数，便于单测。 */
export function foldTurns(events) {
  const built = []
  const byTurn = new Map()
  let current = null
  const ensureTurn = (turnNo, at) => {
    const key = Number.isFinite(turnNo) ? turnNo : (current ? current.turn : built.length + 1)
    if (byTurn.has(key)) return byTurn.get(key)
    const turn = { turn: key, user: { text: '', at: at ?? Date.now() }, steps: [], ended: null, at: at ?? Date.now() }
    built.push(turn)
    byTurn.set(key, turn)
    return turn
  }
  const ensureStep = (turn, stepNo) => {
    const key = Number.isFinite(stepNo) ? stepNo : turn.steps.length + 1
    let step = turn.steps.find((item) => item.step === key)
    if (!step) {
      step = { step: key, assistant: { text: '' }, tools: [] }
      turn.steps.push(step)
    }
    return step
  }
  const addTool = (step, call) => {
    if (!call || typeof call.callId !== 'string') return null
    const existing = step.tools.find((tool) => tool.callId === call.callId)
    if (existing) return existing
    const tool = {
      callId: call.callId,
      name: String(call.name ?? ''),
      verb: TOOL_VERBS[String(call.name ?? '')] ?? '执行操作',
      status: 'running',
      argsSummary: summarizeArgs(String(call.name ?? ''), call.argsRaw),
      resultSummary: '',
      at: Number.isFinite(call.at) ? call.at : null,
      doneAt: null,
      durationMs: null,
    }
    step.tools.push(tool)
    return tool
  }

  for (const event of Array.isArray(events) ? events : []) {
    const type = event?.type
    const data = event?.data && typeof event.data === 'object' ? event.data : {}
    if (type === 'turn/start') {
      current = ensureTurn(data.turn, event.time)
      current.ended = null
    } else if (type === 'user/message') {
      const turn = ensureTurn(data.turn ?? current?.turn, event.time)
      current = turn
      // DSH 会把运行时上下文（time-context 等）也作为 user/message 注入，
      // 只有 source.kind === 'user' 才是用户真正说的话。
      const sourceKind = typeof data.source?.kind === 'string' ? data.source.kind : 'user'
      const text = textOf(data.message?.content) || textOf(data.content)
      if (sourceKind === 'user' && text !== '') {
        turn.user = { text: turn.user.text === '' ? text : turn.user.text + '\n' + text, at: event.time ?? Date.now() }
      }
    } else if (type === 'step/start') {
      if (current) ensureStep(current, data.step)
    } else if (type === 'assistant/message') {
      const turn = ensureTurn(data.turn ?? current?.turn, event.time)
      current = turn
      const step = ensureStep(turn, data.step)
      const text = textOf(data.message?.content) || textOf(data.content)
      if (text !== '') step.assistant.text = step.assistant.text === '' ? text : step.assistant.text + '\n\n' + text
      const content = Array.isArray(data.message?.content) ? data.message.content : (Array.isArray(data.content) ? data.content : [])
      for (const block of content) {
        if (block && block.type === 'tool-call') addTool(step, { callId: block.id, name: block.name, argsRaw: block.arguments, at: event.time })
      }
    } else if (type === 'tool/call') {
      const turn = ensureTurn(data.turn ?? current?.turn, event.time)
      current = turn
      const step = ensureStep(turn, data.step)
      addTool(step, { callId: data.callId, name: data.name, argsRaw: data.arguments, at: event.time })
    } else if (type === 'tool/result') {
      if (current === null) continue
      const callId = data.message?.toolCallId ?? data.callId
      const step = data.step !== undefined ? ensureStep(current, data.step) : null
      const pools = step !== null ? [step] : current.steps
      for (const pool of pools) {
        const tool = pool.tools.find((item) => item.callId === callId)
        if (tool) {
          const resultText = textOf(data.message?.content) || textOf(data.content)
          // 工具可能把失败写在文本里（例如受限工具返回 Error: ...），不能只看 data.error
          const failed = (data.error !== undefined && data.error !== null)
            || /^\s*(Error[:：]|错误[:：]|失败|拒绝|不可用)/.test(resultText)
          tool.status = failed ? 'error' : 'ok'
          tool.doneAt = Number.isFinite(event.time) ? event.time : null
          if (Number.isFinite(tool.at) && Number.isFinite(tool.doneAt)) {
            tool.durationMs = Math.max(0, tool.doneAt - tool.at)
          }
          tool.resultSummary = summarizeResult(tool.name, failed ? (data.error?.message ?? data.error?.code ?? resultText) : resultText, failed)
          // 记住当时板面上的卡片标题/模板，历史回合的摘要因此不会因为卡片后来被删而丢名字
          if (tool.name === 'board_list' || tool.name === 'board_add') {
            const value = parseLooseJson(resultText)
            if (value !== null && Array.isArray(value.widgets)) {
              tool.catalog = value.widgets
                .filter((item) => item && typeof item.id === 'string')
                .map((item) => ({ id: item.id, title: String(item.title ?? ''), template: String(item.template ?? '') }))
            } else if (value !== null && typeof value.id === 'string' && typeof value.title === 'string') {
              tool.catalog = [{ id: value.id, title: value.title, template: '' }]
            }
          }
          break
        }
      }
    } else if (type === 'turn/end') {
      if (current) {
        current.ended = data.reason?.kind ?? 'completed'
        current.endedAt = Number.isFinite(event.time) ? event.time : null
        if (Number.isFinite(current.at) && Number.isFinite(current.endedAt)) {
          current.durationMs = Math.max(0, current.endedAt - current.at)
        }
      }
    }
  }
  built.sort((a, b) => a.turn - b.turn)
  for (const turn of built) turn.steps.sort((a, b) => a.step - b.step)
  return built
}

/** 卡片会话：把持久化事件折叠成前端需要的 Turn 视图。 */
export function cardTurns(events, card) {
  const turns = foldTurns(Array.isArray(events) ? events : [])
  const widgets = card === undefined || card === null
    ? []
    : [{ id: card.id, title: card.title, template: card.collector?.template ?? '', values: {} }]
  for (const turn of turns) {
    for (const step of turn.steps) {
      step.assistant.text = String(step.assistant.text ?? '')
        .replace(/\b[wdt]_[a-z0-9]{6,}\b/g, '')
        .replace(/`\s*`/g, '')
        .replace(/（\s*）/g, '')
        .replace(/[ \t]{2,}/g, ' ')
        .trim()
      for (const tool of step.tools) {
        tool.argsSummary = humanizeArgs(tool.argsSummary, widgets)
        tool.resultSummary = humanizeArgs(tool.resultSummary, widgets)
      }
    }
  }
  const last = turns.length > 0 ? turns[turns.length - 1] : null
  return {
    turns,
    busy: last !== null && last.ended === null,
  }
}
