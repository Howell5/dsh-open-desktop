// 卡片侧车（card.json）测试：最小字段 + 旧卡迁移
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makePaths, ensureLayout, normalizeCard, normalizeRefresh, normalizeSize, readCard, writeCard, SIZE_PRESETS } from '../host/paths.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }

// 默认值
const base = normalizeCard({ id: 'session-a' })
check('默认版本 3', base.version === 3)
check('sessionId 默认等于 id', base.sessionId === 'session-a')
check('默认尺寸 M', base.size.w === SIZE_PRESETS.M.w && base.size.h === SIZE_PRESETS.M.h)
check('默认没有 view 字段', base.view === undefined)
check('默认没有视图警告', Array.isArray(base.viewWarnings) && base.viewWarnings.length === 0)
check('默认没有刷新', Object.keys(base.refresh).length === 0)
check('默认 building=true', base.building === true)

// 尺寸 / 视图
check('尺寸裁剪到 3..12', normalizeSize({ w: 1, h: 99 }).w === 3 && normalizeSize({ w: 1, h: 99 }).h === 12)
check('预设尺寸可用', normalizeSize('L').w === 12)

// 刷新契约
check('template 刷新', normalizeRefresh({ template: 'crypto', params: { coins: 'BTC' }, everyMs: 30000 }).template === 'crypto')
check('command 刷新', normalizeRefresh({ command: 'python3 fetch.py', everyMs: 90000 }).command === 'python3 fetch.py')
check('file 刷新', normalizeRefresh({ file: 'data/latest.json' }).file === 'data/latest.json')
check('url 刷新', normalizeRefresh({ url: 'http://127.0.0.1:9000/data' }).url === 'http://127.0.0.1:9000/data')
check('非 http url 被拒', Object.keys(normalizeRefresh({ url: 'ftp://x' })).length === 0)
check('空刷新 = 不刷新', Object.keys(normalizeRefresh({})).length === 0)
check('刷新间隔下限', normalizeRefresh({ command: 'x', everyMs: 100 }).everyMs === 5000)
check('刷新间隔可以到一天', normalizeRefresh({ command: 'x', everyMs: 86400000 }).everyMs === 86400000)
check('刷新间隔上限 7 天', normalizeRefresh({ command: 'x', everyMs: 999999999999 }).everyMs === 604800000)
check('dailyAt 被保留', normalizeRefresh({ command: 'x', dailyAt: '10:00' }).dailyAt === '10:00')
check('dailyAt 没有 everyMs 时补一天', normalizeRefresh({ command: 'x', dailyAt: '10:00' }).everyMs === 86400000)
check('非法 dailyAt 被丢弃', normalizeRefresh({ command: 'x', dailyAt: '25:00' }).dailyAt === undefined)

// 旧卡迁移：collector → refresh，hidden → building，ticket/permission 被丢弃
const legacy = normalizeCard({
  id: 'session-old',
  title: '旧卡',
  hidden: false,
  collector: { kind: 'template', template: 'wifi', params: {}, everyMs: 60000 },
  permission: 'full',
  ticket: { status: 'done', assignments: [] },
})
check('旧卡 collector 迁移为 refresh.template', legacy.refresh.template === 'wifi')
check('旧卡 hidden=false → building=false', legacy.building === false)
check('旧卡权限字段被丢弃', legacy.permission === undefined)
check('旧卡 ticket 字段被丢弃', legacy.ticket === undefined)

// 写盘后旧字段真的消失
const root = await mkdtemp(join(tmpdir(), 'od-card-'))
const paths = makePaths(root)
await ensureLayout(paths)
await mkdir(paths.cardDir('session-old'), { recursive: true })
await writeFile(join(paths.cardDir('session-old'), 'card.json'), JSON.stringify({ id: 'session-old', hidden: false, collector: { kind: 'script', command: 'python3 a.py' }, ticket: { status: 'done' }, permission: 'ask' }))
const loaded = await readCard(paths, 'session-old')
check('读到旧卡迁移结果', loaded.refresh.command === 'python3 a.py' && loaded.building === false)
await writeCard(paths, loaded)
const raw = JSON.parse(await readFile(join(paths.cardDir('session-old'), 'card.json'), 'utf8'))
check('写盘后不再有 ticket', raw.ticket === undefined && raw.collector === undefined && raw.permission === undefined && raw.hidden === undefined)
check('写盘后保留 refresh', raw.refresh?.command === 'python3 a.py')

await rm(root, { recursive: true, force: true })
const failed = checks.filter((c) => !c.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map((c) => c.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
