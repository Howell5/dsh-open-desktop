// 本地可视化验证：把 dev/harness 打成一个独立页面（React 一起打进去，不依赖 DSH）。
import { build } from 'esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
await build({
  entryPoints: [join(root, 'dev/harness/main.jsx')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  loader: { '.css': 'text' },
  define: { 'process.env.NODE_ENV': '"development"' },
  outfile: join(root, 'dev/harness/bundle.js'),
  logLevel: 'info',
})
