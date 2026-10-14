/* ================= Состояние, режимы, сохранение ================= */
const SAVE_KEY = "turbodrop_v4", OLD_KEY = "turbodrop_v3", SAVE_VER = 4;
const MODES = {
  norm: { n: "Обычный", start: 1000, bonus: true, price: 1, xp: 1 },
  inf: { n: "∞ Бесконечный", start: 0, bonus: false, price: 1, xp: 1, inf: true },
  hard: { n: "Хардкор", start: 1000, bonus: false, price: 1.2, xp: 2.5, hard: true },
};
const freshStats = () => ({ opened: 0, spent: 0, won: 0, best: null, bTotal: 0, bWins: 0, upTries: 0, upWins: 0, upBig: 0, ctTotal: 0, ctWin: 0, turbo: 0, perfect: 0, bought: 0, sold: 0, soldSum: 0, rc: [0, 0, 0, 0, 0, 0, 0, 0], coinW: 0, coinL: 0, crashBest: 0, crashW: 0, minesBest: 0, minesW: 0, games: 0, wheel: 0, maxBal: 0, maxInv: 0, fastOpen: 0, x10: 0, caseKinds: 0, knives: 0, gloves: 0, cofc: 0, mult5: 0, team: 0, boss: 0, rev: 0, marketSell: 0, quests: 0 });
function freshMode(m) {
  const M = MODES[m];
  return { bal: M.inf ? 0 : M.start, inv: [], st: freshStats(), xp: 0, lvl: 0, hist: [], ach: [], bonusAt: 0, free: {}, wheelDay: -1, streak: { day: -1, n: 0, best: 0 }, quests: { day: -1, list: [] }, upHist: [], balHist: [[Date.now(), M.inf ? 0 : M.start]], show: [], opens: {}, ctHist: [] };
}
function freshAll() { return { ver: SAVE_VER, mode: "norm", snd: { on: true, vol: .7 }, fast: false, fav: [], nick: "Игрок", ava: FAIR.int(1e9), modes: { norm: freshMode("norm"), inf: freshMode("inf"), hard: freshMode("hard") } } }

