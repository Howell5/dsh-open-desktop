// Open Desktop · 板面聚合层
//
// 板面 = 同一组卡片的网格视图。这里不存卡片（card.json 是唯一真相源），
// 只负责：组装 State、执行动作、广播变更。
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { TEMPLATE_LIST } from './templates.js'
import { cardTurns } from './turns.js'
import { CARD_OPENING } from './sessions.js'
import { DESIGN, SCAFFOLD } from './design-system/index.js'
import { readViewSync } from './views.js'

// 同时生成中的卡片上限：不排队，超出直接拒绝并提示。
const MAX_BUILDING_CARDS = 8

export function createBoard({ ctx, paths, cards, refresh, sessions }) {
  const listeners = new Set()
  let paused = false
  let openAt = 0
  let chatOpenCardId = null
  let creating = 0

  const subscribe = (fn) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
  const publish = () => {
    for (const fn of [...listeners]) {
      try { fn() } catch { /* 单个订阅者异常不影响其它 */ }
    }
  }

  // View files are small and inlined into State: the client renders them
  // synchronously and never races a second fetch.
  const inlineView = (card) => {
    const files = readViewSync(paths, card.id)
    if (files.html.trim() === '') {
      return { html: SCAFFOLD.html, css: SCAFFOLD.css, js: SCAFFOLD.js, missing: true }
    }
    return { html: files.html, css: files.css, js: files.js, missing: false }
  }

  const snapshot = () => {
    const data = refresh?.snapshot?.() ?? { paused, data: {} }
    return {
      version: 1,
      serverNow: Date.now(),
      openAt,
      chatOpenCardId,
      paused,
      cards: cards.list().map((card) => ({ ...card, view: inlineView(card) })),
      data: data.data,
      maxBuilding: MAX_BUILDING_CARDS,
      templates: TEMPLATE_LIST,
      design: { css: DESIGN.css, js: DESIGN.js },
    }
  }

  const requireCard = (id) => {
    const card = cards.get(String(id ?? ''))
    if (card === null) throw Object.assign(new Error(`没有卡片 ${id}`), { code: 'not-found' })
    return card
  }

  const createCard = async ({ text, title, size } = {}) => {
    const building = cards.list().filter((card) => card.building === true).length
    // creating 把「正在创建、还没写进 card.json」的请求也计入，避免连点越过上限。
    if (building + creating >= MAX_BUILDING_CARDS) {
      throw Object.assign(new Error(`同时最多生成 ${MAX_BUILDING_CARDS} 张卡片，等一张完成再继续。`), { code: 'build-limit' })
    }
    creating += 1
    try {
      const opening = String(text ?? '').trim()
      const card = await sessions.create({
        title: String(title ?? (opening === '' ? '新卡片' : opening.slice(0, 16))),
        size,
      })
      publish()
      if (opening !== '') await sessions.prompt(card.id, CARD_OPENING + opening)
      publish()
      return card
    } finally {
      creating -= 1
    }
  }

  const prompt = async ({ id, text } = {}) => {
    const card = requireCard(id)
    const content = String(text ?? '').trim()
    if (content === '') throw Object.assign(new Error('说点什么吧'), { code: 'empty' })
    await sessions.prompt(card.id, content)
    publish()
    return { accepted: true }
  }

  const update = async ({ id, title, size, order, refresh: refreshSpec } = {}) => {
    const card = requireCard(id)
    const fields = {}
    if (typeof title === 'string' && title.trim() !== '') fields.title = title.trim().slice(0, 60)
    if (size !== undefined) fields.size = size
    if (order !== undefined && Number.isFinite(order)) fields.order = Math.max(0, Math.round(order))
    if (refreshSpec !== undefined) fields.refresh = refreshSpec
    if (Object.keys(fields).length === 0) throw Object.assign(new Error('没有要修改的字段'), { code: 'empty-update' })
    const next = await cards.patch(card.id, fields)
    try { refresh?.sync(cards.list()) } catch { /* 忽略 */ }
    publish()
    return next
  }

  const remove = async ({ id } = {}) => {
    const card = requireCard(id)
    await sessions.remove(card.id)
    try { refresh?.sync(cards.list()) } catch { /* 忽略 */ }
    publish()
    return { removed: card.title }
  }

  const reorder = async ({ ids } = {}) => {
    const list = Array.isArray(ids) ? ids.map(String) : []
    const current = cards.list().map((card) => card.id)
    if (list.length !== current.length || new Set(list).size !== list.length || !list.every((id) => current.includes(id))) {
      throw Object.assign(new Error('排序必须包含全部卡片且不重复'), { code: 'bad-reorder' })
    }
    for (let index = 0; index < list.length; index += 1) await cards.patch(list[index], { order: index })
    publish()
    return { reordered: true }
  }

  const setPaused = async ({ paused: next } = {}) => {
    paused = next === true
    if (paused) refresh?.pause?.()
    else refresh?.resume?.()
    publish()
    return { paused }
  }

  const refreshNow = async ({ id } = {}) => {
    const list = id === undefined ? cards.list() : [requireCard(id)]
    refresh?.refresh?.(list)
    publish()
    return { refreshed: list.length }
  }

  const inspect = async ({ id } = {}) => {
    const card = requireCard(id)
    const result = await sessions.inspect(card.id)
    return { events: Array.isArray(result?.events) ? result.events : [] }
  }

  const cancel = ({ id } = {}) => {
    try { sessions.cancel(requireCard(id).id) } catch { /* 忽略 */ }
    publish()
    return { cancelled: true }
  }

  const turns = async ({ id } = {}) => {
    const card = requireCard(id)
    const result = await sessions.inspect(card.id)
    return cardTurns(Array.isArray(result?.events) ? result.events : [], card)
  }

  /** 从调用方持有的事件窗口折叠 Turn，避免流式通道每帧重新 inspect。 */
  const turnsFrom = ({ id, events } = {}) => {
    const card = requireCard(id)
    return cardTurns(Array.isArray(events) ? events : [], card)
  }

  const hasCard = (id) => cards.get(String(id ?? '')) !== null

  const view = async ({ id } = {}) => {
    const card = requireCard(id)
    return inlineView(card)
  }

  const rendererFetch = async ({ id, url } = {}) => {
    requireCard(id)
    const target = String(url ?? '')
    if (!/^https?:\/\//.test(target)) throw Object.assign(new Error('只能请求 http(s) 地址'), { code: 'bad-url' })
    const response = await fetch(target, { signal: AbortSignal.timeout(8000), headers: { accept: '*/*' } })
    const body = await response.text()
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: body.slice(0, 512 * 1024),
    }
  }

  const requestOpen = () => {
    openAt = Date.now()
    publish()
    return { openAt }
  }

  const openChat = ({ id } = {}) => {
    const card = requireCard(id)
    chatOpenCardId = card.id
    openAt = Date.now()
    publish()
    return { chatOpenCardId }
  }

  const closeChat = () => {
    chatOpenCardId = null
    publish()
    return { chatOpenCardId: null }
  }

  const clientLog = async (entry) => {
    try {
      await mkdir(paths.logs, { recursive: true })
      const line = JSON.stringify({ at: Date.now(), ...(entry && typeof entry === 'object' ? entry : { message: String(entry) }) })
      await appendFile(join(paths.logs, 'client.jsonl'), line + '\n', 'utf8')
      return { logged: true }
    } catch {
      return { logged: false }
    }
  }

  return {
    subscribe,
    publish,
    snapshot,
    createCard,
    prepareSession: ({ id } = {}) => sessions.prepare(requireCard(id).id),
    prompt,
    update,
    remove,
    reorder,
    setPaused,
    refresh: refreshNow,
    inspect,
    cancel,
    turns,
    turnsFrom,
    hasCard,
    view,
    rendererFetch,
    requestOpen,
    openChat,
    closeChat,
    clientLog,
    get paused() { return paused },
  }
}
