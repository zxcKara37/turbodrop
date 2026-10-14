/* ================= Материалы и рендер оружия ================= */
const MAT = {
  steel: { n: "Полированная сталь", stops: [[0, "#f2f5f8"], [.14, "#b9c1ca"], [.3, "#6e7680"], [.52, "#9aa2ab"], [.78, "#4b525b"], [1, "#22262c"]], spec: .9, rough: .1, brushed: 1 },
  blued: { n: "Воронёная сталь", stops: [[0, "#6a7383"], [.12, "#3a4250"], [.4, "#1c212b"], [.75, "#12151c"], [1, "#08090d"]], spec: .5, rough: .25, brushed: .5 },
  alu: { n: "Алюминий", stops: [[0, "#4b5058"], [.15, "#363a41"], [.5, "#2a2d33"], [1, "#16181c"]], spec: .3, rough: .6, bead: 1 },
  polymer: { n: "Полимер", stops: [[0, "#3c3f45"], [.25, "#2a2c31"], [.7, "#1d1f23"], [1, "#111214"]], spec: .15, rough: .9, stipple: 1 },
  wood: { n: "Дерево", wood: 1, spec: .3, rough: .5 },
  carbon: { n: "Карбон", carbon: 1, spec: .55, rough: .3 },
  brass: { n: "Латунь", stops: [[0, "#fff6c8"], [.18, "#e6bc52"], [.45, "#a87c22"], [.7, "#d1a443"], [1, "#4f3507"]], spec: .9, rough: .15 },
  leather: { n: "Кожа", stops: [[0, "#5a3a26"], [.4, "#3e2617"], [1, "#1e120a"]], spec: .2, rough: .8, grain: 1 },
  fabric: { n: "Ткань", stops: [[0, "#3c4148"], [.5, "#2a2e33"], [1, "#16181b"]], spec: .05, rough: 1, weave: 1 },
  rubber: { n: "Резина", stops: [[0, "#2f3134"], [.5, "#1e1f22"], [1, "#0e0f10"]], spec: .12, rough: .95, stipple: 1 },
  glass: { n: "Оптика", glass: 1, spec: 1 },
};
// Тонируем полимер/алюминий/ткань под цвет фурнитуры (олива, койот, серый)
function tintStops(stops, hex) { if (!hex) return stops; return stops.map(([o, c], i) => [o, shadeHex(hex, lerp(.28, -.72, o))]) }

function frameGrad(g, fr, stops, along) {
  const s = Math.sin(fr.a), c = Math.cos(fr.a);
  let x0, y0, x1, y1;
  if (along) { x0 = fr.cx - c * fr.w / 2; y0 = fr.cy - s * fr.w / 2; x1 = fr.cx + c * fr.w / 2; y1 = fr.cy + s * fr.w / 2 }
  else { x0 = fr.cx + s * fr.h / 2; y0 = fr.cy - c * fr.h / 2; x1 = fr.cx - s * fr.h / 2; y1 = fr.cy + c * fr.h / 2 }
  const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => gr.addColorStop(clamp(o, 0, 1), col)); return gr;
}
function inFrame(g, fr, fn) { g.save(); g.translate(fr.cx, fr.cy); g.rotate(fr.a); fn(fr.w / 2, fr.h / 2); g.restore() }

