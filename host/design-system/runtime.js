/* Little Widgets design system runtime helpers (inside the card iframe).
 *
 * The host injects this script before the card's own view.js.
 * It only provides structure and layout shortcuts; content stays with the card.
 * Every visual value comes from --od-* tokens.
 */
(function () {
  var W = window;

  function el(tag, className, content) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined && content !== null) node.textContent = String(content);
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  function text(value, fallback) {
    if (value === null || value === undefined) return fallback === undefined ? '' : fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    try { return JSON.stringify(value); } catch (error) { return String(value); }
  }

  function num(value) {
    var n = Number(value);
    return isFinite(n) ? n : null;
  }

  function toneOf(tone) {
    if (tone === 'up' || tone === 'ok' || tone === 'good') return 'up';
    if (tone === 'down' || tone === 'bad' || tone === 'error') return 'down';
    if (tone === 'warn' || tone === 'warning') return 'warn';
    return 'flat';
  }

  function deltaPill(value, tone) {
    var node = el('span', 'od-delta-pill', text(value));
    node.setAttribute('data-tone', toneOf(tone));
    return node;
  }

  function pad2(value) {
    return String(value).length < 2 ? '0' + value : String(value);
  }

  function row(item, opts) {
    item = item || {};
    var label = text(item.label);
    var value = text(item.value);
    var delta = text(item.delta);
    var sub = text(item.sub);
    var href = typeof item.href === 'string' ? item.href : '';

    var main = el('div', 'od-row');
    if (opts && typeof opts.rank === 'number') main.appendChild(el('span', 'od-rank', pad2(opts.rank + 1)));
    main.appendChild(el('span', 'od-row-label', label));
    if (value !== '') main.appendChild(el('span', 'od-row-value', value));
    if (delta !== '') main.appendChild(deltaPill(delta, item.tone));

    var body = main;
    if (sub !== '') {
      body = el('div', 'od-row-wrap');
      body.appendChild(main);
      body.appendChild(el('div', 'od-row-sub', sub));
    }
    if (/^https?:\/\//i.test(href)) {
      var link = el('a', body.className);
      link.setAttribute('href', href);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer noopener');
      while (body.firstChild) link.appendChild(body.firstChild);
      return link;
    }
    return body;
  }

  function hero(item) {
    item = item || {};
    var wrap = el('div', 'od-hero');
    wrap.setAttribute('data-tone', toneOf(item.tone));
    if (text(item.label) !== '') wrap.appendChild(el('div', 'od-metric-label', text(item.label)));
    var line = el('div', 'od-hero-line');
    line.appendChild(el('div', 'od-metric-value', text(item.value, '—')));
    if (text(item.delta) !== '') line.appendChild(deltaPill(item.delta, item.tone));
    wrap.appendChild(line);
    return wrap;
  }

  function note(value) {
    var content = text(value);
    return content === '' ? null : el('div', 'od-note', content);
  }

  function empty(message, hint) {
    var node = el('div', 'od-empty');
    node.appendChild(el('div', null, text(message, '还没有数据')));
    if (text(hint) !== '') node.appendChild(el('div', 'od-label', text(hint)));
    return node;
  }

  function skeleton() {
    var node = el('div', 'od-stack');
    var first = el('div', 'od-skel');
    first.style.width = '45%';
    var second = el('div', 'od-skel');
    second.style.width = '70%';
    second.style.height = '26px';
    second.style.marginTop = '6px';
    var third = el('div', 'od-skel');
    third.style.width = '88%';
    third.style.marginTop = '8px';
    node.appendChild(first);
    node.appendChild(second);
    node.appendChild(third);
    return node;
  }

  function statusRow(item) {
    item = item || {};
    var state = toneOf(item.state || 'ok');
    var node = el('div', 'od-status-row');
    node.setAttribute('data-state', state);
    node.appendChild(el('span', 'od-status-dot'));
    node.appendChild(el('span', 'od-status-name', text(item.label, '—')));
    if (text(item.value) !== '') node.appendChild(el('span', 'od-status-value', text(item.value)));
    if (text(item.sub) !== '') node.appendChild(el('span', 'od-status-sub', text(item.sub)));
    return node;
  }

  function short(value) {
    if (value === null || value === undefined) return '—';
    if (Array.isArray(value)) return value.length + ' 项';
    if (typeof value === 'object') {
      var raw = '';
      try { raw = JSON.stringify(value); } catch (error) { raw = String(value); }
      return raw.length > 80 ? raw.slice(0, 77) + '…' : raw;
    }
    return String(value);
  }

  /**
   * Fit as many rows as possible into a fixed-height container.
   * When not everything fits, end with a single "还有 N 项" line.
   * container must be a flex column with a measurable height (usually od-grow).
   */
  function fitRows(container, items, renderRow, opts) {
    opts = opts || {};
    clear(container);
    container.classList.add('od-rows');
    var list = Array.isArray(items) ? items : [];
    if (list.length === 0) {
      container.appendChild(empty(opts.empty || '还没有数据'));
      return 0;
    }
    if (container.style.position === '' || container.style.position === 'static') {
      container.style.position = 'relative';
    }

    var probe = el('div', 'od-rows');
    probe.style.cssText = 'position:absolute;left:0;right:0;top:0;visibility:hidden;pointer-events:none;';
    probe.style.gap = getComputedStyle(container).rowGap || '';
    for (var i = 0; i < list.length; i += 1) probe.appendChild(renderRow(list[i], i));
    container.appendChild(probe);

    var heights = [];
    for (var h = 0; h < probe.children.length; h += 1) {
      heights.push(probe.children[h].getBoundingClientRect().height);
    }
    container.removeChild(probe);

    var style = getComputedStyle(container);
    var gap = parseFloat(style.rowGap || style.gap || '0');
    if (!isFinite(gap)) gap = 0;
    var available = container.clientHeight;
    if (!available || available < 40) available = 40;

    var moreHeight = 18;
    var count = 0;
    var used = 0;
    for (var k = 0; k < heights.length; k += 1) {
      var next = heights[k] + (k > 0 ? gap : 0);
      if (used + next > available) break;
      used += next;
      count += 1;
    }
    if (count < list.length) {
      while (count > 0 && used + gap + moreHeight > available) {
        count -= 1;
        used -= heights[count] + (count > 0 ? gap : 0);
      }
    }

    for (var j = 0; j < count; j += 1) container.appendChild(renderRow(list[j], j));
    if (count < list.length) {
      var more = el('button', 'od-more', '还有 ' + (list.length - count) + ' 项 · 放大');
      more.type = 'button';
      more.title = '这张卡片放不下全部内容，点击放大卡片';
      more.addEventListener('click', function () {
        try { parent.postMessage({ __od: true, type: 'grow' }, '*'); } catch (error) { /* ignore */ }
      });
      container.appendChild(more);
    }
    return count;
  }

  function textBlock(value) {
    var node = el('div', 'od-text', text(value));
    var measure = function () {
      var height = node.clientHeight;
      var lineHeight = parseFloat(getComputedStyle(node).lineHeight || '');
      if (!isFinite(lineHeight) || lineHeight <= 0) lineHeight = 18;
      var lines = Math.max(1, Math.floor(height / lineHeight));
      node.style.display = '-webkit-box';
      node.style.webkitBoxOrient = 'vertical';
      node.style.webkitLineClamp = String(lines);
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(measure);
    else setTimeout(measure, 0);
    return node;
  }

  function sparkline(values, opts) {
    opts = opts || {};
    var numbers = [];
    for (var i = 0; i < (values || []).length; i += 1) {
      var n = num(values[i]);
      if (n !== null) numbers.push(n);
    }
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 28');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'od-spark ' + (opts.tone ? 'od-' + toneOf(opts.tone) : ''));
    if (numbers.length < 2) return svg;
    var min = Math.min.apply(null, numbers);
    var max = Math.max.apply(null, numbers);
    var span = max - min || 1;
    var step = 100 / (numbers.length - 1);
    var points = [];
    for (var p = 0; p < numbers.length; p += 1) {
      var x = (p * step).toFixed(2);
      var y = (26 - ((numbers[p] - min) / span) * 22).toFixed(2);
      points.push(x + ',' + y);
    }
    var area = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    area.setAttribute('points', '0,28 ' + points.join(' ') + ' 100,28');
    area.setAttribute('class', 'od-spark-area');
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    line.setAttribute('points', points.join(' '));
    line.setAttribute('class', 'od-spark-line');
    svg.appendChild(area);
    svg.appendChild(line);
    return svg;
  }

  function formatNumber(value, digits) {
    var n = num(value);
    if (n === null) return '—';
    var d = typeof digits === 'number' ? digits : 2;
    try {
      return n.toLocaleString('zh-CN', { maximumFractionDigits: d, minimumFractionDigits: 0 });
    } catch (error) {
      return n.toFixed(d);
    }
  }

  function formatPercent(value, digits) {
    var n = num(value);
    if (n === null) return '—';
    var d = typeof digits === 'number' ? digits : 2;
    return (n > 0 ? '+' : '') + n.toFixed(d) + '%';
  }

  function open(url) {
    var target = String(url || '');
    if (!/^https?:\/\//i.test(target)) return;
    try { parent.postMessage({ __od: true, type: 'open', url: target }, '*'); } catch (error) { /* ignore */ }
  }

  W.od = {
    el: el,
    clear: clear,
    text: text,
    num: num,
    toneOf: toneOf,
    deltaPill: deltaPill,
    row: row,
    hero: hero,
    note: note,
    empty: empty,
    skeleton: skeleton,
    statusRow: statusRow,
    short: short,
    fitRows: fitRows,
    textBlock: textBlock,
    sparkline: sparkline,
    formatNumber: formatNumber,
    formatPercent: formatPercent,
    open: open,
  };
})();
