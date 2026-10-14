/* ================= Кейсы: описания =================
   Содержимое генерируется детерминированно из описания: какие виды оружия, какие текстуры, профиль редкостей.
   Профиль: число — оружие этой редкости, "k6"/"k7" — нож, "g6"/"g7" — перчатки. */
const CATS = [
  ["budget", "Бюджетные"], ["classic", "Классика"], ["premium", "Премиум"], ["knives", "Ножи"], ["gloves", "Перчатки"],
  ["theme", "Тематические"], ["event", "Ивентные"], ["legend", "Легендарные"], ["free", "Бесплатные"],
];
const CATN = Object.fromEntries(CATS);
const TYPES = {
  pistols: ["p17", "dk92", "taran", "r357"], smg: ["osa", "shershen", "voron"], rifles: ["ak74", "m16", "kobra"], snipers: ["orlan", "grom"],
  shotguns: ["pompa", "shkval", "dd2"], mg: ["medved", "nosorog"],
  melee: ["knife", "karambit", "butterfly", "katana", "axe", "dagger", "machete", "bayonet"], gloves: ["sport", "mitts"],
};
TYPES.guns = [...TYPES.pistols, ...TYPES.smg, ...TYPES.rifles, ...TYPES.snipers, ...TYPES.shotguns, ...TYPES.mg];
TYPES.light = [...TYPES.pistols, ...TYPES.smg, ...TYPES.shotguns];
const RPROF = {
  free: [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3],
  budget: [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4],
  budgetk: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, "k6"],
  classic: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, "k6", "g6"],
  classic2: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, "k6", "k7"],
  theme: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, "k6", "k7"],
  premium: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, "k6", "k7", "g7"],
  event: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, "k6", "g6", "k7"],
  legend: [4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, "k6", "k7", "k7", "g6", "g7"],
  knives: ["k6", "k6", "k6", "k6", "k6", "k6", "k6", "k6", "k7", "k7", "k7", "k7", "k7", "k7"],
  gloves: ["g6", "g6", "g6", "g6", "g6", "g6", "g7", "g7", "g7", "g7", "g7", "g7"],
  mixed: ["k6", "k6", "k6", "k6", "g6", "g6", "g6", "k7", "k7", "k7", "g7", "g7"],
};
// [id, название, категория, форма, эмблема, цвет, цвет2, уровень, виды, текстуры ("*" — любые), профиль, опции]
const CASE_DEF = [
  ["daily", "Ежедневный", "free", "crate", "gift", "#4fe39a", "#1f7a52", 0, "guns", "camo,pixel,rust,mesh,wood,topo,checker", "free", { free: 1 }],
  ["daily2", "Ежедневный+", "free", "crate", "star", "#5ab0ff", "#1f4a8a", 5, "guns", "honey,racing,zigzag,stars,waves,splat", "free", { free: 1 }],
  ["daily3", "Ежедневный VIP", "free", "chest", "crown", "#ffcf4a", "#8a5a10", 15, "guns", "fade,anod,marble,carbon,water,pop", "budget", { free: 1 }],
  // Бюджетные
  ["start", "Стартовый", "budget", "crate", "bolt", "#6f8fbf", "#2a3a5a", 0, "guns", "camo,pixel,rust,carbon,mesh,wood", "budgetk"],
  ["pocket", "Карманный", "budget", "case", "coin", "#c9a35a", "#5a4420", 0, "pistols", "camo,racing,checker,wood,zigzag,stars,splat,neon", "budget"],
  ["kopeyka", "Копейка", "budget", "capsule", "coin", "#b8bfc8", "#4a5058", 0, "light", "rust,mesh,topo,wood,camo,pixel", "budget"],
  ["student", "Студенческий", "budget", "case", "music", "#ff9a5a", "#6a2a1a", 0, "smg", "graffiti,pop,zigzag,splat,checker,stars", "budget"],
  ["garage", "Гаражный", "budget", "crate", "target", "#8a8f6a", "#3a3a24", 1, "shotguns", "rust,mesh,wood,carbon,topo,camo", "budget"],
  ["poligon", "Полигон", "budget", "crate", "target", "#9aa86a", "#3e4a24", 1, "guns", "camo,pixel,topo,mesh,rust", "budget"],
  ["rekrut", "Рекрут", "budget", "safe", "shield", "#6a9a7a", "#22402e", 2, "rifles,smg", "camo,pixel,mesh,carbon,honey", "budgetk"],
  ["baraholka", "Барахолка", "budget", "chest", "dice", "#c08a5a", "#5a3418", 2, "guns", "wood,rust,checker,mosaic,water,splat", "budgetk"],
  // Классика
  ["arsenal", "Арсенал", "classic", "crate", "shield", "#5c7fae", "#1f2e4a", 2, "guns", "camo,tiger,carbon,damascus,neon,fire,ice", "classic"],
  ["shturm", "Штурм", "classic", "crate", "bolt", "#ff7a3a", "#5a1e0a", 2, "rifles", "tiger,camo,fire,racing,glitch,honey", "classic"],
  ["sniper", "Снайпер", "classic", "case", "target", "#7ac0a0", "#1e4a3a", 3, "snipers", "camo,mesh,topo,carbon,ice,space", "classic"],
  ["pistol", "Пистолетный", "classic", "case", "star", "#e0b04a", "#5a3a0a", 2, "pistols", "goldeng,damascus,marble,neon,racing,anod", "classic"],
  ["pulemet", "Пулемётчик", "classic", "safe", "fang", "#a87a5a", "#3e2a1a", 4, "mg", "camo,rust,tiger,fire,dragon,skulls", "classic"],
  ["drob", "Дробь", "classic", "crate", "bomb", "#c45a3a", "#4a1a0e", 3, "shotguns", "wood,blood,rust,fire,skulls,splat", "classic"],
  ["specnaz", "Спецназ", "classic", "safe", "eye", "#4a6a8a", "#121e2e", 4, "rifles,smg,pistols", "carbon,pixel,mesh,circuit,lightning,glitch", "classic2"],
  ["veteran", "Ветеран", "classic", "chest", "trophy", "#b0a080", "#4a4030", 5, "guns", "rust,damascus,blood,temper,wood,camo", "classic2"],
  // Премиум
  ["platina", "Платина", "premium", "safe", "gem", "#dfe6ee", "#5a6470", 5, "guns", "fade,holo,marble,anod,crystal,goldeng", "premium", { lvl: 5 }],
  ["blackmark", "Чёрная метка", "premium", "case", "skull", "#3a3a44", "#0a0a0e", 6, "guns", "damascus,blood,web,skulls,carbon,lava", "premium"],
  ["elite", "Элита", "premium", "safe", "crown", "#ffcf4a", "#6a4a0a", 7, "guns", "goldeng,fade,temper,holo,dragon,crystal", "premium"],
  ["collector", "Коллекционер", "premium", "chest", "eye", "#c86aff", "#3a0a5a", 8, "guns", "mosaic,water,pop,synth,aurora,plasma", "premium"],
  ["brilliant", "Бриллиантовый", "premium", "capsule", "gem", "#9fe8ff", "#1a4a6a", 9, "guns", "crystal,ice,holo,marble,anod", "premium"],
  ["juvelir", "Ювелир", "premium", "case", "gem", "#ff6a9a", "#5a0a2a", 10, "pistols,rifles", "crystal,goldeng,marble,fade", "premium"],
  ["guarantee", "Гарантия", "premium", "safe", "shield", "#4fe39a", "#0e4a2e", 6, "guns", "*", "premium", { kind: "guarantee" }],
  // Ножи
  ["klinok", "Клинок", "knives", "case", "blade", "#c0c8d4", "#3a424e", 3, "melee", "damascus,carbon,camo,tiger,fade,temper", "knives"],
  ["stalkrov", "Сталь и кровь", "knives", "case", "fang", "#c4141e", "#3a0408", 5, "knife,karambit,dagger,bayonet", "blood,damascus,web,skulls,lava", "knives"],
  ["nighthunt", "Ночной охотник", "knives", "safe", "moon", "#5a5aff", "#0e0e3a", 6, "karambit,butterfly,knife,dagger", "space,neon,glitch,aurora,lightning,circuit", "knives"],
  ["vostok", "Восточный клинок", "knives", "chest", "sakura", "#ff6a7a", "#5a0a1a", 7, "katana,dagger,knife", "samurai,dragon,water,marble,waves", "knives"],
  ["myasnik", "Мясник", "knives", "crate", "bomb", "#a05a3a", "#3a1a0e", 4, "axe,machete,bayonet", "blood,rust,wood,camo,leaves,skulls", "knives"],
  ["onlyknives", "Только ножи", "knives", "safe", "blade", "#e8eef4", "#4a525e", 8, "melee", "*", "knives", { kind: "only" }],
  // Перчатки
  ["hvat", "Хват", "gloves", "case", "fist", "#ff8a3a", "#5a2a0a", 4, "gloves", "camo,racing,snake,leopard,carbon,checker", "gloves"],
  ["ring", "Ринг", "gloves", "chest", "trophy", "#ff3b4e", "#5a0a14", 6, "sport", "racing,fire,neon,pop,zigzag,fade", "gloves"],
  ["shturmruki", "Штурмовые руки", "gloves", "safe", "fist", "#7a8a5a", "#2a3018", 6, "mitts", "camo,pixel,mesh,carbon,topo,honey", "gloves"],
  ["onlygloves", "Только перчатки", "gloves", "safe", "fist", "#ffcf4a", "#5a3a0a", 9, "gloves", "*", "gloves", { kind: "only" }],
  // Тематические
  ["cyber", "Киберпанк", "theme", "capsule", "chip", "#2ef0ff", "#0a2a4a", 3, "guns", "circuit,glitch,neon,holo,synth,lightning", "theme"],
  ["samurai", "Самураи", "theme", "chest", "sakura", "#e04a4a", "#3a0a0a", 3, "guns", "samurai,dragon,water,wood,marble", "theme", { melee: "katana,dagger,knife" }],
  ["cosmos", "Космос", "theme", "capsule", "planet", "#6a5cff", "#120a4a", 3, "guns", "space,aurora,stars,plasma,holo", "theme"],
  ["desert", "Пустыня", "theme", "crate", "sun", "#e8b04a", "#6a4010", 2, "guns", "camo,snake,topo,mesh,leopard,pixel", "theme"],
  ["ice", "Лёд", "theme", "capsule", "flake", "#8fd3ff", "#1a3a6a", 3, "guns", "ice,crystal,aurora,marble,pixel", "theme"],
  ["fire", "Огонь", "theme", "crate", "flame", "#ff5a2a", "#4a0e04", 3, "guns", "fire,lava,burst,anod,dragon", "theme"],
  ["toxic", "Токсик", "theme", "capsule", "drop", "#a6ff2e", "#1e3a06", 3, "guns", "acid,plasma,glitch,web,skulls", "theme"],
  ["retro", "Ретро", "theme", "case", "music", "#ff5fa0", "#3a0a2a", 3, "guns", "synth,pop,zigzag,checker,racing,mosaic", "theme"],
  ["halloween", "Хэллоуин", "theme", "chest", "pumpkin", "#ff8a1a", "#2a0e02", 4, "guns", "skulls,web,acid,fire,blood", "theme"],
  ["gold", "Золото", "theme", "safe", "crown", "#ffd04a", "#6a4a08", 5, "guns", "goldeng,temper,anod,fade,crystal", "theme"],
  ["ocean", "Океан", "theme", "capsule", "wave", "#2a9aff", "#0a2a4a", 3, "guns", "waves,water,swirl,snake,fade", "theme"],
  ["jungle", "Джунгли", "theme", "crate", "leaf", "#3ac05a", "#0e3a18", 3, "guns", "leaves,camo,snake,leopard,tiger", "theme", { melee: "machete,axe,knife" }],
  ["graffiti", "Граффити", "theme", "case", "spray", "#ff4fd8", "#3a0a3a", 2, "guns", "graffiti,splat,pop,zigzag,water,checker", "theme"],
  ["safari", "Сафари", "theme", "chest", "fang", "#e8b04a", "#4a3010", 3, "guns", "leopard,tiger,snake,camo,leaves", "theme"],
  // Ивентные
  ["newyear", "Новогодний", "event", "chest", "gift", "#4ae0ff", "#c4141e", 2, "guns", "ice,stars,crystal,aurora,racing", "event"],
  ["carnival", "Карнавал", "event", "capsule", "dice", "#ff4fd8", "#ffd04a", 3, "guns", "pop,mosaic,water,splat,burst,zigzag", "event"],
  ["starfall", "Звездопад", "event", "capsule", "star", "#c8a0ff", "#2a1a5a", 4, "guns", "stars,space,aurora,holo,plasma", "event"],
  ["tournament", "Турнир", "event", "safe", "trophy", "#ffcf4a", "#2a3a6a", 5, "guns", "racing,checker,carbon,goldeng,fade", "event"],
  ["dragonday", "День Дракона", "event", "chest", "fang", "#ff3b4e", "#ffcf4a", 6, "guns", "dragon,fire,samurai,lava,goldeng", "event"],
  ["acidparty", "Кислотная вечеринка", "event", "capsule", "drop", "#a6ff2e", "#ff4fd8", 4, "guns", "acid,burst,neon,glitch,plasma", "event"],
  ["race", "Гонка", "event", "case", "bolt", "#ff3b1e", "#1a1a1e", 3, "guns", "racing,checker,carbon,fire,lightning", "event"],
  ["multiplier", "Множитель ×2/×5", "event", "capsule", "infinity", "#ffb21f", "#7a2aff", 5, "guns", "*", "event", { kind: "mult" }],
  // Легендарные
  ["relic", "Реликвия", "legend", "safe", "gem", "#34f0d8", "#0a3a3a", 12, "guns", "crystal,holo,fade,space,plasma,goldeng", "legend", { lvl: 12 }],
  ["olymp", "Олимп", "legend", "chest", "sun", "#ffe08a", "#7a5a10", 14, "guns", "goldeng,marble,anod,fade,crystal", "legend", { lvl: 14 }],
  ["emperor", "Император", "legend", "chest", "crown", "#c4141e", "#ffcf4a", 16, "guns", "goldeng,dragon,samurai,crystal,temper", "legend", { lvl: 16 }],
  ["treasury", "Сокровищница", "legend", "safe", "coin", "#ffd04a", "#3a2a0a", 18, "guns", "goldeng,crystal,temper,fade,holo", "legend", { lvl: 18 }],
  ["absolute", "Абсолют", "legend", "capsule", "infinity", "#ffffff", "#5a3aff", 20, "guns", "*", "legend", { lvl: 20 }],
  ["caseofcases", "Кейс из кейсов", "legend", "chest", "box", "#ff9a3a", "#3a1a5a", 8, "", "", "", { kind: "cases", lvl: 8 }],
  ["mixgold", "Золотые руки", "legend", "safe", "fist", "#ffcf4a", "#c4141e", 15, "melee,gloves", "goldeng,fade,crystal,dragon,holo,temper", "mixed", { lvl: 15 }],
];