// Профили освещения: поперечный градиент поверх материала
const PROF = {
  cyl: s => [[0, `rgba(0,0,0,.35)`], [.1, `rgba(255,255,255,${.12 * s})`], [.24, `rgba(255,255,255,${.5 * s})`], [.34, `rgba(255,255,255,${.06 * s})`], [.62, "rgba(0,0,0,0)"], [.86, "rgba(0,0,0,.28)"], [1, "rgba(0,0,0,.6)"]],
  box: s => [[0, `rgba(255,255,255,${.5 * s})`], [.06, `rgba(255,255,255,${.28 * s})`], [.11, `rgba(255,255,255,${.14 * s})`], [.3, `rgba(255,255,255,${.06 * s})`], [.55, "rgba(0,0,0,.02)"], [.82, "rgba(0,0,0,.16)"], [.93, "rgba(0,0,0,.34)"], [1, "rgba(0,0,0,.6)"]],
  flat: s => [[0, `rgba(255,255,255,${.3 * s})`], [.35, `rgba(255,255,255,${.05 * s})`], [.7, "rgba(0,0,0,.08)"], [1, "rgba(0,0,0,.4)"]],
  blade: s => [[0, `rgba(255,255,255,${.25 * s})`], [.45, `rgba(255,255,255,${.05 * s})`], [.52, "rgba(0,0,0,.18)"], [.7, `rgba(255,255,255,${.28 * s})`], [1, "rgba(0,0,0,.3)"]],
};

function fillMaterial(g, part, fr, mat, rnd, S) {
  const M = MAT[mat] || MAT.polymer;
  if (M.wood) {
    const base = part.tint || "#8a5430";
    g.fillStyle = frameGrad(g, fr, [[0, shadeHex(base, .25)], [.5, base], [1, shadeHex(base, -.55)]]); g.fill(part.p2, part.rule);
    inFrame(g, fr, (hw, hh) => {
      for (let k = 0; k < 34; k++) {
        g.strokeStyle = rnd() < .6 ? "rgba(40,16,4,.35)" : "rgba(255,220,170,.10)"; g.lineWidth = .25 + rnd() * .7; g.beginPath();
        const v0 = -hh - 4 + rnd() * (hh * 2 + 8), ph = rnd() * 6, amp = .6 + rnd() * 1.6;
        for (let u = -hw - 2; u <= hw + 2; u += 2) { const v = v0 + Math.sin(u * .05 + ph) * amp + Math.sin(u * .17 + k) * .4; u > -hw - 2 ? g.lineTo(u, v) : g.moveTo(u, v) } g.stroke();
      }
      for (let i = 0; i < 2; i++) { const u = (rnd() - .5) * hw * 1.6, v = (rnd() - .5) * hh; g.strokeStyle = "rgba(40,16,4,.35)"; for (let k = 1; k < 5; k++) { g.lineWidth = .35; g.beginPath(); g.ellipse(u, v, k * 2.4, k * .9, 0, 0, 7); g.stroke() } }
    });
    return;
  }
  if (M.carbon) {
    g.fillStyle = "#15171b"; g.fill(part.p2, part.rule);
    inFrame(g, fr, (hw, hh) => { const s = 2.2; for (let u = -hw - s; u < hw + s; u += s) for (let v = -hh - s; v < hh + s; v += s) { const o = Math.round((u + v) / s) % 2; g.fillStyle = o ? "#2a2e35" : "#101216"; g.fillRect(u, v, s, s); g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(u, v, o ? s : .4, o ? .4 : s) } });
    return;
  }
  if (M.glass) {
    g.fillStyle = frameGrad(g, fr, [[0, "#0d1f3a"], [.4, "#2f6fd6"], [.6, "#7b3fd0"], [1, "#0a1020"]], true); g.fill(part.p2, part.rule);
    g.fillStyle = frameGrad(g, fr, [[0, "rgba(255,255,255,.65)"], [.35, "rgba(255,255,255,0)"], [1, "rgba(255,255,255,0)"]]); g.fill(part.p2, part.rule);
    return;
  }
  g.fillStyle = frameGrad(g, fr, tintStops(M.stops, part.tint)); g.fill(part.p2, part.rule);
  if (M.brushed) inFrame(g, fr, (hw, hh) => { for (let v = -hh; v < hh; v += .45) { g.fillStyle = `rgba(255,255,255,${rnd() * .07 * M.brushed})`; g.fillRect(-hw, v, hw * 2, .22) } });
  if (M.stipple || M.bead || M.grain) { g.fillStyle = noisePat(g, M.grain ? "grain" : M.stipple ? "stipple" : "bead"); g.fill(part.p2, part.rule) }
  if (M.weave) inFrame(g, fr, (hw, hh) => { for (let u = -hw; u < hw; u += 1.1) { g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(u, -hh, .45, hh * 2) } for (let v = -hh; v < hh; v += 1.1) { g.fillStyle = "rgba(0,0,0,.14)"; g.fillRect(-hw, v, hw * 2, .45) } });
}

