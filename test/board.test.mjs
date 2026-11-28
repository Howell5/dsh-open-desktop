// 板面测试：State 聚合 / 卡片动作 / 对话 / 渲染器
import { mkdtemp, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makePaths, ensureLayout } from '../host/paths.js'
import { createCards } from '../host/cards.js'
import { createBoard } from '../host/board.js'
import { registerRoutes } from '../host/api.js'
import { EventEmitter } from 'node:events'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }

const root = await mkdtemp(join(tmpdir(), 'od-board-'))
const paths = makePaths(root)
await ensureLayout(paths)
const cards = createCards({ paths })
await cards.start()

const prompts = []
let refreshed = 0
const fakeRefresh = {
  snapshot: () => ({ paused: false, data: { 'session-card-test': { value: { n: 1 }, fetchedAt: Date.now() } } }),
  sync() {},
  refresh: (list) => { refreshed += list.length },
  pause() {}, resume() {},
}
const fakeSessions = {
  async create(patch) {
    return cards.put({ id: 'session-card-test', sessionId: 'session-card-test', title: patch.title, size: patch.size, view: patch.view, building: true })
  },
  async prompt(id, text) { prompts.push({ id, text }) },
  async prepare(id) { return { sessionId: cards.get(id).sessionId } },
  async remove(id) { await cards.remove(id) },
  async inspect() { return { events: [] } },
  async cancel() {},
}
const board = createBoard({ ctx: {}, paths, cards, refresh: fakeRefresh, sessions: fakeSessions })
const CARD_OPENING_MARK = '【卡片任务】'

// 1) 空板面
check('空板面 State', board.snapshot().cards.length === 0 && board.snapshot().paused === false)

// 2) 新建卡片（带首句话）
const card = await board.createCard({ text: '做一个 WiFi 卡片' })
check('新建卡片带标题', card.title === '做一个 WiFi 卡片')
check('第一句话带任务指令', prompts[0]?.text?.startsWith(CARD_OPENING_MARK) && prompts[0]?.text?.includes('做一个 WiFi 卡片'), JSON.stringify(prompts[0]?.text?.slice(0, 40)))
check('State 里出现卡片', board.snapshot().cards.length === 1)
check('State 带数据', board.snapshot().data['session-card-test']?.value?.n === 1)

// Native navigation resolves the current executor through the actual API route.
const routes = new Map()
const disposeRoutes = registerRoutes({ webServer: {
  getOrigin: () => 'http://localhost',
  register(route) { routes.set(route.path, route); return () => routes.delete(route.path) },
} }, board, fakeSessions)
async function api(payload) {
  const req = new EventEmitter()
  req.method = 'POST'
  req.headers = { origin: 'http://localhost' }
  let body
  const running = routes.get('/little-widgets/api').handler(req, { writeHead() {}, end(value) { body = JSON.parse(value) } })
  req.emit('data', Buffer.from(JSON.stringify({ action: 'card-session', payload })))
  req.emit('end')
  await running
  return body
}
await cards.patch(card.id, { sessionId: 'session-exec-current' })
const prepared = await api({ id: card.id })
check('native navigation returns the prepared executor', prepared.ok && prepared.value.sessionId === 'session-exec-current')
const missing = await api({ id: 'absent' })
check('native navigation rejects unknown cards', !missing.ok && missing.error.code === 'not-found')
disposeRoutes()

// 3) 更新
const updated = await board.update({ id: card.id, title: '新标题', size: { w: 4, h: 6 } })
check('更新标题/尺寸', updated.title === '新标题' && updated.size.w === 4 && updated.view === undefined)

// 属性弹窗改频率：只改 everyMs/dailyAt，保留 template/command/file/url
const withRefresh = await board.update({ id: card.id, refresh: { template: 'wifi', everyMs: 300000 } })
check('更新频率保留取数来源', withRefresh.refresh?.template === 'wifi' && withRefresh.refresh?.everyMs === 300000 && withRefresh.refresh?.dailyAt === undefined)
const withDaily = await board.update({ id: card.id, refresh: { template: 'wifi', dailyAt: '10:00', everyMs: 86400000 } })
check('更新为每天固定时刻', withDaily.refresh?.template === 'wifi' && withDaily.refresh?.dailyAt === '10:00' && withDaily.refresh?.everyMs === 86400000)
check('State 带设计系统', typeof board.snapshot().design?.css === 'string' && board.snapshot().design.css.includes('.od-view'))

