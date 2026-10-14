/* ================= Профиль ================= */
function balanceChart(W = 600) {
  const h = S.balHist.slice(-80); if (h.length < 2) h.unshift([h[0][0] - 6e4, h[0][1]]);
  const H = 200, vals = h.map(x => x[1]), mn = Math.min(...vals), mx = Math.max(...vals), pad = (mx - mn) * .12 || 10, lo = mn >= 0 ? Math.max(0, mn - pad) : mn - pad, hi = mx + pad;
  const X = i => 44 + i / (h.length - 1) * (W - 52), Y = v => 12 + (1 - (v - lo) / (hi - lo)) * (H - 40);
  const d = h.map((p, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p[1]).toFixed(1)).join("");
  let grid = ""; for (let k = 0; k <= 3; k++) { const v = lo + (hi - lo) * k / 3, y = Y(v); grid += `<line x1="44" x2="${W - 8}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="40" y="${y + 4}" fill="var(--muted)" font-size="11" text-anchor="end">${fmtN(v)}</text>` }
  const t0 = new Date(h[0][0]), t1 = new Date(h[h.length - 1][0]), tf = t => t.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const last = h[h.length - 1][1];
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${INF() ? "Итог в бесконечном режиме" : "График баланса"}"><defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${d}L${X(h.length - 1)} ${H - 28}L44 ${H - 28}Z" fill="url(#bg1)"/><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/><circle cx="${X(h.length - 1)}" cy="${Y(last)}" r="5" fill="var(--accent)" stroke="var(--bg)" stroke-width="2"/><text x="44" y="${H - 8}" fill="var(--muted)" font-size="11">${tf(t0)}</text><text x="${W - 8}" y="${H - 8}" fill="var(--muted)" font-size="11" text-anchor="end">${tf(t1)}</text></svg>${INF() ? '<p class="sub">В бесконечном режиме график показывает итог: выбито минус потрачено.</p>' : ""}`;
}
function renderProfile() {
  $("profDot").hidden = true;
  const st = S.st, net = st.won - st.spent, l = S.lvl, a = xpFor(l), b = xpFor(l + 1);
  const pc = $("pCard"); pc.innerHTML = "";
  const av = el("button", "ava"); av.innerHTML = avatarSVG(ALL.ava); av.title = "Сменить аватар"; av.setAttribute("aria-label", "Сменить аватар"); av.onclick = () => { ALL.ava = FAIR.int(1e9); save(); renderProfile(); SND.click() };
  const mid = el("div"); mid.innerHTML = `<div class="eyebrow">${MODE().n} режим</div><div class="nick"><input type="text" id="nickIn" maxlength="18" aria-label="Ник" value="${esc(ALL.nick)}"><button class="ghost sm" id="avaBtn">Новый аватар</button></div><div class="muted" style="font-size:13px">В игре с ${new Date(S.balHist[0][0]).toLocaleDateString("ru-RU")} · ${fmtN(st.opened)} ${plural(st.opened, "кейс", "кейса", "кейсов")} открыто</div>`;
  const lv = el("div", "lv"); lv.innerHTML = `<small class="muted">Уровень</small><b>${l}</b><div class="lvl" style="width:180px"><span class="muted">${fmtN(S.xp - a)} / ${fmtN(b - a)} опыта</span><i><b style="width:${Math.min(100, (S.xp - a) / (b - a) * 100)}%"></b></i></div>`;
  pc.append(av, mid, lv);
  $("nickIn").onchange = () => { ALL.nick = $("nickIn").value.trim().slice(0, 18) || "Игрок"; save(); toast("Ник сохранён", "good") };
  $("avaBtn").onclick = av.onclick;
  $("pChart").innerHTML = balanceChart(Math.max(280, Math.min(900, $("pChart").clientWidth || 600)));
  const sh = $("pShow"); sh.innerHTML = "";
  for (let i = 0; i < 3; i++) { const u = S.show[i], it = u && S.inv.find(x => x.u === u); if (it) sh.append(icard(it, { shine: true, click: () => openItem(it) })); else sh.append(el("div", "slotx", "Пустой слот. Открой предмет в инвентаре и нажми «В витрину»")) }
  const tiles = [["Кейсов открыто", fmtN(st.opened)], ["Потрачено", fmt(st.spent)], ["Выбито", fmt(st.won)], ["Итог", `<span style="color:${net >= 0 ? "var(--good)" : "var(--bad)"}">${net >= 0 ? "+" : "−"}${fmt(Math.abs(net))}</span>`], ["Инвентарь", fmt(invValue())], ["Лучший дроп", st.best ? `${fmt(st.best.p)}<small style="margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(st.best.n)}</small>` : "—"], ["Батлы", `${st.bWins} из ${st.bTotal}`], ["Апгрейды", `${st.upWins} из ${st.upTries}`], ["Контракты", fmtN(st.ctTotal)], ["Мини-игры", fmtN(st.games)], ["TURBO", fmtN(st.turbo)], ["Серия входов", `${S.streak.n} ${plural(S.streak.n, "день", "дня", "дней")}`]];
  $("pTiles").innerHTML = tiles.map(([k, v]) => `<div class="tile"><small>${k}</small><b>${v}</b></div>`).join("");
  const qs = questsToday(); $("qReset").textContent = "· обновятся через " + hms((dayNo() + 1) * DAY - 3 * 3600e3 - Date.now());
  $("pQuests").innerHTML = qs.map(q => { const [, n, , need, rw] = qdef(q.id); return `<div class="quest${q.done ? " done" : ""}"><span>${q.done ? "✓ " : ""}${esc(n)}</span><small>${ALL.mode === "norm" ? "+" + fmt(rw) : "+" + fmtN(rw) + " опыта"}</small><i><b style="width:${Math.min(100, q.p / need * 100)}%"></b></i><small>${fmtN(q.p)} / ${fmtN(need)}</small></div>` }).join("");
  const sn = S.streak.n; $("pStreak").innerHTML = STREAK_RW.map((r, i) => `<span class="${i < Math.min(sn, 7) ? "on" : ""}${i === Math.min(sn, 7) - 1 ? " today" : ""}">День ${i + 1}<b>${ALL.mode === "norm" ? fmtN(r) : "—"}</b></span>`).join("");
  $("pLeaders").innerHTML = leaders().slice(0, 13).map((r, i) => `<div class="lrow${r.me ? " me" : ""}"><span class="pl">${i + 1}</span><img alt="" src="${avatarURL(r.ava)}"><span>${esc(r.n)}</span><b>${fmt(r.v)}</b></div>`).join("");
  const tot = st.rc.reduce((x, y) => x + y, 0) || 1;
  $("pBars").innerHTML = RAR.map((r, i) => `<div class="barrow" style="--rc:${r.h}"><span style="color:${r.h}">${r.n}</span><i><b style="width:${st.rc[i] / tot * 100}%"></b></i><span>${fmtN(st.rc[i])}</span></div>`).join("");
  $("achCount").textContent = `· ${S.ach.length} из ${ACH.length}`;
  $("pAch").innerHTML = ACH.map(([id, n, d, , rw, emb, tier]) => { const on = S.ach.includes(id); return `<div class="achi ${on ? "on" : "off"}">${badgeSVG(emb, tier)}<span><b>${esc(n)}</b><small>${esc(d)}</small>${rw && ALL.mode === "norm" ? `<span class="rw">${on ? "получено" : "награда"} ${fmt(rw)}</span>` : ""}</span></div>` }).join("");
  $("saveInfo").textContent = (STORE.ok ? "Прогресс сохраняется в этом браузере автоматически." : "Браузер не даёт сохранять данные: прогресс живёт до закрытия вкладки. Скопируй строку экспорта, чтобы не потерять его.") + ` У каждого режима свой баланс, инвентарь и статистика. Формат сохранения v${SAVE_VER}${LOADED_FROM === "v3" ? ", прогресс перенесён из прошлой версии" : ""}.`;
}
$("exportBtn").onclick = async () => { const s = exportSave(); $("saveText").value = s; $("saveText").select(); try { await navigator.clipboard.writeText(s); toast("Строка сохранения скопирована", "good") } catch (e) { toast("Строка выделена — скопируй её вручную") } };
$("importBtn").onclick = () => { const v = $("saveText").value.trim(); if (!v) { $("saveText").focus(); return toast("Вставь строку сохранения в поле ниже", "bad") } confirmBox("Загрузить сохранение?", "Текущий прогресс во всех режимах заменится данными из строки.", "Загрузить", () => { const err = importSave(v); if (err) { toast(err, "bad"); SND.error(); return } resetUIState(); refresh(); renderChips(); renderFeatured(); toast("Сохранение загружено", "good") }) };
$("resetBtn").onclick = () => confirmBox(`Сбросить режим «${MODE().n}»?`, "Баланс, инвентарь, достижения и статистика этого режима обнулятся. Другие режимы не пострадают.", "Сбросить", () => { ALL.modes[ALL.mode] = freshMode(ALL.mode); S = ALL.modes[ALL.mode]; resetUIState(); streakCheck(); save(true); refresh(); toast(INF() ? "Режим сброшен" : "Новый старт: " + fmt(S.bal), "good") }, true);