// Шум для шероховатых материалов: готовые тайлы вместо тысяч точек
const NOISE = {};
function noisePat(g, kind) {
  if (!NOISE[kind]) {
    const c = mkCanvas(96, 96); const x = c.getContext("2d"), r = rng(hseed(kind));
    const n = kind === "grain" ? 900 : kind === "stipple" ? 1600 : 1100;
    for (let i = 0; i < n; i++) {
      const px = r() * 96, py = r() * 96;
      if (kind === "stipple") { x.fillStyle = `rgba(0,0,0,${.2 + r() * .35})`; x.beginPath(); x.arc(px, py, .5 + r() * .5, 0, 7); x.fill(); x.fillStyle = `rgba(255,255,255,${r() * .1})`; x.fillRect(px - .6, py - .8, .6, .6) }
      else if (kind === "grain") { x.fillStyle = `rgba(0,0,0,${r() * .35})`; x.beginPath(); x.arc(px, py, .3 + r() * .5, 0, 7); x.fill() }
      else { x.fillStyle = r() < .5 ? `rgba(255,255,255,${r() * .08})` : `rgba(0,0,0,${r() * .2})`; x.fillRect(px, py, .8, .8) }
    }
    NOISE[kind] = c;
  }
  const p = g.createPattern(NOISE[kind], "repeat"); if (p.setTransform && typeof DOMMatrix !== "undefined") p.setTransform(new DOMMatrix().scale(.35)); return p;
}
/* ---------- Текстуры скинов: кэш с ограничением ---------- */
const TEXC = new Map();
function skinTex(skin, TS) {
  const k = skin.id + "@" + TS; if (TEXC.has(k)) { const v = TEXC.get(k); TEXC.delete(k); TEXC.set(k, v); return v }
  const px = PAT_PIXEL.has(skin.pat), cv = mkCanvas(px ? TW : TW * TS, px ? TH : TH * TS); const g = cv.getContext("2d"); if (!px) g.scale(TS, TS);
  PAT[skin.pat](g, TW, TH, skin.c, rng(hseed(skin.id)));
  TEXC.set(k, cv); if (TEXC.size > 48) TEXC.delete(TEXC.keys().next().value);
  return cv;
}
// Обтекание: текстура «наматывается» на цилиндр по поперечной оси детали
function drawWrapped(g, tex, fr, wrap, offU, offV) {
  const sx = tex.width / TW, sy = tex.height / TH;
  inFrame(g, fr, (hw, hh) => {
    const N = Math.max(6, Math.min(80, Math.ceil(fr.h * 2.2))), arc = fr.h * lerp(1, Math.PI / 2, wrap);
    const w = Math.min(TW - 1, fr.w + 2), u0 = clamp(offU, 0, TW - w - .01);
    for (let i = 0; i < N; i++) {
      const v0 = -1 + 2 * i / N, v1 = -1 + 2 * (i + 1) / N;
      const m = v => lerp(v, Math.asin(clamp(v, -1, 1)) / (Math.PI / 2), wrap);
      const t0 = m(v0), t1 = m(v1);
      let ty0 = offV + t0 * arc / 2, th = (t1 - t0) * arc / 2;
      ty0 = clamp(ty0, 0, TH - .5); th = Math.max(.05, Math.min(th, TH - ty0));
      g.drawImage(tex, u0 * sx, ty0 * sy, w * sx, th * sy, -hw - 1, v0 * hh, fr.w + 2, (v1 - v0) * hh + .06);
    }
  });
}

