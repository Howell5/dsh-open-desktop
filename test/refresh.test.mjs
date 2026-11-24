// 刷新调度测试：template / command / file / 失败保留旧值 / 暂停
import { createRefresh, nextDailyDelay } from '../host/refresh.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const cards = { list: () => [{ id: 'c1', title: 'A', refresh: { template: 'demo', everyMs: 5000 } }] }
const templates = {
  demo: { fetch: async () => ({ headline: { label: 'demo', value: '42' }, items: [] }) },
  boom: { fetch: async () => { throw Object.assign(new Error('炸了'), { code: 'boom' }) } },
}
let commandOutput = '{"headline":{"label":"cmd","value":"7"}}'
const commands = []
const files = { '/cards/c4/data/x.json': '{"hello":"world"}' }
const refresh = createRefresh({
  ctx: null,
  cards,
  inject: {
    templates,
    pathOf: (id) => `/cards/${id}`,
    runCommand: async (command, options) => { commands.push({ command, options }); return commandOutput },
    readFile: async (file) => {
      if (files[file] === undefined) throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
      return files[file]
    },
    fetch: async () => ({ ok: true, json: async () => ({ from: 'url' }) }),
  },
})

async function until(predicate, label, timeoutMs = 2000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (predicate()) return true
    await wait(20)
  }
  console.log('TIMEOUT', label)
  return false
}

// 1) template 刷新
const card = cards.list()[0]
refresh.start([card])
await until(() => refresh.snapshot().data.c1?.value?.headline?.value === '42', 'template')
check('template 取数成功', refresh.snapshot().data.c1?.value?.headline?.value === '42')
check('sourceRef 标注 template', refresh.snapshot().data.c1?.sourceRef === 'template:demo')

// 2) command → JSON
refresh.stop()
cards.list = () => [{ id: 'c2', title: 'B', refresh: { command: 'python3 fetch.py', everyMs: 5000 } }]
refresh.start(cards.list())
await until(() => refresh.snapshot().data.c2?.value?.headline?.value === '7', 'command')
check('command 输出 JSON 被解析', refresh.snapshot().data.c2?.value?.headline?.value === '7')
check('command 在卡片目录执行', commands[0]?.options?.workspaceRoot === '/cards/c2')
check('sourceRef 标注 command', refresh.snapshot().data.c2?.sourceRef === 'command:python3 fetch.py')

// 3) command → 非 JSON 文本
refresh.stop()
commandOutput = 'plain text output'
cards.list = () => [{ id: 'c3', title: 'C', refresh: { command: 'uptime', everyMs: 5000 } }]
refresh.start(cards.list())
await until(() => typeof refresh.snapshot().data.c3?.value?.text === 'string', 'text')
check('非 JSON 输出存为 {text}', refresh.snapshot().data.c3?.value?.text === 'plain text output')

// 4) file 刷新
refresh.stop()
cards.list = () => [{ id: 'c4', title: 'D', refresh: { file: 'data/x.json', everyMs: 5000 } }]
refresh.start(cards.list())
await until(() => refresh.snapshot().data.c4?.value?.hello === 'world', 'file')
check('file 刷新读到 JSON', refresh.snapshot().data.c4?.value?.hello === 'world')
check('sourceRef 标注 file', refresh.snapshot().data.c4?.sourceRef === 'file:data/x.json')

// 5) 失败保留旧值
refresh.stop()
cards.list = () => [{ id: 'c5', title: 'E', refresh: { template: 'boom', everyMs: 5000 } }]
refresh.start(cards.list())
await until(() => refresh.snapshot().data.c5?.error?.code === 'boom', 'boom')
check('失败时记录错误', refresh.snapshot().data.c5?.error?.code === 'boom')
check('失败不清空旧值（初始为 null）', refresh.snapshot().data.c5?.value === null)

// 6) 暂停
refresh.pause()
check('暂停后 paused=true', refresh.snapshot().paused === true)
refresh.resume()
check('恢复后 paused=false', refresh.snapshot().paused === false)

// 7) 删除卡片后数据清理
refresh.stop()
refresh.start([{ id: 'c4', title: 'D', refresh: { file: 'data/x.json', everyMs: 5000 } }])
await wait(50)
refresh.sync([])
check('卡片移除后数据被清理', refresh.snapshot().data.c4 === undefined)

// 8) dailyAt：创建后立刻取一次，之后按每天固定时刻
refresh.stop()
cards.list = () => [{ id: 'c8', title: 'H', refresh: { template: 'demo', dailyAt: '10:00', everyMs: 86400000 } }]
refresh.start(cards.list())
await until(() => refresh.snapshot().data.c8?.value?.headline?.value === '42', 'daily-first')
check('dailyAt 卡片创建后立刻取一次', refresh.snapshot().data.c8?.value?.headline?.value === '42')
const morning = new Date(2026, 10, 23, 9, 0, 0).getTime()
const afternoon = new Date(2026, 10, 23, 11, 0, 0).getTime()
check('每天 10:00：9 点算到 1 小时后', nextDailyDelay('10:00', morning) === 3_600_000)
check('每天 10:00：11 点顺延到明天', nextDailyDelay('10:00', afternoon) === 82_800_000)

refresh.stop()
const failed = checks.filter((c) => !c.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map((c) => c.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
