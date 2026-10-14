/* ================= Общие элементы интерфейса ================= */
let busy = false, curTab = "cases";
const setBusy = v => { busy = v; document.body.classList.toggle("busy", v) };
// ---------- Тосты ----------
function toast(msg, kind = "") { const box = $("toasts"); const t = el("div", "toast " + kind); t.textContent = msg; box.append(t); while (box.children.length > 3) box.firstChild.remove(); setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300) }, kind === "ach" ? 3600 : 2600) }
// ---------- Модальное окно ----------
let modalClose = null;
function openModal(build, cls = "") {
  const m = $("mbox"); m.className = "mbox " + cls; m.innerHTML = ""; m.style.removeProperty("--rc");
  const x = el("button", "mclose", '<svg viewBox="0 0 24 24" class="ico" style="width:20px;height:20px"><path d="M6 6l12 12M18 6 6 18"/></svg>'); x.setAttribute("aria-label", "Закрыть"); x.onclick = closeModal; m.append(x);
  modalClose = build(m) || null; $("modal").hidden = false; const f = m.querySelector("[data-focus]") || x; setTimeout(() => f.focus({ preventScroll: true }), 30);
}
function closeModal() { if ($("modal").hidden) return; $("modal").hidden = true; const c = modalClose; modalClose = null; if (c) c() }
$("modal").addEventListener("click", e => { if (e.target === $("modal")) closeModal() });
addEventListener("keydown", e => { if (e.key === "Escape") { if (!$("reveal").hidden) closeReveal(); else closeModal() } });
function confirmBox(title, text, okText, onOk, danger) {
  openModal(m => { m.insertAdjacentHTML("beforeend", `<h3>${esc(title)}</h3><p class="sub">${esc(text)}</p>`); const r = el("div", "row gap8 wrap"); const ok = el("button", danger ? "btn" : "btn", esc(okText)); ok.dataset.focus = 1; if (danger) ok.style.background = "linear-gradient(135deg,#ff6a6a,#e0354e)"; ok.onclick = () => { closeModal(); onOk() }; const no = el("button", "ghost", "Отмена"); no.onclick = closeModal; r.append(ok, no); m.append(r) }, "sm");
}
// ---------- Деньги и опыт ----------
const cprice = cs => { if (cs.free) return 0; let p = cs.price * MODE().price; if (ALL.mode === "norm" && cs === dayCase()) p *= .8; return Math.max(1, Math.round(p)) };
const canPay = x => INF() || S.bal >= x;
function balPulse(cls) { const b = $("balBox"); b.classList.remove("flash", "minus"); void b.offsetWidth; b.classList.add(cls) }
function pay(x) { x = Math.max(0, Math.round(x)); if (!x) return; S.st.spent += x; addXP(x * MODE().xp); if (!INF()) { S.bal = Math.max(0, S.bal - x); balPulse("minus") } balTrack() }
function earn(x) { x = Math.max(0, Math.round(x)); if (!x) return; if (!INF()) { S.bal += x; balPulse("flash") } balTrack() }
function balTrack() { const t = Date.now(), last = S.balHist[S.balHist.length - 1], v = INF() ? -S.st.spent + S.st.won : S.bal; if (last && t - last[0] < 15e3) last[1] = v; else S.balHist.push([t, v]); if (S.balHist.length > 120) S.balHist.splice(0, S.balHist.length - 120); S.st.maxBal = Math.max(S.st.maxBal, S.bal) }
function addXP(x) {
  S.xp += x; const l = lvlOf(S.xp);
  if (l > S.lvl) { const from = S.lvl; S.lvl = l; let gain = 0; if (ALL.mode === "norm") for (let k = from + 1; k <= l; k++) gain += k * 120; if (gain) { S.bal += gain; balTrack() } SND.level(); toast(gain ? `Уровень ${l}! Награда ${fmt(gain)}` : `Уровень ${l}!`, "good"); renderCasesSoon() }
}
// ---------- Инвентарь ----------
function addInv(inst, src) {
  inst.src = src; S.inv.unshift(inst); const p = priceOf(inst), r = instR(inst);
  if (inst.kind !== "case") { S.st.rc[r]++; if (inst.t) S.st.turbo++; if (inst.f < .01) S.st.perfect++; const it = catItem(inst.k); if (it.cls === "melee") S.st.knives++; if (it.cls === "gloves") S.st.gloves++ }
  if (!S.st.best || p > S.st.best.p) S.st.best = { n: instName(inst), p };
  S.hist.unshift(inst.kind === "case" ? { cid: inst.cid, p, src, ts: Date.now() } : { k: inst.k, f: inst.f, t: inst.t, p, src, ts: Date.now() }); if (S.hist.length > 60) S.hist.length = 60;
  S.st.maxInv = Math.max(S.st.maxInv, S.inv.length);
  return inst;
}
const invHas = u => S.inv.some(i => i.u === u);
function removeInv(list) { const ids = new Set(list.map(x => x.u)); S.inv = S.inv.filter(x => !ids.has(x.u)); S.show = S.show.filter(u => !ids.has(u)); ids.forEach(u => { invSel.delete(u); ctSel.delete(u); upSel.delete(u) }) }
// Продажа: только того, что ещё лежит в инвентаре — двойная продажа невозможна
function sell(list, quiet) {
  const live = list.filter(x => invHas(x.u)); if (!live.length) return 0;
  const v = live.reduce((a, b) => a + priceOf(b), 0); removeInv(live); earn(v); S.st.sold += live.length; S.st.soldSum += v; track("sell", { n: live.length, v });
  save(); refresh(); if (!quiet) toast(`Продано ${live.length} шт. за ${fmt(v)}`, "good"); SND.sell(); return v;
}
// ---------- Картинки предметов ----------
function itemImg(inst, sz = "sm", cls = "") {
  const im = new Image(); im.alt = ""; if (cls) im.className = cls; im.decoding = "async";
  if (inst.kind === "case") { im.src = caseArt(CASE_BY[inst.cid]).full; return im }
  return gunImg(im, specOf(inst), sz);
}
const rcolor = r => RAR[r].h;
function trendHTML(tr) { if (Math.abs(tr) < .001) return ""; const up = tr > 0; return `<span class="trend ${up ? "up" : "dn"}">${up ? "▲" : "▼"}${Math.abs(tr * 100).toFixed(1).replace(".", ",")}%</span>` }
// Карточка предмета
function icard(inst, o = {}) {
  const r = instR(inst), d = el("div", "icard r" + r); d.style.setProperty("--rc", rcolor(r)); if (r >= 6 && o.shine) d.classList.add("shine");
  d.append(itemImg(inst));
  const p = o.price ?? priceOf(inst);
  if (inst.kind === "case") d.insertAdjacentHTML("beforeend", `<span class="a">Кейс</span><span class="b">${esc(CASE_BY[inst.cid].n)}</span><span class="w">не открыт</span><span class="p">${fmt(p)}</span>`);
  else { const it = catItem(inst.k); d.insertAdjacentHTML("beforeend", `<span class="a">${esc(it.wn)}</span><span class="b">${esc(it.sn)}</span>${o.nowear ? "" : `<span class="w">${WEAR[tierOf(inst.f)].n} · ${inst.f.toFixed(3)}</span>`}<span class="p">${fmt(p)}${o.trend ? trendHTML(trendOf(inst)) : ""}</span>`) }
  if (inst.t) d.append(el("span", "tb", "TURBO"));
  if (o.sel !== undefined) { d.append(el("span", "chk")); if (o.sel) d.classList.add("sel") }
  if (o.click) { d.tabIndex = 0; d.setAttribute("role", "button"); d.setAttribute("aria-label", instName(inst) + ", " + fmt(p)); d.onclick = o.click; d.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); o.click(e) } } }
  return d;
}
// Ячейка рулетки / содержимого
function cell(inst, extra) {
  const r = instR(inst), d = el("div", "cell r" + r); d.style.setProperty("--rc", rcolor(r)); if (r >= 6) d.classList.add("shine");
  d.append(itemImg(inst));
  if (inst.kind === "case") d.insertAdjacentHTML("beforeend", `<span class="a">Кейс</span><span class="b">${esc(CASE_BY[inst.cid].n)}</span>`);
  else { const it = catItem(inst.k); d.insertAdjacentHTML("beforeend", `<span class="a">${esc(it.wn)}</span><span class="b">${esc(it.sn)}</span>`) }
  if (extra) d.insertAdjacentHTML("beforeend", extra);
  if (inst.t) d.append(el("span", "tb", "TURBO"));
  return d;
}
const probe = e => e.cid ? { kind: "case", cid: e.cid } : { k: e.key, f: .25, t: false };