/* ---------- Декали: винты, насечки, гравировка, прорези ---------- */
function decal(g, d, rnd, wear) {
  switch (d.k) {
    case "screw": { const { x, y, r } = d; g.fillStyle = "rgba(0,0,0,.6)"; g.beginPath(); g.arc(x, y + .2, r + .35, 0, 7); g.fill(); const gr = g.createRadialGradient(x - r * .35, y - r * .4, 0, x, y, r); gr.addColorStop(0, "#f2f4f6"); gr.addColorStop(.55, "#8a919a"); gr.addColorStop(1, "#30343a"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = "rgba(10,10,12,.85)"; g.lineWidth = r * .32; const a = d.a ?? rnd() * 3; if (d.hex) { g.fillStyle = "#15171a"; g.beginPath(); for (let i = 0; i < 6; i++) g.lineTo(x + Math.cos(i * 1.047 + a) * r * .45, y + Math.sin(i * 1.047 + a) * r * .45); g.fill() } else { g.beginPath(); g.moveTo(x - Math.cos(a) * r * .7, y - Math.sin(a) * r * .7); g.lineTo(x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7); g.stroke() } break }
    case "rivet": { const { x, y, r } = d; const gr = g.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); gr.addColorStop(0, "rgba(255,255,255,.8)"); gr.addColorStop(.6, "rgba(160,165,170,.6)"); gr.addColorStop(1, "rgba(0,0,0,.6)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); break }
    case "serr": { const { x, y, w, h, n, a = 0 } = d; g.save(); g.translate(x, y); g.rotate(a); for (let i = 0; i < n; i++) { const u = i * w / (n - 1 || 1); g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(u - .25, 0, .5, h); g.fillStyle = "rgba(255,255,255,.22)"; g.fillRect(u + .3, 0, .3, h) } g.restore(); break }
    case "knurl": { const { x, y, w, h } = d; g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.lineWidth = .3; for (let i = -h; i < w + h; i += 1.1) { g.strokeStyle = "rgba(0,0,0,.45)"; g.beginPath(); g.moveTo(x + i, y); g.lineTo(x + i + h, y + h); g.stroke(); g.beginPath(); g.moveTo(x + i + h, y); g.lineTo(x + i, y + h); g.stroke() } g.restore(); break }
    case "slot": { const p = d.p2; g.fillStyle = d.col || "rgba(6,7,9,.92)"; g.fill(p); g.save(); g.clip(p); g.strokeStyle = "rgba(0,0,0,.9)"; g.lineWidth = 1.2; g.translate(0, .5); g.stroke(p); g.restore(); g.save(); g.translate(0, .45); g.strokeStyle = "rgba(255,255,255,.16)"; g.lineWidth = .35; g.stroke(p); g.restore(); break }
    case "groove": { const p = d.p2; g.strokeStyle = "rgba(0,0,0,.55)"; g.lineWidth = d.w || .6; g.stroke(p); g.save(); g.translate(0, (d.w || .6) * .8); g.strokeStyle = "rgba(255,255,255,.16)"; g.lineWidth = (d.w || .6) * .6; g.stroke(p); g.restore(); break }
    case "text": { g.save(); g.translate(d.x, d.y); g.rotate(d.a || 0); g.font = `700 ${d.s}px "Golos Text",sans-serif`; g.textBaseline = "middle"; g.fillStyle = "rgba(255,255,255,.22)"; g.fillText(d.t, .25, .3); g.fillStyle = "rgba(0,0,0,.6)"; g.fillText(d.t, 0, 0); g.restore(); break }
    case "rail": { const { x, y, w, h = 2, pitch = 2.4 } = d; for (let u = 0; u < w - 1; u += pitch) { g.fillStyle = "rgba(0,0,0,.7)"; g.fillRect(x + u + pitch * .55, y, pitch * .45, h); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x + u, y, pitch * .5, .35) } break }
    case "stipple": { g.fillStyle = noisePat(g, "stipple"); g.fill(d.p2); g.fill(d.p2); break }
    case "lens": { const { x, y, r } = d; const gr = g.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); gr.addColorStop(0, "#9fd0ff"); gr.addColorStop(.35, "#2a5fd0"); gr.addColorStop(.75, "#5a1f9a"); gr.addColorStop(1, "#05060c"); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r * .35, r, 0, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.ellipse(x - r * .08, y - r * .45, r * .08, r * .22, 0, 0, 7); g.fill(); break }
    case "dot": { g.fillStyle = d.c; g.shadowColor = d.c; g.shadowBlur = 3; g.beginPath(); g.arc(d.x, d.y, d.r, 0, 7); g.fill(); g.shadowBlur = 0; break }
  }
}

