/* ================= Кейсы: витрина, сцена, рулетка, показ дропа ================= */
let catF = "all", priceF = "all", sortF = "pop", favOnly = false, caseQ = "", cur = null, count = 1, fromInv = null;
const dayCase = () => { const pool = CASES.filter(c => !c.free && c.kind === "normal" && c.lvl <= 3); return pool[dayNo() % pool.length] };
const lockedFor = cs => cs.lvl > S.lvl;
const freeLeft = cs => { const d = S.free[cs.id]; return d === dayNo() ? (dayNo() + 1) * DAY - 3 * 3600e3 - Date.now() : 0 };
const hms = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` };
function caseArtBox(cs, cls = "art") {
  const box = el("div", cls);
  if (cs.kind !== "cases") { const tops = cs.items.filter(e => e.key).slice(0, 2); tops.forEach(e => { const im = new Image(); im.className = "w"; im.alt = ""; gunImg(im, { type: catItem(e.key).type, skin: catItem(e.key).skin, tier: 0 }); box.append(im) }) }
  const cr = new Image(); cr.className = "cr"; cr.alt = ""; cr.src = caseArt(cs).full; box.append(cr); return box;
}
/* ---------- Витрина ---------- */
function renderChips() {
  const box = $("catChips"); box.innerHTML = "";
  [["all", "Все"], ...CATS].forEach(([k, n]) => { if (k === "free" && !MODE().bonus && !INF()) return; const b = el("button"); b.dataset.c = k; b.setAttribute("aria-pressed", catF === k); b.innerHTML = `${n}<span class="n">${k === "all" ? CASES.length : CASES.filter(c => c.cat === k).length}</span>`; box.append(b) });
}
$("catChips").onclick = e => { const b = e.target.closest("button"); if (!b) return; catF = b.dataset.c; renderChips(); renderCases() };
const segSet = (id, attr, val) => [...$(id).children].forEach(b => b.setAttribute("aria-pressed", b.dataset[attr] === String(val)));
$("priceSeg").onclick = e => { const b = e.target.closest("button"); if (!b) return; priceF = b.dataset.p; segSet("priceSeg", "p", priceF); renderCases() };
$("sortSeg").onclick = e => { const b = e.target.closest("button"); if (!b) return; sortF = b.dataset.s; segSet("sortSeg", "s", sortF); renderCases() };
$("favOnly").onclick = () => { favOnly = !favOnly; $("favOnly").setAttribute("aria-pressed", favOnly); renderCases() };
$("caseQ").addEventListener("input", () => { caseQ = $("caseQ").value.trim().toLowerCase(); renderCases() });
const caseMatches = (cs, q) => cs.n.toLowerCase().includes(q) || cs.items.some(e => e.key ? catItem(e.key).name.toLowerCase().includes(q) : CASE_BY[e.cid].n.toLowerCase().includes(q));
function filteredCases() {
  let list = CASES.filter(cs => (catF === "all" || cs.cat === catF) && (!favOnly || ALL.fav.includes(cs.id)) && (!caseQ || caseMatches(cs, caseQ)));
  if (!MODE().bonus && !INF()) list = list.filter(c => !c.free);
  if (priceF !== "all") { const [a, b] = priceF.split("-").map(Number); list = list.filter(c => { const p = cprice(c); return p >= a && p < b }) }
  const pop = c => c.pop + (S.opens[c.id] || 0) * 3;
  list.sort(sortF === "cheap" ? (a, b) => cprice(a) - cprice(b) : sortF === "exp" ? (a, b) => cprice(b) - cprice(a) : sortF === "new" ? (a, b) => b.order - a.order : (a, b) => (lockedFor(a) - lockedFor(b)) || (b.free - a.free) || pop(b) - pop(a));
  return list;
}
function renderCases() {
  const box = $("cases"); box.innerHTML = ""; const list = filteredCases();
  if (!list.length) { box.innerHTML = `<div class="empty"><svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10"/></svg><b>Ничего не нашлось</b><span>${favOnly ? "В избранном пока пусто: отметь кейсы сердечком." : "Измени запрос или сбрось фильтры."}</span></div>`; return }
  const frag = document.createDocumentFragment();
  for (const cs of list) {
    const b = el("div", "ccard"); b.style.setProperty("--h", cs.hue); const lk = lockedFor(cs); if (lk) b.classList.add("locked");
    b.tabIndex = 0; b.setAttribute("role", "button"); b.setAttribute("aria-label", `${cs.n}, ${cs.free ? "бесплатно" : fmt(cprice(cs))}`);
    b.append(caseArtBox(cs));
    const p = cprice(cs), dc = ALL.mode === "norm" && cs === dayCase();
    const fav = el("button", "fav", '<svg viewBox="0 0 24 24" class="ico" style="width:18px;height:18px"><path d="M12 20s-7-4.4-9-9c-1.3-3 .6-6.5 4-6.5 2 0 3.6 1.2 5 3 1.4-1.8 3-3 5-3 3.4 0 5.3 3.5 4 6.5-2 4.6-9 9-9 9z"/></svg>'); fav.setAttribute("aria-pressed", ALL.fav.includes(cs.id)); fav.setAttribute("aria-label", "В избранное");
    fav.onclick = e => { e.stopPropagation(); toggleFav(cs); fav.setAttribute("aria-pressed", ALL.fav.includes(cs.id)); if (favOnly) renderCases() };
    b.append(fav);
    if (lk) b.insertAdjacentHTML("beforeend", `<span class="badge lock">Ур. ${cs.lvl}</span>`); else if (dc) b.insertAdjacentHTML("beforeend", '<span class="badge">−20%</span>'); else if (cs.kind !== "normal" && cs.kind !== "free") b.insertAdjacentHTML("beforeend", `<span class="badge" style="background:var(--info)">${{ guarantee: "Гарантия", mult: "×2 / ×5", cases: "Кейсы", only: "Особый" }[cs.kind]}</span>`);
    const left = cs.free ? freeLeft(cs) : 0;
    b.insertAdjacentHTML("beforeend", `<div class="nm">${esc(cs.n)}</div><div class="meta"><span>${cs.items.length} предм.</span>${cs.free ? "<span>раз в день</span>" : `<span class="rtp">RTP ${(cs.rtp * 100 / MODE().price).toFixed(1).replace(".", ",")}%</span>`}</div><div class="pr${cs.free ? " free" : ""}${lk ? " locked" : ""}">${cs.free ? (left > 0 ? hms(left) : "Бесплатно") : fmt(p)}</div>`);
    const go = () => openCaseView(cs); b.onclick = go; b.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go() } };
    frag.append(b);
  }
  box.append(frag);
}
let rcT = 0; function renderCasesSoon() { clearTimeout(rcT); rcT = setTimeout(() => { if (curTab === "cases") { renderCases(); if (cur) caseState() } }, 50) }
function toggleFav(cs) { const i = ALL.fav.indexOf(cs.id); i >= 0 ? ALL.fav.splice(i, 1) : ALL.fav.push(cs.id); save(); SND.click() }
function renderFeatured() {
  const cs = dayCase(), f = $("featured"); f.innerHTML = ""; const d = el("div", "featured"); d.style.setProperty("--h", cs.hue);
  d.append(caseArtBox(cs));
  const disc = ALL.mode === "norm";
  d.insertAdjacentHTML("beforeend", `<div><div class="eyebrow">Кейс дня</div><h3>${esc(cs.n)}</h3><p>${disc ? "Сегодня на 20% дешевле. Завтра будет другой кейс." : ALL.mode === "hard" ? "В хардкоре скидок нет, но опыта в 2,5 раза больше." : "В обычном режиме на него сегодня скидка 20%."}</p></div><div class="pr">${disc ? `<s>${fmt(cs.price)}</s>` : ""}<b>${fmt(cprice(cs))}</b><button class="btn">Открыть</button></div>`);
  d.querySelector(".btn").onclick = () => openCaseView(cs); f.append(d);
}
/* ---------- Сцена кейса ---------- */
function openCaseView(cs, inst) {
  if (busy) return; cur = cs; fromInv = inst || null; SND.unlock();
  if (cs.free || fromInv) count = 1;
  $("caseList").hidden = true; $("caseView").hidden = false; $("stage").style.setProperty("--h", cs.hue);
  const art = caseArt(cs); $("cBody").src = art.body; $("cLid").src = art.lid; $("crate").className = "crate idle"; $("crate").style.setProperty("--h", cs.hue);
  $("cvCat").textContent = CATN[cs.cat] + (cs.kind === "guarantee" ? " · гарантия" : cs.kind === "mult" ? " · множитель" : cs.kind === "cases" ? " · кейсы внутри" : "");
  $("cvName").textContent = cs.n;
  const rtp = cs.free ? "" : `<span class="rtp">RTP <b>${(cs.rtp * 100 / MODE().price).toFixed(2).replace(".", ",")}%</b></span>`;
  $("cvMeta").innerHTML = `<span>Предметов: <b>${cs.items.length}</b></span>${rtp}<span>Лучший: <b style="color:${rcolor(cs.topR)}">${RAR[cs.topR].n}</b></span>${cs.lvl ? `<span>Уровень: <b>${cs.lvl}+</b></span>` : ""}${cs.floor ? `<span>Гарантия: <b>от ${fmt(cs.floor)}</b></span>` : ""}${cs.kind === "mult" ? "<span>Множитель: <b>×2 — 12%, ×5 — 3%</b></span>" : ""}${S.opens[cs.id] ? `<span>Ты открыл: <b>${S.opens[cs.id]}</b></span>` : ""}`;
  $("favBtn").setAttribute("aria-pressed", ALL.fav.includes(cs.id));
  buildCount(); renderDrops(); $("reels").innerHTML = ""; caseState();
  scrollTo({ top: 0, behavior: RM() ? "auto" : "smooth" });
}
function closeCaseView() { if (busy) return; $("caseView").hidden = true; $("caseList").hidden = false; cur = null; fromInv = null; renderCases() }
$("caseBack").onclick = closeCaseView;
$("favBtn").onclick = () => { if (cur) { toggleFav(cur); $("favBtn").setAttribute("aria-pressed", ALL.fav.includes(cur.id)) } };
$("fastBtn").onclick = () => { ALL.fast = !ALL.fast; $("fastBtn").setAttribute("aria-pressed", ALL.fast); save() };
function buildCount() {
  const box = $("countSeg"); box.innerHTML = "";
  [1, 2, 3, 4, 5, 10].forEach(n => { const b = el("button", "", "×" + n); b.dataset.n = n; b.setAttribute("aria-pressed", n === count); b.disabled = !!(cur && (cur.free || fromInv) && n > 1); box.append(b) });
}
$("countSeg").onclick = e => { const b = e.target.closest("button"); if (!b || busy || b.disabled) return; count = +b.dataset.n; segSet("countSeg", "n", count); $("reels").innerHTML = ""; caseState(); SND.click() };
function caseState() {
  if (!cur) return; const btn = $("openBtn"), hint = $("openHint"); const tot = cprice(cur) * count; let ok = true, msg = "";
  $("fastBtn").setAttribute("aria-pressed", ALL.fast);
  if (lockedFor(cur)) { ok = false; btn.textContent = `Нужен ${cur.lvl} уровень`; msg = `Сейчас у тебя ${S.lvl}. Опыт дают открытия кейсов, батлы и задания.` }
  else if (fromInv) btn.textContent = "Открыть из инвентаря";
  else if (cur.free) { const left = freeLeft(cur); ok = left <= 0; btn.textContent = ok ? "Открыть бесплатно" : "Снова через " + hms(left) }
  else { btn.textContent = INF() ? `Открыть ×${count}` : `Открыть за ${fmt(tot)}`; if (!canPay(tot)) { ok = false; msg = `Не хватает ${fmt(tot - S.bal)}. Продай что-нибудь, забери бонус или открой бесплатный кейс.` } }
  btn.disabled = busy || !ok; hint.hidden = !msg || busy; hint.textContent = msg;
}
function renderDrops() {
  const box = $("drops"); box.innerHTML = ""; const cs = cur;
  const sum = cs.items.reduce((a, e) => a + e.t, 0);
  $("cvOdds").textContent = `Шансы считаются в билетах: всего ${fmtN(TICKETS)} билетов, сумма шансов ${(sum / TICKETS * 100).toFixed(3).replace(".", ",")}%. Цена в карточке — средняя для полевого износа. TURBO выпадает в 10% случаев и стоит в 1,8 раза дороже.`;
  let acc = 0;
  for (const e of cs.items) {
    const from = acc + 1; acc += e.t; const p = e.t / TICKETS;
    const inst = probe(e), val = e.cid ? CASE_BY[e.cid].price : catItem(e.key).base;
    const c = cell(inst, `<span class="ch">${fmtP(p, p < .001 ? 3 : 2)}</span><span class="pp">~${fmt(val)} · билеты ${fmtN(from)}–${fmtN(acc)}</span>`);
    c.title = (e.cid ? "Кейс «" + CASE_BY[e.cid].n + "»" : catItem(e.key).name); c.tabIndex = 0;
    c.onclick = () => e.key ? openPreview(e.key) : null;
    box.append(c);
  }
}
/* ---------- Рулетка ---------- */
function buildReel(cs, win, compact) {
  const reel = el("div", "reel"); reel.innerHTML = '<div class="needle"></div><div class="track"></div>'; const track = reel.querySelector(".track");
  const N = 62, stop = 54, rare = cs.items[0];
  for (let i = 0; i < N; i++) {
    let e = rollCase(cs).e;
    if ((i === stop - 1 || i === stop + 1) && R() < .35) e = rare; // «почти выпало» — интрига у самой стрелки
    track.append(i === stop ? cell(win) : cell(probe(e)));
  }
  reel.dataset.stop = stop; return reel;
}
function spinReel(reel, dur, snd) {
  return new Promise(res => {
    const track = reel.querySelector(".track"), needle = reel.querySelector(".needle"), stop = +reel.dataset.stop;
    const cw = track.children[0].getBoundingClientRect().width, W = cw + 6, vw = reel.clientWidth;
    const target = stop * W + cw / 2 - vw / 2 + (R() - .5) * cw * .78;
    const finish = () => { track.style.transform = `translateX(${-target}px)`; const c = track.children[stop]; reel.style.setProperty("--rc", c.style.getPropertyValue("--rc")); c.classList.add("hit"); reel.classList.add("done"); res() };
    if (!dur) return finish();
    const over = Math.min(cw * .22, 26) * (R() < .5 ? .6 : 1), back = Math.min(420, dur * .12), main = dur - back, t0 = performance.now(); let last = -1;
    const ease = k => 1 - Math.pow(1 - k, 4.6);
    const step = t => {
      const el_ = t - t0; let x;
      if (el_ < main) x = (target + over) * ease(el_ / main);
      else { const k = Math.min(1, (el_ - main) / back), s = k * k * (3 - 2 * k); x = target + over * (1 - s) }
      track.style.transform = `translateX(${-x}px)`;
      const idx = Math.floor((x + vw / 2) / W);
      if (idx !== last) { if (snd && last >= 0) { const sp = el_ < main ? 1 - el_ / main : .2; SND.tick(.35 + sp * .65) } last = idx; needle.classList.remove("kick"); void needle.offsetWidth; needle.classList.add("kick") }
      if (el_ < dur) requestAnimationFrame(step); else finish();
    };
    requestAnimationFrame(step);
  });
}
/* ---------- Открытие ---------- */
$("openBtn").onclick = async () => {
  const cs = cur; if (busy || !cs || lockedFor(cs)) return;
  const n = (cs.free || fromInv) ? 1 : count, tot = fromInv ? 0 : cprice(cs) * n;
  if (fromInv) { if (!invHas(fromInv.u)) { toast("Этого кейса уже нет в инвентаре", "bad"); fromInv = null; caseState(); return } }
  else if (cs.free) { if (freeLeft(cs) > 0) return; S.free[cs.id] = dayNo() }
  else if (!canPay(tot)) { SND.error(); return }
  SND.unlock(); setBusy(true); caseState();
  if (fromInv) { removeInv([fromInv]); fromInv = null } else pay(tot);
  refreshHeader();
  // броски делаются сразу и честно; анимация только показывает результат
  const res = Array.from({ length: n }, () => { const { e, ticket } = rollCase(cs); const inst = e.cid ? { u: ++UID, kind: "case", cid: e.cid, f: 0, t: false, ts: Date.now(), kills: 0 } : makeInst(e.key); const m = cs.kind === "mult" ? rollMult() : 1; return { inst, ticket, m, e } });
  const fast = ALL.fast || RM();
  const crate = $("crate");
  if (!fast) { crate.className = "crate shake"; SND.shake(); await sleep(700); crate.className = "crate opened"; SND.open(); await sleep(420) }
  const box = $("reels"); box.innerHTML = ""; box.classList.toggle("compact", n > 5);
  const reels = res.map(r => buildReel(cs, r.inst)); reels.forEach(r => box.append(r));
  if (innerWidth < 720) box.scrollIntoView({ behavior: RM() ? "auto" : "smooth", block: "center" });
  await sleep(30);
  await Promise.all(reels.map((rl, i) => spinReel(rl, RM() ? 0 : fast ? 1100 + i * 60 : 5600 + i * 260, i === 0)));
  SND.stop();
  // зачисление
  const got = [];
  for (const r of res) {
    for (let k = 0; k < r.m; k++) { const inst = k === 0 ? r.inst : (r.inst.kind === "case" ? { ...r.inst, u: ++UID } : { ...r.inst, u: ++UID, f: rollFloat() }); addInv(inst, cs.n); got.push(inst) }
    if (r.m === 5) S.st.mult5++; if (r.inst.kind === "case") S.st.cofc++;
  }
  S.st.opened += n; S.st.won += got.reduce((a, b) => a + priceOf(b), 0); S.opens[cs.id] = (S.opens[cs.id] || 0) + n; if (fast) S.st.fastOpen += n; if (n >= 10) S.st.x10++;
  turboKills(n);
  got.forEach(g => feedAdd(g, ALL.nick, true));
  const top = Math.max(...got.map(instR));
  track("open", { n, cat: cs.cat }); got.forEach(g => track("drop", { r: instR(g) }));
  save(); setBusy(false); refresh();
  await sleep(fast ? 150 : 450);
  reveal(got, cs, res, fast);
  setTimeout(() => { if (cur === cs) { $("crate").className = "crate idle" } }, 300);
};
// TURBO-счётчик: предметы TURBO «воюют», пока ты играешь
function turboKills(n) { const tb = S.inv.filter(i => i.t); if (!tb.length) return; for (let k = 0; k < n; k++) { const i = tb[FAIR.int(tb.length)]; i.kills += 1 + FAIR.int(3) } }
/* ---------- Показ дропа ---------- */
function reveal(got, cs, res, fast) {
  const R_ = $("reveal"), box = $("rbox"); box.innerHTML = "";
  const sorted = [...got].sort((a, b) => instR(b) - instR(a) || priceOf(b) - priceOf(a)), best = sorted[0], br = instR(best);
  R_.style.setProperty("--rc", rcolor(br)); box.style.setProperty("--rc", rcolor(br)); R_.classList.toggle("epic", br >= 5); R_.classList.toggle("dim-bg", br >= 5 && !fast);
  const sum = got.reduce((a, b) => a + priceOf(b), 0), paid = res && cs && !cs.free ? cprice(cs) * res.length : 0;
  if (got.length === 1) {
    const it = best, mult = res && res[0] && res[0].m > 1 ? res[0].m : 1;
    box.insertAdjacentHTML("beforeend", `<div class="eyebrow">${RAR[br].n}${it.t ? " · TURBO" : ""}</div>`);
    box.append(itemImg(it, "lg", "big"));
    box.insertAdjacentHTML("beforeend", `<h3>${esc(instName(it))}</h3>${it.kind === "case" ? '<div class="muted">Запечатанный кейс: открой из инвентаря или продай</div>' : `<div class="muted">${WEAR[tierOf(it.f)].n} · износ ${it.f.toFixed(5)}</div>`}<div class="pp">${fmt(priceOf(it))}</div>${res && res[0] ? `<div class="tk">Билет ${fmtN(res[0].ticket)} из ${fmtN(TICKETS)}</div>` : ""}`);
  } else {
    const mults = res ? res.filter(r => r.m > 1) : [];
    box.insertAdjacentHTML("beforeend", `<div class="eyebrow">${cs ? esc(cs.n) + " · " : ""}${got.length} ${plural(got.length, "предмет", "предмета", "предметов")}</div>${mults.length ? `<div class="mtag">Множитель ${mults.map(r => "×" + r.m).join(", ")}!</div>` : ""}<div class="pp">${fmt(sum)}</div>`);
    if (paid) box.insertAdjacentHTML("beforeend", `<div class="rsum"><span>Потрачено <b>${fmt(paid)}</b></span><span>Итог <b style="color:${sum >= paid ? "var(--good)" : "var(--bad)"}">${sum >= paid ? "+" : "−"}${fmt(Math.abs(sum - paid))}</b></span><span>Лучший <b style="color:${rcolor(br)}">${esc(instName(best))}</b></span></div>`);
    const g = el("div", "rgrid"); sorted.forEach((o, i) => { const c = icard(o, { click: () => { closeReveal(); openItem(o) } }); c.style.animationDelay = i * .06 + "s"; g.append(c) }); box.append(g);
  }
  const ct = el("div", "ctrl"); ct.style.justifyContent = "center";
  const mk = (t, cls, f) => { const b = el("button", cls); b.textContent = t; b.onclick = () => { ct.querySelectorAll("button").forEach(x => x.disabled = true); f() }; ct.append(b); return b };
  mk("Продать за " + fmt(sum), "btn", () => { sell(got); closeReveal() });
  if (got.length > 2) mk("Продать кроме лучшего", "ghost", () => { sell(sorted.slice(1)); closeReveal() });
  const keep = mk("Забрать", "ghost", closeReveal); keep.dataset.focus = 1;
  if (cs && !cs.free && res) mk(INF() ? "Открыть ещё" : `Ещё за ${fmt(cprice(cs) * res.length)}`, "ghost", () => { closeReveal(); if (cur === cs) setTimeout(() => $("openBtn").click(), 80) });
  box.append(ct);
  R_.hidden = false; setTimeout(() => keep.focus({ preventScroll: true }), 50);
  if (!fast || br >= 6) celebrate(br); else SND.drop(Math.min(br, 3));
}
function closeReveal() { $("reveal").hidden = true; $("reveal").classList.remove("dim-bg") }
$("reveal").addEventListener("click", e => { if (e.target === $("reveal") || e.target.classList.contains("rv-rays")) closeReveal() });
/* ---------- Лента дропов ---------- */
function feedAdd(inst, who, me) {
  const f = $("feed"), r = instR(inst), d = el("button", "fd r" + r + (me ? " me" : "")); d.style.setProperty("--rc", rcolor(r));
  d.append(itemImg(inst)); const t = el("div"); t.textContent = who + " · " + (inst.kind === "case" ? CASE_BY[inst.cid].n : catItem(inst.k).sn); d.append(t);
  d.title = instName(inst) + " — " + fmt(priceOf(inst));
  d.onclick = () => { if (busy) return; const cs = inst.kind === "case" ? CASE_BY.caseofcases : CASES.find(c => c.items.some(e => e.key === inst.k)); if (cs) { go("cases"); openCaseView(cs) } };
  f.prepend(d); while (f.children.length > 24) f.lastChild.remove();
}
function fakeDrop() { const pool = CASES.filter(c => !c.free && c.kind === "normal"); const cs = pool[FAIR.int(pool.length)]; let e = rollCase(cs).e; if (e.r < 2) e = rollCase(cs).e; feedAdd(makeInst(e.key), BOTS[FAIR.int(BOTS.length)].n) }
