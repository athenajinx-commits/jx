/* Family Finance — vanilla JS, no dependencies.
 * Data model:
 *   categories: {id, name, kind: 'asset'|'income'|'expense', slot}
 *   records:    {id, date 'YYYY-MM-DD', catId, item, amount, note}
 * Asset records are balance snapshots (newest per item counts);
 * income/expense records are events summed by month.
 */
'use strict';

const LS_KEY = 'jx-finance-v1';
const THEME_KEY = 'jx-finance-theme';
const DEMO = location.hash === '#demo';

/* ---------- tiny DOM helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const SVGNS = 'http://www.w3.org/2000/svg';

function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) el.setAttribute(k, v);
  }
  for (const c of children) {
    if (c === null || c === undefined) continue;
    el.append(c.nodeType ? c : document.createTextNode(c));
  }
  return el;
}
function s(tag, attrs, ...children) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
  for (const c of children) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
function uid() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

/* ---------- state ---------- */
function defaultState() {
  const defs = [
    ['Income', 'income'], ['Deposit', 'asset'], ['Stock', 'asset'], ['Fund', 'asset'],
    ['Bond', 'asset'], ['Insurance', 'expense'], ['Tax', 'expense'], ['Other', 'expense'],
  ];
  return {
    version: 1,
    currency: '$',
    categories: defs.map(([name, kind], i) => ({ id: uid() + i, name, kind, slot: i + 1 })),
    records: [],
  };
}

function sanitizeState(raw) {
  if (!raw || raw.version !== 1 || !Array.isArray(raw.categories) || !Array.isArray(raw.records)) return null;
  const st = defaultState();
  st.currency = typeof raw.currency === 'string' && raw.currency ? raw.currency.slice(0, 4) : '$';
  st.categories = [];
  const used = new Set();
  for (const c of raw.categories) {
    if (!c || typeof c.name !== 'string') continue;
    const kind = ['asset', 'income', 'expense'].includes(c.kind) ? c.kind : 'expense';
    let slot = Number.isInteger(c.slot) && c.slot >= 0 && c.slot <= 8 ? c.slot : 0;
    if (slot > 0 && used.has(slot)) slot = 0;
    if (slot === 0) { for (let i = 1; i <= 8; i++) if (!used.has(i)) { slot = i; break; } }
    used.add(slot);
    st.categories.push({ id: String(c.id || uid()), name: c.name.slice(0, 40), kind, slot });
  }
  const catIds = new Set(st.categories.map((c) => c.id));
  st.records = [];
  for (const r of raw.records) {
    if (!r || !catIds.has(String(r.catId))) continue;
    const amount = Number(r.amount);
    if (!Number.isFinite(amount)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(r.date))) continue;
    st.records.push({
      id: String(r.id || uid()),
      date: String(r.date),
      catId: String(r.catId),
      item: String(r.item || '').slice(0, 60) || '(unnamed)',
      amount,
      note: String(r.note || '').slice(0, 120),
    });
  }
  return st;
}