/* ---------- Сборка схемы: подгонка под рамку 256×100 и Path2D ---------- */
const VW = 256, VH = 100;
const ASM = new Map();
function assemble(typeKey) {
  if (ASM.has(typeKey)) return ASM.get(typeKey);
  const W = WEAPON[typeKey]; const parts = W.build();
  const b = boundsOf(parts.map(p => p.sh)); const pad = W.pad ?? 5;
  const k = Math.min((VW - pad * 2) / (b[2] - b[0]), (VH - pad * 2) / (b[3] - b[1]));
  const fit = { x: VW / 2 - k * (b[0] + b[2]) / 2, y: VH / 2 - k * (b[1] + b[3]) / 2, a: 0, k };
  const P = (x, y) => tfPt(fit, x, y);
  const out = parts.map((p, i) => {
    const sh = p.sh.tf(fit); const q = Object.assign({}, p, { sh, i });
    q.p2 = new Path2D(sh.d()); q.rule = sh.holes.length ? "evenodd" : "nonzero"; q.fr = sh.frame();
    q.dec = (p.dec || []).map(d => {
      const e = Object.assign({}, d);
      if (d.sh) { const s2 = d.sh.tf(fit); e.p2 = new Path2D(s2.d()); e.b = boundsOf([s2]) }
      if (d.line) { const pts = d.line.map(([x, y]) => P(x, y)); e.p2 = new Path2D("M" + pts.map(p => p.map(v => v.toFixed(2)).join(" ")).join("L")) }
      if ("x" in d) { [e.x, e.y] = P(d.x, d.y) } ["r", "w", "h", "s", "pitch"].forEach(kk => { if (kk in d) e[kk] = d[kk] * k });
      return e;
    });
    return q;
  });
  const res = { parts: out, k, turbo: W.turbo ? P(...W.turbo) : null, union: new Path2D(out.filter(p => !p.ghost).map(p => p.sh.d()).join("")) };
  ASM.set(typeKey, res); return res;
}

