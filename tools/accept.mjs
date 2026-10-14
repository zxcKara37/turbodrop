// Приёмочный прогон: полный сценарий без ошибок консоли, проверки денег, дублей, сохранения, миграции, производительности
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const URL = 'file://'+process.cwd()+'/dist/test.html';
const b = await chromium.launch(); const errs = [], res = [];
const ok = (name, cond, extra='') => { res.push(`${cond?'✔':'✘'} ${name}${extra?' — '+extra:''}`) };
const ctx = await b.newContext({ viewport:{width:1280,height:860} }); const p = await ctx.newPage();
p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.type()+': '+m.text()) });
p.on('pageerror', e => errs.push('PAGEERROR: '+e.message));
await p.goto(URL); await p.waitForTimeout(800);
const idle = async () => { await p.waitForFunction(()=>!busy,null,{timeout:60000}); await p.waitForTimeout(250) };
const closeAll = async () => { await p.evaluate(()=>{closeReveal();closeModal()}) };
const invariants = async (tag) => { const r = await p.evaluate(()=>{ const out=[]; for (const m of Object.keys(ALL.modes)) { const s=ALL.modes[m]; if(!(s.bal>=0)||!Number.isFinite(s.bal)) out.push(m+': баланс '+s.bal); const us=s.inv.map(i=>i.u); if(new Set(us).size!==us.length) out.push(m+': дубли u'); s.inv.forEach(i=>{const pr=priceOf(i); if(!Number.isFinite(pr)||pr<1) out.push(m+': цена '+JSON.stringify(i))}); for (const [k,v] of Object.entries(s.st)) if(typeof v==='number'&&!Number.isFinite(v)) out.push(m+': stat '+k) } const txt=document.body.innerText; if(/\bNaN\b|undefined|\[object/.test(txt)) out.push('в тексте страницы NaN/undefined: '+(txt.match(/.{0,30}(NaN|undefined|\[object).{0,30}/)||[''])[0]); return out }); ok('инварианты '+tag, !r.length, r.join('; ')) };
// 1. Обычный режим: открытия
await p.evaluate(()=>{ ALL.fast=true; save() });
await p.evaluate(()=>openCaseView(CASE_BY.start)); await p.waitForTimeout(300);
const bal0 = await p.evaluate(()=>S.bal);
await p.click('#openBtn'); await idle(); await closeAll();
const bal1 = await p.evaluate(()=>S.bal), inv1 = await p.evaluate(()=>S.inv.length);
ok('открытие списывает цену', await p.evaluate(()=>S.st.spent===cprice(CASE_BY.start)), `${bal0}→${bal1}`); ok('предмет в инвентаре', inv1===1);
await p.evaluate(()=>{count=10;segSet("countSeg","n",10);caseState()}); await p.evaluate(()=>{S.bal+=2000}); await p.click('#openBtn'); await idle(); await closeAll();
ok('×10 даёт 10 предметов', await p.evaluate(()=>S.inv.length)===11);
await invariants('после открытий');
// 2. Двойная продажа
const dbl = await p.evaluate(()=>{ const list=S.inv.slice(0,3); const b0=S.bal; const v1=sell(list,true); const v2=sell(list,true); return {d:S.bal-b0,v1,v2} });
ok('повторная продажа тех же предметов не даёт денег', dbl.v2===0 && dbl.d===dbl.v1, JSON.stringify(dbl));
// 3. Бесплатный кейс раз в день
await p.evaluate(()=>openCaseView(CASE_BY.daily)); await p.click('#openBtn'); await idle(); await closeAll();
ok('бесплатный кейс закрыт до завтра', await p.evaluate(()=>$("openBtn").disabled && freeLeft(CASE_BY.daily)>0));
// 4. Все кейсы открываются (по одному, быстро, бесконечный режим)
await p.click('#modeSeg [data-m="inf"]'); await p.waitForTimeout(200);
await p.evaluate(()=>{S.xp=xpFor(25);S.lvl=25});
const ids = await p.evaluate(()=>CASES.filter(c=>!c.free).map(c=>c.id));
for (const id of ids) { await p.evaluate(id=>{ if(cur) closeCaseView(); openCaseView(CASE_BY[id]); count=1; segSet("countSeg","n",1); caseState() }, id); await p.click('#openBtn'); await idle(); await closeAll() }
ok('все 62 платных кейса открылись в ∞', await p.evaluate(()=>S.st.opened)===ids.length, 'открыто '+await p.evaluate(()=>S.st.opened));
await invariants('после всех кейсов');
// кейс из инвентаря (матрёшка)
const hasCase = await p.evaluate(()=>{ const ci={u:++UID,kind:'case',cid:'arsenal',f:0,t:false,ts:Date.now(),kills:0}; addInv(ci,'тест'); openCaseView(CASE_BY.arsenal, ci); return S.inv.length });
await p.click('#openBtn'); await idle(); await closeAll();
ok('кейс из инвентаря открывается бесплатно и исчезает', await p.evaluate(()=>!S.inv.some(i=>i.kind==='case'&&i.src==='тест')));
// 5. Хардкор: без бонусов, цена ×1.2
await p.click('#modeSeg [data-m="hard"]'); await p.waitForTimeout(200);
ok('хардкор: бонус скрыт, кейс дороже', await p.evaluate(()=>$("bonusBtn").hidden && cprice(CASE_BY.arsenal)===Math.round(CASE_BY.arsenal.price*1.2)));
ok('режимы раздельны', await p.evaluate(()=>ALL.modes.hard.inv.length===0 && ALL.modes.inf.inv.length>0 && ALL.modes.norm.inv.length>0));
await p.click('#modeSeg [data-m="norm"]'); await p.waitForTimeout(200);
// 6. Апгрейд
await p.evaluate(()=>{ S.bal+=100000; for(let i=0;i<6;i++) addInv(makeInst(CASE_BY.arsenal.items[5].key),'тест') ; go('upgrade') }); await p.waitForTimeout(300);
await p.evaluate(()=>{ upSel.clear(); S.inv.slice(0,3).forEach(i=>upSel.add(i.u)); renderUp() });
const ch = await p.evaluate(()=>{const s=upStake(),t=curTgt();return upChance(s,tgtPrice(t))});
await p.click('#upBtn'); await idle(); await closeAll();
ok('апгрейд записан в историю', await p.evaluate(()=>S.upHist.length===1 && S.st.upTries===1), 'шанс '+ch.toFixed(3));
// 7. Контракт
await p.evaluate(()=>go('contract')); await p.click('#ctAuto'); await p.click('#ctBtn'); await idle(); await closeAll();
ok('контракт подписан', await p.evaluate(()=>S.st.ctTotal===1));
// 8. Батлы во всех режимах
await p.evaluate(()=>go('battle'));
for (const [f,m] of [['1v1','classic'],['1v3','reverse'],['2v2','classic'],['1v1','boss'],['1v2','random']]) { await p.click(`#btMode [data-b="${m}"]`); if (m!=='boss') await p.click(`#btFormat [data-f="${f}"]`); await p.click('#btRounds [data-r="3"]'); await p.click('#btBtn'); await idle(); await closeAll() }
ok('5 батлов сыграно', await p.evaluate(()=>S.st.bTotal)===5);
await invariants('после батлов');
// 9. Мини-игры
await p.evaluate(()=>go('games'));
for (let i=0;i<3;i++){ await p.click('#coinBtn'); await idle() }
await p.click('#gameChips [data-g="crash"]'); await p.fill('#crashAuto','1.5'); await p.click('#crashBtn'); await idle();
await p.click('#gameChips [data-g="mines"]'); await p.click('#minesBtn'); await p.click('#minesGrid button[data-i="0"]'); await p.waitForTimeout(100); await p.evaluate(()=>{ if(mines&&mines.run&&mines.open.size) minesCash() }); await idle();
await p.click('#gameChips [data-g="wheel"]'); await p.click('#wheelBtn'); await idle();
ok('мини-игры отработали', await p.evaluate(()=>S.st.games>=5 && S.st.wheel===1));
ok('колесо — раз в сутки', await p.evaluate(()=>$("wheelBtn").disabled));
// 10. Рынок: купить и продать
await p.evaluate(()=>go('market')); await p.click('#mkChips [data-v="buy"]'); await p.waitForTimeout(200);
const before = await p.evaluate(()=>S.inv.length); await p.click('#mkList .mrow .act button'); await p.waitForTimeout(200);
ok('покупка на рынке', await p.evaluate(()=>S.inv.length)===before+1 && await p.evaluate(()=>S.st.bought)===1);
await p.click('#mkChips [data-v="mine"]'); await p.waitForTimeout(200); await p.click('#mkList .mrow .act button'); await p.waitForTimeout(200);
ok('продажа на рынке', await p.evaluate(()=>S.inv.length)===before);
// 11. Профиль, витрина, экспорт/импорт
await p.evaluate(()=>{ S.show=[S.inv[0].u]; go('profile') }); await p.waitForTimeout(300);
await p.fill('#nickIn','Тестер'); await p.press('#nickIn','Enter'); await p.evaluate(()=>$("nickIn").dispatchEvent(new Event('change')));
await p.click('#exportBtn'); await p.waitForTimeout(200); const exp = await p.inputValue('#saveText');
ok('экспорт — строка TD4', exp.startsWith('TD4:') && exp.length>200);
const snap = await p.evaluate(()=>JSON.stringify([S.bal,S.inv.length,ALL.nick]));
await p.evaluate(()=>{ S.bal=1; S.inv=[]; ALL.nick='x' });
await p.fill('#saveText', exp); await p.click('#importBtn'); await p.waitForTimeout(200); await p.click('#mbox .btn'); await p.waitForTimeout(300);
ok('импорт восстанавливает состояние', await p.evaluate(()=>JSON.stringify([S.bal,S.inv.length,ALL.nick]))===snap);
await invariants('после импорта');
// 12. Перезагрузка сохраняет прогресс
await p.evaluate(()=>{achCheck();save(true)}); await p.waitForTimeout(800); await p.evaluate(()=>save(true)); const st1 = await p.evaluate(()=>JSON.stringify([ALL.mode,S.bal,S.inv.length,S.st.opened,ALL.nick]));
await p.reload(); await p.waitForTimeout(900);
const st2 = await p.evaluate(()=>JSON.stringify([ALL.mode,S.bal,S.inv.length,S.st.opened,ALL.nick])); ok('перезагрузка сохраняет прогресс', st2===st1, st1+' / '+st2);
// 13. Сброс режима с подтверждением
await p.evaluate(()=>go('profile')); await p.click('#resetBtn'); await p.waitForTimeout(200); await p.click('#mbox .btn'); await p.waitForTimeout(300);
ok('сброс режима: 1 000 ₽ и пустой инвентарь', await p.evaluate(()=>S.bal>=1000 && S.inv.length===0 && ALL.modes.inf.inv.length>0));
await invariants('после сброса');
// 14. Миграция сохранения v3
const old = { mode:'norm', snd:true, norm:{bal:4321,inv:[{u:1,id:7,f:.12,tier:1,turbo:true,price:999,ts:1},{u:2,id:150,f:.6,tier:4,turbo:false,price:50,ts:2},{u:3,id:204,f:.03,tier:0,turbo:false,price:5,ts:3}],opened:77,spent:5000,won:3000,best:{n:'X',p:900},bTotal:3,bWins:1,xp:9000,lvl:4,bonusAt:0,freeAt:0,hist:[],rc:[10,5,3,1,0,0],ach:['first'],upWins:1,upBig:0,ctWin:0,turbo:1,perfect:0,bought:0}, inf:{bal:0,inv:[],opened:2,spent:0,won:0,best:null,bTotal:0,bWins:0,xp:0,lvl:0,bonusAt:0,freeAt:0,hist:[],rc:[0,0,0,0,0,0],ach:[],upWins:0,upBig:0,ctWin:0,turbo:0,perfect:0,bought:0} };
const ctx2 = await b.newContext({ viewport:{width:1280,height:860} }); const p2 = await ctx2.newPage(); p2.on('pageerror', e => errs.push('PAGEERROR(v3): '+e.message)); p2.on('console', m => { if (['error','warning'].includes(m.type())) errs.push('v3 '+m.type()+': '+m.text()) });
await ctx2.addInitScript(o=>{ if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded','1'); localStorage.clear(); localStorage.setItem('turbodrop_v3', JSON.stringify(o)) } }, old); await p2.goto(URL); await p2.waitForTimeout(900);
const mig = await p2.evaluate(()=>({from:LOADED_FROM,bal:S.bal,inv:S.inv.map(i=>i.k+'|'+i.t),opened:S.st.opened,lvl:S.lvl,ver:JSON.parse(localStorage.getItem('turbodrop_v4')).ver}));
ok('миграция v3 → v4', mig.from==='v3' && mig.bal>=4321 && mig.inv.length===3 && mig.opened===77 && mig.ver===4, JSON.stringify(mig));
await p2.reload(); await p2.waitForTimeout(700); ok('после миграции грузится v4', await p2.evaluate(()=>LOADED_FROM)==='v4');
// 15. Без localStorage
const ctx3 = await b.newContext({ viewport:{width:1280,height:860} }); await ctx3.addInitScript(()=>{ Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}}) });
const p3 = await ctx3.newPage(); const e3=[]; p3.on('pageerror', e => e3.push(e.message)); await p3.goto(URL); await p3.waitForTimeout(800);
ok('работает без localStorage', !e3.length && await p3.evaluate(()=>!STORE.ok && S.bal>=1000), e3.join(';'));
// 16. Инвентарь на 1000 предметов: прокрутка
await p.evaluate(()=>{ const keys=UP_POOL; for(let i=0;i<1000;i++) S.inv.push(makeInst(keys[i%keys.length])); go('inv') }); await p.waitForTimeout(5000);
const perf = await p.evaluate(async()=>{ const fr=[]; let last=performance.now(); let y=0; const H=document.body.scrollHeight; return await new Promise(res=>{ const step=t=>{ fr.push(t-last); last=t; y+=60; scrollTo(0,y); if(y<Math.min(H,24000)) requestAnimationFrame(step); else { fr.sort((a,b)=>a-b); res({frames:fr.length,p50:fr[fr.length>>1].toFixed(1),p95:fr[Math.floor(fr.length*.95)].toFixed(1),max:fr[fr.length-1].toFixed(1),dom:document.querySelectorAll('#inv .icard').length}) } }; requestAnimationFrame(step) }) });
ok('1000 предметов: прокрутка плавная', +perf.p50 <= 20 && +perf.p95 <= 34 && perf.dom < 200, JSON.stringify(perf));
await invariants('инвентарь 1000');
console.log(res.join('\n')); console.log('ОШИБКИ КОНСОЛИ:', errs.length ? '\n'+errs.join('\n') : 'нет'); await b.close();