function load() {
  try {
    const st = sanitizeState(JSON.parse(localStorage.getItem(LS_KEY)));
    if (st) return st;
  } catch (e) { /* fall through to fresh state */ }
  return defaultState();
}
function save() {
  if (DEMO) return;
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

let state = DEMO ? sampleState() : load();
let editingId = null;
let rangeMonths = 12;

const catById = (id) => state.categories.find((c) => c.id === id);
const slotColor = (slot) => (slot >= 1 && slot <= 8 ? `var(--s${slot})` : 'var(--sx)');

/* ---------- formatting ---------- */
function fmtFull(n) {
  const sign = n < 0 ? '−' : '';
  return sign + state.currency + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
}
function fmtCompact(n) {
  const sign = n < 0 ? '−' : '';
  const a = Math.abs(n);
  const t = (v) => (v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, ''));
  if (a >= 1e9) return sign + state.currency + t(a / 1e9) + 'B';
  if (a >= 1e6) return sign + state.currency + t(a / 1e6) + 'M';
  if (a >= 1e4) return sign + state.currency + t(a / 1e3) + 'K';
  return sign + state.currency + Math.round(a).toLocaleString('en-US');
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function monthLabel(mk) {
  const [y, m] = mk.split('-').map(Number);
  return MONTHS[m - 1] + ' ’' + String(y).slice(2);
}

/* ---------- month math ---------- */
const monthKey = (dateStr) => dateStr.slice(0, 7);
function curMonth() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function todayStr() {
  const d = new Date();
  return curMonth() + '-' + String(d.getDate()).padStart(2, '0');
}
function addMonths(mk, n) {
  const [y, m] = mk.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function monthSpan(fromMk, toMk) {
  const out = [];
  let m = fromMk;
  while (m <= toMk) { out.push(m); m = addMonths(m, 1); }
  return out;
}

/* ---------- derived data ---------- */
function assetBalancesAt(mk) { // mk = 'YYYY-MM' cutoff, or null for latest
  const map = new Map();
  for (const r of state.records) {
    const c = catById(r.catId);
    if (!c || c.kind !== 'asset') continue;
    if (mk && monthKey(r.date) > mk) continue;
    const key = r.catId + '||' + r.item.toLowerCase();
    const cur = map.get(key);
    if (!cur || r.date >= cur.date) map.set(key, { cat: c, item: r.item, amount: r.amount, date: r.date });
  }
  return [...map.values()];
}
const totalAssetsAt = (mk) => assetBalancesAt(mk).reduce((a, b) => a + b.amount, 0);

function allocationByCategory() {
  const sums = new Map();
  let asOf = '';
  for (const b of assetBalancesAt(null)) {
    sums.set(b.cat.id, (sums.get(b.cat.id) || 0) + b.amount);
    if (b.date > asOf) asOf = b.date;
  }
  const parts = state.categories
    .filter((c) => c.kind === 'asset' && sums.get(c.id) > 0)
    .map((c) => ({ cat: c, value: sums.get(c.id) }));
  return { parts, total: parts.reduce((a, p) => a + p.value, 0), asOf };
}

function flowByMonth(months) {
  const rows = months.map((mk) => ({ mk, income: 0, expense: 0 }));
  const idx = new Map(rows.map((r, i) => [r.mk, i]));
  for (const r of state.records) {
    const c = catById(r.catId);
    if (!c || c.kind === 'asset') continue;
    const i = idx.get(monthKey(r.date));
    if (i === undefined) continue;
    rows[i][c.kind === 'income' ? 'income' : 'expense'] += r.amount;
  }
  return rows;
}

function dashboardMonths() {
  if (!state.records.length) return [];
  const first = state.records.reduce((a, r) => (monthKey(r.date) < a ? monthKey(r.date) : a), curMonth());
  const to = curMonth();
  let from = rangeMonths > 0 ? addMonths(to, -(rangeMonths - 1)) : first;
  if (from < first) from = first;
  return monthSpan(from, to);
}

/* ---------- tooltip ---------- */
const tip = $('#tooltip');
function tipRow(color, value, name) {
  const row = h('div', { class: 'tt-row' });
  if (color) row.append(h('span', { class: 'tt-key', style: `background:${color}` }));
  row.append(h('span', { class: 'tt-val' }, value), h('span', { class: 'tt-name' }, name || ''));
  return row;
}
function showTip(ev, nodes) {
  tip.replaceChildren(...nodes);
  tip.style.display = 'block';
  const pad = 14;
  let x = ev.clientX + pad, y = ev.clientY + pad;
  const r = tip.getBoundingClientRect();
  if (x + r.width > innerWidth - 8) x = ev.clientX - r.width - pad;
  if (y + r.height > innerHeight - 8) y = ev.clientY - r.height - pad;
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}
function hideTip() { tip.style.display = 'none'; }

/* ---------- axis helpers ---------- */
function niceTicks(max) {
  if (!(max > 0)) return [0, 1];
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const ticks = [];
  for (let v = 0; v <= max + step * 0.999; v += step) ticks.push(v);
  return ticks;
}
function roundTopRect(x, y, w, h2, r) {
  r = Math.min(r, w / 2, h2);
  return `M${x},${y + h2} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h2} Z`;
}
function roundRightRect(x, y, w, h2, r) {
  r = Math.min(r, h2 / 2, w);
  return `M${x},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h2 - r} Q${x + w},${y + h2} ${x + w - r},${y + h2} H${x} Z`;
}
// map a pointer event to viewBox x-coordinate of an svg scaled to width:100%
function svgX(svg, vbW, ev) {
  const r = svg.getBoundingClientRect();
  return ((ev.clientX - r.left) / r.width) * vbW;
}

/* ---------- dashboard: KPIs ---------- */
function renderKpis() {
  const box = $('#kpis');
  box.replaceChildren();
  const now = curMonth();
  const netNow = totalAssetsAt(null);
  const netPrev = totalAssetsAt(addMonths(now, -1));
  const year = now.slice(0, 4);
  let inc = 0, exp = 0;
  for (const r of state.records) {
    const c = catById(r.catId);
    if (!c || !r.date.startsWith(year)) continue;
    if (c.kind === 'income') inc += r.amount;
    else if (c.kind === 'expense') exp += r.amount;
  }
  const net = inc - exp;
  const rate = inc > 0 ? Math.round((net / inc) * 100) : null;

  const tile = (label, value, delta, deltaClass) => {
    const t = h('div', { class: 'tile' },
      h('div', { class: 'label' }, label),
      h('div', { class: 'value' }, value));
    if (delta) t.append(h('div', { class: 'delta ' + (deltaClass || '') }, delta));
    box.append(t);
  };
  const d = netNow - netPrev;
  tile('Net assets', fmtCompact(netNow),
    netPrev ? `${d >= 0 ? '▲' : '▼'} ${fmtCompact(Math.abs(d))} vs last month` : 'first month tracked',
    netPrev ? (d >= 0 ? 'up' : 'down') : '');
  tile(`Income · ${year}`, fmtCompact(inc));
  tile(`Expenses · ${year}`, fmtCompact(exp));
  tile(`Net saved · ${year}`, fmtCompact(net),
    rate !== null ? `${rate}% of income kept` : 'no income recorded yet',
    rate !== null && net >= 0 ? 'up' : rate !== null ? 'down' : '');
}

/* ---------- dashboard: allocation stacked bar ---------- */
function renderAllocation() {
  const box = $('#alloc-chart'), legend = $('#alloc-legend');
  box.replaceChildren(); legend.replaceChildren();
  const { parts, total, asOf } = allocationByCategory();
  $('#alloc-asof').textContent = asOf ? 'as of ' + asOf : '';
  if (!parts.length) {
    box.append(h('p', { class: 'hint' }, 'No asset balances yet — add one under Records (e.g. a Deposit or Stock balance).'));
    return;
  }
  const W = 720, BH = 24, H = 40, GAP = 2;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Asset allocation stacked bar' });
  const usable = W - GAP * (parts.length - 1);
  let x = 0;
  const segs = [];
  parts.forEach((p, i) => {
    const w = Math.max((p.value / total) * usable, 1.5);
    const color = slotColor(p.cat.slot);
    const shape = i === parts.length - 1
      ? s('path', { d: roundRightRect(x, 8, w, BH, 4), fill: color })
      : s('rect', { x, y: 8, width: w, height: BH, fill: color });
    svg.append(shape);
    segs.push({ x0: x, x1: x + w, part: p, node: shape });
    x += w + GAP;
  });
  const findSeg = (vx) => segs.find((g) => vx >= g.x0 - GAP && vx <= g.x1 + GAP);
  svg.addEventListener('pointermove', (ev) => {
    const g = findSeg(svgX(svg, W, ev));
    segs.forEach((o) => o.node.classList.toggle('lifted', o === g));
    if (!g) return hideTip();
    const pct = ((g.part.value / total) * 100).toFixed(1) + '%';
    showTip(ev, [
      h('div', { class: 'tt-title' }, g.part.cat.name),
      tipRow(slotColor(g.part.cat.slot), fmtFull(g.part.value), pct + ' of assets'),
    ]);
  });
  svg.addEventListener('pointerleave', () => { hideTip(); segs.forEach((o) => o.node.classList.remove('lifted')); });
  box.append(svg);

  for (const p of parts) {
    legend.append(h('span', { class: 'li' },
      h('span', { class: 'sw', style: `background:${slotColor(p.cat.slot)}` }),
      p.cat.name + ' ',
      h('span', { class: 'lv' }, fmtCompact(p.value)),
      h('span', { class: 'lp' }, ((p.value / total) * 100).toFixed(1) + '%')));
  }
}

/* ---------- dashboard: assets trend line ---------- */
function renderTrend(months) {
  const box = $('#trend-chart'), tbl = $('#trend-table');
  box.replaceChildren(); tbl.replaceChildren();
  const pts = months.map((mk) => ({ mk, v: totalAssetsAt(mk) }));
  if (!pts.length) { box.append(h('p', { class: 'hint' }, 'Nothing to plot yet.')); return; }

  const W = 720, H = 260, M = { t: 18, r: 64, b: 30, l: 52 };
  const pw = W - M.l - M.r, ph = H - M.t - M.b;
  const ticks = niceTicks(Math.max(...pts.map((p) => p.v)) * 1.05 || 1);
  const ymax = ticks[ticks.length - 1];
  const xAt = (i) => M.l + (pts.length === 1 ? pw / 2 : (i / (pts.length - 1)) * pw);
  const yAt = (v) => M.t + ph - (v / ymax) * ph;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Total assets by month' });

  for (const t of ticks) {
    svg.append(s('line', { class: 'gridline', x1: M.l, x2: W - M.r, y1: yAt(t), y2: yAt(t) }));
    svg.append(s('text', { class: 'ticktext', x: M.l - 8, y: yAt(t) + 4, 'text-anchor': 'end' }, fmtCompact(t)));
  }
  svg.append(s('line', { class: 'axisline', x1: M.l, x2: W - M.r, y1: yAt(0), y2: yAt(0) }));
  const every = Math.ceil(pts.length / 8);
  pts.forEach((p, i) => {
    if (i % every === 0 || i === pts.length - 1) {
      svg.append(s('text', { class: 'ticktext', x: xAt(i), y: H - 8, 'text-anchor': 'middle' }, monthLabel(p.mk)));
    }
  });

  const line = pts.map((p, i) => `${xAt(i)},${yAt(p.v)}`).join(' ');
  if (pts.length > 1) {
    svg.append(s('polygon', {
      points: `${M.l},${yAt(0)} ${line} ${xAt(pts.length - 1)},${yAt(0)}`,
      fill: 'var(--s1)', opacity: '0.1',
    }));
    svg.append(s('polyline', {
      points: line, fill: 'none', stroke: 'var(--s1)',
      'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
    }));
  }
  const li = pts.length - 1;
  svg.append(s('circle', { cx: xAt(li), cy: yAt(pts[li].v), r: 4.5, fill: 'var(--s1)', stroke: 'var(--surface)', 'stroke-width': 2 }));
  svg.append(s('text', { class: 'dirlabel', x: xAt(li) + 9, y: yAt(pts[li].v) + 4 }, fmtCompact(pts[li].v)));

  // crosshair + hover marker
  const cross = s('line', { class: 'crosshair', y1: M.t, y2: M.t + ph, visibility: 'hidden' });
  const dot = s('circle', { r: 4.5, fill: 'var(--s1)', stroke: 'var(--surface)', 'stroke-width': 2, visibility: 'hidden' });
  svg.append(cross, dot);
  svg.addEventListener('pointermove', (ev) => {
    const vx = svgX(svg, W, ev);
    if (vx < M.l - 10 || vx > W - M.r + 10) { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); return hideTip(); }
    const i = Math.max(0, Math.min(pts.length - 1,
      Math.round(pts.length === 1 ? 0 : ((vx - M.l) / pw) * (pts.length - 1))));
    cross.setAttribute('x1', xAt(i)); cross.setAttribute('x2', xAt(i));
    cross.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', xAt(i)); dot.setAttribute('cy', yAt(pts[i].v));
    dot.setAttribute('visibility', 'visible');
    showTip(ev, [h('div', { class: 'tt-title' }, monthLabel(pts[i].mk)), tipRow('var(--s1)', fmtFull(pts[i].v), 'total assets')]);
  });
  svg.addEventListener('pointerleave', () => {
    cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); hideTip();
  });
  box.append(svg);

  const table = h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, 'Month'), h('th', { class: 'num' }, 'Total assets'))),
    h('tbody', {}, ...pts.map((p) => h('tr', {}, h('td', {}, monthLabel(p.mk)), h('td', { class: 'num' }, fmtFull(p.v))))));
  tbl.append(table);
}