// ---------- Виртуальная сетка: в DOM только видимые ряды, ряды переиспользуются при прокрутке ----------
class VGrid {
  constructor(box, o) { this.box = box; this.o = Object.assign({ minW: 160, rowH: 196, gap: 8 }, o); this.items = []; this.rows = new Map(); this.inner = el("div", "vin"); box.innerHTML = ""; box.append(this.inner); this.cols = 1; this.w = 0; VGrid.all.add(this); new ResizeObserver(() => { if (this.box.clientWidth !== this.w) this.layout() }).observe(box) }
  set(items) { this.items = items; this.layout() }
  layout() {
    const W = this.w = this.box.clientWidth || 300, g = this.o.gap; this.cols = Math.max(1, Math.floor((W + g) / (this.o.minW + g)));
    this.rows.forEach(r => r.remove()); this.rows.clear(); this.inner.innerHTML = "";
    if (!this.items.length) { this.box.style.height = "auto"; this.inner.style.position = "static"; if (this.o.empty) this.inner.innerHTML = this.o.empty(); return }
    this.inner.style.position = ""; const rows = Math.ceil(this.items.length / this.cols); this.box.style.height = rows * (this.o.rowH + g) - g + "px"; this.inner.style.height = "100%";
    this.scroll();
  }
  scroll() {
    if (!this.items.length || !this.box.isConnected || !this.box.getClientRects().length) return;
    const rect = this.box.getBoundingClientRect(), rh = this.o.rowH + this.o.gap, nRows = Math.ceil(this.items.length / this.cols);
    const first = Math.max(0, Math.floor(-rect.top / rh) - 2), last = Math.min(nRows - 1, Math.ceil((innerHeight - rect.top) / rh) + 2);
    for (const [k, r] of this.rows) if (k < first || k > last) { r.remove(); this.rows.delete(k) }
    for (let k = first; k <= last; k++) {
      if (this.rows.has(k)) continue; const r = el("div", "vrow"); r.style.cssText = `top:${k * rh}px;height:${this.o.rowH}px;grid-template-columns:repeat(${this.cols},minmax(0,1fr));gap:${this.o.gap}px`;
      for (let i = k * this.cols; i < Math.min(this.items.length, (k + 1) * this.cols); i++) r.append(this.o.render(this.items[i], i));
      this.inner.append(r); this.rows.set(k, r);
    }
  }
}
VGrid.all = new Set();
let vgT = 0; addEventListener("scroll", () => { if (vgT) return; vgT = requestAnimationFrame(() => { vgT = 0; VGrid.all.forEach(v => v.scroll()) }) }, { passive: true });

