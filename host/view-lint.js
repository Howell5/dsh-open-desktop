// Static checks for a card view before it goes on the board.
//
// Three hard rules (errors):
//   1. no raw colors or hard-coded visual values outside --od-* tokens
//   2. no external resources / direct network access
//   3. readable typography: font-size >= 11px
// Everything else is a warning. Rendering is still checked at runtime by the
// iframe overflow reporter; this pass catches the cheap, deterministic mistakes.

import { Script } from 'node:vm'

const MAX_BYTES = 200_000
const MIN_FONT_PX = 11
const NAMED_COLORS = /\b(?:red|blue|green|white|black|gray|grey|orange|yellow|purple|pink)\b/i

const stripComments = (text) => String(text ?? '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/data:[^"')\s]+/g, 'data:')

const lineOf = (text, index) => String(text ?? '').slice(0, index).split('\n').length
const at = (text, index) => {
  const start = Math.max(0, index - 32)
  return String(text ?? '').slice(start, index + 48).replace(/\s+/g, ' ').trim()
}

function rawColors(text, source, issues) {
  const colorPattern = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/g
  let match
  while ((match = colorPattern.exec(text)) !== null) {
    // Skip CSS id selectors such as `#abc { ... }`; keep declaration values.
    const before = text.slice(Math.max(0, match.index - 48), match.index)
    const after = text.slice(match.index + match[0].length, match.index + match[0].length + 8)
    if (match[0].startsWith('#') && /[{,]\s*$/.test(before) && /^\s*[{,]/.test(after)) continue
    issues.errors.push({
      rule: 'raw-color',
      message: `${source}:${lineOf(text, match.index)} 出现写死的颜色「${match[0]}」，请改用 --od-* token（${at(text, match.index)}）`,
    })
  }
}

function namedColors(text, source, issues) {
  const pattern = /(?:^|[;{\s])(color|background|background-color|border(?:-[a-z]+)?-color|fill|stroke)\s*:\s*([^;}{]+)/g
  let match
  while ((match = pattern.exec(text)) !== null) {
    const value = match[2].trim()
    if (value === '' || /^(?:transparent|currentColor|inherit|none|var\(|color-mix\()/i.test(value)) continue
    if (NAMED_COLORS.test(value)) {
      issues.warnings.push({
        rule: 'named-color',
        message: `${source}:${lineOf(text, match.index)} 颜色「${value}」看起来是写死的，请改用 --od-* token`,
      })
    }
  }
}

function fontSizes(text, source, issues) {
  const pattern = /font-?size\s*[:=]\s*["']?([0-9]+(?:\.[0-9]+)?)\s*(px|rem|em|pt)/gi
  let match
  while ((match = pattern.exec(text)) !== null) {
    const value = Number(match[1])
    const unit = match[2].toLowerCase()
    const px = unit === 'px' ? value
      : unit === 'pt' ? value * (96 / 72)
        : value * 16 // rem/em are approximated from the 16px root
    if (px < MIN_FONT_PX) {
      issues.errors.push({
        rule: 'min-font',
        message: `${source}:${lineOf(text, match.index)} 字号 ${match[0].replace(/^font-?size\s*[:=]\s*["']?/i, '')} 小于 ${MIN_FONT_PX}px，请改用 --od-text-xs 或更大的 token`,
      })
    }
  }
  // Numeric React-style values (fontSize: 10). Only flag clear literals.
  const numeric = /fontSize\s*[:=]\s*([0-9]+(?:\.[0-9]+)?)\s*[,;}]/g
  while ((match = numeric.exec(text)) !== null) {
    if (Number(match[1]) < MIN_FONT_PX) {
      issues.errors.push({
        rule: 'min-font',
        message: `${source}:${lineOf(text, match.index)} 字号 ${match[1]} 小于 ${MIN_FONT_PX}px，请改用 --od-text-xs 或更大的 token`,
      })
    }
  }
}

function externalResources(html, css, js, issues) {
  const resourceTags = /<(script|link|img|iframe|object|embed|source|video|audio)\b[^>]*\b(src|href|srcset|poster)\s*=\s*["']?([^"'\s>]*)/gi
  let match
  while ((match = resourceTags.exec(html)) !== null) {
    const target = match[3] ?? ''
    if (target === '' || /^data:/i.test(target) || /^#/.test(target)) continue
    issues.errors.push({
      rule: 'external-resource',
      message: `index.html:${lineOf(html, match.index)} 加载了外部资源 <${match[1]} ${match[2]}="${target.slice(0, 60)}">；卡片只能用内联内容或 dshWidget.fetch 取数`,
    })
  }
  if (/@import\b/i.test(css)) {
    issues.errors.push({ rule: 'external-resource', message: 'style.css 里不能使用 @import；把样式直接写在文件里' })
  }
  const urlPattern = /url\(\s*["']?((?:https?:)?\/\/[^"')]*)/gi
  while ((match = urlPattern.exec(css)) !== null) {
    issues.errors.push({ rule: 'external-resource', message: `style.css 引用了外链 ${match[1].slice(0, 60)}；样式必须内联` })
  }
  if (/(^|[^.\w])fetch\s*\(/.test(js)) {
    issues.errors.push({ rule: 'direct-fetch', message: 'view.js 里直接用 fetch() 会被 CSP 拦掉；请改用 window.dshWidget.fetch(url)' })
  }
  if (/\bXMLHttpRequest\b/.test(js)) {
    issues.errors.push({ rule: 'direct-fetch', message: 'view.js 里不能用 XMLHttpRequest；请改用 window.dshWidget.fetch(url)' })
  }
  if (/\bwindow\.open\s*\(/.test(js)) {
    issues.errors.push({ rule: 'window-open', message: 'view.js 里不能用 window.open；链接写成 <a href="https://…">，宿主会接管打开' })
  }
}

function layoutWarnings(css, issues) {
  if (/(?:overflow|overflow-y)\s*:\s*(?:auto|scroll)/i.test(css)) {
    issues.warnings.push({ rule: 'internal-scroll', message: '卡片内部出现滚动条；优先用 od.fitRows 或按高度截断，内容不要被藏起来' })
  }
  if (/position\s*:\s*fixed/i.test(css)) {
    issues.warnings.push({ rule: 'fixed-position', message: 'position:fixed 在 iframe 里是相对卡片固定的，可能会盖住内容' })
  }
}

function syntax(js, issues) {
  if (String(js ?? '').trim() === '') return
  try {
    // Compile only; vm.Script does not execute the card code.
    new Script(js, { filename: 'view.js' })
  } catch (error) {
    issues.errors.push({ rule: 'js-syntax', message: `view.js 语法错误：${error?.message ?? error}` })
  }
}

export function lintView(files = {}) {
  const html = String(files.html ?? '')
  const css = String(files.css ?? '')
  const js = String(files.js ?? '')
  const issues = { errors: [], warnings: [] }

  if (html.trim() === '') {
    issues.errors.push({ rule: 'empty-view', message: 'view/index.html 是空的；卡片需要一段前端结构' })
  }
  if (/<\s*(?:html|head|body)\b/i.test(html)) {
    issues.warnings.push({ rule: 'full-document', message: 'index.html 只写内容片段，不要重复 <html>/<head>/<body>，宿主会自己包一层' })
  }

  const total = Buffer.byteLength(html, 'utf8') + Buffer.byteLength(css, 'utf8') + Buffer.byteLength(js, 'utf8')
  if (total > MAX_BYTES) {
    issues.errors.push({ rule: 'too-large', message: `视图总大小 ${Math.round(total / 1024)}KB 超过 ${MAX_BYTES / 1024}KB；把数据放到取数脚本里` })
  }

  const cleanHtml = stripComments(html)
  const cleanCss = stripComments(css)
  const cleanJs = stripComments(js)
  rawColors(cleanHtml, 'index.html', issues)
  rawColors(cleanCss, 'style.css', issues)
  rawColors(cleanJs, 'view.js', issues)
  namedColors(cleanCss, 'style.css', issues)
  fontSizes(cleanCss, 'style.css', issues)
  fontSizes(cleanHtml, 'index.html', issues)
  fontSizes(cleanJs, 'view.js', issues)
  externalResources(cleanHtml, cleanCss, cleanJs, issues)
  layoutWarnings(cleanCss, issues)
  syntax(js, issues)

  return {
    ok: issues.errors.length === 0,
    errors: issues.errors,
    warnings: issues.warnings,
  }
}

export const VIEW_LINT_RULES = { MAX_BYTES, MIN_FONT_PX }
