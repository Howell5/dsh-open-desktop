// Little Widgets · Host 装配
//
// 卡片 = 一条 DSH session 的持久展示位；卡片目录就是 session 的 cwd。
// 数据流：cards(侧车) → refresh(定时取数) → board(State/动作) → api(SSE/POST)
import { dataRoot, makePaths, ensureLayout, purgeTrash } from './host/paths.js'
import { createCards } from './host/cards.js'
import { createRefresh } from './host/refresh.js'
import { runCommand } from './host/exec.js'
import { createSessions } from './host/sessions.js'
import { createBoard } from './host/board.js'
import { registerRoutes } from './host/api.js'
import { migrateViews } from './host/views.js'

export const name = 'little-widgets'
export const inject = ['webServer', 'sessionController', 'workspaceRegistry', 'workingDirectory', 'sessionTitle', 'sessionPersistence']

export function apply(ctx, config = {}) {
  const root = typeof config?.dataDir === 'string' && config.dataDir.trim() !== ''
    ? config.dataDir.trim()
    : dataRoot()
  const paths = makePaths(root)

  let board = null
  let refresh = null

  const cards = createCards({
    paths,
    onChange: (event) => {
      try { refresh?.sync(cards.list()) } catch (error) { ctx.logger?.warn?.(`[little-widgets] 刷新配置同步失败：${error?.message ?? error}`) }
      board?.publish()
      if (event?.id) void sessions.syncTitle(event.id).catch(error => {
        ctx.logger?.warn?.(`[little-widgets] 会话标题同步失败：${error?.message ?? error}`)
      })
    },
  })

  refresh = createRefresh({
    ctx,
    cards,
    inject: {
      pathOf: (id) => paths.cardDir(id),
      runCommand: (command, options) => runCommand(ctx, command, options),
    },
  })
  refresh.subscribe(() => board?.publish())

  const sessions = createSessions({ ctx, paths, cards, refresh, onChange: () => board?.publish() })
  board = createBoard({ ctx, paths, cards, refresh, sessions })

  ctx.effect(() => () => {
    try { refresh.stop() } catch { /* 忽略 */ }
    try { sessions.disposeAll() } catch { /* 忽略 */ }
  }, 'little-widgets: teardown')

  ctx.effect(() => {
    const dispose = registerRoutes(ctx, board, sessions)
    return () => dispose()
  }, 'little-widgets: routes')

  void (async () => {
    try {
      await ensureLayout(paths)
      await migrateViews(paths, (message) => {
        try { ctx.logger?.info?.(`[little-widgets] ${message}`) } catch { /* 忽略 */ }
      })
      await cards.start()
      await sessions.start()
      refresh.start(cards.list())
      await purgeTrash(paths)
      board.publish()
    } catch (error) {
      try { ctx.logger?.warn?.(`[little-widgets] 启动失败：${error?.message ?? error}`) } catch { /* 忽略 */ }
    }
  })()
}
