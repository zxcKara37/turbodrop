/* ================= Схемы сборки оружия =================
   Новый вид добавляется описанием: имя, класс, базовая цена, место метки TURBO и список деталей.
   Порядок деталей — порядок отрисовки (сначала задние). */
const WCLS = { pistol: "Пистолет", revolver: "Револьвер", smg: "Пистолет-пулемёт", rifle: "Штурмовая винтовка", sniper: "Снайперская винтовка", shotgun: "Дробовик", mg: "Пулемёт", melee: "Холодное оружие", gloves: "Перчатки" };
const WEAPON = {
/* ---------- Пистолеты ---------- */
p17: { n: "Р-17 «Гадюка»", cls: "pistol", base: 3.2, turbo: [92, 33], build() {
  return [
    part("barrelhood", rect(132, 24, 18, 10, 1), "steel", { prof: "box" }),
    ...grip(52, 38, 50, 26, .32, { tint: "#2a2c30", fingers: 3, heel: 3, belly: 2.5, mat: "polymer" }),
    ...triggerGroup(86, 38, 22, 15, { sq: 1, tint: "#2a2c30" }),
    part("frame", poly([[46, 36], [146, 36], [148, 38.5], [148, 44, 1.2], [112, 44], [106, 40.5], [84, 40.5], [80, 44], [56, 44], [48, 41]]), "polymer", { tint: "#2a2c30", skin: 1, wrap: .2, dec: [{ k: "rail", x: 116, y: 41.5, w: 26, h: 1.4, pitch: 2.8 }, scr(66, 40.5, .9)] }),
    part("slide", poly([[40, 20, 1.5], [146, 20, 2.2], [151, 22.5, 1.2], [151, 35.5, 1.2], [148, 37], [40, 37, 1], [38, 35], [38, 22]], { u0: 38, v0: 20, w: 113, h: 17 }), "blued", { skin: 1, wrap: .25, dec: [{ k: "serr", x: 44, y: 22, w: 16, h: 13, n: 8 }, slot(rect(98, 21.2, 22, 6, .8), "rgba(14,14,18,.95)"), { k: "text", x: 68, y: 31, s: 3.4, t: "Р-17 · 9×19" }, gr([40, 34.2], [148, 34.2])] }),
    ...frontPost(146, 20, 2.6), ...rearSight(42, 20, 6, 2.6),
    part("ext", rect(101, 22.5, 14, 2.6, .6), "steel", { prof: "cyl" }),
    part("slidestop", poly([[70, 34], [86, 34], [86, 36], [72, 37]]), "blued", { prof: "flat" }),
  ];
} },
dk92: { n: "ДК-92 «Сокол»", cls: "pistol", base: 3.6, turbo: [96, 33.5], build() {
  return [
    ...barrel(126, 26, 34, 3, [], { mat: "steel" }),
    ...grip(52, 37, 50, 24, .22, { fingers: 0, mat: "polymer", tint: "#26282c", heel: 2, stipple: false }),
    part("panel", new Sh([[57, 42, 3], [74, 44, 3], [70, 80, 3], [52, 79, 3]], { fr: { u0: 52, v0: 42, w: 22, h: 38 } }).tf({ x: 0, y: 0, a: 0, k: 1 }), "wood", { tint: "#7a4527", skin: 1, wrap: .3, prof: "flat", dec: [scr(64, 50, 1.1), scr(61, 73, 1.1), { k: "knurl", x: 56, y: 54, w: 12, h: 16 }] }),
    ...triggerGroup(84, 37, 22, 16, { mat: "blued" }),
    part("frame", poly([[46, 35], [138, 35], [142, 37], [142, 41, 1], [108, 42], [104, 39.5], [82, 39.5], [78, 43], [56, 43], [48, 40]]), "blued", { skin: 1, wrap: .2, dec: [scr(64, 39.5, .9), scr(116, 38.5, .9)] }),
    part("hammer", poly([[40, 22], [46, 22], [46, 28], [41, 30], [36, 24, 1.5]]), "blued", { prof: "flat", dec: [{ k: "serr", x: 37.5, y: 22.5, w: 4, h: 2.5, n: 4 }] }),
    part("slide", new Sh([[44, 21, 1.5], [96, 21], [100, 24], [140, 24, 1], [145, 26, 1.5], [145, 34.5, 1], [44, 34.5, 1], [43, 22]], { fr: { u0: 43, v0: 21, w: 102, h: 13.5 } }), "steel", { skin: 1, wrap: .25, dec: [{ k: "serr", x: 48, y: 23, w: 12, h: 10, n: 7 }, { k: "text", x: 64, y: 30.5, s: 3, t: "ДК-92 СОКОЛ" }, gr([44, 32.6], [145, 32.6]), slot(rect(100, 24.5, 26, 2.5, .6), "rgba(16,16,20,.9)")] }),
    part("lever", poly([[56, 25], [70, 25.5], [70, 28.5, 1], [56, 28.5, 1]]), "blued", { prof: "cyl" }),
    ...frontPost(140, 24, 2.4), ...rearSight(46, 21, 6, 2.2),
  ];
} },
taran: { n: "Магнум «Таран»", cls: "pistol", base: 5.5, turbo: [110, 39], build() {
  return [
    ...grip(54, 44, 52, 27, .3, { fingers: 2, mat: "rubber", heel: 2.5, belly: 3 }),
    ...triggerGroup(90, 44, 22, 16, { mat: "steel" }),
    part("frame", poly([[46, 41], [150, 41], [150, 49, 1], [118, 50], [112, 46.5], [88, 46.5], [84, 50], [58, 50], [48, 46]]), "steel", { skin: 1, wrap: .2, dec: [scr(70, 46, 1), { k: "serr", x: 128, y: 43, w: 16, h: 4, n: 6 }] }),
    part("slide", new Sh([[40, 22, 2], [96, 22], [98, 19, 1], [176, 19, 1.5], [180, 23, 1.5], [180, 33, 1], [176, 36], [130, 37], [126, 41], [40, 41, 1.5], [38, 30]], { fr: { u0: 38, v0: 19, w: 142, h: 22 } }), "steel", { skin: 1, wrap: .3, dec: [{ k: "serr", x: 44, y: 25, w: 18, h: 13, n: 9 }, { k: "rail", x: 104, y: 19, w: 66, h: 1.6, pitch: 3 }, slot(rect(72, 23, 22, 5, 1), "rgba(14,14,18,.95)"), { k: "text", x: 132, y: 30, s: 4.2, t: ".50 ТАРАН" }, gr([98, 33], [176, 33]), slot(ell(176, 28, 1.8, 3.4), "rgba(5,5,6,1)")] }),
    part("hammer", poly([[34, 26], [42, 24], [42, 34], [37, 34], [33, 30, 1.5]]), "blued", { prof: "flat" }),
    ...frontPost(172, 19, 2.6), ...rearSight(42, 22, 8, 2.6),
  ];
} },
r357: { n: "Р-357 «Шериф»", cls: "revolver", base: 4.6, turbo: [140, 34], build() {
  return [
    part("grip", new Sh([[64, 40], [86, 44], ["q", 82, 64, 86, 82], [80, 88, 4], [58, 86, 3], ["q", 50, 64, 60, 42]], { fr: { u0: 50, v0: 40, w: 36, h: 48 } }), "wood", { tint: "#6a3a20", skin: 1, prof: "flat", wrap: .4, dec: [scr(70, 62, 1.3), { k: "knurl", x: 61, y: 66, w: 16, h: 14 }] }),
    ...triggerGroup(88, 42, 18, 14, { mat: "steel" }),
    part("underlug", poly([[118, 34], [214, 34], [214, 41, 1.5], [124, 41]]), "steel", { skin: 1, wrap: .4, prof: "cyl", dec: [gr([126, 37.5], [212, 37.5])] }),
    part("barrel", poly([[116, 25], [216, 25, 1], [218, 27], [218, 34, 1], [116, 34]], { u0: 116, v0: 25, w: 102, h: 9 }), "steel", { skin: 1, wrap: .8, prof: "cyl", dec: [{ k: "rail", x: 126, y: 23.6, w: 88, h: 1.2, pitch: 2 }, { k: "text", x: 140, y: 30, s: 3.4, t: ".357 ШЕРИФ" }, slot(rect(214, 27.5, 4, 4, 1.5), "#050506")] }),
    part("frame", poly([[60, 24, 2], [90, 22, 2], [120, 24], [120, 42], [104, 42], [100, 40], [86, 40], [86, 46], [70, 42], [64, 40], [60, 30]]), "steel", { skin: 1, wrap: .2, dec: [scr(108, 36, 1), scr(72, 32, 1)] }),
    part("cylinder", poly([[88, 24, 2], [116, 24, 2], [117, 42, 2], [87, 42, 2]], { u0: 87, v0: 24, w: 30, h: 18 }), "steel", { skin: 1, prof: "cyl", wrap: 1, dec: [slot(rect(92, 26.5, 20, 2.6, 1.3)), slot(rect(92, 31.7, 20, 2.6, 1.3)), slot(rect(92, 36.9, 20, 2.6, 1.3))] }),
    part("hammer", poly([[60, 22], [66, 20], [72, 26], [66, 30], [58, 26, 1]]), "blued", { prof: "flat", dec: [{ k: "serr", x: 60, y: 21, w: 5, h: 2.5, n: 4 }] }),
    part("ejector", rect(118, 41, 24, 2.6, 1.2), "steel", { prof: "cyl" }),
    ...frontPost(212, 25, 3.4), ...rearSight(84, 22, 5, 2),
  ];
} },
/* ---------- Пистолеты-пулемёты ---------- */
osa: { n: "ПП-9 «Оса»", cls: "smg", base: 4, turbo: [118, 38], build() {
  const stock = new Sh([[0, 30, 2], [44, 30], [44, 34], [8, 34], [8, 54], [44, 40], [44, 44], [6, 60, 2], [0, 60, 2]], { holes: [], fr: { u0: 0, v0: 30, w: 44, h: 30 } });
  return [
    part("stock", stock, "blued", { prof: "flat", dec: [scr(42, 32, 1), scr(42, 42, 1)] }),
    ...barrel(150, 37, 22, 2.6, [[4, 3.4], [8, 2.6]], { mat: "blued" }),
    part("nut", rect(146, 32, 8, 10, 1), "blued", { prof: "cyl", dec: [{ k: "knurl", x: 146, y: 32, w: 8, h: 10 }] }),
    ...magazine(88, 56, 38, 13, .08, { mat: "blued", ribs: 2, skin: 0 }),
    ...grip(84, 46, 34, 17, .08, { fingers: 2, mat: "polymer", heel: 1, belly: 1, skin: 1 }),
    ...triggerGroup(106, 46, 20, 13, { mat: "blued" }),
    part("receiver", poly([[40, 28, 2], [146, 28, 2], [148, 30], [148, 46, 1.5], [126, 46], [120, 48], [72, 48], [66, 46], [40, 46, 1.5]], { u0: 40, v0: 28, w: 108, h: 20 }), "blued", { skin: 1, wrap: .3, dec: [{ k: "serr", x: 54, y: 29.5, w: 70, h: 4, n: 24 }, gr([42, 36], [146, 36]), { k: "text", x: 62, y: 41.5, s: 3.6, t: "ПП-9 ОСА" }, scr(136, 42, 1)] }),
    part("handle", poly([[124, 22], [132, 22], [134, 28], [122, 28]]), "polymer", { prof: "flat" }),
    ...frontPost(144, 28, 4), ...rearSight(46, 28, 6, 3),
  ];
} },
shershen: { n: "ПП-45 «Шершень»", cls: "smg", base: 4.4, turbo: [96, 36], build() {
  return [
    part("stockrail", poly([[4, 30], [62, 30], [62, 33], [4, 33]]), "steel", { prof: "cyl" }),
    part("stockrail2", poly([[4, 45], [62, 41], [62, 44], [4, 48]]), "steel", { prof: "cyl" }),
    part("butt", poly([[0, 26, 2], [8, 26, 2], [8, 54, 2], [0, 54, 2]]), "rubber", { prof: "flat", dec: [{ k: "serr", x: 1.5, y: 30, w: 5, h: 20, n: 3 }] }),
    ...barrel(196, 37, 20, 2.4, [[3, 3.2], [6, 2.4], [10, 3.2], [13, 2.4]], { mat: "blued" }),
    ...magazine(134, 47, 38, 12, -.38, { curve: 7, ribs: 3, mat: "blued", skin: 1 }),
    ...grip(98, 47, 34, 18, .28, { fingers: 3, mat: "polymer", heel: 2 }),
    ...triggerGroup(108, 47, 18, 12, { mat: "polymer" }),
    part("lower", poly([[90, 44], [128, 44], [128, 49], [94, 49]]), "polymer", { prof: "flat", skin: 1 }),
    part("handguard", poly([[150, 33, 2], [196, 34, 2.5], [198, 37], [196, 46, 2.5], [150, 47, 2]], { u0: 150, v0: 33, w: 48, h: 14 }), "polymer", { skin: 1, prof: "cyl", wrap: .9, dec: [gr([156, 40], [192, 40]), gr([156, 43], [192, 43])] }),
    part("receiver", poly([[56, 30, 2], [154, 30, 1.5], [154, 45], [62, 45, 1.5], [56, 40]], { u0: 56, v0: 30, w: 98, h: 15 }), "blued", { skin: 1, prof: "cyl", wrap: .7, dec: [slot(rect(110, 32.5, 18, 4, 1)), { k: "text", x: 70, y: 40, s: 3.4, t: "ПП-45 ШЕРШЕНЬ" }, gr([60, 43], [152, 43])] }),
    part("cock", poly([[150, 26], [164, 27], [164, 30], [150, 30]]), "blued", { prof: "cyl" }),
    part("hood", poly([[186, 22], [192, 22], [194, 33], [184, 33]]), "blued", { prof: "flat", dec: [slot(rect(187.5, 25, 3, 5, 1))] }),
    part("drum", poly([[64, 22], [76, 22, 1], [76, 30], [64, 30]]), "blued", { prof: "cyl" }),
  ];
} },
voron: { n: "ПП-90 «Ворон»", cls: "smg", base: 4.8, turbo: [62, 52], build() {
  const body = new Sh([[4, 36, 8], [40, 28, 6], [150, 30, 3], [164, 34, 2], [166, 48, 3], [150, 50], [138, 62, 4], [124, 70, 4], [96, 66], [84, 54], [70, 54], [62, 70, 4], [40, 72, 4], [10, 66, 8]], { holes: [[[98, 52, 3], [124, 52, 3], [120, 62, 4], [104, 60, 3]]], fr: { u0: 4, v0: 28, w: 162, h: 44 } });
  return [
    ...barrel(160, 41, 26, 3, [[8, 3.6], [12, 3]], { mat: "blued" }),
    ...muzzle("flash", 184, 41, 3, 10),
    part("body", body, "polymer", { skin: 1, wrap: .35, tint: "#2e3236", prof: "flat", dec: [{ k: "text", x: 40, y: 46, s: 4, t: "ПП-90 ВОРОН" }, gr([30, 52], [80, 52]), scr(132, 40, 1.1), scr(26, 44, 1.1)] }),
    part("trig", poly([[86, 56], [92, 56], [90, 64], [86, 62]]), "steel", { prof: "flat" }),
    part("magtop", poly([[34, 20, 3], [148, 22, 2], [148, 30], [36, 29]], { u0: 34, v0: 20, w: 114, h: 10 }), "polymer", { tint: "#8a8f96", prof: "cyl", wrap: .6, dec: Array.from({ length: 13 }, (_, i) => ({ k: "slot", sh: rect(42 + i * 8, 22.5, 5.5, 3.6, 1.6), col: "rgba(214,160,54,.9)" })) }),
    ...reddot(98, 22, .8),
  ];
} },
/* ---------- Штурмовые винтовки ---------- */
ak74: { n: "АК-74 «Буря»", cls: "rifle", base: 8, turbo: [128, 44], build() {
  return [
    part("stock", poly([[66, 34, 1], [8, 44.5, 1.5], [3, 46, 1], [2, 72, 2], [8, 74, 2], ["q", 38, 63, 58, 51], [66, 49]], { u0: 2, v0: 34, w: 64, h: 40 }), "wood", { tint: "#8a4d24", skin: 1, prof: "flat", wrap: .25, dec: [scr(60, 41, 1)] }),
    part("buttpad", poly([[2, 46], [6, 45.4], [6.6, 73.4], [2, 72]]), "steel", { prof: "flat" }),
    part("rod", rect(184, 43.6, 40, 1.4, .6), "steel", { prof: "cyl" }),
    ...barrel(184, 39.5, 48, 2.3, [], { mat: "blued" }),
    ...muzzle("ak", 230, 39.5, 3.2, 17),
    part("fsight", poly([[220, 33], [228, 33], [228, 44, 1], [220, 44, 1]]), "blued", { prof: "box", dec: [] }),
    ...frontPost(224, 33, 6),
    part("gasblock", poly([[190, 31], [200, 31], [202, 34], [202, 44, 1], [190, 44, 1]]), "blued", { prof: "box" }),
    part("gastube", rect(172, 31.8, 22, 4.6, 2), "blued", { prof: "cyl", wrap: 1 }),
    ...magazine(117, 48, 42, 15, -.12, { curve: 13, ribs: 4, skin: 1, mat: "blued" }),
    ...grip(84, 48, 29, 12.5, .42, { fingers: 0, mat: "polymer", tint: "#5a2e16", heel: 1.2, belly: 2.6, taper: 1.2, stipple: false, skin: 1 }),
    ...triggerGroup(94, 49, 20, 10, { mat: "blued", t: 1.2 }),
    part("lowerhg", poly([[138, 37.5], [182, 38.5, 1.5], [186, 40], [186, 48, 2], [180, 50, 2], [140, 50, 1]], { u0: 138, v0: 37.5, w: 48, h: 12.5 }), "wood", { tint: "#8a4d24", skin: 1, prof: "cyl", wrap: .6, dec: [gr([146, 46], [180, 46])] }),
    part("upperhg", poly([[138, 31], [172, 31, 2], [174, 33.4], [174, 36.5, 1], [138, 37.5]], { u0: 138, v0: 31, w: 36, h: 6.5 }), "wood", { tint: "#8a4d24", skin: 1, prof: "cyl", wrap: .8 }),
    part("receiver", poly([[64, 33, 2], [72, 30.5, 3], [136, 30.5, 1], [140, 32], [140, 49, 1], [118, 49], [104, 50], [92, 50], [88, 49], [64, 49, 1]], { u0: 64, v0: 30.5, w: 76, h: 19.5 }), "blued", { skin: 1, wrap: .35, dec: [gr([74, 32.5], [134, 32.5]), slot(rect(100, 34, 18, 4, .8)), { k: "rivet", x: 70, y: 46, r: .9 }, { k: "rivet", x: 134, y: 46, r: .9 }, { k: "rivet", x: 112, y: 46, r: .9 }, { k: "text", x: 70, y: 41, s: 3.2, t: "ТД-74 БУРЯ" }] }),
    part("selector", poly([[76, 37], [112, 36.3], [113, 38.2], [80, 39.5, .8], [76, 39.5, .8]]), "steel", { prof: "flat" }),
    part("bolt", poly([[118, 33], [124, 33], [124, 36.6], [118, 36.6]]), "steel", { prof: "cyl" }),
    ...rearSight(132, 31, 10, 3),
  ];
} },
m16: { n: "М-16 «Ястреб»", cls: "rifle", base: 8.5, turbo: [80, 37], build() {
  return [
    part("buffer", rect(30, 35.5, 36, 7, 3), "alu", { prof: "cyl", wrap: 1 }),
    part("stock", poly([[6, 31, 2], [46, 33.5, 1], [50, 36], [50, 44, 1], [38, 46], [16, 60, 2], [6, 61, 1.5], [4, 33, 1]], { u0: 4, v0: 31, w: 46, h: 30 }), "polymer", { skin: 1, tint: "#2b2d31", prof: "flat", wrap: .25, dec: [slot(rect(18, 40, 16, 4, 2)), scr(44, 40, .9)] }),
    part("buttpad", poly([[1, 32, 1], [6, 31], [6, 61], [1, 60, 1]]), "rubber", { prof: "flat", dec: [{ k: "serr", x: 2, y: 34, w: 3, h: 24, n: 3 }] }),
    ...barrel(204, 39, 34, 2.1, [], { mat: "blued" }),
    ...muzzle("flash", 236, 39, 2.4, 14),
    ...magazine(103, 53, 30, 14.5, -.1, { curve: 3, ribs: 3, mat: "alu", skin: 1 }),
    ...grip(80, 48, 28, 13, .42, { fingers: 1, heel: 2.2, belly: 2, skin: 0 }),
    ...triggerGroup(86, 49, 18, 11, { mat: "alu" }),
    part("lower", poly([[64, 43], [126, 43], [126, 48, 1.5], [121, 50], [120, 55, .5], [100, 55], [98, 51], [92, 50], [88, 49], [66, 49], [64, 47]], { u0: 64, v0: 43, w: 62, h: 12 }), "alu", { skin: 1, wrap: .2, dec: [scr(72, 46, .8), scr(118, 46, .8), { k: "text", x: 98, y: 46.8, s: 2.6, t: "ТД-16" }] }),
    part("handguard", poly([[124, 30], [204, 30, .8], [206, 32], [206, 44, 1.5], [200, 47], [126, 47]], { u0: 124, v0: 30, w: 82, h: 17 }), "alu", { skin: 1, wrap: .5, prof: "box", dec: [...[0, 1, 2, 3, 4].map(i => slot(rect(134 + i * 14, 38, 9, 3, 1.5))), { k: "rail", x: 126, y: 28.4, w: 78, h: 1.4, pitch: 2.6 }] }),
    part("upper", poly([[62, 30], [126, 30], [126, 43], [64, 43], [62, 41]], { u0: 62, v0: 30, w: 64, h: 13 }), "alu", { skin: 1, wrap: .35, dec: [slot(rect(94, 33, 20, 5, 1)), gr([66, 41], [124, 41])] }),
    part("fa", ell(118, 36.5, 2.6, 2.6), "alu", { prof: "cyl", dec: [{ k: "knurl", x: 116, y: 34, w: 5, h: 5 }] }),
    part("charge", poly([[56, 31], [66, 31], [66, 34.5], [58, 34.5], [55, 33]]), "alu", { prof: "flat" }),
    ...rail(62, 30, 64),
    ...holo(84, 27.6, 1),
    ...frontPost(200, 28.6, 5),
  ];
} },
kobra: { n: "БП-3 «Кобра»", cls: "rifle", base: 9, turbo: [30, 50], build() {
  const shell = new Sh([[6, 40, 6], [40, 34, 4], [96, 33], [148, 36, 3], [150, 50, 3], [136, 54], [96, 55], [52, 57], [44, 64, 2], [14, 64, 6]], { fr: { u0: 6, v0: 33, w: 144, h: 31 } });
  return [
    ...barrel(146, 42, 50, 2.6, [[12, 2.2]], { mat: "blued" }),
    ...muzzle("flash", 196, 42, 2.6, 13),
    ...magazine(48, 57, 32, 13, -.06, { curve: 2, mat: "polymer", tint: "#5a6068", window: 1, skin: 0 }),
    ...grip(96, 54, 30, 13, .26, { fingers: 2, heel: 2, tint: "#33363b" }),
    ...grip(134, 52, 24, 11, -.05, { fingers: 3, heel: 1, tint: "#33363b", stipple: false }),
    ...triggerGroup(100, 54, 26, 16, { tint: "#33363b", t: 2.2 }),
    part("shell", shell, "polymer", { skin: 1, wrap: .5, tint: "#4b5a3c", prof: "cyl", dec: [gr([20, 46], [140, 46]), { k: "text", x: 22, y: 41, s: 3.8, t: "БП-3 КОБРА" }, scr(140, 44, 1.1), scr(12, 52, 1.1), slot(rect(70, 38, 16, 4, 1.5))] }),
    part("mount", poly([[74, 30], [116, 30], [114, 35], [76, 35]]), "polymer", { tint: "#3a3d42", prof: "box" }),
    part("optic", poly([[60, 20, 3], [126, 18, 3], [130, 22], [130, 31], [60, 32], [56, 26]], { u0: 56, v0: 18, w: 74, h: 14 }), "polymer", { tint: "#3a3d42", skin: 1, prof: "cyl", wrap: .7, dec: [{ k: "lens", x: 129.6, y: 25, r: 6 }, gr([66, 29], [124, 29])] }),
  ];
} },
/* ---------- Снайперские ---------- */
orlan: { n: "СВ-98 «Орлан»", cls: "sniper", base: 12, turbo: [122, 47], build() {
  const stock = new Sh([[0, 40, 2], [26, 40], [56, 44], [74, 40], [150, 40], [152, 48, 2], [104, 52], [96, 52], ["q", 90, 64, 92, 76], [80, 78, 2], ["q", 72, 60, 64, 56], [34, 58], [6, 66, 2], [0, 64, 2]], { holes: [[[60, 47, 3], [80, 47, 2], ["q", 82, 58, 84, 68], [76, 66], ["q", 70, 54, 60, 52, 2]]], fr: { u0: 0, v0: 40, w: 152, h: 38 } });
  return [
    ...barrel(140, 40, 88, 2.4, [[30, 2]], { mat: "blued" }),
    ...muzzle("brake", 228, 40, 2.6, 16),
    ...bipod(160, 46, 26, .25),
    part("stock", stock, "polymer", { skin: 1, wrap: .35, tint: "#4a5236", prof: "flat", dec: [scr(140, 46, 1.2), scr(20, 52, 1.2), gr([10, 44], [52, 46])] }),
    part("cheek", poly([[16, 35, 2], [50, 37, 2], [52, 43.5], [16, 41]]), "polymer", { tint: "#2a2c30", prof: "cyl" }),
    part("buttpad", poly([[0, 40, 1], [3, 40], [3, 65], [0, 64, 1]]), "rubber", { prof: "flat" }),
    ...magazine(114, 51, 12, 14, 0, { mat: "blued", ribs: 1, skin: 0 }),
    ...triggerGroup(98, 51, 16, 10, { mat: "blued" }),
    part("receiver", poly([[78, 32, 3], [140, 32, 3], [142, 35], [142, 41], [78, 41]], { u0: 78, v0: 32, w: 64, h: 9 }), "blued", { skin: 1, prof: "cyl", wrap: .9, dec: [slot(rect(98, 33.5, 18, 3, 1.2)), { k: "text", x: 118, y: 38.5, s: 2.6, t: "СВ-98" }] }),
    part("bolt", poly([[84, 36], [90, 36], [94, 44], ["q", 96, 48, 92, 49], ["q", 88, 49, 89, 46], [86, 39]]), "steel", { prof: "cyl" }),
    part("knob", ell(92, 47.5, 3, 3), "steel", { prof: "cyl" }),
    ...scope(82, 22, 64, 3.6, { bell: 1.9, mount: 6 }),
  ];
} },
grom: { n: "АВ-50 «Гром»", cls: "sniper", base: 14, turbo: [100, 46], build() {
  return [
    ...barrel(150, 39, 66, 3.4, [[20, 2.9]], { mat: "blued" }),
    ...muzzle("big", 214, 39, 3.4, 22),
    ...bipod(168, 44, 30, .4),
    part("stock", poly([[2, 30, 2], ["q", 18, 26, 34, 30], [50, 33], [56, 36], [56, 50], [44, 51], [28, 56], [10, 60, 2], [2, 60, 2]], { u0: 2, v0: 26, w: 54, h: 34 }), "alu", { skin: 1, prof: "flat", wrap: .2, dec: [slot(rect(14, 38, 26, 6, 2))] }),
    part("monopod", poly([[20, 55], [26, 53], [26, 68, 1], [20, 68, 1]]), "steel", { prof: "cyl" }),
    part("buttpad", poly([[0, 30, 1], [4, 30], [4, 60], [0, 60, 1]]), "rubber", { prof: "flat" }),
    ...magazine(112, 52, 18, 18, -.08, { mat: "blued", ribs: 2, skin: 0 }),
    ...grip(74, 50, 30, 13, .36, { fingers: 2 }),
    ...triggerGroup(82, 50, 18, 11, { mat: "blued" }),
    part("lower", poly([[56, 42], [150, 42], [148, 48, 1.5], [136, 51], [122, 52], [104, 53], [92, 51], [70, 51], [58, 48]], { u0: 56, v0: 42, w: 94, h: 11 }), "blued", { skin: 1, wrap: .2 }),
    part("upper", poly([[54, 28, 1], [150, 28, 1], [160, 29.5], [170, 34, 1.5], [170, 42], [60, 42], [54, 38]], { u0: 54, v0: 28, w: 116, h: 14 }), "blued", { skin: 1, wrap: .35, dec: [...[0, 1, 2, 3].map(i => slot(rect(132 + i * 8, 33, 5, 5, 1.2))), { k: "text", x: 64, y: 37, s: 3.6, t: "АВ-50 ГРОМ  .50" }, scr(120, 38, 1.1)] }),
    part("handle", poly([[110, 19, 2], [132, 19, 2], [134, 26], [130, 26], [128, 23], [114, 23], [112, 26], [108, 26]]), "alu", { prof: "flat" }),
    ...rail(56, 28, 90),
    ...scope(60, 15, 70, 4.2, { bell: 1.8, mount: 6 }),
  ];
} },
/* ---------- Дробовики ---------- */
pompa: { n: "ДП-12 «Помпа»", cls: "shotgun", base: 6, turbo: [96, 41], build() {
  return [
    part("stock", poly([[78, 34], [8, 42, 1.5], [2, 44], [2, 70, 2], [8, 72, 2], ["q", 40, 60, 66, 52], [78, 47]], { u0: 2, v0: 34, w: 76, h: 38 }), "wood", { tint: "#7a4426", skin: 1, prof: "flat", wrap: .3 }),
    part("buttpad", poly([[0, 44, 1], [4, 43], [4, 71], [0, 70, 1]]), "rubber", { prof: "flat" }),
    part("magtube", tube(126, 44, 100, 3.2, [], .6), "blued", { prof: "cyl", wrap: 1 }),
    part("barrel", tube(126, 36, 112, 3.4, [[100, 3.8]], .4), "blued", { prof: "cyl", wrap: 1, skin: 1, dec: [{ k: "dot", x: 234, y: 32.4, r: .9, c: "#e8d8a0" }] }),
    part("pump", poly([[150, 38, 2], [196, 38, 2], [198, 41], [198, 50, 2], [150, 50, 2], [148, 44]], { u0: 148, v0: 38, w: 50, h: 12 }), "wood", { tint: "#7a4426", skin: 1, prof: "cyl", wrap: .9, dec: [...Array.from({ length: 9 }, (_, i) => gr([156 + i * 4.4, 39.5], [156 + i * 4.4, 48.5]))] }),
    ...triggerGroup(96, 47, 20, 11, { mat: "blued" }),
    part("receiver", poly([[76, 33, 2], [122, 30, 2], [128, 32], [128, 47, 1], [80, 49, 1], [76, 46]], { u0: 76, v0: 30, w: 52, h: 19 }), "steel", { skin: 1, wrap: .3, dec: [slot(rect(96, 35, 18, 5, 1.5)), { k: "text", x: 84, y: 43, s: 3, t: "ДП-12 ПОМПА" }, scr(84, 38, .9), scr(120, 44, .9)] }),
  ];
} },
shkval: { n: "ДА-20 «Шквал»", cls: "shotgun", base: 6.8, turbo: [118, 44], build() {
  const stock = new Sh([[56, 32], [8, 40, 2], [2, 42], [2, 66, 2], [8, 68, 2], [56, 48]], { holes: [[[14, 44, 2], [48, 38], [48, 44], [14, 58, 2]]], fr: { u0: 2, v0: 32, w: 54, h: 36 } });
  return [
    part("stock", stock, "polymer", { skin: 1, prof: "flat", wrap: .2, tint: "#2b2d31" }),
    ...barrel(176, 38, 46, 3.6, [], { mat: "blued" }),
    ...muzzle("comp", 220, 38, 3.4, 14),
    ...magazine(118, 50, 32, 22, -.12, { curve: 2, ribs: 3, mat: "polymer", tint: "#2a2c30", skin: 1 }),
    ...grip(78, 48, 30, 12, .34, { fingers: 2 }),
    ...triggerGroup(88, 49, 20, 10, { mat: "blued" }),
    part("handguard", poly([[136, 31], [176, 31, 2], [178, 34], [178, 46, 2], [136, 48]], { u0: 136, v0: 31, w: 42, h: 17 }), "alu", { skin: 1, prof: "box", dec: [...[0, 1, 2, 3, 4, 5].map(i => slot(ell(142 + i * 6, 39.5, 1.8, 3.4)))] }),
    part("receiver", poly([[54, 31, 2], [62, 29, 3], [134, 29, 1], [138, 31], [138, 49], [118, 49], [100, 50], [88, 49], [54, 49, 1]], { u0: 54, v0: 29, w: 84, h: 21 }), "blued", { skin: 1, wrap: .35, dec: [gr([64, 31], [132, 31]), slot(rect(96, 33, 20, 4, .8)), { k: "text", x: 62, y: 42, s: 3.2, t: "ДА-20 ШКВАЛ" }] }),
    ...rail(64, 29, 70),
    ...reddot(84, 26.6, 1),
  ];
} },
dd2: { n: "ДД-2 «Двустволка»", cls: "shotgun", base: 7.5, turbo: [94, 42], build() {
  return [
    part("stock", poly([[82, 32], [10, 40, 1.5], [3, 42], [3, 68, 2], [10, 70, 2], ["q", 46, 56, 64, 54], ["q", 72, 58, 82, 48]], { u0: 3, v0: 32, w: 79, h: 38 }), "wood", { tint: "#6a3518", skin: 1, prof: "flat", wrap: .3, dec: [{ k: "knurl", x: 62, y: 38, w: 16, h: 10 }] }),
    part("buttpad", poly([[0, 42, 1], [4, 41.6], [4, 69], [0, 68, 1]]), "rubber", { prof: "flat" }),
    part("barrel2", tube(118, 41, 122, 3.6, [], .5), "blued", { prof: "cyl", wrap: 1, skin: 1 }),
    part("barrel1", tube(118, 33.4, 122, 3.6, [], .5), "blued", { prof: "cyl", wrap: 1, skin: 1, dec: [{ k: "rail", x: 120, y: 28.8, w: 116, h: .9, pitch: 1.8 }] }),
    part("forend", poly([[120, 40], [168, 40.5, 2], [172, 44], [168, 48, 2], [122, 49, 2]], { u0: 120, v0: 40, w: 52, h: 9 }), "wood", { tint: "#6a3518", skin: 1, prof: "cyl", wrap: .8, dec: [{ k: "knurl", x: 132, y: 43, w: 30, h: 4.5 }] }),
    ...triggerGroup(94, 46, 18, 10, { mat: "steel" }),
    part("receiver", poly([[80, 31, 2], [118, 29.6], [120, 31], [120, 46, 1], [90, 48, 2], [80, 46]], { u0: 80, v0: 29.6, w: 40, h: 18.4 }), "steel", { skin: 1, wrap: .3, dec: [{ k: "text", x: 86, y: 41, s: 2.8, t: "ДД-2" }, scr(108, 38, 1.2), gr([96, 32], [118, 31])] }),
    part("lever", poly([[78, 27], [92, 26], [92, 30], [80, 31]]), "steel", { prof: "cyl" }),
  ];
} },
/* ---------- Пулемёты ---------- */
medved: { n: "ПК-7 «Медведь»", cls: "mg", base: 10, turbo: [96, 42], build() {
  const stock = new Sh([[56, 30], [8, 38, 2], [2, 40], [2, 66, 2], [8, 68, 2], [56, 46]], { holes: [[[14, 43, 3], [48, 37], [48, 41], [14, 56, 3]]], fr: { u0: 2, v0: 30, w: 54, h: 38 } });
  return [
    part("stock", stock, "polymer", { skin: 1, tint: "#2d2f33", prof: "flat", wrap: .2 }),
    ...barrel(152, 38, 74, 3, [[0, 4.2], [26, 3], [40, 2.6]], { mat: "blued" }),
    ...muzzle("flash", 226, 38, 2.8, 16),
    ...bipod(196, 42, 28, .42),
    part("belt", poly([[88, 52], [132, 52], [140, 60], [96, 64]]), "brass", { prof: "cyl", dec: Array.from({ length: 9 }, (_, i) => gr([92 + i * 5, 52], [99 + i * 5, 63])) }),
    part("can", poly([[96, 56, 2], [140, 56, 2], [140, 82, 2], [96, 82, 2]], { u0: 96, v0: 56, w: 44, h: 26 }), "polymer", { skin: 1, tint: "#3f4a33", prof: "box", dec: [gr([100, 62], [136, 62]), gr([100, 76], [136, 76]), { k: "text", x: 102, y: 70, s: 3.4, t: "7,62 × 100" }] }),
    ...grip(70, 48, 28, 12, .34, { fingers: 2 }),
    ...triggerGroup(78, 48, 18, 11, { mat: "blued" }),
    part("receiver", poly([[54, 30, 2], [152, 30], [156, 33], [156, 46], [96, 48], [90, 50], [54, 48]], { u0: 54, v0: 30, w: 102, h: 20 }), "blued", { skin: 1, wrap: .3, dec: [gr([60, 38], [150, 38]), { k: "text", x: 104, y: 43, s: 3.2, t: "ПК-7 МЕДВЕДЬ" }, ...[0, 1, 2].map(i => ({ k: "rivet", x: 66 + i * 40, y: 44, r: 1 }))] }),
    part("cover", poly([[60, 24, 2], [124, 24, 3], [130, 30], [60, 31]], { u0: 60, v0: 24, w: 70, h: 7 }), "blued", { skin: 1, prof: "cyl", wrap: .7, dec: [{ k: "serr", x: 70, y: 25, w: 40, h: 2.5, n: 16 }] }),
    part("handle", poly([[150, 22, 2], [176, 22, 2], [178, 30], [174, 30], [172, 26], [154, 26], [152, 30], [148, 30]]), "polymer", { prof: "flat", tint: "#2a2c30" }),
    ...frontPost(222, 34, 7), ...rearSight(124, 24, 10, 3),
  ];
} },
nosorog: { n: "РП-46 «Носорог»", cls: "mg", base: 10.5, turbo: [80, 40], build() {
  return [
    part("stock", poly([[54, 32], [8, 38, 2], [2, 40], [2, 64, 2], [8, 66, 2], [34, 56], [54, 48]], { u0: 2, v0: 32, w: 52, h: 34 }), "polymer", { skin: 1, tint: "#3d3f44", prof: "flat", wrap: .2, dec: [scr(46, 40, 1)] }),
    ...barrel(160, 37, 66, 2.8, [], { mat: "blued" }),
    ...muzzle("flash", 224, 37, 2.6, 15),
    ...bipod(186, 42, 28, .38),
    part("drum", ell(118, 66, 19, 19), "blued", { skin: 1, prof: "cyl", wrap: .8, dec: [...[0, 1, 2, 3, 4, 5].map(i => ({ k: "rivet", x: 118 + Math.cos(i * 1.047) * 14, y: 66 + Math.sin(i * 1.047) * 14, r: 1 })), { k: "text", x: 106, y: 67, s: 3.4, t: "100 ПАТР." }] }),
    part("drumneck", poly([[108, 44], [128, 44], [126, 52], [110, 52]]), "blued", { prof: "box" }),
    ...grip(70, 48, 28, 12, .34, { fingers: 2 }),
    ...triggerGroup(78, 48, 18, 11, { mat: "blued" }),
    part("heatshield", poly([[132, 29], [178, 29, 1.5], [180, 32], [180, 44, 1.5], [132, 46]], { u0: 132, v0: 29, w: 48, h: 17 }), "blued", { skin: 1, dec: [...[0, 1, 2, 3, 4].map(i => slot(ell(140 + i * 8, 37.5, 2.4, 4.6)))] }),
    part("receiver", poly([[52, 30, 2], [134, 28, 1], [134, 46], [100, 47], [90, 49], [52, 48]], { u0: 52, v0: 28, w: 82, h: 21 }), "blued", { skin: 1, wrap: .3, dec: [gr([58, 36], [132, 35]), { k: "text", x: 92, y: 41, s: 3, t: "РП-46 НОСОРОГ" }, scr(62, 44, 1), scr(126, 42, 1)] }),
    part("cover", poly([[58, 24, 2], [120, 23, 3], [126, 28], [58, 30]], { u0: 58, v0: 23, w: 68, h: 7 }), "blued", { skin: 1, prof: "cyl", wrap: .7 }),
    ...rail(64, 24, 52),
    ...reddot(80, 21.6, 1),
  ];
} },
/* ---------- Холодное оружие ---------- */
knife: { n: "Нож «Клык»", cls: "melee", base: 8, turbo: [62, 51], build() {
  return [
    part("blade", poly([[96, 38], [176, 38], ["q", 210, 38, 238, 48], ["q", 224, 66, 190, 66], [96, 64]], { u0: 96, v0: 38, w: 142, h: 28 }), "steel", { skin: 1, prof: "blade", wrap: 0, dec: [gr([104, 44], [168, 44]), { k: "groove", line: [[100, 56], [188, 57], [234, 48]] }, slot(rect(108, 46, 3, 3, 1.4))] }),
    part("clip", poly([[176, 38], ["q", 210, 38, 238, 48], ["q", 208, 43, 178, 42.5]], { u0: 176, v0: 38, w: 62, h: 10 }), "steel", { skin: 1, prof: "flat", wrap: 0, noAO: 1 }),
    part("edge", poly([[100, 57.5], [190, 58], ["q", 222, 57, 238, 48], ["q", 224, 66, 190, 66], [100, 64]], { u0: 100, v0: 48, w: 138, h: 18 }), "steel", { skin: 1, prof: "blade", wrap: 0, noAO: 1 }),
    part("guard", poly([[86, 29, 1.5], [97, 32], [97, 70], [86, 73, 1.5], [83, 51]]), "steel", { prof: "cyl" }),
    part("handle", poly([[22, 41, 4], [86, 41], [86, 62], ["q", 76, 59, 72, 63], ["q", 66, 59, 60, 63], ["q", 54, 59, 48, 63], ["q", 42, 59, 36, 61], [22, 61, 4]], { u0: 22, v0: 41, w: 64, h: 22 }), "rubber", { skin: 1, prof: "cyl", wrap: .9, dec: [{ k: "serr", x: 30, y: 43, w: 48, h: 3, n: 12 }] }),
    part("pommel", poly([[10, 38, 3], [24, 38], [24, 64], [10, 64, 3], [6, 51]]), "steel", { prof: "cyl", dec: [slot(ell(15, 51, 2.4, 2.4))] }),
  ];
} },
karambit: { n: "Керамбит «Коготь»", cls: "melee", base: 9.5, turbo: [96, 66], build() {
  const handle = new Sh([[26, 60, 6], [60, 54], [112, 50], [118, 62], [96, 66], [70, 74], [44, 82, 4]], { fr: { u0: 26, v0: 50, w: 92, h: 32 } });
  const ring = new Sh(ellipsePts(24, 76, 14, 14), { holes: [ellipsePts(24, 76, 8.5, 8.5)], fr: { u0: 10, v0: 62, w: 28, h: 28 } });
  return [
    part("blade", poly([[110, 50], ["c", 150, 30, 200, 28, 236, 72], ["c", 206, 52, 168, 52, 120, 66]], { u0: 110, v0: 30, w: 126, h: 42 }), "steel", { skin: 1, prof: "blade", wrap: 0, dec: [gr([124, 56], [160, 44], [200, 46], [226, 62])] }),
    part("edge", poly([[124, 63], ["c", 168, 50, 206, 50, 236, 72], ["c", 206, 54, 168, 54, 120, 66]], { u0: 120, v0: 50, w: 116, h: 22 }), "steel", { skin: 1, prof: "blade", wrap: 0, noAO: 1 }),
    part("ring", ring, "steel", { prof: "cyl", wrap: 0 }),
    part("handle", handle, "polymer", { skin: 1, prof: "cyl", wrap: .6, tint: "#2b2d31", dec: [scr(56, 64, 1.4), scr(98, 58, 1.4), { k: "serr", x: 64, y: 58, w: 28, h: 3, n: 9, a: -.15 }] }),
  ];
} },
butterfly: { n: "Бабочка «Мотылёк»", cls: "melee", base: 9, turbo: [64, 56], build() {
  const h = (y, id) => new Sh([[8, y, 3], [118, y], [122, y + 2], [122, y + 11], [8, y + 11, 3], [4, y + 5.5]], { holes: [[[24, y + 3.5, 1.5], [44, y + 3.5, 1.5], [44, y + 7.5, 1.5], [24, y + 7.5, 1.5]], [[54, y + 3.5, 1.5], [74, y + 3.5, 1.5], [74, y + 7.5, 1.5], [54, y + 7.5, 1.5]], [[84, y + 3.5, 1.5], [104, y + 3.5, 1.5], [104, y + 7.5, 1.5], [84, y + 7.5, 1.5]]], fr: { u0: 4, v0: y, w: 118, h: 11 } });
  return [
    part("handle2", h(50, "b"), "steel", { prof: "cyl", wrap: .3, skin: 1, dec: [scr(116, 55.5, 1.4)] }),
    part("blade", poly([[118, 39], [210, 40], ["q", 226, 41, 240, 49], ["q", 222, 60, 200, 60], [118, 60]], { u0: 118, v0: 39, w: 122, h: 21 }), "steel", { skin: 1, prof: "blade", wrap: 0, dec: [gr([124, 45], [200, 46]), slot(ell(132, 47, 2, 2))] }),
    part("edge", poly([[124, 55], [200, 55.5], ["q", 224, 54, 240, 49], ["q", 222, 60, 200, 60], [124, 60]], { u0: 124, v0: 54, w: 116, h: 6 }), "steel", { skin: 1, prof: "blade", wrap: 0, noAO: 1 }),
    part("handle1", h(38, "a"), "steel", { prof: "cyl", wrap: .3, skin: 1, dec: [scr(116, 43.5, 1.4)] }),
    part("latch", poly([[0, 46], [10, 46], [10, 50], [0, 52, 1]]), "steel", { prof: "cyl" }),
  ];
} },
katana: { n: "Катана «Ронин»", cls: "melee", base: 10.5, turbo: [42, 54], build() {
  const tsuka = poly([[6, 50, 3], [70, 48], [70, 60], [6, 62, 3]], { u0: 6, v0: 48, w: 64, h: 14 });
  const wrapDec = []; for (let i = 0; i < 9; i++) { const x = 10 + i * 6.6; wrapDec.push({ k: "slot", sh: poly([[x, 55], [x + 3.3, 50.6], [x + 6.6, 55], [x + 3.3, 59.4]]), col: "rgba(250,245,230,.75)" }) }
  return [
    part("blade", poly([[84, 50], ["c", 140, 48, 200, 40, 240, 24], [240, 28], ["c", 200, 50, 140, 58, 84, 59]], { u0: 84, v0: 30, w: 156, h: 24 }), "steel", { skin: 1, prof: "blade", wrap: 0, dec: [{ k: "groove", line: [[90, 53], [140, 52], [190, 46], [232, 30]] }] }),
    part("edge", poly([[86, 56], ["c", 140, 55, 200, 47, 238, 27], [240, 28], ["c", 200, 50, 140, 58, 84, 59]], { u0: 84, v0: 50, w: 156, h: 9 }), "steel", { skin: 1, prof: "blade", wrap: 0, noAO: 1 }),
    part("habaki", rect(80, 48.5, 7, 11, .8), "brass", { prof: "cyl" }),
    part("tsuba", ell(76, 54, 4, 13), "blued", { prof: "cyl", skin: 1, wrap: 0, dec: [{ k: "rivet", x: 76, y: 46, r: .9 }, { k: "rivet", x: 76, y: 62, r: .9 }] }),
    part("tsuka", tsuka, "fabric", { skin: 1, prof: "cyl", wrap: 1, dec: wrapDec }),
    part("kashira", poly([[0, 49, 2], [8, 49.5], [8, 62.5], [0, 63, 2]]), "blued", { prof: "cyl" }),
  ];
} },
axe: { n: "Топор «Викинг»", cls: "melee", base: 7, turbo: [100, 74], build() {
  const t = tr(20, 92, -.3);
  const handle = new Sh([[0, -4, 2], [200, -4.5], [200, 4.5], [0, 5, 2]], { fr: { u0: 0, v0: -5, w: 200, h: 10 } }).tf(t);
  const wrapD = []; for (let i = 0; i < 6; i++) wrapD.push(gr(P(t, 6 + i * 6, -5), P(t, 10 + i * 6, 5)));
  return [
    part("handle", handle, "wood", { tint: "#7a4a26", skin: 1, prof: "cyl", wrap: .9 }),
    part("wrap", new Sh([[2, -5.2, 2], [42, -5.2], [42, 5.2], [2, 5.2, 2]], { fr: { u0: 2, v0: -5.2, w: 40, h: 10.4 } }).tf(t), "leather", { prof: "cyl", dec: wrapD }),
    part("head", poly([[160, 22], [186, 12], ["q", 200, 6, 196, -2], ["c", 222, 4, 236, 26, 232, 56], ["q", 214, 42, 196, 44], [186, 40], [172, 46], [164, 42], [150, 38, 1.5], [144, 28, 1.5]], { u0: 144, v0: -2, w: 92, h: 58 }), "steel", { skin: 1, prof: "flat", wrap: 0, dec: [slot(ell(172, 31, 4, 4)), gr([196, 4], [216, 18], [226, 44])] }),
    part("spike", poly([[150, 30], [118, 22], [148, 18]]), "steel", { prof: "flat", skin: 1, wrap: 0 }),
  ];
} },
dagger: { n: "Кинжал «Жало»", cls: "melee", base: 8.5, turbo: [44, 50], build() {
  return [
    part("blade", poly([[96, 39], [222, 47], [240, 50], [222, 53], [96, 61]], { u0: 96, v0: 39, w: 144, h: 22 }), "steel", { skin: 1, prof: "flat", wrap: 0, dec: [{ k: "groove", line: [[100, 50], [226, 50]], w: .9 }] }),
    part("bevel", poly([[96, 50], [240, 50], [222, 53], [96, 61]], { u0: 96, v0: 50, w: 144, h: 11 }), "steel", { skin: 1, prof: "flat", wrap: 0, noAO: 1 }),
    part("guard", poly([[84, 30, 2], [92, 28, 2], [98, 36], [98, 64], [92, 72, 2], [84, 70, 2], [88, 50]]), "brass", { prof: "cyl", skin: 1, wrap: 0 }),
    part("handle", poly([[24, 42, 3], [86, 43], [86, 57], [24, 58, 3]], { u0: 24, v0: 42, w: 62, h: 16 }), "leather", { skin: 1, prof: "cyl", wrap: 1, dec: Array.from({ length: 14 }, (_, i) => gr([28 + i * 4.2, 42.5], [30 + i * 4.2, 57.5])) }),
    part("pommel", ell(18, 50, 9, 9), "brass", { prof: "cyl", dec: [{ k: "lens", x: 18, y: 50, r: 4 }] }),
  ];
} },
machete: { n: "Мачете «Джунгли»", cls: "melee", base: 6.5, turbo: [52, 50], build() {
  return [
    part("blade", poly([[84, 42], [190, 34], ["q", 232, 30, 240, 44], ["q", 238, 58, 208, 62], ["q", 150, 62, 84, 58]], { u0: 84, v0: 30, w: 156, h: 32 }), "steel", { skin: 1, prof: "blade", wrap: 0, dec: [gr([92, 47], [196, 40])] }),
    part("edge", poly([[90, 54], ["q", 150, 57, 208, 56], ["q", 234, 54, 240, 44], ["q", 238, 58, 208, 62], ["q", 150, 62, 84, 58]], { u0: 84, v0: 44, w: 156, h: 18 }), "steel", { skin: 1, prof: "blade", wrap: 0, noAO: 1 }),
    part("handle", poly([[14, 40, 4], [86, 40], [86, 60], [24, 64, 5], [8, 56, 3]], { u0: 8, v0: 40, w: 78, h: 24 }), "polymer", { skin: 1, tint: "#3d2a1a", prof: "cyl", wrap: .8, dec: [scr(34, 51, 1.6), scr(54, 50.5, 1.6), scr(74, 50, 1.6), slot(ell(16, 52, 2.4, 2.4))] }),
  ];
} },
bayonet: { n: "Штык-нож «Страж»", cls: "melee", base: 7.5, turbo: [52, 51], build() {
  const teeth = []; for (let x = 112; x < 168; x += 4) teeth.push([x, 41], [x + 2, 38]);
  return [
    part("blade", poly([[100, 41], ...teeth, [168, 41], [204, 41], ["q", 224, 42, 238, 50], ["q", 222, 58, 196, 59], [100, 59]], { u0: 100, v0: 38, w: 138, h: 21 }), "blued", { skin: 1, prof: "blade", wrap: 0, dec: [{ k: "groove", line: [[106, 49], [190, 49]], w: 1 }] }),
    part("edge", poly([[106, 55], [196, 55.5], ["q", 222, 54, 238, 50], ["q", 222, 58, 196, 59], [100, 59]], { u0: 100, v0: 50, w: 138, h: 9 }), "steel", { skin: 1, prof: "blade", wrap: 0, noAO: 1 }),
    part("ring", new Sh(ellipsePts(96, 30, 7, 7), { holes: [ellipsePts(96, 30, 4, 4)] }), "steel", { prof: "cyl" }),
    part("guard", poly([[90, 34, 1.5], [102, 34], [102, 66], [90, 66, 1.5]]), "steel", { prof: "cyl" }),
    part("handle", poly([[20, 40, 3], [90, 41], [90, 59], [20, 60, 3]], { u0: 20, v0: 40, w: 70, h: 20 }), "polymer", { skin: 1, tint: "#2c2e33", prof: "cyl", wrap: .9, dec: [...Array.from({ length: 6 }, (_, i) => gr([30 + i * 9, 40.5], [30 + i * 9, 59.5])), scr(84, 50, 1.2)] }),
    part("pommel", poly([[8, 38, 2], [22, 38], [22, 62], [8, 62, 2]]), "steel", { prof: "cyl", dec: [{ k: "serr", x: 10, y: 40, w: 10, h: 2, n: 5 }, slot(rect(12, 47, 7, 6, 1))] }),
  ];
} },
/* ---------- Перчатки ---------- */
sport: { n: "Перчатки «Спринт»", cls: "gloves", base: 10, pad: 3, turbo: [88, 60], build() { return gloveParts("sport") } },
mitts: { n: "Рукавицы «Штурм»", cls: "gloves", base: 9.5, pad: 3, turbo: [88, 60], build() { return gloveParts("mitt") } },
};
// Перчатка: тыльная сторона, пальцы вправо. Пара — две перчатки со сдвигом.
function capsule(len, w, t, segs = 2) { const r = w / 2; const sh = new Sh([[0, -r], [len - r, -r], ["c", len - r * .45, -r, len, -r * .45, len, 0], ["c", len, r * .45, len - r * .45, r, len - r, r], [0, r]], { fr: { u0: 0, v0: -r, w: len, h: w } }).tf(t); const dec = []; for (let i = 1; i <= segs; i++) { const u = len * i / (segs + 1.2); dec.push(gr(tfPt(t, u, -r + .8), tfPt(t, u + 1.5, 0), tfPt(t, u, r - .8))) } return [sh, dec] }
function gloveParts(kind) {
  const one = (ox, oy, sc, id, dark) => {
    const T = { x: ox, y: oy, a: -.08, k: sc }; const S = sh => sh.tf(T); const Pt = (x, y) => tfPt(T, x, y);
    const ps = [], leather = { skin: 1, prof: "cyl", wrap: .9 };
    const cuffTint = kind === "sport" ? "#2e3138" : "#3a4033";
    ps.push(part(id + "cuff", S(poly([[0, 10, 4], [36, 6], [38, 66], [0, 62, 4]], { u0: 0, v0: 6, w: 38, h: 60 })), "fabric", { tint: cuffTint, prof: "cyl", wrap: .7, dec: [gr(Pt(5, 12), Pt(5, 60)), gr(Pt(31, 9), Pt(33, 63))] }));
    const fing = kind === "sport" ? [[96, 22, -.1, 46, 12], [98, 34, -.03, 52, 12.6], [97, 46, .04, 49, 12.2], [93, 57, .12, 40, 11]] : [[96, 22, -.08, 50, 13.5]];
    if (kind !== "sport") { const [sh, dec] = capsule(58, 30, tr(94, 49, .05), 1); ps.push(part(id + "mit", S(sh), "leather", Object.assign({ dec: dec.map(d => ({ k: "groove", line: d.line.map(([x, y]) => Pt(x, y)) })) }, leather))) }
    [...fing].reverse().forEach(([x, y, a, len, w], i) => { const [sh, dec] = capsule(len, w, tr(x, y, a)); ps.push(part(id + "f" + i, S(sh), "leather", Object.assign({ dec: dec.map(d => ({ k: "groove", line: d.line.map(([xx, yy]) => Pt(xx, yy)) })) }, leather))) });
    { const [sh, dec] = capsule(36, 14, tr(66, 14, -.55), 1); ps.push(part(id + "thumb", S(sh), "leather", Object.assign({ dec: dec.map(d => ({ k: "groove", line: d.line.map(([x, y]) => Pt(x, y)) })) }, leather))) }
    ps.push(part(id + "back", S(poly([[34, 12, 4], [66, 6, 8], [100, 15, 6], [102, 62, 6], [70, 68, 6], [36, 64, 4]], { u0: 34, v0: 6, w: 68, h: 62 })), "leather", { skin: 1, prof: "cyl", wrap: .6, dec: [{ k: "text", x: 44, y: 60, s: 4, t: kind === "sport" ? "СПРИНТ" : "ШТУРМ" }, gr(Pt(40, 50), Pt(78, 52))] }));
    ps.push(part(id + "knuck", S(poly([[80, 15, 5], [99, 15, 5], [101, 62, 5], [82, 61, 5]], { u0: 80, v0: 15, w: 21, h: 47 })), kind === "sport" ? "rubber" : "carbon", { prof: "cyl", wrap: .8, dec: [gr(Pt(84, 27), Pt(99, 27)), gr(Pt(84, 39), Pt(100, 39)), gr(Pt(85, 51), Pt(100, 51))] }));
    ps.push(part(id + "strap", S(poly([[28, 18, 3], [54, 15, 3], [56, 52, 3], [30, 55, 3]], { u0: 28, v0: 15, w: 28, h: 40 })), kind === "sport" ? "rubber" : "fabric", { tint: kind === "sport" ? undefined : "#2a2e26", prof: "cyl", skin: kind === "sport" ? 1 : 0, dec: [{ k: "serr", x: Pt(34, 21)[0], y: Pt(34, 21)[1], w: 16 * sc, h: 30 * sc, n: 8, a: -.08 }] }));
    return ps;
  };
  return [...one(0, 0, .84, "a"), ...one(64, 24, .96, "b")];
}
const WKEYS = Object.keys(WEAPON);
