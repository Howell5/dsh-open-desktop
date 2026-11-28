// Little Widgets · 数据目录与卡片侧车（card.json）
//
// 第一元语：卡片 = 一条 DSH session 的持久展示位。
// 卡片目录就是 session 的 cwd —— agent 可以在里面写任何代码（脚本/服务/前端/数据）。
//   $DSH_HOME/little-widgets/
//     cards/<cardId>/card.json   侧车：标题/尺寸/顺序/刷新方式
//     cards/<cardId>/view/       前端视图（index.html/style.css/view.js）
//     cards/<cardId>/data/       数据文件（agent 可自由写入）
//     cards/<cardId>/...         其它任何 agent 需要的文件
//     _trash/                    删除的卡片目录（保留 7 天）
//     logs/
//
// 插件原名 Open Desktop，数据目录是 $DSH_HOME/open-desktop/。老安装继续用旧目录：
// 卡片的 command 里写的是绝对路径，DSH 的会话记录也按卡片目录索引，搬目录会把它们弄坏。
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'

export const CARD_VERSION = 3
export const GRID = { columns: 12, rowHeight: 40, gap: 8 }
export const SIZE_BOUNDS = { min: 3, max: 12 }
export const SIZE_PRESETS = { S: { w: 3, h: 4 }, M: { w: 6, h: 4 }, L: { w: 12, h: 6 } }
export const DEFAULT_CARD = {
  title: '新卡片',
  size: { ...SIZE_PRESETS.M },
  refresh: {},
}

const clampInt = (value, lo, hi, fallback) => (Number.isFinite(value) ? Math.min(hi, Math.max(lo, Math.round(value))) : fallback)

export function normalizeSize(raw, fallback = SIZE_PRESETS.M) {
  if (raw && typeof raw === 'object') {
    return {
      w: clampInt(Number(raw.w), SIZE_BOUNDS.min, SIZE_BOUNDS.max, fallback.w),
      h: clampInt(Number(raw.h), SIZE_BOUNDS.min, SIZE_BOUNDS.max, fallback.h),
    }
  }
  if (typeof raw === 'string' && SIZE_PRESETS[raw]) return { ...SIZE_PRESETS[raw] }
  return { ...fallback }
}

// Every card renders view/ frontend code in a sandbox iframe. There is no
// renderer kind and no per-card view selection anymore.

/**
 * 刷新契约（薄约定）：Host 只管「怎么拿到新数据」，卡片里数据怎么来由 agent 决定。
 * 优先级：template > command > file > url。全部为空 = 不自动刷新。
 *   template: 内置取数模板（crypto/news/clock/wifi/script）
 *   command:  在卡片目录执行命令，stdout 当 JSON（非 JSON 则存为 {text}）
 *   file:     读取卡片目录下（或绝对路径）的 JSON 文件
 *   url:      请求本地/远端 HTTP，返回 JSON
 */
// 最长 7 天：再长会超过 setInterval 的 2^31-1 毫秒上限，在浏览器里会立刻触发。
const MAX_EVERY = 604_800_000
const DAILY_AT = /^([01]\d|2[0-3]):([0-5]\d)$/

export function normalizeRefresh(raw) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const dailyAt = typeof source.dailyAt === 'string' && DAILY_AT.test(source.dailyAt.trim()) ? source.dailyAt.trim() : ''
  const everyMs = dailyAt !== '' && source.everyMs === undefined
    ? 86_400_000
    : clampInt(Number(source.everyMs), 5000, MAX_EVERY, 60_000)
  const template = typeof source.template === 'string' && source.template !== '' ? source.template : ''
  const command = typeof source.command === 'string' && source.command.trim() !== '' ? source.command.trim().slice(0, 2000) : ''
  const file = typeof source.file === 'string' && source.file.trim() !== '' ? source.file.trim().slice(0, 500) : ''
  const url = typeof source.url === 'string' && /^https?:\/\//.test(source.url) ? source.url.slice(0, 2000) : ''
  if (template === '' && command === '' && file === '' && url === '') return {}
  const refresh = { everyMs }
  if (dailyAt !== '') refresh.dailyAt = dailyAt
  if (template !== '') refresh.template = template
  if (command !== '') refresh.command = command
  if (file !== '') refresh.file = file
  if (url !== '') refresh.url = url
  if (source.params && typeof source.params === 'object') refresh.params = { ...source.params }
  return refresh
}

