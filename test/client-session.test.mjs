// Exercise the shipped module-loader entry and React event handlers without a browser dependency.
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const checks = []
const check = (name, ok) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name) }
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve() }
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }
let active
// dnd-kit 在模块初始化阶段就会调用 context/forwardRef；这里补齐最小的 API 面，
// 但故意不提供 version，让 src/client/dnd.js 判断为"非真实 React"并走空实现。
const React = {
  Component: class {},
  createElement: (type, props, ...children) => ({ type, props: { ...props, children: children.flat() } }),
  createContext: (value) => ({ Provider: props => props.children, Consumer: () => null, _currentValue: value }),
  forwardRef: (render) => render,
  memo: (render) => render,
  useContext: () => ({}),
  useCallback: (fn) => fn,
  useReducer: (reducer, initial) => [initial, () => {}],
  useState(initial) {
    const instance = active, index = instance.index++
    if (!(index in instance.hooks)) instance.hooks[index] = typeof initial === 'function' ? initial() : initial
    return [instance.hooks[index], value => { instance.hooks[index] = typeof value === 'function' ? value(instance.hooks[index]) : value }]
  },
  useRef(initial) {
    const instance = active, index = instance.index++
    return instance.hooks[index] ??= { current: initial }
  },
  useMemo(factory) { return factory() },
  useEffect(effect, deps) {
    const instance = active, index = instance.index++
    const previous = instance.hooks[index]
    if (!previous || !deps || deps.some((value, i) => value !== previous.deps[i])) {
      instance.effects.push(() => { previous?.cleanup?.(); instance.hooks[index] = { deps, cleanup: effect() } })
    }
  },
}
React.useLayoutEffect = React.useEffect
function mount(type, props = {}, dom = null) {
  const instance = { hooks: [], effects: [], index: 0, props }
  instance.render = () => {
    active = instance; instance.index = 0
    const tree = type(instance.props)
    if (dom && tree?.props.ref) tree.props.ref.current = dom
    for (const effect of instance.effects.splice(0)) effect()
    return tree
  }
  instance.unmount = () => { for (const hook of instance.hooks) hook?.cleanup?.() }
  return instance
}
function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null
  if (predicate(tree)) return tree
  for (const child of tree.props?.children ?? []) { const found = find(child, predicate); if (found) return found }
  return null
}
function findAll(tree, predicate, out = []) {
  if (!tree || typeof tree !== 'object') return out
  if (predicate(tree)) out.push(tree)
  for (const child of tree.props?.children ?? []) findAll(child, predicate, out)
  return out
}
const button = (tree, label) => find(tree, item => item.type === 'button' && item.props.children.includes(label))
const component = (tree, name) => find(tree, item => item.type?.name === name)
const slots = new Map(), cleanups = [], requests = [], opened = [], selected = [], references = [], frames = new Map()
let frameId = 0, stream, module, prepareGate
let navigation = new AbortController()
const layout = {
  beginNavigation() { navigation.abort(); navigation = new AbortController(); return navigation.signal },
  selectPanel(id) { navigation.abort(); selected.push(id) },
}
let state = {
  serverNow: Date.now(), openAt: 0,
  cards: [{ id: 'card-a', sessionId: 'exec-a', title: '天气', view: { html: '<div id="app" class="od-view"></div>', css: '', js: 'window.dshWidget.onData=function(){}' }, size: { w: 6, h: 4 } }, { id: 'card-b', sessionId: 'exec-b', title: '网络', refresh: { template: 'wifi', everyMs: 60000 } }],
  design: { css: '.od-view{display:flex}', js: 'window.od={}' },
  data: { 'card-a': { value: { n: 12 }, fetchedAt: Date.now() } },
}
const body = { dataset: {} }
let observeTheme
const window = {
  __ModuleLoader__: { load: descriptor => { module = descriptor.factory(() => React) } },
  setInterval: () => 1, clearInterval() {}, setTimeout: () => 1, clearTimeout() {},
  addEventListener() {}, removeEventListener() {},
  requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId },
  cancelAnimationFrame(id) { frames.delete(id) },
  matchMedia: () => ({ matches: false }),
}
const context = vm.createContext({
  window, document: { body, querySelector() { return null }, addEventListener() {}, removeEventListener() {} }, console,
  MutationObserver: class { constructor(fn) { observeTheme = fn } observe() {} disconnect() {} },
  EventSource: class { constructor() { stream = this; this.listeners = {} } addEventListener(name, fn) { this.listeners[name] = fn } removeEventListener() {} close() {} },
  fetch: async (_, options) => {
    const request = JSON.parse(options.body); requests.push(request)
    if (request.action === 'card-session' && prepareGate) await prepareGate.promise
    const value = request.action === 'card-session' ? { sessionId: state.cards.find(card => card.id === request.payload.id)?.sessionId } : state
    return { ok: true, json: async () => ({ ok: true, value, state }) }
  },
})
vm.runInContext(await readFile(new URL('../client.js', import.meta.url), 'utf8'), context)
module.apply({
  effect(fn) { cleanups.push(fn()) },
  get: name => name === 'sessions' ? {
    retain(sessionId) {
      const ready = deferred()
      const reference = { sessionId, ready: ready.promise, resolve: ready.resolve, reject: ready.reject, releases: 0, release() { this.releases++ } }
      references.push(reference)
      return reference
    },
  } : name === 'uiWorkspace' ? { openSession: id => { layout.selectPanel(null); opened.push(id) } } : undefined,
  layout,
  slots: { inject: (_, fn) => fn(), register: (spec, type) => { slots.set(spec.name, type); return () => {} } },
})
await flush()
const panelTree = slots.get('main')()
const boardElement = component(panelTree, 'Board')
const store = boardElement.props.store
check('initial polling unwraps the server state', store.getSnapshot().state?.widgets.length === 2)
stream.listeners.state({ data: JSON.stringify(state) })
const firstOpen = boardElement.props.openSession('card-a')
await flush()
check('native opens prepare the card before retaining its executor', requests.some(request => request.action === 'card-session' && request.payload.id === 'card-a') && references[0]?.sessionId === 'exec-a')
check('native navigation waits for session readiness', opened.length === 0)
const secondOpen = boardElement.props.openSession('card-b')
await flush()
references[1].resolve()
await secondOpen
references[0].resolve()
await firstOpen
check('the latest native open wins overlapping requests', opened.length === 1 && opened[0] === 'exec-b')
check('superseded references are released once', references[0].releases === 1)

