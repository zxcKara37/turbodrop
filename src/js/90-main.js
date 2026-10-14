/* ================= Шапка, вкладки, запуск ================= */
const BONUS_CD = 5 * 6e4;
function refreshHeader() {
  $("bal").textContent = INF() ? "∞" : fmt(S.bal);
  const l = S.lvl, a = xpFor(l), b = xpFor(l + 1); $("lvlTxt").textContent = "Ур. " + l; $("lvlBar").style.width = Math.min(100, (S.xp - a) / (b - a) * 100) + "%";
  segSet("modeSeg", "m", ALL.mode); [...$("modeSeg").children].forEach(x => x.disabled = busy);
  $("bonusBtn").hidden = !MODE().bonus; bonusTick();
  $("sndBtn").setAttribute("aria-pressed", ALL.snd.on); $("sndIco").setAttribute("d", ALL.snd.on && ALL.snd.vol > 0 ? "M4 9h4l5-4v14l-5-4H4zM16 8c1.5 1 2.4 2.4 2.4 4s-.9 3-2.4 4M18.5 5c2.3 1.7 3.5 4.1 3.5 7s-1.2 5.3-3.5 7" : "M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6"); $("volRange").value = Math.round(ALL.snd.vol * 100);
  $("invCount").textContent = fmtN(S.inv.length);
  [...$("tabs").children].forEach(t => t.disabled = busy && t.dataset.tab !== curTab);
}
function bonusTick() {
  if (MODE().bonus) { const left = S.bonusAt + BONUS_CD - Date.now(), b = $("bonusBtn"); if (left > 0) { b.disabled = true; b.textContent = "Бонус " + hms(left).replace(/^0:/, "") } else { b.disabled = false; b.textContent = "Забрать бонус" } }
  if (cur && cur.free && !busy && curTab === "cases") caseState();
}
setInterval(bonusTick, 1000);
$("bonusBtn").onclick = () => { if (!MODE().bonus || S.bonusAt + BONUS_CD > Date.now()) return; const g = 150 + FAIR.int(31) * 10 + S.lvl * 20; S.bonusAt = Date.now(); earn(g); save(); refresh(); toast("Бонус +" + fmt(g), "good"); SND.sell() };
$("modeSeg").onclick = e => { const b = e.target.closest("button"); if (!b || busy || b.dataset.m === ALL.mode) return; ALL.mode = b.dataset.m; S = ALL.modes[ALL.mode]; resetUIState(); streakCheck(); save(); renderChips(); renderFeatured(); refresh(); if (cur) openCaseView(cur); SND.click(); toast({ norm: "Обычный режим: старт с 1 000 ₽, бонусы и награды", inf: "Бесконечный режим: деньги не кончаются", hard: "Хардкор: кейсы дороже на 20%, без бонусов, опыта ×2,5" }[ALL.mode]) };
$("sndBtn").onclick = () => { ALL.snd.on = !ALL.snd.on; if (ALL.snd.on && ALL.snd.vol === 0) ALL.snd.vol = .5; save(); SND.unlock(); SND.vol(); refreshHeader(); SND.click() };
$("volRange").addEventListener("input", () => { ALL.snd.vol = +$("volRange").value / 100; ALL.snd.on = ALL.snd.vol > 0; SND.unlock(); SND.vol(); refreshHeader() });
$("volRange").addEventListener("change", () => { save(); SND.click() });
$("balBox").onclick = () => go("inv");
$("logo").onclick = () => { if (busy) return; go("cases"); if (cur) closeCaseView() };
function resetUIState() { invSel.clear(); ctSel.clear(); upSel.clear(); upTgt = null; ctLast = -1; fromInv = null; if (crash) crash = null; if (mines) mines = null; ["game-coin", "game-crash", "game-mines", "game-wheel"].forEach(id => { $(id).innerHTML = ""; delete $(id).dataset.ok }); $("arena").innerHTML = "" }
const TABS = ["cases", "battle", "upgrade", "contract", "games", "market", "inv", "profile"];
function go(tab) {
  if (busy && tab !== curTab) return; curTab = tab;
  [...$("tabs").children].forEach(b => b.setAttribute("aria-selected", b.dataset.tab === tab));
  TABS.forEach(t => $("tab-" + t).hidden = t !== tab);
  const tb = $("tabs").querySelector(`[data-tab="${tab}"]`); if (tb && tb.scrollIntoView) tb.scrollIntoView({ block: "nearest", inline: "nearest" });
  refresh(); if (tab !== "cases" || !cur) scrollTo({ top: 0 });
}
$("tabs").onclick = e => { const b = e.target.closest("[role=tab]"); if (b && !busy) { go(b.dataset.tab); SND.click() } };
$("tabs").onkeydown = e => { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return; const i = TABS.indexOf(curTab), n = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length]; go(n); $("tabs").querySelector(`[data-tab="${n}"]`).focus() };
function refresh() {
  refreshHeader();
  if (curTab === "cases") { if (cur) caseState(); else { renderCases() } }
  else if (curTab === "battle") btState();
  else if (curTab === "upgrade") renderUp();
  else if (curTab === "contract") renderCt();
  else if (curTab === "games") renderGames();
  else if (curTab === "market") renderMarket();
  else if (curTab === "inv") renderInv();
  else if (curTab === "profile") renderProfile();
}
// На телефоне режим, уровень, бонус и звук уезжают из липкой шапки в строку под ней
const PHONE = matchMedia("(max-width:640px)");
function placeBar() { const bar = document.querySelector(".bar"), sb = $("subbar"), ids = ["modeSeg", "lvlBox", "bonusBtn", "soundBox"]; if (PHONE.matches) ids.forEach(id => sb.append($(id))); else { const bal = $("balBox"); ids.forEach(id => bar.insertBefore($(id), bal)) } }
PHONE.addEventListener ? PHONE.addEventListener("change", placeBar) : PHONE.addListener(placeBar); placeBar();
/* ---------- Запуск ---------- */
(function boot() {
  const L = loadAll(); ALL = L.A; LOADED_FROM = L.from; S = ALL.modes[ALL.mode];
  if (L.from === "v3") save(true);
  streakCheck();
  segSet("priceSeg", "p", priceF); segSet("sortSeg", "s", sortF);
  renderChips(); renderFeatured(); go("cases");
  for (let i = 0; i < 12; i++) fakeDrop();
  (function loop() { setTimeout(() => { if (!document.hidden) fakeDrop(); loop() }, 2200 + FAIR.int(2600)) })();
  setInterval(() => { if (busy || document.hidden) return; if (curTab === "market") renderMarket(); else if (curTab === "inv" && $("modal").hidden) renderInv() }, 30000);
  if (L.from === "v3") setTimeout(() => toast("Прогресс из прошлой версии перенесён", "good"), 800);
  if (!STORE.ok) setTimeout(() => toast("Браузер не даёт сохранять прогресс — используй экспорт в профиле"), 1200);
  achCheck();
  document.title = "ТурбоДроп";
})();
