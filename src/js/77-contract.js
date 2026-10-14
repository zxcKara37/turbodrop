/* ================= Контракты: правила и исходы известны заранее ================= */
const ctSel = new Set();
// Таблица исходов: множитель к сумме вклада и его вероятность. Средний возврат 92,7%.
const CT_TABLE = [[.3, .24, "#ff5a5a"], [.6, .30, "#ff8a5a"], [1, .25, "#ffcf4a"], [1.5, .13, "#5ec98a"], [2.5, .06, "#4f8dff"], [4, .02, "#e04cff"]];
const CT_EV = CT_TABLE.reduce((a, [m, p]) => a + m * p, 0);
const ctItems = () => S.inv.filter(i => ctSel.has(i.u));
let ctVG = null, ctLast = -1;
function renderCt() {
  [...ctSel].forEach(u => { if (!invHas(u)) ctSel.delete(u) });
  const list = ctItems(), sum = list.reduce((a, b) => a + priceOf(b), 0), n = list.length;
  $("ctSum").innerHTML = `<span class="muted">Вклад · ${n} из 10</span><b>${fmt(sum)}</b><span class="muted">${n < 3 ? `Добавь ещё ${3 - n} ${plural(3 - n, "предмет", "предмета", "предметов")}` : "Можно подписывать"}</span><small class="muted">Средний возврат ${(CT_EV * 100).toFixed(1).replace(".", ",")}%</small>`;
  $("ctTable").innerHTML = `<div class="ct-row muted" style="font-size:12px"><span>Исход</span><span>Шанс</span><span>Получишь</span></div>` + CT_TABLE.map(([m, p, c], i) => `<div class="ct-row${i === ctLast ? " on" : ""}" style="--c:${c}"><span><b style="color:${c}">×${String(m).replace(".", ",")}</b></span><span class="row gap8"><i style="flex:1"><b style="width:${p / .3 * 100}%"></b></i>${Math.round(p * 100)}%</span><span>${sum ? "≈" + fmt(sum * m) : "—"}</span></div>`).join("");
  $("ctBtn").disabled = busy || n < 3;
  if (!$("ctOut").children.length) $("ctOut").innerHTML = '<svg viewBox="0 0 24 24" class="ico" style="width:36px;height:36px;opacity:.5"><path d="M7 3h10l4 4v14H3V3h4zM7 3v6h8V3M7 21v-7h10v7"/></svg><span>Результат появится здесь</span>';
  if (!ctVG) ctVG = new VGrid($("ctInv"), { minW: 150, rowH: 182, render: o => icard(o, { sel: ctSel.has(o.u), click: () => { if (busy) return; if (ctSel.has(o.u)) ctSel.delete(o.u); else if (ctSel.size >= 10) return toast("Максимум 10 предметов", "bad"); else ctSel.add(o.u); ctLast = -1; renderCt(); SND.click() } }), empty: () => '<div class="empty">Инвентарь пуст. Открой несколько кейсов, чтобы было что вложить.</div>' });
  ctVG.set([...S.inv].filter(i => i.kind !== "case").sort((a, b) => priceOf(a) - priceOf(b)));
}
$("ctAuto").onclick = () => { if (busy) return; ctSel.clear(); [...S.inv].filter(i => i.kind !== "case").sort((a, b) => priceOf(a) - priceOf(b)).slice(0, 10).forEach(o => ctSel.add(o.u)); ctLast = -1; renderCt() };
$("ctClear").onclick = () => { if (busy) return; ctSel.clear(); ctLast = -1; renderCt() };
// Подбор предмета под целевую цену: вид+скин и износ так, чтобы цена была как можно ближе
function pickForValue(V) {
  let best = null, bd = 1e18;
  for (const k of UP_POOL) { const it = catItem(k), mk = market(k); for (let t = 0; t < 5; t++) { const p = it.base * WEAR[t].m * mk, d = Math.abs(Math.log(p / V)); if (d < bd) { bd = d; best = [k, t] } } }
  const [k, t] = best, lo = t ? WEAR[t - 1].max : 0, hi = WEAR[t].max; return makeInst(k, { f: +(lo + (hi - lo) * (.05 + R() * .9)).toFixed(5) });
}
$("ctBtn").onclick = async () => {
  const list = ctItems(); if (list.length < 3 || busy) return; SND.unlock(); setBusy(true); $("ctBtn").disabled = true;
  const sum = list.reduce((a, b) => a + priceOf(b), 0);
  let x = R(), idx = 0; for (let i = 0; i < CT_TABLE.length; i++) { x -= CT_TABLE[i][1]; if (x < 0) { idx = i; break } idx = i }
  const [m] = CT_TABLE[idx], n = pickForValue(sum * m);
  removeInv(list); ctSel.clear(); S.st.ctTotal++;
  const out = $("ctOut"), rows = [...$("ctTable").querySelectorAll(".ct-row")].slice(1);
  const frames = RM() ? 1 : 22;
  for (let i = 0; i < frames; i++) { const k = UP_POOL[FAIR.int(UP_POOL.length)]; out.innerHTML = ""; out.append(cell({ k, f: .25, t: false })); rows.forEach((r, j) => r.classList.toggle("on", j === (i % rows.length))); SND.tick(.4); await sleep(45 + i * 10) }
  rows.forEach((r, j) => r.classList.toggle("on", j === idx)); ctLast = idx;
  addInv(n, "Контракт"); S.st.won += priceOf(n); const ratio = priceOf(n) / sum; if (ratio >= 2.5) S.st.ctWin++;
  S.ctHist.unshift({ s: sum, p: priceOf(n), k: n.k }); S.ctHist.length = Math.min(20, S.ctHist.length);
  out.innerHTML = ""; out.append(icard(n, { click: () => openItem(n) }));
  toast(`${ratio >= 1 ? "Профит" : "Минус"}: ${fmt(sum)} → ${fmt(priceOf(n))} (×${ratio.toFixed(2).replace(".", ",")})`, ratio >= 1 ? "good" : "bad");
  ratio >= 1.5 ? celebrate(Math.max(3, instR(n))) : SND.drop(1); feedAdd(n, ALL.nick, true); track("contract"); track("drop", { r: instR(n) });
  save(); setBusy(false); refresh();
};
