// Exercise card/session ownership through the public DSH service boundary.
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makePaths, ensureLayout, readCard } from '../host/paths.js'
import { createCards } from '../host/cards.js'
import { createSessions } from '../host/sessions.js'
import { apply } from '../index.js'
import { EventEmitter } from 'node:events'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }
const failure = (run) => Promise.resolve().then(run).then(() => null, error => error)
const root = await mkdtemp(join(tmpdir(), 'od-sessions-'))
const paths = makePaths(root)
await ensureLayout(paths)
const cards = createCards({ paths })
await cards.start()

const registered = new Map()
const definitions = new Map()
const agents = new Map()
const workspaces = new Map()
const prompts = []
const creates = []
const transient = new Set()
let workspaceCreates = 0
const workspaceRegistry = {
  get: id => workspaces.get(id),
  async resolveByPath(path) { return [...workspaces.values()].find(workspace => workspace.path === path) },
  async create(path, title) {
    workspaceCreates += 1
    const workspace = { id: 'workspace-' + workspaceCreates, path, title, sessionIds: [] }
    workspaces.set(workspace.id, workspace)
    return workspace
  },
}
function makeAgent(id, cwd) {
  const tools = new Set()
  registered.set(id, tools)
  const agent = {
    id, session: { header: { id, cwd }, events: ['existing history'] },
    ctx: {
      tools: { register(definition) { if (tools.has(definition.name)) throw new Error('duplicate tool'); tools.add(definition.name); definitions.set(id + ':' + definition.name, definition); return () => { tools.delete(definition.name); definitions.delete(id + ':' + definition.name) } } },
      systemPrompt: { section: () => () => {} },
    },
  }
  agents.set(id, agent)
  return agent
}
const fakeController = {
  async create(request) {
    creates.push(request)
    if (request.workspaceId && request.cwd) throw new Error('workspaceId and cwd are mutually exclusive')
    const workspace = workspaces.get(request.workspaceId)
    makeAgent(request.sessionId, workspace?.path ?? request.cwd)
    workspace?.sessionIds.push(request.sessionId)
    return { sessionId: request.sessionId }
  },
  async resolveAgent(sessionId) {
    if (transient.has(sessionId)) throw Object.assign(new Error('temporarily unavailable'), { code: 'transport/offline' })
    const agent = agents.get(sessionId)
    if (!agent) throw Object.assign(new Error('session not found'), { code: 'session/not-found' })
    return { agent }
  },
  async prompt(request) { prompts.push({ ...request, cwd: agents.get(request.sessionId)?.directory }); return { accepted: true } },
  async events() { return { records: [{ type: 'event', event: { type: 'assistant/message', seq: 1 } }] } },
  async cancel() {},
}
const services = {
  sessionController: fakeController,
  workspaceRegistry,
  workingDirectory: { async set(agent, path) { agent.directory = path } },
  sessionTitle: { async rename(session, title) { session.title = title } },
}
const refresh = { snapshot: () => ({ paused: false, data: {} }), sync() {}, refresh() {} }
const lifecycle = new Map()
const on = (name, listener) => {
  const listeners = lifecycle.get(name) ?? new Set()
  listeners.add(listener); lifecycle.set(name, listeners)
  return () => listeners.delete(listener)
}
const emit = async (name, value) => { for (const listener of lifecycle.get(name) ?? []) await listener(value) }
const ctx = { get: name => services[name], on, logger: { warn() {} } }
const sessions = createSessions({ ctx, paths, cards, refresh })

await sessions.start?.()
check('startup registers the named workspace', [...workspaces.values()].some(workspace => workspace.path === paths.cards && workspace.title === 'Open-Desktop'))

const [card, second] = await Promise.all([
  sessions.create({ title: 'WiFi 质量', size: { w: 6, h: 5 }, view: 'auto' }),
  sessions.create({ title: '天气' }),
])
check('concurrent cards reuse one workspace', workspaceCreates === 1)
check('card creation uses workspaceId without cwd', creates.length === 2 && creates.every(request => request.workspaceId === 'workspace-1' && request.cwd === undefined))
check('both sessions are accounted in the workspace', workspaces.get('workspace-1')?.sessionIds.includes(card.sessionId) && workspaces.get('workspace-1')?.sessionIds.includes(second.sessionId))
check('card execution directory is separate from workspace identity', agents.get(card.sessionId)?.session.header.cwd === paths.cards && agents.get(card.sessionId)?.directory === paths.cardDir(card.id))
check('new card id remains stable', card.id.startsWith('session-card-'))
check('new card starts building', card.building === true)
check('card sidecar is persisted', (await readCard(paths, card.id))?.title === 'WiFi 质量')
check('card tools attach to its native session', ['card_read', 'card_update', 'card_set_refresh', 'card_refresh', 'card_check', 'card_finish', 'card_remove', 'card_open_folder'].every(name => registered.get(card.sessionId)?.has(name)))
check('native session title follows card title', agents.get(card.sessionId)?.session.title === 'WiFi 质量')

