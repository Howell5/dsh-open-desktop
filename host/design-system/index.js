// Little Widgets design system assets.
// Loaded once at host startup and inlined into every card iframe.
import { readFileSync } from 'node:fs'

const read = (name) => readFileSync(new URL(`./${name}`, import.meta.url), 'utf8')

export const DESIGN = {
  css: read('theme.css'),
  js: read('runtime.js'),
}

export const SCAFFOLD = {
  html: read('scaffold/index.html'),
  css: read('scaffold/style.css'),
  js: read('scaffold/view.js'),
  readme: read('scaffold/README.md'),
}
