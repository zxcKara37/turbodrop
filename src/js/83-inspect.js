/* ================= Осмотр предмета: псевдо-3D, блик, вращение ================= */
function inspectView(spec, o = {}) {
  const wrap = el("div", "inspect"); wrap.style.setProperty("--rc", o.rc || "var(--accent)");
  wrap.append(el("div", "glow"));
  const g3 = el("div", "gun3d"); wrap.append(g3);
  const url = gunURL(spec, "lg");
  // толщина: несколько затемнённых слоёв по глубине, лицевая и обратная (зеркальная) стороны
  for (let z = -3; z <= 3; z++) { const l = el("div", "lay edge"); l.style.transform = `translateZ(${z * 1.2}px)`; l.innerHTML = `<img alt="" src="${url}">`; g3.append(l) }
  const front = el("div", "lay front"); front.style.transform = "translateZ(4.5px)"; front.innerHTML = `<img alt="${esc(o.alt || "")}" src="${url}">`; g3.append(front);
  const back = el("div", "lay back"); back.style.transform = "rotateY(180deg) translateZ(4.5px)"; back.innerHTML = `<img alt="" src="${url}">`; g3.append(back);
  const spec_ = el("div", "spec"); spec_.style.webkitMaskImage = spec_.style.maskImage = `url(${url})`; spec_.style.transform = "translateZ(5px)"; g3.append(spec_);
  if (spec.turbo) { const A = assemble(spec.type); if (A.turbo) { const l = el("div", "lcd"); l.style.left = A.turbo[0] / VW * 100 + "%"; l.style.top = (A.turbo[1] / VH * 100 + 9) + "%"; l.style.transform = "translate(-50%,-50%) translateZ(6px)"; l.textContent = "TURBO · " + String(o.kills || 0).padStart(6, "0"); g3.append(l) } }
  let rx = 0, ry = 0, baseY = 0, drag = null, spinning = false, raf = 0;
  const apply = () => { g3.style.transform = `rotateX(${rx}deg) rotateY(${ry + baseY}deg)`; const a = ((ry + baseY) % 360 + 360) % 360; spec_.style.opacity = a > 90 && a < 270 ? 0 : 1 };
  wrap.addEventListener("pointermove", e => {
    if (spinning) return; const r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (drag) { baseY = drag.b + (e.clientX - drag.x) * .7; ry = 0 } else { ry = (x - .5) * 26; rx = -(y - .5) * 16 }
    g3.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); g3.style.setProperty("--my", (y * 100).toFixed(1) + "%"); apply();
  });
  wrap.addEventListener("pointerdown", e => { if (spinning) return; drag = { x: e.clientX, b: baseY }; try { wrap.setPointerCapture(e.pointerId) } catch (_) { } });
  const up = () => { drag = null }; wrap.addEventListener("pointerup", up); wrap.addEventListener("pointercancel", up);
  wrap.addEventListener("pointerleave", () => { if (!drag && !spinning) { rx = 0; ry = 0; apply() } });
  const spin = () => {
    if (spinning) return; spinning = true; const from = baseY, t0 = performance.now(), D = RM() ? 1 : 4200; rx = 6; ry = 0;
    const step = t => { const k = Math.min(1, (t - t0) / D), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; baseY = from + 360 * e; g3.style.setProperty("--mx", (50 + Math.sin(k * 6.28) * 40) + "%"); apply(); if (k < 1) raf = requestAnimationFrame(step); else { spinning = false; baseY = 0; rx = 0; apply() } };
    raf = requestAnimationFrame(step);
  };
  apply();
  return { node: wrap, spin, stop: () => cancelAnimationFrame(raf) };
}
const inspectBtn = fn => { const b = el("button", "ghost sm", '<svg viewBox="0 0 24 24" class="ico"><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/></svg>Осмотреть 360°'); b.onclick = fn; return b };
function priceChartSVG(key, f, t, hours = 12, W = 600, H = 120) {
  const now = Date.now(), N = 64, pts = []; const base = catItem(key).base * WEAR[tierOf(f)].m * (t ? TURBO_M : 1);
  for (let i = 0; i < N; i++) { const tt = now - (N - 1 - i) / (N - 1) * hours * 36e5; pts.push(base * market(key, tt)) }
  const mn = Math.min(...pts), mx = Math.max(...pts), pad = (mx - mn) * .15 || 1, lo = mn - pad, hi = mx + pad;
  const X = i => i / (N - 1) * (W - 8) + 4, Y = v => H - 18 - (v - lo) / (hi - lo) * (H - 30);
  const d = pts.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join(""), up = pts[N - 1] >= pts[0], c = up ? "var(--good)" : "var(--bad)";
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:${H}px" role="img" aria-label="График цены за ${hours} ч"><line x1="4" x2="${W - 4}" y1="${Y(base)}" y2="${Y(base)}" stroke="var(--line2)" stroke-dasharray="4 4"/><path d="${d}L${X(N - 1)} ${H - 18}L4 ${H - 18}Z" fill="${c}" opacity=".12"/><path d="${d}" fill="none" stroke="${c}" stroke-width="2" vector-effect="non-scaling-stroke"/><circle cx="${X(N - 1)}" cy="${Y(pts[N - 1])}" r="4" fill="${c}"/><text x="4" y="${H - 4}" fill="var(--muted)" font-size="11">−${hours} ч</text><text x="${W - 4}" y="${H - 4}" fill="var(--muted)" font-size="11" text-anchor="end">сейчас · ${fmt(pts[N - 1])}</text><text x="${W - 4}" y="12" fill="var(--muted)" font-size="11" text-anchor="end">макс ${fmt(mx)}</text></svg>`;
}
// Карточка предмета из инвентаря
function openItem(inst) {
  if (!invHas(inst.u)) return;
  if (inst.kind === "case") return openCaseItem(inst);
  const it = catItem(inst.k), r = it.r, tier = tierOf(inst.f);
  openModal(m => {
    m.style.setProperty("--rc", rcolor(r));
    const iv = inspectView(specOf(inst), { rc: rcolor(r), kills: inst.kills, alt: it.name }); m.append(iv.node);
    const p = priceOf(inst), tr = trendOf(inst);
    m.insertAdjacentHTML("beforeend", `<div><div class="rr">${RAR[r].n}${inst.t ? " · TURBO" : ""}</div><h3>${esc(it.name)}</h3></div>`);
    const row = el("div", "row gap8 wrap"); row.append(inspectBtn(iv.spin)); m.append(row);
    m.insertAdjacentHTML("beforeend", `<div class="fl" title="Износ"><i style="left:calc(${(inst.f * 100).toFixed(2)}% - 1px)"></i></div>
    <div class="mgrid"><dl class="kv"><dt>Износ</dt><dd>${WEAR[tier].n} · ${inst.f.toFixed(5)}</dd><dt>Класс</dt><dd>${WCLS[it.cls]}</dd><dt>Текстура</dt><dd>${esc(it.skin.pn)}</dd><dt>Получен</dt><dd>${esc(inst.src || "—")}</dd>${inst.t ? `<dt>Убийств</dt><dd>${fmtN(inst.kills)}</dd>` : ""}<dt>Цена</dt><dd><b style="color:var(--accent)">${fmt(p)}</b> ${trendHTML(tr)} <span class="muted">за час</span></dd></dl>
    <div>${priceChartSVG(inst.k, inst.f, inst.t)}</div></div>`);
    const ct = el("div", "row gap8 wrap");
    const b1 = el("button", "btn", "Продать за " + fmt(p)); b1.dataset.focus = 1; b1.onclick = () => { sell([inst]); closeModal() };
    const b2 = el("button", "ghost", "В апгрейд"); b2.onclick = () => { closeModal(); upSel.clear(); upSel.add(inst.u); upTgt = null; go("upgrade") };
    const inShow = S.show.includes(inst.u);
    const b3 = el("button", "ghost", inShow ? "Убрать из витрины" : "В витрину"); b3.onclick = () => { if (inShow) S.show = S.show.filter(u => u !== inst.u); else { if (S.show.length >= 3) S.show.shift(); S.show.push(inst.u) } achCheck(); save(); closeModal(); toast(inShow ? "Убрано из витрины" : "Добавлено в витрину профиля", "good"); refresh() };
    const b4 = el("button", "ghost", ctSel.has(inst.u) ? "Убрать из контракта" : "В контракт"); b4.onclick = () => { if (ctSel.has(inst.u)) ctSel.delete(inst.u); else if (ctSel.size < 10) ctSel.add(inst.u); else return toast("В контракте уже 10 предметов", "bad"); closeModal(); go("contract") };
    ct.append(b1, b2, b3, b4); m.append(ct);
    return iv.stop;
  });
}
function openCaseItem(inst) {
  const cs = CASE_BY[inst.cid];
  openModal(m => {
    m.style.setProperty("--rc", rcolor(cs.topR)); const im = new Image(); im.src = caseArt(cs).full; im.style.cssText = "width:min(320px,80%);align-self:center"; m.append(im);
    m.insertAdjacentHTML("beforeend", `<div><div class="rr">Запечатанный кейс</div><h3>${esc(cs.n)}</h3></div><p class="sub">${cs.items.length} предметов внутри, RTP ${(cs.rtp * 100).toFixed(1).replace(".", ",")}%. Можно открыть бесплатно — он уже твой — или продать по цене кейса.</p>`);
    const ct = el("div", "row gap8 wrap"); const a = el("button", "btn", "Открыть"); a.dataset.focus = 1; a.onclick = () => { closeModal(); go("cases"); openCaseView(cs, inst) };
    const b = el("button", "ghost", "Продать за " + fmt(priceOf(inst))); b.onclick = () => { sell([inst]); closeModal() }; ct.append(a, b); m.append(ct);
  }, "sm");
}
// Предпросмотр предмета из кейса: все уровни износа
function openPreview(key) {
  const it = catItem(key); let tier = 0, turbo = false, iv = null;
  openModal(m => {
    m.style.setProperty("--rc", rcolor(it.r));
    const host = el("div"); m.append(host);
    m.insertAdjacentHTML("beforeend", `<div><div class="rr">${RAR[it.r].n}</div><h3>${esc(it.name)}</h3></div>`);
    const seg = el("div", "seg"); WEAR.forEach((w, i) => { const b = el("button", "", w.n); b.dataset.t = i; seg.append(b) });
    const tb = el("button", "ghost sm", "TURBO"); tb.setAttribute("aria-pressed", "false"); if (!it.canTurbo) tb.hidden = true;
    const info = el("p", "sub");
    const draw = () => { if (iv) iv.stop(); host.innerHTML = ""; iv = inspectView({ type: it.type, skin: it.skin, tier, turbo }, { rc: rcolor(it.r), kills: 0 }); host.append(iv.node); [...seg.children].forEach(b => b.setAttribute("aria-pressed", +b.dataset.t === tier)); tb.setAttribute("aria-pressed", turbo); const pr = it.base * WEAR[tier].m * (turbo ? TURBO_M : 1) * market(key); info.innerHTML = `${WEAR[tier].n}: сейчас около <b style="color:var(--accent)">${fmt(pr)}</b>. Текстура «${esc(it.skin.pn)}», ${WCLS[it.cls].toLowerCase()}.` };
    seg.onclick = e => { const b = e.target.closest("button"); if (!b) return; tier = +b.dataset.t; draw() }; tb.onclick = () => { turbo = !turbo; draw() };
    const row = el("div", "row gap8 wrap"); row.append(seg, tb, inspectBtn(() => iv && iv.spin())); m.append(row, info); draw();
    return () => iv && iv.stop();
  });
}