await sessions.prompt(card.id, '做一个 WiFi 卡片')
check('prompt uses the same session', prompts[0]?.sessionId === card.id && prompts[0]?.content?.[0]?.text === '做一个 WiFi 卡片')
check('working directory is set before prompt admission', prompts[0]?.cwd === paths.cardDir(card.id))
await cards.patch(card.id, { title: '网络状态' })
await sessions.syncTitle?.(card.id)
check('renaming a card updates the native title', agents.get(card.sessionId)?.session.title === '网络状态')

await cards.patch(card.id, { sessionId: 'missing-session' })
const ensured = await sessions.ensureExecutor(card.id)
check('a missing session gets a new executor', ensured.executorSessionId.startsWith('session-exec-') && ensured.created === true)
check('replacement is persisted in the sidecar', cards.get(card.id)?.sessionId === ensured.executorSessionId)
check('replacement is grouped in the shared workspace', workspaces.get('workspace-1')?.sessionIds.includes(ensured.executorSessionId))
check('replacement still works in the original card directory', agents.get(ensured.executorSessionId)?.directory === paths.cardDir(card.id))
const again = await sessions.ensureExecutor(card.id)
check('existing executor is reused', again.created === false && again.executorSessionId === ensured.executorSessionId)
const inspection = await sessions.inspect(card.id)
check('inspect supports cold event reads', inspection.events.length === 1)

const beforeTransient = creates.length
transient.add(second.sessionId)
const unavailable = await failure(() => sessions.ensureExecutor(second.id))
check('transient errors propagate without replacing history', unavailable?.code === 'transport/offline' && creates.length === beforeTransient && cards.get(second.id).sessionId === second.sessionId)
transient.delete(second.sessionId)

const legacy = await cards.put({ id: 'session-card-legacy', sessionId: 'session-card-legacy', title: '旧卡片', building: false })
makeAgent(legacy.sessionId, paths.cardDir(legacy.id))
const beforeLegacy = creates.length
await sessions.prepare?.(legacy.id)
check('preparing legacy cards preserves session identity and history', creates.length === beforeLegacy && cards.get(legacy.id).sessionId === legacy.sessionId && agents.get(legacy.sessionId).session.events[0] === 'existing history')
check('legacy native opens attach card tools', registered.get(legacy.sessionId)?.has('card_read'))

sessions.disposeAll()
const restarted = createSessions({ ctx, paths, cards, refresh })
await restarted.start?.()
check('restart reuses the workspace', workspaceCreates === 1)
check('restart restores tools for native sidebar opens', registered.get(legacy.sessionId)?.has('card_read') && registered.get(ensured.executorSessionId)?.has('card_finish'))
await Promise.all([restarted.prepare?.(legacy.id), restarted.prepare?.(legacy.id)])
check('concurrent native opens keep one tool registration', registered.get(legacy.sessionId)?.size === 8)

const withoutDirectory = createSessions({ ctx: { get: name => name === 'workingDirectory' ? undefined : services[name] }, paths, cards, refresh })
const beforeUnsupported = creates.length
const unsupported = await failure(() => withoutDirectory.create({ title: 'unsupported' }))
check('missing directory service fails before creating a session', unsupported !== null && creates.length === beforeUnsupported)

// DSH returns domain failures in a result envelope as well as throwing transport failures.
const resolveOriginal = fakeController.resolveAgent
const resultCard = await restarted.create({ title: 'Result errors' })
const missingError = Object.assign(new Error('missing persisted session'), { code: 'session/not-found' })
fakeController.resolveAgent = async id => id === resultCard.sessionId ? { error: missingError } : resolveOriginal(id)
const recovered = await restarted.prepare(resultCard.id).catch(error => ({ error }))
check('missing-session result creates a replacement executor', recovered.sessionId?.startsWith('session-exec-') && cards.get(resultCard.id).sessionId === recovered.sessionId)
const transientError = Object.assign(new Error('resume unavailable'), { code: 'session/unavailable' })
fakeController.resolveAgent = async id => id === second.sessionId ? { error: transientError } : resolveOriginal(id)
const resultFailure = await failure(() => restarted.prepare(second.id))
check('transient result preserves its error and original session', resultFailure === transientError && cards.get(second.id).sessionId === second.sessionId)
restarted.dispose(second.sessionId)
const attachFailure = await failure(() => restarted.attach(second.sessionId, second.id))
check('failed native attachment does not silently succeed', attachFailure === transientError)
fakeController.resolveAgent = resolveOriginal
await restarted.remove(resultCard.id)
restarted.disposeAll()