/* ---------- dashboard: cash-flow columns ---------- */
function renderFlow(months) {
  const box = $('#flow-chart'), legend = $('#flow-legend'), tbl = $('#flow-table');
  box.replaceChildren(); legend.replaceChildren(); tbl.replaceChildren();
  const rows = flowByMonth(months);
  if (!rows.length) { box.append(h('p', { class: 'hint' }, 'Nothing to plot yet.')); return; }

  const W = 720, H = 260, M = { t: 18, r: 12, b: 30, l: 52 };
  const pw = W - M.l - M.r, ph = H - M.t - M.b;
  const maxV = Math.max(1, ...rows.map((r) => Math.max(r.income, r.expense)));
  const ticks = niceTicks(maxV * 1.05);
  const ymax = ticks[ticks.length - 1];
  const yAt = (v) => M.t + ph - (v / ymax) * ph;
  const band = pw / rows.length;
  const bw = Math.min(24, Math.max(4, (band - 10) / 2));
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Monthly income and expenses' });

  for (const t of ticks) {
    svg.append(s('line', { class: 'gridline', x1: M.l, x2: W - M.r, y1: yAt(t), y2: yAt(t) }));
    svg.append(s('text', { class: 'ticktext', x: M.l - 8, y: yAt(t) + 4, 'text-anchor': 'end' }, fmtCompact(t)));
  }
  const every = Math.ceil(rows.length / 8);
  const groups = rows.map((r, i) => {
    const cx = M.l + band * i + band / 2;
    if (i % every === 0 || i === rows.length - 1) {
      svg.append(s('text', { class: 'ticktext', x: cx, y: H - 8, 'text-anchor': 'middle' }, monthLabel(r.mk)));
    }
    const g = s('g');
    const mk = (v, color, off) => {
      if (!(v > 0)) return null;
      const hgt = Math.max((v / ymax) * ph, 1.5);
      const p = s('path', { d: roundTopRect(cx + off, yAt(0) - hgt, bw, hgt, 4), fill: color });
      g.append(p);
      return p;
    };
    mk(r.income, 'var(--s1)', -bw - 1);
    mk(r.expense, 'var(--s6)', 1);
    svg.append(g);
    return { row: r, node: g, x0: M.l + band * i, x1: M.l + band * (i + 1) };
  });
  svg.append(s('line', { class: 'axisline', x1: M.l, x2: W - M.r, y1: yAt(0), y2: yAt(0) }));

  svg.addEventListener('pointermove', (ev) => {
    const vx = svgX(svg, W, ev);
    const g = groups.find((o) => vx >= o.x0 && vx < o.x1);
    groups.forEach((o) => o.node.classList.toggle('lifted', o === g));
    if (!g) return hideTip();
    showTip(ev, [
      h('div', { class: 'tt-title' }, monthLabel(g.row.mk)),
      tipRow('var(--s1)', fmtFull(g.row.income), 'income'),
      tipRow('var(--s6)', fmtFull(g.row.expense), 'expenses'),
      tipRow(null, fmtFull(g.row.income - g.row.expense), 'net'),
    ]);
  });
  svg.addEventListener('pointerleave', () => { hideTip(); groups.forEach((o) => o.node.classList.remove('lifted')); });
  box.append(svg);

  legend.append(
    h('span', { class: 'li' }, h('span', { class: 'sw', style: 'background:var(--s1)' }), 'Income'),
    h('span', { class: 'li' }, h('span', { class: 'sw', style: 'background:var(--s6)' }), 'Expenses'));

  const table = h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, 'Month'), h('th', { class: 'num' }, 'Income'),
      h('th', { class: 'num' }, 'Expenses'), h('th', { class: 'num' }, 'Net'))),
    h('tbody', {}, ...rows.map((r) => h('tr', {},
      h('td', {}, monthLabel(r.mk)), h('td', { class: 'num' }, fmtFull(r.income)),
      h('td', { class: 'num' }, fmtFull(r.expense)), h('td', { class: 'num' }, fmtFull(r.income - r.expense))))));
  tbl.append(table);
}

