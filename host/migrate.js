// Migrate sessions created by older plugin versions into the shared cards root.
//
// Old card sessions stored their own card directory as the session header cwd.
// DSH groups sessions by that header path, so those sessions stay outside the
// shared workspace forever. There is no public cross-workspace migration API in
// DSH 0.2.2, so this module performs the narrow storage migration itself:
//   - rewrite only the first Zstandard frame (the session header) to the cards root,
//   - move the session directory to the cards-root project directory,
//   - leave every event frame byte-identical,
//   - keep a backup of the original log,
//   - index the new header and attach the session to the shared workspace.
import { copyFile, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, sep } from 'node:path'
import { constants, zstdCompressSync, zstdDecompressSync } from 'node:zlib'

const ZSTD_MAGIC = 4247762216
const CHECKSUM = { params: { [constants.ZSTD_c_checksumFlag]: 1 } }
const LOG_NAME = 'session.v4.jsonl.zstd'

// DSH encodes a session's cwd into its project directory name.
export function projectKey(cwd) {
  if (typeof cwd !== 'string' || cwd.length === 0) throw new Error('cannot encode an empty project path')
  let readable = ''
  let separatorRun = false
  for (let index = 0; index < cwd.length; index += 1) {
    const code = cwd.charCodeAt(index)
    const ch = String.fromCharCode(code)
    if (ch === '/' || ch === '\\' || ch === ':') {
      if (!separatorRun) readable += '-'
      separatorRun = true
    } else if (ch !== '~' && /^[A-Za-z0-9._-]$/.test(ch)) {
      readable += ch
      separatorRun = false
    } else {
      readable += '~' + code.toString(16).toUpperCase().padStart(4, '0')
      separatorRun = false
    }
  }
  return `--${(readable.replace(/^-+/, '') || 'root').slice(0, 251)}--`
}

export function encodeSegment(raw) {
  if (typeof raw !== 'string' || raw.length === 0) throw new Error('cannot encode an empty path segment')
  if (raw === '.') return '~002E'
  if (raw === '..') return '~002E~002E'
  let out = ''
  for (let index = 0; index < raw.length; index += 1) {
    const code = raw.charCodeAt(index)
    const ch = String.fromCharCode(code)
    if (ch !== '~' && /^[A-Za-z0-9._-]$/.test(ch)) out += ch
    else out += '~' + code.toString(16).toUpperCase().padStart(4, '0')
  }
  return out
}

/**
 * Locate complete Zstandard frames in one concatenated session log.
 * Mirrors the DSH persistence container so a partial final frame is reported
 * rather than silently treated as complete.
 */
export function scanZstdFrames(buffer) {
  const frames = []
  let offset = 0
  while (offset < buffer.length) {
    const start = offset
    if (buffer.length - offset < 4) return { frames, tornStart: start }
    if (buffer.readUInt32LE(offset) !== ZSTD_MAGIC) throw new Error(`corrupt session log: invalid frame magic at byte ${offset}`)
    offset += 4
    if (offset === buffer.length) return { frames, tornStart: start }
    const descriptor = buffer.readUInt8(offset)
    offset += 1
    if ((descriptor & 24) !== 0) throw new Error(`corrupt session log: reserved frame-header bit at byte ${offset - 1}`)
    const contentSizeFlag = descriptor >>> 6
    const singleSegment = (descriptor & 32) !== 0
    const checksum = (descriptor & 4) !== 0
    const dictionaryFlag = descriptor & 3
    const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag
    const contentSizeBytes = contentSizeFlag === 0 ? (singleSegment ? 1 : 0) : 1 << contentSizeFlag
    const remainingHeaderBytes = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes
    if (buffer.length - offset < remainingHeaderBytes) return { frames, tornStart: start }
    offset += remainingHeaderBytes
    for (;;) {
      if (buffer.length - offset < 3) return { frames, tornStart: start }
      const blockHeader = buffer.readUIntLE(offset, 3)
      offset += 3
      const lastBlock = (blockHeader & 1) !== 0
      const blockType = (blockHeader >>> 1) & 3
      const blockSize = blockHeader >>> 3
      if (blockType === 3) throw new Error(`corrupt session log: reserved block type at byte ${offset - 3}`)
      const payloadBytes = blockType === 1 ? 1 : blockSize
      if (buffer.length - offset < payloadBytes) return { frames, tornStart: start }
      offset += payloadBytes
      if (lastBlock) break
    }
    if (checksum) {
      if (buffer.length - offset < 4) return { frames, tornStart: start }
      offset += 4
    }
    frames.push({ start, end: offset })
  }
  return { frames }
}

const decodeFrame = (buffer, frame) => zstdDecompressSync(buffer.subarray(frame.start, frame.end))

