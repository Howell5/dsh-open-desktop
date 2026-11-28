# Little Widgets

Turn the DeepSeek Harness middle pane into a **draggable wall of live data cards**.

Every card is a real session's permanent slot: an agent writes code inside the card's own
directory (collector script, service, frontend), and the card renders it with `view/`
HTML/CSS/JS inside a sandboxed iframe.

![Little Widgets board](https://cdn.jsdelivr.net/gh/Howell5/dsh-little-widgets@main/docs/hero.png)

## Install

```bash
dsh plugin --profile desktop add dsh-little-widgets
```

Requires DSH `>= 0.2.2-rc.3`. Restart DSH once; a "Widgets" entry shows up in the sidebar.

> Formerly **Open Desktop** (`dsh-open-desktop`). To upgrade from the old package:
> `dsh plugin --profile desktop remove dsh-open-desktop && dsh plugin --profile desktop add dsh-little-widgets`.
> Your cards and sessions stay put: if only `~/.dsh/open-desktop/` exists the plugin keeps using it,
> and the old "Open-Desktop" workspace is renamed to "Little-Widgets".

## What you get

- **Bento board** — 12-column grid, drag to reorder, drag the corner to resize.
- **Per-card refresh** — `template` / `command` / `file` / `url`, or a fixed daily time.
- **One rendering path** — `view/index.html + style.css + view.js` in a sandboxed iframe with CSP.
- **Design system injected** — `--od-*` tokens, `od-*` components, `window.od` runtime.
- **32 templates** — pick a scene, the agent builds the card in its own session.
- **Two-layer cards** — click a row to drill into detail (a stock, a repo, a service), `od-back` returns.
- **Interactive cards** — a card can persist its own state through `dshWidget.save()`.

## Permissions

- A card's data command is written by **you** into that card's `card.json`. The plugin ships no executables of its own.
- No telemetry, no analytics, no default outbound calls.
- Card network requests go through the host proxy, under a CSP and a per-card capability list.

## Docs

The main documentation is in Chinese: [README.md](README.md).

## License

MIT