function renderDashboard() {
  const empty = $('#dash-empty'), body = $('#dash-body');
  if (!state.records.length) {
    body.hidden = true;
    empty.hidden = false;
    empty.replaceChildren(h('div', { class: 'card empty' },
      h('div', { class: 'big' }, '🌱'),
      h('p', {}, 'Nothing tracked yet. Add your first record — a salary payment, a savings balance, an investment — or explore with sample data first.'),
      h('button', { class: 'btn primary', onclick: () => { state = sampleState(); save(); renderAll(); } }, 'Load sample data'),
      ' ',
      h('button', { class: 'btn', onclick: () => switchTab('records') }, 'Add a record')));
    return;
  }
  body.hidden = false;
  empty.hidden = true;
  const months = dashboardMonths();
  renderKpis();
  renderAllocation();
  renderTrend(months);
  renderFlow(months);
}

/* ---------- records ---------- */
function kindTag(kind) {
  return kind === 'asset' ? 'balance' : kind;
}
function refreshCatSelect() {
  const sel = $('#rec-cat');
  const cur = sel.value;
  sel.replaceChildren();
  for (const [kind, label] of [['asset', 'Assets (balances)'], ['income', 'Income'], ['expense', 'Expenses']]) {
    const cats = state.categories.filter((c) => c.kind === kind);
    if (!cats.length) continue;
    const og = h('optgroup', { label });
    for (const c of cats) og.append(h('option', { value: c.id }, c.name));
    sel.append(og);
  }
  if (cur && catById(cur)) sel.value = cur;
  onCatChange();
}
function onCatChange() {
  const c = catById($('#rec-cat').value);
  $('#rec-amount-label').textContent = c && c.kind === 'asset' ? 'Current balance' : 'Amount';
  $('#rec-item').placeholder = c && c.kind === 'asset' ? 'e.g. Brokerage — VTI' : 'e.g. Salary — Alex';
  const dl = $('#item-suggest');
  dl.replaceChildren();
  if (!c) return;
  const seen = new Set();
  for (const r of state.records) {
    if (r.catId !== c.id || seen.has(r.item)) continue;
    seen.add(r.item);
    dl.append(h('option', { value: r.item }));
  }
}
function resetForm() {
  editingId = null;
  $('#rec-form').reset();
  $('#rec-date').value = todayStr();
  $('#rec-form-title').textContent = 'Add a record';
  $('#rec-submit').textContent = 'Add';
  $('#rec-cancel').hidden = true;
  onCatChange();
}
function startEdit(rec) {
  editingId = rec.id;
  $('#rec-date').value = rec.date;
  $('#rec-cat').value = rec.catId;
  onCatChange();
  $('#rec-item').value = rec.item;
  $('#rec-amount').value = rec.amount;
  $('#rec-note').value = rec.note;
  $('#rec-form-title').textContent = 'Edit record';
  $('#rec-submit').textContent = 'Save changes';
  $('#rec-cancel').hidden = false;
  switchTab('records');
  $('#rec-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderRecords() {
  const boxEl = $('#rec-table');
  boxEl.replaceChildren();
  const q = $('#rec-search').value.trim().toLowerCase();
  const recs = state.records
    .filter((r) => {
      if (!q) return true;
      const c = catById(r.catId);
      return r.item.toLowerCase().includes(q) || r.note.toLowerCase().includes(q) ||
        (c && c.name.toLowerCase().includes(q));
    })
    .sort((a, b) => (a.date === b.date ? (a.id < b.id ? 1 : -1) : (a.date < b.date ? 1 : -1)));

  if (!recs.length) {
    boxEl.append(h('p', { class: 'hint' }, state.records.length ? 'No records match the filter.' : 'No records yet — add one above.'));
    return;
  }
  const tbody = h('tbody');
  for (const r of recs) {
    const c = catById(r.catId);
    tbody.append(h('tr', { class: 'rec' },
      h('td', {}, r.date),
      h('td', {}, h('span', { class: 'catdot', style: `background:${slotColor(c ? c.slot : 0)}` }), c ? c.name : '?',
        ' ', h('span', { class: 'hint' }, kindTag(c ? c.kind : ''))),
      h('td', {}, r.item),
      h('td', { class: 'num' }, fmtFull(r.amount)),
      h('td', { class: 'note', title: r.note }, r.note),
      h('td', {},
        h('button', { class: 'btn small', onclick: () => startEdit(r) }, 'Edit'),
        ' ',
        h('button', {
          class: 'btn small danger', onclick: () => {
            if (!confirm(`Delete this record?\n${r.date} · ${r.item} · ${fmtFull(r.amount)}`)) return;
            state.records = state.records.filter((x) => x.id !== r.id);
            save(); renderAll();
          },
        }, 'Delete'))));
  }
  boxEl.append(h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, 'Date'), h('th', {}, 'Category'), h('th', {}, 'Item'),
      h('th', { class: 'num' }, 'Amount'), h('th', {}, 'Note'), h('th', {}, ''))),
    tbody));
}

