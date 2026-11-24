// 卡片逐字流测试：frame 形状 → SSE live/end 事件
import { EventEmitter } from 'node:events'
import { registerRoutes } from '../host/api.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const routes = new Map()
const ctx = {
  webServer: {
    getOrigin: () => 'http://localhost',
    register: (route) => { routes.set(route.path, route); return () => {} },
  },
}
const board = {
  hasCard: (id) => id === 'card1',
  snapshot: () => ({}),
  subscribe: () => () => {},
}
let followAborted = false
const frames = [
  { type: 'assistant-stream', frame: { type: 'start', turn: 1, step: 2 } },
  { type: 'assistant-stream', frame: { type: 'chunk', chunk: { type: 'text-delta', text: '你好' } } },
  { type: 'assistant-stream', frame: { type: 'chunk', chunk: { type: 'text-delta', text: '，世界' } } },
  { type: 'event', event: { type: 'tool/call', seq: 1, data: { turn: 1, step: 2 } } },
  { type: 'event', event: { type: 'assistant/live-chunk', data: { turn: 1, step: 2, chunk: { type: 'text-delta', text: '！' } } } },
  { type: 'event', event: { type: 'turn/end', seq: 9, data: { turn: 1, reason: { kind: 'completed' } } } },
]
const sessions = {
  follow: async function* (id, signal) {
    check('follow 拿到卡片 id', id === 'card1', id)
    signal?.addEventListener?.('abort', () => { followAborted = true })
    for (const frame of frames) yield frame
  },
}

registerRoutes(ctx, board, sessions)
check('注册了 card-stream 路由', routes.has('/open-desktop/card-stream'))

const handler = routes.get('/open-desktop/card-stream').handler
const req = new EventEmitter()
req.method = 'GET'
req.url = '/open-desktop/card-stream?id=card1'
req.headers = {}
const response = { status: 0, headers: null, body: '' }
const res = {
  writeHead: (status, headers) => { response.status = status; response.headers = headers },
  write: (chunk) => { response.body += chunk; return true },
  end: () => {},
  on: () => {},
}

handler(req, res)
await wait(220)

check('返回 SSE 状态码', response.status === 200, String(response.status))
check('content-type 是事件流', /text\/event-stream/.test(response.headers?.['content-type'] ?? ''))
check('先发 ready', response.body.includes('event: ready'))
check('逐字文本聚合', response.body.includes('"text":"你好，世界！"') && response.body.includes('"turn":1') && response.body.includes('"step":2'), response.body.slice(-300))
check('回合结束发 end', response.body.includes('event: end'))

// 不存在的卡片直接 404，不进流
const req2 = new EventEmitter()
req2.method = 'GET'
req2.url = '/open-desktop/card-stream?id=nope'
req2.headers = {}
const response2 = { status: 0, body: '' }
const res2 = {
  writeHead: (status) => { response2.status = status },
  end: (chunk) => { response2.body += chunk ?? '' },
  on: () => {},
}
handler(req2, res2)
check('未知卡片返回 404', response2.status === 404, String(response2.status))

// 环境不支持逐字流：立即跑完的空流要告诉客户端退回轮询，别让它无限重连
const routes3 = new Map()
registerRoutes({
  webServer: {
    getOrigin: () => 'http://localhost',
    register: (route) => { routes3.set(route.path, route); return () => {} },
  },
}, board, { follow: async function* () {} })
const req3 = new EventEmitter()
req3.method = 'GET'
req3.url = '/open-desktop/card-stream?id=card1'
req3.headers = {}
const response3 = { status: 0, body: '' }
const res3 = {
  writeHead: (status) => { response3.status = status },
  write: (chunk) => { response3.body += chunk; return true },
  end: () => {},
  on: () => {},
}
routes3.get('/open-desktop/card-stream').handler(req3, res3)
await wait(60)
check('不支持流式时发 disabled', response3.body.includes('event: disabled'), response3.body.slice(-200))

const summary = { total: checks.length, failed: checks.filter((item) => !item.ok).length }
if (summary.failed > 0) summary.failures = checks.filter((item) => !item.ok).map((item) => item.name)
console.log(JSON.stringify(summary))
process.exit(summary.failed === 0 ? 0 : 1)