// 交互状态写入：只落 cardId/data/state.json，超过 64KB 拒绝
const savedState = await board.writeData({ id: card.id, value: { items: [{ id: 1, text: '买猫粮', done: false }] } })
const savedFile = JSON.parse(await readFile(join(paths.cardDir(card.id), 'data', 'state.json'), 'utf8'))
check('卡片交互状态写入 data/state.json', savedState.written === true && savedFile.items?.[0]?.text === '买猫粮')
// 浅合并：两次写不同的键，前一次的键不能被抹掉
await board.writeData({ id: card.id, value: { range: '1M' } })
await board.writeData({ id: card.id, value: { focus: 'NVDA' } })
const merged = JSON.parse(await readFile(join(paths.cardDir(card.id), 'data', 'state.json'), 'utf8'))
check('卡片状态是浅合并', merged.range === '1M' && merged.focus === 'NVDA' && merged.items?.[0]?.text === '买猫粮')

let tooBig = false
try { await board.writeData({ id: card.id, value: { text: 'x'.repeat(70 * 1024) } }) } catch (error) { tooBig = error.code === 'data-too-large' }
check('卡片状态超过 64KB 被拒绝', tooBig)

// 4) 重排
const bad = await board.reorder({ ids: ['nope'] }).then(() => false, (error) => error.code === 'bad-reorder')
check('非法重排被拒', bad)
const reorder = await board.reorder({ ids: [card.id] })
check('合法重排成功', reorder.reordered === true && cards.get(card.id).order === 0)

// 5) 暂停 / 刷新
await board.setPaused({ paused: true })
check('暂停生效', board.snapshot().paused === true)
await board.setPaused({ paused: false })
check('恢复生效', board.snapshot().paused === false)
await board.refresh({})
check('刷新触发', refreshed >= 1)

// 6) 卡片对话打开/关闭
board.openChat({ id: card.id })
check('打开卡片对话', board.snapshot().chatOpenCardId === card.id)
board.closeChat()
check('关闭卡片对话', board.snapshot().chatOpenCardId === null)

// 7) custom 渲染器内联
const { mkdir, writeFile } = await import('node:fs/promises')
await mkdir(paths.viewDir(card.id), { recursive: true })
await writeFile(join(paths.viewDir(card.id), 'index.html'), '<div>hi</div>')
await writeFile(join(paths.viewDir(card.id), 'style.css'), '.x{}')
await writeFile(join(paths.viewDir(card.id), 'view.js'), 'console.log(1)')
const view = await board.view({ id: card.id })
check('视图文件内联', view.missing === false && view.html.includes('hi') && view.css === '.x{}')
check('State 里视图内联', board.snapshot().cards[0].view.html.includes('hi'))

// 8) turns / inspect
const turns = await board.turns({ id: card.id })
check('turns 返回结构', Array.isArray(turns.turns))
const inspection = await board.inspect({ id: card.id })
check('inspect 返回事件数组', Array.isArray(inspection.events))

// 9) client-log 落盘
await board.clientLog({ kind: 'test', message: 'hello' })
const log = await readFile(join(paths.logs, 'client.jsonl'), 'utf8')
check('client-log 写盘', log.includes('hello'))

// 10) 删除
await board.remove({ id: card.id })
check('删除后 State 少一张', board.snapshot().cards.length === 0)

// 11) 并发上限：同时最多 8 张 building
for (let index = 0; index < 8; index += 1) {
  await cards.put({ id: 'session-card-limit-' + index, sessionId: 'session-card-limit-' + index, title: 'L' + index, size: { w: 4, h: 4 }, building: true })
}
let limited = null
try { await board.createCard({ text: '再来一张' }) } catch (error) { limited = error }
check('并发达到上限时拒绝新建', limited?.code === 'build-limit')
check('State 暴露并发上限', board.snapshot().maxBuilding === 8)

await rm(root, { recursive: true, force: true })
const failed = checks.filter((c) => !c.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map((c) => c.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