/* ---------- Главный рендер ---------- */
let SCR = null, AMB = null;
function scratch(w, h) { if (!SCR) SCR = mkCanvas(w, h); if (SCR.width !== w || SCR.height !== h) { SCR.width = w; SCR.height = h } const g = SCR.getContext("2d"); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); return [SCR, g] }
// spec: {type, skin:{id,pat,c,metal}, tier, turbo}
function renderGun(spec, S) {
  const A = assemble(spec.type), W = Math.round(VW * S), H = Math.round(VH * S);
  const cv = mkCanvas(W, H); const g = cv.getContext("2d"); g.scale(S, S);
  const skin = spec.skin, tier = spec.tier ?? 0, wf = [0, .1, .3, .55, .95][tier];
  const rnd = rng(hseed(spec.type + "|" + (skin ? skin.id : "-") + "|" + tier));
  const tex = skin ? skinTex(skin, S > 2.5 ? 3 : 2) : null;
  // общая тень
  g.save(); g.shadowColor = "rgba(0,0,0,.7)"; g.shadowBlur = 7 * S; g.shadowOffsetY = 4 * S; g.fillStyle = "#000"; g.fill(A.union, "evenodd"); g.restore();
  g.save(); g.globalCompositeOperation = "destination-out"; g.fill(A.union); g.restore();
  for (const part of A.parts) {
    const fr = part.fr, p2 = part.p2, rule = part.rule;
    // AO: мягкая тень детали на уже нарисованные
    if (part.i > 0 && !part.noAO) { g.save(); g.globalCompositeOperation = "source-atop"; g.shadowColor = "rgba(0,0,0,.75)"; g.shadowBlur = 2.2 * S; g.shadowOffsetY = .5 * S; g.fillStyle = "#000"; g.fill(p2, rule); g.restore() }
    g.save(); g.clip(p2, rule);
    fillMaterial(g, part, fr, part.mat, rnd, S);
    const useSkin = skin && part.skin;
    if (useSkin) {
      const [sc, sg] = scratch(W, H); sg.scale(S, S); sg.save(); sg.clip(p2, rule);
      const offU = (hseed(part.id + skin.id) % 1000) / 1000 * Math.max(0, TW - fr.w - 2), offV = TH / 2 + ((hseed(part.id) % 100) / 100 - .5) * 20;
      drawWrapped(sg, tex, fr, part.wrap ?? .6, offU, offV);
      // выцветание
      if (wf > .05) { sg.globalCompositeOperation = "saturation"; sg.fillStyle = `rgba(128,128,128,${wf * .55})`; sg.fill(p2, rule); sg.globalCompositeOperation = "screen"; sg.fillStyle = `rgba(90,85,80,${wf * .22})`; sg.fill(p2, rule) }
      sg.restore();
      // износ: стираем краску по краям, царапины, проплешины
      if (wf > 0) {
        sg.save(); sg.globalCompositeOperation = "destination-out"; sg.clip(p2, rule);
        sg.lineWidth = .3 + wf * 3.2; sg.setLineDash([.4 + rnd() * 2, 1 + (1 - wf) * 7, .3 + wf * 6, 2]); sg.strokeStyle = "#000"; sg.stroke(p2);
        const ns = Math.round(wf * fr.w * fr.h * .05);
        for (let i = 0; i < ns; i++) { const x = fr.cx + (rnd() - .5) * fr.w * 1.1, y = fr.cy + (rnd() - .5) * fr.h * 1.1; sg.lineWidth = .15 + rnd() * .35; sg.beginPath(); sg.moveTo(x, y); const a = rnd() * 6.28, l = 1 + rnd() * 6; sg.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l * .5); sg.stroke() }
        const nb = Math.round(wf * wf * fr.w * fr.h * .012);
        for (let i = 0; i < nb; i++) { const x = fr.cx + (rnd() - .5) * fr.w, y = fr.cy + (rnd() - .5) * fr.h, s = .8 + rnd() * (2 + wf * 7); sg.globalAlpha = .5 + rnd() * .5; smoothBlob(sg, x, y, s, s * (.5 + rnd() * .5), rnd, 8, .9); sg.fill() }
        sg.restore();
      }
      g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(sc, 0, 0); g.setTransform(S, 0, 0, S, 0, 0);
    }
    // декали внутри детали
    for (const d of part.dec) decal(g, d, rnd, wf);
    // объём: поперечный свет, блик
    const M = MAT[part.mat] || MAT.polymer;
    const spec_ = useSkin ? (skin.metal ? .95 : .62) : (M.spec ?? .3);
    g.fillStyle = frameGrad(g, fr, PROF[part.prof || "box"](spec_)); g.fill(p2, rule);
    g.fillStyle = AMB || (AMB = (() => { const a = g.createLinearGradient(0, 0, VW * .6, VH * 1.4); a.addColorStop(0, "rgba(255,255,255,.07)"); a.addColorStop(.5, "rgba(0,0,0,0)"); a.addColorStop(1, "rgba(0,0,0,.18)"); return a })()); g.fill(p2, rule);
    if (useSkin && skin.metal || (!useSkin && M.spec > .6)) { g.globalCompositeOperation = "overlay"; g.fillStyle = frameGrad(g, fr, [[0, "rgba(255,255,255,0)"], [.42, "rgba(255,255,255,.25)"], [.5, "rgba(255,255,255,.55)"], [.58, "rgba(255,255,255,.2)"], [1, "rgba(255,255,255,0)"]], true); g.fill(p2, rule); g.globalCompositeOperation = "source-over" }
    // грязь и ржавчина у сильного износа
    if (wf > .4) {
      g.globalCompositeOperation = "multiply";
      const n = Math.round((wf - .3) * 26);
      for (let i = 0; i < n; i++) { const x = fr.cx + (rnd() - .5) * fr.w, y = fr.cy + (rnd() - .2) * fr.h * .8, s = 1 + rnd() * 5; g.fillStyle = rad(g, x, y, 0, s, [`rgba(96,70,44,${.35 + wf * .3})`, "rgba(96,70,44,0)"]); g.fillRect(x - s, y - s, s * 2, s * 2) }
      g.globalCompositeOperation = "source-over";
      if (tier >= 4 && /steel|blued|alu/.test(part.mat)) for (let i = 0; i < 18; i++) { const x = fr.cx + (rnd() - .5) * fr.w, y = fr.cy + (rnd() - .5) * fr.h; g.fillStyle = `rgba(${150 + rnd() * 50 | 0},${70 + rnd() * 30 | 0},30,${.3 + rnd() * .4})`; g.beginPath(); g.arc(x, y, .3 + rnd() * 1.1, 0, 7); g.fill() }
    }
    // фаска и контровой свет
    g.lineWidth = 1.3; g.strokeStyle = frameGrad(g, fr, [[0, "rgba(255,255,255,.5)"], [.3, "rgba(255,255,255,.06)"], [.7, "rgba(0,0,0,.05)"], [1, "rgba(0,0,0,.5)"]]); g.stroke(p2);
    g.lineWidth = .8; const rim = g.createLinearGradient(0, 0, VW, 0); rim.addColorStop(0, "rgba(160,190,255,0)"); rim.addColorStop(.75, "rgba(160,190,255,.05)"); rim.addColorStop(1, "rgba(190,215,255,.32)"); g.strokeStyle = rim; g.stroke(p2);
    g.restore();
    g.lineWidth = .45; g.strokeStyle = "rgba(6,6,9,.85)"; g.stroke(p2);
  }
  if (spec.turbo && A.turbo) { const [x, y] = A.turbo; g.save(); g.fillStyle = "#0c0d10"; g.strokeStyle = "rgba(0,0,0,.9)"; g.lineWidth = .4; g.beginPath(); g.roundRect(x - 9, y - 2.6, 18, 5.2, 1.2); g.fill(); g.stroke(); g.fillStyle = "#ff9a1f"; g.shadowColor = "#ff9a1f"; g.shadowBlur = 3; g.font = '800 3.6px "Golos Text",sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("TURBO", x, y + .2); g.restore() }
  return cv;
}

