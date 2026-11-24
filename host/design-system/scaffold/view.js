/* Default view: renders by data shape and keeps content inside the card.
 *
 * This is real frontend code, not a host fallback. Replace it as a whole or
 * edit the parts below. Helpers live on window.od (see README.md next to this file).
 */
(function () {
  var app = document.getElementById('app');
  var lastValue = null;

  function renderRow(item, index) {
    return od.row(item, { rank: index });
  }

  function appendNote(value) {
    var node = od.note(value);
    if (node !== null) app.appendChild(node);
  }

  function renderList(value) {
    var items = Array.isArray(value.items) ? value.items : [];
    var headline = value.headline || value.primary || null;
    if (headline !== null && (od.text(headline.label) !== '' || od.text(headline.value) !== '')) {
      var head = od.el('div', 'od-list-head');
      head.appendChild(od.el('span', 'od-metric-label', od.text(headline.label)));
      if (od.text(headline.value) !== '') head.appendChild(od.el('span', 'od-list-count', od.text(headline.value)));
      app.appendChild(head);
    }
    var rows = od.el('div', 'od-rows od-grow');
    app.appendChild(rows);
    od.fitRows(rows, items, renderRow);
    appendNote(value.note);
  }

  function renderMetric(value) {
    var headline = value.headline || value.primary || null;
    var rows = Array.isArray(value.rows) ? value.rows : [];
    if (headline !== null) app.appendChild(od.hero(headline));
    if (rows.length > 0) {
      var box = od.el('div', 'od-rows od-grow');
      app.appendChild(box);
      od.fitRows(box, rows, renderRow);
    }
    appendNote(value.note);
  }

  function renderTable(value) {
    var columns = Array.isArray(value.columns) ? value.columns : [];
    var rows = Array.isArray(value.rows) ? value.rows : [];
    var template = 'repeat(' + Math.max(1, columns.length) + ', minmax(0, 1fr))';
    var head = od.el('div', 'od-table-head');
    head.style.gridTemplateColumns = template;
    for (var i = 0; i < columns.length; i += 1) {
      var column = columns[i] || {};
      var th = od.el('div', 'od-th', od.text(column.label, od.text(column.key)));
      if (column.align) th.style.textAlign = column.align;
      head.appendChild(th);
    }
    app.appendChild(head);

    var body = od.el('div', 'od-rows od-grow');
    body.style.gap = '0';
    app.appendChild(body);
    od.fitRows(body, rows, function (row) {
      var line = od.el('div', 'od-table-row');
      line.style.gridTemplateColumns = template;
      for (var c = 0; c < columns.length; c += 1) {
        var col = columns[c] || {};
        var cellValue = row !== null && typeof row === 'object' ? row[col.key] : '';
        var content = cellValue === null || cellValue === undefined ? '' : String(cellValue);
        var cell = od.el('div', 'od-td' + (c === 0 ? ' od-td-key' : ''), content);
        if (col.align) cell.style.textAlign = col.align;
        if (/^[+-][\d.,]+%?$/.test(content.trim())) {
          cell.classList.add(content.trim().charAt(0) === '+' ? 'od-up' : 'od-down');
        }
        line.appendChild(cell);
      }
      return line;
    });
    appendNote(value.note);
  }

  function renderStatus(value) {
    var items = Array.isArray(value.items) ? value.items : [];
    var box = od.el('div', 'od-status-rows od-grow');
    app.appendChild(box);
    od.fitRows(box, items, od.statusRow);
    appendNote(value.note);
  }

  function renderGeneric(value) {
    var skip = { headline: true, primary: true, items: true, rows: true, columns: true, note: true };
    var entries = [];
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key) && skip[key] !== true) {
        entries.push({ label: key, value: od.short(value[key]) });
      }
    }
    if (entries.length === 0) {
      app.appendChild(od.empty('这张卡片还没有数据', '让 Agent 在卡片目录里加一个取数脚本'));
      return;
    }
    var box = od.el('div', 'od-rows od-grow');
    app.appendChild(box);
    od.fitRows(box, entries, renderRow);
    appendNote(value.note);
  }

  function render(value) {
    lastValue = value;
    if (app === null) return;
    od.clear(app);
    app.className = 'od-view';

    if (value === null || value === undefined) {
      app.appendChild(od.empty('还没有数据', '第一次取数完成后会显示在这里'));
      return;
    }
    if (typeof value === 'string') {
      app.appendChild(od.textBlock(value));
      return;
    }
    if (Array.isArray(value)) {
      var rows = od.el('div', 'od-rows od-grow');
      app.appendChild(rows);
      od.fitRows(rows, value, renderRow);
      return;
    }
    if (typeof value !== 'object') {
      app.appendChild(od.hero({ value: String(value) }));
      return;
    }
    if (od.text(value.text) !== '' && value.items === undefined && value.headline === undefined && value.rows === undefined) {
      app.appendChild(od.textBlock(value.text));
      return;
    }

    var items = Array.isArray(value.items) ? value.items : [];
    var rowsValue = Array.isArray(value.rows) ? value.rows : [];
    var columns = Array.isArray(value.columns) ? value.columns : [];
    if (columns.length > 0 && rowsValue.length > 0) {
      renderTable(value);
      return;
    }
    var hasState = false;
    for (var i = 0; i < items.length; i += 1) {
      if (items[i] && items[i].state !== undefined) { hasState = true; break; }
    }
    if (hasState) {
      renderStatus(value);
      return;
    }
    if (items.length > 0) {
      renderList(value);
      return;
    }
    if (value.headline !== undefined || value.primary !== undefined || rowsValue.length > 0) {
      renderMetric(value);
      return;
    }
    renderGeneric(value);
  }

  window.dshWidget.onData = render;
  if (window.dshWidget.data !== null && window.dshWidget.data !== undefined) render(window.dshWidget.data);

  // Re-fit when the user resizes the card; this is the card's own responsive behavior.
  if (typeof ResizeObserver !== 'undefined') {
    var pending = null;
    var observer = new ResizeObserver(function () {
      if (pending !== null) return;
      pending = requestAnimationFrame(function () {
        pending = null;
        if (lastValue !== null) render(lastValue);
      });
    });
    observer.observe(app);
  }
})();