const legacyRefresh = (collector) => {
  if (!collector || typeof collector !== 'object') return {}
  if (collector.kind === 'template') {
    return { template: collector.template, params: collector.params, everyMs: collector.everyMs }
  }
  if (collector.kind === 'script') {
    return { command: collector.command, everyMs: collector.everyMs }
  }
  return {}
}

/** 卡片侧车：唯一可写的 UI/运行配置。id 必须等于卡片 session id。 */
export function normalizeCard(raw, fallback = {}) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const id = typeof source.id === 'string' && source.id !== '' ? source.id : (typeof fallback.id === 'string' ? fallback.id : '')
  const legacy = source.refresh === undefined && source.collector !== undefined ? legacyRefresh(source.collector) : null
  const building = source.building !== undefined
    ? source.building !== false
    : (source.hidden !== undefined ? source.hidden !== false : true)
  return {
    version: CARD_VERSION,
    id,
    sessionId: typeof source.sessionId === 'string' && source.sessionId !== '' ? source.sessionId : id,
    title: typeof source.title === 'string' && source.title.trim() !== ''
      ? source.title.trim().slice(0, 60)
      : (typeof fallback.title === 'string' ? fallback.title : DEFAULT_CARD.title),
    size: normalizeSize(source.size, fallback.size ?? DEFAULT_CARD.size),
    order: Number.isFinite(source.order) ? Math.max(0, Math.round(source.order)) : 0,
    refresh: normalizeRefresh(legacy ?? source.refresh),
    viewWarnings: Array.isArray(source.viewWarnings)
      ? source.viewWarnings.filter((item) => typeof item === 'string' && item !== '').slice(0, 20)
      : [],
    building,
    createdAt: Number.isFinite(source.createdAt) ? source.createdAt : Date.now(),
    updatedAt: Number.isFinite(source.updatedAt) ? source.updatedAt : Date.now(),
  }
}

export const DATA_DIR_NAME = 'little-widgets'
export const LEGACY_DATA_DIR_NAME = 'open-desktop'

export function dataRoot(env = process.env, exists = existsSync) {
  const given = typeof env?.DSH_HOME === 'string' ? env.DSH_HOME.trim() : ''
  const base = given || join(homedir(), '.dsh')
  const current = join(base, DATA_DIR_NAME)
  const legacy = join(base, LEGACY_DATA_DIR_NAME)
  if (!exists(current) && exists(legacy)) return legacy
  return current
}

export function makePaths(root) {
  return {
    root,
    cards: join(root, 'cards'),
    trash: join(root, '_trash'),
    logs: join(root, 'logs'),
    cardDir: (id) => join(root, 'cards', id),
    cardFile: (id) => join(root, 'cards', id, 'card.json'),
    viewDir: (id) => join(root, 'cards', id, 'view'),
    dataDir: (id) => join(root, 'cards', id, 'data'),
  }
}

export async function ensureLayout(paths) {
  for (const dir of [paths.root, paths.cards, paths.trash, paths.logs]) {
    await mkdir(dir, { recursive: true })
  }
}

export async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback
    throw error
  }
}

export async function writeJsonAtomic(file, value) {
  await mkdir(dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  await rename(tmp, file)
}

export async function readCard(paths, id) {
  const raw = await readJson(paths.cardFile(id), null)
  return raw === null ? null : normalizeCard(raw, { id })
}

export async function writeCard(paths, card) {
  const next = normalizeCard(card, { id: card.id })
  next.updatedAt = Date.now()
  await writeJsonAtomic(paths.cardFile(next.id), next)
  return next
}

export async function listCards(paths) {
  let entries = []
  try {
    entries = await readdir(paths.cards, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT') return []
    throw error
  }
  const cards = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const card = await readCard(paths, entry.name).catch(() => null)
    if (card !== null) cards.push(card)
  }
  return cards.sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
}

export async function trashCard(paths, id) {
  const target = join(paths.trash, `${id}-${Date.now()}`)
  await mkdir(paths.trash, { recursive: true })
  await rename(paths.cardDir(id), target)
  return target
}

export async function purgeTrash(paths, olderThanMs = 7 * 24 * 3600 * 1000) {
  let entries = []
  try {
    entries = await readdir(paths.trash, { withFileTypes: true })
  } catch {
    return 0
  }
  const now = Date.now()
  let count = 0
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const stamp = Number(entry.name.split('-').pop())
    if (Number.isFinite(stamp) && now - stamp > olderThanMs) {
      await rm(join(paths.trash, entry.name), { recursive: true, force: true })
      count += 1
    }
  }
  return count
}
