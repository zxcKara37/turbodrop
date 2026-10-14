/* ================= Библиотека деталей =================
   Каждая функция возвращает массив деталей {id, sh, mat, skin, prof, wrap, dec}.
   Схема оружия собирается из этих деталей плюс собственных контуров ствольной коробки. */
const part = (id, sh, mat, o = {}) => Object.assign({ id, sh, mat, prof: "box", wrap: .45, dec: [] }, o);
const gr = (...pts) => ({ k: "groove", line: pts });
const scr = (x, y, r = 1.1, o = {}) => Object.assign({ k: "screw", x, y, r }, o);
const slot = (sh, col) => ({ k: "slot", sh, col });
const P = (t, u, v) => tfPt(t, u, v);
const tr = (x, y, a = 0) => ({ x, y, a, k: 1 });

// Ствол: трубка со ступенями профиля [[u, r], ...]
function tube(x, y, len, r, steps = [], cap = .35) {
  const top = [[x, y - r]], bot = [[x, y + r]]; let cr = r, mr = r;
  for (const [u, r2] of steps) { top.push([x + u, y - cr], [x + u, y - r2]); bot.push([x + u, y + cr], [x + u, y + r2]); cr = r2; mr = Math.max(mr, r2) }
  top.push([x + len, y - cr, cr * cap]); bot.push([x + len, y + cr, cr * cap]);
  return poly([...top, ...bot.reverse()], { u0: x, v0: y - mr, w: len, h: mr * 2 });
}
function barrel(x, y, len, r, steps, o = {}) { return [part("barrel", tube(x, y, len, r, steps), o.mat || "blued", { prof: "cyl", wrap: 1, skin: o.skin })] }