/* ---------- categories ---------- */
function renderCategories() {
  const boxEl = $('#cat-table');
  boxEl.replaceChildren();
  const counts = new Map();
  for (const r of state.records) counts.set(r.catId, (counts.get(r.catId) || 0) + 1);

  const tbody = h('tbody');
  for (const c of state.categories) {
    const n = counts.get(c.id) || 0;
    const nameIn = h('input', { type: 'text', value: c.name, maxlength: 40, style: 'min-width:140px' });
    nameIn.addEventListener('change', () => {
      const v = nameIn.value.trim();
      if (!v) { nameIn.value = c.name; return; }
      c.name = v; save(); renderAll();
    });
    const kindSel = h('select', {},
      h('option', { value: 'asset' }, 'Asset'),
      h('option', { value: 'income' }, 'Income'),
      h('option', { value: 'expense' }, 'Expense'));
    kindSel.value = c.kind;
    kindSel.addEventListener('change', () => { c.kind = kindSel.value; save(); renderAll(); });
    const delBtn = h('button', {
      class: 'btn small danger',
      onclick: () => {
        if (counts.get(c.id)) return;
        if (!confirm(`Delete category “${c.name}”?`)) return;
        state.categories = state.categories.filter((x) => x.id !== c.id);
        save(); renderAll();
      },
    }, 'Delete');
    if (n > 0) { delBtn.disabled = true; delBtn.title = 'Has records — delete or reassign them first'; }
    tbody.append(h('tr', {},
      h('td', {}, h('span', { class: 'catdot', style: `background:${slotColor(c.slot)}` })),
      h('td', {}, nameIn),
      h('td', {}, kindSel),
      h('td', { class: 'num' }, String(n)),
      h('td', {}, delBtn)));
  }
  boxEl.append(h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, ''), h('th', {}, 'Name'), h('th', {}, 'Type'),
      h('th', { class: 'num' }, 'Records'), h('th', {}, ''))),
    tbody));
}

