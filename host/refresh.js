// Little Widgets · 刷新调度（薄契约）
//
// 每张卡片一个定时器。card.refresh 描述"数据怎么来"：
//   template → 内置模板取数
//   command  → 在卡片目录执行命令，stdout 当数据（JSON 或文本）
//   file     → 读卡片目录下的 JSON 文件
//   url      → 请求一个 HTTP 接口，返回 JSON
// 失败不清空旧值（显示「陈旧」而不是闪空白），错误单独上报。
import { readFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'
import { TEMPLATES } from './templates.js'
import { runCommand } from './exec.js'

const MIN_EVERY = 5000
const MAX_EVERY = 604_800_000
const DAILY_AT = /^([01]\d|2[0-3]):([0-5]\d)$/

// 距离下一次「每天 HH:MM」的毫秒数；今天已过就顺延到明天。
export const nextDailyDelay = (at, now = Date.now()) => {
  const [hour, minute] = at.split(':').map(Number)
  const next = new Date(now)
  next.setHours(hour, minute, 0, 0)
  if (next.getTime() <= now) next.setDate(next.getDate() + 1)
  return Math.max(1000, next.getTime() - now)
}

const parseValue = (raw) => {
  const text = String(raw ?? '').trim()
  if (text === '') return { text: '' }
  try { return JSON.parse(text) } catch { return { text: text.slice(0, 20_000) } }
}

export function createRefresh({ ctx, cards, inject } = {}) {
  const data = new Map()      // cardId -> DataPoint
  const timers = new Map()
  const generations = new Map()
  const signatures = new Map()
  const running = new Set()
  const templates = inject?.templates ?? TEMPLATES
  const pathOf = inject?.pathOf ?? (() => '')
  const onCommand = inject?.runCommand ?? ((command, options) => runCommand(ctx, command, options))
  const readFileImpl = inject?.readFile ?? readFile
  const fetchImpl = inject?.fetch ?? fetch
  let paused = false
  let emit = () => {}
  let started = false

  const dailyAtOf = (card) => {
    const value = card?.refresh?.dailyAt
    return typeof value === 'string' && DAILY_AT.test(value) ? value : null
  }
  // 每天固定时刻的卡片按 24h 估 TTL，避免「每天 10:00」被判成 2 分钟就陈旧。
  const everyMsOf = (card) => dailyAtOf(card) !== null
    ? 86_400_000
    : Math.max(MIN_EVERY, Math.min(MAX_EVERY, Number(card?.refresh?.everyMs) || 60_000))
  const hasProvider = (card) => {
    const spec = card?.refresh
    return !!spec && (!!spec.template || !!spec.command || !!spec.file || !!spec.url)
  }
  const sourceRefOf = (card) => {
    const spec = card?.refresh ?? {}
    if (spec.template) return `template:${spec.template}`.slice(0, 120)
    if (spec.command) return `command:${spec.command}`.slice(0, 120)
    if (spec.file) return `file:${spec.file}`.slice(0, 120)
    if (spec.url) return `url:${spec.url}`.slice(0, 120)
    return 'none'
  }
  const snapshot = () => ({ paused, data: Object.fromEntries([...data.entries()]) })

  const resolveCardFile = (cardId, file) => {
    const dir = pathOf(cardId)
    return isAbsolute(file) ? file : join(dir, file)
  }

  const pull = async (card, spec) => {
    const workspaceRoot = pathOf(card.id)
    if (spec.template) {
      const template = templates[spec.template] ?? null
      if (template === null) throw Object.assign(new Error(`没有 ${spec.template} 这个模板`), { code: 'unknown-template' })
      return template.fetch(card, {
        timeoutMs: 10_000,
        runCommand: (command, options) => onCommand(command, { workspaceRoot, timeoutMs: 10_000, ...options }),
      })
    }
    if (spec.command) {
      const output = await onCommand(spec.command, { workspaceRoot, timeoutMs: 10_000 })
      return parseValue(output)
    }
    if (spec.file) {
      const text = await readFileImpl(resolveCardFile(card.id, spec.file), 'utf8')
      return parseValue(text)
    }
    if (spec.url) {
      const response = await fetchImpl(spec.url, { signal: AbortSignal.timeout(10_000), headers: { accept: 'application/json' } })
      if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { code: 'http-status' })
      return response.json()
    }
    throw Object.assign(new Error('刷新配置为空'), { code: 'no-refresh' })
  }

  const runOne = async (card) => {
    if (paused || started === false) return
    if (running.has(card.id)) return
    if (!hasProvider(card)) {
      if (data.delete(card.id)) emit()
      return
    }
    const previous = data.get(card.id) ?? null
    const everyMs = everyMsOf(card)
    running.add(card.id)
    try {
      const value = await pull(card, card.refresh)
      data.set(card.id, { value, fetchedAt: Date.now(), ttl: everyMs * 2, sourceRef: sourceRefOf(card), error: null })
    } catch (error) {
      data.set(card.id, {
        value: previous?.value ?? null,
        fetchedAt: previous?.fetchedAt ?? 0,
        ttl: previous?.ttl ?? everyMs * 2,
        sourceRef: sourceRefOf(card),
        error: { code: String(error?.code ?? 'fetch-failed'), message: String(error?.message ?? error).slice(0, 300), at: Date.now() },
      })
    } finally {
      running.delete(card.id)
    }
    emit()
  }

  const clearTimer = (id) => {
    const timer = timers.get(id)
    if (timer !== undefined) clearTimeout(timer)
    timers.delete(id)
    generations.set(id, (generations.get(id) ?? 0) + 1)
  }

  // 只有刷新配置真的变了才重排定时器；否则每次 card_finish 都会把所有卡片重取一遍。
  const signatureOf = (card) => JSON.stringify(card?.refresh ?? {})

  const schedule = (card) => {
    const signature = signatureOf(card)
    if (signatures.get(card.id) === signature) return
    clearTimer(card.id)
    signatures.set(card.id, signature)
    if (!hasProvider(card)) return
    const at = dailyAtOf(card)
    if (at !== null) {
      // 固定时刻：算下一次 10:00，执行后重算，重启/休眠都不会累积漂移。
      const generation = generations.get(card.id) ?? 0
      const arm = () => {
        if ((generations.get(card.id) ?? 0) !== generation) return
        const timer = setTimeout(() => { void runOne(card); arm() }, nextDailyDelay(at))
        timers.set(card.id, timer)
      }
      arm()
    } else {
      timers.set(card.id, setInterval(() => { void runOne(card) }, everyMsOf(card)))
    }
    // 新建或改配置后先取一次，别让用户等到下一个整点。
    void runOne(card)
  }

  const sync = (list) => {
    const alive = new Set()
    for (const card of Array.isArray(list) ? list : []) {
      alive.add(card.id)
      schedule(card)
    }
    for (const id of [...timers.keys()]) if (!alive.has(id)) clearTimer(id)
    for (const id of [...signatures.keys()]) if (!alive.has(id)) signatures.delete(id)
    for (const id of [...data.keys()]) if (!alive.has(id)) { data.delete(id); emit() }
  }

  return {
    start: (list) => { started = true; sync(list) },
    stop: () => { started = false; for (const id of [...timers.keys()]) clearTimer(id); timers.clear(); signatures.clear() },
    sync,
    pause: () => { paused = true; for (const id of [...timers.keys()]) clearTimer(id); signatures.clear(); emit() },
    resume: () => { paused = false; sync(cards?.list?.() ?? []); emit() },
    snapshot,
    refresh: (list) => { for (const card of Array.isArray(list) ? list : []) void runOne(card) },
    subscribe: (fn) => { emit = fn },
    get paused() { return paused },
  }
}
