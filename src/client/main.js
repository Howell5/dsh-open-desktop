/**
 * Open Desktop —— DSH Web UI 小组件板（Client 半）
 *
 * 板面 = 12 列网格，widget 用 {w,h} 跨度；卡片内容是 view/ 里的前端代码，
 *        在沙箱 iframe 中渲染，宿主先注入设计系统（od-* 类 + --od-* token）
 * 对话 = DSH 的 Turn 模型（Turn → Step → assistant 正文 + 工具卡片）
 *
 * 这个文件是源码；plugin/client.js 由 `npm run build` 生成，不要直接改后者。
 */
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import STYLES from './styles.css';
import { dnd } from './dnd.js';

const h = React.createElement;

// 拖动时其他卡片的让位动画：CSS grid 重排没有过渡，用 FLIP 手动补上。
const FLIP_MS = 220;
const FLIP_EASING = 'cubic-bezier(.2,0,0,1)';

    const CLIENT_BUILD = 'b2026-11-23-dnd';
    const STREAM_URL = '/open-desktop/stream';
    const CARD_STREAM_URL = '/open-desktop/card-stream';
    const API_URL = '/open-desktop/api';
    const POLL_MS = 10000;
    const RECONNECT_MS = 15000;

    // 网格（与 CONTRACT §0 一致）
    const GRID = { columns: 12, rowHeight: 40, gap: 8 };
    const SIZE_MIN = 3;
    const SIZE_MAX = 12;
    const SIZE_PRESETS = {
      S: { w: 3, h: 4 },
      M: { w: 6, h: 4 },
      L: { w: 12, h: 6 },
    };
    // apply() 里注入 ctx.layout，用于「卡片墙 ↔ 原生会话画布」切换
    const TRANSCRIPT_VIEWS = [
      { id: 'compact', label: '紧凑' },
      { id: 'standard', label: '标准' },
      { id: 'detailed', label: '详细' },
    ];
    const TOOL_VERBS = {
      board_list: '查看板面',
      board_add: '添加卡片',
      board_update: '修改卡片',
      board_remove: '删除卡片',
      board_undo: '撤销上一步',
      board_refresh: '刷新数据',
      board_design: '读设计规范',
    };
    const toolVerb = (name, fallback) => TOOL_VERBS[String(name ?? '')] || fallback || '执行操作';

    // ---------------- 基础工具 ----------------
    const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
    const asArray = (value) => (Array.isArray(value) ? value : []);
    const asText = (value, fallback) => (typeof value === 'string' ? value : (typeof value === 'number' ? String(value) : (fallback !== undefined ? fallback : '')));
    const asNumber = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
    const clampInt = (value, lo, hi, fallback) => (Number.isFinite(value) ? Math.min(hi, Math.max(lo, Math.round(value))) : fallback);

    const normalizeSize = (raw, fallback) => {
      const base = fallback || SIZE_PRESETS.M;
      if (isObject(raw)) return { w: clampInt(Number(raw.w), SIZE_MIN, SIZE_MAX, base.w), h: clampInt(Number(raw.h), SIZE_MIN, SIZE_MAX, base.h) };
      if (typeof raw === 'string' && SIZE_PRESETS[raw]) return { ...SIZE_PRESETS[raw] };
      return { ...base };
    };
    const sizeLabel = (size) => size.w + '×' + size.h;

    const shortAge = (ms) => {
      if (ms === null || !Number.isFinite(ms)) return '';
      const sec = Math.max(0, Math.round(ms / 1000));
      if (sec < 60) return sec + 's';
      const min = Math.round(sec / 60);
      if (min < 60) return min + 'm';
      return Math.round(min / 60) + 'h';
    };
    const fmtAge = (ms) => {
      if (ms === null || !Number.isFinite(ms)) return '—';
      const sec = Math.max(0, Math.round(ms / 1000));
      if (sec < 60) return sec + ' 秒前';
      const min = Math.round(sec / 60);
      if (min < 60) return min + ' 分钟前';
      const hour = Math.round(min / 60);
      if (hour < 24) return hour + ' 小时前';
      return Math.round(hour / 24) + ' 天前';
    };
    // 刷新间隔按人话显示：90 秒 → 2 分钟，3600 秒 → 1 小时，86400 秒 → 1 天
    const fmtEvery = (ms) => {
      if (ms === null || !Number.isFinite(ms) || ms <= 0) return '—';
      const sec = Math.max(1, Math.round(ms / 1000));
      if (sec < 60) return sec + ' 秒';
      const min = Math.round(sec / 60);
      if (min < 60) return min + ' 分钟';
      const hour = Math.round(min / 60);
      if (hour < 24) return hour + ' 小时';
      return Math.round(hour / 24) + ' 天';
    };
    const fmtClock = (ts) => {
      if (!Number.isFinite(ts)) return '';
      try { return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; }
    };
    const toneClass = (tone, extra) => {
      const base = tone === 'up' || tone === 'ok' ? 'od-up' : tone === 'down' || tone === 'bad' ? 'od-down' : tone === 'warn' ? 'od-warn' : '';
      return (base + (extra ? ' ' + extra : '')).trim();
    };

    // ---------------- 状态归一化（v4：卡片 = iframe 前端代码） ----------------
    // 卡片内容只有一种来源：view/ 里的 html/css/js。没有 auto/custom 之分。
    function normalizeView(raw) {
      if (!isObject(raw)) return { html: '', css: '', js: '', missing: true };
      return {
        html: asText(raw.html),
        css: asText(raw.css),
        js: asText(raw.js),
        missing: raw.missing === true || asText(raw.html).trim() === '',
      };
    }

    function normalizeCard(raw) {
      if (!isObject(raw) || typeof raw.id !== 'string' || raw.id === '') return null;
      const refresh = isObject(raw.refresh) ? raw.refresh : {};
      return {
        id: raw.id,
        sessionId: asText(raw.sessionId, raw.id),
        title: asText(raw.title, '未命名卡片'),
        template: '',
        size: normalizeSize(raw.size),
        view: normalizeView(raw.view),
        order: asNumber(raw.order) ?? 0,
        createdAt: asNumber(raw.createdAt) ?? 0,
        updatedAt: asNumber(raw.updatedAt) ?? 0,
        building: raw.building === true,
        refresh: refresh,
        dailyAt: typeof refresh.dailyAt === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(refresh.dailyAt) ? refresh.dailyAt : null,
        everyMs: asNumber(refresh.everyMs) ?? (typeof refresh.dailyAt === 'string' ? 86_400_000 : null),
        // 兼容旧渲染器组件读取的字段
        values: {},
        params: isObject(refresh.params) ? refresh.params : {},
        capabilities: [],
        overflow: null,
        viewWarnings: asArray(raw.viewWarnings).map(function (item) { return asText(item); }).filter(function (item) { return item !== ''; }).slice(0, 20),
      };
    }

    function normalizeState(raw) {
      if (!isObject(raw)) return null;
      const widgets = [];
      for (const item of asArray(raw.cards)) {
        const card = normalizeCard(item);
        if (card !== null) widgets.push(card);
      }
      widgets.sort((a, b) => a.order - b.order || a.createdAt - b.createdAt);
      const templates = [];
      for (const item of asArray(raw.templates)) {
        if (!isObject(item) || typeof item.id !== 'string') continue;
        templates.push({
          id: item.id,
          title: asText(item.title, item.id),
          description: asText(item.description),
          fields: asArray(item.fields),
          defaultSize: { ...SIZE_PRESETS.M },
          defaultEveryMs: asNumber(item.defaultEveryMs) ?? 60000,
        });
      }
      return {
        serverNow: asNumber(raw.serverNow) ?? Date.now(),
        revision: 0,
        widgets,
        maxBuilding: asNumber(raw.maxBuilding) ?? 8,
        data: isObject(raw.data) ? raw.data : {},
        templates,
        design: {
          css: asText(raw.design && raw.design.css),
          js: asText(raw.design && raw.design.js),
        },
        prefs: { transcriptView: 'standard' },
        chat: null,
        paused: raw.paused === true,
        openAt: asNumber(raw.openAt) ?? 0,
        chatOpenCardId: asText(raw.chatOpenCardId),
        openEditId: '',
      };
    }

    // ---------------- HTTP / SSE ----------------
    async function postApi(action, payload) {
      const response = await fetch(API_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: action, payload: payload ?? null }),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const body = await response.json();
      if (!body.ok) {
        const failure = new Error((body.error && body.error.message) || '请求失败');
        failure.code = body.error && body.error.code;
        throw failure;
      }
      return body;
    }

    function reportClientError(kind, error, info) {
      try {
        void postApi('client-log', {
          kind: kind,
          message: String(error && error.message ? error.message : error),
          stack: String(error && error.stack ? error.stack : '').slice(0, 4000),
          componentStack: String(info && info.componentStack ? info.componentStack : '').slice(0, 3000),
          where: String((typeof window !== 'undefined' && window.__odErrorWhere) || ''),
          build: CLIENT_BUILD,
        }).catch(function () {});
      } catch (cause) {
        // 上报失败不阻塞
      }
    }

    function createDeskStore(onOpen) {
      let snapshot = { state: null, conn: 'connecting', focus: null };
      const listeners = [];
      const clock = { serverNow: null, at: 0 };
      let source = null;
      let pollTimer = null;
      let reconnectTimer = null;
      let watchdog = null;
      let lastStateAt = 0;
      let lastOpenAt = 0;
      let polling = false;
      let started = false;

      function publish(patch) {
        const next = { ...snapshot, ...patch };
        if (next.state === snapshot.state && next.conn === snapshot.conn && next.focus === snapshot.focus) return;
        snapshot = next;
        for (const listener of listeners) {
          try { listener(snapshot); } catch (error) { /* 单个订阅者异常不影响其它 */ }
        }
      }

      function setConn(conn) {
        if (snapshot.conn !== conn) publish({ conn: conn });
      }

      function requestOpen() {
        try { onOpen(); } catch (error) { /* 面板未注册时忽略 */ }
      }

      function applyState(raw) {
        const state = normalizeState(raw);
        if (state === null) return;
        clock.serverNow = state.serverNow;
        clock.at = Date.now();
        if (Number.isFinite(state.openAt) && state.openAt > lastOpenAt) {
          lastOpenAt = state.openAt;
          if (Math.abs(Date.now() - state.openAt) < 120000) requestOpen();
        }
        publish({ state: state });
      }

      function projectNow() {
        if (clock.serverNow !== null && Number.isFinite(clock.serverNow)) return clock.serverNow + (Date.now() - clock.at);
        return Date.now();
      }

      function stopStream() {
        if (source === null) return;
        try {
          source.removeEventListener('state', handleState);
          source.removeEventListener('open', handleOpen);
          source.removeEventListener('error', handleError);
          source.close();
        } catch (error) { /* 已关闭 */ }
        source = null;
      }

      function stopPolling() {
        if (pollTimer !== null) window.clearInterval(pollTimer);
        pollTimer = null;
        polling = false;
      }

      function pollOnce() {
        postApi('state', {}).then(function (value) {
          if (!started) return;
          lastStateAt = Date.now();
          applyState(value.state ?? value.value);
          setConn('polling');
        }, function () {
          if (!started) return;
          setConn('offline');
        });
      }

      function startPolling() {
        if (!started || polling) return;
        polling = true;
        setConn('polling');
        pollOnce();
        pollTimer = window.setInterval(pollOnce, POLL_MS);
      }

      function scheduleReconnect() {
        if (!started || reconnectTimer !== null) return;
        reconnectTimer = window.setTimeout(function () {
          reconnectTimer = null;
          connect();
        }, RECONNECT_MS);
      }

      function handleState(event) {
        if (!started || !event) return;
        lastStateAt = Date.now();
        try { applyState(JSON.parse(event.data)); } catch (error) { /* 忽略坏帧 */ }
      }

      function handleOpen(event) {
        if (!started) return;
        if (event && typeof event.data === 'string' && event.data !== '') {
          requestOpen();
          return;
        }
        if (polling) stopPolling();
        if (reconnectTimer !== null) {
          window.clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        setConn('sse');
      }

      function handleError() {
        if (!started) return;
        stopStream();
        startPolling();
        scheduleReconnect();
      }

      function connect() {
        if (!started) return;
        if (typeof EventSource === 'undefined') { startPolling(); return; }
        try { source = new EventSource(STREAM_URL); } catch (error) { startPolling(); scheduleReconnect(); return; }
        source.addEventListener('state', handleState);
        source.addEventListener('open', handleOpen);
        source.addEventListener('error', handleError);
        lastStateAt = Date.now();
      }

      function start() {
        if (started) return;
        started = true;
        connect();
        pollOnce();
        if (watchdog !== null) window.clearInterval(watchdog);
        watchdog = window.setInterval(function () {
          if (!started || snapshot.conn !== 'sse') return;
          if (Date.now() - lastStateAt < 60000) return;
          stopStream();
          startPolling();
          scheduleReconnect();
        }, 15000);
      }

      function stop() {
        started = false;
        stopStream();
        stopPolling();
        if (watchdog !== null) window.clearInterval(watchdog);
        watchdog = null;
        if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      function request(action, payload) {
        return postApi(action, payload).then(function (body) {
          if (isObject(body.state)) applyState(body.state);
          return body.value;
        });
      }

      return {
        getSnapshot: () => snapshot,
        focusCard: id => publish({ focus: { id: id } }),
        clearFocus: () => publish({ focus: null }),
        subscribe: function (listener) {
          listeners.push(listener);
          return function () {
            const index = listeners.indexOf(listener);
            if (index >= 0) listeners.splice(index, 1);
          };
        },
        projectNow: projectNow,
        request: request,
        requestRaw: postApi,
        start: start,
        stop: stop,
      };
    }

    // ---------------- 样式 ----------------

    function StyleTag() {
      return h('style', { 'data-plugin': 'dsh-open-desktop', dangerouslySetInnerHTML: { __html: STYLES } });
    }

    // ---------------- 轻量 markdown（对话正文） ----------------
    /**
     * 标题、代码块、表格、列表、引用、分隔线、加粗/行内代码/链接。
     * 对话框里的正文必须是能读的排版，不能把 |---| 这种源码直接露出来。
     */
    function inlineNodes(text, prefix) {
      const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*[^*\s][^*]*\*)/g;
      const nodes = [];
      let last = 0;
      let match;
      let index = 0;
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) nodes.push(text.slice(last, match.index));
        const token = match[0];
        const key = prefix + 'i' + index;
        if (token.slice(0, 2) === '**') {
          nodes.push(h('strong', { key: key }, token.slice(2, -2)));
        } else if (token[0] === '`') {
          nodes.push(h('code', { key: key, className: 'od-code' }, token.slice(1, -1)));
        } else if (token[0] === '[') {
          const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
          if (link !== null) nodes.push(h('a', { key: key, href: link[2], target: '_blank', rel: 'noreferrer noopener' }, link[1]));
          else nodes.push(token);
        } else {
          nodes.push(h('em', { key: key }, token.slice(1, -1)));
        }
        last = match.index + token.length;
        index += 1;
      }
      if (last < text.length) nodes.push(text.slice(last));
      return nodes;
    }

    const MD_TABLE_SPLIT = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;
    const splitRow = function (line) {
      const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
      return trimmed.split('|').map(function (cell) { return cell.trim(); });
    };

    function parseMarkdown(text) {
      const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
      const blocks = [];
      let index = 0;
      while (index < lines.length) {
        const line = lines[index];
        if (line.trim() === '') { index += 1; continue; }
        const fence = line.match(/^\s*```(\w*)\s*$/);
        if (fence !== null) {
          const body = [];
          index += 1;
          while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
            body.push(lines[index]);
            index += 1;
          }
          index += 1;
          blocks.push({ type: 'code', lang: fence[1] || '', text: body.join('\n') });
          continue;
        }
        if (line.indexOf('|') >= 0 && index + 1 < lines.length && MD_TABLE_SPLIT.test(lines[index + 1])) {
          const header = splitRow(line);
          index += 2;
          const rows = [];
          while (index < lines.length && lines[index].indexOf('|') >= 0 && lines[index].trim() !== '') {
            rows.push(splitRow(lines[index]));
            index += 1;
          }
          blocks.push({ type: 'table', header: header, rows: rows });
          continue;
        }
        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading !== null) {
          blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
          index += 1;
          continue;
        }
        if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
          blocks.push({ type: 'hr' });
          index += 1;
          continue;
        }
        if (/^\s*>\s?/.test(line)) {
          const body = [];
          while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
            body.push(lines[index].replace(/^\s*>\s?/, ''));
            index += 1;
          }
          blocks.push({ type: 'quote', text: body.join('\n') });
          continue;
        }
        const ordered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
        const unordered = line.match(/^\s*[-*]\s+(.*)$/);
        if (ordered !== null || unordered !== null) {
          const items = [];
          while (index < lines.length) {
            const nextOrdered = lines[index].match(/^\s*(\d+)[.)]\s+(.*)$/);
            const nextUnordered = lines[index].match(/^\s*[-*]\s+(.*)$/);
            if (nextOrdered !== null) { items.push({ text: nextOrdered[2] }); index += 1; continue; }
            if (nextUnordered !== null) { items.push({ text: nextUnordered[1] }); index += 1; continue; }
            break;
          }
          blocks.push({ type: ordered !== null ? 'ol' : 'ul', items: items });
          continue;
        }
        const body = [];
        while (index < lines.length && lines[index].trim() !== '' && lines[index].indexOf('|') < 0
          && !/^\s*```/.test(lines[index]) && !/^#{1,6}\s/.test(lines[index]) && !/^\s*[-*]\s+/.test(lines[index])
          && !/^\s*\d+[.)]\s+/.test(lines[index]) && !/^\s*>/.test(lines[index])) {
          body.push(lines[index]);
          index += 1;
        }
        if (body.length === 0) { index += 1; continue; }
        blocks.push({ type: 'p', text: body.join('\n') });
      }
      return blocks;
    }

    function MarkdownTable(props) {
      const header = asArray(props.header);
      const rows = asArray(props.rows);
      return h('div', { className: 'od-md-table-wrap' },
        h('table', { className: 'od-md-table' },
          h('thead', null, h('tr', null, header.map(function (cell, index) {
            return h('th', { key: 'h' + index }, inlineNodes(cell, 'th' + index));
          }))),
          h('tbody', null, rows.map(function (row, rowIndex) {
            return h('tr', { key: 'r' + rowIndex }, asArray(row).map(function (cell, cellIndex) {
              return h('td', { key: 'c' + cellIndex }, inlineNodes(cell, 'td' + rowIndex + '-' + cellIndex));
            }));
          }))
        )
      );
    }

    function RichText(props) {
      const blocks = parseMarkdown(props.text);
      return h('div', null, blocks.map(function (block, index) {
        const key = 'b' + index;
        if (block.type === 'code') return h('pre', { key: key, className: 'od-md-code' }, h('code', null, block.text));
        if (block.type === 'table') return h(MarkdownTable, { key: key, header: block.header, rows: block.rows });
        if (block.type === 'heading') return h('div', { key: key, className: 'od-md-heading', 'data-level': block.level }, inlineNodes(block.text, key));
        if (block.type === 'hr') return h('hr', { key: key, className: 'od-md-hr' });
        if (block.type === 'quote') return h('blockquote', { key: key, className: 'od-md-quote' }, inlineNodes(block.text, key));
        if (block.type === 'ul' || block.type === 'ol') {
          return h(block.type === 'ol' ? 'ol' : 'ul', { key: key, className: 'od-md-list' }, block.items.map(function (item, itemIndex) {
            return h('li', { key: 'li' + itemIndex }, inlineNodes(item.text, key + '-' + itemIndex));
          }));
        }
        return h('p', { key: key, className: 'od-line' }, inlineNodes(block.text, key));
      }));
    }

    // ---------------- 卡片视图（沙箱 iframe） ----------------
    /**
     * 自定义渲染器的 token 必须来自宿主真实计算值（否则深色下会出现一块异色底）。
     * 用一个离屏探针把 CSS 变量解析成最终颜色，再交给 iframe。
     */
    function tokensFor(theme) {
      const dark = theme === 'dark';
      const fallback = {
        bg: dark ? '#0b0b10' : '#ffffff',
        fg: dark ? '#f2f2f7' : '#111827',
        'fg-2': dark ? '#a1a1aa' : '#6b7280',
        'fg-3': dark ? '#71717a' : '#8a8a93',
        line: dark ? 'rgba(255,255,255,.08)' : 'rgba(17,17,17,.08)',
        'line-strong': dark ? 'rgba(255,255,255,.16)' : 'rgba(17,17,17,.16)',
        'surface-2': dark ? 'rgba(255,255,255,.05)' : 'rgba(17,17,17,.05)',
        green: dark ? '#34d399' : '#16a34a',
        red: dark ? '#f87171' : '#dc2626',
        amber: dark ? '#fbbf24' : '#d97706',
        blue: dark ? '#60a5fa' : '#2563eb',
        radius: '8px',
        gap: '8px',
        'space-1': '4px', 'space-2': '8px', 'space-3': '12px', 'space-4': '16px', 'space-6': '24px', 'space-8': '32px',
        'text-xs': '11px', 'text-sm': '12px', 'text-md': '13px', 'text-lg': '14px', 'text-metric': '20px', 'text-hero': '34px',
        'r-control': '8px', 'r-surface': '10px', 'card-radius': '12px',
      };
      if (typeof document === 'undefined') return fallback;
      const root = document.querySelector('.od-root');
      if (root === null) return fallback;
      try {
        const probe = document.createElement('div');
        probe.setAttribute('aria-hidden', 'true');
        probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;';
        root.appendChild(probe);
        const read = function (cssVar) {
          probe.style.color = 'var(' + cssVar + ')';
          return getComputedStyle(probe).color;
        };
        const bgProbe = document.createElement('div');
        bgProbe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;background:var(--od-bg);border-top:1px solid var(--od-line)';
        root.appendChild(bgProbe);
        const bgStyle = getComputedStyle(bgProbe);
        const readVar = function (name) {
          return (getComputedStyle(root).getPropertyValue(name) || '').trim();
        };
        const tokens = {
          bg: bgStyle.backgroundColor || fallback.bg,
          fg: read('--od-fg') || fallback.fg,
          'fg-2': read('--od-fg-2') || fallback['fg-2'],
          'fg-3': read('--od-fg-3') || fallback['fg-3'],
          line: bgStyle.borderTopColor || fallback.line,
          'line-strong': read('--od-line-strong') || fallback['line-strong'],
          'surface-2': read('--od-surface-2') || fallback['surface-2'],
          green: read('--od-green') || fallback.green,
          red: read('--od-red') || fallback.red,
          amber: read('--od-amber') || fallback.amber,
          blue: read('--od-blue') || fallback.blue,
          radius: readVar('--od-radius') || fallback.radius,
          gap: readVar('--od-gap') || fallback.gap,
          'space-1': readVar('--od-space-1') || fallback['space-1'],
          'space-2': readVar('--od-space-2') || fallback['space-2'],
          'space-3': readVar('--od-space-3') || fallback['space-3'],
          'space-4': readVar('--od-space-4') || fallback['space-4'],
          'space-6': readVar('--od-space-6') || fallback['space-6'],
          'space-8': readVar('--od-space-8') || fallback['space-8'],
          'text-xs': readVar('--od-text-xs') || fallback['text-xs'],
          'text-sm': readVar('--od-text-sm') || fallback['text-sm'],
          'text-md': readVar('--od-text-md') || fallback['text-md'],
          'text-lg': readVar('--od-text-lg') || fallback['text-lg'],
          'text-metric': readVar('--od-text-metric') || fallback['text-metric'],
          'text-hero': readVar('--od-text-hero') || fallback['text-hero'],
          'r-control': readVar('--od-r-control') || fallback['r-control'],
          'r-surface': readVar('--od-r-surface') || fallback['r-surface'],
          'card-radius': readVar('--od-card-radius') || fallback['card-radius'],
        };
        probe.remove();
        bgProbe.remove();
        return tokens;
      } catch (error) {
        return fallback;
      }
    }

    function buildSrcDoc(view, tokens, design) {
      const css = String(view.css ?? '');
      const html = String(view.html ?? '');
      const js = String(view.js ?? '').replace(/<\/script/gi, '<\\/script');
      const designCss = String(design && design.css ? design.css : '');
      const designJs = String(design && design.js ? design.js : '').replace(/<\/script/gi, '<\\/script');
      const rootStyle = ':root{' + Object.keys(tokens).map(function (key) {
        return '--od-' + key + ':' + tokens[key] + ';';
      }).join('') + '}html,body{margin:0;padding:0;height:100%;background:var(--od-bg);color:var(--od-fg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;line-height:1.45;overflow:hidden;color-scheme:' + (tokens.bg === '#0b0b10' ? 'dark' : 'light') + '}*{box-sizing:border-box}';
      // CSP：禁外链资源、禁直连网络（网络必须走 window.dshWidget.fetch 的 Host 代理）
      const csp = "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'";
      const runtime = `(function(){
        function applyTokens(tokens){if(!tokens)return;var root=document.documentElement;for(var key in tokens){root.style.setProperty("--od-"+key,tokens[key])}}
        window.dshWidget={data:null,tokens:{},size:{w:0,h:0},save:function(value,options){parent.postMessage({__od:true,type:"save",value:value,options:options||null},"*")},fetch:function(url,init){var id="f"+Math.random().toString(36).slice(2);return new Promise(function(resolve,reject){function onMessage(event){var message=event.data||{};if(message.__od!==true||message.type!=="fetch-result"||message.id!==id)return;window.removeEventListener("message",onMessage);if(message.ok)resolve(message.value);else reject(new Error(message.error||"fetch failed"))}window.addEventListener("message",onMessage);parent.postMessage({__od:true,type:"fetch",id:id,url:String(url),init:init||null},"*")})}};
        function report(){try{var d=document.documentElement;var b=document.body;var sh=Math.max(d?d.scrollHeight:0,b?b.scrollHeight:0);var ch=window.innerHeight||(d?d.clientHeight:0);parent.postMessage({__od:true,type:"overflow",scrollHeight:sh,clientHeight:ch},"*")}catch(error){}}
        window.addEventListener("message",function(event){var message=event.data||{};if(message.__od!==true)return;if(message.type==="hello"){parent.postMessage({__od:true,type:"ready"},"*");return}if(message.type==="tokens"){window.dshWidget.tokens=message.tokens||{};applyTokens(message.tokens);return}if(message.type==="data"){if(message.tokens)applyTokens(message.tokens);if(message.size)window.dshWidget.size=message.size;window.dshWidget.data=message.value;if(typeof window.dshWidget.onData==="function")window.dshWidget.onData(message.value);report()}});
        document.addEventListener("click",function(event){var target=event.target;var link=target&&target.closest?target.closest("a[href]"):null;if(!link)return;var href=link.getAttribute("href")||"";if(!/^https?:\\/\\//i.test(href))return;event.preventDefault();parent.postMessage({__od:true,type:"open",url:href},"*")},true);
        window.addEventListener("load",function(){report();parent.postMessage({__od:true,type:"ready"},"*")});
      })();`;
      return '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="' + csp + '"><style>' + rootStyle + designCss + css + '</style></head><body>' + html
        + '<script>' + runtime + '<\/script>'
        + '<script>' + designJs + '<\/script>'
        + '<script>' + js + '<\/script></body></html>';
    }

    function CardView(props) {
      const frameRef = useRef(null);
      const widget = props.widget;
      const theme = props.theme;
      // srcdoc 只建一次：token 差异用 postMessage 热更新，避免重建 iframe 把内容打空
      const srcDoc = React.useMemo(function () {
        return buildSrcDoc(widget.view, tokensFor(theme), props.design);
      }, [widget.view.html, widget.view.css, widget.view.js, theme, props.design && props.design.css, props.design && props.design.js]);

      const [phase, setPhase] = useState('loading');
      const [attempt, setAttempt] = useState(0);
      const readyRef = useRef(false);

      // ready 可能早于父页监听器挂载就发出：主动 hello 让沙箱重发 ready
      useEffect(function () {
        readyRef.current = false;
        let tries = 0;
        const timer = window.setInterval(function () {
          if (readyRef.current || tries >= 12) {
            window.clearInterval(timer);
            return;
          }
          tries += 1;
          const frame = frameRef.current;
          if (frame === null) return;
          try { frame.contentWindow.postMessage({ __od: true, type: 'hello' }, '*'); } catch (error) { /* 忽略 */ }
        }, 400);
        return function () { window.clearInterval(timer); };
      }, [widget.id, attempt, srcDoc]);

      // ready 超时兜底：不是空白，而是明确报错并可重试
      useEffect(function () {
        readyRef.current = false;
        setPhase('loading');
        const timer = window.setTimeout(function () {
          if (readyRef.current) return;
          setPhase('failed');
          reportClientError('view-no-ready', new Error('卡片视图 3 秒内未就绪'), { componentStack: 'widget=' + widget.id });
        }, 3000);
        return function () { window.clearTimeout(timer); };
      }, [widget.id, attempt, srcDoc]);
      const lastReport = useRef('');
      // 内容超出卡片时不再把被裁切的内容露出来，而是遮住并给「放大」出口
      const [over, setOver] = useState(null);

      useEffect(function () {
        function onMessage(event) {
          const frame = frameRef.current;
          if (frame === null || event.source !== frame.contentWindow) return;
          const message = event.data;
          if (!isObject(message) || message.__od !== true) return;
          if (message.type === 'ready') {
            readyRef.current = true;
            setPhase('ready');
            try {
              frame.contentWindow.postMessage({
                __od: true, type: 'data', value: props.dp && props.dp.value !== undefined ? props.dp.value : null,
                tokens: tokensFor(theme), size: widget.size,
              }, '*');
            } catch (error) { /* 忽略 */ }
            return;
          }
          if (message.type === 'overflow') {
            const scrollHeight = Number(message.scrollHeight) || 0;
            const clientHeight = Number(message.clientHeight) || 0;
            const tooBig = clientHeight > 0 && scrollHeight > clientHeight + 1;
            setOver(tooBig ? { scrollHeight: scrollHeight, clientHeight: clientHeight } : null);
            const key = scrollHeight + ':' + clientHeight;
            if (lastReport.current === key) return;
            lastReport.current = key;
            props.onOverflow({ scrollHeight: scrollHeight, clientHeight: clientHeight });
            return;
          }
          if (message.type === 'open') {
            const url = String(message.url ?? '');
            if (/^https?:\/\//i.test(url)) window.open(url, '_blank', 'noopener,noreferrer');
            return;
          }
          if (message.type === 'grow') {
            if (typeof props.onGrow === 'function') props.onGrow(widget);
            return;
          }
          if (message.type === 'save') {
            if (typeof props.onSave === 'function') props.onSave(message.value, message.options || null);
            return;
          }
          if (message.type === 'fetch') {
            props.onFetch({ id: message.id, url: message.url, init: message.init }).then(function (value) {
              try { frame.contentWindow.postMessage({ __od: true, type: 'fetch-result', id: message.id, ok: true, value: value }, '*'); } catch (error) { /* 忽略 */ }
            }, function (failure) {
              try { frame.contentWindow.postMessage({ __od: true, type: 'fetch-result', id: message.id, ok: false, error: String(failure && failure.message ? failure.message : failure) }, '*'); } catch (error) { /* 忽略 */ }
            });
          }
        }
        window.addEventListener('message', onMessage);
        return function () { window.removeEventListener('message', onMessage); };
      }, [widget.id, widget.size.w, widget.size.h, theme, props.dp && props.dp.fetchedAt]);

      useEffect(function () {
        const frame = frameRef.current;
        if (frame === null) return;
        try {
          frame.contentWindow.postMessage({
            __od: true, type: 'data', value: props.dp && props.dp.value !== undefined ? props.dp.value : null,
            tokens: tokensFor(theme), size: widget.size,
          }, '*');
        } catch (error) { /* 忽略 */ }
      }, [props.dp && props.dp.fetchedAt, widget.size.w, widget.size.h]);

      const suggested = over === null ? null : suggestSize(widget);
      return h('div', { className: 'od-iframe-wrap' },
        h('iframe', {
          key: 'frame-' + attempt,
          ref: frameRef,
          className: 'od-iframe',
          sandbox: 'allow-scripts',
          srcDoc: srcDoc,
          title: widget.title,
        }),
        phase === 'failed' && h('div', { className: 'od-mask', role: 'alert' },
          h('div', { className: 'od-mask-card' },
            h('div', { className: 'od-mask-title' }, '卡片视图没加载出来'),
            h('div', { className: 'od-mask-sub' }, '可能是脚本报错或加载超时。'),
            h('button', {
              type: 'button', className: 'od-btn od-btn-sm od-btn-primary',
              onClick: function () { setAttempt(function (n) { return n + 1; }); },
            }, '重试')
          )
        ),
        over !== null && h('div', { className: 'od-mask', role: 'status' },
          h('div', { className: 'od-mask-card' },
            h('div', { className: 'od-mask-title' }, '内容放不下'),
            h('div', { className: 'od-mask-sub' }, '这个渲染器比当前卡片大，被裁切的部分先藏起来了。'),
            suggested !== null && h('button', {
              type: 'button', className: 'od-btn od-btn-sm od-btn-primary',
              onClick: function () { if (typeof props.onGrow === 'function') props.onGrow(widget); },
            }, '放大到 ' + suggested.w + '×' + suggested.h)
          )
        )
      );
    }

    // ---------------- 卡片 ----------------
    /** 由上次溢出报告推出建议尺寸（每多 48px 加一行，最大 12）。 */
    function suggestSize(widget) {
      const overflow = isObject(widget.overflow) ? widget.overflow : {};
      const scrollHeight = asNumber(overflow.scrollHeight) ?? 0;
      const clientHeight = asNumber(overflow.clientHeight) ?? 0;
      const extra = Math.max(0, scrollHeight - clientHeight);
      const rows = Math.ceil(extra / 48);
      return {
        w: widget.size.w,
        h: clampInt(widget.size.h + rows, SIZE_MIN, SIZE_MAX, widget.size.h),
      };
    }

    // 卡片是否声明了取数来源；没有来源的是静态卡，不该永远转「取数中」
    function hasRefreshSpec(widget) {
      const spec = isObject(widget?.refresh) ? widget.refresh : {};
      return ['template', 'command', 'file', 'url'].some(function (key) {
        return typeof spec[key] === 'string' && spec[key].trim() !== '';
      });
    }

    function cardState(dp, now, hasRefresh) {
      if (hasRefresh === false) return 'static';
      if (!isObject(dp)) return 'loading';
      const fetchedAt = asNumber(dp.fetchedAt);
      const error = isObject(dp.error) ? dp.error : null;
      if (error !== null && dp.value === null) return 'broken';
      if (fetchedAt !== null && Number.isFinite(dp.ttl) && now - fetchedAt > dp.ttl) return 'stale';
      return 'ok';
    }

    function LoadingView() {
      return h('div', { className: 'od-renderer' },
        h('div', { className: 'od-skel', style: { width: '45%', height: 10 } }),
        h('div', { className: 'od-skel', style: { width: '70%', height: 26, marginTop: 6 } }),
        h('div', { className: 'od-skel', style: { width: '88%', marginTop: 8 } })
      );
    }

    function BrokenView(props) {
      const error = props.dp && isObject(props.dp.error) ? props.dp.error : {};
      return h('div', { className: 'od-renderer od-broken' },
        h('div', { className: 'od-broken-msg' }, asText(error.message, '取数失败')),
        props.lastOkAt !== null && h('div', { className: 'od-hint' }, '上次成功 ' + fmtClock(props.lastOkAt)),
        h('button', { type: 'button', className: 'od-btn od-btn-sm', disabled: props.busy, onClick: props.onRetry }, '重试')
      );
    }

    function CardMenu(props) {
      const [open, setOpen] = useState(false);
      const anchorRef = useRef(null);
      useEffect(function () {
        if (!open) return;
        function onDown(event) { if (anchorRef.current && !anchorRef.current.contains(event.target)) setOpen(false); }
        document.addEventListener('mousedown', onDown);
        return function () { document.removeEventListener('mousedown', onDown); };
      }, [open]);
      function choose(handler) { setOpen(false); handler(); }
      return h('div', { className: 'od-menu-anchor', ref: anchorRef },
        h('button', { type: 'button', className: 'od-icon-btn', 'aria-label': '卡片菜单', onClick: function () { setOpen(!open); } }, '⋯'),
        open && h('div', { className: 'od-menu', role: 'menu' },
          h('button', { type: 'button', className: 'od-menu-item', onClick: function () { choose(props.onEdit); } }, '属性…'),
          h('button', { type: 'button', className: 'od-menu-item', disabled: props.busy, onClick: function () { choose(props.onRefresh); } }, '立即刷新'),
          h('div', { className: 'od-menu-sep' }),
          h('button', { type: 'button', className: 'od-menu-item', 'data-danger': 'true', onClick: function () { choose(props.onRemove); } }, '删除')
        )
      );
    }

    class CardBoundary extends React.Component {
      constructor(props) { super(props); this.state = { error: null }; }
      static getDerivedStateFromError(error) { return { error: error }; }
      componentDidCatch(error, info) { reportClientError('card-crash', error, info); }
      render() {
        if (this.state.error !== null) {
          return h('section', { className: 'od-card', style: this.props.style },
            h('div', { className: 'od-card-head' }, h('span', { className: 'od-card-title' }, this.props.title)),
            h('div', { className: 'od-renderer od-broken' },
              h('div', { className: 'od-broken-msg' }, '这张卡渲染失败：' + String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error))
            )
          );
        }
        return this.props.children;
      }
    }

    function MissingView(props) {
      return h('div', { className: 'od-renderer od-broken' },
        h('div', { className: 'od-broken-msg' }, '这张卡片的 view/ 里还没有前端代码。'),
        h('div', { className: 'od-hint' }, '打开卡片会话，让 Agent 生成或修复 view/index.html。')
      );
    }

    function CardContent(props) {
      const widget = props.widget;
      const dp = props.dp;
      // 还在构建、尚未 card_set_refresh 的卡不是静态卡：圆点应显示「构建中」。
      const state = widget.building === true ? 'loading' : cardState(dp, props.now, hasRefreshSpec(widget));
      if (widget.building === true) return h('div', { className: 'od-renderer' },
        h('div', { className: 'od-metric-label' }, '卡片正在构建…'),
        h('div', { className: 'od-skel', style: { width: '60%', height: 22, marginTop: 8 } }),
        h('div', { className: 'od-skel', style: { width: '90%', marginTop: 10 } }),
        h('div', { className: 'od-skel', style: { width: '75%', marginTop: 8 } })
      );
      if (state === 'loading') return h(LoadingView, null);
      if (state === 'broken') return h(BrokenView, { dp: dp, lastOkAt: props.lastOkAt, busy: props.busy, onRetry: function () { props.onRefresh(widget.id); } });
      if (widget.view.html.trim() === '') return h(MissingView, { widget: widget });
      return h(CardView, {
        widget: widget, dp: dp, theme: props.theme, design: props.design,
        onOverflow: function (report) { props.onOverflow?.(widget.id, report); },
        onFetch: function (request) { return props.onFetch(widget.id, request); },
        onGrow: function (item) { props.onGrow?.(item); },
        onSave: function (value, options) { props.onSave?.(widget.id, value, options); },
      });
    }

    function WidgetCard(props) {
      const widget = props.widget;
      const dp = props.dp;
      // 还在构建、尚未 card_set_refresh 的卡不是静态卡：圆点应显示「构建中」。
      const state = widget.building === true ? 'loading' : cardState(dp, props.now, hasRefreshSpec(widget));
      const fetchedAt = isObject(dp) ? asNumber(dp.fetchedAt) : null;
      // 从未成功取过数时不要显示「498302h」这种假年龄
      const age = fetchedAt !== null && fetchedAt > 0 ? props.now - fetchedAt : null;
      const everyMs = widget.everyMs;
      const dotParts = [widget.building === true ? '构建中…' : state === 'static' ? '静态卡片' : state === 'loading' ? '取数中…' : state === 'broken' ? '取数失败' : state === 'stale' ? '数据陈旧' : '数据正常'];
      if (state === 'static') {
        dotParts.push('不自动刷新');
      } else {
        if (state === 'ok' && fetchedAt !== null && fetchedAt > 0) dotParts.push(fmtAge(age) + '更新');
        else if ((state === 'stale' || state === 'broken') && fetchedAt !== null && fetchedAt > 0) dotParts.push('最近成功 ' + fmtAge(age));
        if (widget.dailyAt !== null) dotParts.push('每天 ' + widget.dailyAt + ' 更新');
        else if (everyMs !== null) {
          const every = fmtEvery(everyMs);
          dotParts.push(every === '1 天' ? '每天更新' : every === '1 小时' ? '每小时更新' : '每 ' + every + '更新');
        }
      }
      const dotTitle = dotParts.join(' · ');
      const [dragging, setDragging] = useState(null);

      // 尺寸拖拽：用 Pointer Capture 绑定在把手上，指针移出窗口也能收到 pointerup，
      // 避免 mouseup 丢失导致「松手后继续改大小」的残留监听。
      const resizeRef = useRef(null);
      function computeResize(event, state) {
        const cellW = props.cellWidth > 0 ? props.cellWidth : 64;
        return {
          w: clampInt(state.startW + Math.round((event.clientX - state.startX) / cellW), SIZE_MIN, SIZE_MAX, state.startW),
          h: clampInt(state.startH + Math.round((event.clientY - state.startY) / GRID.rowHeight), SIZE_MIN, SIZE_MAX, state.startH),
        };
      }
      function onResizeDown(event) {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        const handle = event.currentTarget;
        try { handle.setPointerCapture(event.pointerId); } catch (error) { /* 忽略 */ }
        resizeRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startW: widget.size.w,
          startH: widget.size.h,
        };
        setDragging({ w: widget.size.w, h: widget.size.h });
      }
      function onResizeMove(event) {
        const state = resizeRef.current;
        if (state === null || state.pointerId !== event.pointerId) return;
        setDragging(computeResize(event, state));
      }
      function finishResize(event) {
        const state = resizeRef.current;
        if (state === null || (event !== undefined && state.pointerId !== event.pointerId)) return;
        resizeRef.current = null;
        const next = event === undefined ? { w: state.startW, h: state.startH } : computeResize(event, state);
        setDragging(null);
        if (next.w !== state.startW || next.h !== state.startH) props.onResize(widget.id, next);
      }
      function onResizeUp(event) {
        finishResize(event);
        try { event.currentTarget.releasePointerCapture(event.pointerId); } catch (error) { /* 忽略 */ }
      }
      function onResizeCancel() { finishResize(undefined); }
      useEffect(function () {
        function clear() { if (resizeRef.current !== null) finishResize(undefined); }
        window.addEventListener('blur', clear);
        return function () { window.removeEventListener('blur', clear); };
      }, []);

      const size = dragging !== null ? dragging : widget.size;
      const span = props.spanOf(size);

      const content = h(CardContent, { ...props, size: size });

      const sortable = dnd.useSortable({ id: widget.id });
      const cardStyle = props.dragStyle !== null && props.dragStyle !== undefined
        ? props.dragStyle
        : { gridColumn: 'span ' + span.w, gridRow: 'span ' + size.h };
      return h(CardBoundary, { style: cardStyle, title: widget.title },
        h('section', {
          className: 'od-card' + (props.dropTarget ? ' od-drop-target' : ''),
          style: cardStyle,
          ref: sortable.setNodeRef,
          'data-state': state,
          'data-widget-id': widget.id,
          tabIndex: -1,
          'data-drag': props.dragging ? 'true' : 'false',
          'aria-label': widget.title,
        },
        h('div', { className: 'od-card-head' },
          state === 'static'
            ? h('span', {
                className: 'od-state-dot', 'data-state': state,
                title: dotTitle, 'aria-label': dotTitle,
              })
            : h('button', {
                type: 'button', className: 'od-state-dot', 'data-state': state,
                title: dotTitle, 'aria-label': dotTitle + '（点击刷新）',
                onClick: function () { props.onRefresh(widget.id); },
              }),
          h('div', {
            className: 'od-card-grip',
            ref: sortable.setActivatorNodeRef,
            title: '按住拖动排序',
            ...sortable.attributes,
            ...sortable.listeners,
          },
            h('span', { className: 'od-card-title', title: widget.title }, widget.title),
            widget.building === true && h('span', { className: 'od-badge' }, '构建中'),
            widget.viewWarnings.length > 0 && h('span', {
              className: 'od-badge',
              title: widget.viewWarnings.join('；'),
            }, '风格偏差')
          ),
          widget.overflow !== null && widget.overflow !== undefined && h('button', {
            type: 'button', className: 'od-suggest',
            title: '内容放不下 · 建议 ' + suggestSize(widget).w + '×' + suggestSize(widget).h + '，点击放大',
            onClick: function () { props.onGrow(widget); },
          }, '放不下'),
          h('div', { className: 'od-card-actions' },
            h('button', {
              type: 'button', className: 'od-icon-btn',
              title: '修改这张卡', 'aria-label': '修改这张卡',
              onClick: function () { props.onModify(widget); },
            },
              h('svg', {
                width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none',
                stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
                'aria-hidden': 'true',
              },
                h('path', { d: 'M12 20h9' }),
                h('path', { d: 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z' })
              )
            ),
            h(CardMenu, {
              busy: props.busy,
              onEdit: function () { props.onEdit(widget); },
              onRefresh: function () { props.onRefresh(widget.id); },
              onRemove: function () { props.onRemove(widget); },
            })
          )
        ),        h('div', { className: 'od-body-slot' }, content),
          h('div', {
          className: 'od-resize',
          title: '拖动调整尺寸',
          onPointerDown: onResizeDown,
          onPointerMove: onResizeMove,
          onPointerUp: onResizeUp,
          onPointerCancel: onResizeCancel,
        })
        )
      );
    }

    // ---------------- 网格 ----------------
    function WidgetGrid(props) {
      const ref = useRef(null);
      const [layout, setLayout] = useState({ cols: 12, width: 0 });
      useEffect(function () {
        const element = ref.current;
        if (element === null) return;
        const measure = function () {
          const width = element.getBoundingClientRect().width;
          const cols = width < 560 ? 6 : width < 840 ? 8 : 12;
          setLayout({ cols: cols, width: width });
        };
        measure();
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return function () { observer.disconnect(); };
      }, []);
      const cols = layout.cols;
      const cellWidth = cols > 0 ? (layout.width - GRID.gap * (cols - 1)) / cols : 64;
      const spanOf = function (size) {
        if (cols >= GRID.columns) return { w: size.w, h: size.h };
        return { w: Math.max(2, Math.round((size.w * cols) / GRID.columns)), h: size.h };
      };

      const widgets = props.widgets;
      const ids = widgets.map(function (widget) { return widget.id; });
      const idsKey = ids.join('\u0000');

      // 拖动时把被拖的卡从网格里"拿起来"（fixed、不可见），在目标位置留一块
      // 同尺寸的虚线占位，其余卡片实时让位。命中位置由指针 + 其它卡片的矩形算出，
      // 不用 dnd-kit 的 over —— 否则被拖卡片自己在网格里移动会把命中结果带走。
      const [drag, setDrag] = useState(null);   // { id, index, rect: {left,top,width,height} }
      const dragRef = useRef(null);
      const [slot, setSlot] = useState(0);
      const slotRef = useRef(0);
      const [pending, setPending] = useState(null); // 松手后、服务端确认前的顺序
      const flipAnims = useRef(new WeakMap());

      function setSlotIndex(next) {
        if (slotRef.current === next) return;
        slotRef.current = next;
        setSlot(next);
      }

      useEffect(function () {
        if (pending === null) return;
        const same = pending.join('\u0000') === idsKey;
        if (same) setPending(null);
      }, [idsKey, pending === null]);

      function stopDragging() {
        dragRef.current = null;
        setDrag(null);
        const root = ref.current !== null ? ref.current.closest('.od-root') : null;
        if (root !== null) root.classList.remove('od-dragging');
        document.body.style.userSelect = '';
      }

      function nodeOf(id) {
        const grid = ref.current;
        if (grid === null || typeof grid.querySelectorAll !== 'function') return null;
        return Array.from(grid.querySelectorAll('[data-widget-id]')).find(function (node) {
          return node.getAttribute('data-widget-id') === id;
        }) ?? null;
      }

      // 指针压在谁身上，就把被拖卡片放到谁的位置：
      // 往后拖插到目标后面，往前拖插到目标前面（目标卡让位）。
      function computeSlot(x, y, activeId) {
        const activeIndex = ids.indexOf(activeId);
        const othersIds = ids.filter(function (id) { return id !== activeId; });
        const hit = typeof document.elementFromPoint === 'function' ? document.elementFromPoint(x, y) : null;
        const card = hit !== null && hit !== undefined && typeof hit.closest === 'function' ? hit.closest('[data-widget-id]') : null;
        const targetId = card === null ? null : card.getAttribute('data-widget-id');
        if (targetId !== null && targetId !== activeId) {
          const base = othersIds.indexOf(targetId);
          if (base >= 0) return base + (ids.indexOf(targetId) > activeIndex ? 1 : 0);
        }
        // 指针落在虚线空位或板面空白处：按"越过中线"计数，保持当前位置不来回跳。
        const grid = ref.current;
        if (grid === null || typeof grid.querySelectorAll !== 'function') return slotRef.current;
        const nodes = Array.from(grid.querySelectorAll('[data-widget-id]')).filter(function (node) {
          return node.getAttribute('data-widget-id') !== activeId;
        });
        let count = 0;
        for (const node of nodes) {
          const box = node.getBoundingClientRect();
          const sameRow = y >= box.top - 2 && y <= box.bottom + 2;
          const past = sameRow ? x > box.left + box.width / 2 : y > box.top + box.height / 2;
          if (past) count += 1;
        }
        return count;
      }

      function pointerOf(event) {
        const activator = event.activatorEvent;
        if (!activator) return null;
        let x = typeof activator.clientX === 'number' ? activator.clientX : null;
        let y = typeof activator.clientY === 'number' ? activator.clientY : null;
        if (x === null && activator.touches && activator.touches[0]) {
          x = activator.touches[0].clientX;
          y = activator.touches[0].clientY;
        }
        const delta = event.delta ?? { x: 0, y: 0 };
        if (x !== null && y !== null) return { x: x + delta.x, y: y + delta.y };
        // 键盘没有指针坐标：用被拖卡片平移后的中心当落点。
        const translated = event.active && event.active.rect && event.active.rect.current
          ? event.active.rect.current.translated
          : null;
        if (translated) return { x: translated.left + translated.width / 2, y: translated.top + translated.height / 2 };
        return null;
      }

      function onDragStart(event) {
        const id = String(event.active.id);
        const node = nodeOf(id);
        const box = node === null ? null : node.getBoundingClientRect();
        const index = ids.indexOf(id);
        const next = {
          id: id,
          index: index,
          rect: box === null ? null : { left: box.left, top: box.top, width: box.width, height: box.height },
        };
        dragRef.current = next;
        setDrag(next);
        setSlotIndex(index);
        const root = ref.current !== null ? ref.current.closest('.od-root') : null;
        if (root !== null) root.classList.add('od-dragging');
        document.body.style.userSelect = 'none';
      }

      function onDragMove(event) {
        const state = dragRef.current;
        if (state === null) return;
        const pointer = pointerOf(event);
        if (pointer !== null) {
          setSlotIndex(computeSlot(pointer.x, pointer.y, state.id));
          return;
        }
        // 键盘没有指针坐标：用 dnd-kit 给出的 over 兜底，一次挪一格。
        if (event.over === null || event.over === undefined) return;
        const overId = String(event.over.id);
        if (overId === state.id) return;
        const index = ids.filter(function (id) { return id !== state.id; }).indexOf(overId);
        if (index >= 0) setSlotIndex(index);
      }

      function onDragEnd() {
        const state = dragRef.current;
        const index = slotRef.current;
        stopDragging();
        if (state === null) return;
        if (index === state.index) return;
        const others = widgets.filter(function (widget) { return widget.id !== state.id; }).map(function (widget) { return widget.id; });
        others.splice(Math.max(0, Math.min(others.length, index)), 0, state.id);
        setPending(others);
        let pendingRequest = null;
        try { pendingRequest = props.onMove(state.id, index); } catch (error) { setPending(null); return; }
        if (pendingRequest && typeof pendingRequest.catch === 'function') {
          pendingRequest.catch(function () { setPending(null); });
        }
        window.setTimeout(function () { setPending(null); }, 6000);
      }

      function onDragCancel() {
        stopDragging();
      }

      // CSS grid 换位本身没有过渡：先量「当前视觉位置」，取消上一轮 FLIP，再量新布局，
      // 把差值补成动画。只取消自己创建的动画，避免多个动画叠出巨大位移。
      useLayoutEffect(function () {
        const grid = ref.current;
        if (grid === null || typeof grid.querySelectorAll !== 'function') return;
        const nodes = Array.from(grid.querySelectorAll('[data-widget-id]'));
        const activeId = dragRef.current === null ? null : dragRef.current.id;
        const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const visual = nodes.map(function (node) { return node.getBoundingClientRect(); });
        for (const node of nodes) {
          const running = flipAnims.current.get(node);
          if (running !== undefined) running.cancel();
        }
        if (reduce) return;
        for (let index = 0; index < nodes.length; index += 1) {
          const node = nodes[index];
          if (node.getAttribute('data-widget-id') === activeId) continue;
          const after = node.getBoundingClientRect();
          const dx = visual[index].left - after.left;
          const dy = visual[index].top - after.top;
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
          if (typeof node.animate !== 'function') continue;
          flipAnims.current.set(node, node.animate(
            [{ transform: 'translate3d(' + dx + 'px,' + dy + 'px,0)' }, { transform: 'none' }],
            { duration: FLIP_MS, easing: FLIP_EASING }
          ));
        }
      });

      const sensors = dnd.useSensors(
        dnd.useSensor(dnd.MouseSensor, { activationConstraint: { distance: 6 } }),
        dnd.useSensor(dnd.TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
        dnd.useSensor(dnd.KeyboardSensor, { coordinateGetter: dnd.sortableKeyboardCoordinates })
      );

      const byId = new Map(widgets.map(function (widget) { return [widget.id, widget]; }));
      const display = pending === null
        ? widgets
        : pending.map(function (id) { return byId.get(id); }).filter(Boolean);
      const activeWidget = drag === null ? null : (byId.get(drag.id) ?? null);
      const activeSpan = activeWidget === null ? null : spanOf(activeWidget.size);
      const overlayStyle = activeWidget === null || activeSpan === null ? null : {
        width: Math.min(320, activeSpan.w * cellWidth + (activeSpan.w - 1) * GRID.gap) + 'px',
      };
      const others = drag === null
        ? display
        : display.filter(function (widget) { return widget.id !== drag.id; });
      const slotIndex = Math.max(0, Math.min(others.length, slot));

      const dragStyle = drag === null || drag.rect === null ? null : {
        position: 'fixed',
        left: drag.rect.left + 'px',
        top: drag.rect.top + 'px',
        width: drag.rect.width + 'px',
        height: drag.rect.height + 'px',
        margin: '0',
        zIndex: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
      };

      function renderCard(widget, fixed) {
        const report = props.overflowMap ? props.overflowMap[widget.id] : null;
        const merged = report && report.scrollHeight > report.clientHeight
          ? Object.assign({}, widget, { overflow: report })
          : widget;
        return h(WidgetCard, {
          key: widget.id,
          widget: merged,
          dp: props.data[widget.id],
          now: props.now,
          theme: props.theme,
          design: props.design,
          busy: props.busy,
          cellWidth: cellWidth,
          spanOf: spanOf,
          onEdit: props.onEdit,
          onModify: props.onModify,
          onRefresh: props.onRefresh,
          onRemove: props.onRemove,
          onResize: props.onResize,
          onGrow: props.onGrow,
          onOverflow: props.onOverflow,
          onFetch: props.onFetch,
          onSave: props.onSave,
          dragging: drag !== null && drag.id === widget.id,
          dragStyle: fixed ? dragStyle : null,
        });
      }

      const children = [];
      others.slice(0, slotIndex).forEach(function (widget) { children.push(renderCard(widget, false)); });
      if (drag !== null && activeSpan !== null) {
        children.push(h('div', {
          key: '__od-slot',
          className: 'od-drop-slot',
          style: { gridColumn: 'span ' + activeSpan.w, gridRow: 'span ' + activeSpan.h },
          'aria-hidden': 'true',
        },
          h('div', { className: 'od-drop-slot-inner' }, activeSpan.w + '×' + activeSpan.h)
        ));
      }
      others.slice(slotIndex).forEach(function (widget) { children.push(renderCard(widget, false)); });
      if (activeWidget !== null) children.push(renderCard(activeWidget, true));

      const grid = h('div', { className: 'od-grid', ref: ref },
        h(dnd.SortableContext, { items: ids, strategy: dnd.rectSortingStrategy }, children)
      );
      if (!dnd.supported) return grid;

      return h(dnd.DndContext, {
        sensors: sensors,
        collisionDetection: dnd.closestCenter,
        onDragStart: onDragStart,
        onDragMove: onDragMove,
        onDragEnd: onDragEnd,
        onDragCancel: onDragCancel,
        accessibility: {
          screenReaderInstructions: {
            draggable: '按空格键拿起卡片，用方向键移动，再按空格键放下；按 Escape 取消。',
          },
        },
      },
        grid,
        activeWidget === null ? null : h(dnd.DragOverlay, {
          modifiers: [dnd.snapCenterToCursor],
          dropAnimation: null,
          className: 'od-drag-layer',
          style: { pointerEvents: 'none' },
        },
          h('div', { className: 'od-drag-overlay', style: overlayStyle },
            h('div', { className: 'od-drag-overlay-top' },
              h('span', { className: 'od-drag-overlay-title' }, activeWidget.title),
              h('span', { className: 'od-drag-overlay-size' }, activeWidget.size.w + '×' + activeWidget.size.h)
            ),
            h('div', { className: 'od-drag-overlay-hint' }, '松开放到这里')
          )
        )
      );
    }

    // ---------------- 对话：Turn 视图 ----------------
    const SYSTEM_PROMPT_MARK = '【卡片任务】';
    const USER_ASK_MARK = '用户需求：';
    const TOOL_GROUP_LIMIT = 6;

    // 首条消息 = 系统注入的卡片任务 + 用户真正的需求。把前者收成 chip，别让指令墙占满视野。
    function splitPrompt(text) {
      const raw = asText(text);
      if (!raw.startsWith(SYSTEM_PROMPT_MARK)) return { system: '', ask: raw };
      const at = raw.indexOf(USER_ASK_MARK);
      if (at < 0) return { system: raw, ask: '' };
      return {
        system: raw.slice(0, at + USER_ASK_MARK.length).trim(),
        ask: raw.slice(at + USER_ASK_MARK.length).trim(),
      };
    }

    function fmtDuration(ms) {
      if (!Number.isFinite(ms) || ms < 0) return '';
      if (ms < 1000) return Math.round(ms) + 'ms';
      if (ms < 60000) return (ms / 1000).toFixed(ms < 10000 ? 1 : 0) + 's';
      return Math.round(ms / 60000) + 'm';
    }

    /** 同一动作 + 同一参数合并成一行；重复的「执行命令」不再刷屏。 */
    function groupTools(tools) {
      const groups = [];
      const index = new Map();
      for (const tool of asArray(tools)) {
        const verb = asText(tool.verb, '操作') || '操作';
        const detail = asText(tool.argsSummary);
        const key = verb + '\u0000' + detail;
        let group = index.get(key);
        if (group === undefined) {
          group = { key: key, verb: verb, detail: detail, count: 0, status: 'ok', result: '', durationMs: 0 };
          index.set(key, group);
          groups.push(group);
        }
        group.count += 1;
        if (tool.status === 'error') group.status = 'error';
        else if (tool.status === 'running' && group.status !== 'error') group.status = 'running';
        if (group.result === '' && asText(tool.resultSummary) !== '') group.result = asText(tool.resultSummary);
        if (Number.isFinite(tool.durationMs)) group.durationMs += tool.durationMs;
      }
      return groups;
    }

    function groupDigest(groups) {
      const counts = new Map();
      for (const group of groups) counts.set(group.verb, (counts.get(group.verb) ?? 0) + group.count);
      return [...counts.entries()].map(function (entry) { return entry[0] + ' ×' + entry[1]; });
    }

    function SystemNote(props) {
      const [open, setOpen] = useState(false);
      const count = props.count;
      return h('div', { className: 'od-sysnote' },
        h('button', {
          type: 'button', className: 'od-sysnote-chip', 'aria-expanded': open,
          title: '这张卡的系统指令，默认收起',
          onClick: function () { setOpen(!open); },
        },
          h('span', { className: 'od-sysnote-dot' }),
          h('span', { className: 'od-sysnote-label' }, '卡片任务'),
          count > 0 && h('span', { className: 'od-sysnote-count' }, count + ' 个动作'),
          h('span', { className: 'od-sysnote-hint' }, open ? '收起指令' : '查看指令')
        ),
        asText(props.ask) !== '' && h('div', { className: 'od-user' }, asText(props.ask)),
        open && h('pre', { className: 'od-sysnote-body' }, asText(props.text))
      );
    }

    function ToolGroupRow(props) {
      const [open, setOpen] = useState(false);
      const group = props.group;
      const meta = [];
      if (group.count > 1) meta.push('×' + group.count);
      const duration = fmtDuration(group.durationMs);
      if (duration !== '') meta.push(duration);
      return h('div', null,
        h('button', {
          type: 'button', className: 'od-tool', 'data-status': group.status,
          title: group.detail || group.result || group.verb,
          onClick: function () { setOpen(!open); },
        },
          h('span', { className: 'od-tool-name' }, group.verb),
          h('span', { className: 'od-tool-detail' }, group.detail || (group.status === 'running' ? '进行中…' : '')),
          meta.length > 0 && h('span', { className: 'od-tool-meta' }, meta.join(' · '))
        ),
        open && group.result !== '' && h('div', { className: 'od-tool-expand' }, group.result)
      );
    }

    function WorkDetails(props) {
      const mode = props.mode;
      const tools = asArray(props.tools);
      const running = props.ended === null || props.ended === undefined;
      const [open, setOpen] = useState(mode === 'detailed');
      const [showAll, setShowAll] = useState(false);
      useEffect(function () {
        // 回合结束时 detailed 保持展开，standard 不自动弹开
        if (mode === 'detailed' && !running) setOpen(true);
      }, [running, mode]);
      if (tools.length === 0) return null;
      if (mode === 'compact' && !running) return null;
      const groups = groupTools(tools);
      const digest = groupDigest(groups);
      const errors = groups.reduce(function (sum, group) { return sum + (group.status === 'error' ? group.count : 0); }, 0);
      const state = errors > 0 ? 'error' : (running ? 'running' : 'ok');
      const visible = showAll ? groups : groups.slice(0, TOOL_GROUP_LIMIT);
      const last = tools[tools.length - 1];
      const duration = fmtDuration(props.durationMs);
      return h('div', { className: 'od-details' },
        h('button', {
          type: 'button', className: 'od-details-head', 'aria-expanded': open,
          onClick: function () { setOpen(!open); },
        },
          h('span', { className: 'od-details-dot', 'data-status': state }),
          h('span', { className: 'od-details-count' }, (mode === 'compact' ? '处理中 · ' : '工作详情 · ') + tools.length + ' 个动作'),
          digest.length > 0 && h('span', { className: 'od-details-digest' }, digest.join(' · ')),
          errors > 0 && h('span', { className: 'od-details-bad' }, errors + ' 个失败'),
          duration !== '' && h('span', { className: 'od-details-time' }, duration),
          h('span', { className: 'od-hint' }, open ? '收起' : '展开')
        ),
        !open && running && last !== undefined && h('div', { className: 'od-details-live' },
          '正在 ' + asText(last.verb, '执行') + (asText(last.argsSummary) !== '' ? ' · ' + asText(last.argsSummary) : '') + '…'
        ),
        open && h('div', { className: 'od-tool-list' },
          visible.map(function (group) {
            return h(ToolGroupRow, { key: group.key, group: group });
          }),
          groups.length > visible.length && h('button', {
            type: 'button', className: 'od-more',
            onClick: function () { setShowAll(true); },
          }, '还有 ' + (groups.length - visible.length) + ' 类动作')
        )
      );
    }

    function TurnBlock(props) {
      const turn = props.turn;
      const mode = props.mode;
      const stream = props.stream;
      const steps = asArray(turn.steps);
      const allTools = [];
      for (const step of steps) {
        for (const tool of asArray(step.tools)) allTools.push(tool);
      }
      const prompt = splitPrompt(turn.user && turn.user.text);
      const liveText = stream !== null ? asText(stream.text) : '';
      const liveStep = stream !== null && asNumber(stream.step) !== null && asNumber(stream.step) > 0 ? asNumber(stream.step) : null;
      let livePlaced = false;
      return h('div', { className: 'od-turn' },
        prompt.system !== ''
          ? h(SystemNote, { text: prompt.system, ask: prompt.ask, count: allTools.length })
          : (prompt.ask !== '' && h('div', { className: 'od-user' }, prompt.ask)),
        steps.map(function (step, index) {
          const stepText = asText(step.assistant.text);
          const matches = liveStep === null ? index === steps.length - 1 : step.step === liveStep;
          const streamHere = liveText !== '' && matches;
          if (streamHere) livePlaced = true;
          // 轮询可能先拿到整段，逐字流再补同一段：已经包含就不重复画
          const showHere = streamHere && !stepText.endsWith(liveText);
          // 只有工具调用、没有正文的 step 不占 DOM：工具在「工作详情」里按回合聚合
          if (stepText === '' && !showHere) return null;
          return h('div', { key: 'step' + step.step, className: 'od-step' },
            stepText !== '' && h('div', { className: 'od-assistant' }, h(RichText, { text: stepText })),
            showHere && h('div', { className: 'od-assistant' }, h('span', { className: 'od-stream' }, liveText))
          );
        }),
        !livePlaced && liveText !== '' && h('div', { className: 'od-assistant' }, h('span', { className: 'od-stream' }, liveText)),
        h(WorkDetails, { mode: mode, tools: allTools, ended: turn.ended, durationMs: turn.durationMs }),
        turn.ended === 'aborted' && h('div', { className: 'od-aborted' }, '已中止')
      );
    }

    function ChatPanel(props) {
      const chat = props.chat;
      const [draft, setDraft] = useState('');
      const listRef = useRef(null);
      const turns = chat !== null ? chat.turns : [];
      const stream = chat !== null ? chat.stream : null;
      const busy = chat !== null && chat.busy;
      const lastLength = turns.length;
      const streamLength = stream !== null ? stream.text.length : 0;
      useEffect(function () {
        const element = listRef.current;
        if (element !== null) element.scrollTop = element.scrollHeight;
      }, [lastLength, streamLength, props.open]);

      function submit() {
        const text = draft.trim();
        if (text === '' || busy || chat === null || chat.sessionId === '') return;
        setDraft('');
        props.onSend(text);
      }

      return h('aside', { className: 'od-chat-panel', style: props.style },
        h('header', { className: 'od-chat-head' },
          h('span', { className: 'od-chat-title' }, '和板对话'),
          busy && h('span', { className: 'od-hint' }, '处理中…'),
          h('span', { className: 'od-spacer' }),
          h('select', {
            className: 'od-select',
            value: props.mode,
            title: '工作详情的展示方式',
            onChange: function (event) { props.onMode(event.target.value); },
          }, TRANSCRIPT_VIEWS.map(function (option) {
            return h('option', { key: option.id, value: option.id }, option.label);
          })),
          h('button', { type: 'button', className: 'od-icon-btn', 'aria-label': '收起对话面板', onClick: props.onClose }, '×')
        ),
        h('div', { className: 'od-chat-list', ref: listRef },
          turns.length === 0 && h('div', { className: 'od-chat-empty' },
            '说一句话就能改这块板。例如「给加密货币加一只 LINK」「把狗狗币删掉」「世界时钟改成 6×4」。'),
          turns.map(function (turn) {
            return h(TurnBlock, { key: 'turn' + turn.turn, turn: turn, mode: props.mode, stream: stream });
          })
        ),
        h('div', { className: 'od-composer' },
          h('textarea', {
            className: 'od-input', rows: 2, value: draft,
            placeholder: chat !== null && chat.sessionId !== '' ? '说一句话改这块板…' : '对话不可用：会话服务未就绪',
            disabled: busy || chat === null || chat.sessionId === '',
            onChange: function (event) { setDraft(event.target.value); },
            onKeyDown: function (event) {
              if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); }
            },
          }),
          h('div', { className: 'od-composer-row' },
            h('span', { className: 'od-hint' }, 'Enter 发送 · Shift+Enter 换行'),
            h('button', {
              type: 'button', className: 'od-btn od-btn-sm od-btn-primary',
              disabled: busy || draft.trim() === '' || chat === null || chat.sessionId === '',
              onClick: submit,
            }, busy ? '处理中…' : '发送')
          )
        )
      );
    }

    // ---------------- 弹窗：新增 / 编辑 ----------------
    function SizePicker(props) {
      const size = props.size;
      return h('div', { className: 'od-field' },
        h('span', { className: 'od-field-label' }, '尺寸（12 列网格）'),
        h('div', { className: 'od-sizes' },
          Object.keys(SIZE_PRESETS).map(function (key) {
            const preset = SIZE_PRESETS[key];
            const on = preset.w === size.w && preset.h === size.h;
            return h('button', {
              key: key, type: 'button', className: 'od-size-btn', 'data-on': on ? 'true' : 'false',
              disabled: props.busy,
              onClick: function () { props.onChange({ ...preset }); },
            },
              h('span', null, key + '（' + preset.w + '×' + preset.h + '）')
            );
          }),
          h('label', { className: 'od-size-btn', style: { flexDirection: 'row', alignItems: 'center', gap: '4px' } },
            'W',
            h('input', {
              className: 'od-input', type: 'number', min: SIZE_MIN, max: SIZE_MAX, value: size.w,
              style: { width: '52px', padding: '2px 6px' }, disabled: props.busy,
              onChange: function (event) { props.onChange({ w: clampInt(Number(event.target.value), SIZE_MIN, SIZE_MAX, size.w), h: size.h }); },
            })
          ),
          h('label', { className: 'od-size-btn', style: { flexDirection: 'row', alignItems: 'center', gap: '4px' } },
            'H',
            h('input', {
              className: 'od-input', type: 'number', min: SIZE_MIN, max: SIZE_MAX, value: size.h,
              style: { width: '52px', padding: '2px 6px' }, disabled: props.busy,
              onChange: function (event) { props.onChange({ w: size.w, h: clampInt(Number(event.target.value), SIZE_MIN, SIZE_MAX, size.h) }); },
            })
          )
        )
      );
    }

    function Modal(props) {
      useEffect(function () {
        function onKey(event) { if (event.key === 'Escape') props.onClose(); }
        document.addEventListener('keydown', onKey);
        return function () { document.removeEventListener('keydown', onKey); };
      }, [props.onClose]);
      return h('div', { className: 'od-overlay', onMouseDown: function (event) { if (event.target === event.currentTarget) props.onClose(); } },
        h('div', { className: 'od-modal', role: 'dialog', 'aria-modal': 'true' },
          h('div', { className: 'od-modal-head' },
            h('h2', { className: 'od-modal-title' }, props.title),
            h('span', { className: 'od-spacer' }),
            h('button', { type: 'button', className: 'od-icon-btn', 'aria-label': '关闭', onClick: props.onClose }, '✕')
          ),
          h('div', { className: 'od-modal-body' }, props.children),
          props.footer && h('div', { className: 'od-modal-foot' }, props.footer)
        )
      );
    }

    function ConfirmModal(props) {
      return h(Modal, { title: props.title, onClose: props.onClose, footer: [
        h('span', { key: 'sp', className: 'od-spacer' }),
        h('button', { key: 'c', type: 'button', className: 'od-btn od-btn-ghost', onClick: props.onClose }, '取消'),
        h('button', { key: 'ok', type: 'button', className: 'od-btn od-btn-primary', onClick: props.onConfirm }, '确定'),
      ] }, h('div', { className: 'od-hint', style: { fontSize: '12.5px' } }, props.message));
    }

    // ---------------- 顶栏 ----------------
    function TopBar(props) {
      return h('header', { className: 'od-top' },
        h('div', { className: 'od-top-main' },
          h('h1', { className: 'od-title', title: props.name + ' · ' + CLIENT_BUILD }, props.name),
          h('span', { className: 'od-meta' }, props.count === null ? '加载中…' : props.count + ' 张卡片')
        ),
        h('div', { className: 'od-top-right' },
          h('button', {
            type: 'button', className: 'od-icon-btn',
            title: props.paused ? '恢复刷新' : '暂停刷新',
            'aria-label': props.paused ? '恢复刷新' : '暂停刷新',
            disabled: props.busy, onClick: props.onTogglePause,
          },
            props.paused
              ? h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, h('path', { d: 'M8 5v14l11-7z' }))
              : h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
                h('rect', { x: 7, y: 5, width: 3.5, height: 14, rx: 1 }),
                h('rect', { x: 13.5, y: 5, width: 3.5, height: 14, rx: 1 })
              )
          ),
          h('button', {
            type: 'button', className: 'od-icon-btn', title: '刷新全部',
            'aria-label': '刷新全部', disabled: props.busy || props.count === null, onClick: props.onRefresh,
          },
            h('svg', {
              width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
              'aria-hidden': 'true',
            },
              h('path', { d: 'M21 12a9 9 0 1 1-2.64-6.36' }),
              h('path', { d: 'M21 3v6h-6' })
            )
          ),
          h('button', {
            type: 'button', className: 'od-icon-btn od-icon-btn-raised',
            title: '新建卡片', 'aria-label': '新建卡片', onClick: props.onAdd,
          },
            h('svg', {
              width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round',
              'aria-hidden': 'true',
            }, h('path', { d: 'M12 5v14M5 12h14' }))
          )
        )
      );
    }

    function ActionToast(props) {
      const action = props.action;
      const [, force] = useState(0);
      useEffect(function () {
        const timer = window.setInterval(function () { force(function (n) { return n + 1; }); }, 1000);
        return function () { window.clearInterval(timer); };
      }, []);
      if (!isObject(action) || asText(action.label) === '') return null;
      const at = asNumber(action.at) ?? 0;
      if (at > 0 && Date.now() - at > 10000) return null;
      return h('div', { className: 'od-toast' },
        h('span', { className: 'od-toast-text' }, asText(action.label)),
        action.canUndo === true && h('button', { type: 'button', className: 'od-btn od-btn-sm od-btn-ghost', disabled: props.busy, onClick: props.onUndo }, '撤销'),
        h('button', { type: 'button', className: 'od-btn od-btn-sm od-btn-ghost', onClick: props.onDismiss, 'aria-label': '关闭' }, '✕')
      );
    }

    function EmptyBoard(props) {
      return h('div', { className: 'od-empty' },
        h('div', null, '还没有卡片。'),
        h('button', { type: 'button', className: 'od-btn od-btn-primary', onClick: props.onAdd }, '新建第一张卡片'),
        h('div', { className: 'od-hint' }, '从场景模板开始，或者用自己的话描述。')
      );
    }

    // ---------------- 板 ----------------

    // 场景模板 = 一段可以直接发出的 prompt。点一下填进输入框，城市/地址/频率都自己改。
    // 30 张都验证过数据源；模板里不写死刷新频率，由弹窗的「更新频率」追加。
    const every = (ms) => ({ kind: 'every', ms: ms });
    const daily = (at) => ({ kind: 'daily', at: at });

    const SCENE_CATEGORIES = [
      { id: 'today', title: '今天', blurb: '出门前先看一眼' },
      { id: 'work', title: '工作', blurb: '活儿干到哪了' },
      { id: 'money', title: '钱', blurb: '汇率、行情、余额' },
      { id: 'info', title: '信息', blurb: '外面发生了什么' },
      { id: 'life', title: '生活', blurb: '家里那些小事' },
      { id: 'assets', title: '数字资产', blurb: '别等过期才发现' },
    ];

    const SCENES = [
      // 今天
      {
        id: 'weather', category: 'today', title: '天气 · 今天穿什么', size: { w: 4, h: 7 }, schedule: every(3_600_000),
        blurb: '降水、体感、紫外线，顺手告诉你带不带伞',
        prompt: '做一个天气卡片：默认上海（把上海换成你的城市）。显示当前温度、体感温度、天气状况、今天最高最低和未来三天预报，再给一句「今天要不要带伞」的判断（降水概率达到 40% 就提醒带伞）。用 Open-Meteo 的免费接口，不需要 API key。取数失败时显示上次成功的数据并标注数据陈旧。',
      },
      {
        id: 'air', category: 'today', title: '空气质量', size: { w: 4, h: 6 }, schedule: every(3_600_000),
        blurb: 'AQI、PM2.5，超过 100 就标黄',
        prompt: '做一个空气质量卡片：默认上海。显示实时 AQI、PM2.5、PM10 和今天的空气质量等级；AQI 超过 100 标黄，超过 150 标红。用 Open-Meteo 的 air-quality-api.open-meteo.com 免费接口，不需要 key。',
      },
      {
        id: 'sun', category: 'today', title: '日出日落', size: { w: 4, h: 5 }, schedule: every(21_600_000),
        blurb: '今天几点天亮、几点天黑',
        prompt: '做一个日出日落卡片：默认上海。显示今天的日出、日落、白昼时长，以及「离日落还有多久」。用 sunrise-sunset.org 的免费 JSON 接口，或者用本地经纬度直接算，不需要 key。',
      },
      {
        id: 'umbrella', category: 'today', title: '未来 7 天带伞', size: { w: 5, h: 6 }, schedule: every(3_600_000),
        blurb: '哪几天要带伞，一眼扫完',
        prompt: '做一个「未来 7 天带伞日历」卡片：默认上海。列出未来 7 天每天的最高温、最低温和降水概率，降水概率达到 40% 的那天标出来并写「带伞」。用 Open-Meteo 免费接口。整张卡要能一眼扫完，不要做成密集表格。',
      },
      {
        id: 'clock', category: 'today', title: '世界时钟', size: { w: 6, h: 5 }, schedule: every(60_000),
        blurb: '上海、东京、纽约、伦敦，谁在白天',
        prompt: '做一个世界时钟卡片：显示上海、东京、纽约、伦敦的当前时间和日期，并标出哪些城市是白天、哪些是夜晚。纯本地计算，不需要网络。默认这四个城市，用户可以在 prompt 里改。',
      },

      // 工作
      {
        id: 'health', category: 'work', title: '服务健康', size: { w: 5, h: 6 }, schedule: every(30_000),
        blurb: '哪些地址挂了、慢在哪',
        prompt: '做一个服务健康卡片：默认检查 https://example.com 和 http://127.0.0.1:5434（把地址换成你自己的）。显示每个地址是否可访问、HTTP 状态码、响应耗时；某个地址连不上只把那一行标红，其它行照常显示，不要整张卡报错。用命令行 curl，单个请求超时 5 秒。',
      },
      {
        id: 'system', category: 'work', title: '本机资源', size: { w: 4, h: 7 }, schedule: every(30_000),
        blurb: 'CPU、内存、磁盘、电池',
        prompt: '做一个本机状态卡片（macOS）：CPU 占用、内存使用、磁盘剩余、电池电量和是否在充电。用 vm_stat、df、pmset 这些本机命令，不需要任何外部接口。磁盘剩余低于 10% 或电量低于 20% 时标红。',
      },
      {
        id: 'docker', category: 'work', title: 'Docker 容器', size: { w: 5, h: 7 }, schedule: every(30_000),
        blurb: '哪些容器在跑、健康不健康',
        prompt: '做一个 Docker 卡片：显示本机正在运行的容器名称、镜像、状态、端口映射和已运行时长。用 docker ps。有容器退出或 unhealthy 时标红。如果 Docker 没在运行，明确写「Docker 未运行」，不要整卡报错。',
      },
      {
        id: 'ports', category: 'work', title: '端口 · 服务地图', size: { w: 5, h: 7 }, schedule: every(30_000),
        blurb: '5000 被谁占了，一眼看到',
        prompt: '做一个本机端口地图：列出正在监听的 TCP 端口、对应进程和端口号；过滤掉 rapportd、ControlCenter 这类系统进程，只保留开发相关的服务。用 lsof -iTCP -sTCP:LISTEN。如果某个端口是 Docker 映射，标出来。',
      },
      {
        id: 'git', category: 'work', title: 'Git 未提交 / 未推送', size: { w: 5, h: 7 }, schedule: every(300_000),
        blurb: '我到底忘了 push 什么',
        prompt: '做一个 Git 待办卡片：扫描 ~/Code 下的仓库（把路径换成你的），列出每个仓库的未提交文件数、未推送的提交数、当前分支。只显示有未提交或未推送的仓库，全部干净时显示「都干净了」。用本机 git 命令，不要联网。',
      },

      {
        id: 'todo', category: 'work', title: '待办清单', size: { w: 5, h: 6 }, schedule: every(300_000),
        blurb: '像 iOS 提醒事项一样勾选、增删改',
        prompt: '做一个待办清单卡片，像 iOS 提醒事项：圆形勾选框、完成划线、发丝线分行、底部输入框。数据存在 data/state.json，结构为 {"items":[{"id":1,"text":"...","done":false,"tag":"今天"}]}；首次创建时写入空列表。用 window.dshWidget.data 读取，新增/勾选/删除/双击编辑后调用 window.dshWidget.save({items})。不要用 localStorage（沙箱不允许）。调 card_set_refresh 时传 file="data/state.json"、everyMs=300000。',
      },

      // 钱
      {
        id: 'fx', category: 'money', title: '美元汇率', size: { w: 4, h: 6 }, schedule: every(300_000),
        blurb: 'USD 兑人民币、欧元、日元',
        prompt: '做一个汇率卡片：显示 USD 兑 CNY、EUR、JPY 的当前汇率和今日涨跌。优先用 frankfurter.dev 的免费接口，不需要 key；失败时用上次成功的缓存并标注数据陈旧。涨绿跌红。',
      },
      {
        id: 'stocks', category: 'money', title: '自选股', size: { w: 4, h: 7 }, schedule: every(300_000),
        blurb: '港股、美股，一屏看完',
        prompt: '做一个自选股卡片：默认关注腾讯 00700、泡泡玛特 09992、英伟达 NVDA（把代码换成你的）。显示现价、涨跌幅、今开、昨收。用腾讯行情接口 qt.gtimg.cn，不需要 key，请求时带 Referer: https://gu.qq.com/。涨绿跌红，失败时显示缓存并标注陈旧。',
      },
      {
        id: 'indices', category: 'money', title: '全球指数', size: { w: 4, h: 6 }, schedule: every(300_000),
        blurb: '道指、纳指、标普、上证',
        prompt: '做一个全球指数卡片：显示道琼斯、纳斯达克、标普 500 和上证指数的点位与涨跌幅。用腾讯行情接口 qt.gtimg.cn，代码 usDJI、usIXIC、usINX、s_sh000001，不需要 key。涨绿跌红。',
      },
      {
        id: 'gold', category: 'money', title: '黄金 · 白银', size: { w: 4, h: 6 }, schedule: every(300_000),
        blurb: '现货金价，顺手换算成一克',
        prompt: '做一个黄金白银卡片：显示现货黄金和现货白银的美元价格与今日涨跌幅。用腾讯行情接口 qt.gtimg.cn 的 hf_XAU 和 hf_XAG，不需要 key。再按当前 USD/CNY 汇率换算一克黄金大约多少人民币。',
      },
      {
        id: 'wallet', category: 'money', title: '链上钱包', size: { w: 4, h: 6 }, schedule: every(60_000),
        blurb: 'ETH 余额和当前区块',
        prompt: '做一个链上钱包卡片：默认显示 vitalik.eth 的 ETH 余额（把地址换成你的）。用公共 Ethereum RPC https://ethereum-rpc.publicnode.com 的 eth_getBalance 和 eth_blockNumber，不需要 key。显示 ETH 数量和当前区块高度。',
      },

      // 信息
      {
        id: 'hn', category: 'info', title: 'Hacker News', size: { w: 5, h: 8 }, schedule: every(600_000),
        blurb: '首页前 10 条，标题、分数、评论',
        prompt: '做一个 Hacker News 卡片：显示首页前 10 条，每条显示标题、分数、评论数和发布时间，点标题打开原文。用 Firebase 的公开接口 https://hacker-news.firebaseio.com/v0/topstories.json 加 item 接口，不需要 key。',
      },
      {
        id: 'arxiv', category: 'info', title: 'arXiv 新论文', size: { w: 5, h: 8 }, schedule: daily('10:00'),
        blurb: 'cs.AI 今天新提交的论文',
        prompt: '做一个 arXiv 新论文卡片：显示 cs.AI 分类今天新提交的论文，按提交时间倒序取前 10 条，显示标题、第一作者和链接。用 export.arxiv.org 的 Atom 接口，不需要 key。没有新论文时显示「今天还没有新论文」。',
      },
      {
        id: 'rss', category: 'info', title: '订阅更新', size: { w: 5, h: 8 }, schedule: every(1_800_000),
        blurb: '少数派、GitHub Blog、HN 的最新文章',
        prompt: '做一个订阅更新卡片：抓取这几个 RSS 源，把最新 8 条按时间倒序显示标题、来源和多久前发布：https://sspai.com/feed、https://github.blog/feed/、https://hnrss.org/frontpage（可以换成你自己的源）。点标题打开原文。',
      },
      {
        id: 'trending', category: 'info', title: 'GitHub 今日热门', size: { w: 5, h: 8 }, schedule: every(3_600_000),
        blurb: '最近 7 天新建、star 最多的仓库',
        prompt: '做一个 GitHub 今日热门卡片：用 GitHub Search API 找最近 7 天创建、star 最多的 8 个仓库，显示仓库名、描述、语言和 star 数。接口是 https://api.github.com/search/repositories?q=created:>YYYY-MM-DD&sort=stars&order=desc，不需要 key（有速率限制，失败就显示缓存）。',
      },
      {
        id: 'lobsters', category: 'info', title: 'Lobsters 热帖', size: { w: 5, h: 8 }, schedule: every(1_800_000),
        blurb: '技术圈今天在讨论什么',
        prompt: '做一个 Lobsters 热帖卡片：显示 https://lobste.rs/hottest.json 的前 10 条，标题、分数、评论数和标签，点标题打开原文。不需要 key。',
      },

      // 生活
      {
        id: 'trash', category: 'life', title: '倒垃圾日', size: { w: 4, h: 5 }, schedule: daily('10:00'),
        blurb: '今天该扔哪种垃圾，还有多久',
        prompt: '做一个倒垃圾日卡片：默认「周一和周四晚上 8 点前扔垃圾」（改成你所在城市的规则）。显示今天该扔哪种垃圾、下一次是什么时候、还有多久。纯本地计算，不需要网络。',
      },
      {
        id: 'plants', category: 'life', title: '植物浇水', size: { w: 4, h: 6 }, schedule: daily('10:00'),
        blurb: '哪盆该浇水了，哪盆已经晚了',
        prompt: '做一个植物浇水卡片：在 data/plants.json 里维护几盆植物的名字和上次浇水日期（默认绿萝、龟背竹、多肉），显示每盆「还有几天该浇水 / 已经晚了几天」，该浇水的标黄。纯本地，不需要网络。用户说「我今天浇过水了」时，更新对应日期。',
      },
      {
        id: 'travel', category: 'life', title: '旅行倒计时', size: { w: 4, h: 5 }, schedule: daily('10:00'),
        blurb: '离出发还有几天，当地现在几点',
        prompt: '做一个旅行倒计时卡片：默认「东京 · 2027-04-01」（改成你的目的地和日期）。显示还有多少天、当地现在几点、当地时间与你的时差。纯本地计算，不需要网络。',
      },
      {
        id: 'nba', category: 'life', title: 'NBA 比分', size: { w: 5, h: 6 }, schedule: every(300_000),
        blurb: '今天的比赛、比分和状态',
        prompt: '做一个 NBA 比分卡片：用 ESPN 的公开接口 https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard 显示今天的比赛、比分和状态（未开始 / 进行中 / 已结束）。没有比赛时显示「今天没有比赛」。不需要 key。',
      },
      {
        id: 'moon', category: 'life', title: '月相', size: { w: 4, h: 5 }, schedule: daily('10:00'),
        blurb: '今晚月亮圆不圆',
        prompt: '做一个月相卡片：显示今天的月相（新月 / 上弦 / 满月 / 下弦及百分比）、月出月落时间，以及距离下一次满月还有几天。纯本地计算，不需要网络。',
      },

      // 数字资产
      {
        id: 'domain', category: 'assets', title: '域名 · 证书到期', size: { w: 5, h: 7 }, schedule: daily('10:00'),
        blurb: '注册到期、证书到期、DNS 指向',
        prompt: '做一个域名资产台账：默认 berryon.ai（改成你的域名，可以写多个）。用 RDAP（https://rdap.org/domain/域名）查注册到期日，用 openssl s_client 查 TLS 证书到期日，用 dig 查 A 记录。显示每个域名的注册到期、证书到期、DNS 指向；剩余少于 30 天标黄，少于 7 天标红。',
      },
      {
        id: 'dns', category: 'assets', title: 'DNS 变更监控', size: { w: 4, h: 6 }, schedule: every(3_600_000),
        blurb: '解析结果被改了会告诉你',
        prompt: '做一个 DNS 变更监控卡片：默认监控 berryon.ai 的 A 记录（改成你的域名）。第一次运行把当前解析结果存到 data/baseline.json，之后每次对比；如果解析结果变了，标红并显示新旧值。用 dig，不需要 key。',
      },
      {
        id: 'status', category: 'assets', title: '服务商状态', size: { w: 5, h: 6 }, schedule: every(300_000),
        blurb: 'GitHub、Cloudflare、OpenAI 挂了吗',
        prompt: '做一个服务商状态卡片：显示 GitHub、Cloudflare、OpenAI 的当前服务状态。用各家 statuspage 的公开 JSON，例如 https://www.githubstatus.com/api/v2/status.json、https://www.cloudflarestatus.com/api/v2/status.json、https://status.openai.com/api/v2/status.json。正常显示绿色「正常」，异常显示黄色或红色和说明。不需要 key。',
      },
      {
        id: 'secrets', category: 'assets', title: '敏感文件检查', size: { w: 5, h: 7 }, schedule: daily('10:00'),
        blurb: '有没有把 .env 提交进 git',
        prompt: '做一个敏感文件检查卡片：扫描 ~/Code 下的 git 仓库（改成你的路径），列出被 git 跟踪的 .env、id_rsa、*.pem、*.key 等敏感文件。用 git ls-files，纯本地。发现一个就标红，并显示仓库名和文件路径；全部干净时显示「没有发现」。不要读取文件内容，只看文件名。',
      },
      {
        id: 'reposize', category: 'assets', title: '仓库体积', size: { w: 5, h: 7 }, schedule: daily('10:00'),
        blurb: '哪个仓库悄悄占了一个 G',
        prompt: '做一个仓库体积卡片：扫描 ~/Code 下的 git 仓库（改成你的路径），显示每个仓库的 .git 体积和最大的 3 个目录，按体积倒序。用 du 和 git count-objects -vH，纯本地。总体积超过 1GB 的标黄。',
      },
    ];

    const DEFAULT_SCHEDULE = daily('10:00');
    const QUICK_SCHEDULES = [
      { key: '30s', label: '30 秒', schedule: every(30_000) },
      { key: '5m', label: '5 分钟', schedule: every(300_000) },
      { key: '1h', label: '1 小时', schedule: every(3_600_000) },
      { key: 'daily', label: '每天', schedule: daily('10:00') },
    ];
    const MORE_SCHEDULES = [
      { key: '1m', label: '1 分钟', schedule: every(60_000) },
      { key: '2m', label: '2 分钟', schedule: every(120_000) },
      { key: '10m', label: '10 分钟', schedule: every(600_000) },
      { key: '15m', label: '15 分钟', schedule: every(900_000) },
      { key: '30m', label: '30 分钟', schedule: every(1_800_000) },
      { key: '2h', label: '2 小时', schedule: every(7_200_000) },
      { key: '6h', label: '6 小时', schedule: every(21_600_000) },
      { key: '12h', label: '12 小时', schedule: every(43_200_000) },
      { key: '3d', label: '每 3 天', schedule: every(259_200_000) },
      { key: '7d', label: '每周', schedule: every(604_800_000) },
      { key: 'none', label: '不自动更新', schedule: { kind: 'none' } },
    ];
    const scheduleKey = function (schedule) {
      if (schedule.kind === 'none') return 'none';
      if (schedule.kind === 'daily') return 'daily';
      const found = QUICK_SCHEDULES.concat(MORE_SCHEDULES).find(function (item) {
        return item.schedule.kind === 'every' && item.schedule.ms === schedule.ms;
      });
      return found ? found.key : '';
    };
    const scheduleLabel = function (schedule) {
      if (schedule.kind === 'none') return '不自动更新';
      if (schedule.kind === 'daily') return '每天 ' + schedule.at + ' 更新一次';
      return '每 ' + fmtEvery(schedule.ms) + '更新一次';
    };
    const refreshHasSource = function (refresh) {
      return isObject(refresh) && Boolean(refresh.template || refresh.command || refresh.file || refresh.url);
    };
    const scheduleOfRefresh = function (refresh) {
      if (!isObject(refresh)) return { kind: 'none' };
      if (typeof refresh.dailyAt === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(refresh.dailyAt)) return daily(refresh.dailyAt);
      const ms = asNumber(refresh.everyMs);
      return ms !== null && ms >= 5000 ? every(ms) : { kind: 'none' };
    };
    // 只改频率，保留 template/command/file/url 这些取数来源。
    const refreshOfSchedule = function (refresh, schedule) {
      const next = Object.assign({}, isObject(refresh) ? refresh : {});
      delete next.everyMs;
      delete next.dailyAt;
      if (schedule.kind === 'every') next.everyMs = schedule.ms;
      if (schedule.kind === 'daily') next.dailyAt = schedule.at;
      return next;
    };

    function renderScheduleField(props) {
      const schedule = props.schedule;
      const options = props.allowNone === false
        ? MORE_SCHEDULES.filter(function (item) { return item.key !== 'none'; })
        : MORE_SCHEDULES;
      const key = scheduleKey(schedule);
      const moreKey = options.some(function (item) { return item.key === key; }) ? key : '';
      // 第一行只放同级的预设和「更多」，高度不随选项变化；
      // 时间下拉、当前频率说明统一放第二行。
      const detail = props.hint !== undefined
        ? props.hint
        : schedule.kind === 'daily'
          ? [
              h('span', { key: 'p' }, '每天 '),
              h('select', {
                key: 't',
                className: 'od-input od-time',
                value: schedule.at,
                'aria-label': '每天几点更新',
                disabled: props.busy === true,
                onChange: function (event) { props.onChange(daily(event.target.value || '10:00')); },
              }, Array.from({ length: 24 }, function (_, hour) {
                const value = String(hour).padStart(2, '0') + ':00';
                return h('option', { key: value, value: value }, value);
              })),
              h('span', { key: 's' }, ' 更新一次'),
            ]
          : scheduleLabel(schedule);
      return h('div', { className: 'od-schedule' },
        h('div', { className: 'od-schedule-row' },
          h('span', { className: 'od-field-label' }, props.label ?? '更新频率'),
          h('div', { className: 'od-chips' }, QUICK_SCHEDULES.map(function (item) {
            const on = item.schedule.kind === 'daily'
              ? schedule.kind === 'daily'
              : schedule.kind === 'every' && schedule.ms === item.schedule.ms;
            return h('button', {
              key: item.key, type: 'button', className: 'od-chip',
              'data-on': on ? 'true' : 'false',
              'aria-pressed': on ? 'true' : 'false',
              disabled: props.busy === true,
              onClick: function () { props.onChange(item.schedule.kind === 'daily' ? daily(schedule.kind === 'daily' ? schedule.at : '10:00') : item.schedule); },
            }, item.label);
          })),
          h('select', {
            className: 'od-input od-more', value: moreKey, 'aria-label': '更多更新频率',
            disabled: props.busy === true,
            onChange: function (event) {
              const item = options.find(function (entry) { return entry.key === event.target.value; });
              if (item) props.onChange(item.schedule);
            },
          },
            h('option', { value: '' }, '更多…'),
            options.map(function (item) { return h('option', { key: item.key, value: item.key }, item.label); })
          )
        ),
        h('div', { className: 'od-schedule-detail od-hint-sm' }, detail)
      );
    }

    const composePrompt = function (text, schedule) {
      const head = text.trim();
      if (schedule.kind === 'none') return head + '\n\n这张卡片是静态卡片：不需要自动更新，不要调用 card_set_refresh。';
      if (schedule.kind === 'daily') return head + '\n\n更新间隔：每天 ' + schedule.at + '。调用 card_set_refresh 时同时传 dailyAt="' + schedule.at + '" 和 everyMs=86400000，不要省略。';
      return head + '\n\n更新间隔：每 ' + fmtEvery(schedule.ms) + '。调用 card_set_refresh 时传 everyMs=' + schedule.ms + '，不要省略。';
    };

    function NewCardDialog(props) {
      const [text, setText] = useState('');
      const [categoryId, setCategoryId] = useState(SCENE_CATEGORIES[0].id);
      const [sceneId, setSceneId] = useState('');
      const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
      const scenes = SCENES.filter(function (scene) { return scene.category === categoryId; });
      const chooseScene = function (scene) {
        setSceneId(scene.id);
        setText(scene.prompt);
        setSchedule(scene.schedule);
      };
      const atLimit = props.buildingCount >= props.maxBuilding;
      return h(Modal, {
        title: '新建卡片',
        onClose: props.onClose,
        footer: [
          h('button', { key: 'c', type: 'button', className: 'od-btn od-btn-ghost', onClick: props.onClose }, '取消'),
          h('button', {
            key: 'ok', type: 'button', className: 'od-btn od-btn-primary',
            disabled: props.busy || text.trim() === '',
            onClick: function () {
              if (atLimit) { props.onLimit(); return; }
              const scene = SCENES.find(function (item) { return item.id === sceneId; });
              props.onCreate(composePrompt(text, schedule), scene ? scene.title : '', scene ? scene.size : undefined);
            },
          }, props.busy ? '创建中…' : '创建'),
        ],
      }, h('div', { className: 'od-newcard' },
        h('div', { className: 'od-hint', style: { fontSize: '12.5px' } },
          '挑一个场景点一下，会填到下面；想改就直接改。'),
        h('div', { className: 'od-chips', role: 'tablist', 'aria-label': '分类' }, SCENE_CATEGORIES.map(function (cat) {
          return h('button', {
            key: cat.id, type: 'button', role: 'tab', className: 'od-chip',
            'data-on': categoryId === cat.id ? 'true' : 'false',
            'aria-selected': categoryId === cat.id ? 'true' : 'false',
            title: cat.blurb,
            onClick: function () { setCategoryId(cat.id); },
          }, cat.title);
        })),
        h('div', { className: 'od-scenes' }, scenes.map(function (scene) {
          return h('button', {
            key: scene.id, type: 'button', className: 'od-scene',
            'data-on': sceneId === scene.id ? 'true' : 'false',
            'aria-pressed': sceneId === scene.id ? 'true' : 'false',
            onClick: function () { chooseScene(scene); },
          },
            h('span', { className: 'od-scene-title' }, scene.title),
            h('span', { className: 'od-scene-blurb' }, scene.blurb)
          );
        })),
        h('textarea', {
          className: 'od-input', rows: 4, value: text,
          placeholder: '也可以直接用自己的话描述，例如：看我的自选股，列表 + 近 7 日走势',
          onChange: function (event) { setText(event.target.value); },
        }),
        renderScheduleField({ schedule: schedule, busy: props.busy, onChange: setSchedule }),
        atLimit && h('div', { className: 'od-hint-sm od-limit' },
          '现在有 ' + props.buildingCount + ' 张在生成，等一张完成再继续。'),
        props.error !== '' && h('div', { className: 'od-error' }, h('span', { className: 'od-error-text' }, props.error))
      ));
    }

    function EditCardDialog(props) {
      const card = props.card;
      const [title, setTitle] = useState(card.title);
      const [size, setSize] = useState({ ...card.size });
      const hasSource = refreshHasSource(card.refresh);
      const [schedule, setSchedule] = useState(scheduleOfRefresh(card.refresh));
      return h(Modal, {
        title: '编辑「' + card.title + '」',
        onClose: props.onClose,
        footer: [
          h('button', { key: 'c', type: 'button', className: 'od-btn od-btn-ghost', onClick: props.onClose }, '取消'),
          h('button', {
            key: 'ok', type: 'button', className: 'od-btn od-btn-primary',
            disabled: props.busy,
            onClick: function () {
              const fields = { title: title.trim(), size: size };
              if (hasSource) fields.refresh = refreshOfSchedule(card.refresh, schedule);
              props.onSave(fields);
            },
          }, '保存'),
        ],
      }, h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
        h('label', { className: 'od-field' },
          h('span', { className: 'od-field-label' }, '标题'),
          h('input', { className: 'od-input', value: title, onChange: function (event) { setTitle(event.target.value); } })
        ),
        h(SizePicker, { size: size, busy: props.busy, onChange: function (next) { setSize(next); } }),
        renderScheduleField({
          schedule: schedule,
          busy: props.busy,
          allowNone: false,
          onChange: function (next) { setSchedule(next); },
          hint: hasSource ? undefined : '这张卡没有取数来源（静态卡），更新频率暂不生效。',
        }),
        h('span', { className: 'od-hint-sm' }, '卡片内容由 view/ 里的前端代码渲染；这里改标题、尺寸和更新频率。'),
        props.error !== '' && h('div', { className: 'od-error' }, h('span', { className: 'od-error-text' }, props.error))
      ));
    }

    function CardChatPanel(props) {
      const cardId = props.cardId;
      const [turns, setTurns] = useState([]);
      const [busy, setBusy] = useState(false);
      const [draft, setDraft] = useState('');
      const [error, setError] = useState('');
      const [live, setLive] = useState(null);
      const [conn, setConn] = useState('offline');
      const [refresh, setRefresh] = useState(0);
      const listRef = useRef(null);
      const stickRef = useRef(true);

      useEffect(function () {
        let alive = true;
        let timer = null;
        function load() {
          props.store.requestRaw('card-turns', { id: cardId }).then(function (body) {
            if (!alive) return;
            const value = isObject(body.value) ? body.value : {};
            setTurns(asArray(value.turns));
            setBusy(value.busy === true);
            if (value.busy !== true) setLive(null);
            setError('');
            timer = window.setTimeout(load, value.busy === true ? 1500 : 4000);
          }, function (failure) {
            if (!alive) return;
            const message = String(failure && failure.message ? failure.message : failure);
            setError(/会话服务|没有会话/.test(message) ? '这张卡暂时没有活着的会话。直接发一条消息会自动新建一个。' : '读取会话失败：' + message);
            timer = window.setTimeout(load, 4000);
          });
        }
        load();
        return function () { alive = false; if (timer !== null) window.clearTimeout(timer); };
      }, [cardId, refresh]);

      // 逐字流只补文本：历史与工具卡片仍走轮询，流断了也不影响可用性
      useEffect(function () {
        if (typeof EventSource === 'undefined') return undefined;
        let alive = true;
        let source = null;
        let retry = null;
        let disabled = false;
        let failures = 0;
        function connect() {
          if (!alive) return;
          try {
            source = new EventSource(CARD_STREAM_URL + '?id=' + encodeURIComponent(cardId));
          } catch (cause) {
            source = null;
            return;
          }
          source.addEventListener('ready', function () {
            if (!alive) return;
            failures = 0;
            setConn('sse');
          });
          source.addEventListener('live', function (event) {
            if (!alive) return;
            try {
              const data = JSON.parse(event.data);
              const text = asText(data && data.text);
              if (text === '') {
                setLive(null);
              } else {
                setLive({
                  turn: asNumber(data && data.turn) ?? 0,
                  step: asNumber(data && data.step) ?? 0,
                  text: text,
                });
              }
            } catch (cause) { /* 坏帧忽略 */ }
          });
          source.addEventListener('disabled', function () {
            if (!alive) return;
            disabled = true;
            setConn('polling');
            try { source.close(); } catch (cause) { /* 已关闭 */ }
            source = null;
          });
          source.addEventListener('error', function () {
            if (!alive || disabled) return;
            setConn('offline');
            try { source.close(); } catch (cause) { /* 已关闭 */ }
            source = null;
            failures += 1;
            // 路由不存在或连续失败时退回轮询，不做无意义的重连
            if (failures >= 2) {
              disabled = true;
              setConn('polling');
              return;
            }
            if (retry === null) retry = window.setTimeout(function () { retry = null; connect(); }, 5000);
          });
        }
        connect();
        return function () {
          alive = false;
          if (retry !== null) window.clearTimeout(retry);
          if (source !== null) { try { source.close(); } catch (cause) { /* 已关闭 */ } }
        };
      }, [cardId]);

      useEffect(function () {
        const element = listRef.current;
        if (element === null || !stickRef.current) return;
        element.scrollTop = element.scrollHeight;
      }, [turns.length, busy, live]);

      function onScroll() {
        const element = listRef.current;
        if (element === null) return;
        // 用户主动往上翻时不要把他拽回底部
        stickRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 48;
      }

      function send() {
        const text = draft.trim();
        if (text === '' || busy) return;
        setDraft('');
        setLive(null);
        setBusy(true);
        stickRef.current = true;
        props.store.requestRaw('card-prompt', { id: cardId, text: text }).then(function () {
          setRefresh(function (n) { return n + 1; });
        }, function (failure) {
          setBusy(false);
          setError(String(failure && failure.message ? failure.message : failure));
        });
      }

      function stop() {
        props.store.requestRaw('card-cancel', { id: cardId }).then(function () {
          setBusy(false);
          setLive(null);
        }, function (failure) {
          setError(String(failure && failure.message ? failure.message : failure));
        });
      }

      const suggestions = [
        { label: '改标题', fill: '标题改成 ' },
        { label: '改尺寸', fill: '尺寸改成 8×9' },
        { label: '重新取数', fill: '数据重新取一次' },
      ];

      return h('aside', { className: 'od-card-chat' },
        h('header', { className: 'od-chat-head' },
          h('span', { className: 'od-chat-title' }, '和「' + asText(props.title, '卡片') + '」对话'),
          h('span', {
            className: 'od-live', 'data-mode': conn === 'sse' ? 'sse' : 'polling',
            title: conn === 'sse' ? '逐字流已连接' : '逐字流未连接，仍在轮询',
          },
            h('span', { className: 'od-live-dot' }),
            conn === 'sse' ? '实时' : '轮询'
          ),
          h('span', { className: 'od-spacer' }),
          h('button', { type: 'button', className: 'od-icon-btn', 'aria-label': '关闭对话', onClick: props.onClose }, '×')
        ),
        error !== '' && h('div', { className: 'od-banner' }, h('div', { className: 'od-error' }, h('span', { className: 'od-error-text' }, error))),
        h('div', { className: 'od-chat-list', ref: listRef, onScroll: onScroll },
          turns.length === 0 && h('div', { className: 'od-chat-empty' },
            h('div', null, '这张卡自己的会话还空着。说一句话改它。'),
            h('div', { className: 'od-chips' }, suggestions.map(function (item) {
              return h('button', {
                key: item.label, type: 'button', className: 'od-chip',
                onClick: function () { setDraft(item.fill); },
              }, item.label);
            }))
          ),
          turns.map(function (turn, index) {
            const isLast = index === turns.length - 1;
            const stream = isLast && live !== null && asText(live.text) !== '' ? live : null;
            return h(TurnBlock, { key: 'turn' + turn.turn, turn: turn, mode: 'standard', stream: stream });
          }),
          busy && (live === null || asText(live.text) === '') && h('div', { className: 'od-hint' }, '卡片 Agent 正在处理…')
        ),
        h('div', { className: 'od-composer' },
          h('textarea', {
            className: 'od-input', rows: 2, value: draft, placeholder: '和这张卡说一句话…',
            onChange: function (event) { setDraft(event.target.value); },
            onKeyDown: function (event) { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } },
          }),
          h('div', { className: 'od-composer-row' },
            h('span', { className: 'od-hint' }, busy ? '正在改这张卡…' : '对话即修改；产出会写回卡片'),
            busy
              ? h('button', { type: 'button', className: 'od-btn od-btn-sm od-btn-danger', onClick: stop }, '停止')
              : h('button', {
                type: 'button', className: 'od-btn od-btn-sm od-btn-primary',
                disabled: draft.trim() === '', onClick: send,
              }, '发送')
          )
        )
      );
    }

    function useCardTheme() {
      const read = () => document.body?.dataset.dsDarkTheme !== undefined ? 'dark' : 'light';
      const [theme, setTheme] = useState(read);
      useEffect(function () {
        if (typeof MutationObserver === 'undefined' || !document.body) return;
        const observer = new MutationObserver(() => setTheme(read()));
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] });
        return () => observer.disconnect();
      }, []);
      return theme;
    }

    function CardPreview(props) {
      const ref = useRef(null);
      const theme = useCardTheme();
      const [, setTick] = useState(0);
      const [error, setError] = useState('');
      const design = props.store.getSnapshot().state?.design;
      useEffect(function () {
        const dialog = ref.current;
        dialog.showModal();
        const timer = window.setInterval(() => setTick(n => n + 1), 1000);
        return function () { window.clearInterval(timer); dialog.close(); };
      }, []);
      return h('dialog', {
        ref: ref, className: 'od-card-preview', 'aria-label': props.widget.title + ' · 卡片预览',
        onCancel: function (event) { event.preventDefault(); props.onClose(); },
        onClick: function (event) { if (event.target === event.currentTarget) props.onClose(); },
      }, h('div', { className: 'od-preview-inner' },
        h('div', { className: 'od-preview-head' },
          h('span', { className: 'od-card-title' }, props.widget.title),
          h('button', { type: 'button', className: 'od-btn od-btn-sm', autoFocus: true, onClick: props.onClose }, '关闭预览')
        ),
        error && h('div', { className: 'od-error', role: 'alert' }, error),
        h(CardBoundary, { key: props.widget.id, title: props.widget.title },
          h('div', { className: 'od-preview-content', style: { height: Math.max(160, props.widget.size.h * (GRID.rowHeight + GRID.gap) - 60) } },
            h(CardContent, {
              widget: props.widget, dp: props.dp, theme: theme, design: design, now: props.store.projectNow(),
              onRefresh: function (id) {
                setError('');
                props.store.request('card-refresh', { id: id }).catch(cause => setError(String(cause.message || cause)));
              },
              onFetch: (id, request) => props.store.request('renderer-fetch', { id: id, url: request.url }),
            })
          )
        )
      ));
    }

    function NativeCardActions(props) {
      const [snapshot, setSnapshot] = useState(props.store.getSnapshot());
      const [previewId, setPreviewId] = useState(null);
      useEffect(function () {
        setSnapshot(props.store.getSnapshot());
        return props.store.subscribe(setSnapshot);
      }, [props.store]);
      const widget = snapshot.state?.widgets.find(item => item.sessionId === props.sessionId);
      if (!widget) return null;
      return h('div', { className: 'od-root od-session-actions' },
        h(StyleTag, null),
        h('button', { type: 'button', className: 'od-btn od-btn-ghost od-btn-sm', 'aria-haspopup': 'dialog', onClick: () => setPreviewId(widget.id) }, '预览这张卡片'),
        h('button', { type: 'button', className: 'od-btn od-btn-ghost od-btn-sm', onClick: function () { setPreviewId(null); props.onReturn(widget.id); } }, '返回板面'),
        previewId === widget.id && h(CardPreview, { key: widget.id, widget: widget, dp: snapshot.state.data[widget.id], store: props.store, onClose: () => setPreviewId(null) })
      );
    }

    function Board(props) {
      const store = props.store;
      const [snapshot, setSnapshot] = useState(store.getSnapshot());
      const [tick, setTick] = useState(0);
      const [banner, setBanner] = useState('');
      const [notice, setNotice] = useState(null); // { message, until }
      const [overflowMap, setOverflowMap] = useState({});
      const [newDialog, setNewDialog] = useState(null);   // {open, busy, error}
      const [editDialog, setEditDialog] = useState(null); // {id, busy, error}
      const [removeDialog, setRemoveDialog] = useState(null);
      const [activeCardId, setActiveCardId] = useState(null);
      const theme = useCardTheme();
      const boardRef = useRef(null);

      useEffect(function () {
        setSnapshot(store.getSnapshot());
        return store.subscribe(setSnapshot);
      }, [store]);

      useEffect(function () {
        const timer = window.setInterval(function () { setTick(function (n) { return n + 1; }); }, 1000);
        return function () { window.clearInterval(timer); };
      }, []);

      useEffect(function () {
        if (!snapshot.focus || !snapshot.state) return;
        const frame = window.requestAnimationFrame(function () {
          const card = Array.from(boardRef.current?.querySelectorAll('[data-widget-id]') || []).find(element => element.dataset.widgetId === snapshot.focus.id);
          if (!card) return;
          const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
          card.scrollIntoView({ block: 'center', behavior: reduced ? 'instant' : 'smooth' });
          card.focus({ preventScroll: true });
          card.animate?.([
            { outline: '2px solid var(--od-blue)', outlineOffset: '3px' },
            { outline: '2px solid transparent', outlineOffset: '3px' },
          ], { duration: reduced ? 0 : 1800 });
          store.clearFocus();
          setActiveCardId(null);
        });
        return () => window.cancelAnimationFrame(frame);
      }, [snapshot.focus, snapshot.state?.widgets.length]);

      const state = snapshot.state;
      const now = store.projectNow();
      const widgets = state !== null ? state.widgets : [];
      const paused = state !== null && state.paused === true;
      const maxBuilding = state !== null ? state.maxBuilding : 8;
      const buildingCount = widgets.filter(function (widget) { return widget.building === true; }).length;

      function run(action, payload) {
        setBanner('');
        return store.request(action, payload).then(function (value) {
          return value;
        }, function (error) {
          setBanner(String(error && error.message ? error.message : error));
          throw error;
        });
      }

      function say(message) { setNotice({ message: message, until: Date.now() + 5000 }); }

      function createCard(text, title, size) {
        if (buildingCount >= maxBuilding) {
          say('同时最多生成 ' + maxBuilding + ' 张卡片，等一张完成再继续。');
          return;
        }
        setNewDialog({ open: true, busy: true, error: '' });
        const payload = { text: text };
        if (typeof title === 'string' && title !== '') payload.title = title;
        if (size !== undefined && size !== null) payload.size = size;
        run('card-create', payload).then(function () {
          setNewDialog(null);
        }, function (error) {
          setNewDialog({ open: true, busy: false, error: String(error && error.message ? error.message : error) });
        });
      }

      function saveCard(id, fields) {
        setEditDialog({ id: id, busy: true, error: '' });
        const payload = { id: id, title: fields.title, size: fields.size };
        if (fields.refresh !== undefined) payload.refresh = fields.refresh;
        run('card-update', payload).then(function () {
          setEditDialog(null);
        }, function (error) {
          setEditDialog({ id: id, busy: false, error: String(error && error.message ? error.message : error) });
        });
      }

      function removeCard(id) {
        setRemoveDialog({ id: id, busy: true });
        run('card-remove', { id: id }).then(function () { setRemoveDialog(null); }, function (error) {
          setRemoveDialog({ id: id, busy: false });
          setBanner(String(error && error.message ? error.message : error));
        });
      }

      function moveWidget(id, before) {
        const others = widgets.filter(function (widget) { return widget.id !== id; }).map(function (widget) { return widget.id; });
        const index = Math.max(0, Math.min(others.length, Math.round(before)));
        others.splice(index, 0, id);
        const pending = run('card-reorder', { ids: others });
        pending.catch(function () { /* banner 已提示 */ });
        return pending;
      }

      function resizeWidget(id, size) {
        run('card-update', { id: id, size: size }).catch(function () { /* banner 已提示 */ });
      }

      function growWidget(widget) {
        if (widget === null) return;
        const height = Math.min(SIZE_MAX, Math.max(widget.size.h, (widget.size.h || 4) + 2));
        resizeWidget(widget.id, { w: widget.size.w, h: height });
      }

      // 「修改」优先交给 DSH 原生工作区；拿不到就退回卡片内的轻量对话
      function modifyCard(widget) {
        if (widget === null || widget === undefined) return;
        const open = props.openSession;
        if (typeof open === 'function') {
          try {
            const result = open(widget.id);
            if (result !== null && result !== undefined && typeof result.then === 'function') {
              result.catch(function () { setActiveCardId(widget.id); });
            }
            return;
          } catch (error) {
            /* 原生工作区不可用，退回卡片对话 */
          }
        }
        setActiveCardId(widget.id);
      }

      // 只在"新的打开请求"（openAt 前进）时弹卡片对话
      const lastOpenAtRef = useRef(null);
      useEffect(function () {
        if (state === null) return;
        if (lastOpenAtRef.current === null) {
          lastOpenAtRef.current = state.openAt;
          return;
        }
        if (state.openAt > lastOpenAtRef.current) {
          lastOpenAtRef.current = state.openAt;
          const wanted = asText(state.chatOpenCardId);
          const widget = wanted === '' ? null : state.widgets.find(function (item) { return item.id === wanted; });
          if (widget !== null && widget !== undefined) modifyCard(widget);
        }
      }, [state === null ? 0 : state.openAt]);

      const activeCard = state !== null && activeCardId !== null ? state.widgets.find(function (widget) { return widget.id === activeCardId; }) : null;
      const editingCard = editDialog !== null ? widgets.find(function (widget) { return widget.id === editDialog.id; }) : null;

      return h('div', { className: 'od-root', ref: boardRef },
        h(StyleTag, null),
        h(TopBar, {
          name: '小组件',
          count: state !== null ? widgets.length : null,
          conn: snapshot.conn,
          busy: false,
          paused: paused,
          onAdd: function () { setNewDialog({ open: true, busy: false, error: '' }); },
          onRefresh: function () { run('card-refresh', {}).catch(function () { /* 已提示 */ }); },
          onTogglePause: function () { run('pause', { paused: !paused }).catch(function () { /* 已提示 */ }); },
        }),
        banner !== '' && h('div', { className: 'od-banner' },
          h('div', { className: 'od-error' },
            h('span', { className: 'od-error-text' }, banner),
            h('button', { type: 'button', className: 'od-error-x', onClick: function () { setBanner(''); } }, '✕')
          )
        ),
        paused && h('div', { className: 'od-banner' },
          h('div', { className: 'od-toast od-toast-warn' },
            h('span', { className: 'od-toast-text' }, '已暂停所有刷新'),
            h('button', { type: 'button', className: 'od-btn od-btn-sm', onClick: function () { run('pause', { paused: false }).catch(function () { /* 已提示 */ }); } }, '恢复')
          )
        ),
        notice !== null && Date.now() < notice.until && h('div', { className: 'od-banner' },
          h('div', { className: 'od-toast od-toast-warn' },
            h('span', { className: 'od-toast-text' }, notice.message),
            h('button', { type: 'button', className: 'od-error-x', onClick: function () { setNotice(null); } }, '✕')
          )
        ),
        h('div', { className: 'od-scroll' },
          widgets.length === 0
            ? h('div', { className: 'od-empty' },
              h('div', null, '还没有卡片。'),
              h('button', { type: 'button', className: 'od-btn od-btn-primary', onClick: function () { setNewDialog({ open: true, busy: false, error: '' }); } }, '＋ 用一句话新建'),
              h('div', { className: 'od-hint' }, '新建后 Agent 会在这张卡自己的会话里把它做出来。')
            )
            : h(WidgetGrid, {
              widgets: widgets,
              data: state.data,
              now: now,
              theme: theme,
              design: state.design,
              busy: false,
              overflowMap: overflowMap,
              onEdit: function (widget) { setEditDialog({ id: widget.id, busy: false, error: '' }); },
              onModify: function (widget) { modifyCard(widget); },
              onRefresh: function (id) { run('card-refresh', { id: id }).catch(function () { /* 已提示 */ }); },
              onRemove: function (widget) { setRemoveDialog({ id: widget.id, busy: false }); },
              onResize: resizeWidget,
              onGrow: growWidget,
              onOverflow: function (id, report) {
                setOverflowMap(function (previous) {
                  const current = previous[id];
                  if (report && report.scrollHeight > report.clientHeight) {
                    if (current && current.scrollHeight === report.scrollHeight && current.clientHeight === report.clientHeight) return previous;
                    const next = Object.assign({}, previous);
                    next[id] = { scrollHeight: report.scrollHeight, clientHeight: report.clientHeight };
                    return next;
                  }
                  if (current === undefined) return previous;
                  const next = Object.assign({}, previous);
                  delete next[id];
                  return next;
                });
              },
              onFetch: function (id, request) {
                return store.requestRaw('renderer-fetch', { id: id, url: request.url }).then(function (body) { return body.value; });
              },
              onMove: moveWidget,
              onSave: function (id, value, options) {
                run('card-data', {
                  id: id,
                  value: value,
                  refetch: !!(options && options.refresh === true),
                }).catch(function () { /* banner 已提示 */ });
              },
            })
        ),
        activeCard && h(CardChatPanel, {
          key: activeCard.id,
          store: store,
          cardId: activeCard.id,
          title: activeCard.title,
          onClose: function () {
            setActiveCardId(null);
            run('card-chat-close', {}).catch(function () { /* 已提示 */ });
          },
        }),
        newDialog !== null && newDialog.open && h(NewCardDialog, {
          busy: newDialog.busy,
          error: asText(newDialog.error),
          buildingCount: buildingCount,
          maxBuilding: maxBuilding,
          onLimit: function () { say('同时最多生成 ' + maxBuilding + ' 张卡片，等一张完成再继续。'); },
          onClose: function () { setNewDialog(null); },
          onCreate: createCard,
        }),
        editDialog !== null && editingCard !== null && h(EditCardDialog, {
          card: editingCard,
          busy: editDialog.busy,
          error: asText(editDialog.error),
          onClose: function () { setEditDialog(null); },
          onSave: function (fields) { saveCard(editingCard.id, fields); },
        }),
        removeDialog !== null && h(ConfirmModal, {
          title: '删除这张卡片？',
          message: '卡片会进入回收站（7 天），对应的会话也会被移除。',
          onClose: function () { setRemoveDialog(null); },
          onConfirm: function () { removeCard(removeDialog.id); },
        })
      );
    }

    // ---------------- 错误边界 ----------------
    class PanelBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) { return { error: error }; }
      componentDidCatch(error, info) { reportClientError('panel-crash', error, info); }
      render() {
        if (this.state.error !== null) {
          return h('div', { className: 'od-root' },
            h(StyleTag, null),
            h('div', { className: 'od-boundary' },
              h('div', { style: { fontWeight: 600 } }, '这块板面出了点问题'),
              h('div', { className: 'od-hint', style: { wordBreak: 'break-word' } }, String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)),
              h('button', { type: 'button', className: 'od-btn od-btn-primary od-btn-sm', onClick: function () { window.location.reload(); } }, '重新加载')
            )
          );
        }
        return this.props.children;
      }
    }

    function PanelIcon(props) {
      const size = props.size || 20;
      return h('svg', { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': true, style: { display: 'block' } },
        h('rect', { x: 2, y: 2, width: 9, height: 9, rx: 2.5, fill: 'currentColor', opacity: .9 }),
        h('rect', { x: 13, y: 2, width: 9, height: 5, rx: 2, fill: 'currentColor', opacity: .65 }),
        h('rect', { x: 13, y: 9, width: 9, height: 13, rx: 2.5, fill: 'currentColor', opacity: .9 }),
        h('rect', { x: 2, y: 13, width: 9, height: 9, rx: 2.5, fill: 'currentColor', opacity: .65 })
      );
    }

    // ---------------- 插件入口 ----------------
    export default {
      inject: ['slots', 'layout'],
      apply(ctx) {
        const store = createDeskStore(function openBoard() {
          try { ctx.layout.selectPanel('open-desktop'); } catch (error) { /* 面板未注册 */ }
        });

        // 卡片会话在 Client 侧也需要一个 generation，原生会话视图才拿得到 binding。
        // 只在点“修改”时 retain；同一时间最多保留一个，切卡或卸载时释放。
        let cardSessionRef = null;
        let navigation = 0;
        let disposed = false;
        const pendingReferences = new Set();
        function release(owned) {
          if (!owned || owned.released) return;
          owned.released = true;
          try { owned.reference.release(); } catch (error) { reportClientError('card-session-release', error, null); }
        }
        function cancelPendingNavigation() {
          navigation += 1;
          for (const owned of pendingReferences) release(owned);
          pendingReferences.clear();
        }
        async function openCardSession(cardId) {
          cancelPendingNavigation();
          const ticket = navigation;
          const navigationSignal = ctx.layout.beginNavigation?.();
          const onNavigationAbort = function () { if (ticket === navigation) cancelPendingNavigation(); };
          navigationSignal?.addEventListener('abort', onNavigationAbort, { once: true });
          let owned;
          try {
            const sessions = ctx.get?.('sessions');
            const workspace = ctx.get?.('uiWorkspace') ?? ctx.uiWorkspace;
            if (typeof sessions?.retain !== 'function') throw new Error('客户端会话服务不可用');
            if (typeof workspace?.openSession !== 'function') throw new Error('原生工作区不可用');
            const prepared = await store.request('card-session', { id: cardId });
            if (disposed || ticket !== navigation) return;
            const sessionId = prepared.sessionId;
            if (!sessionId) throw new Error('卡片会话准备失败');
            if (cardSessionRef?.sessionId === sessionId) {
              navigationSignal?.removeEventListener('abort', onNavigationAbort);
              await workspace.openSession(sessionId);
              return;
            }
            owned = { sessionId: sessionId, reference: sessions.retain(sessionId, { source: 'open-desktop-card' }), released: false };
            pendingReferences.add(owned);
            await owned.reference.ready;
            if (disposed || ticket !== navigation) return;
            // The committed open selects a native panel and aborts this signal itself.
            navigationSignal?.removeEventListener('abort', onNavigationAbort);
            await workspace.openSession(sessionId);
            if (disposed || ticket !== navigation) return;
            release(cardSessionRef);
            cardSessionRef = owned;
          } catch (error) {
            if (disposed || ticket !== navigation) return;
            reportClientError('card-open-session', error, null);
            throw error;
          } finally {
            navigationSignal?.removeEventListener('abort', onNavigationAbort);
            pendingReferences.delete(owned);
            if (owned !== cardSessionRef) release(owned);
          }
        }

        ctx.effect(function () {
          return function () {
            disposed = true;
            cancelPendingNavigation();
            release(cardSessionRef);
            cardSessionRef = null;
          };
        }, 'open-desktop: card session reference');

        ctx.effect(function () {
          store.start();
          return function () { store.stop(); };
        }, 'open-desktop: stream');

        ctx.effect(function () {
          function onError(event) {
            try { window.__odErrorWhere = (event && event.filename ? event.filename : '') + ':' + String((event && event.lineno) || 0); } catch (error) { /* 忽略 */ }
            reportClientError('window-error', event && event.error ? event.error : new Error(String(event && event.message)), null);
          }
          function onRejection(event) { reportClientError('unhandled-rejection', event && event.reason ? event.reason : new Error('unhandled rejection'), null); }
          window.addEventListener('error', onError);
          window.addEventListener('unhandledrejection', onRejection);
          return function () {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onRejection);
          };
        }, 'open-desktop: error reporting');

        ctx.slots.inject('sidebar.panellist', function () {
          return ctx.slots.register({
            name: 'sidebar.panellist', id: 'open-desktop', order: 20,
            label: function () { return '小组件'; },
          }, PanelIcon);
        });

        ctx.slots.inject('conversation.session.header.actions', function () {
          return ctx.slots.register({ name: 'conversation.session.header.actions', id: 'open-desktop-card', order: 20 }, function CardSessionHeader(props) {
            return h(NativeCardActions, {
              sessionId: props.sessionId, store: store,
              onReturn: function (cardId) {
                cancelPendingNavigation();
                store.focusCard(cardId);
                ctx.layout.selectPanel('open-desktop');
              },
            });
          });
        });

        ctx.slots.inject('main', function () {
          return ctx.slots.register({ name: 'main', key: 'open-desktop' }, function OpenDesktopPanel() {
            return h(PanelBoundary, null, h(Board, {
              store: store,
              openSession: openCardSession,
            }));
          });
        });
      },
    };
