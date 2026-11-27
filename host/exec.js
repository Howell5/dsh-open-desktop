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

export async function runCommand(ctx, commandLine, { workspaceRoot = '', timeoutMs = 30_000 } = {}) {
  const parts = tokenize(commandLine)
  if (parts.length === 0) throw Object.assign(new Error('命令为空'), { code: 'bad-command' })
  const argv = await confine(ctx, parts, workspaceRoot)
  const limit = Math.min(120_000, Math.max(1000, Number(timeoutMs) || 30_000))
  return new Promise((resolve, reject) => {
    execFile(
      argv[0],
      argv.slice(1),
      {
        timeout: limit,
        maxBuffer: 512 * 1024,
        cwd: workspaceRoot && workspaceRoot !== '' ? workspaceRoot : undefined,
        env: { ...process.env, LANG: 'en_US.UTF-8' },
      },
      (error, stdout, stderr) => {
        if (error) {
          const stderrText = String((stderr && String(stderr).trim()) || (error && error.stderr) || '').trim()
          const timedOut = error.killed === true || error.signal === 'SIGTERM' || error.code === 'ETIMEDOUT'
          const firstLine = stderrText.split('\n').map((line) => line.trim()).filter(Boolean)[0] || ''
          const reason = timedOut
            ? `超时（${limit}ms 未完成，已终止）`
            : (firstLine.slice(0, 300) || String(error.code || '未知错误'))
          reject(Object.assign(
            new Error(`命令「${String(commandLine).slice(0, 120)}」执行失败：${reason}`),
            { code: 'script-failed', stderr: stderrText.slice(0, 4000) },
          ))
          return
        }
        resolve(String(stdout ?? ''))
      },
    )
  })
}
