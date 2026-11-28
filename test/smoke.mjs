// 运行全部 smoke 测试：node test/smoke.mjs
import { spawnSync } from 'node:child_process'

const FILES = [
  './test/card.test.mjs',
  './test/refresh.test.mjs',
  './test/sessions.test.mjs',
  './test/turns.test.mjs',
  './test/card-stream.test.mjs',
  './test/board.test.mjs',
  './test/client-session.test.mjs',
  './test/migrate.test.mjs',
  './test/views.test.mjs',
  './test/view-lint.test.mjs',
  './test/rename.test.mjs',
]

const results = []
let total = 0
let failed = 0
for (const file of FILES) {
  const run = spawnSync(process.execPath, [file], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' })
  const output = `${run.stdout ?? ''}${run.stderr ?? ''}`.trim()
  let summary = null
  try {
    summary = JSON.parse(output.slice(output.indexOf('{')))
  } catch {
    summary = { total: 0, failed: 1, failures: ['无法解析输出'] }
  }
  // 测试进程崩溃时输出里可能残留一个可解析的 JSON 片段，不能只看 failed 字段
  if (run.status !== 0 && summary.failed === 0) {
    summary = { total: summary.total ?? 0, failed: 1, failures: ['测试进程异常退出'] }
  }
  total += summary.total ?? 0
  failed += summary.failed ?? 0
  results.push({ file, total: summary.total, failed: summary.failed, failures: summary.failures })
  console.log(`${file}: ${summary.total - summary.failed}/${summary.total}${summary.failed > 0 ? ' FAIL' : ''}`)
  if (summary.failures?.length) console.log('  ', summary.failures.join(', '))
}
console.log(JSON.stringify({ files: results.length, total, failed }, null, 2))
process.exit(failed === 0 ? 0 : 1)
