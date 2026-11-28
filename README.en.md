<div align="center">

# Little Widgets

**Say one sentence, get a small card on your desktop that keeps itself up to date.**

A DeepSeek Harness (DSH) plugin · `dsh-little-widgets`

[中文](https://github.com/Howell5/dsh-little-widgets/blob/main/README.md) · **English**

<img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/demo.gif" alt="Demo: type one sentence and a plant-watering card appears" width="760">

<sub>Demo: the cards on the board run the real plugin code on real data; the new card's build is simulated and sped up. The UI is in Chinese for now.</sub>

</div>

## What it is

You ask an agent in DSH for the weather, the state of your services or today's exchange rate, and the answer sinks into the chat history. Tomorrow you ask again.

Little Widgets adds a **Widgets** page (「小组件」) to the DSH sidebar: a wall of cards you can drag around. You **describe each card in one sentence**; an agent writes the data collector and the card's UI in that card's own session, and from then on the card **refreshes itself on the schedule you picked**. Open DSH, glance once, and what you need to know today is there.

<img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/board.png" alt="The board: weather, world clock, to-dos, exchange rates, provider status, plant watering" width="100%">

## What you can make

The new-card dialog has 32 ready-made templates; one click fills in the description. Or write your own.

| Category | Template examples | Or just say |
|---|---|---|
| **Today** | Weather & what to wear, umbrella for the next 7 days, world clock | "Shanghai weather, and tell me what to wear" |
| **Work** | Service health, this machine's resources, Docker containers, uncommitted / unpushed Git, to-do list | "Watch my local services on 3000 and 8080, mark them red when they're down" |
| **Money** | USD rates, watchlist, global indices, gold & silver | "My watchlist, as a list with 7-day trends" |
| **Info** | Hacker News, new arXiv papers, RSS updates, GitHub trending | "Every day at 10:00, new arXiv papers about agents" |
| **Life** | Plant watering, trash day, trip countdown, NBA scores, moon phase | "I have a monstera, a pothos and a succulent — tell me which one needs water" |
| **Digital assets** | Domain & certificate expiry, DNS change watch, provider status | "How many days until my domains' certificates expire" |

The small things nobody would build an app for are exactly what a card is good at.

<img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/cards.png" alt="Close-ups of three cards: weather, to-dos, plant watering" width="100%">

## Three steps

<table>
<tr>
<td width="46%"><img src="https://raw.githubusercontent.com/Howell5/dsh-little-widgets/main/docs/readme/templates.png" alt="New card: pick a template by category, choose a refresh schedule"></td>
<td>

**1. Say what you want to see**
Click **＋** at the top right of the board. Pick a template by category, or write it in your own words.

**2. Pick how often it updates**
30 seconds, 5 minutes, an hour, a fixed time every day, or never. Click Create; an agent builds the card in the background and it shows up on the board when it's ready.

**3. Not quite right? Say one more sentence**
Click ✎ on the card to open its session and say "Hong Kong stocks only" or "add a 7-day trend". Drag the title to move it, drag the corner to resize.

</td>
</tr>
</table>

## Install

```bash
dsh plugin --profile desktop add dsh-little-widgets
```

Requires DSH `>=0.2.2-rc.3`. Restart DSH once; 「小组件」 (Widgets) shows up in the sidebar.

> Formerly **Open Desktop** (`dsh-open-desktop`). To upgrade from the old package:
> `dsh plugin --profile desktop remove dsh-open-desktop && dsh plugin --profile desktop add dsh-little-widgets`
> Your cards and sessions stay put: if only `~/.dsh/open-desktop/` exists the plugin keeps using it, and the old "Open-Desktop" workspace is renamed to "Little-Widgets".

## Why cards, not a dashboard

- **The data is real.** Every card shows how old its data is and whether the last fetch failed. When a fetch fails it keeps the last good data and marks it stale instead of pretending.
- **Each card minds its own business.** Refresh schedule, data source and UI belong to the card; one broken card doesn't take the others down.
- **Cards are interactive.** Tick off, add and edit to-dos; click a row in a stock, repo or service card to drill into detail. State survives restarts.
- **Cards can grow.** Behind every card is a full working directory: today it's one number, tomorrow ask the agent to add a chart or an alert.

## How it works

Every card is one DSH session plus one working directory:

```
~/.dsh/little-widgets/cards/<id>/
  card.json     title, size, order, how to refresh
  view/         the card UI: index.html + style.css + view.js, rendered in a sandboxed iframe
  data/         data files
  ...           collector scripts, services, anything else the agent writes
```

Four refresh sources, combinable: built-in templates, a local `command`, a `file`, or a `url`; every 5 seconds to every 7 days, or at a fixed time each day.

Before a card is published it goes through a static check: hard-coded colors, external resources, text smaller than 11px, direct `fetch`, `window.open` and JS syntax errors are sent back, so every card looks like it belongs to the same family.

## Permissions and security

- A card's data command is written into that card's `card.json` **by the agent you asked**. The plugin ships no commands of its own.
- No telemetry, no analytics, no default outbound calls.
- Card network requests go through the host proxy, under a CSP and a per-card allow-list; `view/` code cannot reach the network or load external resources directly.
- The plugin's HTTP routes (`/little-widgets/api` and friends) go through DSH's admission check and reject cross-site requests: any browser request whose `Sec-Fetch-Site` is not `same-origin` / `none` gets a 403.
- To save interactive state a card can only write its own `data/state.json` (JSON, ≤64KB); the host exposes no other paths.

## Development

```bash
npm install
npm run build        # src/client/ → client.js (esbuild; React is provided by the host)
npm test
npm run harness      # optional: drag-and-drop test bench in a plain browser
```

`client.js` is a build artifact; edit `src/client/` instead. Host code lives in `host/`; the host ⇄ client contract is in [CONTRACT.md](CONTRACT.md) (Chinese).

## Compatibility

- DSH `>=0.2.2-rc.3 <0.3.0-0`
- Verified on the macOS desktop profile
- The UI is Chinese only for now

## License

MIT
