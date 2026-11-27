// Card sessions share a DSH workspace and execute in their own card directories.
import { randomUUID } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { createCardTools } from './tools.js'
import { migrateCardSessions } from './migrate.js'
import { ensureViewScaffold } from './views.js'

export const WORKSPACE_TITLE = 'Open-Desktop'
export const LEGACY_WORKSPACE_TITLE = 'Open Desktop'

export const CARD_OPENING = [
  '【卡片任务】你是这张卡片自己的 Agent，当前工作目录就是卡片目录，可以写任何代码。',
  '目标：把用户描述的结果做成一张常驻卡片。',
  '卡片内容只有一种形式：view/ 里的前端代码（index.html + style.css + view.js），',
  '宿主在沙箱 iframe 中渲染。没有内置渲染器，也没有 auto/custom 可选。步骤：',
  '1) card_read 看当前配置，读 view/README.md 了解设计系统和可用的 od-* 类；',
  '2) 数据：在卡片目录里写取数代码，然后 card_set_refresh 告诉 Host 如何刷新',
  '   （template 内置模板 / command 本机命令 / file 读文件 / url 请求接口，everyMs 控制间隔）；',
  '   command 一律写绝对路径（解释器和脚本都写全，如 /usr/bin/python3 /绝对/路径/x.py），',
  '   不要依赖 PATH 或当前目录——宿主一升级，环境变量就可能变，相对路径会静默失效；',
  '3) 展示：优先保留 view/ 里的默认视图，它按数据形状自动排版；需要特殊视觉再改 view/ 里的文件。',
  '   只用 --od-* token 和 od-* 组件类；不要写死颜色或小于 11px 的字号；不要外链资源；',
  '   尺寸预算（必须自己算，不要靠 overflow:hidden 藏住被裁的内容）：卡片四周留 13px padding，',
  '   4×6 内容区约 404×224，6×6 约 614×224，3×6 约 294×224。把每一行的高度、gap、margin、',
  '   图表高度、标题全部加起来，必须小于等于内容区高度；所有元素的底边不得超出卡片底边，文字之间不得重叠。',
  '   反过来，内容不够高时用 flex 把行/块拉伸铺满，不要在上面堆完再留一大片空白。',
  '4) 尺寸/标题用 card_update；card_check 可以自检；完成后必须 card_finish（会跑 lint，有错误会被打回）；',
  '5) 回复一句话说明做了什么。',
  '用户需求：',
].join('\n')

const CARD_PROMPT = [
  '你是这张卡片的 Agent。当前工作目录是卡片目录：数据、脚本、服务、前端都在这里。',
  '卡片内容只有一种：view/ 里的前端代码，在沙箱 iframe 里渲染；设计系统见 view/README.md。',
  '用 card_* 工具修改卡片配置；用普通工具写代码。改完用 card_check 自检，完成后 card_finish。',
  '不要用 bash 反复试探环境；先看卡片现状，再动手。',
].join('\n')

const newCardId = () => `session-card-${randomUUID().replace(/-/g, '').slice(0, 16)}`
const missingSession = error => error?.code === 'session/not-found'
  || error?.code === 'SESSION_QUERY_SESSION_NOT_FOUND'
  || error?.constructor?.name === 'ApiSessionNotFound'

