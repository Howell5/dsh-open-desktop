import React from 'react'
import { createRoot } from 'react-dom/client'
import plugin from '../../src/client/main.js'

const NOW = Date.now()

function view(title, value, note) {
  return {
    html: `<div class="od-view"><div class="v-label">${title}</div><div class="v-hero">${value}</div><div class="v-note">${note}</div></div>`,
    css: '.od-view{display:flex;flex-direction:column;gap:6px;height:100%;justify-content:center}.v-label{font-size:11px;color:var(--od-fg-3)}.v-hero{font-size:34px;font-weight:600;letter-spacing:-.03em;font-variant-numeric:tabular-nums}.v-note{font-size:11px;color:var(--od-fg-2)}',
    js: '',
    missing: false,
  }
}

let cards = [
  { id: 'card-a', title: '今日营收', size: { w: 6, h: 4 }, view: view('今日营收', '¥ 128,430', '较昨日 +12.4%') },
  { id: 'card-b', title: '接口健康', size: { w: 6, h: 4 }, view: view('接口健康', '99.98%', '过去 24 小时') },
  { id: 'card-c', title: '待办', size: { w: 4, h: 3 }, view: view('待办', '7', '3 项逾期') },
  { id: 'card-d', title: '构建队列', size: { w: 4, h: 3 }, view: view('构建队列', '2', '平均 3m 12s') },
  { id: 'card-e', title: '存储用量', size: { w: 4, h: 3 }, view: view('存储用量', '68%', '412 GB / 600 GB') },
  { id: 'card-f', title: '最近部署', size: { w: 12, h: 3 }, view: view('最近部署', 'v0.3.0', '12 分钟前 · 成功') },
].map((card, index) => ({
  ...card,
  sessionId: card.id,
  order: index,
  building: false,
  viewWarnings: [],
  refresh: card.id === 'card-f' ? { template: 'demo', dailyAt: '10:00', everyMs: 86400000 } : { template: 'demo', everyMs: 60000 },
  everyMs: card.id === 'card-f' ? 86400000 : 60000,
  dailyAt: card.id === 'card-f' ? '10:00' : null,
  createdAt: NOW - 1000 * 60 * 60,
  updatedAt: NOW,
}))

const data = {}
for (const card of cards) {
  data[card.id] = { value: { ok: true }, fetchedAt: NOW - 1000 * 42, ttl: 120000, sourceRef: 'template:demo', error: null }
}

let serverNow = NOW
let stream = null

function state() {
  return {
    version: 1,
    serverNow: Date.now(),
    openAt: 0,
    chatOpenCardId: null,
    paused: false,
    maxBuilding: 8,
    cards,
    data,
    templates: [],
    design: { css: '', js: '' },
  }
}

class FakeEventSource {
  constructor() {
    this.listeners = {}
    stream = this
    setTimeout(() => {
      this.emit('open', {})
      this.emit('state', { data: JSON.stringify(state()) })
    }, 30)
  }
  addEventListener(name, fn) { (this.listeners[name] ??= []).push(fn) }
  removeEventListener(name, fn) { this.listeners[name] = (this.listeners[name] ?? []).filter(item => item !== fn) }
  emit(name, event) { for (const fn of this.listeners[name] ?? []) fn(event) }
  close() {}
}
FakeEventSource.prototype.addEventListener = FakeEventSource.prototype.addEventListener

window.EventSource = FakeEventSource
window.__harnessRequests = []
window.fetch = async (url, init) => {
  const request = init && init.body ? JSON.parse(init.body) : {}
  if (request.action) window.__harnessRequests.push(request.action + ':' + JSON.stringify(request.payload ?? {}))
  if (request.action === 'card-reorder') {
    const ids = request.payload.ids
    cards = ids.map((id, index) => ({ ...cards.find(card => card.id === id), order: index }))
    setTimeout(() => stream?.emit('state', { data: JSON.stringify(state()) }), 40)
    return { ok: true, json: async () => ({ ok: true, value: { reordered: true }, state: state() }) }
  }
  if (request.action === 'card-refresh') {
    for (const card of cards) data[card.id] = { ...data[card.id], fetchedAt: Date.now() }
    stream?.emit('state', { data: JSON.stringify(state()) })
    return { ok: true, json: async () => ({ ok: true, value: null, state: state() }) }
  }
  return { ok: true, json: async () => ({ ok: true, value: state(), state: state() }) }
}

let Main = null
const cleanups = []
const ctx = {
  effect(fn) { cleanups.push(fn()) },
  get(name) {
    if (name === 'sessions') return { retain() { return { release() {}, ready: Promise.resolve() } } }
    if (name === 'uiWorkspace') return { openSession() {} }
    return undefined
  },
  layout: {
    selectPanel() {},
    beginNavigation() { return new AbortController().signal },
  },
  slots: {
    inject(name, fn) { fn() },
    register(spec, type) {
      if (spec.name === 'main') Main = type
      return () => {}
    },
  },
}

plugin.apply(ctx)
if (Main === null) throw new Error('main panel was not registered')

const root = createRoot(document.getElementById('app'))
root.render(React.createElement(Main))
window.__harness = { get state() { return state() }, store: null }
