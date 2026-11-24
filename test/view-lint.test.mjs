// Static view gate: the three hard rules plus warnings.
import { lintView } from '../host/view-lint.js'
import { SCAFFOLD } from '../host/design-system/index.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }

const clean = lintView(SCAFFOLD)
check('scaffold passes the gate', clean.ok && clean.errors.length === 0, JSON.stringify(clean.errors))
check('scaffold has no warnings', clean.warnings.length === 0, JSON.stringify(clean.warnings))

const rawColor = lintView({ html: '<div id="app"></div>', css: '.x{color:#fff}', js: '' })
check('raw hex color is rejected', !rawColor.ok && rawColor.errors.some(item => item.rule === 'raw-color'))

const rgbColor = lintView({ html: '<div></div>', css: '.x{background:rgb(0 0 0)}', js: '' })
check('rgba color is rejected', !rgbColor.ok && rgbColor.errors.some(item => item.rule === 'raw-color'))

const external = lintView({ html: '<img src="https://example.com/a.png">', css: '', js: '' })
check('external image is rejected', !external.ok && external.errors.some(item => item.rule === 'external-resource'))

const externalCss = lintView({ html: '<div></div>', css: '.x{background:url(https://example.com/a.png)}', js: '' })
check('external css url is rejected', !externalCss.ok && externalCss.errors.some(item => item.rule === 'external-resource'))

const smallFont = lintView({ html: '<div></div>', css: '.x{font-size:10px}', js: '' })
check('font below 11px is rejected', !smallFont.ok && smallFont.errors.some(item => item.rule === 'min-font'))

const directFetch = lintView({ html: '<div></div>', css: '', js: 'fetch("https://example.com")' })
check('direct fetch is rejected', !directFetch.ok && directFetch.errors.some(item => item.rule === 'direct-fetch'))

const proxyFetch = lintView({ html: '<div></div>', css: '', js: 'window.dshWidget.fetch("https://example.com")' })
check('host-proxied fetch is allowed', proxyFetch.ok, JSON.stringify(proxyFetch.errors))

const syntax = lintView({ html: '<div></div>', css: '', js: 'function (' })
check('js syntax error is rejected', !syntax.ok && syntax.errors.some(item => item.rule === 'js-syntax'))

const scroll = lintView({ html: '<div></div>', css: '.x{overflow-y:auto}', js: '' })
check('internal scroll is a warning, not an error', scroll.ok && scroll.warnings.some(item => item.rule === 'internal-scroll'))

const empty = lintView({ html: '', css: '', js: '' })
check('empty html is rejected', !empty.ok && empty.errors.some(item => item.rule === 'empty-view'))

const link = lintView({ html: '<a href="https://example.com">x</a>', css: '', js: '' })
check('normal anchor links are allowed', link.ok, JSON.stringify(link.errors))

const failed = checks.filter(item => !item.ok)
console.log(JSON.stringify({ total: checks.length, failed: failed.length, failures: failed.map(item => item.name) }, null, 2))
process.exit(failed.length === 0 ? 0 : 1)
