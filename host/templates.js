// Little Widgets v3 · 采集器模板
//
// 模板只负责「取一次数 → 返回 value（任意 JSON）」。渲染完全交给渲染器。
// 每个模板声明最低权限：read = 只读数据（HTTP / 系统只读信息）；full = 可执行本机命令。
const UA = 'little-widgets/3 (+deepseek-harness plugin)'

async function requestJson(url, timeoutMs, headers = {}) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { accept: 'application/json', 'user-agent': UA, ...headers },
  })
  if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { code: 'http-status' })
  return response.json()
}

const money = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  if (number >= 1000) return '$' + number.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (number >= 1) return '$' + number.toFixed(2)
  return '$' + number.toFixed(4)
}
const percent = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return ''
  return `${number >= 0 ? '+' : ''}${number.toFixed(2)}%`
}
const splitList = (raw, fallback) => {
  const list = String(raw ?? '').split(/[,，\s]+/).map((item) => item.trim()).filter(Boolean)
  return list.length > 0 ? list : fallback
}

const COIN_LABELS = { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL', dogecoin: 'DOGE', ripple: 'XRP', cardano: 'ADA', binancecoin: 'BNB', chainlink: 'LINK', 'matic-network': 'MATIC' }
const COIN_IDS = { BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', DOGE: 'dogecoin', XRP: 'ripple', ADA: 'cardano', BNB: 'binancecoin', LINK: 'chainlink', MATIC: 'matic-network' }
const CITY_ZONES = {
  北京: 'Asia/Shanghai', 上海: 'Asia/Shanghai', 东京: 'Asia/Tokyo', 首尔: 'Asia/Seoul', 新加坡: 'Asia/Singapore',
  香港: 'Asia/Hong_Kong', 洛杉矶: 'America/Los_Angeles', 纽约: 'America/New_York', 伦敦: 'Europe/London', 悉尼: 'Australia/Sydney',
}

const timeIn = (zone) => {
  const now = new Date()
  const time = new Intl.DateTimeFormat('zh-CN', { timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
  const day = new Intl.DateTimeFormat('zh-CN', { timeZone: zone, month: 'numeric', day: 'numeric', weekday: 'short' }).format(now)
  return { time, day }
}

export const TEMPLATES = {
  crypto: {
    title: '加密货币',
    description: 'CoinGecko 上关注的币种价格与 24h 涨跌',
    permission: 'read',
    defaultEveryMs: 60_000,
    fields: [{ name: 'coins', label: '关注哪些币', type: 'tokens', default: 'BTC,ETH,SOL', hint: '逗号分隔，如 BTC, ETH, DOGE' }],
    async fetch(card, { timeoutMs = 8000 } = {}) {
      const keys = splitList(card.refresh?.params?.coins, ['BTC', 'ETH']).map((item) => COIN_IDS[item.toUpperCase()] ?? item.toLowerCase())
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(keys.join(','))}&vs_currencies=usd&include_24hr_change=true`
      const body = await requestJson(url, timeoutMs)
      const items = keys.map((id) => {
        const row = body?.[id]
        if (!row) return { label: COIN_LABELS[id] ?? id.toUpperCase(), value: '—' }
        const change = Number(row.usd_24h_change)
        return { label: COIN_LABELS[id] ?? id.toUpperCase(), value: money(row.usd), delta: percent(change), tone: change >= 0 ? 'up' : 'down' }
      })
      const first = items[0] ?? { label: '加密货币', value: '—' }
      return {
        headline: { label: first.label, value: first.value, delta: first.delta, tone: first.tone },
        items: items.slice(1),
        columns: [{ key: 'symbol', label: '币种' }, { key: 'price', label: '价格', align: 'right' }, { key: 'change', label: '24h', align: 'right' }],
        rows: items.map((item) => ({ symbol: item.label, price: item.value, change: item.delta ?? '' })),
        note: `来源 CoinGecko · ${keys.length} 个币种`,
      }
    },
  },

  news: {
    title: '科技新闻',
    description: 'Hacker News 首页前 8 条',
    permission: 'read',
    defaultEveryMs: 300_000,
    fields: [],
    async fetch(card, { timeoutMs = 8000 } = {}) {
      const ids = await requestJson('https://hacker-news.firebaseio.com/v0/topstories.json', timeoutMs)
      const top = (Array.isArray(ids) ? ids : []).slice(0, 8)
      const items = []
      for (const id of top) {
        const item = await requestJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, timeoutMs)
        if (item?.title) items.push({ label: item.title, value: '▲' + (item.score ?? 0), sub: item.by ?? '', href: item.url ?? `https://news.ycombinator.com/item?id=${id}` })
      }
      return { headline: { label: 'Hacker News', value: `${items.length} 条` }, items, note: '按 Hacker News 排名' }
    },
  },

  clock: {
    title: '世界时钟',
    description: '多时区当前时间',
    permission: 'read',
    defaultEveryMs: 60_000,
    fields: [{ name: 'zones', label: '城市', type: 'text', default: '上海,东京', hint: '逗号分隔城市名' }],
    async fetch(card) {
      const names = splitList(card.refresh?.params?.zones, ['上海'])
      const items = names.map((name) => {
        const zone = CITY_ZONES[name] ?? (name.includes('/') ? name : 'Asia/Shanghai')
        const { time, day } = timeIn(zone)
        return { label: name, value: time, sub: day }
      })
      return { headline: { label: '本地' }, items, note: '按城市时区换算' }
    },
  },

  wifi: {
    title: 'WiFi 质量',
    description: '本机无线信号 / 信噪比 / 速率（system_profiler 采集）',
    permission: 'read',
    defaultEveryMs: 60_000,
    fields: [],
    async fetch(card, { timeoutMs = 8000, runCommand } = {}) {
      const output = await runCommand('system_profiler SPAirPortDataType', { timeoutMs })
      const match = /Signal \/ Noise:\s*(-?\d+)\s*dBm\s*\/\s*(-?\d+)\s*dBm/.exec(output)
      if (!match) throw Object.assign(new Error('没读到无线信息（可能没连 Wi-Fi）'), { code: 'no-wifi' })
      const signal = Number(match[1])
      const noise = Number(match[2])
      const snr = signal - noise
      const channel = (/Channel:\s*([^\n]+)/.exec(output) || [])[1]
      const rate = (/Transmit Rate:\s*(\d+)/.exec(output) || [])[1]
      const tone = signal >= -55 ? 'ok' : signal >= -70 ? 'warn' : 'bad'
      return {
        headline: { label: 'WiFi 信号', value: `${signal} dBm`, delta: `${snr} dB SNR`, tone: tone === 'ok' ? 'up' : tone === 'warn' ? 'warn' : 'down' },
        items: [
          { label: '信号', value: `${signal} dBm`, state: tone, sub: '越接近 0 越好' },
          { label: '信噪比', value: `${snr} dB`, state: snr >= 25 ? 'ok' : snr >= 15 ? 'warn' : 'bad' },
          { label: '速率', value: rate ? `${rate} Mbps` : '—', state: rate && Number(rate) >= 800 ? 'ok' : 'warn' },
          { label: '信道', value: channel ? channel.trim() : '—', state: 'ok' },
        ],
        note: '来源 system_profiler · 本机采集',
      }
    },
  },

  script: {
    title: '本机命令',
    description: '在 Host 侧执行白名单/授权命令，把 stdout 变成卡片数据',
    permission: 'full',
    defaultEveryMs: 120_000,
    fields: [
      { name: 'command', label: '本机命令', type: 'text', default: 'uptime', hint: '例：uptime、df -h、ping -c 5 1.1.1.1' },
      { name: 'everyMs', label: '刷新间隔(ms)', type: 'text', default: '120000' },
    ],
    async fetch(card, { timeoutMs = 8000, runCommand } = {}) {
      const command = String(card.refresh?.params?.command ?? 'uptime').trim()
      if (command === '') throw Object.assign(new Error('命令为空'), { code: 'bad-command' })
      const output = await runCommand(command, { timeoutMs })
      const lines = output.split('\n').map((line) => line.trim()).filter(Boolean)
      if (lines.length === 0) throw Object.assign(new Error('命令没有输出'), { code: 'empty-output' })
      return { headline: { label: command, value: lines[0].slice(0, 60) }, items: lines.slice(1, 12).map((line) => ({ label: line.slice(0, 48) })), note: `来源 ${command} · 本机采集` }
    },
  },
}

export const TEMPLATE_LIST = Object.entries(TEMPLATES).map(([id, template]) => ({
  id,
  title: template.title,
  description: template.description,
  permission: template.permission,
  defaultEveryMs: template.defaultEveryMs,
  fields: template.fields,
}))

export const templateOf = (id) => (typeof id === 'string' && TEMPLATES[id]) ? TEMPLATES[id] : null
