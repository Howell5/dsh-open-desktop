// 把 src/client/ 打包成 DSH 模块加载器认识的单文件 client.js。
//
// react / react-dom 由宿主注入，保持 external；整个 CJS bundle 放进 factory(require) 里，
// 这样 bundle 里的 require('react') 能拿到加载器传进来的那个 React。
import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const watch = process.argv.includes('--watch')
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const pluginId = String(pkg.name)

const options = {
  entryPoints: [join(root, 'src/client/index.js')],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['chrome120', 'safari17'],
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  loader: { '.css': 'text' },
  define: { 'process.env.NODE_ENV': '"production"' },
  write: false,
  legalComments: 'none',
  logLevel: 'warning',
}

const wrap = (code) => `/**
 * Little Widgets · client
 *
 * Generated from src/client by \`npm run build\`. Do not edit by hand.
 */
window.__ModuleLoader__.load({
  id: '${pluginId}',
  factory(require) {
    const module = { exports: {} };
    const exports = module.exports;
${code
  .trimEnd()
  .split('\n')
  .map((line) => (line === '' ? '' : '    ' + line))
  .join('\n')}
    return module.exports.default ?? module.exports;
  },
});
`

if (watch) {
  const { context } = await import('esbuild')
  const ctx = await context({
    ...options,
    plugins: [{
      name: 'write-client',
      setup(build) {
        build.onEnd(async (result) => {
          if (result.errors.length > 0) return
          const code = result.outputFiles?.[0]?.text
          if (code === undefined) return
          const target = join(root, 'client.js')
          await mkdir(dirname(target), { recursive: true })
          await writeFile(target, wrap(code))
          console.log('[build-client] wrote client.js')
        })
      },
    }],
  })
  await ctx.watch()
  console.log('[build-client] watching src/client …')
} else {
  const result = await build(options)
  const code = result.outputFiles?.[0]?.text
  if (code === undefined) throw new Error('esbuild produced no output')
  const target = join(root, 'client.js')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, wrap(code))
  const bytes = Buffer.byteLength(wrap(code))
  console.log(`[build-client] client.js ${(bytes / 1024).toFixed(1)} KB`)
}