/** Rewrite only the first frame's header cwd; verify the container afterwards. */
export function replaceHeaderCwd(buffer, nextCwd) {
  const { frames, tornStart } = scanZstdFrames(buffer)
  if (tornStart !== undefined) throw new Error('corrupt session log: incomplete final frame')
  if (frames.length === 0) throw new Error('corrupt session log: no frames')
  const text = decodeFrame(buffer, frames[0]).toString('utf8')
  if (!text.endsWith('\n')) throw new Error('corrupt session log: incomplete header record')
  const header = JSON.parse(text)
  if (header?.type !== 'session' || typeof header.id !== 'string') throw new Error('corrupt session log: first frame is not a session header')
  const next = { ...header, cwd: nextCwd }
  const frame = zstdCompressSync(Buffer.from(`${JSON.stringify(next)}\n`), CHECKSUM)
  const out = Buffer.concat([frame, buffer.subarray(frames[0].end)])
  const checked = scanZstdFrames(out)
  if (checked.tornStart !== undefined || checked.frames.length !== frames.length) throw new Error('session log rewrite produced an invalid frame container')
  if (out.subarray(checked.frames[0].end).length !== buffer.subarray(frames[0].end).length) throw new Error('session log rewrite changed trailing event bytes')
  const decoded = JSON.parse(decodeFrame(out, checked.frames[0]).toString('utf8'))
  if (decoded.id !== header.id || decoded.cwd !== nextCwd) throw new Error('session log rewrite verification failed')
  return { buffer: out, header: next }
}

const inside = (child, parent) => child === parent || child.startsWith(parent + sep)
const stamp = (now = new Date()) => now.toISOString().replace(/[:.]/g, '-')

/**
 * @param {object} options
 * @param {object} options.ctx DSH context (services: sessionPersistence, sessions)
 * @param {object} options.paths plugin data paths
 * @param {object} options.workspace the shared Workspace entity (may lack attachSession in tests)
 * @returns {Promise<{migrated:number, skipped:number, reason?:string}>}
 */
export async function migrateCardSessions({ ctx, paths, workspace }) {
  const report = { at: new Date().toISOString(), migrated: 0, skipped: 0, reason: null, details: [] }
  const persistence = ctx?.get?.('sessionPersistence') ?? ctx?.sessionPersistence
  if (typeof persistence?.list !== 'function' || typeof persistence?.root !== 'string') {
    report.reason = 'no-persistence'
    await writeReport(paths, report)
    return { migrated: 0, skipped: 0, reason: report.reason }
  }
  const live = ctx?.get?.('sessions') ?? ctx?.sessions
  const registry = ctx?.get?.('workspaceRegistry') ?? ctx?.workspaceRegistry
  const warnings = []
  let snapshots
  try { snapshots = await persistence.list() } catch (error) {
    report.reason = `list-failed: ${error?.message ?? error}`
    await writeReport(paths, report)
    return { migrated: 0, skipped: 0, reason: report.reason }
  }

  let migrated = 0
  let skipped = 0
  for (const snapshot of snapshots) {
    const header = snapshot?.header
    if (!header || typeof header.cwd !== 'string' || !inside(header.cwd, paths.cards)) continue
    if (header.cwd === paths.cards) continue
    if (live?.get?.(header.id) !== undefined) { skipped += 1; report.details.push({ id: header.id, action: 'skip', reason: 'live' }); continue }
    try {
      const located = typeof persistence.locate === 'function' ? persistence.locate(header) : undefined
      const oldPath = located?.path ?? join(persistence.root, projectKey(header.cwd), encodeSegment(header.id), LOG_NAME)
      const oldDir = dirname(oldPath)
      const targetDir = join(persistence.root, projectKey(paths.cards), encodeSegment(header.id))
      if (targetDir === oldDir) continue
      const exists = await stat(targetDir).then(() => true, () => false)
      if (exists) { skipped += 1; report.details.push({ id: header.id, action: 'skip', reason: 'target-exists' }); continue }
      const cardDirExists = await stat(header.cwd).then(() => true, () => false)
      if (!cardDirExists) { skipped += 1; report.details.push({ id: header.id, action: 'skip', reason: 'card-dir-missing' }); continue }

      const backupDir = join(paths.root, 'migrations', stamp())
      await mkdir(backupDir, { recursive: true })
      // Session ids come from DSH headers, but keep the backup inside its
      // directory even if a malformed id carries path separators.
      const backupPath = join(backupDir, `${encodeSegment(header.id)}.zstd`)
      await copyFile(oldPath, backupPath)

      await mkdir(dirname(targetDir), { recursive: true })
      await rename(oldDir, targetDir)
      const nextPath = join(targetDir, basename(oldPath))
      try {
        const original = await readFile(nextPath)
        const rewritten = replaceHeaderCwd(original, paths.cards)
        const temporary = `${nextPath}.migration.tmp`
        await writeFile(temporary, rewritten.buffer, { mode: 0o600 })
        await rename(temporary, nextPath)
        await registry?.indexHeader?.(rewritten.header)
        await workspace?.attachSession?.(header.id)
        migrated += 1
        report.details.push({ id: header.id, action: 'migrated', from: header.cwd })
      } catch (error) {
        // Put the directory back so the original artifact remains where DSH expects it.
        await rename(targetDir, oldDir).catch(() => {})
        throw error
      }
    } catch (error) {
      const message = `迁移卡片会话 ${header.id} 失败：${error?.message ?? error}`
      ctx?.logger?.warn?.(`[little-widgets] ${message}`)
      warnings.push(message)
      report.details.push({ id: header.id, action: 'failed', reason: message })
    }
  }
  report.migrated = migrated
  report.skipped = skipped
  if (warnings.length > 0) report.warnings = warnings
  await writeReport(paths, report)
  return { migrated, skipped, ...(warnings.length > 0 ? { warnings } : {}) }
}

async function writeReport(paths, report) {
  try {
    const dir = join(paths.root, 'migrations')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'last-run.json'), `${JSON.stringify(report, null, 2)}\n`)
  } catch {
    // Diagnostics must never fail plugin startup.
  }
}
