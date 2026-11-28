// 插件从 Open Desktop 改名为 Little Widgets：老安装的数据目录和工作区要接得上。
import { mkdtemp, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { dataRoot, makePaths, ensureLayout } from '../host/paths.js'
import { createCards } from '../host/cards.js'
import { createSessions, WORKSPACE_TITLE } from '../host/sessions.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }

// ---- 数据目录 ----
const home = await mkdtemp(join(tmpdir(), 'lw-rename-'))
const env = { DSH_HOME: home }
check('新安装用 little-widgets', dataRoot(env) === join(home, 'little-widgets'), dataRoot(env))
await mkdir(join(home, 'open-desktop', 'cards'), { recursive: true })
check('只有旧目录时继续用 open-desktop', dataRoot(env) === join(home, 'open-desktop'), dataRoot(env))
await mkdir(join(home, 'little-widgets'), { recursive: true })
check('两个都在时用新目录', dataRoot(env) === join(home, 'little-widgets'), dataRoot(env))

// ---- 工作区标题 ----
for (const legacy of ['Open-Desktop', 'Open Desktop']) {
  const root = await mkdtemp(join(tmpdir(), 'lw-ws-'))
  const paths = makePaths(root)
  await ensureLayout(paths)
  const cards = createCards({ paths })
  await cards.start()
  const workspace = { id: 'ws-1', path: paths.cards, title: legacy, sessionIds: [], async setTitle(title) { this.renamed = title } }
  let creates = 0
  const services = {
    workspaceRegistry: {
      get: id => (id === workspace.id ? workspace : undefined),
      async resolveByPath(path) { return path === workspace.path ? workspace : undefined },
      async create() { creates += 1; return workspace },
    },
  }
  const ctx = { get: name => services[name], logger: { warn() {}, info() {} } }
  const sessions = createSessions({ ctx, paths, cards, refresh: { sync() {}, refresh() {} } })
  await sessions.start()
  check(`旧工作区「${legacy}」改名为 ${WORKSPACE_TITLE}`, workspace.renamed === WORKSPACE_TITLE && workspace.title === WORKSPACE_TITLE, workspace)
  check(`旧工作区「${legacy}」沿用原路径，不新建`, creates === 0)
  sessions.disposeAll?.()
  await rm(root, { recursive: true, force: true })
}

await rm(home, { recursive: true, force: true })
const failed = checks.filter((c) => !c.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map((c) => c.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
