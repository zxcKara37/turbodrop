// Телефон пальцем: tap по кнопкам, без мыши
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const out = process.argv[2];
const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, hasTouch:true, isMobile:true }); const p = await ctx.newPage(); const errs=[];
p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.type()+': '+m.text()) }); p.on('pageerror', e => errs.push('PAGEERROR: '+e.message));
await p.goto('file://'+process.cwd()+'/dist/test.html'); await p.waitForTimeout(1000);
const r = [];
await p.tap('.ccard >> nth=0'); await p.waitForTimeout(400); r.push('кейс открыт: '+await p.evaluate(()=>!!cur && !$("caseView").hidden));
await p.tap('#openBtn'); await p.waitForTimeout(3000); await p.screenshot({path:`${out}/t-spin.png`});
await p.waitForFunction(()=>!$("reveal").hidden,null,{timeout:20000}); await p.waitForTimeout(900); await p.screenshot({path:`${out}/t-reveal.png`});
await p.tap('#rbox .ghost[data-focus]'); await p.waitForTimeout(300); r.push('показ закрыт: '+await p.evaluate(()=>$("reveal").hidden));
await p.tap('[data-tab="inv"]'); await p.waitForTimeout(500); await p.tap('#inv .icard >> nth=0'); await p.waitForTimeout(700); r.push('карточка предмета: '+await p.evaluate(()=>!$("modal").hidden));
await p.screenshot({path:`${out}/t-item.png`});
// жест по осмотру
const box = await p.locator('.inspect').boundingBox(); await p.touchscreen.tap(box.x+box.width*.7, box.y+box.height*.5);
await p.tap('#mbox .btn'); await p.waitForTimeout(400); r.push('продано пальцем: '+await p.evaluate(()=>S.inv.length===0));
await p.tap('[data-tab="games"]'); await p.waitForTimeout(400); await p.tap('#gameChips [data-g="mines"]'); await p.tap('#minesBtn'); await p.waitForTimeout(200); await p.tap('#minesGrid button >> nth=12'); await p.waitForTimeout(300); await p.screenshot({path:`${out}/t-mines.png`});
r.push('мины по тапу: '+await p.evaluate(()=>mines && mines.open.size + (mines.run?0:1) > 0));
await p.tap('[data-tab="profile"]'); await p.waitForTimeout(500); await p.screenshot({path:`${out}/t-profile.png`, fullPage:true});
console.log(r.join('\n')); console.log(errs.join('\n')||'ошибок нет'); await b.close();