// Дульные устройства
function muzzle(kind, x, y, r, len = 14) {
  if (kind === "brake") { const h = r * 1.5; return [part("muzzle", poly([[x, y - h, .6], [x + len - 2, y - h, .6], [x + len, y - h + 1.6], [x + len, y + h - 1.6], [x + len - 2, y + h, .6], [x, y + h, .6]], { u0: x, v0: y - h, w: len, h: h * 2 }), "blued", { prof: "cyl", dec: [0, 1, 2].map(i => slot(rect(x + 2.4 + i * (len - 4) / 3, y - h + 1, (len - 6) / 3 - 1, h * 2 - 2, .6))) })] }
  if (kind === "flash") { const h = r * 1.25; return [part("muzzle", poly([[x, y - h * .85], [x + 2, y - h], [x + len, y - h, .5], [x + len, y + h, .5], [x + 2, y + h], [x, y + h * .85]], { u0: x, v0: y - h, w: len, h: h * 2 }), "blued", { prof: "cyl", dec: [slot(rect(x + len * .45, y - h * .55, len * .58, h * .38, .4)), slot(rect(x + len * .45, y + h * .18, len * .58, h * .38, .4))] })] }
  if (kind === "supp") { const h = r * 2; return [part("muzzle", rect(x, y - h, len, h * 2, h * .6), "alu", { prof: "cyl", wrap: 1, skin: 1, dec: [gr([x + 3, y - h + .3], [x + 3, y + h - .3]), gr([x + len - 3, y - h + .3], [x + len - 3, y + h - .3]), { k: "text", x: x + len * .35, y: y + .3, s: 2.2, t: "ТД-ГЛУШ" }] })] }
  if (kind === "ak") { const h = r * 1.15; return [part("muzzle", poly([[x, y - h], [x + len - 4, y - h], [x + len, y - h + 2], [x + len, y + h, .4], [x, y + h]], { u0: x, v0: y - h, w: len, h: h * 2 }), "blued", { prof: "cyl", dec: [slot(rect(x + len * .45, y - h + .7, len * .3, h * .7, .3)), gr([x + 2, y - h], [x + 2, y + h])] })] }
  if (kind === "comp") { const h = r * 1.4; return [part("muzzle", rect(x, y - h, len, h * 2, .8), "steel", { prof: "cyl", dec: [0, 1, 2].map(i => slot(ell(x + 3 + i * (len - 5) / 2.2, y - h + 1.3, 1, .7))) })] }
  if (kind === "big") { const h = r * 2.1; return [part("muzzle", poly([[x, y - h * .6], [x + 3, y - h], [x + len - 1, y - h, .6], [x + len, y - h * .4], [x + len, y + h * .4], [x + len - 1, y + h, .6], [x + 3, y + h], [x, y + h * .6]], { u0: x, v0: y - h, w: len, h: h * 2 }), "blued", { prof: "cyl", dec: [slot(rect(x + 4, y - h + 1, len * .28, h * 2 - 2, .6)), slot(rect(x + 5 + len * .33, y - h + 1, len * .28, h * 2 - 2, .6))] })] }
  return [];
}
// Спусковая скоба + крючок
function triggerGroup(x, y, w, h, o = {}) {
  const t = o.t ?? 1.7, k = .5523, cx = x + w / 2;
  const outer = [[x - .5, y], [x + w, y], ["c", x + w + .2, y + h * k * 1.1, cx + w * .5 * k, y + h, cx, y + h], ["c", cx - w * .5 * k, y + h, x - .5 + (o.sq ? 0 : 0), y + h * k, x - .5, y + h * .55]];
  const ix = x + t * .7, iw = w - t * 1.6, ih = h - t;
  const inner = [[ix, y - 1], [ix + iw, y - 1], ["c", ix + iw + .2, y + ih * k, ix + iw / 2 + iw * .5 * k, y + ih, ix + iw / 2, y + ih], ["c", ix + iw / 2 - iw * .5 * k, y + ih, ix, y + ih * k, ix, y - 1]];
  const guard = new Sh(o.sq ? [[x - .5, y], [x + w, y], [x + w, y + h - 2, 2], [x + w * .3, y + h, 1.5], [x - .5, y + h * .55]] : outer, { holes: [o.sq ? [[ix, y - 1], [ix + iw, y - 1], [ix + iw, y + ih - 1.5, 1.6], [ix + iw * .3, y + ih, 1.2], [ix, y + ih * .5]] : inner], fr: { u0: x, v0: y, w, h } });
  const tx = x + w * .5;
  const trig = poly([[tx - 1.2, y - .5], [tx + .8, y - .5], ["q", tx + 1.2, y + h * .45, tx - .6, y + h * .72], [tx - 1.4, y + h * .7], ["q", tx - .2, y + h * .4, tx - 1.2, y - .5]]);
  return [part("trigger", trig, o.tmat || "steel", { prof: "flat" }), part("guard", guard, o.mat || "polymer", { prof: "flat", tint: o.tint, skin: o.skin })];
}
// Пистолетная рукоять: local u вдоль рукояти вниз, v>0 — к затыльнику
function grip(x, y, len, w, tilt, o = {}) {
  const t = tr(x, y, Math.PI / 2 + tilt), hw = w / 2, F = o.fingers ?? 3;
  const front = [];
  if (o.fingers !== 0) for (let i = 1; i <= F; i++) { const u = len * (i / (F + 1.4)); front.push(["q", u - len / (F + 1.4) / 2, -hw - 1.6, u, -hw + .3]) }
  const tp = o.taper || 0; const pts = [[-1, -hw], ...front, [len, -hw + tp - (o.flare || 0), 2.2], [len + (o.heel || 1.5), hw + 1.2 - tp * .3, 2.2], ["q", len * .5, hw + (o.belly ?? 1.8), o.tang ? -2 : 0, hw + (o.tang || 0)], [-1, hw]];
  const sh = new Sh(pts, { fr: { u0: 0, v0: -hw, w: len, h: w } }).tf(t);
  const dec = [];
  if (o.stipple !== false) { const ins = new Sh([[len * .12, -hw + 2.2, 1.5], [len * .85, -hw + 2.2, 1.5], [len * .85, hw - 1.5, 1.5], [len * .12, hw - 1.5, 1.5]]).tf(t); dec.push({ k: "stipple", sh: ins }) }
  if (o.screws) dec.push(scr(...P(t, len * .25, 0), 1), scr(...P(t, len * .75, 0), 1));
  return [part("grip", sh, o.mat || "polymer", { prof: "flat", tint: o.tint, skin: o.skin, wrap: .2, dec })];
}
// Магазин: прямой или «банан» (дуга с центром спереди), с затыльником и рёбрами
function magazine(x, y, len, w, tilt, o = {}) {
  const t = tr(x, y, Math.PI / 2 + tilt), hw = w / 2, cv = o.curve || 0, phi = Math.max(1e-4, 2 * cv / len), R = len / phi;
  const at = (th, off) => [R * Math.sin(th) * (1 + off / R) + 0, -R + (R + off) * Math.cos(th)];
  const N = 10, front = [], back = [];
  for (let i = 0; i <= N; i++) { const th = phi * i / N; front.push(at(th, -hw)); back.push(at(th, hw)) }
  // затыльник: продолжаем по касательной и чуть расширяем
  const thE = phi, tu = [Math.cos(thE), -Math.sin(thE)], nv = [Math.sin(thE), Math.cos(thE)];
  const fE = front[N], bE = back[N], ext = 2.8, lip = .9;
  const pts = [[-1, -hw], ...front.slice(1), [fE[0] - nv[0] * lip, fE[1] - nv[1] * lip], [fE[0] - nv[0] * lip + tu[0] * ext, fE[1] - nv[1] * lip + tu[1] * ext, .8], [bE[0] + nv[0] * lip + tu[0] * ext, bE[1] + nv[1] * lip + tu[1] * ext, .8], [bE[0] + nv[0] * lip, bE[1] + nv[1] * lip], ...back.slice(1).reverse(), [-1, hw]];
  const sag = R - R * Math.cos(phi);
  const sh = new Sh(pts, { fr: { u0: -1, v0: -hw - sag, w: len + 4, h: w + sag } }).tf(t);
  const dec = [];
  const ribs = o.ribs ?? 3;
  for (let i = 1; i <= ribs; i++) { const th = phi * i / (ribs + 1); dec.push(gr(P(t, ...at(th, -hw + 1)), P(t, ...at(th, hw - 1)))) }
  if (o.window) { const a = at(phi * .2, 0), b = at(phi * .7, 0); dec.push(slot(new Sh([[a[0], a[1] - 1.3, .8], [b[0], b[1] - 1.3, .8], [b[0], b[1] + 1.3, .8], [a[0], a[1] + 1.3, .8]]).tf(t), "rgba(180,140,40,.85)")) }
  return [part("mag", sh, o.mat || "blued", { prof: "flat", wrap: .3, tint: o.tint, skin: o.skin ?? 1, dec })];
}
// Оптика
function scope(x, y, len, r, o = {}) {
  const ob = r * (o.bell || 1.7), oc = r * 1.4;
  const tubeSh = poly([[x, y - oc], [x + len * .14, y - oc, 1], [x + len * .22, y - r], [x + len * .66, y - r], [x + len * .76, y - ob, 1.4], [x + len, y - ob, 1], [x + len, y + ob, 1], [x + len * .76, y + ob, 1.4], [x + len * .66, y + r], [x + len * .22, y + r], [x + len * .14, y + oc, 1], [x, y + oc]], { u0: x, v0: y - ob, w: len, h: ob * 2 });
  const tu = poly([[x + len * .4, y - r - 3.6, .8], [x + len * .52, y - r - 3.6, .8], [x + len * .52, y], [x + len * .4, y]]);
  const knob = ell(x + len * .46, y + r * .2, r * .62, r * .62);
  const rings = [x + len * .3, x + len * .58].map(rx => poly([[rx - 2, y - r - .4, .5], [rx + 2, y - r - .4, .5], [rx + 2.6, y + r + (o.mount || 3)], [rx - 2.6, y + r + (o.mount || 3)]]));
  const parts = [
    ...rings.map((s, i) => part("ring" + i, s, "alu", { prof: "box", dec: [scr(s.pts[0][0] + 2, y + r + 1.3, .55, { hex: 1 })] })),
    part("scope", tubeSh, o.mat || "alu", { prof: "cyl", wrap: 1, skin: o.skin, dec: [gr([x + len * .14, y - oc], [x + len * .14, y + oc]), gr([x + len * .76, y - ob], [x + len * .76, y + ob]), { k: "knurl", x: x + 1, y: y - oc, w: len * .1, h: oc * 2 }, { k: "lens", x: x + len - .4, y, r: ob - .6 }] }),
    part("turret", tu, "alu", { prof: "cyl", dec: [{ k: "knurl", x: x + len * .4, y: y - r - 3.4, w: len * .12, h: 2.2 }] }),
    part("knob", knob, "alu", { prof: "cyl", dec: [{ k: "dot", x: x + len * .46, y: y + r * .2, r: .5, c: "#ff4a3a" }] }),
  ];
  return parts;
}
function reddot(x, y, s = 1) {
  const b = poly([[x, y], [x + 18 * s, y], [x + 18 * s, y - 2 * s], [x, y - 2 * s]]);
  const h = poly([[x + 1 * s, y - 2 * s], [x + 2 * s, y - 9 * s, 1.6], [x + 14 * s, y - 10 * s, 1.6], [x + 17 * s, y - 2 * s]], { u0: x, v0: y - 10 * s, w: 18 * s, h: 8 * s });
  return [part("rdbase", b, "alu"), part("reddot", h, "alu", { skin: 1, dec: [{ k: "lens", x: x + 15.5 * s, y: y - 5.8 * s, r: 3.4 * s }, scr(x + 7 * s, y - 5 * s, .9 * s, { hex: 1 })] })];
}
function holo(x, y, s = 1) {
  const body = new Sh([[x, y], [x + 26 * s, y], [x + 26 * s, y - 11 * s, 1.2], [x + 20 * s, y - 13 * s, 1], [x + 4 * s, y - 13 * s, 1], [x, y - 9 * s, 1]], { holes: [[[x + 6 * s, y - 3 * s], [x + 21 * s, y - 3 * s], [x + 21 * s, y - 10.5 * s, 1], [x + 6 * s, y - 10.5 * s, 1]]], fr: { u0: x, v0: y - 13 * s, w: 26 * s, h: 13 * s } });
  const glass = rect(x + 6 * s, y - 10.5 * s, 15 * s, 7.5 * s, 1);
  return [part("hologlass", glass, "glass", { prof: "flat", noAO: 1, dec: [{ k: "dot", x: x + 13.5 * s, y: y - 6.8 * s, r: .7 * s, c: "#ff3a3a" }] }), part("holo", body, "alu", { skin: 1, dec: [{ k: "text", x: x + 1 * s, y: y - 1.5 * s, s: 2 * s, t: "ГОЛО" }] })];
}
function rail(x, y, len, h = 2.4, mat = "alu") { return [part("rail", rect(x, y - h, len, h, .3), mat, { prof: "box", dec: [{ k: "rail", x: x + 1, y: y - h, w: len - 2, h: h * .55, pitch: 2.6 }] })] }
function frontPost(x, y, h = 6) { return [part("fsight", poly([[x - 3, y], [x + 3, y], [x + 1.2, y - h + 1.5], [x + .6, y - h, .3], [x - .6, y - h, .3], [x - 1.4, y - h + 1.5]]), "blued", { prof: "flat" })] }
function rearSight(x, y, w = 8, h = 4) { return [part("rsight", poly([[x, y], [x + w, y], [x + w, y - h, .5], [x + w * .65, y - h], [x + w * .55, y - h + 1.5], [x + w * .45, y - h + 1.5], [x + w * .35, y - h], [x, y - h, .5]]), "blued", { prof: "flat" })] }
function bipod(x, y, len, spread = .35, mat = "alu") {
  const leg = a => { const t = tr(x, y, Math.PI / 2 + a); return poly(mapPts([[0, -1.1], [len, -.9, .6], [len + 2, -1.6, .8], [len + 2, 1.6, .8], [len, .9], [0, 1.1]], t), null) };
  return [part("bipodL", leg(spread), mat, { prof: "cyl" }), part("bipodR", leg(-spread), mat, { prof: "cyl" }), part("bipodH", rect(x - 3, y - 2, 6, 4, 1), "blued", { dec: [scr(x, y, .8)] })];
}