export function createSessions({ ctx, paths, cards, refresh, onChange }) {
  const scoped = new Map()
  const attaching = new Map()
  const preparing = new Map()
  const titleSync = new Map()
  const lastTitles = new WeakMap()
  const disposedAgents = new WeakSet()
  const deleting = new Set()
  const lifecycleDisposers = []
  let listening = false
  let workspace = null
  let workspacePending = null
  let closed = false
  const service = name => ctx?.get?.(name) ?? ctx?.[name]
  const requireService = (name, method) => {
    const value = service(name)
    if (typeof value?.[method] !== 'function') throw Object.assign(new Error(`卡片会话需要 DSH 服务 ${name}.${method}`), { code: 'no-session-service' })
    return value
  }
  const controller = () => requireService('sessionController', 'resolveAgent')
  const resolveAgent = async (sessionId) => {
    const result = await controller().resolveAgent(sessionId)
    if (result?.error) throw result.error
    if (!result?.agent) throw new Error(`会话 ${sessionId} 返回了无效的执行器`)
    return result.agent
  }
  const requireMapping = (cardId, sessionId) => {
    const card = cards.get(cardId)
    if (closed || deleting.has(cardId) || card === null || card.sessionId !== sessionId) {
      throw Object.assign(new Error('卡片已删除、会话已更换或插件已卸载'), { code: 'card-session-stale' })
    }
    return card
  }
  const notice = () => onChange?.()
  const warn = (message, error) => ctx.logger?.warn?.(`[open-desktop] ${message}: ${error?.message ?? error}`)
  // building 只在 card_finish 里被清掉；生成失败或中途退出时必须由这里收尾，
  // 否则这张卡会永远占着「构建中」和并发名额。
  const settleBuilding = async (card) => {
    if (card === null || card === undefined || card.building !== true) return false
    try {
      await cards.patch(card.id, { building: false })
      notice()
      return true
    } catch (error) {
      warn(`收尾卡片「${card.title}」的构建状态失败`, error)
      return false
    }
  }

  const ensureDirs = async (id) => {
    for (const dir of [paths.cardDir(id), paths.viewDir(id), paths.dataDir(id)]) await mkdir(dir, { recursive: true })
  }

  const ensureWorkspace = () => {
    const registry = requireService('workspaceRegistry', 'create')
    if (workspace !== null && registry.get(workspace.id) !== undefined) return Promise.resolve(workspace)
    if (workspacePending === null) {
      workspacePending = (async () => {
        await mkdir(paths.cards, { recursive: true })
        workspace = await registry.resolveByPath(paths.cards) ?? await registry.create(paths.cards, WORKSPACE_TITLE)
        // Older installs registered the display name with a space; keep the path, drop the space.
        if (workspace.title === LEGACY_WORKSPACE_TITLE && typeof workspace.setTitle === 'function') {
          await workspace.setTitle(WORKSPACE_TITLE)
          workspace.title = WORKSPACE_TITLE
        }
        return workspace
      })().finally(() => { workspacePending = null })
    }
    return workspacePending
  }

  const syncTitle = async (cardId, suppliedAgent) => {
    const before = cards.get(cardId)
    if (closed || before === null || deleting.has(cardId)) return
    // Resolve before queuing: a creation hook must not wait on its own unfinished resume.
    const agent = suppliedAgent ?? await resolveAgent(before.sessionId)
    const previous = titleSync.get(cardId) ?? Promise.resolve()
    const pending = previous.catch(() => {}).then(async () => {
      const card = cards.get(cardId)
      if (closed || deleting.has(cardId) || disposedAgents.has(agent) || card?.sessionId !== agent.id) return
      if (lastTitles.get(agent) === card.title) return
      await requireService('sessionTitle', 'rename').rename(agent.session, card.title)
      lastTitles.set(agent, card.title)
    }).finally(() => { if (titleSync.get(cardId) === pending) titleSync.delete(cardId) })
    titleSync.set(cardId, pending)
    return pending
  }

  const dispose = (sessionId) => {
    for (const disposer of scoped.get(sessionId)?.disposers ?? []) {
      try { disposer() } catch (error) { warn(`释放会话 ${sessionId} 的工具失败`, error) }
    }
    scoped.delete(sessionId)
  }

  const attachAgent = (agent, cardId) => {
    if (attaching.has(agent)) return attaching.get(agent)
    const sessionId = agent.id
    const assertCurrent = () => {
      requireMapping(cardId, sessionId)
      if (disposedAgents.has(agent)) throw Object.assign(new Error('会话执行器已释放'), { code: 'card-session-stale' })
    }
    const pending = (async () => {
      assertCurrent()
      if (scoped.get(sessionId)?.agent === agent) return
      if (typeof agent.ctx?.tools?.register !== 'function') throw new Error(`会话 ${sessionId} 无法注册卡片工具`)
      await ensureDirs(cardId)
      assertCurrent()
      await requireService('workingDirectory', 'set').set(agent, paths.cardDir(cardId))
      assertCurrent()
      dispose(sessionId)
      const disposers = []
      try {
        for (const definition of createCardTools({ ctx, paths, cards, refresh, sessionId, cardId })) {
          disposers.push(agent.ctx.tools.register(definition))
        }
        if (typeof agent.ctx.systemPrompt?.section === 'function') {
          disposers.push(agent.ctx.systemPrompt.section({ name: 'open-desktop-card', order: 900, text: CARD_PROMPT }))
        }
        scoped.set(sessionId, { agent, disposers })
        await syncTitle(cardId, agent)
        assertCurrent()
      } catch (error) {
        if (scoped.get(sessionId)?.agent === agent) scoped.delete(sessionId)
        for (const disposer of disposers) {
          try { disposer() } catch (cause) { warn(`回滚会话 ${sessionId} 的工具失败`, cause) }
        }
        throw error
      }
      notice()
    })().finally(() => attaching.delete(agent))
    attaching.set(agent, pending)
    return pending
  }

  const attach = async (sessionId, cardId = sessionId) => attachAgent(await resolveAgent(sessionId), cardId)

  const createNative = async (wanted) => {
    requireService('workingDirectory', 'set')
    requireService('sessionTitle', 'rename')
    const target = await ensureWorkspace()
    return controller().create({ sessionId: wanted, workspaceId: target.id })
  }

  const create = async ({ title = '新卡片', size, refresh: refreshSpec } = {}) => {
    const wanted = newCardId()
    const created = await createNative(wanted)
    const sessionId = String(created?.sessionId ?? wanted)
    await ensureDirs(sessionId)
    await ensureViewScaffold(paths, sessionId)
    const card = await cards.put({ id: sessionId, sessionId, title, size, refresh: refreshSpec, building: true, order: cards.list().length })
    await attach(sessionId)
    notice()
    return card
  }

  const executorOf = (id) => {
    const card = cards.get(String(id ?? ''))
    return card?.sessionId ?? String(id ?? '')
  }

  const ensureExecutor = (cardId) => {
    if (preparing.has(cardId)) return preparing.get(cardId)
    const pending = (async () => {
      const card = cards.get(String(cardId ?? ''))
      if (card === null) throw Object.assign(new Error('没有这张卡片'), { code: 'not-found' })
      const current = card.sessionId || card.id
      requireMapping(card.id, current)
      let agent
      try {
        agent = await resolveAgent(current)
      } catch (error) {
        if (!missingSession(error)) throw error
        requireMapping(card.id, current)
        const wanted = 'session-exec-' + randomUUID().replace(/-/g, '').slice(0, 16)
        const created = await createNative(wanted)
        const executorId = String(created?.sessionId ?? wanted)
        requireMapping(card.id, current)
        await cards.patch(card.id, { sessionId: executorId })
        await attach(executorId, card.id)
        notice()
        return { executorSessionId: executorId, created: true }
      }
      await attachAgent(agent, card.id)
      requireMapping(card.id, current)
      return { executorSessionId: current, created: false }
    })().finally(() => preparing.delete(cardId))
    preparing.set(cardId, pending)
    return pending
  }

  const prepare = async (cardId) => {
    const { executorSessionId } = await ensureExecutor(cardId)
    requireMapping(cardId, executorSessionId)
    return { sessionId: executorSessionId }
  }

  const start = async () => {
    if (!listening && typeof ctx.on === 'function') {
      listening = true
      lifecycleDisposers.push(ctx.on('agent/created', async ({ agent }) => {
        const card = cards.list().find(item => item.sessionId === agent.id)
        if (closed || !card || deleting.has(card.id)) return
        try { await attachAgent(agent, card.id) } catch (error) {
          if (error?.code !== 'card-session-stale') throw error
        }
      }, { global: true }))
      lifecycleDisposers.push(ctx.on('agent/disposed', ({ agent }) => {
        disposedAgents.add(agent)
        if (scoped.get(agent.id)?.agent === agent) dispose(agent.id)
      }, { global: true }))
      // 一轮结束时如果还挂着 building，说明 agent 没走到 card_finish：判定构建结束（失败）。
      lifecycleDisposers.push(ctx.on('agent/turn-stopping', ({ agent }) => {
        const card = cards.list().find(item => item.sessionId === agent.id)
        if (closed || card === undefined || deleting.has(card.id)) return
        void settleBuilding(card)
      }, { global: true }))
      // 兜底：会话恢复失败等情况下 turn-stopping 不会来，别让 building 永久占着并发名额。
      const sweep = setInterval(() => {
        if (closed) return
        for (const card of cards.list()) {
          if (card.building !== true) continue
          const agent = scoped.get(card.sessionId)?.agent
          if (agent === undefined || agent.status !== 'running') void settleBuilding(card)
        }
      }, 60_000)
      if (typeof sweep.unref === 'function') sweep.unref()
      lifecycleDisposers.push(() => clearInterval(sweep))
    }
    const target = await ensureWorkspace()
    // Older card sessions stored the card directory as their header cwd and
    // therefore sit outside the shared workspace; bring them in without
    // losing ids or history.
    try {
      const outcome = await migrateCardSessions({ ctx, paths, workspace: target })
      if (outcome.migrated > 0) notice()
    } catch (error) { warn('迁移旧卡片会话失败', error) }
    // Reattach existing sessions for native sidebar navigation, without replacing missing history.
    for (const card of cards.list()) {
      if (closed) return
      try {
        await attach(card.sessionId, card.id)
        // 重启后仍挂 building、但 agent 已经空闲：上一次生成死在了半路。
        const agent = scoped.get(card.sessionId)?.agent
        if (agent !== undefined && agent.status !== 'running') await settleBuilding(card)
      } catch (error) {
        if (missingSession(error)) await settleBuilding(card)
        warn(`恢复卡片「${card.title}」会话失败`, error)
      }
    }
  }

  const prompt = async (id, text) => {
    const { sessionId } = await prepare(id)
    return controller().prompt({
      requestId: randomUUID(), sessionId, mode: 'queue',
      content: [{ type: 'text', text: String(text ?? '').slice(0, 8000) }],
      clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }, new AbortController().signal)
  }

  const inspect = async (id, signal) => {
    const controllerV = controller()
    const card = cards.get(String(id ?? ''))
    const sessionId = card !== null ? (await ensureExecutor(card.id)).executorSessionId : executorOf(id)
    if (typeof controllerV.inspect === 'function') return controllerV.inspect(sessionId, signal)
    if (typeof controllerV.events === 'function') {
      const page = await controllerV.events({ address: { kind: 'session', sessionId }, maxMessages: 80 }, signal ?? new AbortController().signal)
      return { events: (page?.records ?? []).filter(record => record?.type === 'event' && record.event).map(record => record.event) }
    }
    throw Object.assign(new Error('会话服务不支持读取'), { code: 'no-inspect' })
  }

  const follow = (id, signal) => controller().follow?.({ address: { kind: 'session', sessionId: executorOf(id) }, assistantStream: true }, signal) ?? (async function* () {})()
  const cancel = id => controller().cancel?.({ sessionId: executorOf(id) })
  const remove = async (id) => {
    const cardId = String(id)
    deleting.add(cardId)
    try {
      dispose(executorOf(cardId))
      dispose(cardId)
      await cards.remove(cardId)
      notice()
    } finally { deleting.delete(cardId) }
  }
  const disposeAll = () => {
    closed = true
    for (const disposeListener of lifecycleDisposers.splice(0)) disposeListener()
    for (const id of [...scoped.keys()]) dispose(id)
  }

  return { start, prepare, syncTitle, create, attach, ensureExecutor, prompt, inspect, follow, cancel, remove, dispose, disposeAll }
}