const interruptedOpen = boardElement.props.openSession('card-a')
await flush()
layout.selectPanel('another-native-session')
check('native navigation immediately releases pending references', references[2].releases === 1)
references[2].resolve()
await interruptedOpen
check('native sidebar navigation supersedes a waiting card open', opened.length === 1)
prepareGate = deferred()
const preparingOpen = boardElement.props.openSession('card-a')
await flush()
const retainedBeforeNavigation = references.length
layout.selectPanel('another-panel')
prepareGate.resolve()
await preparingOpen
prepareGate = null
check('native navigation cancels cards still preparing on the host', references.length === retainedBeforeNavigation && opened.length === 1)

const Header = slots.get('conversation.session.header.actions')
check('card actions use the additive native header slot', typeof Header === 'function')
if (Header) {
  const wrapper = Header({ sessionId: 'exec-a' })
  const header = mount(wrapper.type, wrapper.props)
  let tree = header.render()
  check('card sessions offer preview and return actions', !!button(tree, '预览这张卡片') && !!button(tree, '返回板面'))
  button(tree, '预览这张卡片').props.onClick()
  tree = header.render()
  let previewElement = component(tree, 'CardPreview')
  check('preview opens inside the current session', !!previewElement && opened.length === 1)
  let shown = 0, closed = 0
  const preview = mount(previewElement.type, previewElement.props, { showModal() { shown++ }, close() { closed++ } })
  let previewTree = preview.render()
  check('preview uses a native dialog for keyboard focus', previewTree.type === 'dialog' && shown === 1)
  check('preview shares the board card renderer', !!component(previewTree, 'CardContent'))
  const contentElement = component(previewTree, 'CardContent')
  const content = mount(contentElement.type, contentElement.props)
  const contentTree = content.render()
  const viewElement = component(contentTree, 'CardView')
  const view = mount(viewElement.type, viewElement.props)
  const viewTree = view.render()
  const frame = find(viewTree, item => item.type === 'iframe')
  check('card content renders a sandbox iframe', frame?.props.sandbox === 'allow-scripts')
  check('iframe includes the design system', String(frame?.props.srcDoc).includes('.od-view') && String(frame?.props.srcDoc).includes('window.od'))
  check('iframe exposes dshWidget.save', String(frame?.props.srcDoc).includes('type:"save"'))
  check('iframe includes the card view code', String(frame?.props.srcDoc).includes('dshWidget.onData'))
  view.unmount()
  content.unmount()
  state = { ...state, cards: state.cards.map(card => ({ ...card, title: card.id === 'card-a' ? '本地天气' : card.title })), data: { 'card-a': { value: { n: 23 }, fetchedAt: Date.now() } } }
  stream.listeners.state({ data: JSON.stringify(state) })
  tree = header.render()
  previewElement = component(tree, 'CardPreview')
  preview.props = previewElement.props
  previewTree = preview.render()
  check('open previews receive updated titles and data', previewElement.props.widget.title === '本地天气' && component(previewTree, 'CardContent').props.dp.value.n === 23)
  body.dataset.dsDarkTheme = ''
  observeTheme?.()
  previewTree = preview.render()
  check('preview follows native theme changes', component(previewTree, 'CardContent').props.theme === 'dark')
  previewTree.props.onCancel({ preventDefault() {} })
  check('Escape dismisses the preview without navigation', !component(header.render(), 'CardPreview') && opened.length === 1)
  preview.unmount()
  check('preview cleanup closes the dialog', closed === 1)
  button(header.render(), '返回板面').props.onClick()
  check('return selects the board and records the right card', selected.at(-1) === 'open-desktop' && store.getSnapshot().focus?.id === 'card-a')
  let scrolled = 0, focused = 0, highlighted = 0
  const target = { dataset: { widgetId: 'card-a' }, scrollIntoView() { scrolled++ }, focus() { focused++ }, animate() { highlighted++ } }
  const board = mount(boardElement.type, boardElement.props, { querySelectorAll: () => [target] })
  board.render()
  for (const [id, callback] of frames) { frames.delete(id); callback() }
  check('return scrolls, focuses and highlights the card', scrolled === 1 && focused === 1 && highlighted === 1)
  check('board focus is consumed without reopening a session', store.getSnapshot().focus === null && opened.length === 1)

  // 静态卡：没有 refresh 来源时，不该永远转「取数中」
  const gridEl = component(board.render(), 'WidgetGrid')
  const grid = gridEl && mount(gridEl.type, gridEl.props, { getBoundingClientRect: () => ({ width: 1200 }), querySelectorAll: () => [] })
  const widgetEls = grid ? findAll(grid.render(), item => item.type?.name === 'WidgetCard') : []
  const staticEl = widgetEls.find(item => item.props.widget.id === 'card-a')
  check('board renders widget cards', !!staticEl)
  if (staticEl) {
    grid.unmount()
    const wc = mount(staticEl.type, { ...staticEl.props, now: Date.now() })
    const wcTree = wc.render()
    const dot = find(wcTree, item => item.props?.['data-state'] === 'static' && String(item.props?.className ?? '').includes('od-state-dot'))
    check('cards without a refresh source show a static dot', dot?.type === 'span' && String(dot.props.className).includes('od-state-dot'))
    check('static dot explains it does not auto-refresh', String(dot?.props?.title).includes('静态') && String(dot?.props?.title).includes('不自动刷新'))
    const contentEl = component(wcTree, 'CardContent')
    const contentMount = mount(contentEl.type, contentEl.props)
    const staticContent = contentMount.render()
    check('static cards render their view instead of a loading skeleton', !component(staticContent, 'LoadingView') && !!component(staticContent, 'CardView'))
    contentMount.unmount()
    wc.unmount()
    const buildingProps = { ...staticEl.props, widget: { ...staticEl.props.widget, building: true }, now: Date.now() }
    const building = mount(staticEl.type, buildingProps)
    const buildingTree = building.render()
    const buildingDot = find(buildingTree, item => item.props?.['data-state'] === 'loading' && String(item.props?.className ?? '').includes('od-state-dot'))
    check('a card still building shows a loading dot, not a static one', !!buildingDot && String(buildingDot.props.title).includes('构建中'))
    building.unmount()
  }

  // 属性弹窗：改名/尺寸之外的刷新频率
  const bWidget = widgetEls.find(item => item.props.widget.id === 'card-b')
  bWidget?.props.onEdit(bWidget.props.widget)
  const editElement = component(board.render(), 'EditCardDialog')
  check('edit dialog opens for a card with a data source', !!editElement)
  if (editElement) {
    const edit = mount(editElement.type, editElement.props)
    const editTree = edit.render()
    const label = node => Array.isArray(node?.props?.children) ? node.props.children.join('') : String(node?.props?.children ?? '')
    const presetLabels = findAll(editTree, item => String(item.props?.className ?? '').includes('od-chip')).map(label)
    check('edit dialog exposes frequency presets', presetLabels.includes('5 分钟') && presetLabels.includes('每天'))
    const editHints = findAll(editTree, item => String(item.props?.className ?? '').includes('od-hint-sm')).map(label).join(' ')
    check('edit dialog shows the current frequency', editHints.includes('每 1 分钟更新一次'))
    edit.unmount()
    editElement.props.onClose()
  }

  // 场景模板：分类 → 场景 → 填 prompt → 更新频率 → 创建
  const topBar = component(board.render(), 'TopBar')
  topBar.props.onAdd()
  const dialogElement = component(board.render(), 'NewCardDialog')
  check('new card dialog opens from the board', !!dialogElement)
  if (dialogElement) {
    const dialog = mount(dialogElement.type, dialogElement.props)
    const firstModal = component(dialog.render(), 'Modal')
    const modal = mount(firstModal.type, firstModal.props)
    const renderModal = function () {
      modal.props = component(dialog.render(), 'Modal').props
      return modal.render()
    }
    const textOf = node => {
      if (node === null || node === undefined || typeof node === 'boolean') return ''
      if (typeof node === 'string' || typeof node === 'number') return String(node)
      if (Array.isArray(node)) return node.map(textOf).join('')
      if (node.type === 'select') return String(node.props?.value ?? '')
      return textOf(node.props?.children)
    }
    const hints = tree => findAll(tree, item => String(item.props?.className ?? '').includes('od-hint-sm')).map(item => textOf(item)).join(' ')
    const sceneButtons = tree => findAll(tree, item => String(item.props?.className ?? '').split(' ').includes('od-scene'))
    const sceneTitle = item => textOf(item.props.children[0])
    let sceneTree = renderModal()
    const chips = findAll(sceneTree, item => item.type === 'button' && String(item.props?.className ?? '').includes('od-chip'))
    check('dialog offers six category chips', chips.slice(0, 6).map(item => item.props.children[0]).join(',') === '今天,工作,钱,信息,生活,数字资产')
    check('default category lists five scenes', sceneButtons(sceneTree).length === 5)
    const categoryLabels = ['今天', '工作', '钱', '信息', '生活', '数字资产']
    const counts = []
    for (const label of categoryLabels) {
      findAll(sceneTree, item => item.type === 'button' && String(item.props?.className ?? '').includes('od-chip') && textOf(item) === label)[0]?.props.onClick()
      sceneTree = renderModal()
      counts.push(sceneButtons(sceneTree).length)
    }
    check('each category offers its scenes', counts.join(',') === '5,7,5,5,5,5')
    check('free text defaults to daily at 10:00', hints(renderModal()).includes('每天 10:00 更新一次'))
    const firstScene = sceneButtons(sceneTree)[0]
    check('scene cards show a title and a value line', !!textOf(firstScene?.props?.children?.[0]) && !!textOf(firstScene?.props?.children?.[1]))
    const workChip = chips.find(item => item.props.children[0] === '工作')
    workChip?.props.onClick()
    sceneTree = renderModal()
    const healthScene = sceneButtons(sceneTree).find(item => sceneTitle(item) === '服务健康')
    check('service health scene is present', !!healthScene)
    healthScene?.props.onClick()
    sceneTree = renderModal()
    const promptInput = find(sceneTree, item => item.type === 'textarea')
    check('clicking a scene fills the prompt', promptInput?.props.value.includes('127.0.0.1:5434') === true)
    const activeScene = sceneButtons(sceneTree).filter(item => item.props['data-on'] === 'true')
    check('selected scene is highlighted', activeScene.length === 1 && sceneTitle(activeScene[0]) === '服务健康')
    check('scene recommends its own update frequency', hints(sceneTree).includes('每 30 秒更新一次'))
    const fiveMin = findAll(sceneTree, item => item.type === 'button' && item.props?.children?.[0] === '5 分钟')[0]
    fiveMin?.props.onClick()
    sceneTree = renderModal()
    check('quick frequency chips update the echo', hints(sceneTree).includes('每 5 分钟更新一次'))
    let created = null
    dialog.props = { ...dialog.props, onCreate: (text, title, size) => { created = { text, title, size } } }
    sceneTree = renderModal()
    sceneButtons(sceneTree).find(item => sceneTitle(item) === '服务健康').props.onClick()
    sceneTree = renderModal()
    button(sceneTree, '创建').props.onClick()
    check('creating from a scene passes title, size and schedule', created?.title === '服务健康' && created?.size?.w === 5 && created?.text.includes('everyMs=30000'))
    created = null
    findAll(sceneTree, item => item.type === 'button' && String(item.props?.className ?? '').includes('od-chip') && textOf(item) === '信息')[0].props.onClick()
    sceneTree = renderModal()
    sceneButtons(sceneTree).find(item => sceneTitle(item) === 'arXiv 新论文').props.onClick()
    sceneTree = renderModal()
    button(sceneTree, '创建').props.onClick()
    check('daily templates compose dailyAt into the prompt', created?.text.includes('dailyAt="10:00"') === true && created?.title === 'arXiv 新论文')
    let limited = 0
    created = null
    dialog.props = { ...dialog.props, buildingCount: 8, maxBuilding: 8, onLimit: () => { limited++ } }
    sceneTree = renderModal()
    button(sceneTree, '创建').props.onClick()
    check('creating is blocked with a notice at the build limit', limited === 1 && created === null)
    modal.unmount()
    dialog.unmount()
  }
  board.unmount()
  header.props = { ...header.props, sessionId: 'ordinary-session' }
  check('ordinary sessions have no card actions', header.render() === null)
  header.props = { ...header.props, sessionId: 'exec-a' }
  state = { ...state, cards: state.cards.map(card => ({ ...card, sessionId: card.id === 'card-a' ? 'replacement' : card.sessionId })) }
  stream.listeners.state({ data: JSON.stringify(state) })
  check('replaced executors lose their card actions', header.render() === null)
  header.props = { ...header.props, sessionId: 'replacement' }
  check('replacement executors get the card actions', !!button(header.render(), '预览这张卡片'))
  state = { ...state, cards: [] }
  stream.listeners.state({ data: JSON.stringify(state) })
  check('deleted cards lose their header actions', header.render() === null)
  header.unmount()
}
for (const cleanup of cleanups.reverse()) cleanup?.()
check('plugin teardown releases every retained reference once', references.every(reference => reference.releases === 1))
const failed = checks.filter(check => !check.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map(check => check.name) }, null, 2))
process.exitCode = failed.length ? 1 : 0