// ---------- Аватары: генерируются из числа ----------
const AVAC = new Map();
function avatarSVG(seed) {
  const r = rng(seed >>> 0), hue = Math.floor(r() * 360), hue2 = (hue + 40 + Math.floor(r() * 140)) % 360;
  const c1 = `hsl(${hue},70%,55%)`, c2 = `hsl(${hue2},75%,45%)`, bg = `hsl(${hue},35%,14%)`;
  let cells = ""; const n = 5, s = 12;
  for (let y = 0; y < n; y++) for (let x = 0; x < 3; x++) if (r() < .55) { const c = r() < .7 ? c1 : c2; cells += `<rect x="${10 + x * s}" y="${10 + y * s}" width="${s}" height="${s}" fill="${c}"/>`; if (x < 2) cells += `<rect x="${10 + (4 - x) * s}" y="${10 + y * s}" width="${s}" height="${s}" fill="${c}"/>` }
  const eye = r() < .5 ? `<circle cx="28" cy="34" r="4" fill="#fff"/><circle cx="52" cy="34" r="4" fill="#fff"/><circle cx="29" cy="35" r="2" fill="#111"/><circle cx="53" cy="35" r="2" fill="#111"/>` : `<rect x="22" y="31" width="36" height="7" rx="3.5" fill="#0b0b10"/><rect x="24" y="32.5" width="14" height="2" rx="1" fill="${c1}"/>`;
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" fill="${bg}"/>${cells}<rect width="80" height="80" fill="url(#g)" opacity=".35"/><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs>${eye}</svg>`;
}
function avatarURL(seed) { let u = AVAC.get(seed); if (!u) { u = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(avatarSVG(seed)); AVAC.set(seed, u) } return u }

// ---------- Эффекты: конфетти, вспышка, тряска ----------
const FX = (() => {
  const cv = $("fx"), g = cv.getContext("2d"); let pts = [], on = false;
  function loop() { g.clearRect(0, 0, cv.width, cv.height); pts = pts.filter(p => --p.l > 0); for (const p of pts) { p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.globalAlpha = Math.min(1, p.l / 40); g.fillStyle = p.c; if (p.s2) { g.beginPath(); g.arc(0, 0, p.s / 2, 0, 7); g.fill() } else g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore() } if (pts.length) requestAnimationFrame(loop); else { on = false; g.clearRect(0, 0, cv.width, cv.height) } }
  return {
    confetti(colors, n = 160, x = innerWidth / 2, y = innerHeight * .42, spread = 1) { if (RM()) return; cv.width = innerWidth; cv.height = innerHeight; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 2.4 * spread, v = 6 + Math.random() * 13; pts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 4 + Math.random() * 6, c: colors[i % colors.length], a: Math.random() * 6, va: (Math.random() - .5) * .4, l: 80 + Math.random() * 70, s2: Math.random() < .25 }) } if (!on) { on = true; requestAnimationFrame(loop) } },
    quake() { if (RM()) return; document.body.classList.remove("quake"); void document.body.offsetWidth; document.body.classList.add("quake"); setTimeout(() => document.body.classList.remove("quake"), 600) },
  };
})();
function celebrate(r) {
  const c = rcolor(r);
  if (r >= 4) FX.confetti([c, "#ffffff", "#ffb21f"], r >= 6 ? 260 : r >= 5 ? 180 : 70);
  if (r >= 5) { FX.quake(); setTimeout(() => FX.confetti([c, "#ffffff"], 120, innerWidth * .2, innerHeight * .6, .6), 250); setTimeout(() => FX.confetti([c, "#ffffff"], 120, innerWidth * .8, innerHeight * .6, .6), 400) }
  SND.drop(r);
}
