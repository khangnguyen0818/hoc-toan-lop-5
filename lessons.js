'use strict';
/* Nội dung bám theo SGK Toán 5 – bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam).
   Mỗi bài: learn (thẻ bài học), game (trò chơi), gen() sinh câu hỏi cho trò chơi & bài kiểm tra. */

/* ---- tiện ích riêng lớp 5 ---- */
const simp = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const FS = s => /\//.test(s) ? F(...s.split('/')) : s;
const lcm = (a, b) => a / gcd(a, b) * b;
const rnd = x => Math.round(x * 1e6) / 1e6;
const steps = (...lines) => `<div class="giai"><b>Bài giải</b><br>${lines.join('<br>')}</div>`;
const memoList = ids => '<ul class="recap">' + ids.map(id => { const l = BYID_RAW[id]; return `<li><b>Bài ${l.so}. ${l.title}</b><br>${l.memo}</li>`; }).join('') + '</ul>';
const BYID_RAW = {};
function bigNum(minLen, maxLen) { const L = R(minLen, maxLen); let s = String(R(1, 9)); for (let i = 1; i < L; i++) s += R(0, 9); return +s; }
function fracPair(maxD = 12) { const d = R(3, maxD), n = R(1, d - 1); return [n, d]; }
/* Số thập phân ngẫu nhiên có p chữ số phần thập phân, phần nguyên trong [a, b] */
const randD = (a, b, p) => R(a * 10 ** p, b * 10 ** p) / 10 ** p;
/* Câu hỏi đáp án phân số (hoặc số tự nhiên) */
function fq(q, a, ex, o = {}) {
  const useMC = o.mc === undefined ? Math.random() < .5 : o.mc;
  if (useMC) return { q, a, choices: /\//.test(a) ? fracChoices(...a.split('/').map(Number)) : numChoices(+a), ex, exact: o.exact, pair: o.pair };
  return { q, a, input: true, frac: true, ex, exact: o.exact, pair: o.pair };
}
/* Câu hỏi đáp án số thập phân */
function dq(q, x, ex, o = {}) {
  x = rnd(x); const a = fD(x), p = Math.max(1, dp(a));
  const useMC = o.mc === undefined ? Math.random() < .5 : o.mc;
  if (useMC) return { q, a, choices: decChoices(x, p), ex, pair: o.pair };
  return { q, a, input: true, dec: true, ex, pair: o.pair };
}
function docTP(x) {
  const [i, f] = String(rnd(x)).split('.');
  let r = docSo(+i);
  if (f) { const lead = f.match(/^0*/)[0].length; r += ' phẩy' + ' không'.repeat(lead); if (f.slice(lead)) r += ' ' + docSo(+f.slice(lead)); }
  return r;
}
const hm = (h, m) => h && m ? `${h} giờ ${m} phút` : h ? `${h} giờ` : `${m} phút`;
const triKind = ['Tam giác nhọn', 'Tam giác vuông', 'Tam giác tù'];

const BOOK = [
/* ================= TẬP MỘT ================= */
{ tap: 1, name: 'Tập một', topics: [

{ id: 'c1', no: 1, name: 'Ôn tập và bổ sung', hue: 1, lessons: [
{ id: 'b1', so: 1, title: 'Ôn tập số tự nhiên', game: 'sort', sort: [100000, 99999999],
  memo: 'Đọc, viết số theo lớp; so sánh từ hàng cao nhất; làm tròn nhìn chữ số hàng ngay bên phải.',
  learn: [
    { t: 'Đọc, viết số', h: `<p>Số <b class="hl">${fN(25308017)}</b> đọc là: <i>${docSo(25308017)}</i>.</p><p>Số này gồm: 2 chục triệu, 5 triệu, 3 trăm nghìn, 0 chục nghìn, 8 nghìn, 0 trăm, 1 chục, 7 đơn vị.</p>` },
    { t: 'So sánh và làm tròn', h: `<p class="eq">${fN(4587120)} &lt; ${fN(4592003)}</p><p>Làm tròn ${fN(4587120)} đến hàng trăm nghìn: <b>${fN(4600000)}</b> (chữ số hàng chục nghìn là 8 ≥ 5).</p><div class="memo">Số chẵn tận cùng 0, 2, 4, 6, 8; số lẻ tận cùng 1, 3, 5, 7, 9.</div>` }
  ],
  gen() { return pick([
    () => { const n = bigNum(6, 8); return mc(`<p>Số “<b>${docSo(n)}</b>” viết là:</p>`, fN(n), fill4(n, [n + 1e5, n - 1000, n * 10 < 1e9 ? n * 10 : n + 10]), `Viết là ${fN(n)}.`); },
    () => { let n, s, i; do { n = bigNum(6, 8); s = String(n); i = R(0, s.length - 1); } while (s[i] === '0'); const v = +s[i] * 10 ** (s.length - 1 - i); return mc(`<p>Giá trị của chữ số <b class="hl">${s[i]}</b> (thứ ${i + 1} từ trái sang) trong số <b>${fN(n)}</b> là:</p>`, fN(v), fill4(v, [v / 10, v * 10, +s[i]].filter(x => x >= 1 && x !== v)), `Chữ số ${s[i]} có giá trị ${fN(v)}.`); },
    () => { const a = bigNum(6, 8), b = pick([a + R(1, 9) * 100, a - R(1, 9) * 1e4, bigNum(6, 8), a]); return cmpQ(a, b); },
    () => { const n = bigNum(6, 8), r = Math.round(n / 1e5) * 1e5; return inp(`<p>Làm tròn số <b>${fN(n)}</b> đến hàng trăm nghìn.</p>`, r, `${fN(n)} ≈ ${fN(r)}`); }
  ])(); } },

{ id: 'b2', so: 2, title: 'Ôn tập các phép tính với số tự nhiên', game: 'memory',
  memo: 'Trong ngoặc trước; nhân, chia trước; cộng, trừ sau. Dùng tính chất giao hoán, kết hợp để tính nhanh.',
  learn: [
    { t: 'Bốn phép tính', h: `<div class="pair2">${vCol(4527, 36, '×', '162972')}<div><p class="eq">${fN(162972)} : 36 = ${fN(4527)}</p><p>Thử lại phép chia bằng phép nhân.</p></div></div>` },
    { t: 'Tính thuận tiện', h: `<p class="eq">25 × 17 × 4 = (25 × 4) × 17 = ${fN(1700)}</p><p class="eq">68 × 35 + 68 × 65 = 68 × 100 = ${fN(6800)}</p>` }
  ],
  gen() { return pick([
    () => { const a = R(100, 999), b = R(12, 99); return calcQ(a, b, '×'); },
    () => { const b = R(12, 99), q = R(20, 999); return calcQ(b * q, b, ':'); },
    () => { const p = pick([[25, 4], [125, 8], [50, 2], [20, 5]]), m = R(11, 99); return inp(`<p>Tính bằng cách thuận tiện:</p><p class="eq">${p[0]} × ${m} × ${p[1]}</p>`, p[0] * p[1] * m, `= (${p[0]} × ${p[1]}) × ${m} = ${fN(p[0] * p[1] * m)}`); },
    () => { const a = R(12, 99), b = R(11, 89); return inp(`<p>Tính bằng cách thuận tiện:</p><p class="eq">${a} × ${b} + ${a} × ${100 - b}</p>`, a * 100, `= ${a} × (${b} + ${100 - b}) = ${a} × 100 = ${fN(a * 100)}`); },
    () => { const a = R(100, 900), b = R(2, 9), c = R(10, 99); return inp(`<p>Tính giá trị biểu thức:</p><p class="eq">${a} + ${b} × ${c}</p>`, a + b * c, `Nhân trước: ${b} × ${c} = ${b * c}; ${a} + ${b * c} = ${a + b * c}`); }
  ])(); } },

{ id: 'b3', so: 3, title: 'Ôn tập phân số', game: 'balloon',
  memo: 'Rút gọn: chia cả tử và mẫu cho cùng một số. Quy đồng để so sánh phân số khác mẫu.',
  learn: [
    { t: 'Tính chất cơ bản', h: `<div class="row-c">${vFracShape(2, 3, 'pie')}${vFracShape(4, 6, 'pie')}</div><p class="eq">${F(2, 3)} = ${F(4, 6)}</p><p>Nhân (hoặc chia) cả tử số và mẫu số với cùng một số khác 0 thì được phân số bằng phân số đã cho.</p>` },
    { t: 'So sánh phân số', h: `<p>${F(3, 4)} và ${F(5, 6)}: quy đồng với mẫu số chung 12 được ${F(9, 12)} và ${F(10, 12)}, nên <b>${F(3, 4)} &lt; ${F(5, 6)}</b>.</p>` }
  ],
  gen() { let n, d; do { [n, d] = fracPair(10); } while (gcd(n, d) !== 1); const k = R(2, 7); return pick([
    () => fq(`<p>Rút gọn thành phân số tối giản:</p><p class="eq">${F(n * k, d * k)}</p>`, `${n}/${d}`, `Chia cả tử và mẫu cho ${k}.`, { exact: true }),
    () => inp(`<p class="eq">${F(n, d)} = ${F('<span class="slot">?</span>', d * k)}</p>`, n * k, `Nhân cả tử và mẫu với ${k}.`),
    () => { const [a, b] = fracPair(9), [c, e] = fracPair(9); const s = a * e > c * b ? '>' : a * e < c * b ? '<' : '='; return { q: `<p>Chọn dấu thích hợp (&gt;, &lt;, =):</p><p class="eq">${F(a, b)} <span class="slot">?</span> ${F(c, e)}</p>`, a: s, choices: ['>', '<', '='], ex: `Quy đồng: ${F(a * e, b * e)} và ${F(c * b, b * e)}.` }; }
  ])(); } },

{ id: 'b4', so: 4, title: 'Phân số thập phân', game: 'race',
  memo: 'Phân số có mẫu số là 10, 100, 1000, … gọi là phân số thập phân.',
  learn: [
    { t: 'Phân số thập phân', h: `<p>${F(3, 10)}; ${F(7, 100)}; ${F(91, 1000)} là các <b>phân số thập phân</b> (mẫu số là 10; 100; 1000; …).</p>${vDec100(7)}<p>Tô màu 7 ô trong 100 ô: ${F(7, 100)}.</p>` },
    { t: 'Viết thành phân số thập phân', h: `<p class="eq">${F(3, 5)} = ${F('3 × 2', '5 × 2')} = ${F(6, 10)}</p><p class="eq">${F(7, 25)} = ${F('7 × 4', '25 × 4')} = ${F(28, 100)}</p><div class="memo">Tìm số nhân với mẫu số để được 10, 100 hoặc 1000.</div>` }
  ],
  gen() { return pick([
    () => { const good = `${R(1, 99)}/${pick([10, 100, 1000])}`; const bad = [`${R(1, 9)}/${pick([3, 7, 12, 15])}`, `${R(1, 9)}/${pick([20, 50, 25])}`, `10/${R(3, 9)}`]; return { ...mc('<p>Phân số nào là <b>phân số thập phân</b>?</p>', good, [good, ...bad]), exact: true, ex: 'Phân số thập phân có mẫu số là 10, 100, 1000, …' }; },
    () => { const c = pick([[2, 10, 5], [5, 10, 2], [4, 100, 25], [25, 100, 4], [20, 100, 5], [50, 100, 2], [8, 1000, 125], [125, 1000, 8]]); const n = R(1, c[0] - 1); return inp(`<p>Viết thành phân số thập phân:</p><p class="eq">${F(n, c[0])} = ${F('<span class="slot">?</span>', c[1])}</p>`, n * c[2], `Nhân cả tử và mẫu với ${c[2]}.`); },
    () => { const n = R(1, 99); return dq(`<p>Phân số <span class="eq">${F(n, 100)}</span> viết dưới dạng số thập phân là:</p>`, n / 100, `${F(n, 100)} = ${fD(n / 100)}`, { mc: true }); }
  ])(); } },

{ id: 'b5', so: 5, title: 'Ôn tập các phép tính với phân số', game: 'fish',
  memo: 'Nhân: tử × tử, mẫu × mẫu. Chia: nhân với phân số đảo ngược.',
  learn: [
    { t: 'Nhân, chia phân số', h: `<p class="eq">${F(2, 3)} × ${F(4, 5)} = ${F(8, 15)}</p><p class="eq">${F(2, 3)} : ${F(4, 5)} = ${F(2, 3)} × ${F(5, 4)} = ${F(10, 12)} = ${F(5, 6)}</p>` },
    { t: 'Cộng, trừ cùng mẫu số', h: `<p class="eq">${F(5, 9)} + ${F(2, 9)} = ${F(7, 9)} &nbsp; ${F(5, 9)} − ${F(2, 9)} = ${F(3, 9)} = ${F(1, 3)}</p>` }
  ],
  gen() { const [a, b] = fracPair(8), [c, d] = fracPair(8); return pick([
    () => { const r = simp(a * c, b * d); return fq(`<p class="eq">${F(a, b)} × ${F(c, d)} = <span class="slot">?</span></p>`, r, `${F(a * c, b * d)}${r !== `${a * c}/${b * d}` ? ' = ' + FS(r) : ''}`); },
    () => { const r = simp(a * d, b * c); return fq(`<p class="eq">${F(a, b)} : ${F(c, d)} = <span class="slot">?</span></p>`, r, `${F(a, b)} × ${F(d, c)} = ${FS(r)}`); },
    () => { const e = R(4, 12), x = R(1, e - 2), y = R(1, e - x - 1); const r = simp(x + y, e); return fq(`<p class="eq">${F(x, e)} + ${F(y, e)} = <span class="slot">?</span></p>`, r, `${F(x + y, e)}${r !== `${x + y}/${e}` ? ' = ' + FS(r) : ''}`); },
    () => { const k = R(2, 6), [x, e] = fracPair(9); return inp(`<p class="wp">Một thửa ruộng thu hoạch được ${e * k * 10} kg thóc. Đã bán ${F(x, e)} số thóc. Hỏi đã bán bao nhiêu ki-lô-gam thóc?</p>`, x * k * 10, steps(`${e * k * 10} × ${F(x, e)} = ${x * k * 10} (kg)`)); }
  ])(); } },

{ id: 'b6', so: 6, title: 'Cộng, trừ hai phân số khác mẫu số', game: 'memory',
  memo: 'Quy đồng mẫu số hai phân số rồi cộng (trừ) như hai phân số cùng mẫu.',
  learn: [
    { t: 'Cộng khác mẫu số', h: `<p class="eq">${F(1, 2)} + ${F(1, 3)} = ${F(3, 6)} + ${F(2, 6)} = ${F(5, 6)}</p><p>Mẫu số chung: 6 (vì 6 chia hết cho cả 2 và 3).</p>` },
    { t: 'Trừ khác mẫu số', h: `<p class="eq">${F(3, 4)} − ${F(1, 6)} = ${F(9, 12)} − ${F(2, 12)} = ${F(7, 12)}</p><div class="memo">Muốn cộng (trừ) hai phân số khác mẫu số, ta <b>quy đồng mẫu số</b> rồi cộng (trừ) hai phân số đã quy đồng.</div>` }
  ],
  gen() { let b = R(2, 8), d = R(2, 9); while (d === b) d = R(2, 9); const m = lcm(b, d), a = R(1, b - 1), c = R(1, d - 1); return pick([
    () => { const r = simp(a * m / b + c * m / d, m); return fq(`<p class="eq">${F(a, b)} + ${F(c, d)} = <span class="slot">?</span></p>`, r, `${F(a * m / b, m)} + ${F(c * m / d, m)} = ${F(a * m / b + c * m / d, m)}${r !== `${a * m / b + c * m / d}/${m}` ? ' = ' + FS(r) : ''}`, { pair: [`${F(a, b)} + ${F(c, d)}`, r] }); },
    () => { const x = a * m / b, y = c * m / d; if (x === y) return fq(`<p class="eq">${F(a, b)} + ${F(c, d)} = <span class="slot">?</span></p>`, simp(x + y, m), `${F(x + y, m)}`); const [p, q] = x > y ? [[a, b, x], [c, d, y]] : [[c, d, y], [a, b, x]]; const r = simp(p[2] - q[2], m); return fq(`<p class="eq">${F(p[0], p[1])} − ${F(q[0], q[1])} = <span class="slot">?</span></p>`, r, `${F(p[2], m)} − ${F(q[2], m)} = ${F(p[2] - q[2], m)}${r !== `${p[2] - q[2]}/${m}` ? ' = ' + FS(r) : ''}`, { pair: [`${F(p[0], p[1])} − ${F(q[0], q[1])}`, r] }); },
    () => { const r = simp(a * m / b + c * m / d, m); return fq(`<p class="wp">Giờ đầu vòi nước chảy được ${F(a, b)} bể, giờ sau chảy được ${F(c, d)} bể. Hỏi sau hai giờ vòi chảy được mấy phần của bể?</p>`, r, `${F(a, b)} + ${F(c, d)} = ${FS(r)} (bể)`); }
  ])(); } },

{ id: 'b7', so: 7, title: 'Hỗn số', game: 'race',
  memo: 'Hỗn số gồm phần nguyên và phần phân số (bé hơn 1). 2¾ = (2 × 4 + 3)/4 = 11/4.',
  learn: [
    { t: 'Hỗn số', h: `<div class="row-c">${vFracShape(4, 4, 'pie')}${vFracShape(4, 4, 'pie')}${vFracShape(3, 4, 'pie')}</div><p>Có 2 hình tròn và ${F(3, 4)} hình tròn. Viết gọn là <span class="eq">${H(2, 3, 4)}</span>, đọc là <i>hai và ba phần tư</i>.</p><p>2 là <b>phần nguyên</b>, ${F(3, 4)} là <b>phần phân số</b>.</p>` },
    { t: 'Chuyển hỗn số thành phân số', h: `<p class="eq">${H(2, 3, 4)} = ${F('2 × 4 + 3', 4)} = ${F(11, 4)}</p><div class="memo">Tử số = phần nguyên × mẫu số + tử số của phần phân số. Mẫu số giữ nguyên.</div>` }
  ],
  gen() { const d = R(2, 9), n = R(1, d - 1), w = R(1, 9); return pick([
    () => fq(`<p>Chuyển hỗn số thành phân số:</p><p class="eq">${H(w, n, d)} = <span class="slot">?</span></p>`, `${w * d + n}/${d}`, `${F(`${w} × ${d} + ${n}`, d)} = ${F(w * d + n, d)}`),
    () => ({ ...mc(`<p>Phân số <span class="eq">${F(w * d + n, d)}</span> viết thành hỗn số là:</p>`, `${w} ${n}/${d}`, [`${w} ${n}/${d}`, `${n} ${w}/${d}`, `${w + 1} ${n}/${d}`, `${w} ${d - n === n ? (n % (d - 1)) + 1 : d - n}/${d}`]), exact: true, ex: `${w * d + n} : ${d} = ${w} (dư ${n}) → ${H(w, n, d)}` }),
    () => mc(`<p>Phần nguyên của hỗn số <span class="eq">${H(w, n, d)}</span> là:</p>`, w, [w, n, d, w + 1], `Phần nguyên là ${w}.`)
  ])(); } },

{ id: 'b8', so: 8, title: 'Ôn tập hình học và đo lường', game: 'balloon',
  memo: 'Chu vi HCN = (a + b) × 2; diện tích HCN = a × b; hình vuông P = a × 4, S = a × a.',
  learn: [
    { t: 'Chu vi, diện tích', h: `${vShape4('cn')}<div class="memo">Hình chữ nhật: <b>P = (a + b) × 2</b>; <b>S = a × b</b><br>Hình vuông: <b>P = a × 4</b>; <b>S = a × a</b></div>` },
    { t: 'Đơn vị đo', h: `<p>km → hm → dam → m → dm → cm → mm: mỗi đơn vị gấp 10 lần đơn vị liền sau.</p><p>tấn → tạ → yến → kg → hg → dag → g: mỗi đơn vị gấp 10 lần đơn vị liền sau.</p>` }
  ],
  gen() { const a = R(5, 30), b = R(3, a - 1); return pick([
    () => inp(`<p>Hình chữ nhật dài ${a} m, rộng ${b} m. Tính <b>diện tích</b> (m²).</p>${vShape4('cn')}`, a * b, `${a} × ${b} = ${a * b} (m²)`),
    () => inp(`<p>Hình chữ nhật dài ${a} cm, rộng ${b} cm. Tính <b>chu vi</b> (cm).</p>`, (a + b) * 2, `(${a} + ${b}) × 2 = ${(a + b) * 2} (cm)`),
    () => inp(`<p>Hình vuông cạnh ${b} dm. Tính <b>diện tích</b> (dm²).</p>${vShape4('vuong')}`, b * b, `${b} × ${b} = ${b * b} (dm²)`),
    () => { const k = R(2, 9); const c = pick([[`${k} km`, 'm', k * 1000], [`${k} m`, 'cm', k * 100], [`${k} tấn`, 'kg', k * 1000], [`${k} kg`, 'g', k * 1000], [`${k} hm`, 'm', k * 100], [`${k} dag`, 'g', k * 10]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${fN(c[2])} ${c[1]}`); }
  ])(); } },

{ id: 'b9', so: 9, title: 'Luyện tập chung', game: 'race', mix: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'] }
]},

{ id: 'c2', no: 2, name: 'Số thập phân', hue: 2, lessons: [
{ id: 'b10', so: 10, title: 'Khái niệm số thập phân', game: 'balloon',
  memo: 'Số thập phân gồm phần nguyên và phần thập phân, ngăn cách bởi dấu phẩy. 0,1 = 1/10; 0,01 = 1/100.',
  learn: [
    { t: 'Phần mười, phần trăm', h: `${vDec100(35)}<p>Tô 35 ô trong 100 ô: ${F(35, 100)} = <b class="hl">0,35</b>.</p><p class="eq">${F(1, 10)} = 0,1 &nbsp; ${F(1, 100)} = 0,01 &nbsp; ${F(1, 1000)} = 0,001</p>` },
    { t: 'Cấu tạo số thập phân', h: `<div class="scrollx"><table class="tbl"><tr><th colspan="2">Phần nguyên</th><th></th><th colspan="3">Phần thập phân</th></tr><tr><td>Chục</td><td>Đơn vị</td><td>,</td><td>Phần mười</td><td>Phần trăm</td><td>Phần nghìn</td></tr><tr><td>2</td><td>7</td><td>,</td><td>4</td><td>0</td><td>5</td></tr></table></div><p>Số <b class="hl">27,405</b> đọc là: <i>${docTP(27.405)}</i>.</p>` },
    { t: 'Ghi nhớ', h: `<div class="memo">Đọc số thập phân: đọc phần nguyên, đọc “phẩy”, rồi đọc phần thập phân.<br>Viết thêm chữ số 0 vào bên phải phần thập phân thì giá trị không đổi: 0,5 = 0,50 = 0,500.</div>` }
  ],
  gen() { return pick([
    () => { const n = R(1, 99); return dq(`<p>Phần đã tô màu viết thành số thập phân là:</p>${vDec100(n)}`, n / 100, `${n} ô trên 100 ô: ${F(n, 100)} = ${fD(n / 100)}`); },
    () => { const x = randD(0, 99, R(1, 3)); const c = new Set([docTP(x)]); [rnd(x * 10), rnd(x + 0.1), rnd(x / 10)].forEach(v => c.add(docTP(v))); return mc(`<p>Số <b class="hl">${fD(x)}</b> đọc là:</p>`, docTP(x), [...c].slice(0, 4), `${fD(x)} đọc là “${docTP(x)}”.`); },
    () => { const p = R(1, 3), n = R(1, 10 ** p - 1); const x = n / 10 ** p; return dq(`<p>Viết phân số thập phân thành số thập phân:</p><p class="eq">${F(n, 10 ** p)} = <span class="slot">?</span></p>`, x, `${F(n, 10 ** p)} = ${fD(x)}`); },
    () => { const x = rnd(R(1, 99) + (R(1, 99) * 10 + R(1, 9)) / 1000); const s = fD(x); const [i, f] = s.split(','); const k = R(0, f.length - 1); const nm = ['phần mười', 'phần trăm', 'phần nghìn'][k]; return inp(`<p>Trong số <b>${s}</b>, chữ số ở hàng <b>${nm}</b> là:</p>`, f[k], `${s}: phần nguyên ${i}; phần mười ${f[0]}${f[1] ? ', phần trăm ' + f[1] : ''}${f[2] ? ', phần nghìn ' + f[2] : ''}.`); },
    () => { const x = randD(1, 999, 2); return inp(`<p>Phần nguyên của số <b>${fD(x)}</b> là:</p>`, Math.floor(x), `Phần nguyên là các chữ số bên trái dấu phẩy.`); }
  ])(); } },

{ id: 'b11', so: 11, title: 'So sánh các số thập phân', game: 'sort', sort: [0, 30, 2],
  memo: 'So sánh phần nguyên trước; nếu bằng nhau thì so sánh lần lượt hàng phần mười, phần trăm, …',
  learn: [
    { t: 'So sánh phần nguyên', h: `<p class="eq">8,9 &lt; 12,05</p><p>Phần nguyên 8 &lt; 12.</p>` },
    { t: 'Phần nguyên bằng nhau', h: `<p class="eq">35,72 &gt; 35,698</p><p>Phần nguyên bằng nhau (35). Hàng phần mười: 7 &gt; 6.</p><div class="memo">Đừng so sánh “độ dài” phần thập phân! 0,7 &gt; 0,65 vì 0,70 &gt; 0,65.</div>` }
  ],
  gen() { return pick([
    () => { const a = randD(0, 50, R(1, 3)), b = pick([randD(0, 50, R(1, 3)), rnd(Math.floor(a) + randD(0, 0, 2)), rnd(a * 10) / 10 === a ? rnd(a + 0.01) : a]); return cmpQ(a, b, fD); },
    () => { const i = R(0, 20), a = rnd(i + R(1, 9) / 10), b = rnd(i + R(10, 99) / 100); return cmpQ(a, b, fD, `So sánh hàng phần mười trước: ${fD(a)} và ${fD(b)}.`); },
    () => { const s = [...new Set(Array.from({ length: 6 }, () => randD(1, 9, R(1, 3))))].slice(0, 4); const big = Math.random() < .5; const v = big ? Math.max(...s) : Math.min(...s); return mc(`<p>Số <b>${big ? 'lớn nhất' : 'bé nhất'}</b> trong các số sau là:</p>`, fD(v), s.map(fD), `Số ${big ? 'lớn nhất' : 'bé nhất'} là ${fD(v)}.`); }
  ])(); } },

{ id: 'b12', so: 12, title: 'Viết số đo đại lượng dưới dạng số thập phân', game: 'race',
  memo: '3 m 25 cm = 3,25 m; 5 kg 300 g = 5,3 kg; 2 tấn 50 kg = 2,05 tấn.',
  learn: [
    { t: 'Số đo độ dài', h: `<p class="eq">3 m 25 cm = 3${F(25, 100)} m = 3,25 m</p><p class="eq">7 m 5 cm = 7,05 m</p>` },
    { t: 'Số đo khối lượng, diện tích', h: `<p class="eq">5 kg 300 g = 5,3 kg &nbsp; 2 tấn 50 kg = 2,05 tấn</p><p class="eq">4 m² 25 dm² = 4,25 m²</p><div class="memo">Nhớ quan hệ giữa hai đơn vị (gấp 10, 100 hay 1000 lần) để biết phần lẻ có mấy chữ số sau dấu phẩy.</div>` }
  ],
  gen() { const w = R(1, 30); return pick([
    () => { const c = R(1, 99); return dq(`<p class="eq">${w} m ${c} cm = <span class="slot">?</span> m</p>`, w + c / 100, `1 m = 100 cm nên ${c} cm = ${fD(c / 100)} m.`); },
    () => { const g = R(1, 999); return dq(`<p class="eq">${w} kg ${g} g = <span class="slot">?</span> kg</p>`, w + g / 1000, `1 kg = 1000 g nên ${g} g = ${fD(g / 1000)} kg.`); },
    () => { const k = R(1, 999); return dq(`<p class="eq">${w} tấn ${k} kg = <span class="slot">?</span> tấn</p>`, w + k / 1000, `1 tấn = 1000 kg.`); },
    () => { const x = randD(1, 20, 2); return inp(`<p class="eq">${fD(x)} m = <span class="slot">?</span> cm</p>`, Math.round(x * 100), `${fD(x)} × 100 = ${Math.round(x * 100)} (cm)`); },
    () => { const d = R(1, 99); return dq(`<p class="eq">${w} m² ${d} dm² = <span class="slot">?</span> m²</p>`, w + d / 100, '1 m² = 100 dm².'); }
  ])(); } },

{ id: 'b13', so: 13, title: 'Làm tròn số thập phân', game: 'fish',
  memo: 'Nhìn chữ số ngay bên phải hàng cần làm tròn: bé hơn 5 thì bỏ đi, từ 5 trở lên thì thêm 1 vào hàng cần làm tròn.',
  learn: [
    { t: 'Làm tròn đến số tự nhiên gần nhất', h: `<p>7,3 ≈ <b>7</b> (vì 3 &lt; 5) · 7,8 ≈ <b>8</b> (vì 8 ≥ 5)</p>` },
    { t: 'Làm tròn đến hàng phần mười, phần trăm', h: `<p>4,268 làm tròn đến hàng phần mười: chữ số hàng phần trăm là 6 ≥ 5 → <b>4,3</b>.</p><p>4,268 làm tròn đến hàng phần trăm: chữ số hàng phần nghìn là 8 ≥ 5 → <b>4,27</b>.</p>` }
  ],
  gen() { const x = randD(1, 99, 3); return pick([
    () => { const r = Math.round(x); return mc(`<p>Làm tròn <b>${fD(x)}</b> đến số tự nhiên gần nhất:</p>`, r, fill4(r, [r + 1, Math.max(0, r - 1), Math.floor(x) === r ? r + 2 : r - 2]), `Chữ số hàng phần mười là ${fD(x).split(',')[1]?.[0] || 0}.`); },
    () => dq(`<p>Làm tròn <b>${fD(x)}</b> đến hàng phần mười:</p>`, Math.round(x * 10) / 10, `Chữ số hàng phần trăm là ${(fD(x).split(',')[1] || '00')[1] || 0}.`),
    () => dq(`<p>Làm tròn <b>${fD(x)}</b> đến hàng phần trăm:</p>`, Math.round(x * 100) / 100, `Chữ số hàng phần nghìn là ${(fD(x).split(',')[1] || '000')[2] || 0}.`)
  ])(); } },

{ id: 'b14', so: 14, title: 'Luyện tập chung', game: 'balloon', mix: ['b10', 'b11', 'b12', 'b13'] }
]},

{ id: 'c3', no: 3, name: 'Một số đơn vị đo diện tích', hue: 3, lessons: [
{ id: 'b15', so: 15, title: 'Ki-lô-mét vuông. Héc-ta', game: 'balloon',
  memo: '1 km² = 1 000 000 m²; 1 ha = 10 000 m²; 1 km² = 100 ha.',
  learn: [
    { t: 'Ki-lô-mét vuông', h: `<p>Diện tích hình vuông cạnh <b>1 km</b> là <b>1 ki-lô-mét vuông</b>, viết là <b class="hl">1 km²</b>.</p><p class="eq">1 km² = ${fN(1000000)} m²</p><p>Dùng để đo diện tích lớn: một thành phố, một khu rừng, một quốc gia.</p>` },
    { t: 'Héc-ta', h: `<p>Diện tích hình vuông cạnh <b>100 m</b> là <b>1 héc-ta</b>, viết là <b class="hl">1 ha</b>.</p><p class="eq">1 ha = ${fN(10000)} m² &nbsp; 1 km² = 100 ha</p><p class="tip">Héc-ta thường dùng để đo diện tích ruộng, vườn, đất trồng rừng.</p>` }
  ],
  gen() { const k = R(2, 9); return pick([
    () => { const c = pick([[`${k} km²`, 'm²', k * 1e6], [`${k} ha`, 'm²', k * 1e4], [`${k} km²`, 'ha', k * 100], [`${fN(k * 1e4)} m²`, 'ha', k], [`${k * 100} ha`, 'km²', k]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${fN(c[2])} ${c[1]}`); },
    () => { const c = pick([['Diện tích Thủ đô Hà Nội khoảng 3 359', 'km²'], ['Diện tích một sân trường khoảng 2 000', 'm²'], ['Diện tích một khu rừng trồng khoảng 150', 'ha'], ['Diện tích một phòng học khoảng 60', 'm²']]); return mc(`<p>Chọn đơn vị thích hợp:</p><p class="wp">${c[0]} <span class="slot">?</span></p>`, c[1], ['m²', 'ha', 'km²', 'dm²'], `${c[0]} ${c[1]}.`); },
    () => { const a = R(2, 9), b = R(10, 90); return inp(`<p class="wp">Một trang trại có ${a} ha trồng cây ăn quả và ${fN(b * 1000)} m² trồng rau. Hỏi trang trại có tất cả bao nhiêu mét vuông đất trồng?</p>`, a * 1e4 + b * 1000, steps(`${a} ha = ${fN(a * 1e4)} m²`, `${fN(a * 1e4)} + ${fN(b * 1000)} = ${fN(a * 1e4 + b * 1000)} (m²)`)); }
  ])(); } },

{ id: 'b16', so: 16, title: 'Các đơn vị đo diện tích', game: 'fish',
  memo: 'Mỗi đơn vị đo diện tích gấp 100 lần đơn vị bé hơn tiếp liền.',
  learn: [
    { t: 'Bảng đơn vị đo diện tích', h: `<div class="scrollx"><table class="tbl"><tr><th>km²</th><th>hm² (ha)</th><th>dam²</th><th>m²</th><th>dm²</th><th>cm²</th><th>mm²</th></tr><tr><td colspan="7">Mỗi đơn vị gấp <b>100 lần</b> đơn vị liền sau nó</td></tr></table></div>` },
    { t: 'Đổi đơn vị', h: `<p class="eq">3 m² = 300 dm² &nbsp; 5 dm² = 500 cm²</p><p class="eq">3,5 m² = 350 dm² &nbsp; 1 200 cm² = 12 dm²</p><div class="memo">Đổi từ đơn vị lớn sang đơn vị bé liền sau: nhân với 100. Ngược lại: chia cho 100.</div>` }
  ],
  gen() { const k = R(2, 20); return pick([
    () => { const c = pick([[`${k} m²`, 'dm²', k * 100], [`${k} dm²`, 'cm²', k * 100], [`${k} cm²`, 'mm²', k * 100], [`${k} dam²`, 'm²', k * 100], [`${k * 100} dm²`, 'm²', k], [`${k} m²`, 'cm²', k * 1e4]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${fN(c[2])} ${c[1]}`); },
    () => { const x = randD(1, 9, 1); return inp(`<p class="eq">${fD(x)} m² = <span class="slot">?</span> dm²</p>`, Math.round(x * 100), `${fD(x)} × 100 = ${Math.round(x * 100)}`); },
    () => { const d = R(1, 99); return dq(`<p class="eq">${d} dm² = <span class="slot">?</span> m²</p>`, d / 100, `${d} : 100 = ${fD(d / 100)}`); },
    () => { const a = R(2, 9); const c = pick([[`${a} m²`, `${a * 100 - R(1, 50)} dm²`], [`${a} m²`, `${a * 100} dm²`], [`${a} dm²`, `${a * 100 + R(1, 50)} cm²`]]); const L = +c[0].split(' ')[0] * 100, Rv = +c[1].split(' ')[0]; const s = L > Rv ? '>' : L < Rv ? '<' : '='; return { q: `<p>Chọn dấu thích hợp (&gt;, &lt;, =):</p><p class="eq">${c[0]} <span class="slot">?</span> ${c[1]}</p>`, a: s, choices: ['>', '<', '='], ex: `${c[0]} = ${L} ${c[1].split(' ')[1]}.` }; }
  ])(); } },

{ id: 'b18', so: 18, title: 'Luyện tập chung', game: 'race', mix: ['b15', 'b16', 'b12'] }
]},

{ id: 'c4', no: 4, name: 'Các phép tính với số thập phân', hue: 4, lessons: [
{ id: 'b19', so: 19, title: 'Phép cộng số thập phân', game: 'memory',
  memo: 'Đặt tính sao cho các dấu phẩy thẳng cột; cộng như số tự nhiên; đặt dấu phẩy ở tổng thẳng cột với các dấu phẩy.',
  learn: [
    { t: 'Đặt tính 15,9 + 8,75', h: `<div class="pair2">${vColD(15.9, 8.75, '+', '24,65')}<div><p>• Viết số hạng này dưới số hạng kia sao cho các chữ số cùng hàng thẳng cột, <b>dấu phẩy thẳng dấu phẩy</b>.</p><p>• Cộng như cộng số tự nhiên.</p><p>• Viết dấu phẩy ở tổng thẳng cột với các dấu phẩy.</p></div></div>` },
    { t: 'Tính chất', h: `<p class="eq">a + b = b + a &nbsp; (a + b) + c = a + (b + c)</p><p>Tính nhanh: 4,68 + 6,03 + 5,32 = (4,68 + 5,32) + 6,03 = 10 + 6,03 = 16,03.</p>` }
  ],
  gen() { const a = randD(1, 99, R(1, 2)), b = randD(1, 60, R(1, 3)); return pick([
    () => dq(`<p>Đặt tính rồi tính:</p>${vColD(a, b, '+')}`, a + b, `${fD(a)} + ${fD(b)} = ${fD(rnd(a + b))}`, { pair: [`${fD(a)} + ${fD(b)}`, fD(rnd(a + b))] }),
    () => dq(`<p class="eq">${fD(a)} + ${fD(b)} = <span class="slot">?</span></p>`, a + b, `${fD(a)} + ${fD(b)} = ${fD(rnd(a + b))}`, { pair: [`${fD(a)} + ${fD(b)}`, fD(rnd(a + b))] }),
    () => { const x = randD(10, 40, 1), y = randD(10, 40, 1); return dq(`<p class="wp">Thùng thứ nhất có ${fD(x)} l dầu, thùng thứ hai có ${fD(y)} l dầu. Hỏi cả hai thùng có bao nhiêu lít dầu?</p>`, x + y, steps(`${fD(x)} + ${fD(y)} = ${fD(rnd(x + y))} (l)`), { pair: [`${fD(x)} + ${fD(y)}`, fD(rnd(x + y))] }); }
  ])(); } },

{ id: 'b20', so: 20, title: 'Phép trừ số thập phân', game: 'fish',
  memo: 'Đặt tính dấu phẩy thẳng cột; nếu phần thập phân số bị trừ ít chữ số hơn thì viết thêm chữ số 0.',
  learn: [
    { t: 'Đặt tính 45,8 − 19,26', h: `<div class="pair2">${vColD(45.8, 19.26, '−', '26,54')}<div><p>Coi 45,8 là 45,80 rồi trừ như trừ số tự nhiên. Viết dấu phẩy ở hiệu thẳng cột với các dấu phẩy.</p></div></div>` },
    { t: 'Thử lại', h: `<p class="eq">26,54 + 19,26 = 45,8 ✓</p>` }
  ],
  gen() { const a = randD(20, 99, R(1, 2)), b = randD(1, Math.floor(a) - 1, R(1, 3)); return pick([
    () => dq(`<p>Đặt tính rồi tính:</p>${vColD(a, b, '−')}`, a - b, `${fD(a)} − ${fD(b)} = ${fD(rnd(a - b))}`),
    () => dq(`<p class="eq">${fD(a)} − ${fD(b)} = <span class="slot">?</span></p>`, a - b, `${fD(a)} − ${fD(b)} = ${fD(rnd(a - b))}`),
    () => { const x = randD(30, 60, 1), y = randD(5, 25, 2); return dq(`<p class="wp">Một sợi dây dài ${fD(x)} m, người ta cắt đi ${fD(y)} m. Hỏi sợi dây còn lại bao nhiêu mét?</p>`, x - y, steps(`${fD(x)} − ${fD(y)} = ${fD(rnd(x - y))} (m)`)); }
  ])(); } },

{ id: 'b21', so: 21, title: 'Phép nhân số thập phân', game: 'balloon',
  memo: 'Nhân như số tự nhiên, rồi đếm tổng số chữ số ở phần thập phân của các thừa số để đặt dấu phẩy ở tích.',
  learn: [
    { t: 'Nhân số thập phân với số tự nhiên', h: `<div class="pair2">${vCol('1,25', '3', '×', '3,75')}<div><p>Nhân 125 × 3 = 375. Thừa số 1,25 có <b>2 chữ số</b> ở phần thập phân, nên tách ở tích 2 chữ số từ phải sang trái: <b>3,75</b>.</p></div></div>` },
    { t: 'Nhân hai số thập phân', h: `<p class="eq">2,4 × 1,5 = 3,6</p><p>24 × 15 = 360. Hai thừa số có tất cả <b>2 chữ số</b> ở phần thập phân: 3,60 = 3,6.</p>` }
  ],
  gen() { return pick([
    () => { const a = randD(1, 50, R(1, 2)), b = R(2, 9); return dq(`<p class="eq">${fD(a)} × ${b} = <span class="slot">?</span></p>`, a * b, `${fD(a)} × ${b} = ${fD(rnd(a * b))}`); },
    () => { const a = randD(1, 9, 1), b = randD(1, 9, 1); return dq(`<p class="eq">${fD(a)} × ${fD(b)} = <span class="slot">?</span></p>`, a * b, `${Math.round(a * 10)} × ${Math.round(b * 10)} = ${Math.round(a * 10) * Math.round(b * 10)}; tách 2 chữ số: ${fD(rnd(a * b))}`); },
    () => { const p = randD(2, 9, 1), k = R(3, 12); return dq(`<p class="wp">Mỗi chai nước mắm chứa ${fD(p)} l. Hỏi ${k} chai như thế chứa bao nhiêu lít?</p>`, p * k, steps(`${fD(p)} × ${k} = ${fD(rnd(p * k))} (l)`)); },
    () => { const a = randD(2, 20, 1), b = randD(1, 9, 1); return dq(`<p>Hình chữ nhật dài ${fD(a)} m, rộng ${fD(b)} m. Tính diện tích (m²).</p>`, a * b, `${fD(a)} × ${fD(b)} = ${fD(rnd(a * b))} (m²)`); }
  ])(); } },

{ id: 'b22', so: 22, title: 'Phép chia số thập phân', game: 'race',
  memo: 'Chia cho số tự nhiên: chia như thường, đặt dấu phẩy ở thương khi hạ chữ số đầu của phần thập phân. Chia cho số thập phân: chuyển dấu phẩy để số chia thành số tự nhiên.',
  learn: [
    { t: 'Chia số thập phân cho số tự nhiên', h: `<p class="eq">8,4 : 4 = 2,1</p><p>8 chia 4 được 2, viết 2. Viết dấu phẩy vào bên phải 2. Hạ 4; 4 chia 4 được 1.</p>` },
    { t: 'Chia cho số thập phân', h: `<p class="eq">5,85 : 1,3 = 58,5 : 13 = 4,5</p><div class="memo">Đếm số chữ số ở phần thập phân của số chia, chuyển dấu phẩy ở số bị chia sang phải bấy nhiêu chữ số, bỏ dấu phẩy ở số chia rồi chia như chia cho số tự nhiên.</div><p class="tip">Thương của hai số tự nhiên có thể là số thập phân: 7 : 4 = 1,75.</p>` }
  ],
  gen() { return pick([
    () => { const b = R(2, 9), q = randD(1, 30, R(1, 2)); return dq(`<p class="eq">${fD(rnd(q * b))} : ${b} = <span class="slot">?</span></p>`, q, `${fD(rnd(q * b))} : ${b} = ${fD(q)}`); },
    () => { const b = pick([2, 4, 5, 8]), a = R(1, 40); return dq(`<p>Tính (thương là số thập phân):</p><p class="eq">${a} : ${b} = <span class="slot">?</span></p>`, a / b, `${a} : ${b} = ${fD(a / b)}`); },
    () => { const b = randD(1, 9, 1), q = R(2, 30) / pick([1, 10]); return dq(`<p class="eq">${fD(rnd(q * b))} : ${fD(b)} = <span class="slot">?</span></p>`, q, `Chuyển dấu phẩy: ${fD(rnd(q * b * 10))} : ${Math.round(b * 10)} = ${fD(q)}`); },
    () => { const k = R(3, 8), p = randD(1, 9, 2); return dq(`<p class="wp">${k} túi gạo như nhau nặng ${fD(rnd(p * k))} kg. Hỏi mỗi túi nặng bao nhiêu ki-lô-gam?</p>`, p, steps(`${fD(rnd(p * k))} : ${k} = ${fD(p)} (kg)`)); }
  ])(); } },

{ id: 'b23', so: 23, title: 'Nhân, chia số thập phân với 10; 100; 1 000; … hoặc với 0,1; 0,01; 0,001; …', game: 'balloon',
  memo: '× 10, 100, 1000: dấu phẩy sang phải 1, 2, 3 chữ số. : 10, 100, 1000 (hay × 0,1; 0,01; 0,001): dấu phẩy sang trái.',
  learn: [
    { t: 'Nhân với 10; 100; 1 000', h: `<p class="eq">3,725 × 10 = 37,25 &nbsp; 3,725 × 100 = 372,5 &nbsp; 3,725 × 1000 = ${fN(3725)}</p><p>Chuyển dấu phẩy sang <b>phải</b> 1, 2, 3 chữ số.</p>` },
    { t: 'Chia cho 10; 100; 1 000 hoặc nhân với 0,1; 0,01', h: `<p class="eq">45,6 : 10 = 4,56 &nbsp; 45,6 × 0,1 = 4,56</p><p class="eq">45,6 : 100 = 0,456 &nbsp; 45,6 × 0,01 = 0,456</p><div class="memo">Nhân với 0,1 cũng là chia cho 10. Nhân với 0,01 cũng là chia cho 100.</div>` }
  ],
  gen() { const x = randD(1, 99, R(1, 3)), k = pick([10, 100, 1000]), kk = pick([0.1, 0.01, 0.001]); return pick([
    () => dq(`<p class="eq">${fD(x)} × ${fN(k)} = <span class="slot">?</span></p>`, x * k, `Chuyển dấu phẩy sang phải ${String(k).length - 1} chữ số.`),
    () => dq(`<p class="eq">${fD(x)} : ${fN(k)} = <span class="slot">?</span></p>`, x / k, `Chuyển dấu phẩy sang trái ${String(k).length - 1} chữ số.`),
    () => dq(`<p class="eq">${fD(x)} × ${fD(kk)} = <span class="slot">?</span></p>`, x * kk, `Nhân với ${fD(kk)} là chia cho ${fN(Math.round(1 / kk))}.`)
  ])(); } },

{ id: 'b24', so: 24, title: 'Luyện tập chung', game: 'race', mix: ['b19', 'b20', 'b21', 'b22', 'b23'] }
]},

{ id: 'c5', no: 5, name: 'Một số hình phẳng', hue: 5, lessons: [
{ id: 'b25', so: 25, title: 'Hình tam giác. Diện tích hình tam giác', game: 'race',
  memo: 'S = a × h : 2 (a là độ dài đáy, h là chiều cao, cùng đơn vị đo).',
  learn: [
    { t: 'Đáy và chiều cao', h: `${vTri(8, 5)}<p>BC là <b>đáy</b>; AH là <b>chiều cao</b> (đoạn thẳng từ đỉnh A vuông góc với đáy BC).</p>` },
    { t: 'Diện tích hình tam giác', h: `<div class="memo"><b>S = a × h : 2</b><br>Muốn tính diện tích hình tam giác, ta lấy độ dài đáy nhân với chiều cao (cùng đơn vị đo) rồi chia cho 2.</div><p>Đáy 8 cm, chiều cao 5 cm: S = 8 × 5 : 2 = <b>20 cm²</b>.</p>` },
    { t: 'Các loại tam giác', h: `<p><b>Tam giác nhọn</b>: ba góc nhọn. <b>Tam giác vuông</b>: có một góc vuông. <b>Tam giác tù</b>: có một góc tù.</p>` }
  ],
  gen() { const a = R(3, 30), h = R(2, 20); return pick([
    () => { const s = a * h / 2; return Number.isInteger(s) ? inp(`<p>Tính diện tích hình tam giác (cm²):</p>${vTri(a, h)}`, s, `${a} × ${h} : 2 = ${s} (cm²)`) : dq(`<p>Tính diện tích hình tam giác (cm²):</p>${vTri(a, h)}`, s, `${a} × ${h} : 2 = ${fD(s)} (cm²)`); },
    () => { const x = randD(2, 9, 1), y = R(2, 8) * 2; return dq(`<p>Hình tam giác có đáy ${fD(x)} dm, chiều cao ${y} dm. Tính diện tích (dm²).</p>`, x * y / 2, `${fD(x)} × ${y} : 2 = ${fD(rnd(x * y / 2))} (dm²)`); },
    () => { const k = R(0, 2), d = [pick([40, 60, 70]), 90, pick([110, 120, 130])][k]; return mc(`<p>Một hình tam giác có góc lớn nhất bằng <b>${d}°</b>. Đó là:</p>`, triKind[k], triKind, `Góc lớn nhất ${d}°: ${triKind[k].toLowerCase()}.`); },
    () => inp(`<p>Hình tam giác có diện tích ${fD(a * h / 2)} cm² và đáy ${a} cm. Tính chiều cao (cm).</p>`, h, `h = S × 2 : a = ${fD(a * h / 2)} × 2 : ${a} = ${h} (cm)`)
  ])(); } },

{ id: 'b26', so: 26, title: 'Hình thang. Diện tích hình thang', game: 'fish',
  memo: 'S = (a + b) × h : 2 (a, b là độ dài hai đáy, h là chiều cao).',
  learn: [
    { t: 'Hình thang', h: `${vTrap(12, 7, 5)}<p>Hình thang ABCD có hai cạnh đáy AB và DC <b>song song</b>. AH là chiều cao.</p>` },
    { t: 'Diện tích hình thang', h: `<div class="memo"><b>S = (a + b) × h : 2</b><br>Lấy tổng độ dài hai đáy nhân với chiều cao (cùng đơn vị đo) rồi chia cho 2.</div><p>S = (12 + 7) × 5 : 2 = <b>47,5 cm²</b>.</p>` }
  ],
  gen() { const a = R(6, 30), b = R(3, a - 1), h = R(2, 15); const s = (a + b) * h / 2; return pick([
    () => dq(`<p>Tính diện tích hình thang (cm²):</p>${vTrap(a, b, h)}`, s, `(${a} + ${b}) × ${h} : 2 = ${fD(s)} (cm²)`, { mc: Number.isInteger(s) ? undefined : true }),
    () => { const x = randD(5, 15, 1), y = randD(2, 5, 1), z = R(2, 10); return dq(`<p>Hình thang có hai đáy ${fD(x)} m và ${fD(y)} m, chiều cao ${z} m. Tính diện tích (m²).</p>`, (x + y) * z / 2, `(${fD(x)} + ${fD(y)}) × ${z} : 2 = ${fD(rnd((x + y) * z / 2))} (m²)`); },
    () => mc('<p>Hình thang có mấy cặp cạnh đối diện song song?</p>', 'Một cặp', ['Một cặp', 'Hai cặp', 'Không có', 'Ba cặp'], 'Hình thang có một cặp cạnh đối diện song song (hai đáy).'),
    () => { const t = (a + b) * h; return inp(`<p class="wp">Một thửa ruộng hình thang có đáy lớn ${a} m, đáy bé ${b} m, chiều cao ${h * 2} m. Tính diện tích thửa ruộng (m²).</p>`, t, steps(`(${a} + ${b}) × ${h * 2} : 2 = ${t} (m²)`)); }
  ])(); } },

{ id: 'b27', so: 27, title: 'Đường tròn. Chu vi và diện tích hình tròn', game: 'balloon',
  memo: 'C = d × 3,14 = r × 2 × 3,14; S = r × r × 3,14.',
  learn: [
    { t: 'Tâm, bán kính, đường kính', h: `<div class="row-c">${vCircle(3, 'r')}${vCircle(6, 'd')}</div><p>O là <b>tâm</b>, <b>bán kính</b> r nối tâm với một điểm trên đường tròn. <b>Đường kính</b> d = r × 2.</p>` },
    { t: 'Chu vi hình tròn', h: `<div class="memo"><b>C = d × 3,14</b> hoặc <b>C = r × 2 × 3,14</b></div><p>Đường kính 6 cm: C = 6 × 3,14 = <b>18,84 cm</b>.</p>` },
    { t: 'Diện tích hình tròn', h: `<div class="memo"><b>S = r × r × 3,14</b></div><p>Bán kính 3 cm: S = 3 × 3 × 3,14 = <b>28,26 cm²</b>.</p>` }
  ],
  gen() { const r = R(1, 12); return pick([
    () => dq(`<p>Tính chu vi hình tròn (cm):</p>${vCircle(r * 2, 'd')}`, r * 2 * 3.14, `C = ${r * 2} × 3,14 = ${fD(rnd(r * 2 * 3.14))} (cm)`),
    () => dq(`<p>Tính chu vi hình tròn có bán kính ${r} cm.</p>${vCircle(r, 'r')}`, r * 2 * 3.14, `C = ${r} × 2 × 3,14 = ${fD(rnd(r * 2 * 3.14))} (cm)`),
    () => dq(`<p>Tính diện tích hình tròn (cm²):</p>${vCircle(r, 'r')}`, r * r * 3.14, `S = ${r} × ${r} × 3,14 = ${fD(rnd(r * r * 3.14))} (cm²)`),
    () => inp(`<p>Hình tròn có bán kính ${r} cm thì đường kính là bao nhiêu xăng-ti-mét?</p>`, r * 2, `d = r × 2 = ${r * 2} (cm)`)
  ])(); } },

{ id: 'b29', so: 29, title: 'Luyện tập chung', game: 'race', mix: ['b25', 'b26', 'b27'] }
]},

{ id: 'c6', no: 6, name: 'Ôn tập học kì 1', hue: 7, lessons: [
{ id: 'on1', so: '30–35', title: 'Ôn tập học kì 1', game: 'race', mixTopics: ['c1', 'c2', 'c3', 'c4', 'c5'] }
]}
]},

/* ================= TẬP HAI ================= */
{ tap: 2, name: 'Tập hai', topics: [

{ id: 'c7', no: 7, name: 'Tỉ số và các bài toán liên quan', hue: 1, lessons: [
{ id: 'b36', so: 36, title: 'Tỉ số. Tỉ số phần trăm', game: 'race',
  memo: 'Tỉ số của a và b là a : b hay a/b. Tỉ số phần trăm có mẫu số 100: 25/100 = 25%.',
  learn: [
    { t: 'Tỉ số', h: `${vRows([{ label: 'Xanh', e: '🔵', n: 3 }, { label: 'Đỏ', e: '🔴', n: 5 }])}<p>Tỉ số của số bi xanh và số bi đỏ là <b>3 : 5</b> hay ${F(3, 5)}.</p>` },
    { t: 'Tỉ số phần trăm', h: `${vDec100(25)}<p>${F(25, 100)} viết là <b class="hl">25%</b>, đọc là <i>hai mươi lăm phần trăm</i>.</p><div class="memo">0,35 = ${F(35, 100)} = 35% · ${F(1, 2)} = ${F(50, 100)} = 50% · ${F(3, 4)} = 75%</div>` }
  ],
  gen() { return pick([
    () => { const a = R(2, 15), b = R(2, 15); return fq(`<p>Tỉ số của <b>${a}</b> và <b>${b}</b> viết dưới dạng phân số là:</p>`, `${a}/${b}`, `Tỉ số của ${a} và ${b} là ${a} : ${b} = ${F(a, b)}.`, { mc: true }); },
    () => { const n = R(1, 99); return inp(`<p class="eq">${F(n, 100)} = <span class="slot">?</span>%</p>`, n, `${F(n, 100)} = ${n}%`); },
    () => { const n = R(1, 99); return inp(`<p>Viết <b>${fD(n / 100)}</b> thành tỉ số phần trăm:</p><p class="eq">${fD(n / 100)} = <span class="slot">?</span>%</p>`, n, `${fD(n / 100)} = ${F(n, 100)} = ${n}%`); },
    () => { const c = pick([[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 10, 10], [7, 20, 35], [9, 25, 36]]); return inp(`<p class="eq">${F(c[0], c[1])} = <span class="slot">?</span>%</p>`, c[2], `${F(c[0], c[1])} = ${F(c[2], 100)} = ${c[2]}%`); }
  ])(); } },

{ id: 'b37', so: 37, title: 'Tỉ lệ bản đồ và ứng dụng', game: 'fish',
  memo: 'Tỉ lệ 1 : 1000 nghĩa là 1 cm trên bản đồ ứng với 1000 cm (10 m) ngoài thực tế.',
  learn: [
    { t: 'Tỉ lệ bản đồ', h: `<p>Bản đồ ghi tỉ lệ <b class="hl">1 : ${fN(100000)}</b>: độ dài 1 cm trên bản đồ ứng với ${fN(100000)} cm = 1 km ngoài thực tế.</p>🗺️` },
    { t: 'Tính độ dài thật', h: `<p>Tỉ lệ 1 : 500, trên bản đồ dài 4 cm. Độ dài thật: 4 × 500 = ${fN(2000)} (cm) = <b>20 m</b>.</p><div class="memo">Độ dài thật = độ dài trên bản đồ × số tỉ lệ.<br>Độ dài trên bản đồ = độ dài thật : số tỉ lệ.</div>` }
  ],
  gen() { const k = pick([100, 200, 500, 1000, 2000, 5000, 10000]), d = R(2, 12); return pick([
    () => inp(`<p>Bản đồ tỉ lệ <b>1 : ${fN(k)}</b>. Độ dài trên bản đồ là ${d} cm. Độ dài thật là bao nhiêu xăng-ti-mét?</p>`, d * k, `${d} × ${fN(k)} = ${fN(d * k)} (cm)`),
    () => dq(`<p>Bản đồ tỉ lệ <b>1 : ${fN(k)}</b>. Độ dài trên bản đồ là ${d} cm. Độ dài thật là bao nhiêu mét?</p>`, d * k / 100, `${d} × ${fN(k)} = ${fN(d * k)} cm = ${fD(d * k / 100)} m`),
    () => inp(`<p>Bản đồ tỉ lệ <b>1 : ${fN(k)}</b>. Quãng đường thật dài ${fN(d * k)} cm. Trên bản đồ dài bao nhiêu xăng-ti-mét?</p>`, d, `${fN(d * k)} : ${fN(k)} = ${d} (cm)`)
  ])(); } },

{ id: 'b38', so: 38, title: 'Tìm hai số khi biết tổng và tỉ số của hai số đó', game: 'race',
  memo: 'Vẽ sơ đồ → tìm tổng số phần bằng nhau → tìm giá trị một phần → tìm mỗi số.',
  learn: [
    { t: 'Ví dụ', h: `<p class="wp">Tổng của hai số là 96. Tỉ số của hai số đó là ${F(3, 5)}. Tìm hai số đó.</p>${vTiSo(5, 3, 'Số lớn', 'Số bé', 'Tổng: 96')}${steps('Tổng số phần bằng nhau: 3 + 5 = 8 (phần)', 'Số bé: 96 : 8 × 3 = 36', 'Số lớn: 96 − 36 = 60', 'Đáp số: 36 và 60.')}` },
    { t: 'Các bước giải', h: `<div class="memo">1. Vẽ sơ đồ đoạn thẳng.<br>2. Tìm <b>tổng số phần</b> bằng nhau.<br>3. Tìm <b>giá trị một phần</b> (tổng : số phần).<br>4. Tìm mỗi số.</div>` }
  ],
  gen() { const p = R(1, 5), q = R(p + 1, 9), u = R(2, 30), tot = (p + q) * u; return pick([
    () => inp(`<p>Tổng hai số là <b>${tot}</b>, tỉ số của số bé và số lớn là ${F(p, q)}. Tìm <b>số bé</b>.</p>${vTiSo(q, p, 'Số lớn', 'Số bé', `Tổng: ${tot}`)}`, p * u, `${tot} : (${p} + ${q}) × ${p} = ${p * u}`),
    () => inp(`<p>Tổng hai số là <b>${tot}</b>, tỉ số của số bé và số lớn là ${F(p, q)}. Tìm <b>số lớn</b>.</p>`, q * u, `${tot} : (${p} + ${q}) × ${q} = ${q * u}`),
    () => { const n1 = pick(NAMES), n2 = pick(NAMES.filter(x => x !== n1)); return inp(`<p class="wp">${n1} và ${n2} có tất cả ${tot} viên bi. Số bi của ${n1} bằng ${F(p, q)} số bi của ${n2}. Hỏi ${n1} có bao nhiêu viên bi?</p>`, p * u, steps(`Tổng số phần: ${p} + ${q} = ${p + q} (phần)`, `Số bi của ${n1}: ${tot} : ${p + q} × ${p} = ${p * u} (viên)`)); }
  ])(); } },

{ id: 'b39', so: 39, title: 'Tìm hai số khi biết hiệu và tỉ số của hai số đó', game: 'fish',
  memo: 'Vẽ sơ đồ → tìm hiệu số phần bằng nhau → tìm giá trị một phần → tìm mỗi số.',
  learn: [
    { t: 'Ví dụ', h: `<p class="wp">Hiệu của hai số là 24. Tỉ số của hai số là ${F(3, 5)}. Tìm hai số đó.</p>${vTiSo(5, 3, 'Số lớn', 'Số bé', 'Hiệu: 24')}${steps('Hiệu số phần bằng nhau: 5 − 3 = 2 (phần)', 'Số bé: 24 : 2 × 3 = 36', 'Số lớn: 36 + 24 = 60', 'Đáp số: 36 và 60.')}` },
    { t: 'Các bước giải', h: `<div class="memo">1. Vẽ sơ đồ.<br>2. Tìm <b>hiệu số phần</b> bằng nhau.<br>3. Tìm giá trị một phần (hiệu : hiệu số phần).<br>4. Tìm mỗi số.</div>` }
  ],
  gen() { const p = R(1, 6), q = R(p + 1, 9), u = R(2, 30), diff = (q - p) * u; return pick([
    () => inp(`<p>Hiệu hai số là <b>${diff}</b>, tỉ số của số bé và số lớn là ${F(p, q)}. Tìm <b>số bé</b>.</p>${vTiSo(q, p, 'Số lớn', 'Số bé', `Hiệu: ${diff}`)}`, p * u, `${diff} : (${q} − ${p}) × ${p} = ${p * u}`),
    () => inp(`<p>Hiệu hai số là <b>${diff}</b>, tỉ số của số bé và số lớn là ${F(p, q)}. Tìm <b>số lớn</b>.</p>`, q * u, `${diff} : (${q} − ${p}) × ${q} = ${q * u}`),
    () => inp(`<p class="wp">Mẹ hơn con ${diff} tuổi. Tuổi con bằng ${F(p, q)} tuổi mẹ. Tính tuổi con.</p>`, p * u, steps(`Hiệu số phần: ${q} − ${p} = ${q - p} (phần)`, `Tuổi con: ${diff} : ${q - p} × ${p} = ${p * u} (tuổi)`))
  ])(); } },

{ id: 'b40', so: 40, title: 'Tìm tỉ số phần trăm của hai số', game: 'balloon',
  memo: 'Tìm thương của hai số, nhân thương với 100 rồi viết thêm kí hiệu %.',
  learn: [
    { t: 'Ví dụ', h: `<p class="wp">Lớp có 25 học sinh, trong đó có 13 bạn nữ. Tìm tỉ số phần trăm của số bạn nữ và số học sinh cả lớp.</p>${steps('13 : 25 = 0,52 = 52%', 'Đáp số: 52%.')}` },
    { t: 'Quy tắc', h: `<div class="memo">Muốn tìm tỉ số phần trăm của a và b: tìm thương a : b, nhân thương đó với 100 và viết thêm kí hiệu % vào bên phải.</div>` }
  ],
  gen() { const b = pick([20, 25, 40, 50, 200, 400, 500]), ok = b / pick([4, 5, 10]) * R(1, 3); return pick([
    () => inp(`<p>Tìm tỉ số phần trăm của <b>${ok}</b> và <b>${b}</b>:</p><p class="eq"><span class="slot">?</span>%</p>`, ok * 100 / b, `${ok} : ${b} = ${fD(ok / b)} = ${ok * 100 / b}%`),
    () => inp(`<p class="wp">Một cửa hàng có ${b} kg gạo, đã bán ${ok} kg. Hỏi cửa hàng đã bán bao nhiêu phần trăm số gạo?</p>`, ok * 100 / b, steps(`${ok} : ${b} = ${fD(ok / b)} = ${ok * 100 / b}%`)),
    () => { const t = pick([20, 25, 40, 50]), d = R(1, t); const v = d * 100 / t; return Number.isInteger(v) ? inp(`<p class="wp">Lớp 5A có ${t} học sinh, có ${d} bạn đạt điểm 10 môn Toán. Số bạn đạt điểm 10 chiếm bao nhiêu phần trăm?</p>`, v, steps(`${d} : ${t} = ${fD(d / t)} = ${v}%`)) : inp(`<p>Tìm tỉ số phần trăm của <b>${t / 2}</b> và <b>${t}</b>.</p>`, 50, `${t / 2} : ${t} = 0,5 = 50%`); }
  ])(); } },

{ id: 'b41', so: 41, title: 'Tìm giá trị phần trăm của một số', game: 'balloon',
  memo: 'Muốn tìm p% của một số, lấy số đó nhân với p rồi chia cho 100.',
  learn: [
    { t: 'Ví dụ', h: `<p class="wp">Một trường có 800 học sinh, số học sinh nữ chiếm 52%. Tính số học sinh nữ.</p>${steps('800 × 52 : 100 = 416 (học sinh)', 'Đáp số: 416 học sinh.')}` },
    { t: 'Tiền lãi tiết kiệm', h: `<p>Lãi suất 0,5% một tháng. Gửi ${fN(1000000)} đồng thì sau một tháng được lãi: ${fN(1000000)} × 0,5 : 100 = ${fN(5000)} (đồng).</p>` }
  ],
  gen() { const p = pick([10, 20, 25, 30, 40, 50, 60, 75, 15, 5]), N = R(2, 40) * 20; return pick([
    () => inp(`<p>Tìm <b>${p}%</b> của <b>${N}</b>.</p>`, N * p / 100, `${N} × ${p} : 100 = ${N * p / 100}`),
    () => inp(`<p class="wp">Một trường có ${N} học sinh, số học sinh tham gia câu lạc bộ cờ vua chiếm ${p}%. Hỏi có bao nhiêu học sinh tham gia câu lạc bộ cờ vua?</p>`, N * p / 100, steps(`${N} × ${p} : 100 = ${N * p / 100} (học sinh)`)),
    () => { const price = R(2, 50) * 10000; return inp(`<p class="wp">Một chiếc cặp giá ${fN(price)} đồng, nay được giảm giá ${p}%. Hỏi được giảm bao nhiêu tiền?</p>`, price * p / 100, steps(`${fN(price)} × ${p} : 100 = ${fN(price * p / 100)} (đồng)`)); }
  ])(); } },

{ id: 'b44', so: 44, title: 'Luyện tập chung', game: 'race', mix: ['b36', 'b37', 'b38', 'b39', 'b40', 'b41'] }
]},

{ id: 'c8', no: 8, name: 'Thể tích. Đơn vị đo thể tích', hue: 2, lessons: [
{ id: 'b45', so: 45, title: 'Thể tích của một hình', game: 'fish',
  memo: 'Hình nào gồm nhiều hình lập phương nhỏ (bằng nhau) hơn thì có thể tích lớn hơn.',
  learn: [
    { t: 'So sánh thể tích', h: `${vBox3d(4, 2, 3)}<p>Hình hộp chữ nhật được xếp bởi các hình lập phương nhỏ bằng nhau. Đếm số hình lập phương nhỏ để so sánh <b>thể tích</b>.</p>` },
    { t: 'Đếm theo lớp', h: `<p>Mỗi lớp có 4 × 2 = 8 hình lập phương nhỏ. Có 3 lớp: 8 × 3 = <b>24</b> hình lập phương nhỏ.</p><div class="memo">Hình A gồm nhiều hình lập phương nhỏ hơn hình B thì thể tích hình A lớn hơn thể tích hình B.</div>` }
  ],
  gen() { const a = R(2, 6), b = R(2, 4), c = R(2, 5); return pick([
    () => inp(`<p>Một hình hộp chữ nhật được xếp bởi các hình lập phương nhỏ: mỗi lớp có ${a} hàng, mỗi hàng ${b} hình; có ${c} lớp. Hình đó gồm bao nhiêu hình lập phương nhỏ?</p>${vBox3d(a, b, c, 'hình')}`, a * b * c, `${a} × ${b} × ${c} = ${a * b * c}`),
    () => { const x = a * b * c, y = x + pick([-3, 2, 5, 0]) || x + 1; return mc(`<p>Hình A gồm <b>${x}</b> hình lập phương nhỏ, hình B gồm <b>${y}</b> hình lập phương nhỏ (cùng kích thước). So sánh thể tích:</p>`, x > y ? 'Thể tích hình A lớn hơn' : x < y ? 'Thể tích hình B lớn hơn' : 'Bằng nhau', ['Thể tích hình A lớn hơn', 'Thể tích hình B lớn hơn', 'Bằng nhau'], 'Hình nào có nhiều hình lập phương nhỏ hơn thì thể tích lớn hơn.'); }
  ])(); } },

{ id: 'b46', so: 46, title: 'Xăng-ti-mét khối. Đề-xi-mét khối', game: 'balloon',
  memo: '1 dm³ = 1000 cm³; 1 dm³ = 1 lít.',
  learn: [
    { t: 'Xăng-ti-mét khối', h: `${vBox3d(1, 1, 1, 'cm', true)}<p>Thể tích hình lập phương cạnh 1 cm là <b>1 xăng-ti-mét khối</b>, viết là <b class="hl">1 cm³</b>.</p>` },
    { t: 'Đề-xi-mét khối', h: `<p>Thể tích hình lập phương cạnh 1 dm là <b>1 đề-xi-mét khối</b> (1 dm³). Hình lập phương đó gồm 10 × 10 × 10 = ${fN(1000)} hình lập phương 1 cm³.</p><div class="memo">1 dm³ = ${fN(1000)} cm³ · 1 dm³ = 1 lít</div>` }
  ],
  gen() { const k = R(2, 20); return pick([
    () => { const c = pick([[`${k} dm³`, 'cm³', k * 1000], [`${fN(k * 1000)} cm³`, 'dm³', k], [`${k} dm³`, 'lít', k], [`${k} lít`, 'cm³', k * 1000]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${fN(c[2])} ${c[1]}`); },
    () => { const x = randD(1, 9, 1); return inp(`<p class="eq">${fD(x)} dm³ = <span class="slot">?</span> cm³</p>`, Math.round(x * 1000), `${fD(x)} × 1000 = ${fN(Math.round(x * 1000))}`); },
    () => { const c = pick([['Thể tích một viên xúc xắc khoảng 1', 'cm³'], ['Thể tích một hộp sữa giấy khoảng 1', 'dm³'], ['Thể tích một bể nước khoảng 2', 'm³']]); return mc(`<p>Chọn đơn vị thích hợp:</p><p class="wp">${c[0]} <span class="slot">?</span></p>`, c[1], ['cm³', 'dm³', 'm³'], `${c[0]} ${c[1]}.`); }
  ])(); } },

{ id: 'b47', so: 47, title: 'Mét khối', game: 'race',
  memo: '1 m³ = 1000 dm³ = 1 000 000 cm³.',
  learn: [
    { t: 'Mét khối', h: `<p>Thể tích hình lập phương cạnh 1 m là <b>1 mét khối</b>, viết là <b class="hl">1 m³</b>.</p><p class="eq">1 m³ = ${fN(1000)} dm³ = ${fN(1000000)} cm³</p>` },
    { t: 'Bảng đơn vị đo thể tích', h: `<div class="scrollx"><table class="tbl"><tr><th>m³</th><th>dm³</th><th>cm³</th></tr><tr><td>1 m³ = 1000 dm³</td><td>1 dm³ = 1000 cm³</td><td>1 cm³</td></tr></table></div><div class="memo">Mỗi đơn vị đo thể tích gấp <b>1000 lần</b> đơn vị bé hơn tiếp liền.</div>` }
  ],
  gen() { const k = R(2, 15); return pick([
    () => { const c = pick([[`${k} m³`, 'dm³', k * 1000], [`${k} m³`, 'cm³', k * 1e6], [`${fN(k * 1000)} dm³`, 'm³', k]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${fN(c[2])} ${c[1]}`); },
    () => { const x = randD(1, 9, 2); return inp(`<p class="eq">${fD(x)} m³ = <span class="slot">?</span> dm³</p>`, Math.round(x * 1000), `${fD(x)} × 1000 = ${fN(Math.round(x * 1000))}`); },
    () => { const d = R(1, 999); return dq(`<p class="eq">${d} dm³ = <span class="slot">?</span> m³</p>`, d / 1000, `${d} : 1000 = ${fD(d / 1000)}`); }
  ])(); } },

{ id: 'b48', so: 48, title: 'Luyện tập chung', game: 'fish', mix: ['b45', 'b46', 'b47'] }
]},

{ id: 'c9', no: 9, name: 'Diện tích và thể tích của một số hình khối', hue: 3, lessons: [
{ id: 'b49', so: 49, title: 'Hình khai triển của hình lập phương, hình hộp chữ nhật và hình trụ', game: 'balloon',
  memo: 'Hình lập phương có 6 mặt là hình vuông bằng nhau; hình hộp chữ nhật có 6 mặt là hình chữ nhật.',
  learn: [
    { t: 'Hình khai triển hình lập phương', h: `${vNet()}<p>“Mở” hình lập phương ra ta được <b>6 hình vuông</b> bằng nhau.</p>` },
    { t: 'Hình hộp chữ nhật và hình trụ', h: `${vBox3d(5, 3, 2)}<p>Hình hộp chữ nhật có <b>6 mặt</b>, <b>12 cạnh</b>, <b>8 đỉnh</b>.</p><p>Hình khai triển của hình trụ gồm <b>1 hình chữ nhật</b> (mặt xung quanh) và <b>2 hình tròn</b> (hai mặt đáy).</p>` }
  ],
  gen() { return pick([
    () => pick([inp('<p>Hình lập phương có mấy mặt?</p>' + vBox3d(3, 3, 3, 'cm', true), 6, '6 mặt là hình vuông.'), inp('<p>Hình hộp chữ nhật có mấy cạnh?</p>' + vBox3d(5, 3, 2), 12, '12 cạnh.'), inp('<p>Hình hộp chữ nhật có mấy đỉnh?</p>', 8, '8 đỉnh.')]),
    () => mc('<p>Hình khai triển của hình trụ gồm:</p>', '1 hình chữ nhật và 2 hình tròn', ['1 hình chữ nhật và 2 hình tròn', '6 hình vuông', '2 hình chữ nhật và 1 hình tròn', '3 hình tròn'], 'Mặt xung quanh là hình chữ nhật, hai đáy là hình tròn.'),
    () => mc(`<p>Hình dưới đây là hình khai triển của hình nào?</p>${vNet()}`, 'Hình lập phương', ['Hình lập phương', 'Hình trụ', 'Hình tam giác', 'Hình thang'], 'Gồm 6 hình vuông bằng nhau.')
  ])(); } },

{ id: 'b50', so: 50, title: 'Diện tích xung quanh và diện tích toàn phần của hình hộp chữ nhật', game: 'race',
  memo: 'Sxq = (a + b) × 2 × c; Stp = Sxq + a × b × 2.',
  learn: [
    { t: 'Diện tích xung quanh', h: `${vBox3d(5, 3, 4)}<div class="memo"><b>S<sub>xq</sub> = chu vi đáy × chiều cao = (a + b) × 2 × c</b></div><p>(5 + 3) × 2 × 4 = <b>64 cm²</b>.</p>` },
    { t: 'Diện tích toàn phần', h: `<div class="memo"><b>S<sub>tp</sub> = S<sub>xq</sub> + diện tích hai đáy</b></div><p>Hai đáy: 5 × 3 × 2 = 30 (cm²). S<sub>tp</sub> = 64 + 30 = <b>94 cm²</b>.</p>` }
  ],
  gen() { const a = R(4, 15), b = R(2, a - 1), c = R(2, 12); const sxq = (a + b) * 2 * c, stp = sxq + 2 * a * b; return pick([
    () => inp(`<p>Tính <b>diện tích xung quanh</b> hình hộp chữ nhật (cm²):</p>${vBox3d(a, b, c)}`, sxq, `(${a} + ${b}) × 2 × ${c} = ${sxq} (cm²)`),
    () => inp(`<p>Tính <b>diện tích toàn phần</b> hình hộp chữ nhật (cm²):</p>${vBox3d(a, b, c)}`, stp, `S<sub>xq</sub> = ${sxq}; hai đáy = ${a} × ${b} × 2 = ${2 * a * b}; S<sub>tp</sub> = ${stp} (cm²)`),
    () => inp(`<p class="wp">Một cái hộp không nắp hình hộp chữ nhật dài ${a} dm, rộng ${b} dm, cao ${c} dm. Tính diện tích tôn dùng làm hộp (dm²).</p>`, sxq + a * b, steps(`S<sub>xq</sub>: (${a} + ${b}) × 2 × ${c} = ${sxq} (dm²)`, `Một đáy: ${a} × ${b} = ${a * b} (dm²)`, `Tôn cần dùng: ${sxq} + ${a * b} = ${sxq + a * b} (dm²)`))
  ])(); } },

{ id: 'b51', so: 51, title: 'Diện tích xung quanh và diện tích toàn phần của hình lập phương', game: 'fish',
  memo: 'Sxq = a × a × 4; Stp = a × a × 6.',
  learn: [
    { t: 'Công thức', h: `${vBox3d(5, 5, 5, 'cm', true)}<div class="memo"><b>S<sub>xq</sub> = a × a × 4</b><br><b>S<sub>tp</sub> = a × a × 6</b></div><p>Cạnh 5 cm: S<sub>xq</sub> = 5 × 5 × 4 = 100 (cm²); S<sub>tp</sub> = 5 × 5 × 6 = 150 (cm²).</p>` }
  ],
  gen() { const a = R(2, 15); return pick([
    () => inp(`<p>Hình lập phương cạnh ${a} cm. Tính <b>diện tích xung quanh</b> (cm²).</p>${vBox3d(a, a, a, 'cm', true)}`, a * a * 4, `${a} × ${a} × 4 = ${a * a * 4} (cm²)`),
    () => inp(`<p>Hình lập phương cạnh ${a} cm. Tính <b>diện tích toàn phần</b> (cm²).</p>${vBox3d(a, a, a, 'cm', true)}`, a * a * 6, `${a} × ${a} × 6 = ${a * a * 6} (cm²)`),
    () => { const x = randD(1, 5, 1); return dq(`<p>Hình lập phương cạnh ${fD(x)} m. Tính diện tích toàn phần (m²).</p>`, x * x * 6, `${fD(x)} × ${fD(x)} × 6 = ${fD(rnd(x * x * 6))} (m²)`); }
  ])(); } },

{ id: 'b52', so: 52, title: 'Thể tích của hình hộp chữ nhật', game: 'balloon',
  memo: 'V = a × b × c (cùng đơn vị đo).',
  learn: [
    { t: 'Công thức', h: `${vBox3d(5, 3, 4)}<div class="memo"><b>V = a × b × c</b><br>Muốn tính thể tích hình hộp chữ nhật, ta lấy chiều dài nhân với chiều rộng rồi nhân với chiều cao (cùng đơn vị đo).</div><p>V = 5 × 3 × 4 = <b>60 cm³</b>.</p>` }
  ],
  gen() { const a = R(3, 15), b = R(2, a), c = R(2, 12); return pick([
    () => inp(`<p>Tính thể tích hình hộp chữ nhật (cm³):</p>${vBox3d(a, b, c)}`, a * b * c, `${a} × ${b} × ${c} = ${a * b * c} (cm³)`),
    () => { const x = randD(1, 3, 1), y = randD(1, 2, 1), z = R(1, 3); return dq(`<p class="wp">Một bể nước hình hộp chữ nhật dài ${fD(x)} m, rộng ${fD(y)} m, cao ${z} m. Tính thể tích bể (m³).</p>`, x * y * z, steps(`${fD(x)} × ${fD(y)} × ${z} = ${fD(rnd(x * y * z))} (m³)`)); },
    () => inp(`<p class="wp">Một bể cá dài ${a} dm, rộng ${b} dm, cao ${c} dm. Bể chứa được nhiều nhất bao nhiêu lít nước? (1 dm³ = 1 l)</p>`, a * b * c, steps(`${a} × ${b} × ${c} = ${a * b * c} (dm³) = ${a * b * c} l`))
  ])(); } },

{ id: 'b53', so: 53, title: 'Thể tích của hình lập phương', game: 'race',
  memo: 'V = a × a × a.',
  learn: [
    { t: 'Công thức', h: `${vBox3d(3, 3, 3, 'cm', true)}<div class="memo"><b>V = a × a × a</b></div><p>Cạnh 3 cm: V = 3 × 3 × 3 = <b>27 cm³</b>.</p>` }
  ],
  gen() { const a = R(2, 12); return pick([
    () => inp(`<p>Tính thể tích hình lập phương cạnh ${a} cm (cm³).</p>${vBox3d(a, a, a, 'cm', true)}`, a * a * a, `${a} × ${a} × ${a} = ${a ** 3} (cm³)`),
    () => { const x = randD(1, 4, 1); return dq(`<p>Hình lập phương cạnh ${fD(x)} dm. Tính thể tích (dm³).</p>`, x ** 3, `${fD(x)} × ${fD(x)} × ${fD(x)} = ${fD(rnd(x ** 3))} (dm³)`); },
    () => inp(`<p>Hình lập phương có thể tích ${a ** 3} cm³. Cạnh của hình lập phương dài bao nhiêu xăng-ti-mét?</p>`, a, `${a} × ${a} × ${a} = ${a ** 3}`)
  ])(); } },

{ id: 'b55', so: 55, title: 'Luyện tập chung', game: 'fish', mix: ['b49', 'b50', 'b51', 'b52', 'b53'] }
]},

{ id: 'c10', no: 10, name: 'Số đo thời gian. Vận tốc. Chuyển động đều', hue: 4, lessons: [
{ id: 'b56', so: 56, title: 'Các đơn vị đo thời gian', game: 'balloon',
  memo: '1 thế kỉ = 100 năm; 1 năm = 12 tháng; 1 ngày = 24 giờ; 1 giờ = 60 phút; 1 phút = 60 giây.',
  learn: [
    { t: 'Bảng đơn vị đo thời gian', h: `<div class="scrollx"><table class="tbl"><tr><td>1 thế kỉ = 100 năm</td><td>1 năm = 12 tháng</td></tr><tr><td>1 năm = 365 ngày</td><td>Năm nhuận = 366 ngày</td></tr><tr><td>1 tuần = 7 ngày</td><td>1 ngày = 24 giờ</td></tr><tr><td>1 giờ = 60 phút</td><td>1 phút = 60 giây</td></tr></table></div>` },
    { t: 'Đổi đơn vị', h: `<p class="eq">1,5 giờ = 90 phút &nbsp; ${F(3, 4)} giờ = 45 phút</p><p class="eq">180 phút = 3 giờ &nbsp; 2 năm rưỡi = 30 tháng</p>` }
  ],
  gen() { const k = R(2, 9); return pick([
    () => { const c = pick([[`${k} giờ`, 'phút', k * 60], [`${k} năm`, 'tháng', k * 12], [`${k} ngày`, 'giờ', k * 24], [`${k} phút`, 'giây', k * 60], [`${k * 60} phút`, 'giờ', k], [`${k} thế kỉ`, 'năm', k * 100]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${c[2]} ${c[1]}`); },
    () => { const c = pick([['1,5 giờ', 'phút', 90], ['2,5 giờ', 'phút', 150], ['0,5 giờ', 'phút', 30], ['1,5 năm', 'tháng', 18], ['0,25 giờ', 'phút', 15]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${c[2]} ${c[1]}`); },
    () => { const m = pick([30, 45, 15, 90, 150, 12, 6]); return dq(`<p class="eq">${m} phút = <span class="slot">?</span> giờ</p>`, m / 60, `${m} : 60 = ${fD(m / 60)} (giờ)`); }
  ])(); } },

{ id: 'b57', so: 57, title: 'Cộng, trừ số đo thời gian', game: 'fish',
  memo: 'Cộng (trừ) theo từng loại đơn vị. Số phút từ 60 trở lên thì đổi sang giờ.',
  learn: [
    { t: 'Cộng số đo thời gian', h: `<p class="eq">2 giờ 35 phút + 1 giờ 40 phút = 3 giờ 75 phút = <b>4 giờ 15 phút</b></p><p>75 phút = 1 giờ 15 phút.</p>` },
    { t: 'Trừ số đo thời gian', h: `<p class="eq">5 giờ 20 phút − 2 giờ 45 phút = 4 giờ 80 phút − 2 giờ 45 phút = <b>2 giờ 35 phút</b></p><div class="memo">Nếu số phút ở số bị trừ bé hơn, đổi 1 giờ = 60 phút rồi trừ.</div>` }
  ],
  gen() { const h1 = R(1, 6), m1 = R(1, 11) * 5, h2 = R(1, 5), m2 = R(1, 11) * 5; return pick([
    () => { const t = (h1 + h2) * 60 + m1 + m2, a = hm(Math.floor(t / 60), t % 60); return { ...mc(`<p class="eq">${hm(h1, m1)} + ${hm(h2, m2)} = <span class="slot">?</span></p>`, a, [a, hm(h1 + h2, m1 + m2 >= 60 ? m1 + m2 : (m1 + m2 + 10) % 60), hm(h1 + h2 + 1, (m1 + m2) % 60 + 5), hm(Math.floor(t / 60) - 1, t % 60)]), exact: true, ex: `${h1 + h2} giờ ${m1 + m2} phút${m1 + m2 >= 60 ? ` = ${a}` : ''}` }; },
    () => { const A = (h1 + h2 + 1) * 60 + m1, B = h2 * 60 + m2, t = A - B, a = hm(Math.floor(t / 60), t % 60); return { ...mc(`<p class="eq">${hm(Math.floor(A / 60), A % 60)} − ${hm(h2, m2)} = <span class="slot">?</span></p>`, a, [a, hm(Math.floor(t / 60) + 1, t % 60), hm(Math.floor(t / 60), (t % 60 + 20) % 60 || 10), hm(Math.abs(Math.floor(A / 60) - h2), Math.abs(A % 60 - m2))]), exact: true, ex: `${hm(Math.floor(A / 60), A % 60)} − ${hm(h2, m2)} = ${a}` }; },
    () => { const s = R(6, 9), d = R(1, 11) * 5 + 60 * R(0, 2); const e = s * 60 + 30 + d; return inp(`<p class="wp">Bạn Nam bắt đầu làm bài lúc ${s} giờ 30 phút và làm xong lúc ${hm(Math.floor(e / 60), e % 60)}. Hỏi bạn làm bài hết bao nhiêu phút?</p>`, d, `${e - s * 60 - 30} phút`); }
  ])(); } },

{ id: 'b58', so: 58, title: 'Nhân, chia số đo thời gian với một số', game: 'race',
  memo: 'Nhân (chia) từng số đo theo từng đơn vị; đổi phút ≥ 60 thành giờ.',
  learn: [
    { t: 'Nhân', h: `<p class="eq">1 giờ 25 phút × 3 = 3 giờ 75 phút = <b>4 giờ 15 phút</b></p>` },
    { t: 'Chia', h: `<p class="eq">7 giờ 30 phút : 3 = <b>2 giờ 30 phút</b></p><p>7 giờ chia 3 được 2 giờ, dư 1 giờ = 60 phút; 60 + 30 = 90 phút; 90 : 3 = 30 phút.</p>` }
  ],
  gen() { const h = R(1, 4), m = R(1, 11) * 5, k = R(2, 5); return pick([
    () => { const t = (h * 60 + m) * k, a = hm(Math.floor(t / 60), t % 60); return { ...mc(`<p class="eq">${hm(h, m)} × ${k} = <span class="slot">?</span></p>`, a, [a, hm(h * k, m), hm(h * k, (m * k) % 60), hm(Math.floor(t / 60) + 1, t % 60)]), exact: true, ex: `${h * k} giờ ${m * k} phút = ${a}` }; },
    () => { const q = R(1, 3) * 60 + R(1, 11) * 5, t = q * k, a = hm(Math.floor(q / 60), q % 60); return { ...mc(`<p class="eq">${hm(Math.floor(t / 60), t % 60)} : ${k} = <span class="slot">?</span></p>`, a, [a, hm(Math.floor(q / 60) + 1, q % 60), hm(Math.floor(q / 60), (q % 60 + 15) % 60 || 5), hm(Math.floor(t / 60 / k), (t % 60) / k | 0)]), exact: true, ex: `${t} phút : ${k} = ${q} phút = ${a}` }; },
    () => { const per = R(5, 15); return inp(`<p class="wp">Một người thợ làm một sản phẩm hết ${per} phút. Hỏi làm ${k * 2} sản phẩm hết bao nhiêu phút?</p>`, per * k * 2, `${per} × ${k * 2} = ${per * k * 2} (phút)`); }
  ])(); } },

{ id: 'b59', so: 59, title: 'Vận tốc của một chuyển động đều', game: 'race',
  memo: 'v = s : t. Đơn vị: km/giờ, m/phút, m/giây.',
  learn: [
    { t: 'Vận tốc', h: `${vRoad('s = 170 km', 't = 4 giờ')}<p class="wp">Một ô tô đi quãng đường 170 km hết 4 giờ. Trung bình mỗi giờ ô tô đi được: 170 : 4 = 42,5 (km).</p><p>Ta nói <b>vận tốc</b> của ô tô là <b>42,5 km/giờ</b>.</p>` },
    { t: 'Công thức', h: `<div class="memo"><b>v = s : t</b><br>Muốn tính vận tốc, ta lấy quãng đường chia cho thời gian.</div><p class="tip">Người đi bộ khoảng 5 km/giờ, xe đạp khoảng 15 km/giờ, ô tô khoảng 50 km/giờ.</p>` }
  ],
  gen() { const v = R(4, 60), t = R(2, 6); return pick([
    () => inp(`<p>Quãng đường ${v * t} km, thời gian ${t} giờ. Tính vận tốc (km/giờ).</p>${vRoad(`s = ${v * t} km`, `t = ${t} giờ`)}`, v, `v = ${v * t} : ${t} = ${v} (km/giờ)`),
    () => { const s = R(2, 9) * 100, sec = pick([50, 100, 200]); return dq(`<p class="wp">Một vận động viên chạy ${s} m hết ${sec} giây. Tính vận tốc (m/giây).</p>`, s / sec, steps(`${s} : ${sec} = ${fD(s / sec)} (m/giây)`)); },
    () => { const s = R(10, 60), t2 = pick([0.5, 1.5, 2.5]); return dq(`<p class="wp">Một người đi xe đạp được ${fD(s * t2)} km trong ${fD(t2)} giờ. Tính vận tốc (km/giờ).</p>`, s, steps(`${fD(s * t2)} : ${fD(t2)} = ${s} (km/giờ)`)); }
  ])(); } },

{ id: 'b60', so: 60, title: 'Quãng đường, thời gian của một chuyển động đều', game: 'fish',
  memo: 's = v × t; t = s : v.',
  learn: [
    { t: 'Quãng đường', h: `<div class="memo"><b>s = v × t</b></div><p>Ô tô đi với vận tốc 42 km/giờ trong 3 giờ: s = 42 × 3 = <b>126 km</b>.</p>` },
    { t: 'Thời gian', h: `<div class="memo"><b>t = s : v</b></div><p>Đi 120 km với vận tốc 40 km/giờ: t = 120 : 40 = <b>3 giờ</b>.</p><p class="tip">Nhớ đổi các đại lượng về cùng hệ đơn vị trước khi tính.</p>` }
  ],
  gen() { const v = R(4, 60), t = R(2, 6); return pick([
    () => inp(`<p>Vận tốc ${v} km/giờ, thời gian ${t} giờ. Tính quãng đường (km).</p>${vRoad(`v = ${v} km/giờ`, `t = ${t} giờ`)}`, v * t, `s = ${v} × ${t} = ${v * t} (km)`),
    () => inp(`<p>Quãng đường ${v * t} km, vận tốc ${v} km/giờ. Tính thời gian (giờ).</p>`, t, `t = ${v * t} : ${v} = ${t} (giờ)`),
    () => { const t2 = pick([1.5, 2.5, 0.5, 1.25]); return dq(`<p class="wp">Một ca nô đi với vận tốc ${v} km/giờ trong ${fD(t2)} giờ. Tính quãng đường ca nô đi được (km).</p>`, v * t2, steps(`${v} × ${fD(t2)} = ${fD(rnd(v * t2))} (km)`)); },
    () => { const mins = pick([30, 45, 90, 15]); const vv = pick([12, 20, 40, 60]); return dq(`<p class="wp">Một người đi xe máy với vận tốc ${vv} km/giờ trong ${mins} phút. Tính quãng đường (km).</p>`, vv * mins / 60, steps(`${mins} phút = ${fD(mins / 60)} giờ`, `${vv} × ${fD(mins / 60)} = ${fD(rnd(vv * mins / 60))} (km)`)); }
  ])(); } },

{ id: 'b62', so: 62, title: 'Luyện tập chung', game: 'race', mix: ['b56', 'b57', 'b58', 'b59', 'b60'] }
]},

{ id: 'c11', no: 11, name: 'Một số yếu tố thống kê và xác suất', hue: 5, lessons: [
{ id: 'b63', so: 63, title: 'Thu thập, phân loại, sắp xếp các số liệu', game: 'fish',
  memo: 'Sắp xếp dãy số liệu theo thứ tự để dễ tìm số lớn nhất, bé nhất và so sánh.',
  learn: [
    { t: 'Dãy số liệu', h: `<p>Cân nặng (kg) của 6 bạn: <b class="eq">32; 28; 35; 30; 28; 33</b></p><p>Sắp xếp từ bé đến lớn: 28; 28; 30; 32; 33; 35.</p><p>Có <b>2</b> bạn cùng nặng 28 kg; bạn nặng nhất 35 kg.</p>` },
    { t: 'Phân loại', h: `<div class="memo">Thu thập số liệu → phân loại theo nhóm → sắp xếp → đọc, nhận xét số liệu.</div>` }
  ],
  gen() { const n = R(6, 8); const data = Array.from({ length: n }, () => R(25, 40)); const show = `<p>Cân nặng (kg) của một số bạn lớp 5A: <b class="eq">${data.join('; ')}</b></p>`; const sorted = [...data].sort((a, b) => a - b); return pick([
    () => { const k = R(1, n); return inp(`${show}<p>Sắp xếp dãy số liệu từ bé đến lớn thì số thứ <b>${k}</b> là bao nhiêu?</p>`, sorted[k - 1], `Dãy đã sắp xếp: ${sorted.join('; ')}.`); },
    () => { const lim = R(28, 36); const c = data.filter(x => x >= lim).length; return inp(`${show}<p>Có bao nhiêu bạn nặng từ <b>${lim} kg</b> trở lên?</p>`, c, `Đếm các số ≥ ${lim}: ${c} bạn.`); },
    () => inp(`${show}<p>Bạn nặng nhất hơn bạn nhẹ nhất bao nhiêu ki-lô-gam?</p>`, sorted[n - 1] - sorted[0], `${sorted[n - 1]} − ${sorted[0]} = ${sorted[n - 1] - sorted[0]} (kg)`)
  ])(); } },

{ id: 'b64', so: 64, title: 'Biểu đồ hình quạt tròn', game: 'balloon',
  memo: 'Cả hình tròn là 100%. Mỗi hình quạt cho biết tỉ số phần trăm của một nhóm.',
  learn: [
    { t: 'Đọc biểu đồ', h: `${vPieChart([{ label: 'Bơi', p: 40 }, { label: 'Bóng đá', p: 25 }, { label: 'Cầu lông', p: 20 }, { label: 'Cờ vua', p: 15 }], 'Môn thể thao yêu thích')}<p>40% số học sinh thích bơi — nhiều nhất.</p>` },
    { t: 'Tính số lượng', h: `<p>Nếu lớp có 40 học sinh thì số bạn thích bơi là: 40 × 40 : 100 = <b>16</b> (bạn).</p><div class="memo">Tổng các tỉ số phần trăm trên biểu đồ hình quạt luôn bằng <b>100%</b>.</div>` }
  ],
  gen() { const sets = [[40, 25, 20, 15], [50, 25, 15, 10], [35, 30, 20, 15], [45, 30, 15, 10], [30, 30, 25, 15]]; const ps = shuffle(pick(sets)); const lb = ['Bơi', 'Bóng đá', 'Cầu lông', 'Cờ vua']; const rows = lb.map((l, i) => ({ label: l, p: ps[i] })); const ch = vPieChart(rows, 'Môn thể thao yêu thích của lớp 5A'); const N = pick([20, 40, 60, 80]); return pick([
    () => { const i = R(0, 3); return inp(`${ch}<p>Số học sinh thích <b>${lb[i].toLowerCase()}</b> chiếm bao nhiêu phần trăm?</p>`, ps[i], `Đọc trên biểu đồ: ${ps[i]}%.`); },
    () => { const i = R(0, 3); const v = N * ps[i] / 100; return Number.isInteger(v) ? inp(`${ch}<p>Lớp có ${N} học sinh. Có bao nhiêu bạn thích <b>${lb[i].toLowerCase()}</b>?</p>`, v, `${N} × ${ps[i]} : 100 = ${v}`) : inp(`${ch}<p>Lớp có 100 học sinh. Có bao nhiêu bạn thích <b>${lb[i].toLowerCase()}</b>?</p>`, ps[i], `100 × ${ps[i]} : 100 = ${ps[i]}`); },
    () => { const m = Math.max(...ps); const i = ps.indexOf(m); return mc(`${ch}<p>Môn nào được yêu thích <b>nhiều nhất</b>?</p>`, lb[i], lb, `${lb[i]}: ${m}%.`); },
    () => inp('<p>Tổng các tỉ số phần trăm trên một biểu đồ hình quạt tròn bằng bao nhiêu phần trăm?</p>', 100, 'Cả hình tròn ứng với 100%.')
  ])(); } },

{ id: 'b65', so: 65, title: 'Tỉ số của số lần lặp lại của một sự kiện so với tổng số lần thực hiện', game: 'race',
  memo: 'Tỉ số = số lần sự kiện xảy ra : tổng số lần thực hiện.',
  learn: [
    { t: 'Ví dụ', h: `<p>Tung đồng xu 40 lần, mặt sấp xuất hiện 22 lần.</p><p>Tỉ số của số lần xuất hiện mặt sấp so với tổng số lần tung là <b>22 : 40</b> hay ${F(22, 40)} = ${F(11, 20)}.</p>` },
    { t: 'Ghi nhớ', h: `<div class="memo">Tỉ số của số lần lặp lại một sự kiện so với tổng số lần thực hiện = <b>số lần xảy ra : tổng số lần</b>.</div>` }
  ],
  gen() { const N = pick([20, 30, 40, 50]), k = R(5, N - 5); return pick([
    () => fq(`<p>Tung đồng xu ${N} lần, mặt ngửa xuất hiện ${k} lần. Tỉ số của số lần xuất hiện mặt ngửa so với tổng số lần tung là:</p>`, `${k}/${N}`, `${k} : ${N} = ${F(k, N)}`, { mc: true }),
    () => inp(`<p>Gieo xúc xắc ${N} lần, mặt 6 chấm xuất hiện ${k} lần. Có bao nhiêu lần <b>không</b> xuất hiện mặt 6 chấm?</p>`, N - k, `${N} − ${k} = ${N - k}`),
    () => { const t = pick([10, 20, 25, 50]), r = R(1, t - 1); return inp(`<p>Lấy bóng từ hộp ${t} lần (có trả lại), được bóng đỏ ${r} lần. Tỉ số số lần lấy được bóng đỏ so với tổng số lần là bao nhiêu phần trăm?</p><p class="eq"><span class="slot">?</span>%</p>`, r * 100 / t, `${r} : ${t} = ${fD(r / t)} = ${r * 100 / t}%`); }
  ])(); } },

{ id: 'b67', so: 67, title: 'Luyện tập chung', game: 'balloon', mix: ['b63', 'b64', 'b65'] }
]},

{ id: 'c12', no: 12, name: 'Ôn tập cuối năm', hue: 7, lessons: [
{ id: 'on2', so: '68–75', title: 'Ôn tập cuối năm', game: 'race', mixTopics: ['c1', 'c2', 'c4', 'c5', 'c7', 'c8', 'c9', 'c10', 'c11'] }
]}
]}
];

/* Gắn bài luyện tập chung / ôn tập */
BOOK.forEach(t => t.topics.forEach(tp => tp.lessons.forEach(l => { BYID_RAW[l.id] = l; l.topicRef = tp; })));
BOOK.forEach(t => t.topics.forEach(tp => tp.lessons.forEach(l => {
  let ids = null;
  if (l.mix) ids = l.mix;
  if (l.mixTopics) ids = BOOK.flatMap(b => b.topics).filter(x => l.mixTopics.includes(x.id)).flatMap(x => x.lessons).filter(x => !x.mix && !x.mixTopics).map(x => x.id);
  if (!ids) return;
  l.mixIds = ids;
  l.gen = () => BYID_RAW[pick(ids)].gen();
  l.memo = 'Ôn lại các bài đã học.';
  l.learn = [{ t: 'Nhớ lại kiến thức', h: `<p>Trong phần này con sẽ ôn lại:</p>${memoList(l.mixIds.slice(0, 10))}${l.mixIds.length > 10 ? `<p class="tip">… và ${l.mixIds.length - 10} bài khác.</p>` : ''}` }];
})));
