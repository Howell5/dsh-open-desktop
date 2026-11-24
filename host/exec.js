// Open Desktop · 本机命令执行（卡片目录内）
//
// execFile 不经 shell（参数逐个传）、超时、输出上限；能拿到 DSH sandbox 时按
// workspace-write 限制在卡片目录内。卡片能跑什么由 agent 在目录里写代码决定，
// 不再有「权限档/审批」这层概念。
import { execFile } from 'node:child_process'

function tokenize(line) {
  const text = String(line ?? '').trim()
  if (text === '') return []
  const parts = []
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g
  let match
  while ((match = pattern.exec(text)) !== null) parts.push(match[1] ?? match[2] ?? match[3])
  return parts
}

async function confine(ctx, argv, workspaceRoot) {
  const sandbox = ctx?.get?.('sandbox')
  if (sandbox === undefined || !workspaceRoot) return argv
  try {
    const confined = await sandbox.confine(argv, { mode: 'workspace-write', workspaceRoot })
    if (confined && Array.isArray(confined.argv) && confined.argv.length > 0) return confined.argv
  } catch {
    // 沙箱不可用时退回直接执行
  }
  return argv
}

export async function runCommand(ctx, commandLine, { workspaceRoot = '', timeoutMs = 8000 } = {}) {
  const parts = tokenize(commandLine)
  if (parts.length === 0) throw Object.assign(new Error('命令为空'), { code: 'bad-command' })
  const argv = await confine(ctx, parts, workspaceRoot)
  return new Promise((resolve, reject) => {
    execFile(
      argv[0],
      argv.slice(1),
      {
        timeout: Math.min(60_000, Math.max(1000, Number(timeoutMs) || 8000)),
        maxBuffer: 512 * 1024,
        cwd: workspaceRoot && workspaceRoot !== '' ? workspaceRoot : undefined,
        env: { ...process.env, LANG: 'en_US.UTF-8' },
      },
      (error, stdout) => {
        if (error) {
          reject(Object.assign(new Error(`执行失败：${error.message}`), { code: 'script-failed' }))
          return
        }
        resolve(String(stdout ?? ''))
      },
    )
  })
}
