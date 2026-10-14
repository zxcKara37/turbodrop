/* ================= Сборка кейсов и расчёт цены под RTP ================= */
const TICKETS = 100000; // шансы хранятся в билетах: сумма ровно 100 000 = 100,000%
const MULT_TABLE = [[1, .85], [2, .12], [5, .03]];
const E_MULT = MULT_TABLE.reduce((a, [m, p]) => a + m * p, 0);
const CASES = [], CASE_BY = {};
function expandTypes(spec) { return [...new Set(spec.split(",").filter(Boolean).flatMap(s => TYPES[s] || [s]))].filter(t => WEAPON[t]) }
function skinPool(spec) { if (spec === "*") return SKIN_IDS; const keys = new Set(spec.split(",")); return SKIN_IDS.filter(id => keys.has(SKINS[id].key)) }
// Билеты методом наибольшего остатка: доли → целые, сумма ровно TICKETS
function toTickets(weights) {
  const tw = weights.reduce((a, b) => a + b, 0), raw = weights.map(w => w / tw * TICKETS), fl = raw.map(Math.floor);
  let left = TICKETS - fl.reduce((a, b) => a + b, 0); raw.map((x, i) => [x - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left-- } });
  return fl.map(x => Math.max(1, x));
}
function fixTickets(t) { let d = TICKETS - t.reduce((a, b) => a + b, 0); const i = t.indexOf(Math.max(...t)); t[i] += d; return t }
const nicePrice = p => p < 10 ? Math.round(p * 10) / 10 : p < 200 ? Math.round(p) : p < 2000 ? Math.round(p / 5) * 5 : Math.round(p / 10) * 10;
function buildCase(def, idx) {
  const [id, n, cat, shape, emblem, hue, hue2, lvl0, types, skins, prof, o = {}] = def;
  const cs = { id, n, cat, shape, emblem, hue, hue2, lvl: o.lvl ?? lvl0, kind: o.kind || (o.free ? "free" : "normal"), free: !!o.free, order: idx, items: [] };
  const r = rng(hseed("case:" + id));
  if (cs.kind === "cases") return cs; // заполняется после остальных
  const gunT = expandTypes(types).filter(t => !isMeleeT(t) && !isGloveT(t));
  const ownMelee = expandTypes(types).filter(isMeleeT);
  const meleePool = ownMelee.length ? ownMelee : o.melee ? expandTypes(o.melee) : TYPES.melee;
  const glovePool = expandTypes(types).filter(isGloveT).length ? expandTypes(types).filter(isGloveT) : TYPES.gloves;
  let sp = skinPool(skins);
  const used = new Set(), usedType = {};
  let slots = RPROF[prof].slice();
  if (cs.kind === "guarantee") slots = [3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6];
  for (const s of slots) {
    let rr, pool;
    if (typeof s === "string") { rr = +s[1]; pool = s[0] === "k" ? meleePool : glovePool } else { rr = s; pool = gunT.length ? gunT : TYPES.guns }
    const cands = [];
    const tryPool = skinIds => { for (const t of pool) for (const sid of skinIds) { const key = t + ":" + sid; if (used.has(key)) continue; if (itemRarity(t, SKINS[sid]) === rr) cands.push(key) } };
    tryPool(sp); if (!cands.length) tryPool(SKIN_IDS.filter(x => Math.abs(SKINS[x].r - (typeof s === "string" ? rr - 2 : rr)) <= 0));
    if (!cands.length) tryPool(SKIN_IDS);
    if (!cands.length) continue;
    // разнообразие видов: меньше повторов одного вида
    cands.sort((a, b) => (usedType[a.split(":")[0]] || 0) - (usedType[b.split(":")[0]] || 0));
    const minUse = usedType[cands[0].split(":")[0]] || 0, best = cands.filter(k => (usedType[k.split(":")[0]] || 0) === minUse);
    const key = best[Math.floor(r() * best.length)]; used.add(key); usedType[key.split(":")[0]] = (usedType[key.split(":")[0]] || 0) + 1;
    cs.items.push({ key, r: rr });
  }
  const cnt = {}; cs.items.forEach(e => cnt[e.r] = (cnt[e.r] || 0) + 1);
  const t = toTickets(cs.items.map(e => RAR[e.r].w / cnt[e.r])); fixTickets(t); cs.items.forEach((e, i) => e.t = t[i]);
  finishCase(cs, r);
  return cs;
}
function caseEV(cs) {
  if (cs.kind === "cases") return cs.items.reduce((a, e) => a + e.t / TICKETS * CASE_BY[e.cid].price, 0);
  const ev = cs.items.reduce((a, e) => a + e.t / TICKETS * EV_ITEM(catItem(e.key)), 0);
  return cs.kind === "mult" ? ev * E_MULT : ev;
}
function finishCase(cs, r) {
  cs.items.sort((a, b) => (b.cid ? CASE_BY[b.cid].price : catItem(b.key).base) - (a.cid ? CASE_BY[a.cid].price : catItem(a.key).base));
  cs.ev = caseEV(cs);
  const target = .895 + r() * .03;
  cs.price = cs.free ? 0 : nicePrice(cs.ev / target);
  cs.rtp = cs.free ? 0 : cs.ev / cs.price;
  cs.topR = Math.max(...cs.items.map(e => e.r));
  if (cs.kind === "guarantee") cs.floor = Math.floor(Math.min(...cs.items.map(e => catItem(e.key).base * MIN_WEAR_M * .825)));
  cs.pop = 40 + (hseed(cs.id) % 60);
}
CASE_DEF.forEach((d, i) => { const cs = buildCase(d, i); CASES.push(cs); CASE_BY[cs.id] = cs });
// «Кейс из кейсов»: в дропе — запечатанные кейсы, шанс обратно пропорционален цене
{
  const cs = CASE_BY.caseofcases, pool = CASES.filter(c => !c.free && c.kind === "normal" && c.price >= 60).sort((a, b) => a.price - b.price);
  const pick = pool.filter((c, i) => i % Math.max(1, Math.floor(pool.length / 16)) === 0).slice(0, 16);
  const t = toTickets(pick.map(c => 1 / Math.pow(c.price, .85))); fixTickets(t);
  cs.items = pick.map((c, i) => ({ cid: c.id, r: c.topR >= 6 ? Math.min(7, c.topR) : c.topR, t: t[i] }));
  finishCase(cs, rng(hseed("case:caseofcases")));
}
const caseItemCount = cs => cs.items.length;
// Проверка: сумма шансов 100%, RTP в коридоре 88–94%
function verifyCases() {
  return CASES.map(cs => ({ id: cs.id, n: cs.n, items: cs.items.length, sum: cs.items.reduce((a, e) => a + e.t, 0), rtp: cs.rtp, price: cs.price, ok: cs.items.reduce((a, e) => a + e.t, 0) === TICKETS && (cs.free || (cs.rtp >= .88 && cs.rtp <= .94)) && cs.items.length >= 12 && cs.items.length <= 25 }));
}
// Бросок: честный билет 1..100000 → предмет
function rollCase(cs) {
  const ticket = FAIR.int(TICKETS) + 1; let acc = 0;
  for (const e of cs.items) { acc += e.t; if (ticket <= acc) return { e, ticket } }
  return { e: cs.items[cs.items.length - 1], ticket };
}
function rollMult() { const x = R(); let a = 0; for (const [m, p] of MULT_TABLE) { a += p; if (x < a) return m } return 1 }
