// View files are the only rendering source for a card.
//   cards/<id>/view/index.html + style.css + view.js
// This module owns reading, scaffolding and the one-time v3 migration.

import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { writeJsonAtomic, normalizeCard } from './paths.js'
import { SCAFFOLD } from './design-system/index.js'

const VIEW_FILES = ['index.html', 'style.css', 'view.js']

export function readViewSync(paths, id) {
  const dir = paths.viewDir(id)
  const read = (name) => {
    try { return readFileSync(join(dir, name), 'utf8') } catch { return '' }
  }
  return {
    html: read('index.html'),
    css: read('style.css'),
    js: read('view.js'),
    readme: read('README.md'),
  }
}

/** Create view files for cards that have none. Never overwrites a non-empty view. */
export async function ensureViewScaffold(paths, id) {
  const dir = paths.viewDir(id)
  await mkdir(dir, { recursive: true })
  const current = readViewSync(paths, id)
  const hasAny = current.html.trim() !== '' || current.css.trim() !== '' || current.js.trim() !== ''
  if (hasAny) {
    // A custom view keeps its code, but still gets the design-system guide.
    if (current.readme.trim() === '') {
      await writeFile(join(dir, 'README.md'), SCAFFOLD.readme, 'utf8')
      return { created: false, documented: true }
    }
    return { created: false }
  }
  await writeFile(join(dir, 'index.html'), SCAFFOLD.html, 'utf8')
  await writeFile(join(dir, 'style.css'), SCAFFOLD.css, 'utf8')
  await writeFile(join(dir, 'view.js'), SCAFFOLD.js, 'utf8')
  await writeFile(join(dir, 'README.md'), SCAFFOLD.readme, 'utf8')
  return { created: true }
}

/**
 * v2 -> v3: drop `view.kind`, keep custom view files, scaffold auto cards.
 * Runs once at host startup and is safe to run repeatedly.
 */
export async function migrateViews(paths, log = () => {}) {
  let entries = []
  try { entries = await readdir(paths.cards, { withFileTypes: true }) } catch { return { migrated: 0, scaffolded: 0 } }
  let migrated = 0
  let scaffolded = 0
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const id = entry.name
    const file = paths.cardFile(id)
    let raw
    try { raw = JSON.parse(await readFile(file, 'utf8')) } catch { continue }
    const hadView = Object.prototype.hasOwnProperty.call(raw, 'view')
    const oldKind = raw?.view?.kind
    let changed = false
    if (hadView) { delete raw.view; changed = true }
    if (raw.version !== 3) { raw.version = 3; changed = true }
    if (changed) {
      try { await copyFile(file, `${file}.bak-v3`) } catch { /* backup is best effort */ }
      await writeJsonAtomic(file, normalizeCard(raw, { id }))
      migrated += 1
      log(`view migration: ${id} (${oldKind ?? 'no-view'} -> iframe)`)
    }
    const result = await ensureViewScaffold(paths, id)
    if (result.created) {
      scaffolded += 1
      log(`view scaffold: ${id}`)
    }
  }
  return { migrated, scaffolded }
}

export { VIEW_FILES }