/* ---------- Кэш готовых картинок и очередь отрисовки ---------- */
const IMGC = new Map();
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
const skinRef = s => s ? s.id : "-";
function gunKey(spec, sz) { return spec.type + "|" + skinRef(spec.skin) + "|" + (spec.tier ?? 0) + "|" + (spec.turbo ? 1 : 0) + "|" + sz }
const SIZES = { sm: 1.6, md: 2.4, lg: 5 };
// Синхронная отрисовка (крупный осмотр, показ дропа)
function gunURL(spec, sz = "sm") { const k = gunKey(spec, sz); let u = IMGC.get(k); if (!u) { u = renderGun(spec, SIZES[sz]).toDataURL("image/webp", .9); IMGC.set(k, u) } return u }
/*WORKER-END*/
// Карточки рисуются в фоне: в Web Worker на OffscreenCanvas, чтобы прокрутка и анимации не тормозили.
// Если воркер недоступен — рисуем частями на основном потоке.
const GQ = []; let gqOn = false, RW = null, rwReady = false, rwBusy = 0; const RW_WAIT = new Map();
function initWorker(src) {
  try {
    const url = URL.createObjectURL(new Blob([src + "\n;self.postMessage({ready: typeof OffscreenCanvas !== 'undefined' && !!new OffscreenCanvas(4,4).getContext('2d')});"], { type: "text/javascript" }));
    RW = new Worker(url);
    RW.onmessage = e => {
      const d = e.data; if ("ready" in d) { rwReady = !!d.ready; if (!rwReady) { RW.terminate(); RW = null } kickGQ(); return }
      rwBusy--; const ims = RW_WAIT.get(d.k) || []; RW_WAIT.delete(d.k);
      if (d.blob) { const u = URL.createObjectURL(d.blob); IMGC.set(d.k, u); ims.forEach(im => { if (im.dataset.k === d.k) im.src = u }) }
      kickGQ();
    };
    RW.onerror = () => { RW = null; rwReady = false; kickGQ() };
  } catch (e) { RW = null }
}
function gunImg(im, spec, sz = "sm") { const k = gunKey(spec, sz); im.dataset.k = k; const u = IMGC.get(k); if (u) { im.src = u; return im } im.src = BLANK; GQ.push([im, spec, sz, 0]); kickGQ(); return im }
function kickGQ() { if (!gqOn && GQ.length) { gqOn = true; setTimeout(runGQ, 0) } }
// Сначала картинки в окне просмотра, потом остальные отрисованные; скрытые (display:none) ждут, вынутые из DOM отбрасываются
const visible = im => im.isConnected && im.getClientRects().length > 0;
const inView = im => { const r = im.getBoundingClientRect(); return r.bottom > -80 && r.top < innerHeight + 80 };
function runGQ() {
  gqOn = false; const t0 = performance.now(), later = [], vis = [];
  for (const e of GQ) { const [im, spec, sz] = e; if (im.dataset.k !== gunKey(spec, sz)) continue; const u = IMGC.get(im.dataset.k); if (u) { im.src = u; continue } (visible(im) ? vis : later).push(e) }
  GQ.length = 0;
  const now = vis.filter(e => inView(e[0])), off = vis.filter(e => !inView(e[0]));
  for (const q of [now, off]) while (q.length) {
    const e = q[0], [im, spec, sz] = e, k = im.dataset.k;
    if (RW && rwReady) { if (RW_WAIT.has(k)) { RW_WAIT.get(k).push(im); q.shift(); continue } if (rwBusy >= 3) break; RW_WAIT.set(k, [im]); rwBusy++; RW.postMessage({ k, type: spec.type, skin: skinRef(spec.skin), tier: spec.tier ?? 0, turbo: !!spec.turbo, S: SIZES[sz] }); q.shift(); continue }
    if (RW && !rwReady) break; // воркер ещё загружается
    if (performance.now() - t0 > 9) break; q.shift(); im.src = gunURL(spec, sz);
  }
  GQ.push(...now, ...off, ...later.filter(e => e[0].isConnected ? ++e[3] < 400 : ++e[3] < 40));
  if (GQ.length) { gqOn = true; setTimeout(runGQ, (RW && rwReady) ? (rwBusy >= 3 ? 30 : 8) : now.length || off.length ? 4 : 40) }
}
/*WORKER-START*/
