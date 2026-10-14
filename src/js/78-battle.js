/* ================= Батлы ================= */
let btFormat = "1v1", btMode = "classic", btRounds = 1, btCase = "start";
const BT_RULES = {
  classic: "Классика: побеждает игрок или команда с самой большой суммой дропа и забирает все предметы.",
  reverse: "Наоборот: побеждает самая маленькая сумма. Хорошо, когда не везёт.",
  boss: "Босс-батл: один на один с Бароном Дропом. Его сумма засчитывается с бонусом ×1,25, зато за победу ты получаешь все предметы и награду в размере ставки.",
  random: "Случайные кейсы: в каждом раунде всем выпадает один и тот же случайный кейс в ценовом диапазоне выбранного (±50%). Цена батла известна до старта.",
};
const btCs = () => CASE_BY[btCase];
function randomPlan() { const base = btCs().price, pool = CASES.filter(c => !c.free && c.kind === "normal" && c.price >= base * .5 && c.price <= base * 1.5 && !lockedFor(c)); const r = rng(hseed("plan" + btCase + btRounds + Math.floor(Date.now() / 6e4))); return Array.from({ length: btRounds }, () => pool.length ? pool[Math.floor(r() * pool.length)] : btCs()) }
let btPlan = null;
function btCost() { const plan = btMode === "random" ? btPlan : Array(btRounds).fill(btCs()); return plan.reduce((a, c) => a + cprice(c), 0) }
function btState() {
  segSet("btFormat", "f", btFormat); segSet("btMode", "b", btMode); segSet("btRounds", "r", btRounds);
  [...$("btFormat").children].forEach(b => b.disabled = btMode === "boss" && b.dataset.f !== "1v1");
  if (btMode === "boss") btFormat = "1v1";
  if (btMode === "random") btPlan = randomPlan(); else btPlan = null;
  const cs = btCs(), art = caseArt(cs);
  $("btCaseLbl").textContent = btMode === "random" ? "Ценовой ориентир" : "Кейс";
  $("btCaseBtn").innerHTML = `<img alt="" src="${art.full}"><span><b>${esc(cs.n)}</b><small>${fmt(cprice(cs))} за раунд</small></span>`;
  const cost = btCost(), ok = canPay(cost);
  $("btRule").innerHTML = BT_RULES[btMode] + (btPlan ? `<br>Кейсы по раундам: ${btPlan.map(c => esc(c.n)).join(" → ")}` : "");
  $("btBtn").textContent = INF() ? "Начать батл" : `Батл за ${fmt(cost)}`; $("btBtn").disabled = busy || !ok || lockedFor(cs);
  const lk = lockedFor(cs); $("btHint").hidden = (ok && !lk) || busy; $("btHint").textContent = lk ? `Кейс откроется на ${cs.lvl} уровне.` : ok ? "" : `Не хватает ${fmt(cost - S.bal)}.`;
  $("btStats").innerHTML = `<div>Батлов: <b>${S.st.bTotal}</b></div><div>Побед: <b>${S.st.bWins}</b></div><div>Винрейт: <b>${S.st.bTotal ? Math.round(S.st.bWins / S.st.bTotal * 100) + "%" : "—"}</b></div>`;
  if (!$("arena").children.length) buildArena(previewPlayers());
}
const segPick = (id, attr, fn) => { $(id).onclick = e => { const b = e.target.closest("button"); if (!b || busy || b.disabled) return; fn(b.dataset[attr]); $("arena").innerHTML = ""; btState(); SND.click() } };
segPick("btFormat", "f", v => btFormat = v); segPick("btMode", "b", v => btMode = v); segPick("btRounds", "r", v => btRounds = +v);
$("btCaseBtn").onclick = () => { if (busy) return; openModal(m => { m.insertAdjacentHTML("beforeend", "<h3>Кейс для батла</h3>"); const l = el("div", "list"); CASES.filter(c => !c.free && c.kind !== "cases").sort((a, b) => a.price - b.price).forEach(c => { const b = el("button", "lcase"); const lk = lockedFor(c); b.innerHTML = `<img alt="" src="${caseArt(c).full}"><span><b>${esc(c.n)}</b><small>${CATN[c.cat]}${lk ? " · нужен " + c.lvl + " ур." : ""}</small></span><span class="p">${fmt(cprice(c))}</span>`; b.disabled = lk; if (lk) b.style.opacity = .5; b.onclick = () => { btCase = c.id; closeModal(); $("arena").innerHTML = ""; btState() }; if (c.id === btCase) b.dataset.focus = 1; l.append(b) }); m.append(l) }, "sm") };
function previewPlayers() {
  const me = { n: ALL.nick, me: true, ava: ALL.ava, t: "это ты" };
  if (btMode === "boss") return [[me], [BOSS]];
  const bots = [...BOTS].sort(() => R() - .5);
  if (btFormat === "2v2") return [[me, bots[0]], [bots[1], bots[2]]];
  const k = { "1v1": 1, "1v2": 2, "1v3": 3 }[btFormat]; return [[me], ...bots.slice(0, k).map(b => [b])];
}
function buildArena(teams) {
  const a = $("arena"); a.innerHTML = ""; a.classList.toggle("teams", teams.some(t => t.length > 1));
  const sides = [];
  teams.forEach((team, ti) => { const tbox = el("div", "team"); team.forEach(p => { const d = el("div", "side" + (p === BOSS ? " boss" : "")); d.innerHTML = `<div class="who"><img alt="" src="${avatarURL(p.ava)}"><div><b>${esc(p.n)}</b><small>${esc(p.me ? (teams[ti].length > 1 ? "твоя команда" : "это ты") : p.t)}</small></div><span class="sum">0 ₽</span></div><div class="say">${esc(p.me ? "Удачи!" : p.say[0])}</div><div class="reel"><div class="needle"></div><div class="track"></div></div><div class="got"></div>`; tbox.append(d); sides.push({ p, d, team: ti, got: [] }) }); a.append(tbox) });
  const cs = btCs(); a.querySelectorAll(".track").forEach(t => { for (let j = 0; j < 9; j++) t.append(cell(probe(rollCase(cs).e))) });
  return sides;
}
$("btBtn").onclick = async () => {
  if (busy) return; const cost = btCost(); if (!canPay(cost)) return SND.error();
  const plan = btMode === "random" ? btPlan : Array(btRounds).fill(btCs());
  SND.unlock(); setBusy(true); pay(cost); refreshHeader(); btState();
  const teams = previewPlayers(), sides = buildArena(teams), fast = ALL.fast || RM();
  $("arena").scrollIntoView({ behavior: RM() ? "auto" : "smooth", block: "start" });
  for (let r = 0; r < plan.length; r++) {
    const cs = plan[r];
    const res = sides.map(s => { const { e } = rollCase(cs); return e.cid ? { u: ++UID, kind: "case", cid: e.cid, f: 0, t: false, ts: Date.now(), kills: 0 } : makeInst(e.key) });
    sides.forEach((s, i) => { const reel = s.d.querySelector(".reel"); const nr = buildReel(cs, res[i]); reel.replaceWith(nr) });
    await Promise.all(sides.map((s, i) => spinReel(s.d.querySelector(".reel"), RM() ? 0 : fast ? 900 : 3600 + i * 180, i === 0)));
    SND.stop();
    sides.forEach((s, i) => { s.got.push(res[i]); s.d.querySelector(".got").append(cell(res[i])); s.d.querySelector(".sum").textContent = fmt(s.got.reduce((a, b) => a + priceOf(b), 0)); if (!s.p.me) { const say = s.p.say[FAIR.int(s.p.say.length)]; s.d.querySelector(".say").textContent = instR(res[i]) >= 4 ? "Ого! " + say : say } });
    if (r < plan.length - 1) await sleep(fast ? 200 : 600);
  }
  const teamSum = ti => sides.filter(s => s.team === ti).reduce((a, s) => a + s.got.reduce((x, y) => x + priceOf(y), 0), 0) * (btMode === "boss" && sides.find(s => s.team === ti).p === BOSS ? 1.25 : 1);
  const sums = teams.map((_, ti) => teamSum(ti)), best = btMode === "reverse" ? Math.min(...sums) : Math.max(...sums);
  const winners = sums.map((v, i) => v === best ? i : -1).filter(i => i >= 0), wt = winners[FAIR.int(winners.length)]; // ничья — жребий
  const myTeam = 0, win = wt === myTeam, all = sides.flatMap(s => s.got);
  sides.forEach(s => { s.d.classList.add(s.team === wt ? "won" : "lost"); if (!s.p.me) s.d.querySelector(".say").textContent = s.team === wt ? s.p.win : s.p.lose; else s.d.querySelector(".say").textContent = win ? "Победа!" : "Не в этот раз." });
  S.st.bTotal++; S.st.opened += plan.length; plan.forEach(c => S.opens[c.id] = (S.opens[c.id] || 0) + 1);
  let mine = [];
  if (win) {
    S.st.bWins++; if (btFormat === "2v2") S.st.team++; if (btMode === "boss") S.st.boss++; if (btMode === "reverse") S.st.rev++;
    // в команде напарник забирает свои предметы, тебе — твои и всё у проигравших
    mine = btFormat === "2v2" ? sides.filter(s => s.p.me || s.team !== myTeam).flatMap(s => s.got) : all;
    mine.forEach(x => addInv(x, "Батл")); S.st.won += mine.reduce((a, b) => a + priceOf(b), 0);
    if (btMode === "boss") earn(cost);
    S.inv.filter(i => i.t && S.show.includes(i.u)).forEach(i => i.kills += plan.length * 2);
  }
  track("battle", { win }); save(); setBusy(false); refresh();
  if (win) { await sleep(500); reveal(mine, null, null, fast); if (btMode === "boss") toast("Награда за босса: +" + fmt(cost), "good") }
  else { SND.upLose(); toast(`${sides.find(s => s.team === wt).p.n} ${btFormat === "2v2" ? "с напарником " : ""}забирает ${fmt(all.reduce((a, b) => a + priceOf(b), 0))}`, "bad") }
};
