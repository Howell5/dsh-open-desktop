// Open Desktop v3 · 卡片注册表（内存视图 + card.json 侧车）
//
// 板面、采集器、Web 都只通过这里读写卡片。每次变更写侧车并广播，保证
// 磁盘（card.json）是唯一真相源，内存只是它的视图。
import { ensureLayout, listCards, readCard, writeCard, trashCard } from './paths.js'

export function createCards({ paths, onChange }) {
  const map = new Map() // id -> card
  let started = false

  const notify = (type, id) => {
    try { onChange?.({ type, id, cards: list() }) } catch { /* 订阅者异常不能影响写盘 */ }
  }

  const list = () => [...map.values()].sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)

  const start = async () => {
    if (started) return
    started = true
    await ensureLayout(paths)
    for (const card of await listCards(paths)) map.set(card.id, card)
  }

  const get = (id) => map.get(id) ?? null

  const put = async (patch) => {
    const id = String(patch?.id ?? '')
    if (id === '') throw Object.assign(new Error('缺少卡片 id'), { code: 'bad-card' })
    const existing = map.get(id) ?? await readCard(paths, id) ?? null
    const merged = {
      ...(existing ?? {}),
      ...patch,
      id,
      sessionId: String(patch?.sessionId ?? existing?.sessionId ?? id),
      createdAt: existing?.createdAt ?? patch?.createdAt,
    }
    const saved = await writeCard(paths, merged)
    map.set(saved.id, saved)
    notify(existing === null ? 'add' : 'update', id)
    return saved
  }

  const remove = async (id) => {
    const card = map.get(id) ?? null
    await trashCard(paths, id)
    map.delete(id)
    notify('remove', id)
    return card
  }

  /** 只改 UI 配置（尺寸/顺序/标题），不触发采集器重建。 */
  const patch = async (id, fields) => put({ ...(map.get(id) ?? {}), ...fields, id })

  return { start, list, get, put, patch, remove, get size() { return map.size } }
}