/* ---------- crypto export / import ---------- */
const te = new TextEncoder(), td = new TextDecoder();
function b64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}
function unb64(str) {
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function deriveKey(pass, salt) {
  const km = await crypto.subtle.importKey('raw', te.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function encryptSnapshot(pass) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pass, salt);
  const payload = { ...state, exportedAt: new Date().toISOString() };
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, te.encode(JSON.stringify(payload)));
  return `JXFIN1.${b64(salt)}.${b64(iv)}.${b64(ct)}`;
}
async function decryptSnapshot(text, pass) {
  const parts = text.trim().split('.');
  if (parts.length !== 4 || parts[0] !== 'JXFIN1') throw new Error('Not a Family Finance snapshot file.');
  const key = await deriveKey(pass, unb64(parts[1]));
  let plain;
  try {
    plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(parts[2]) }, key, unb64(parts[3]));
  } catch (e) {
    throw new Error('Decryption failed — wrong passphrase or corrupted file.');
  }
  const st = sanitizeState(JSON.parse(td.decode(plain)));
  if (!st) throw new Error('Snapshot decrypted but its contents are not valid.');
  return st;
}
function setMsg(sel, text, ok) {
  const el = $(sel);
  el.textContent = text;
  el.className = 'msg ' + (text ? (ok ? 'ok' : 'err') : '');
}

