// Card sessions created by older plugin versions stored their card directory as
// the session header cwd, so DSH groups them outside the shared workspace.
// Migration moves the stored session under the cards root and rewrites only its
// header frame; every event frame must stay byte-identical.
import { mkdtemp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { constants, zstdCompressSync, zstdDecompressSync } from 'node:zlib'
import { makePaths, ensureLayout } from '../host/paths.js'
import { createCards } from '../host/cards.js'
import {
  encodeSegment,
  migrateCardSessions,
  projectKey,
  replaceHeaderCwd,
  scanZstdFrames,
} from '../host/migrate.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }
const root = await mkdtemp(join(tmpdir(), 'od-migrate-'))
const paths = makePaths(root)
await ensureLayout(paths)
const cards = createCards({ paths })
await cards.start()

const checksum = { params: { [constants.ZSTD_c_checksumFlag]: 1 } }
const frame = (value) => zstdCompressSync(Buffer.from(`${JSON.stringify(value)}\n`), checksum)
const logBuffer = (header, events) => Buffer.concat([frame(header), ...events.map(frame)])

check('project key matches DSH directory encoding', projectKey('/Users/example/.dsh/little-widgets/cards') === '--Users-example-.dsh-little-widgets-cards--', projectKey('/Users/example/.dsh/little-widgets/cards'))
check('segment encoding escapes unsafe characters', encodeSegment('a b') === 'a~0020b' && encodeSegment('a/b') === 'a~002Fb' && encodeSegment('../x') === '..~002Fx')

const oldCardDir = join(paths.cards, 'session-card-old')
const header = {
  type: 'session', version: 4, id: 'session-card-old', createdAt: 1,
  cwd: oldCardDir,
  isSeeded: false, delegationDepth: 0, agentPreset: 'standard',
}
const events = [
  { type: 'message', seq: 1, data: { text: 'hello' } },
  { type: 'message', seq: 2, data: { text: 'world' } },
]
const original = logBuffer(header, events)
const framesBefore = scanZstdFrames(original).frames
check('scanner finds every appended frame', framesBefore.length === 3)
const trailing = original.subarray(framesBefore[0].end)
const rewritten = replaceHeaderCwd(original, '/Users/example/.dsh/little-widgets/cards')
check('header rewrite changes only the cwd', rewritten.header.cwd === '/Users/example/.dsh/little-widgets/cards')
check('event frames stay byte-identical', rewritten.buffer.subarray(scanZstdFrames(rewritten.buffer).frames[0].end).equals(trailing))
check('rewritten log still scans complete', scanZstdFrames(rewritten.buffer).frames.length === framesBefore.length &&
  scanZstdFrames(rewritten.buffer).torn === undefined)

const sessionsRoot = join(root, 'sessions')
const oldDir = join(sessionsRoot, projectKey(header.cwd), encodeSegment(header.id))
await mkdir(oldCardDir, { recursive: true })
await mkdir(oldDir, { recursive: true })
const logPath = join(oldDir, 'session.v4.jsonl.zstd')
await writeFile(logPath, original)

const card = await cards.put({ id: header.id, sessionId: header.id, title: '旧卡', building: false })
check('test card is persisted', card.id === header.id)

const persistence = {
  root: sessionsRoot,
  async list() { return [{ header }] },
  locate(meta) { return { path: join(sessionsRoot, projectKey(meta.cwd), encodeSegment(meta.id), 'session.v4.jsonl.zstd') } },
}
const indexed = []
const attached = []
const registry = { indexHeader(next) { indexed.push(next) } }
const workspace = { path: paths.cards, async attachSession(id) { attached.push(id) } }
const ctx = { get: name => ({ sessionPersistence: persistence, sessions: { get: () => undefined }, workspaceRegistry: registry })[name], logger: { warn() {} } }

const result = await migrateCardSessions({ ctx, paths, cards, workspace })

const newDir = join(sessionsRoot, projectKey(paths.cards), encodeSegment(header.id))
const newLogPath = join(newDir, 'session.v4.jsonl.zstd')
const moved = await readFile(newLogPath)
const movedFrames = scanZstdFrames(moved).frames
const movedHeader = JSON.parse(zstdDecompressSync(moved.subarray(movedFrames[0].start, movedFrames[0].end)).toString())
check('stored session moves under the cards root', result.migrated === 1 && movedHeader.cwd === paths.cards)
check('previous project directory is gone', await stat(oldDir).then(() => false, () => true))
check('registry indexes the rewritten header', indexed.length === 1 && indexed[0].cwd === paths.cards)
check('workspace accounts the migrated session', attached.length === 1 && attached[0] === header.id)
const stamp = (await readdir(join(paths.root, 'migrations'))).filter(name => /^\d{4}-/.test(name)).sort().at(-1)
check('backup keeps the original header', (await readFile(join(paths.root, 'migrations', stamp, 'session-card-old.zstd'))).equals(original))

const again = await migrateCardSessions({ ctx, paths, cards, workspace })
check('migration is idempotent', again.migrated === 0 && attached.length === 1)

await rm(root, { recursive: true, force: true })

const failed = checks.filter(item => !item.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map(item => item.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
