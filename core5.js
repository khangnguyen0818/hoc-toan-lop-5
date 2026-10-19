'use strict';
/* ===== Lớp 5: số thập phân, hỗn số, tỉ số, hình khối (dùng chung tiện ích trong core.js) ===== */
/* Số thập phân viết dấu phẩy như SGK: 1 234,5 */
const fD = x => { const v = Math.round(x * 1e6) / 1e6; const [i, f] = String(v).split('.'); return fN(+i) + (f ? ',' + f : ''); };
const dp = s => (String(s).split(',')[1] || '').length;
/* Hỗn số: H(2, 3, 4) */
const H = (w, n, d) => `<span class="hs"><b>${w}</b>${F(n, d)}</span>`;
function decChoices(x, p = 2) {
  const u = 10 ** -p, s = new Set([fD(x)]);
  for (const c of shuffle([x + u, x - u, x * 10, x / 10, x + 1, x - 1, x + u * 10, x - u * 10, x + 0.5])) { if (s.size >= 4) break; if (c > 0) s.add(fD(c)); }
  return shuffle([...s]);
}
/* Đặt tính cộng, trừ số thập phân: các dấu phẩy thẳng cột */
function vColD(a, b, op, res = '?') {
  const s = x => String(Math.round(x * 1e6) / 1e6).replace('.', ',');
  const A = s(a), B = s(b), L = Math.max(dp(A), dp(B));
  const pad = t => t + (dp(t) === 0 && L ? '<i class="hz">,</i>' : '') + '<i class="hz">0</i>'.repeat(L - dp(t));
  return `<div class="colc" role="img" aria-label="${A} ${op} ${B}"><span class="cop">${op}</span><span class="cn">${pad(A)}</span><span class="cn">${pad(B)}</span><span class="cl"></span><span class="cn cr">${res}</span></div>`;
}
/* Lưới 100 ô: tô n ô */
function vDec100(n) { return `<div class="agrid g100" style="--w:10">${Array.from({ length: 100 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div>`; }
function vTri(a, h, u = 'cm') {
  return `<svg class="fig hh" viewBox="0 0 300 180" role="img" aria-label="Hình tam giác"><polygon points="30,150 270,150 110,30" class="hh-s"/><line x1="110" y1="30" x2="110" y2="150" class="hh-h"/><path d="M110 138 H122 V150" class="ag-arc"/><text x="110" y="22" class="f-lb">A</text><text x="20" y="168" class="f-lb">B</text><text x="280" y="168" class="f-lb">C</text><text x="110" y="168" class="f-lb">H</text><text x="200" y="172" class="f-len">a = ${a} ${u}</text><text x="128" y="96" class="f-len" text-anchor="start">h = ${h} ${u}</text></svg>`;
}
function vTrap(a, b, h, u = 'cm') {
  return `<svg class="fig hh" viewBox="0 0 300 185" role="img" aria-label="Hình thang"><polygon points="20,150 280,150 210,45 80,45" class="hh-s"/><line x1="80" y1="45" x2="80" y2="150" class="hh-h"/><path d="M80 138 H92 V150" class="ag-arc"/><text x="80" y="36" class="f-lb">A</text><text x="214" y="36" class="f-lb">B</text><text x="286" y="168" class="f-lb">C</text><text x="14" y="168" class="f-lb">D</text><text x="150" y="40" class="f-len">b = ${b} ${u}</text><text x="170" y="174" class="f-len">a = ${a} ${u}</text><text x="88" y="104" class="f-len" text-anchor="start">h = ${h} ${u}</text></svg>`;
}
function vCircle(v, kind = 'r', u = 'cm') {
  const line = kind === 'r' ? '<line x1="110" y1="90" x2="185" y2="90" class="hh-r"/>' : '<line x1="35" y1="90" x2="185" y2="90" class="hh-r"/>';
  return `<svg class="fig hh" viewBox="0 0 220 180" role="img" aria-label="Hình tròn"><circle cx="110" cy="90" r="75" class="hh-s"/>${line}<circle cx="110" cy="90" r="4" class="f-dot"/><text x="104" y="82" class="f-lb">O</text><text x="${kind === 'r' ? 148 : 110}" y="112" class="f-len">${kind === 'r' ? 'r' : 'd'} = ${v} ${u}</text></svg>`;
}
/* Hình hộp chữ nhật / hình lập phương vẽ phối cảnh */
function vBox3d(a, b, c, u = 'cm', cube = false) {
  const W = cube ? 110 : 150, Hh = cube ? 110 : 85, dx = cube ? 50 : 60, dy = 38, x = 40, y = 60;
  return `<svg class="fig hh box3d" viewBox="0 0 280 200" role="img" aria-label="${cube ? 'Hình lập phương' : 'Hình hộp chữ nhật'}">
  <polygon points="${x},${y} ${x + dx},${y - dy} ${x + dx + W},${y - dy} ${x + W},${y}" class="bx-top"/>
  <polygon points="${x + W},${y} ${x + W + dx},${y - dy} ${x + W + dx},${y - dy + Hh} ${x + W},${y + Hh}" class="bx-side"/>
  <rect x="${x}" y="${y}" width="${W}" height="${Hh}" class="bx-front"/>
  <path d="M${x} ${y + Hh} L${x + dx} ${y + Hh - dy} L${x + dx + W} ${y + Hh - dy} M${x + dx} ${y + Hh - dy} L${x + dx} ${y - dy}" class="bx-hid"/>
  <text x="${x + W / 2}" y="${y + Hh + 20}" class="f-len">${cube ? 'cạnh ' : ''}${a} ${u}</text>
  ${cube ? '' : `<text x="${x + W + dx / 2 + 16}" y="${y + Hh - dy / 2 + 16}" class="f-len">${b} ${u}</text><text x="${x - 4}" y="${y + Hh / 2 + 5}" class="f-len" text-anchor="end">${c} ${u}</text>`}</svg>`;
}
function vNet() {
  const cells = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];
  return `<svg class="fig hh" viewBox="0 0 250 190" role="img" aria-label="Hình khai triển hình lập phương">${cells.map(([c, r], i) => `<rect x="${10 + c * 58}" y="${8 + r * 58}" width="58" height="58" class="${i === 2 ? 'bx-front' : 'bx-top'}"/>`).join('')}</svg>`;
}
/* Biểu đồ hình quạt tròn */
function vPieChart(rows, title) {
  let a0 = -90, s = `<div class="piechart"><svg viewBox="0 0 200 200" class="pc" role="img" aria-label="${title}">`;
  rows.forEach((r, i) => {
    const a1 = a0 + r.p * 3.6, la = rad((a0 + a1) / 2), big = r.p > 50 ? 1 : 0;
    s += `<path d="M100 100 L${100 + 90 * Math.cos(rad(a0))} ${100 + 90 * Math.sin(rad(a0))} A90 90 0 ${big} 1 ${100 + 90 * Math.cos(rad(a1))} ${100 + 90 * Math.sin(rad(a1))} Z" class="bc-b b${i % 5} pc-s"/>`;
    if (r.p >= 8) s += `<text x="${100 + 58 * Math.cos(la)}" y="${100 + 58 * Math.sin(la) + 5}" class="pc-t">${r.p}%</text>`;
    a0 = a1;
  });
  return s + `</svg><div class="pc-l"><b>${title}</b>${rows.map((r, i) => `<span><i class="sw b${i % 5}"></i>${r.label}: ${r.p}%</span>`).join('')}</div></div>`;
}
/* Sơ đồ tỉ số: số lớn a phần, số bé b phần bằng nhau */
function vTiSo(a, b, lb = 'Số lớn', sb = 'Số bé', note = '') {
  const u = Math.min(34, 220 / Math.max(a, b)), x0 = 84, W = x0 + Math.max(a, b) * u + 90;
  const seg = (n, y, cls) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * u}" y="${y}" width="${u}" height="16" class="${cls}"/>`).join('');
  return `<div class="scrollx"><svg class="fig sodo" viewBox="0 0 ${W} 96" style="max-width:${W * 1.2}px" role="img" aria-label="Sơ đồ tỉ số"><text x="4" y="31" class="sd-l">${lb}:</text>${seg(a, 18, 'ts-a')}<text x="4" y="75" class="sd-l">${sb}:</text>${seg(b, 62, 'ts-b')}${note ? `<text x="${x0 + Math.max(a, b) * u + 8}" y="54" class="sd-v" text-anchor="start">${note}</text>` : ''}</svg></div>`;
}
function vRoad(top, bottom) {
  return `<div class="scrollx"><svg class="fig road" viewBox="0 0 340 120" role="img" aria-label="Quãng đường"><text x="170" y="18" class="f-len">${top}</text><rect x="10" y="40" width="320" height="34" rx="6" class="rd"/><line x1="18" y1="57" x2="322" y2="57" class="rd-l"/><text x="16" y="66" class="road-e">🚗</text><text x="306" y="66" class="road-e">🏁</text><path d="M20 86 H320 M20 80 V92 M320 80 V92" class="sd-br"/><text x="170" y="110" class="f-len">${bottom}</text></svg></div>`;
}
