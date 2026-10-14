/* ================= Достижения, задания, серия входов, лидеры ================= */
const invValue = () => S.inv.reduce((a, b) => a + priceOf(b), 0);
const ACH = [
  // [id, название, описание, проверка, награда ₽, эмблема, ступень 0–3]
  ["open1", "Первый шаг", "Открыть первый кейс", s => s.st.opened >= 1, 50, "box", 0],
  ["open50", "Завсегдатай", "Открыть 50 кейсов", s => s.st.opened >= 50, 200, "box", 1],
  ["open250", "Кейсоман", "Открыть 250 кейсов", s => s.st.opened >= 250, 800, "box", 2],
  ["open1000", "Тысячник", "Открыть 1 000 кейсов", s => s.st.opened >= 1000, 3000, "box", 3],
  ["kinds10", "Дегустатор", "Открыть 10 разных кейсов", s => Object.keys(s.opens).length >= 10, 300, "dice", 1],
  ["kinds30", "Коллекционер кейсов", "Открыть 30 разных кейсов", s => Object.keys(s.opens).length >= 30, 1500, "dice", 2],
  ["r3", "Элита", "Выбить элитный предмет", s => s.st.rc.slice(3).some(Boolean), 100, "star", 0],
  ["r4", "Эпично", "Выбить эпический предмет", s => s.st.rc.slice(4).some(Boolean), 250, "star", 1],
  ["r5", "Легенда", "Выбить легендарный предмет", s => s.st.rc.slice(5).some(Boolean), 600, "flame", 2],
  ["r6", "Миф", "Выбить мифический предмет", s => s.st.rc.slice(6).some(Boolean), 1500, "crown", 2],
  ["r7", "Реликвия", "Выбить реликвию", s => s.st.rc[7] > 0, 5000, "gem", 3],
  ["knife", "Холодный расчёт", "Получить нож", s => s.st.knives > 0, 1000, "blade", 2],
  ["gloves", "Хватка", "Получить перчатки", s => s.st.gloves > 0, 1000, "fist", 2],
  ["turbo", "Турбо", "Получить предмет TURBO", s => s.st.turbo > 0, 150, "bolt", 0],
  ["turbo10", "Турбо-коллекция", "Получить 10 предметов TURBO", s => s.st.turbo >= 10, 900, "bolt", 2],
  ["perfect", "Идеал", "Износ меньше 0,01", s => s.st.perfect > 0, 400, "eye", 1],
  ["x10", "Десятка", "Открыть 10 кейсов за раз", s => s.st.x10 > 0, 300, "target", 1],
  ["fast50", "Скорострел", "50 открытий в быстром режиме", s => s.st.fastOpen >= 50, 300, "bolt", 1],
  ["cofc", "Матрёшка", "Выбить кейс из «Кейса из кейсов»", s => s.st.cofc > 0, 300, "box", 1],
  ["mult5", "Пятикратно", "Поймать множитель ×5", s => s.st.mult5 > 0, 700, "infinity", 2],
  ["up1", "Рисковый", "Попробовать апгрейд", s => s.st.upTries > 0, 50, "target", 0],
  ["upw1", "Повезло", "Выиграть апгрейд", s => s.st.upWins > 0, 200, "target", 1],
  ["upw10", "Мастер апгрейда", "Выиграть 10 апгрейдов", s => s.st.upWins >= 10, 1000, "target", 2],
  ["upBig", "Безумец", "Выиграть апгрейд ×10 и выше", s => s.st.upBig > 0, 1500, "flame", 3],
  ["ct1", "Юрист", "Подписать контракт", s => s.st.ctTotal > 0, 100, "shield", 0],
  ["ctw", "Сделка века", "Контракт с результатом ×2,5 и выше", s => s.st.ctWin > 0, 800, "shield", 2],
  ["bt1", "На арене", "Сыграть батл", s => s.st.bTotal > 0, 50, "fang", 0],
  ["btw1", "Первая кровь", "Выиграть батл", s => s.st.bWins > 0, 200, "fang", 1],
  ["btw10", "Гладиатор", "Выиграть 10 батлов", s => s.st.bWins >= 10, 1200, "trophy", 2],
  ["team", "Командный игрок", "Выиграть батл 2 на 2", s => s.st.team > 0, 400, "shield", 1],
  ["boss", "Убийца боссов", "Победить в босс-батле", s => s.st.boss > 0, 1000, "skull", 2],
  ["rev", "Наоборот", "Выиграть батл «Наоборот»", s => s.st.rev > 0, 300, "moon", 1],
  ["coin", "Орёл или решка", "Выиграть 5 раз в монетку", s => s.st.coinW >= 5, 200, "coin", 1],
  ["crash5", "Вовремя", "Забрать в краше на ×5 и выше", s => s.st.crashBest >= 5, 600, "bolt", 2],
  ["mines8", "Сапёр", "Открыть 8 камней за одну игру в минах", s => s.st.minesBest >= 8, 500, "gem", 2],
  ["wheel", "Крути барабан", "Крутануть колесо удачи", s => s.st.wheel > 0, 100, "sun", 0],
  ["bal10k", "Капитал", "Баланс 10 000 ₽", s => s.st.maxBal >= 1e4, 500, "coin", 1],
  ["bal100k", "Магнат", "Баланс 100 000 ₽", s => s.st.maxBal >= 1e5, 3000, "crown", 3],
  ["inv50k", "Склад", "Инвентарь дороже 50 000 ₽", s => invValue() >= 5e4, 1500, "chip", 2],
  ["inv100", "Барахольщик", "100 предметов в инвентаре", s => s.st.maxInv >= 100, 500, "box", 1],
  ["sold100", "Торговец", "Продать 100 предметов", s => s.st.sold >= 100, 500, "coin", 1],
  ["market", "Биржевик", "Купить скин на рынке", s => s.st.bought > 0, 100, "chip", 0],
  ["lvl5", "Новобранец", "Достичь 5 уровня", s => s.lvl >= 5, 0, "star", 0],
  ["lvl10", "Ветеран", "Достичь 10 уровня", s => s.lvl >= 10, 0, "star", 1],
  ["lvl20", "Полковник", "Достичь 20 уровня", s => s.lvl >= 20, 0, "crown", 2],
  ["streak7", "Неделя подряд", "Заходить 7 дней подряд", s => s.streak.best >= 7, 700, "sun", 2],
  ["quests10", "Исполнительный", "Выполнить 10 заданий дня", s => s.st.quests >= 10, 600, "trophy", 1],
  ["show", "Витрина", "Поставить предмет в витрину", s => s.show.length > 0, 50, "eye", 0],
];
const TIERC = [["#d08a4a", "#5a2e10"], ["#d4dae2", "#4a525e"], ["#ffd04a", "#7a4a08"], ["#7af0ff", "#2a3aa0"]];
const BADGE = new Map();
function badgeSVG(emb, tier) {
  const k = emb + tier; if (BADGE.has(k)) return BADGE.get(k); const [a, b] = TIERC[tier];
  const s = `<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="b${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><path d="M24 2 43 13v22L24 46 5 35V13z" fill="url(#b${k})" stroke="rgba(0,0,0,.5)"/><path d="M24 6 39.5 15v18L24 42 8.5 33V15z" fill="#14111c" opacity=".88"/><g transform="translate(13 13) scale(.55)"><path d="${EMB[emb]}" fill="${a}" fill-rule="evenodd"/></g></svg>`;
  BADGE.set(k, s); return s;
}
function achCheck() {
  let any = false;
  for (const [id, n, , f, rw] of ACH) {
    if (S.ach.includes(id) || !f(S)) continue; S.ach.push(id); any = true;
    const pay_ = ALL.mode === "norm" ? rw : 0; if (pay_) { S.bal += pay_; balTrack() } addXP(rw * .5);
    setTimeout(() => { toast(`Достижение «${n}»${pay_ ? " · +" + fmt(pay_) : ""}`, "ach"); SND.gem() }, 600);
  }
  if (any) { save(); $("profDot").hidden = false }
}
/* ---------- Задания дня ---------- */
const QPOOL = [
  ["open5", "Открой 5 кейсов", "open", 5, 150], ["open15", "Открой 15 кейсов", "open", 15, 400], ["rare", "Выбей предмет эпической редкости или выше", "rare4", 1, 400],
  ["sell500", "Продай предметов на 500 ₽", "sellv", 500, 150], ["up2", "Сделай 2 апгрейда", "up", 2, 200], ["upw", "Выиграй апгрейд", "upw", 1, 300],
  ["bt2", "Сыграй 2 батла", "bt", 2, 250], ["btw", "Выиграй батл", "btw", 1, 350], ["ct", "Подпиши контракт", "ct", 1, 200],
  ["games3", "Сыграй 3 мини-игры", "game", 3, 150], ["crash2", "Забери в краше на ×2 и выше", "crash2", 1, 250], ["mines4", "Открой 4 камня в минах за игру", "mines4", 1, 250],
  ["theme", "Открой тематический кейс", "cat:theme", 1, 150], ["classic3", "Открой 3 кейса из «Классики»", "cat:classic", 3, 200], ["buy", "Купи скин на рынке", "buy", 1, 100],
];
function questsToday() {
  const d = dayNo(); if (S.quests.day === d && S.quests.list.length) return S.quests.list;
  const r = rng(hseed("q" + d + ALL.mode)), pool = QPOOL.slice(), list = [];
  while (list.length < 3) { const i = Math.floor(r() * pool.length); const q = pool.splice(i, 1)[0]; list.push({ id: q[0], p: 0, done: false }) }
  S.quests = { day: d, list }; return list;
}
const qdef = id => QPOOL.find(q => q[0] === id);
function track(evt, d = {}) {
  const list = questsToday(); let changed = false;
  for (const q of list) {
    if (q.done) continue; const [, n, kind, need, rw] = qdef(q.id); let inc = 0;
    if (kind === "open" && evt === "open") inc = d.n;
    else if (kind === "rare4" && evt === "drop" && d.r >= 4) inc = 1;
    else if (kind === "sellv" && evt === "sell") inc = d.v;
    else if (kind === "up" && evt === "up") inc = 1;
    else if (kind === "upw" && evt === "up" && d.win) inc = 1;
    else if (kind === "bt" && evt === "battle") inc = 1;
    else if (kind === "btw" && evt === "battle" && d.win) inc = 1;
    else if (kind === "ct" && evt === "contract") inc = 1;
    else if (kind === "game" && evt === "game") inc = 1;
    else if (kind === "crash2" && evt === "crash" && d.m >= 2) inc = 1;
    else if (kind === "mines4" && evt === "mines" && d.gems >= 4) inc = 1;
    else if (kind.startsWith("cat:") && evt === "open" && d.cat === kind.slice(4)) inc = d.n;
    else if (kind === "buy" && evt === "buy") inc = 1;
    if (!inc) continue; q.p = Math.min(need, q.p + inc); changed = true;
    if (q.p >= need) { q.done = true; S.st.quests++; const pay_ = ALL.mode === "norm" ? rw : 0; if (pay_) earn(pay_); addXP(rw); setTimeout(() => toast(`Задание выполнено: ${n}${pay_ ? " · +" + fmt(pay_) : ""}`, "good"), 400); $("profDot").hidden = false }
  }
  if (changed && curTab === "profile") renderProfile();
  achCheck();
}
/* ---------- Серия входов ---------- */
const STREAK_RW = [50, 80, 120, 160, 220, 300, 500];
function streakCheck() {
  const d = dayNo(), st = S.streak; if (st.day === d) return;
  st.n = st.day === d - 1 ? st.n + 1 : 1; st.day = d; st.best = Math.max(st.best, st.n);
  const rw = ALL.mode === "norm" ? STREAK_RW[Math.min(st.n, 7) - 1] : 0;
  if (rw) { S.bal += rw; balTrack(); setTimeout(() => toast(`День ${st.n} подряд: +${fmt(rw)}`, "good"), 900) }
  save();
}
/* ---------- Боты: имена, характер, реплики ---------- */
const BOTS = [
  { n: "Кирилл_88", t: "азартный", say: ["Ва-банк!", "Ну давай, крути!", "Я чувствую нож!"], win: "Я же говорил!", lose: "В следующий раз отыграюсь." },
  { n: "Mr.Пельмень", t: "ворчун", say: ["Опять ширпотреб…", "Кейсы уже не те.", "Хм."], win: "Неплохо, неплохо.", lose: "Так и знал." },
  { n: "ната", t: "везучая", say: ["Сейчас будет красиво ✨", "Чувствую удачу", "Ой, а что это?"], win: "Ура!", lose: "Ну ладно :(" },
  { n: "Шестерёнка", t: "расчётливый", say: ["Матожидание на моей стороне.", "Считаю шансы…", "Статистика решит."], win: "Как и рассчитывал.", lose: "Погрешность." },
  { n: "дед_инсайд", t: "философ", say: ["Всё есть кейс.", "Скин — лишь форма.", "Тлен…"], win: "Победа — тоже иллюзия.", lose: "Ничто не вечно." },
  { n: "Lucky7", t: "суеверный", say: ["Сплюнул через плечо.", "Семёрка, выручай!", "Не смотрите на меня!"], win: "Талисман работает!", lose: "Чёрная кошка…" },
  { n: "енот", t: "хитрый", say: ["Хе-хе.", "Я тут просто посмотреть.", "Шуршу…"], win: "Утащил!", lose: "Ничего, я подожду." },
  { n: "Арина", t: "дерзкая", say: ["Сдавайтесь сразу.", "Это мой батл.", "Смотрите и учитесь."], win: "Изи.", lose: "Подкрутка!" },
  { n: "ГосУслуга", t: "бюрократ", say: ["Ваш дроп в очереди.", "Заполните форму 3-НДФЛ.", "Ожидайте…"], win: "Заявка одобрена.", lose: "Отказано." },
  { n: "nightfox", t: "тихий", say: ["…", "Ночь — моё время.", "Тсс."], win: "Тихо забрал.", lose: "Растворился в ночи." },
  { n: "крош", t: "весёлый", say: ["Ёлки-иголки!", "Йо-хо!", "Погнали!"], win: "Ёшкин кот, победа!", lose: "Ну и ладно!" },
  { n: "Pro100Дима", t: "самоуверенный", say: ["Я профи.", "Учитесь, пока я жив.", "Легко."], win: "Как всегда.", lose: "Лаги!" },
];
BOTS.forEach((b, i) => b.ava = hseed("bot" + b.n));
const BOSS = { n: "Барон Дроп", t: "босс", say: ["Ха-ха-ха!", "Твои скины станут моими.", "Не смеши меня."], win: "Предсказуемо.", lose: "Невозможно!..", ava: 777 };
/* ---------- Таблица лидеров ---------- */
function leaders() {
  const t = Date.now(), days = t / DAY;
  const rows = BOTS.map((b, i) => { const h = hseed(b.n), base = 2e3 + (h % 60) * 900, g = .002 + (h % 7) * .0006; return { n: b.n, ava: b.ava, v: Math.round(base * (1 + (days % 400) * g) * (1 + .08 * Math.sin(t / 36e5 / (2 + i) + i))) } });
  const me = { n: ALL.nick + " (ты)", ava: ALL.ava, v: (INF() ? 0 : S.bal) + invValue(), me: true };
  return [...rows, me].sort((a, b) => b.v - a.v);
}
