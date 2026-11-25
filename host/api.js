// Open Desktop · HTTP 入口（SSE + 自鉴权 POST API）
//
// 插件路由不经过 DSH 页面鉴权，所以这里自己做 Origin 校验、只收 POST、限制请求体大小。
const MAX_BODY_BYTES = 256 * 1024
const PING_MS = 20_000

const respond = (res, status, value) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(value))
}

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = []
  let size = 0
  req.on('data', (chunk) => {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      reject(Object.assign(new Error('请求体过大'), { code: 'too-large' }))
      req.destroy()
      return
    }
    chunks.push(chunk)
  })
  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  req.on('error', reject)
})

function streamHandler(board, active) {
  return (req, res) => {
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    })
    const send = () => {
      try { res.write(`event: state\ndata: ${JSON.stringify(board.snapshot())}\n\n`) } catch { active.delete(res) }
    }
    active.add(res)
    send()
    const unsubscribe = board.subscribe(send)
    const ping = setInterval(() => { try { res.write(': ping\n\n') } catch { /* 连接已断 */ } }, PING_MS)
    const cleanup = () => { clearInterval(ping); unsubscribe(); active.delete(res) }
    req.on('close', cleanup)
    req.on('error', cleanup)
  }
}

function cardStreamHandler(board, sessions, origin, active) {
  return (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      respond(res, 405, { ok: false, error: { code: 'method-not-allowed', message: '只接受 GET' } })
      return
    }
    const requestOrigin = String(req.headers.origin ?? '')
    if (origin !== '' && requestOrigin !== '' && requestOrigin !== origin) {
      respond(res, 403, { ok: false, error: { code: 'bad-origin', message: '来源不合法' } })
      return
    }
    const id = new URL(req.url ?? '/', 'http://127.0.0.1').searchParams.get('id') ?? ''
    if (id === '' || !board.hasCard(id)) {
      respond(res, 404, { ok: false, error: { code: 'not-found', message: '没有这张卡片' } })
      return
    }

    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
      'x-accel-buffering': 'no',
    })

    let closed = false
    let live = { turn: 0, step: 0, text: '' }
    let sentAny = false
    let flushTimer = null
    const abort = new AbortController()
    const send = (event, data) => {
      if (closed) return
      try { res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`) } catch { closed = true }
    }
    const flush = () => {
      if (flushTimer !== null) return
      flushTimer = setTimeout(() => {
        flushTimer = null
        if (live.text !== '') sentAny = true
        send('live', live)
      }, 80)
    }
    const flushNow = () => {
      if (flushTimer !== null) {
        clearTimeout(flushTimer)
        flushTimer = null
      }
      if (live.text !== '') sentAny = true
      send('live', live)
    }
    const cleanup = () => {
      if (closed) return
      closed = true
      try { abort.abort() } catch { /* 已断开 */ }
      if (flushTimer !== null) clearTimeout(flushTimer)
      flushTimer = null
      clearInterval(ping)
      active.delete(res)
    }
    active.add(res)
    const ping = setInterval(() => {
      if (closed) return
      try { res.write(': ping\n\n') } catch { cleanup() }
    }, PING_MS)
    req.on('close', cleanup)
    req.on('error', cleanup)

    send('ready', { id })

    // 只推逐字文本：历史与工具卡片仍走 card-turns 轮询，流断了也不影响可用性
    void (async () => {
      try {
        for await (const frame of sessions.follow(id, abort.signal)) {
          if (closed) break
          if (frame?.type === 'assistant-stream') {
            const inner = frame.frame
            const chunk = inner?.chunk
            if (inner?.type === 'start') {
              if (live.text !== '') flushNow()
              live = {
                turn: Number.isFinite(inner.turn) ? inner.turn : live.turn,
                step: Number.isFinite(inner.step) ? inner.step : live.step,
                text: '',
              }
              flush()
            } else if (inner?.type === 'chunk' && chunk?.type === 'text-delta' && typeof chunk.text === 'string') {
              live.text += chunk.text
              flush()
            }
            // attempt 结束时保留最后一段文本：等 durable assistant/message 到达，客户端自动去重
            continue
          }
          if (frame?.type !== 'event') continue
          const event = frame.event
          if (event?.type === 'assistant/live-chunk') {
            const chunk = event.data?.chunk
            if (Number.isFinite(event.data?.turn) && Number.isFinite(event.data?.step)
              && (event.data.turn !== live.turn || event.data.step !== live.step)) {
              live = { turn: event.data.turn, step: event.data.step, text: '' }
            }
            if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') {
              live.text += chunk.text
              flush()
            }
            continue
          }
          if (event?.type === 'turn/end') {
            // 先把最后一段逐字文本推出去，再由客户端在轮询到 durable 文本后清掉
            if (live.text !== '') flushNow()
            live = { turn: live.turn, step: live.step, text: '' }
            send('end', {})
          }
        }
      } catch {
        // 流式通道不可用时静默退出；客户端有轮询兜底
      } finally {
        if (flushTimer !== null) clearTimeout(flushTimer)
        flushTimer = null
        if (live.text !== '') flushNow()
        if (!sentAny) send('disabled', {})
        cleanup()
        try { res.end() } catch { /* 已结束 */ }
      }
    })()
  }
}

function apiHandler(board, origin) {
  return async (req, res) => {
    if (req.method !== 'POST') {
      respond(res, 405, { ok: false, error: { code: 'method-not-allowed', message: '只接受 POST' } })
      return
    }
    const requestOrigin = String(req.headers.origin ?? '')
    if (origin !== '' && requestOrigin !== '' && requestOrigin !== origin) {
      respond(res, 403, { ok: false, error: { code: 'bad-origin', message: '来源不合法' } })
      return
    }
    let payload
    try {
      payload = JSON.parse(await readBody(req))
    } catch (error) {
      respond(res, 400, { ok: false, error: { code: error?.code ?? 'bad-json', message: String(error?.message ?? error) } })
      return
    }
    const action = String(payload?.action ?? 'state')
    const args = payload?.payload ?? {}
    try {
      const value = await (async () => {
        switch (action) {
          case 'state': return board.snapshot()
          case 'card-create': return board.createCard(args)
          case 'card-session': return board.prepareSession(args)
          case 'card-prompt': return board.prompt(args)
          case 'card-update': return board.update(args)
          case 'card-remove': return board.remove(args)
          case 'card-reorder': return board.reorder(args)
          case 'card-data': return board.writeData(args)
          case 'card-refresh': return board.refresh(args)
          case 'card-inspect': return board.inspect(args)
          case 'card-turns': return board.turns(args)
          case 'card-cancel': return board.cancel(args)
          case 'card-view': return board.view(args)
          case 'renderer-fetch': return board.rendererFetch(args)
          case 'open': return board.requestOpen()
          case 'card-chat': return board.openChat(args)
          case 'card-chat-close': return board.closeChat()
          case 'client-log': return board.clientLog(args)
          case 'pause': return board.setPaused(args)
          default: throw Object.assign(new Error(`未知动作 ${action}`), { code: 'unknown-action' })
        }
      })()
      respond(res, 200, { ok: true, value, state: board.snapshot() })
    } catch (error) {
      respond(res, 200, {
        ok: false,
        error: { code: String(error?.code ?? 'action-failed'), message: String(error?.message ?? error) },
        state: board.snapshot(),
      })
    }
  }
}

export function registerRoutes(ctx, board, sessions) {
  let origin = ''
  try { origin = ctx.webServer.getOrigin() } catch { origin = '' }
  const active = new Set()
  const disposers = [
    ctx.webServer.register({ kind: 'exact', path: '/open-desktop/stream', handler: streamHandler(board, active) }),
    ctx.webServer.register({ kind: 'exact', path: '/open-desktop/card-stream', handler: cardStreamHandler(board, sessions, origin, active) }),
    ctx.webServer.register({ kind: 'exact', path: '/open-desktop/api', handler: apiHandler(board, origin) }),
  ]
  return () => {
    for (const res of active) { try { res.end() } catch { /* 已结束 */ } }
    active.clear()
    for (const dispose of disposers) { try { dispose() } catch { /* 路由可能已销毁 */ } }
  }
}
