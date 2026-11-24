// Turn 折叠测试：工具摘要人话化、耗时、卡片配置摘要
import { foldTurns, cardTurns } from '../host/turns.js'

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok }); if (!ok) console.log('FAIL', name, detail ?? '') }

const toolCall = (seq, time, callId, name, args) => ({
  type: 'tool/call', seq, time,
  data: { turn: 1, step: 1, callId, name, arguments: JSON.stringify(args) },
})

const toolResult = (seq, time, callId, text, extra = {}) => ({
  type: 'tool/result', seq, time,
  data: {
    turn: 1, step: 1,
    message: { role: 'tool', toolCallId: callId, content: text === null ? [] : [{ type: 'text', text }] },
    ...extra,
  },
})

const card = { id: 'session-card-abc123', title: 'GitHub 项目活跃', size: { w: 8, h: 9 }, view: { kind: 'custom' } }

const events = [
  { type: 'turn/start', seq: 1, time: 1000, data: { turn: 1 } },
  { type: 'user/message', seq: 2, time: 1001, data: { source: { kind: 'user' }, content: [{ type: 'text', text: '【卡片任务】指令\n用户需求：整理 github' }] } },
  { type: 'step/start', seq: 3, time: 1002, data: { turn: 1, step: 1 } },
  toolCall(4, 1010, 'c1', 'bash', { command: "cd /tmp && gh api user/repos --jq '.[].name'" }),
  toolResult(5, 1410, 'c1', 'repo-a\nrepo-b'),
  toolCall(6, 1500, 'c2', 'card_read', {}),
  toolResult(7, 1510, 'c2', JSON.stringify({
    card: {
      title: 'GitHub 项目活跃',
      size: { w: 8, h: 9 },
      view: { kind: 'custom' },
      refresh: { everyMs: 900000, command: '/usr/bin/python3 /tmp/gh_activity.py' },
    },
    data: null,
  })),
  toolCall(8, 1600, 'c3', 'bash', { command: 'false' }),
  toolResult(9, 1600, 'c3', '', { error: { message: 'boom' } }),
  { type: 'turn/end', seq: 10, time: 5000, data: { turn: 1, reason: { kind: 'completed' } } },
]

const turns = foldTurns(events)
check('折叠出 1 个回合', turns.length === 1 && turns[0].steps.length === 1)
const tool = (id) => turns[0].steps[0].tools.find((item) => item.callId === id)

check('bash 摘要去掉 cd 前缀并保留命令', tool('c1')?.argsSummary === "gh api user/repos --jq '.[].name'", tool('c1')?.argsSummary)
check('bash 动词是人话', tool('c1')?.verb === '执行命令')
check('工具耗时', tool('c1')?.durationMs === 400, String(tool('c1')?.durationMs))
check('card_read 摘要含标题/尺寸/视图/刷新', (() => {
  const text = tool('c2')?.resultSummary ?? ''
  return text.includes('标题 GitHub 项目活跃') && text.includes('尺寸 8×9') && text.includes('前端视图') && text.includes('每 15 分钟') && text.includes('python3 gh_activity.py')
})(), tool('c2')?.resultSummary)
check('失败工具标记 + 中文原因', tool('c3')?.status === 'error' && String(tool('c3')?.resultSummary).startsWith('失败'), tool('c3')?.resultSummary)
check('回合耗时', turns[0].durationMs === 4000, String(turns[0].durationMs))

const folded = cardTurns(events, card)
check('cardTurns 结束后 busy=false', folded.busy === false)
check('cardTurns 保留用户需求原文', turns[0].user.text.includes('整理 github'))

// 命令里带花括号时不能被 JSON 人话化吞掉
const braceEvents = [
  { type: 'turn/start', seq: 1, time: 1, data: { turn: 1 } },
  toolCall(2, 2, 'b1', 'bash', { command: "python3 - <<'EOF'\nprint({'a': 1})\nEOF" }),
  toolResult(3, 3, 'b1', 'ok'),
]
const braceTurns = cardTurns(braceEvents, card)
const braceSummary = braceTurns.turns[0]?.steps[0]?.tools[0]?.argsSummary ?? ''
check('带花括号的命令不被误删', braceSummary.includes("print({'a': 1})"), braceSummary)

const summary = { total: checks.length, failed: checks.filter((item) => !item.ok).length }
if (summary.failed > 0) summary.failures = checks.filter((item) => !item.ok).map((item) => item.name)
console.log(JSON.stringify(summary))
process.exit(summary.failed === 0 ? 0 : 1)
