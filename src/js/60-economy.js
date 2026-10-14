/* ================= Редкость, износ, каталог, рынок ================= */
const RAR = [
  { n: "Обычное", h: "#a3aec2", w: 400, m: 1 },
  { n: "Добротное", h: "#5ec98a", w: 220, m: 2.6 },
  { n: "Редкое", h: "#4f8dff", w: 120, m: 7 },
  { n: "Элитное", h: "#8b5cff", w: 60, m: 18 },
  { n: "Эпическое", h: "#e04cff", w: 28, m: 48 },
  { n: "Легендарное", h: "#ff3b4e", w: 12, m: 130 },
  { n: "Мифическое", h: "#ffbf2e", w: 4, m: 380 },
  { n: "Реликвия", h: "#34f0d8", w: 1.2, m: 1100 },
];
const WEAR = [
  { n: "Заводское", s: "ЗВ", max: .07, m: 1.45 },
  { n: "Почти новое", s: "ПН", max: .15, m: 1.2 },
  { n: "Полевое", s: "ПЛ", max: .38, m: 1 },
  { n: "Поношенное", s: "ПШ", max: .45, m: .86 },
  { n: "Боевое", s: "БВ", max: 1, m: .72 },
];
const FLOAT_POW = 1.6, TURBO_P = .1, TURBO_M = 1.8;
const tierOf = f => { for (let i = 0; i < WEAR.length; i++) if (f < WEAR[i].max) return i; return 4 };
// Точное матожидание множителя износа: f = U^1.6 → P(f < x) = x^(1/1.6)
const E_WEAR = (() => { let e = 0, prev = 0; WEAR.forEach(w => { const c = Math.pow(Math.min(1, w.max), 1 / FLOAT_POW); e += (c - prev) * w.m; prev = c }); return e })();
const MIN_WEAR_M = Math.min(...WEAR.map(w => w.m));
const isMeleeT = t => WEAPON[t].cls === "melee", isGloveT = t => WEAPON[t].cls === "gloves";

const CAT = new Map();
function itemRarity(type, skin) { const c = WEAPON[type].cls; if (c === "melee" || c === "gloves") return Math.min(7, Math.max(6, skin.r + 2)); return skin.r }
function catItem(key) {
  let it = CAT.get(key); if (it) return it;
  const [type, sid] = key.split(":"); const W = WEAPON[type], sk = SKINS[sid]; if (!W || !sk) return null;
  const r = itemRarity(type, sk);
  it = { key, type, sid, skin: sk, r, cls: W.cls, wn: W.n, sn: sk.n, name: W.n + " | " + sk.n, base: Math.max(1, +(W.base * RAR[r].m * sk.mult).toFixed(2)), canTurbo: W.cls !== "gloves" };
  CAT.set(key, it); return it;
}
const EV_ITEM = it => it.base * E_WEAR * (it.canTurbo ? (1 - TURBO_P) + TURBO_P * TURBO_M : 1);

/* ---------- Рынок: плавные колебания цен, среднее = 1 ---------- */
function market(key, t = Date.now()) {
  const h = hseed(key), p1 = 3 + (h % 7), p2 = 40 + (h >>> 4) % 50, p3 = 20 + (h >>> 9) % 15;
  const ph1 = (h % 628) / 100, ph2 = ((h >>> 3) % 628) / 100, ph3 = ((h >>> 7) % 628) / 100, T = t / 6e4;
  return 1 + .075 * Math.sin(T / (p1 * 60) * 6.283 + ph1) + .035 * Math.sin(T / p2 * 6.283 + ph2) + .008 * Math.sin(T / p3 * 6.283 + ph3);
}
// Цена экземпляра: база вида × скин × износ × TURBO × рынок
function priceOf(inst, t) {
  if (inst.kind === "case") { const cs = CASE_BY[inst.cid]; return cs ? Math.max(1, Math.round(cs.price)) : 0 }
  const it = catItem(inst.k); if (!it) return 0;
  return Math.max(1, Math.round(it.base * WEAR[tierOf(inst.f)].m * (inst.t ? TURBO_M : 1) * market(inst.k, t)));
}
const trendOf = inst => inst.kind === "case" ? 0 : market(inst.k) / market(inst.k, Date.now() - 36e5) - 1;
function rollFloat() { return +Math.pow(R(), FLOAT_POW).toFixed(5) }
let UID = Date.now() % 1e9;
function makeInst(key, o = {}) {
  const it = catItem(key); const f = o.f ?? rollFloat();
  return { u: ++UID, k: key, f, t: o.t ?? (it.canTurbo && R() < TURBO_P), ts: Date.now(), kills: 0, src: o.src || "" };
}
const instName = i => i.kind === "case" ? "Кейс «" + (CASE_BY[i.cid] || {}).n + "»" : catItem(i.k).name;
const instR = i => i.kind === "case" ? (CASE_BY[i.cid] ? CASE_BY[i.cid].topR : 2) : catItem(i.k).r;
const specOf = (i, big) => { const it = catItem(i.k); return { type: it.type, skin: it.skin, tier: tierOf(i.f), turbo: !!i.t } };
