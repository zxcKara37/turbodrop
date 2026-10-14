/* ================= Инвентарь и рынок ================= */
const invSel = new Set(); let invSort = "new", invRar = -1, invQ = "", invVG = null;
function rarSeg(id, val, fn) {
  const box = $(id); if (!box.dataset.ok) { box.dataset.ok = 1; box.innerHTML = `<button data-r="-1">Все</button>` + RAR.map((r, i) => `<button data-r="${i}" title="${r.n}" style="color:${r.h}">●</button>`).join(""); box.onclick = e => { const b = e.target.closest("button"); if (b) fn(+b.dataset.r) } }
  [...box.children].forEach(b => { b.setAttribute("aria-pressed", +b.dataset.r === val); if (b.dataset.r !== "-1") b.setAttribute("aria-label", RAR[+b.dataset.r].n) });
}
function invList() {
  let l = S.inv.filter(i => (invRar < 0 || instR(i) === invRar) && (!invQ || instName(i).toLowerCase().includes(invQ)));
  if (invSort === "exp") l.sort((a, b) => priceOf(b) - priceOf(a)); else if (invSort === "cheap") l.sort((a, b) => priceOf(a) - priceOf(b)); else if (invSort === "rar") l.sort((a, b) => instR(b) - instR(a) || priceOf(b) - priceOf(a)); else if (invSort === "trend") l.sort((a, b) => trendOf(b) - trendOf(a));
  return l;
}
function renderInv() {
  [...invSel].forEach(u => { if (!invHas(u)) invSel.delete(u) });
  segSet("invSort", "s", invSort); rarSeg("invRar", invRar, v => { invRar = v; renderInv() });
  if (!invVG) invVG = new VGrid($("inv"), { minW: 158, rowH: 190, render: o => icard(o, { sel: invSel.has(o.u), trend: true, click: e => { if (e && (e.target.closest(".chk") || e.shiftKey || invSel.size)) { invSel.has(o.u) ? invSel.delete(o.u) : invSel.add(o.u); renderInv(); return } openItem(o) } }), empty: () => S.inv.length ? '<div class="empty">Под фильтр ничего не попало.</div>' : `<div class="empty"><svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10"/></svg><b>Инвентарь пуст</b><span>Открой пару кейсов — скины появятся здесь.</span></div>` });
  invVG.set(invList());
  const v = invValue(); $("invStats").innerHTML = `<div>Предметов: <b>${fmtN(S.inv.length)}</b></div><div>Стоимость: <b>${fmt(v)}</b></div>`;
  const sl = S.inv.filter(i => invSel.has(i.u)); $("sellSel").disabled = !sl.length; $("sellSel").textContent = sl.length ? `Продать ${sl.length} за ${fmt(sl.reduce((a, b) => a + priceOf(b), 0))}` : "Продать выбранные";
  $("selAll").textContent = invSel.size ? "Снять выбор" : "Выбрать видимые";
}
$("invSort").onclick = e => { const b = e.target.closest("button"); if (!b) return; invSort = b.dataset.s; renderInv() };
$("invQ").addEventListener("input", () => { invQ = $("invQ").value.trim().toLowerCase(); renderInv() });
$("selAll").onclick = () => { if (invSel.size) invSel.clear(); else invList().forEach(i => invSel.add(i.u)); renderInv() };
$("sellSel").onclick = () => { const l = S.inv.filter(i => invSel.has(i.u)); if (l.length) confirmBox("Продать выбранное?", `${l.length} ${plural(l.length, "предмет", "предмета", "предметов")} за ${fmt(l.reduce((a, b) => a + priceOf(b), 0))}.`, "Продать", () => sell(l)) };
$("sellCheap").onclick = () => { const l = S.inv.filter(i => priceOf(i) < 50); if (!l.length) return toast("Нет предметов дешевле 50 ₽"); confirmBox("Продать мелочь?", `${l.length} ${plural(l.length, "предмет", "предмета", "предметов")} дешевле 50 ₽ на ${fmt(l.reduce((a, b) => a + priceOf(b), 0))}.`, "Продать", () => sell(l)) };
$("sellAll").onclick = () => { if (!S.inv.length) return toast("Инвентарь пуст"); confirmBox("Продать весь инвентарь?", `${S.inv.length} ${plural(S.inv.length, "предмет", "предмета", "предметов")} на ${fmt(invValue())}. Это нельзя отменить.`, "Продать всё", () => sell([...S.inv]), true) };
/* ---------- Рынок ---------- */
let mkView = "movers", mkQ = "", mkRar = -1;
function spark(key, f = .25, t = false, hours = 6) {
  const N = 28, now = Date.now(), v = []; for (let i = 0; i < N; i++) v.push(market(key, now - (N - 1 - i) / (N - 1) * hours * 36e5));
  const mn = Math.min(...v), mx = Math.max(...v), X = i => i / (N - 1) * 108 + 1, Y = y => 33 - (y - mn) / ((mx - mn) || 1) * 30, up = v[N - 1] >= v[0], c = up ? "var(--good)" : "var(--bad)";
  const d = v.map((y, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(y).toFixed(1)).join("");
  return `<svg class="spark" viewBox="0 0 110 36" preserveAspectRatio="none" aria-hidden="true"><path d="${d}L109 36L1 36Z" fill="${c}" opacity=".12"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.6" vector-effect="non-scaling-stroke"/><circle cx="${X(N - 1)}" cy="${Y(v[N - 1])}" r="2.4" fill="${c}"/></svg>`;
}
const buyPrice = k => Math.max(1, Math.round(tgtPrice(k) * 1.1));
function mrow(inst, opts) {
  const r = instR(inst), d = el("div", "mrow"); d.style.setProperty("--rc", rcolor(r));
  const it = catItem(inst.k), p = opts.price, tr = market(inst.k) / market(inst.k, Date.now() - 36e5) - 1;
  d.append(itemImg(inst)); d.insertAdjacentHTML("beforeend", `<div class="nm"><b>${esc(it.name)}</b><small style="color:${rcolor(r)}">${RAR[r].n}</small><small> · ${opts.sub}</small></div>${spark(inst.k)}<div class="pr">${fmt(p)}<small class="trend ${tr >= 0 ? "up" : "dn"}">${tr >= 0 ? "▲" : "▼"} ${Math.abs(tr * 100).toFixed(1).replace(".", ",")}% за час</small></div>`);
  const act = el("div", "act"); const b = el("button", opts.btnCls || "ghost sm", opts.btn); b.disabled = !!opts.dis; b.onclick = opts.act; act.append(b); d.append(act);
  d.querySelector("img").style.cursor = "pointer"; d.querySelector("img").onclick = () => opts.open ? opts.open() : openPreview(inst.k);
  return d;
}
function renderMarket() {
  segSet("mkChips", "v", mkView); rarSeg("mkRar", mkRar, v => { mkRar = v; renderMarket() });
  const box = $("mkList"); box.innerHTML = ""; const q = mkQ.toLowerCase(); const okR = k => mkRar < 0 || catItem(k).r === mkRar;
  if (mkView === "mine") {
    const l = S.inv.filter(i => i.kind !== "case" && okR(i.k) && (!q || instName(i).toLowerCase().includes(q))).sort((a, b) => trendOf(b) - trendOf(a)).slice(0, 120);
    if (!l.length) { box.innerHTML = `<div class="empty">${S.inv.length ? "Ничего не найдено." : "Инвентарь пуст — продавать нечего."}</div>`; return }
    box.insertAdjacentHTML("beforeend", `<p class="sub">Сверху — то, что сильнее всего выросло за последний час. Продажа идёт по текущей цене.</p>`);
    l.forEach(i => box.append(mrow(i, { price: priceOf(i), sub: `${WEAR[tierOf(i.f)].n}${i.t ? " · TURBO" : ""}`, btn: "Продать", btnCls: "btn sm", act: () => { const v = sell([i], true); if (v) { S.st.marketSell++; toast(`Продано за ${fmt(v)}`, "good"); renderMarket() } }, open: () => openItem(i) })));
    return;
  }
  let keys = UP_POOL.filter(k => okR(k) && (!q || catItem(k).name.toLowerCase().includes(q)));
  if (mkView === "movers") { keys = keys.map(k => [k, market(k) / market(k, Date.now() - 36e5) - 1]).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 40).map(x => x[0]); box.insertAdjacentHTML("beforeend", `<p class="sub">Сорок скинов с самым сильным движением цены за последний час. Цены меняются плавно — можно дождаться роста и продать дороже.</p>`) }
  else keys = keys.sort((a, b) => catItem(a).base - catItem(b).base).slice(0, 150);
  if (!keys.length) { box.innerHTML = '<div class="empty">Ничего не найдено.</div>'; return }
  for (const k of keys) { const bp = buyPrice(k); box.append(mrow({ k, f: .25, t: false }, { price: bp, sub: "Полевое, без TURBO", btn: INF() ? "Взять" : "Купить", dis: !canPay(bp), act: () => buyItem(k) })) }
}
function buyItem(k) {
  const bp = buyPrice(k); if (busy) return; if (!canPay(bp)) { SND.error(); return toast(`Не хватает ${fmt(bp - S.bal)}`, "bad") }
  pay(bp); const n = makeInst(k, { f: +(.15 + R() * .2299).toFixed(5), t: false }); addInv(n, "Рынок"); S.st.bought++; track("buy"); save(); SND.buy(); toast("Куплено: " + catItem(k).name, "good"); refresh();
}
$("mkChips").onclick = e => { const b = e.target.closest("button"); if (!b) return; mkView = b.dataset.v; renderMarket() };
$("mkQ").addEventListener("input", () => { mkQ = $("mkQ").value.trim(); renderMarket() });