// Миграция v3 → v4: старый id предмета → вид и скин новой системы, баланс и статистика сохраняются
const V3_TYPE = { pistol: "p17", heavy: "taran", revolver: "r357", smg: "shershen", shotgun: "pompa", rifle: "ak74", bullpup: "kobra", sniper: "orlan", lmg: "medved", crossbow: "grom", knife: "knife", butterfly: "butterfly", karambit: "karambit", katana: "katana", axe: "axe", machete: "machete" };
const V3_PAT = { fade: "fade", camo: "camo", digital: "pixel", carbon: "carbon", checker: "checker", tiger: "tiger", marble: "marble", damascus: "damascus", galaxy: "space", neon: "neon", flames: "fire", gold: "goldeng", hex: "honey", splash: "splat", crystal: "crystal", swirl: "swirl", temper: "temper", scales: "dragon", leopard: "leopard", racing: "racing", aurora: "aurora", cracks: "lava", graffiti: "graffiti", glitch: "glitch", web: "web" };
const V3_R = [0, 2, 3, 4, 5, 6];
function v3Key(oldId) {
  const e = LEGACY_V3[oldId]; if (!e) return null; const [t, pat, r] = e.split(":");
  const type = V3_TYPE[t] || "ak74", tex = V3_PAT[pat] || "camo", want = V3_R[+r] ?? 0;
  const vars = SKIN_IDS.filter(id => SKINS[id].key === tex); if (!vars.length) return null;
  vars.sort((a, b) => Math.abs(SKINS[a].r - want) - Math.abs(SKINS[b].r - want)); return type + ":" + vars[0];
}
function migrateV3(old) {
  const A = freshAll(); A.snd.on = old.snd !== false; A.mode = old.mode === "inf" ? "inf" : "norm";
  for (const m of ["norm", "inf"]) {
    const o = old[m]; if (!o) continue; const S = A.modes[m];
    S.bal = m === "inf" ? 0 : Math.max(0, Math.round(+o.bal || 0)); S.xp = Math.max(0, +o.xp || 0); S.lvl = lvlOf(S.xp);
    S.inv = (o.inv || []).map(i => { const k = v3Key(i.id); return k && catItem(k) ? { u: ++UID, k, f: clamp(+i.f || .2, 0, .9999), t: !!i.turbo && catItem(k).canTurbo, ts: +i.ts || Date.now(), kills: 0, src: "Перенос v3" } : null }).filter(Boolean);
    const st = S.st; ["opened", "spent", "won", "bTotal", "bWins", "upWins", "upBig", "turbo", "perfect", "bought"].forEach(k => st[k] = Math.max(0, +o[k] || 0)); st.ctWin = +o.ctWin || 0; st.best = o.best && o.best.n ? { n: String(o.best.n), p: +o.best.p || 0 } : null;
    (o.rc || []).forEach((n, i) => { st.rc[V3_R[i] ?? 0] += +n || 0 });
    S.hist = (o.hist || []).slice(0, 60).map(h => { const k = v3Key(h.id); return k ? { k, f: .2, t: !!h.turbo, p: +h.price || 0, src: h.src || "", ts: +h.ts || Date.now() } : null }).filter(Boolean);
    S.bonusAt = +o.bonusAt || 0; S.balHist = [[Date.now(), S.bal]];
  }
  return A;
}
// Проверка и нормализация загруженного сохранения v4
function normalize(x) {
  const A = freshAll(); if (!x || typeof x !== "object") return A;
  A.mode = MODES[x.mode] ? x.mode : "norm"; A.snd = { on: x.snd ? x.snd.on !== false : true, vol: clamp(+(x.snd && x.snd.vol) || .7, 0, 1) }; A.fast = !!x.fast;
  A.fav = Array.isArray(x.fav) ? x.fav.filter(id => CASE_BY[id]) : []; A.nick = String(x.nick || "Игрок").slice(0, 18) || "Игрок"; A.ava = Number.isFinite(+x.ava) ? +x.ava : A.ava;
  for (const m of Object.keys(MODES)) {
    const src = x.modes && x.modes[m]; if (!src) continue; const S = Object.assign(freshMode(m), src);
    S.st = Object.assign(freshStats(), src.st || {}); if (!Array.isArray(S.st.rc) || S.st.rc.length !== 8) S.st.rc = freshStats().rc;
    S.bal = MODES[m].inf ? 0 : Math.max(0, Math.round(+S.bal || 0));
    const seen = new Set();
    S.inv = (Array.isArray(S.inv) ? S.inv : []).filter(i => i && (i.kind === "case" ? CASE_BY[i.cid] : catItem(i.k)) && !seen.has(i.u) && seen.add(i.u)).map(i => (i.f = clamp(+i.f || 0, 0, .99999), i.kills = Math.max(0, +i.kills || 0), i));
    S.inv.forEach(i => { if (i.u > UID) UID = i.u });
    S.hist = (Array.isArray(S.hist) ? S.hist : []).filter(h => h && (h.cid ? CASE_BY[h.cid] : catItem(h.k))).slice(0, 60);
    S.show = (S.show || []).filter(u => S.inv.some(i => i.u === u)).slice(0, 3);
    S.balHist = (Array.isArray(S.balHist) ? S.balHist : []).slice(-120); if (!S.balHist.length) S.balHist = [[Date.now(), S.bal]];
    S.upHist = (S.upHist || []).slice(0, 30); S.ctHist = (S.ctHist || []).slice(0, 20); S.lvl = lvlOf(S.xp);
    A.modes[m] = S;
  }
  return A;
}
// Хранилище: localStorage может быть недоступен — тогда работаем в памяти
const STORE = {
  ok: (() => { try { const k = "__td"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true } catch (e) { return false } })(),
  get(k) { try { return localStorage.getItem(k) } catch (e) { return null } },
  set(k, v) { try { localStorage.setItem(k, v); return true } catch (e) { return false } },
};
function loadAll() {
  let raw = STORE.get(SAVE_KEY);
  if (raw) { try { const x = JSON.parse(raw); if (x && x.ver >= 4) return { A: normalize(x), from: "v4" } } catch (e) { } }
  const old = STORE.get(OLD_KEY);
  if (old) { try { const x = JSON.parse(old); if (x && (x.norm || x.inf)) return { A: normalize(migrateV3(x)), from: "v3" } } catch (e) { } }
  return { A: freshAll(), from: "new" };
}
const lvlOf = xp => Math.floor(Math.sqrt(Math.max(0, xp) / 400));
const xpFor = l => 400 * l * l;
let ALL, S, LOADED_FROM;
let saveT = 0;
function save(now) { clearTimeout(saveT); const go = () => STORE.set(SAVE_KEY, JSON.stringify(ALL)); if (now) go(); else saveT = setTimeout(go, 250) }
addEventListener("pagehide", () => save(true));
const MODE = () => MODES[ALL.mode];
const INF = () => !!MODE().inf;
function exportSave() { return "TD4:" + btoa(unescape(encodeURIComponent(JSON.stringify(ALL)))) }
function importSave(str) {
  str = String(str || "").trim(); let x;
  try { x = JSON.parse(str.startsWith("TD4:") ? decodeURIComponent(escape(atob(str.slice(4)))) : str) } catch (e) { return "Строка повреждена: не удалось прочитать JSON." }
  if (x && x.ver >= 4) ALL = normalize(x); else if (x && (x.norm || x.inf)) ALL = normalize(migrateV3(x)); else return "Это не сохранение «ТурбоДропа».";
  S = ALL.modes[ALL.mode]; save(true); return "";
}