// Native agent creation is serial; re-resolving inside its hook would block creation.
const cold = await cards.put({ id: 'session-card-cold', sessionId: 'session-card-cold', title: 'Cold resume' })
transient.add(cold.sessionId)
const native = createSessions({ ctx, paths, cards, refresh })
await native.start()
transient.delete(cold.sessionId)
const nativeAgent = makeAgent(cold.sessionId, paths.cards)
let announcing = false
fakeController.resolveAgent = async id => {
  if (id !== cold.sessionId) return resolveOriginal(id)
  if (announcing) return { error: Object.assign(new Error('not ready during announcement'), { code: 'session/unavailable' }) }
  announcing = true
  try { await emit('agent/created', { agent: nativeAgent }); return { agent: nativeAgent } }
  finally { announcing = false }
}
await fakeController.resolveAgent(cold.sessionId)
check('native sidebar resume repairs failed startup attachment', registered.get(cold.sessionId)?.size === 8 && nativeAgent.directory === paths.cardDir(cold.id))
fakeController.resolveAgent = resolveOriginal

const deletingCard = await native.create({ title: 'Delete while preparing' })
native.dispose(deletingCard.sessionId)
let directoryEntered, finishDirectory
const entered = new Promise(resolve => { directoryEntered = resolve })
const directoryGate = new Promise(resolve => { finishDirectory = resolve })
const originalSet = services.workingDirectory.set
services.workingDirectory.set = async (agent, path) => {
  if (agent.id === deletingCard.sessionId) { directoryEntered(); await directoryGate }
  return originalSet(agent, path)
}
const pendingPrepare = native.prepare(deletingCard.id).then(value => ({ value }), error => ({ error }))
await entered
await native.remove(deletingCard.id)
finishDirectory()
const deletedResult = await pendingPrepare
check('deletion invalidates pending native preparation', deletedResult.error !== undefined && cards.get(deletingCard.id) === null)
check('deleted cards cannot regain tools after an async wait', registered.get(deletingCard.sessionId)?.size === 0)
services.workingDirectory.set = originalSet
await emit('agent/disposed', { agent: nativeAgent })
check('native disposal releases card tools', registered.get(cold.sessionId)?.size === 0)
native.disposeAll()

// Verify host assembly: disk restore and both UI/tool title changes reach DSH.
const routes = new Map(), disposers = [], warnings = []
let onRename = () => {}
const renamed = new Set()
let finishStartup
const startup = new Promise(resolve => { finishStartup = resolve })
services.sessionTitle.rename = async (session, title) => {
  session.title = title
  renamed.add(session.header.id)
  if (renamed.size === cards.list().length) finishStartup()
  onRename(title)
}
apply({
  get: name => services[name],
  logger: { warn: message => warnings.push(message) },
  effect(fn) { disposers.push(fn()) },
  webServer: {
    getOrigin: () => 'http://localhost',
    register(route) { routes.set(route.path, route); return () => routes.delete(route.path) },
  },
}, { dataDir: root })
async function bounded(promise) {
  let timer
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('host assembly timed out')), 3000) })]) }
  finally { clearTimeout(timer) }
}
await bounded(startup)
await new Promise(setImmediate)
check('host startup restores native card tools', registered.get(legacy.sessionId)?.size === 8 && workspaceCreates === 1)
const uiRename = new Promise(resolve => { onRename = title => { if (title === 'UI rename') resolve() } })
const req = new EventEmitter()
req.method = 'POST'; req.headers = { origin: 'http://localhost' }
let response
const request = routes.get('/open-desktop/api').handler(req, { writeHead() {}, end(value) { response = JSON.parse(value) } })
req.emit('data', Buffer.from(JSON.stringify({ action: 'card-update', payload: { id: legacy.id, title: 'UI rename' } })))
req.emit('end')
await request
await bounded(uiRename)
check('UI card rename synchronizes the actual native title', response.ok && agents.get(legacy.sessionId).session.title === 'UI rename')
const toolRename = new Promise(resolve => { onRename = title => { if (title === 'Tool rename') resolve() } })
await definitions.get(legacy.sessionId + ':card_update').execute({ title: 'Tool rename' }, { agent: agents.get(legacy.sessionId) })
await bounded(toolRename)
check('card tool rename synchronizes the actual native title', agents.get(legacy.sessionId).session.title === 'Tool rename')
for (const disposer of disposers.reverse()) disposer?.()
check('host assembly finishes without warnings', warnings.length === 0, warnings)
await rm(root, { recursive: true, force: true })
const failed = checks.filter(item => !item.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map(item => item.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