/* ---------- tabs / theme / demo ---------- */
function switchTab(name) {
  document.querySelectorAll('nav.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('main section.tab').forEach((sec) => sec.classList.toggle('active', sec.id === 'tab-' + name));
  hideTip();
}
function applyTheme(mode) {
  if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', mode);
  $('#theme-btn').textContent = 'Theme: ' + mode;
}

function renderAll() {
  refreshCatSelect();
  renderDashboard();
  renderRecords();
  renderCategories();
  $('#set-currency').value = state.currency;
}

/* ---------- sample data ---------- */
function sampleState() {
  const st = defaultState();
  const cat = (name) => st.categories.find((c) => c.name === name).id;
  let seed = 42;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const recs = [];
  const add = (date, catName, item, amount, note = '') =>
    recs.push({ id: uid() + recs.length, date, catId: cat(catName), item, amount: Math.round(amount * 100) / 100, note });

  const months = monthSpan('2025-05', curMonth());
  let vti = 38000, target = 21000, savings = 24000, ibond = 10000, rsu = 12000;
  months.forEach((mk, i) => {
    const last = mk === curMonth();
    const day = (d) => {
      const ds = mk + '-' + String(d).padStart(2, '0');
      return ds > todayStr() ? todayStr() : ds;
    };
    add(day(25), 'Income', 'Salary — Alex', 6500);
    add(day(25), 'Income', 'Salary — Jamie', 5200);
    if (mk.endsWith('-12')) add(day(20), 'Income', 'Year-end bonus — Alex', 8000);
    vti *= 1.012 + (rnd() - 0.45) * 0.04;
    target *= 1.008 + (rnd() - 0.45) * 0.02;
    rsu *= 1.015 + (rnd() - 0.45) * 0.05;
    savings += 450 + rnd() * 200;
    ibond *= 1.0035;
    add(day(28), 'Stock', 'Brokerage — VTI', vti);
    add(day(28), 'Stock', 'RSUs — employer', rsu);
    add(day(28), 'Fund', 'Vanguard Target 2050', target);
    if (i % 3 === 0 || last) add(day(28), 'Deposit', 'High-yield savings', savings);
    if (i % 3 === 0 || last) add(day(28), 'Deposit', 'Emergency fund', 15000 + i * 50);
    if (i % 6 === 0 || last) add(day(28), 'Bond', 'I-Bonds', ibond);
    add(day(5), 'Insurance', 'Term life premium', 95);
    add(day(12), 'Insurance', 'Auto insurance', 160);
    if (['01', '04', '06', '09'].includes(mk.slice(5))) add(day(15), 'Tax', 'Estimated federal tax', 3200);
    if (['02', '10'].includes(mk.slice(5))) add(day(10), 'Tax', 'Property tax', 2400);
    add(day(20), 'Other', 'Groceries & household', 1250 + rnd() * 350);
    add(day(8), 'Other', 'Utilities & internet', 250 + rnd() * 80);
  });
  st.records = recs;
  return st;
}

/* ---------- wiring ---------- */
function init() {
  // theme
  let theme = localStorage.getItem(THEME_KEY) || 'auto';
  applyTheme(theme);
  $('#theme-btn').addEventListener('click', () => {
    theme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  });

  // demo
  $('#demo-banner').hidden = !DEMO;
  window.addEventListener('hashchange', () => location.reload());

  // tabs
  $('#tabs').addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-tab]');
    if (b) switchTab(b.dataset.tab);
  });

  // dashboard range
  $('#range-row').addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-months]');
    if (!b) return;
    rangeMonths = Number(b.dataset.months);
    document.querySelectorAll('#range-row button').forEach((x) => x.classList.toggle('active', x === b));
    renderDashboard();
  });

  // record form
  $('#rec-cat').addEventListener('change', onCatChange);
  $('#rec-cancel').addEventListener('click', resetForm);
  $('#rec-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const amount = Number($('#rec-amount').value);
    if (!Number.isFinite(amount)) return setMsg('#rec-msg', 'Amount must be a number.', false);
    const rec = {
      id: editingId || uid(),
      date: $('#rec-date').value,
      catId: $('#rec-cat').value,
      item: $('#rec-item').value.trim() || '(unnamed)',
      amount: Math.round(amount * 100) / 100,
      note: $('#rec-note').value.trim(),
    };
    if (editingId) {
      const i = state.records.findIndex((r) => r.id === editingId);
      if (i >= 0) state.records[i] = rec;
      setMsg('#rec-msg', 'Record updated.', true);
    } else {
      state.records.push(rec);
      setMsg('#rec-msg', `Added: ${rec.item} · ${fmtFull(rec.amount)}`, true);
    }
    save();
    resetForm();
    renderAll();
    setTimeout(() => setMsg('#rec-msg', '', true), 4000);
  });
  $('#rec-search').addEventListener('input', renderRecords);

  // category form
  $('#cat-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = $('#cat-name').value.trim();
    if (!name) return;
    if (state.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return setMsg('#cat-msg', 'A category with that name already exists.', false);
    }
    const used = new Set(state.categories.map((c) => c.slot));
    let slot = 0;
    for (let i = 1; i <= 8; i++) if (!used.has(i)) { slot = i; break; }
    state.categories.push({ id: uid(), name, kind: $('#cat-kind').value, slot });
    $('#cat-form').reset();
    setMsg('#cat-msg', `Added “${name}”.` + (slot === 0 ? ' (Palette is full — it will chart in gray.)' : ''), true);
    save(); renderAll();
  });

  // export
  $('#exp-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const p1 = $('#exp-pass').value, p2 = $('#exp-pass2').value;
    if (p1.length < 4) return setMsg('#exp-msg', 'Passphrase must be at least 4 characters.', false);
    if (p1 !== p2) return setMsg('#exp-msg', 'Passphrases do not match.', false);
    if (!crypto.subtle) return setMsg('#exp-msg', 'Encryption needs a secure context (https or localhost).', false);
    try {
      const blob = new Blob([await encryptSnapshot(p1)], { type: 'text/plain' });
      const a = h('a', { href: URL.createObjectURL(blob), download: `family-finance-${todayStr()}.finz` });
      document.body.append(a); a.click(); a.remove();
      URL.revokeObjectURL(a.href);
      $('#exp-form').reset();
      setMsg('#exp-msg', `Encrypted snapshot downloaded (${state.records.length} records). Keep the passphrase safe.`, true);
    } catch (e) {
      setMsg('#exp-msg', 'Export failed: ' + e.message, false);
    }
  });

  // import
  $('#imp-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const file = $('#imp-file').files[0];
    if (!file) return;
    if (!crypto.subtle) return setMsg('#imp-msg', 'Decryption needs a secure context (https or localhost).', false);
    try {
      const st = await decryptSnapshot(await file.text(), $('#imp-pass').value);
      const ok = confirm(
        `Snapshot contains ${st.records.length} records in ${st.categories.length} categories.\n` +
        `Importing REPLACES the ${state.records.length} records currently in the app. Continue?`);
      if (!ok) return setMsg('#imp-msg', 'Import cancelled.', false);
      state = st;
      save();
      $('#imp-form').reset();
      renderAll();
      setMsg('#imp-msg', `Imported ${st.records.length} records.`, true);
    } catch (e) {
      setMsg('#imp-msg', e.message, false);
    }
  });

  // settings
  $('#set-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    state.currency = $('#set-currency').value.trim() || '$';
    save(); renderAll();
    setMsg('#set-msg', 'Saved.', true);
    setTimeout(() => setMsg('#set-msg', '', true), 3000);
  });

  // clear
  $('#clear-btn').addEventListener('click', () => {
    if (!confirm('Erase ALL finance data stored in this browser? Export a snapshot first if you may need it.')) return;
    if (!confirm('Really erase everything? This cannot be undone.')) return;
    localStorage.removeItem(LS_KEY);
    state = defaultState();
    renderAll();
    switchTab('dashboard');
  });

  resetForm();
  renderAll();
}

init();
