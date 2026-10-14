/* ================= Мини-игры: монетка, краш, мины, колесо удачи ================= */
let gameTab = "coin";
$("gameChips").onclick = e => { const b = e.target.closest("button"); if (!b || busy) return; gameTab = b.dataset.g; renderGames(); SND.click() };
function betBox(id, def) {
  const w = el("div", "field"); w.innerHTML = `<label for="${id}">Ставка</label><div class="bet"><button class="ghost sm" data-k=".5">½</button><input type="number" id="${id}" min="1" step="1" value="${def}" inputmode="numeric"><button class="ghost sm" data-k="2">×2</button><button class="ghost sm" data-k="max">Макс</button></div>`;
  w.querySelector(".bet").onclick = e => { const b = e.target.closest("button"); if (!b) return; const i = $(id); let v = +i.value || 1; if (b.dataset.k === "max") v = INF() ? 10000 : Math.max(1, S.bal); else v = Math.max(1, Math.round(v * +b.dataset.k)); i.value = INF() ? v : Math.min(v, Math.max(1, S.bal)) };
  return w;
}
const getBet = id => { const v = Math.floor(+$(id).value); return Number.isFinite(v) && v >= 1 ? v : 0 };
function takeBet(id) { const v = getBet(id); if (!v) { toast("Введи ставку от 1 ₽", "bad"); SND.error(); return 0 } if (!canPay(v)) { toast(`Не хватает ${fmt(v - S.bal)}`, "bad"); SND.error(); return 0 } pay(v); S.st.games++; refreshHeader(); return v }
function renderGames() {
  segSet("gameChips", "g", gameTab); [...$("gameChips").children].forEach(b => b.setAttribute("aria-selected", b.dataset.g === gameTab));
  ["coin", "crash", "mines", "wheel"].forEach(g => $("game-" + g).hidden = g !== gameTab);
  ({ coin: coinUI, crash: crashUI, mines: minesUI, wheel: wheelUI })[gameTab]();
}
/* ---------- Монетка ---------- */
const COIN_PAY = 1.94; let coinSide = "a", coinAng = 0, coinHist = [];
function coinUI() {
  const box = $("game-coin"); if (box.dataset.ok) { coinState(); return } box.dataset.ok = 1;
  box.innerHTML = `<div class="gbody"><div class="gside"></div><div class="coinbox"><div class="coin" id="coin"><div class="f a">О</div><div class="f b">Р</div></div><div class="chist" id="coinHist"></div></div></div>`;
  const side = box.querySelector(".gside");
  side.append(betBox("coinBet", 50));
  side.insertAdjacentHTML("beforeend", `<div class="field"><label>Сторона</label><div class="seg" id="coinSeg"><button data-s="a">Орёл</button><button data-s="b">Решка</button></div></div><button class="btn" id="coinBtn">Подбросить</button><p class="odds">Шанс <b>50%</b>, выплата <b>×${String(COIN_PAY).replace(".", ",")}</b>. Возврат игроку 97%.</p>`);
  $("coinSeg").onclick = e => { const b = e.target.closest("button"); if (!b || busy) return; coinSide = b.dataset.s; coinState() };
  $("coinBtn").onclick = async () => {
    if (busy) return; const bet = takeBet("coinBet"); if (!bet) return; SND.unlock(); setBusy(true); coinState();
    const res = FAIR.int(2) ? "a" : "b", win = res === coinSide, coin = $("coin");
    coinAng += 1800 + (res === "b" ? 180 : 0) - (coinAng % 360); SND.coin();
    coin.style.transition = RM() ? "none" : "transform 1.6s cubic-bezier(.2,.7,.2,1)"; coin.style.transform = `rotateY(${coinAng}deg)`;
    await sleep(RM() ? 50 : 1650);
    if (win) { earn(Math.round(bet * COIN_PAY)); S.st.coinW++; toast(`${res === "a" ? "Орёл" : "Решка"}! +${fmt(Math.round(bet * COIN_PAY))}`, "good"); SND.upWin() } else { S.st.coinL++; toast(`${res === "a" ? "Орёл" : "Решка"}. Ставка проиграна`, "bad"); SND.error() }
    coinHist.unshift(res); coinHist.length = Math.min(14, coinHist.length); track("game"); save(); setBusy(false); refresh();
  };
  coinState();
}
function coinState() { segSet("coinSeg", "s", coinSide); $("coinBtn").disabled = busy; $("coinHist").innerHTML = coinHist.map(r => `<span class="${r === coinSide ? "hi" : "lo"}">${r === "a" ? "О" : "Р"}</span>`).join("") }
/* ---------- Краш ---------- */
const CRASH_EDGE = .96; let crash = null, crashHist = [];
function crashUI() {
  const box = $("game-crash"); if (box.dataset.ok) { crashState(); return } box.dataset.ok = 1;
  box.innerHTML = `<div class="gbody"><div class="gside"></div><div><div class="crash"><canvas id="crashCv" width="800" height="400"></canvas><div class="m" id="crashM">×1,00</div></div><div class="chist" id="crashHist" style="margin-top:8px"></div></div></div>`;
  const side = box.querySelector(".gside"); side.append(betBox("crashBet", 50));
  side.insertAdjacentHTML("beforeend", `<div class="field"><label for="crashAuto">Автовывод на (×)</label><input type="number" id="crashAuto" min="1.01" step=".01" value="2"></div><button class="btn" id="crashBtn">Ставка</button><p class="odds">Множитель растёт, пока ракета не взорвётся. Забери раньше — получишь ставку × множитель. Шанс дожить до ×M равен <b>96% / M</b>: до ×2 — 48%, до ×10 — 9,6%.</p>`);
  $("crashBtn").onclick = () => crash && crash.run ? crashCash() : crashStart();
  crashDraw(1, []); crashState();
}
function crashState() { const b = $("crashBtn"); if (!b) return; if (crash && crash.run) { b.textContent = "Забрать " + fmt(crash.bet * crash.m); b.className = "btn good"; b.disabled = false } else { b.textContent = "Ставка"; b.className = "btn"; b.disabled = busy } $("crashHist").innerHTML = crashHist.map(m => `<span class="${m < 2 ? "lo" : "hi"}">×${m.toFixed(2).replace(".", ",")}</span>`).join("") }
function crashDraw(m, pts, boom) {
  const cv = $("crashCv"); if (!cv) return; const g = cv.getContext("2d"), W = 800, H = 400; g.clearRect(0, 0, W, H);
  const maxT = Math.max(8, pts.length ? pts[pts.length - 1][0] : 0), maxM = Math.max(2, m * 1.15);
  g.strokeStyle = "rgba(255,255,255,.06)"; g.lineWidth = 1; g.fillStyle = "rgba(255,255,255,.35)"; g.font = "14px 'Golos Text',sans-serif";
  for (let k = 1; k <= 5; k++) { const v = 1 + (maxM - 1) * k / 5, y = H - 30 - (v - 1) / (maxM - 1) * (H - 60); g.beginPath(); g.moveTo(40, y); g.lineTo(W, y); g.stroke(); g.fillText("×" + v.toFixed(1), 4, y + 4) }
  if (!pts.length) return; const X = t => 40 + t / maxT * (W - 70), Y = v => H - 30 - (v - 1) / (maxM - 1) * (H - 60);
  const gr_ = g.createLinearGradient(0, 0, W, 0); gr_.addColorStop(0, "#ffb21f"); gr_.addColorStop(1, boom ? "#ff5a5a" : "#4fe39a");
  g.beginPath(); pts.forEach(([t, v], i) => i ? g.lineTo(X(t), Y(v)) : g.moveTo(X(t), Y(v))); g.strokeStyle = gr_; g.lineWidth = 4; g.shadowColor = boom ? "#ff5a5a" : "#ffb21f"; g.shadowBlur = 16; g.stroke(); g.shadowBlur = 0;
  g.lineTo(X(pts[pts.length - 1][0]), H - 30); g.lineTo(X(0), H - 30); g.fillStyle = boom ? "rgba(255,90,90,.1)" : "rgba(255,178,31,.08)"; g.fill();
  const [tl, vl] = pts[pts.length - 1]; g.save(); g.translate(X(tl), Y(vl)); g.fillStyle = boom ? "#ff5a5a" : "#fff"; g.shadowColor = g.fillStyle; g.shadowBlur = 20; g.beginPath(); g.arc(0, 0, boom ? 14 : 7, 0, 7); g.fill(); g.restore();
}
function crashStart() {
  if (busy) return; const bet = takeBet("crashBet"); if (!bet) return; SND.unlock();
  const auto = Math.max(1.01, +$("crashAuto").value || 0);
  const point = Math.max(1, Math.floor(CRASH_EDGE / (1 - R()) * 100) / 100); // точка взрыва известна до старта, а не подстраивается
  crash = { bet, auto, point, m: 1, run: true, t0: performance.now(), pts: [], cashed: false };
  setBusy(true); $("crashM").className = "m"; crashState(); let lastTick = 1;
  const step = t => {
    if (!crash || !crash.run) return; const s = (t - crash.t0) / 1000, m = Math.exp(.16 * s); crash.m = Math.min(m, crash.point); crash.pts.push([s, crash.m]);
    $("crashM").textContent = "×" + crash.m.toFixed(2).replace(".", ","); if (crash.m - lastTick >= .25) { lastTick = crash.m; SND.crashTick(crash.m) }
    if (crash.m >= crash.auto && crash.auto < crash.point) { crash.m = crash.auto; return crashCash() }
    if (m >= crash.point) return crashBoom();
    crashDraw(crash.m, crash.pts); crashState(); requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function crashCash() {
  if (!crash || !crash.run) return; crash.run = false; const win = Math.round(crash.bet * crash.m); earn(win); S.st.crashW++; S.st.crashBest = Math.max(S.st.crashBest, crash.m);
  $("crashM").className = "m cash"; $("crashM").textContent = "×" + crash.m.toFixed(2).replace(".", ",") + " · +" + fmt(win); SND.upWin(); track("game"); track("crash", { m: crash.m });
  const c = crash; setTimeout(() => { crashHist.unshift(c.point); crashHist.length = Math.min(14, crashHist.length); crashState() }, 10);
  crashDraw(crash.m, crash.pts); save(); setBusy(false); refresh(); crashState();
}
function crashBoom() {
  crash.run = false; crash.m = crash.point; $("crashM").className = "m boom"; $("crashM").textContent = "×" + crash.point.toFixed(2).replace(".", ",") + " · взрыв"; SND.boom(); FX.quake();
  crashHist.unshift(crash.point); crashHist.length = Math.min(14, crashHist.length); crashDraw(crash.m, crash.pts, true); track("game"); save(); setBusy(false); refresh(); crashState();
}
/* ---------- Мины 5×5 ---------- */
let mines = null, minesN = 3;
const comb = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r };
const minesMult = (m, k) => k ? .97 * comb(25, k) / comb(25 - m, k) : 1;
const GEM = '<svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z" fill="#4fe39a"/><path d="M2 9h20M9 3l3 6 3-6M12 9v12" stroke="#0a3a24" stroke-width="1.2" fill="none"/></svg>';
const BOMB = '<svg viewBox="0 0 24 24"><circle cx="11" cy="14" r="7" fill="#ff5a5a"/><path d="M15 8l3-3M19 3l1 1" stroke="#ffcf4a" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="12" r="2" fill="#fff" opacity=".5"/></svg>';
function minesUI() {
  const box = $("game-mines"); if (box.dataset.ok) { minesState(); return } box.dataset.ok = 1;
  box.innerHTML = `<div class="gbody"><div class="gside"></div><div class="mines" id="minesGrid"></div></div>`;
  const side = box.querySelector(".gside"); side.append(betBox("minesBet", 50));
  side.insertAdjacentHTML("beforeend", `<div class="field"><label>Мин на поле</label><div class="seg" id="minesSeg">${[1, 3, 5, 10, 20].map(n => `<button data-n="${n}">${n}</button>`).join("")}</div></div><button class="btn" id="minesBtn">Играть</button><p class="odds" id="minesOdds"></p>`);
  $("minesSeg").onclick = e => { const b = e.target.closest("button"); if (!b || (mines && mines.run)) return; minesN = +b.dataset.n; minesState() };
  $("minesBtn").onclick = () => mines && mines.run ? minesCash() : minesStart();
  const g = $("minesGrid"); for (let i = 0; i < 25; i++) { const b = el("button"); b.dataset.i = i; b.setAttribute("aria-label", "Клетка " + (i + 1)); g.append(b) }
  g.onclick = e => { const b = e.target.closest("button"); if (b) minesPick(+b.dataset.i) };
  minesState();
}
function minesState() {
  segSet("minesSeg", "n", minesN); const run = mines && mines.run, k = mines ? mines.open.size : 0;
  [...$("minesSeg").children].forEach(b => b.disabled = !!run);
  const b = $("minesBtn"); if (run) { b.textContent = k ? "Забрать " + fmt(mines.bet * minesMult(mines.n, k)) : "Открой клетку"; b.className = "btn good"; b.disabled = !k } else { b.textContent = "Играть"; b.className = "btn"; b.disabled = busy }
  const nx = run ? k + 1 : 1, m = run ? mines.n : minesN, safe = (25 - m - (nx - 1)) / (25 - (nx - 1));
  $("minesOdds").innerHTML = `Следующая клетка безопасна с шансом <b>${fmtP(Math.max(0, safe), 1)}</b>. Множитель после неё <b>×${minesMult(m, nx).toFixed(2).replace(".", ",")}</b>. Формула: 0,97 × C(25, k) / C(${25 - m}, k).`;
  [...$("minesGrid").children].forEach((c, i) => { c.disabled = !run || (mines && mines.open.has(i)) });
}
function minesStart() {
  if (busy) return; const bet = takeBet("minesBet"); if (!bet) return; SND.unlock();
  const cells = [...Array(25).keys()]; for (let i = 24; i > 0; i--) { const j = FAIR.int(i + 1);[cells[i], cells[j]] = [cells[j], cells[i]] }
  mines = { bet, n: minesN, bombs: new Set(cells.slice(0, minesN)), open: new Set(), run: true }; setBusy(true);
  [...$("minesGrid").children].forEach(c => { c.className = ""; c.innerHTML = "" }); minesState();
}
function minesPick(i) {
  if (!mines || !mines.run || mines.open.has(i)) return; const c = $("minesGrid").children[i];
  if (mines.bombs.has(i)) { c.className = "bomb"; c.innerHTML = BOMB; SND.boom(); FX.quake(); mines.run = false; minesReveal(); toast("Мина! Ставка сгорела", "bad"); S.st.minesBest = Math.max(S.st.minesBest, mines.open.size); track("game"); track("mines", { gems: mines.open.size }); save(); setBusy(false); refresh(); minesState(); return }
  mines.open.add(i); c.className = "gem"; c.innerHTML = GEM; SND.gem();
  if (mines.open.size === 25 - mines.n) return minesCash(); minesState();
}
function minesReveal() { [...$("minesGrid").children].forEach((c, i) => { if (mines.open.has(i)) return; if (mines.bombs.has(i)) { if (!c.className) { c.className = "bomb ghosted"; c.innerHTML = BOMB } } else { c.className = "gem ghosted"; c.innerHTML = GEM } }) }
function minesCash() {
  if (!mines || !mines.run || !mines.open.size) return; mines.run = false; const k = mines.open.size, win = Math.round(mines.bet * minesMult(mines.n, k)); earn(win); S.st.minesW++; S.st.minesBest = Math.max(S.st.minesBest, k);
  minesReveal(); toast(`Забрано ${fmt(win)} (×${minesMult(mines.n, k).toFixed(2).replace(".", ",")})`, "good"); SND.upWin(); track("game"); track("mines", { gems: k }); save(); setBusy(false); refresh(); minesState();
}
/* ---------- Колесо удачи: раз в сутки ---------- */
const WHEEL = [["100 ₽", 100, .3, "#3a3350"], ["250 ₽", 250, .22, "#4f8dff"], ["500 ₽", 500, .15, "#8b5cff"], ["Кейс «Арсенал»", "c:arsenal", .12, "#5c7fae"], ["1 000 ₽", 1000, .1, "#e04cff"], ["Кейс «Космос»", "c:cosmos", .06, "#6a5cff"], ["2 500 ₽", 2500, .04, "#ff3b4e"], ["Кейс «Клинок»", "c:klinok", .01, "#ffbf2e"]];
let wheelAng = 0;
function wheelUI() {
  const box = $("game-wheel"); if (!box.dataset.ok) {
    box.dataset.ok = 1;
    box.innerHTML = `<div class="gbody"><div class="gside"><p class="odds" id="wheelInfo"></p><button class="btn" id="wheelBtn">Крутить</button><div class="odds">${WHEEL.map(w => `<div class="row between"><span>${w[0]}</span><b>${Math.round(w[2] * 100)}%</b></div>`).join("")}</div></div><div class="wheel"><div class="ptr"></div><canvas id="wheelCv" width="600" height="600"></canvas></div></div>`;
    $("wheelBtn").onclick = wheelSpin;
  }
  wheelDraw(wheelAng); wheelState();
}
function wheelState() {
  const can = MODE().bonus && S.wheelDay !== dayNo(), b = $("wheelBtn"); if (!b) return; b.disabled = busy || !can;
  const left = (dayNo() + 1) * DAY - 3 * 3600e3 - Date.now();
  $("wheelInfo").innerHTML = !MODE().bonus ? (INF() ? "В бесконечном режиме колесо не нужно: деньги и так не кончаются." : "В хардкоре бонусов нет — колесо выключено.") : can ? "Бесплатный прокрут раз в сутки. Призы и шансы указаны ниже." : `Следующий прокрут через <b>${hms(left)}</b>.`;
  b.textContent = can ? "Крутить" : "Завтра";
}
function wheelDraw(ang) {
  const cv = $("wheelCv"); if (!cv) return; const g = cv.getContext("2d"), m = 300, R_ = 290; g.clearRect(0, 0, 600, 600); let a = -Math.PI / 2 + ang;
  for (const [n, , p, c] of WHEEL) { const da = p * 6.283; g.beginPath(); g.moveTo(m, m); g.arc(m, m, R_, a, a + da); g.closePath(); g.fillStyle = c; g.fill(); g.strokeStyle = "#0a090f"; g.lineWidth = 3; g.stroke(); g.save(); g.translate(m, m); g.rotate(a + da / 2); g.fillStyle = "#fff"; g.font = `800 ${da > .5 ? 22 : 15}px 'Golos Text',sans-serif`; g.textAlign = "right"; g.textBaseline = "middle"; g.fillText(n, R_ - 18, 0); g.restore(); a += da }
  g.beginPath(); g.arc(m, m, 46, 0, 7); g.fillStyle = "#14121c"; g.fill(); g.strokeStyle = "#ffb21f"; g.lineWidth = 4; g.stroke();
}
async function wheelSpin() {
  if (busy || !MODE().bonus || S.wheelDay === dayNo()) return; SND.unlock(); setBusy(true); S.wheelDay = dayNo(); S.st.wheel++; wheelState();
  let x = R(), idx = 0, acc = 0; for (let i = 0; i < WHEEL.length; i++) { acc += WHEEL[i][2]; if (x < acc) { idx = i; break } idx = i }
  const before = WHEEL.slice(0, idx).reduce((a, w) => a + w[2], 0), mid = before + WHEEL[idx][2] * (.15 + R() * .7);
  const start = wheelAng % 6.283, end = 6.283 * 6 - mid * 6.283, D = RM() ? 10 : 5200, t0 = performance.now(); let last = 0;
  await new Promise(res => { const st = t => { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 4); wheelAng = start + (end - start) * e; wheelDraw(wheelAng); const s = Math.floor(wheelAng / .26); if (s !== last) { last = s; SND.tick(.5) } k < 1 ? requestAnimationFrame(st) : res() }; requestAnimationFrame(st) });
  const pr = WHEEL[idx][1];
  if (typeof pr === "number") { earn(pr); toast(`Колесо: +${fmt(pr)}`, "good"); celebrate(pr >= 1000 ? 5 : 3) }
  else { const cs = CASE_BY[pr.slice(2)]; addInv({ u: ++UID, kind: "case", cid: cs.id, f: 0, t: false, ts: Date.now(), kills: 0 }, "Колесо удачи"); toast(`Колесо: кейс «${cs.n}» в инвентаре`, "good"); celebrate(cs.topR >= 6 ? 6 : 4) }
  track("game"); save(); setBusy(false); refresh(); wheelState();
}
