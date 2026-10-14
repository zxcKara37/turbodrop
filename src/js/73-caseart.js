/* ================= Обложки кейсов: форма, цвет, эмблема, свечение ================= */
const EMB = {
  bolt: "M23 2 9 22h9l-3 16 16-22h-9z",
  skull: "M20 3C11 3 5 9 5 17c0 5 2 8 5 10v6h4v-3h3v3h6v-3h3v3h4v-6c3-2 5-5 5-10 0-8-6-14-15-14zm-6 13a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm12 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-6 9 2 4h-4z",
  star: "M20 2l5.3 11.6 12.7 1.3-9.5 8.6 2.7 12.5L20 29.6 8.8 36l2.7-12.5L2 14.9l12.7-1.3z",
  crown: "M4 30 2 10l10 8 8-14 8 14 10-8-2 20zm0 3h32v4H4z",
  flame: "M20 2c2 8 12 12 12 23a12 12 0 0 1-24 0c0-6 4-9 5-14 2 4 3 6 6 7-2-6-1-11 1-16z",
  flake: "M18 2h4v8l5-4 2 3-7 6v4h4l6-7 3 2-4 5h8v4h-8l4 5-3 2-6-7h-4v4l7 6-2 3-5-4v8h-4v-8l-5 4-2-3 7-6v-4h-4l-6 7-3-2 4-5H2v-4h8L6 9l3-2 6 7h4v-4l-7-6 2-3 5 4z",
  drop: "M20 2C14 12 7 19 7 26a13 13 0 0 0 26 0C33 19 26 12 20 2zm-6 22c1 5 4 7 8 8-6 1-10-3-8-8z",
  blade: "M36 2 14 24l2 2L38 4zM12 26l-3 1 4 4 1-3zm-4 2-6 6 4 4 6-6z",
  planet: "M20 8a12 12 0 1 0 0 24 12 12 0 0 0 0-24zM2 26c3 4 15 2 26-5S40 10 37 7c-1-1-3-1-5 0 2 0 3 0 3 1 1 2-6 8-15 12S6 26 4 24c0-1 0-2 2-3-3 1-5 3-4 5z",
  gem: "M10 4h20l8 10-18 24L2 14zm1 4-4 6h7zm18 0-3 6h7zm-13 0 4 6 4-6zm-8 9 12 15-5-15zm14 0 5 15 12-15z",
  wave: "M2 22c6-10 12-10 18 0s12 10 18 0v6c-6 10-12 10-18 0S8 18 2 28zm0-12c6-10 12-10 18 0s12 10 18 0v5c-6 10-12 10-18 0S8 5 2 15z",
  leaf: "M36 3C14 3 4 14 6 30L2 36l3 2 4-6c16 2 27-8 27-29zM10 30c4-8 10-14 18-18-6 6-11 12-14 20z",
  chip: "M11 11h18v18H11zm4 4v10h10V15zM14 2h3v7h-3zm9 0h3v7h-3zM14 31h3v7h-3zm9 0h3v7h-3zM2 14h7v3H2zm0 9h7v3H2zm29-9h7v3h-7zm0 9h7v3h-7z",
  sun: "M20 11a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM18 1h4v7h-4zm0 31h4v7h-4zM1 18h7v4H1zm31 0h7v4h-7zM5 8l3-3 5 5-3 3zm22 22 3-3 5 5-3 3zM30 5l3 3-5 5-3-3zM8 35l-3-3 5-5 3 3z",
  dice: "M6 6h28v28H6zm6 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm16 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-8 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-8 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm16 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  coin: "M20 3a17 17 0 1 1 0 34 17 17 0 0 1 0-34zm0 5a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 4h5v4h3v3h-3v2h3v3h-3v5h-5zm0 0v19",
  eye: "M20 9c9 0 15 6 18 11-3 5-9 11-18 11S5 25 2 20C5 15 11 9 20 9zm0 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  fang: "M4 6h32c0 10-4 16-8 18l-3 12-3-10h-4l-3 10-3-12C8 22 4 16 4 6z",
  target: "M20 2a18 18 0 1 1 0 36 18 18 0 0 1 0-36zm0 5a13 13 0 1 0 0 26 13 13 0 0 0 0-26zm0 5a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  shield: "M20 2 35 8v10c0 10-6 17-15 20C11 35 5 28 5 18V8zm0 6-9 4v6c0 7 4 12 9 14z",
  moon: "M26 3a17 17 0 1 0 11 27A15 15 0 0 1 26 3z",
  pumpkin: "M18 3h4v6h-4zM20 9c4-2 10-2 13 2 5 6 5 17 0 23-3 4-9 4-13 2-4 2-10 2-13-2-5-6-5-17 0-23 3-4 9-4 13-2zm-8 9 3 5h-6zm16 0 3 5h-6zm-14 9h12l-3 3-3-2-3 2z",
  gift: "M4 14h32v7H4zm2 9h28v14H6zm12-9h4v23h-4zM20 13c-4-6-12-8-12-3s8 4 12 3zm0 0c4-6 12-8 12-3s-8 4-12 3z",
  trophy: "M10 3h20v5h7c0 8-4 12-8 13-2 4-5 6-7 6v5h6v5H12v-5h6v-5c-2 0-5-2-7-6-4-1-8-5-8-13h7zM6 11c1 4 3 6 5 6l-1-6zm28 0h-4l-1 6c2 0 4-2 5-6z",
  sakura: "M20 4c4 0 5 6 2 10 5-2 10 0 9 4s-7 4-10 1c2 5 1 10-3 10s-4-6-1-10c-4 2-10 2-10-2s6-5 10-3c-3-4-1-10 3-10zm0 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  bomb: "M17 12a13 13 0 1 1 0 26 13 13 0 0 1 0-26zm9-4 4-4 3 3-4 4zm6-6 2 1-1 2-2-1zm-17 18c-3 1-5 4-5 7h3c0-2 1-4 3-4z",
  music: "M14 6 36 2v24a6 6 0 1 1-4-5V9l-14 3v19a6 6 0 1 1-4-5z",
  infinity: "M12 12c4 0 6 3 8 6 2-3 4-6 8-6a8 8 0 0 1 0 16c-4 0-6-3-8-6-2 3-4 6-8 6a8 8 0 0 1 0-16zm0 4a4 4 0 1 0 0 8c3 0 4-2 6-4-2-2-3-4-6-4zm16 0c-3 0-4 2-6 4 2 2 3 4 6 4a4 4 0 1 0 0-8z",
  spray: "M12 12h12v26H12zm2-9h8v8h-8zm12 2h3v3h-3zm4-3h3v3h-3zm0 6h3v3h-3zm4-3h3v3h-3z",
  fist: "M8 14c0-3 4-3 4 0V8c0-3 5-3 5 0v-1c0-3 5-3 5 0v1c0-3 5-3 5 0v2c0-3 5-3 5 0v12c0 9-6 15-14 15S8 31 8 24z",
  box: "M20 2 37 10v20L20 38 3 30V10zm0 4L8 11l12 6 12-6zM6 14v14l12 7V20zm28 0-12 6v15l12-7z",
};
const EMBP = {};
const embPath = k => EMBP[k] || (EMBP[k] = new Path2D(EMB[k] || EMB.bolt));
const CASEC = new Map();
// Возвращает {full, body, lid} — data URI; крышку и корпус можно анимировать раздельно
function caseArt(cs) {
  if (CASEC.has(cs.id)) return CASEC.get(cs.id);
  const S2 = 2, W = 300, H = 220, h = cs.hue, h2 = cs.hue2 || shadeHex(h, -.6);
  const mk = () => { const c = document.createElement("canvas"); c.width = W * S2; c.height = H * S2; const g = c.getContext("2d"); g.scale(S2, S2); return [c, g] };
  const [bc, g] = mk(), [lc, l] = mk();
  const rr = (x, y, w, hh, r, ctx = g) => { ctx.beginPath(); ctx.roundRect(x, y, w, hh, r) };
  const metal = (ctx, x, y, w, hh, r = 3) => { const m = ctx.createLinearGradient(0, y, 0, y + hh); m.addColorStop(0, "#eef1f5"); m.addColorStop(.45, "#8c949e"); m.addColorStop(1, "#2a2f36"); ctx.fillStyle = m; rr(x, y, w, hh, r, ctx); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.6)"; ctx.lineWidth = 1; ctx.stroke() };
  const paint = (ctx, y0, y1, a = 0) => { const gr = ctx.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, shadeHex(h, .18 + a)); gr.addColorStop(.35, h); gr.addColorStop(1, h2); return gr };
  const emblem = (ctx, cx, cy, s) => { ctx.save(); ctx.translate(cx - s / 2, cy - s / 2); ctx.scale(s / 40, s / 40); ctx.shadowColor = h; ctx.shadowBlur = 14; ctx.fillStyle = shadeHex(h, .55); ctx.fill(embPath(cs.emblem), "evenodd"); ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 1; ctx.stroke(embPath(cs.emblem)); ctx.restore() };
  const plate = (ctx, x, y, w, hh, r) => { const gr = ctx.createLinearGradient(0, y, 0, y + hh); gr.addColorStop(0, "#1c1824"); gr.addColorStop(1, "#08070c"); ctx.fillStyle = gr; rr(x, y, w, hh, r, ctx); ctx.fill(); ctx.strokeStyle = h; ctx.lineWidth = 2; ctx.shadowColor = h; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0 };
  // тень на полу и подсветка
  let gr0 = g.createRadialGradient(150, 208, 8, 150, 208, 130); gr0.addColorStop(0, "rgba(0,0,0,.7)"); gr0.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr0; g.fillRect(0, 160, W, 60);
  gr0 = g.createRadialGradient(150, 120, 10, 150, 120, 150); gr0.addColorStop(0, hexA(h, .35)); gr0.addColorStop(1, hexA(h, 0)); g.fillStyle = gr0; g.fillRect(0, 0, W, H);
  const sh = cs.shape;
  if (sh === "crate" || sh === "safe") {
    g.fillStyle = paint(g, 92, 206, -.2); rr(30, 90, 240, 116, 14); g.fill();
    g.strokeStyle = "rgba(0,0,0,.3)"; g.lineWidth = 2; for (const y of [122, 152, 182]) { g.beginPath(); g.moveTo(34, y); g.lineTo(266, y); g.stroke() }
    g.strokeStyle = "rgba(255,255,255,.08)"; for (const y of [124, 154, 184]) { g.beginPath(); g.moveTo(34, y); g.lineTo(266, y); g.stroke() }
    if (sh === "safe") { plate(g, 108, 110, 84, 84, 42); emblem(g, 150, 152, 46); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(150 + Math.cos(a) * 38 - 1, 152 + Math.sin(a) * 38 - 1, 2, 2) } metal(g, 214, 140, 30, 10, 5); }
    else { plate(g, 118, 106, 64, 84, 9); emblem(g, 150, 148, 44) }
    metal(g, 24, 178, 26, 28); metal(g, 250, 178, 26, 28);
    l.fillStyle = paint(l, 60, 102); rr(20, 60, 260, 42, 12, l); l.fill();
    l.strokeStyle = "rgba(255,255,255,.45)"; l.lineWidth = 1.5; l.beginPath(); l.moveTo(34, 63); l.lineTo(266, 63); l.stroke();
    metal(l, 14, 56, 28, 28); metal(l, 258, 56, 28, 28); metal(l, 80, 88, 24, 22); metal(l, 196, 88, 24, 22);
    l.fillStyle = "rgba(0,0,0,.35)"; l.fillRect(24, 98, 252, 5);
  } else if (sh === "chest") {
    g.fillStyle = paint(g, 100, 206, -.2); rr(32, 100, 236, 106, 10); g.fill();
    for (const x of [66, 222]) metal(g, x, 100, 14, 106, 2);
    plate(g, 124, 112, 52, 62, 8); emblem(g, 150, 142, 36);
    l.fillStyle = paint(l, 30, 104); l.beginPath(); l.moveTo(26, 104); l.lineTo(26, 74); l.bezierCurveTo(26, 22, 274, 22, 274, 74); l.lineTo(274, 104); l.closePath(); l.fill();
    l.strokeStyle = "rgba(255,255,255,.4)"; l.lineWidth = 2; l.beginPath(); l.moveTo(40, 66); l.bezierCurveTo(52, 34, 248, 34, 260, 66); l.stroke();
    for (const x of [66, 222]) { const m = l.createLinearGradient(x, 0, x + 14, 0); m.addColorStop(0, "#5a626c"); m.addColorStop(.5, "#e8ecf0"); m.addColorStop(1, "#4a525c"); l.fillStyle = m; l.fillRect(x, 34, 14, 70) }
    l.fillStyle = "rgba(0,0,0,.4)"; l.fillRect(24, 100, 252, 5);
  } else if (sh === "capsule") {
    g.fillStyle = paint(g, 110, 200, -.25); rr(28, 112, 244, 88, 44); g.fill();
    metal(g, 136, 176, 28, 18, 6);
    l.fillStyle = paint(l, 40, 128); rr(28, 40, 244, 90, 44, l); l.fill();
    const gl = l.createLinearGradient(0, 52, 0, 120); gl.addColorStop(0, hexA(h, .55)); gl.addColorStop(1, "rgba(10,8,16,.9)"); l.fillStyle = gl; rr(76, 52, 148, 64, 32, l); l.fill(); l.strokeStyle = "rgba(255,255,255,.35)"; l.lineWidth = 2; l.stroke();
    emblem(l, 150, 84, 40); l.fillStyle = "rgba(255,255,255,.3)"; rr(92, 58, 70, 10, 5, l); l.fill();
    l.strokeStyle = "rgba(0,0,0,.45)"; l.lineWidth = 3; l.beginPath(); l.moveTo(40, 128); l.lineTo(260, 128); l.stroke();
  } else { // case — кейс-чемодан
    g.fillStyle = paint(g, 96, 200, -.2); rr(26, 98, 248, 104, 12); g.fill();
    g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 2; rr(38, 110, 224, 80, 8); g.stroke();
    plate(g, 116, 118, 68, 60, 10); emblem(g, 150, 148, 40);
    metal(l, 116, 44, 68, 12, 6); l.fillStyle = "#0e0c12"; rr(128, 50, 44, 8, 3, l); l.fill();
    l.fillStyle = paint(l, 54, 104); rr(20, 56, 260, 46, 12, l); l.fill();
    l.strokeStyle = "rgba(255,255,255,.4)"; l.lineWidth = 1.5; l.beginPath(); l.moveTo(34, 60); l.lineTo(266, 60); l.stroke();
    metal(l, 50, 88, 30, 18, 4); metal(l, 220, 88, 30, 18, 4);
  }
  for (const c of [g, l]) { c.globalCompositeOperation = "source-atop"; const sp = c.createLinearGradient(0, 0, W, H); sp.addColorStop(0, "rgba(255,255,255,.12)"); sp.addColorStop(.5, "rgba(255,255,255,0)"); sp.addColorStop(1, "rgba(0,0,0,.2)"); c.fillStyle = sp; c.fillRect(0, 0, W, H); c.globalCompositeOperation = "source-over" }
  const fc = document.createElement("canvas"); fc.width = W * S2; fc.height = H * S2; const f = fc.getContext("2d"); f.drawImage(bc, 0, 0); f.drawImage(lc, 0, 0);
  const res = { full: fc.toDataURL("image/webp", .9), body: bc.toDataURL("image/webp", .9), lid: lc.toDataURL("image/webp", .9) };
  CASEC.set(cs.id, res); return res;
}
