/* ================= Апгрейд: несколько предметов → цель, колесо с точным шансом ================= */
const upSel = new Set(); let upTgt = null, upMult = 2, upAng = 0, upQ = "", upZone = 0;
const UP_EDGE = .92, UP_MAX = .85, UP_MIN = .01;
const UP_POOL = (() => { const s = new Set(); CASES.forEach(c => c.items.forEach(e => e.key && s.add(e.key))); return [...s] })();
const upItems = () => S.inv.filter(i => upSel.has(i.u));
const upStake = () => upItems().reduce((a, b) => a + priceOf(b), 0);
// Цель — полевой износ, без TURBO; цена по рынку прямо сейчас
const tgtPrice = key => Math.max(1, Math.round(catItem(key).base * market(key)));
const upChance = (stake, tp) => clamp(stake / tp * UP_EDGE, 0, UP_MAX);
function autoTarget(stake) { const want = stake * upMult; let best = null, bd = 1e18; for (const k of UP_POOL) { const p = tgtPrice(k); if (p <= stake) continue; const d = Math.abs(Math.log(p / want)); if (d < bd) { bd = d; best = k } } return best }
const curTgt = () => { const s = upStake(); if (!s) return null; if (upTgt && tgtPrice(upTgt) > s) return upTgt; return autoTarget(s) };
function drawWheel(ch, ang, state) {
  const cv = $("upWheel"), g = cv.getContext("2d"), m = 200; g.clearRect(0, 0, 400, 400);
  g.lineWidth = 26; g.strokeStyle = "#221d30"; g.beginPath(); g.arc(m, m, 160, 0, 7); g.stroke();
  for (let i = 0; i < 100; i++) { const a = i / 100 * 6.283; g.strokeStyle = i % 10 ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.2)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(m + Math.cos(a) * 128, m + Math.sin(a) * 128); g.lineTo(m + Math.cos(a) * (i % 10 ? 134 : 140), m + Math.sin(a) * (i % 10 ? 134 : 140)); g.stroke() }
  if (ch > 0) { const a0 = -Math.PI / 2 + upZone * 6.283, gr_ = g.createLinearGradient(0, 0, 400, 400); gr_.addColorStop(0, "#4fe39a"); gr_.addColorStop(1, "#2ad0ff"); g.strokeStyle = state === "lose" ? "rgba(79,227,154,.35)" : gr_; g.lineWidth = 26; g.shadowColor = "#4fe39a"; g.shadowBlur = state === "win" ? 30 : 12; g.beginPath(); g.arc(m, m, 160, a0, a0 + 6.283 * ch); g.stroke(); g.shadowBlur = 0 }
  const a = -Math.PI / 2 + ang; g.fillStyle = "#fff"; g.shadowColor = state === "lose" ? "#ff5a5a" : "#fff"; g.shadowBlur = 14; g.beginPath(); g.moveTo(m + Math.cos(a) * 140, m + Math.sin(a) * 140); g.lineTo(m + Math.cos(a - .06) * 194, m + Math.sin(a - .06) * 194); g.lineTo(m + Math.cos(a + .06) * 194, m + Math.sin(a + .06) * 194); g.closePath(); g.fill(); g.shadowBlur = 0;
}
let upVG = null, tgVG = null;
function renderUp() {
  if (!upVG) {
    upVG = new VGrid($("upInv"), { minW: 140, rowH: 176, render: o => icard(o, { sel: upSel.has(o.u), trend: false, click: () => { if (busy) return; if (upSel.has(o.u)) upSel.delete(o.u); else { if (upSel.size >= 6) return toast("Не больше 6 предметов в ставке", "bad"); upSel.add(o.u) } upTgt = null; renderUp(); SND.click() } }), empty: () => '<div class="empty">Нечего ставить. Открой кейс, и предметы появятся здесь.</div>' });
    tgVG = new VGrid($("upTgts"), { minW: 140, rowH: 176, render: k => { const s = upStake(), p = tgtPrice(k), c = icard({ k, f: .25, t: false }, { nowear: true, price: p, sel: k === curTgt(), click: () => { if (busy) return; upTgt = k; segSet("multSeg", "m", -1); renderUp(); SND.click() } }); c.insertAdjacentHTML("beforeend", `<span class="w" style="color:var(--good)">${fmtP(upChance(s, p), 1)}</span>`); return c }, empty: () => `<div class="empty">${upStake() ? "Ничего не нашлось." : "Сначала выбери предметы для ставки."}</div>` });
  }
  S.inv.forEach(() => 0); [...upSel].forEach(u => { if (!invHas(u)) upSel.delete(u) });
  const items = upItems(), stake = upStake(), T = curTgt(), f = $("upFrom"), t = $("upTo");
  f.innerHTML = ""; t.innerHTML = "";
  if (!items.length) f.innerHTML = '<svg viewBox="0 0 24 24" class="ico" style="width:36px;height:36px;opacity:.5"><path d="M12 5v14M5 12h14"/></svg><span>Выбери до 6 предметов ниже</span>';
  else if (items.length === 1) f.append(icard(items[0]));
  else { const st = el("div", "stack"); items.forEach(i => st.append(icard(i, { nowear: true }))); f.append(st); f.insertAdjacentHTML("beforeend", `<div class="sum">${fmt(stake)}</div><small>${items.length} ${plural(items.length, "предмет", "предмета", "предметов")}</small>`) }
  $("upSelInfo").textContent = items.length ? `· выбрано ${items.length} на ${fmt(stake)}` : "";
  const ch = T ? upChance(stake, tgtPrice(T)) : 0;
  if (T) { t.append(icard({ k: T, f: .25, t: false }, { nowear: true, price: tgtPrice(T) })); t.insertAdjacentHTML("beforeend", `<small>×${(tgtPrice(T) / stake).toFixed(2).replace(".", ",")} к ставке</small>`) }
  else t.innerHTML = '<svg viewBox="0 0 24 24" class="ico" style="width:36px;height:36px;opacity:.5"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8z"/></svg><span>Цель появится здесь</span>';
  $("upChance").className = "wheel-c"; $("upChance").innerHTML = T ? `<b>${fmtP(ch, 2)}</b><small>шанс</small>` : "<b>—</b><small>шанс</small>";
  $("upBtn").disabled = busy || !T || ch < UP_MIN; $("upBtn").textContent = T && ch < UP_MIN ? "Шанс меньше 1%" : "Апгрейд";
  drawWheel(ch, upAng % 6.283);
  upVG.set([...S.inv].filter(i => i.kind !== "case").sort((a, b) => priceOf(b) - priceOf(a)));
  const q = upQ.toLowerCase(); tgVG.set(stake ? UP_POOL.filter(k => tgtPrice(k) > stake && (!q || catItem(k).name.toLowerCase().includes(q))).sort((a, b) => tgtPrice(a) - tgtPrice(b)).slice(0, 400) : []);
  const h = $("upHist"); h.innerHTML = "";
  if (!S.upHist.length) h.innerHTML = '<div class="empty">Попыток пока не было.</div>';
  S.upHist.slice(0, 12).forEach(x => { const it = catItem(x.k); if (!it) return; const d = el("div", "hrow"); d.style.setProperty("--rc", rcolor(it.r)); d.append(itemImg({ k: x.k, f: .25, t: false })); d.insertAdjacentHTML("beforeend", `<span>${fmt(x.s)} → ${esc(it.name)} · ${fmtP(x.c, 1)}</span><b class="${x.w ? "ok" : "no"}">${x.w ? "Успех" : "Сгорело"}</b>`); h.append(d) });
}
$("upQ").addEventListener("input", () => { upQ = $("upQ").value.trim(); renderUp() });
$("multSeg").onclick = e => { const b = e.target.closest("button"); if (!b || busy) return; upMult = +b.dataset.m; upTgt = null; segSet("multSeg", "m", upMult); renderUp() };
$("upBtn").onclick = async () => {
  const items = upItems(), stake = upStake(), T = curTgt(); if (busy || !items.length || !T) return;
  const tp = tgtPrice(T), ch = upChance(stake, tp); if (ch < UP_MIN) return;
  SND.unlock(); setBusy(true); $("upBtn").disabled = true;
  upZone = R() * (1 - ch); // зелёная зона в случайном месте круга
  const roll = R(), win = roll < ch; // исход определяется одним честным броском
  const land = win ? upZone + ch * (.04 + R() * .92) : (upZone + ch + (1 - ch) * (.03 + R() * .94)) % 1;
  removeInv(items); S.st.upTries++;
  const start = upAng % 6.283, end = 6.283 * (5 + Math.ceil(start / 6.283)) + land * 6.283, D = RM() ? 10 : 4200, t0 = performance.now(); let last = 0;
  await new Promise(res => { const step = t => { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 4); upAng = start + (end - start) * e; drawWheel(ch, upAng); const s = Math.floor(upAng / (Math.PI / 18)); if (s !== last) { last = s; SND.tick(.5) } k < 1 ? requestAnimationFrame(step) : res() }; requestAnimationFrame(step) });
  S.upHist.unshift({ k: T, s: stake, c: ch, w: win, ts: Date.now() }); S.upHist.length = Math.min(S.upHist.length, 30);
  upSel.clear(); upTgt = null;
  if (win) {
    const n = makeInst(T, { f: +(.15 + R() * .2299).toFixed(5), t: false }); addInv(n, "Апгрейд"); S.st.upWins++; S.st.won += priceOf(n); if (tp / stake >= 10) S.st.upBig++;
    drawWheel(ch, upAng, "win"); $("upChance").className = "wheel-c win"; $("upChance").innerHTML = "<b>Успех!</b><small>" + fmtP(ch, 2) + "</small>";
    SND.upWin(); feedAdd(n, ALL.nick, true); upSel.add(n.u); track("up", { win: true }); save(); await sleep(700); reveal([n], null, null, false); setBusy(false);
  } else {
    drawWheel(ch, upAng, "lose"); $("upChance").className = "wheel-c lose"; $("upChance").innerHTML = "<b>Мимо</b><small>" + fmtP(ch, 2) + "</small>";
    SND.upLose(); toast(`Сгорело: ${items.length} ${plural(items.length, "предмет", "предмета", "предметов")} на ${fmt(stake)}`, "bad"); track("up", { win: false }); save(); await sleep(1400); setBusy(false);
  }
  refresh();
};
