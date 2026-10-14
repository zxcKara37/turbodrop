/* ================= Геометрия деталей =================
   Точка: [x,y] острый угол | [x,y,r] скруглённый | ["q",cx,cy,x,y] | ["c",c1x,c1y,c2x,c2y,x,y]
   Первая точка контура всегда обычная. Деталь строится в локальных координатах (u — вдоль оси, v — поперёк),
   затем переносится в мировые преобразованием {x,y,a,k}. */
const T0 = { x: 0, y: 0, a: 0, k: 1 };
function tfPt(t, u, v) { const c = Math.cos(t.a), s = Math.sin(t.a); return [t.x + t.k * (u * c - v * s), t.y + t.k * (u * s + v * c)] }
function tfCompose(outer, inner) { const [x, y] = tfPt(outer, inner.x, inner.y); return { x, y, a: outer.a + inner.a, k: outer.k * inner.k } }
function mapPts(pts, t) {
  return pts.map(p => {
    if (p[0] === "q") return ["q", ...tfPt(t, p[1], p[2]), ...tfPt(t, p[3], p[4])];
    if (p[0] === "c") return ["c", ...tfPt(t, p[1], p[2]), ...tfPt(t, p[3], p[4]), ...tfPt(t, p[5], p[6])];
    const q = tfPt(t, p[0], p[1]); return p.length > 2 ? [q[0], q[1], p[2] * t.k] : q;
  });
}
class Sh {
  // pts — внешний контур, holes — вырезы (evenodd), fr — рамка для обтекания {u0,v0,w,h} в локальных координатах
  constructor(pts, o = {}) { this.pts = pts; this.holes = o.holes || []; this.fr = o.fr || null; this.t = o.t || T0 }
  at(x, y, a = 0, k = 1) { return this.tf({ x, y, a, k }) }
  tf(t) {
    const nt = tfCompose(t, this.t);
    const s = new Sh(mapPts(this.pts, t), { holes: this.holes.map(h => mapPts(h, t)), fr: this.fr, t: nt });
    return s;
  }
  // мировая рамка: центр, угол, ширина, высота
  frame() {
    if (!this.fr) { const b = boundsOf([this]); return { cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2, a: 0, w: b[2] - b[0], h: b[3] - b[1] } }
    const f = this.fr, t = this.t; const [cx, cy] = tfPt(t, f.u0 + f.w / 2, f.v0 + f.h / 2);
    return { cx, cy, a: t.a, w: f.w * t.k, h: f.h * t.k };
  }
  d() { return toD(this.pts) + this.holes.map(toD).join("") }
}
function anchorOf(p) { return p[0] === "q" ? [p[3], p[4]] : p[0] === "c" ? [p[5], p[6]] : [p[0], p[1]] }
function toD(pts) {
  const n = pts.length, f = v => +v.toFixed(2);
  const A = i => anchorOf(pts[(i + n) % n]);
  const dirTo = i => { const p = pts[(i + n) % n]; return p[0] === "q" ? [p[1], p[2]] : p[0] === "c" ? [p[1], p[2]] : [p[0], p[1]] };
  const corner = i => {
    const p = pts[(i + n) % n], [vx, vy] = [p[0], p[1]], [px, py] = A(i - 1), [nx, ny] = dirTo(i + 1);
    let ix = vx - px, iy = vy - py, ox = nx - vx, oy = ny - vy; const li = Math.hypot(ix, iy) || 1, lo = Math.hypot(ox, oy) || 1;
    const r = Math.min(p[2], li / 2, lo / 2); ix /= li; iy /= li; ox /= lo; oy /= lo;
    return [[vx - ix * r, vy - iy * r], [vx, vy], [vx + ox * r, vy + oy * r]];
  };
  let s = "", start;
  const p0 = pts[0];
  const rounded = p => p[0] !== "q" && p[0] !== "c" && p.length > 2 && p[2] > 0;
  if (rounded(p0)) { const c = corner(0); s = `M${f(c[2][0])} ${f(c[2][1])}`; start = 1 } else { s = `M${f(p0[0])} ${f(p0[1])}`; start = 1 }
  for (let k = start; k < n + (rounded(p0) ? 1 : 0); k++) {
    const i = k % n, p = pts[i];
    if (p[0] === "q") s += `Q${f(p[1])} ${f(p[2])} ${f(p[3])} ${f(p[4])}`;
    else if (p[0] === "c") s += `C${f(p[1])} ${f(p[2])} ${f(p[3])} ${f(p[4])} ${f(p[5])} ${f(p[6])}`;
    else if (rounded(p)) { const c = corner(i); s += `L${f(c[0][0])} ${f(c[0][1])}Q${f(c[1][0])} ${f(c[1][1])} ${f(c[2][0])} ${f(c[2][1])}` }
    else s += `L${f(p[0])} ${f(p[1])}`;
  }
  return s + "Z";
}
function boundsOf(shapes) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const add = (x, y) => { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y };
  for (const s of shapes) for (const c of [s.pts, ...s.holes]) for (const p of c) {
    if (p[0] === "q") { add(p[3], p[4]); add((p[1] + p[3]) / 2, (p[2] + p[4]) / 2) }
    else if (p[0] === "c") { add(p[5], p[6]); add((p[1] + p[3]) / 2, (p[2] + p[4]) / 2) }
    else add(p[0], p[1]);
  }
  return [x0, y0, x1, y1];
}
// Базовые фигуры в локальных координатах
const rect = (x, y, w, h, r = 0) => new Sh([[x, y, r], [x + w, y, r], [x + w, y + h, r], [x, y + h, r]], { fr: { u0: x, v0: y, w, h } });
function ellipsePts(cx, cy, rx, ry) { const k = .5523; return [[cx + rx, cy], ["c", cx + rx, cy + ry * k, cx + rx * k, cy + ry, cx, cy + ry], ["c", cx - rx * k, cy + ry, cx - rx, cy + ry * k, cx - rx, cy], ["c", cx - rx, cy - ry * k, cx - rx * k, cy - ry, cx, cy - ry], ["c", cx + rx * k, cy - ry, cx + rx, cy - ry * k, cx + rx, cy]] }
const ell = (cx, cy, rx, ry = rx) => new Sh(ellipsePts(cx, cy, rx, ry), { fr: { u0: cx - rx, v0: cy - ry, w: rx * 2, h: ry * 2 } });
const poly = (pts, fr) => new Sh(pts, { fr });
function withHoles(sh, ...holes) { sh.holes = sh.holes.concat(holes.map(h => h.pts)); return sh }
