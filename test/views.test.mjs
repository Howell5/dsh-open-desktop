// View files: scaffold, v3 migration, never overwrite an existing view.
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makePaths, ensureLayout, readCard } from '../host/paths.js'
import { ensureViewScaffold, migrateViews, readViewSync } from '../host/views.js'
import { lintView } from '../host/view-lint.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }

const root = await mkdtemp(join(tmpdir(), 'od-views-'))
const paths = makePaths(root)
await ensureLayout(paths)

// New card with no view files gets a runnable scaffold.
const fresh = 'session-card-fresh'
await mkdir(paths.cardDir(fresh), { recursive: true })
await writeFile(paths.cardFile(fresh), JSON.stringify({ id: fresh, version: 3, title: '新卡', size: { w: 6, h: 4 } }))
const scaffolded = await ensureViewScaffold(paths, fresh)
const freshView = readViewSync(paths, fresh)
check('scaffold is created for an empty view', scaffolded.created && freshView.html.includes('id="app"') && freshView.js.includes('dshWidget.onData'))
check('scaffold passes the view gate', lintView(freshView).ok, JSON.stringify(lintView(freshView).errors))
await ensureViewScaffold(paths, fresh)
check('scaffold is idempotent', readViewSync(paths, fresh).html === freshView.html)

// v2 auto card: drop view.kind and give it the scaffold.
const autoId = 'session-card-auto'
await mkdir(paths.cardDir(autoId), { recursive: true })
const autoRaw = { id: autoId, version: 2, title: '旧自动卡', size: { w: 6, h: 4 }, view: { kind: 'auto' } }
await writeFile(paths.cardFile(autoId), JSON.stringify(autoRaw, null, 2))
const migrated = await migrateViews(paths)
const autoAfter = JSON.parse(await readFile(paths.cardFile(autoId), 'utf8'))
check('auto card loses view.kind and moves to v3', autoAfter.view === undefined && autoAfter.version === 3)
check('auto card gets a scaffold', readViewSync(paths, autoId).html.includes('id="app"'))
check('migration writes a backup', (await readFile(`${paths.cardFile(autoId)}.bak-v3`, 'utf8')).includes('"kind": "auto"'))
check('migration reports counts', migrated.migrated >= 1 && migrated.scaffolded >= 1, JSON.stringify(migrated))

// v2 custom card: keep its code, do not scaffold over it.
const customId = 'session-card-custom'
await mkdir(paths.viewDir(customId), { recursive: true })
await writeFile(join(paths.viewDir(customId), 'index.html'), '<div class="mine">mine</div>')
const customRaw = { id: customId, version: 2, title: '旧自定义卡', size: { w: 6, h: 4 }, view: { kind: 'custom' } }
await writeFile(paths.cardFile(customId), JSON.stringify(customRaw, null, 2))
await migrateViews(paths)
const customAfter = JSON.parse(await readFile(paths.cardFile(customId), 'utf8'))
const customView = readViewSync(paths, customId)
check('custom card keeps its own view', customAfter.view === undefined && customView.html.includes('mine'))
check('custom card is not overwritten with scaffold js', customView.js === '')
check('custom card gets the design guide', customView.readme.includes('设计系统'))

// Existing v3 card with no view is scaffolded without a backup rewrite.
const v3Id = 'session-card-v3'
await mkdir(paths.cardDir(v3Id), { recursive: true })
await writeFile(paths.cardFile(v3Id), JSON.stringify({ id: v3Id, version: 3, title: 'v3', size: { w: 6, h: 4 } }))
await migrateViews(paths)
check('v3 card is scaffolded', readViewSync(paths, v3Id).html.includes('id="app"'))
check('v3 card keeps its sidecar readable', (await readCard(paths, v3Id))?.version === 3)

await rm(root, { recursive: true, force: true })
const failed = checks.filter(item => !item.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map(item => item.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
