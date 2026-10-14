// Сценарий: наполнить инвентарь, открыть кейс, снять кадры рулетки и показа
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const out = process.argv[2], W=+(process.argv[3]||1280), H=+(process.argv[4]||860), tag=process.argv[5]||'pc';
const b = await chromium.launch(); const ctx = await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:1}); const p = await ctx.newPage(); const errs=[];
p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.type()+': '+m.text()) }); p.on('pageerror', e => errs.push('PAGEERROR: '+e.message));
await p.goto('file://'+process.cwd()+'/dist/test.html'); await p.waitForTimeout(800);
await p.evaluate(()=>{ S.bal=60000; S.xp=xpFor(12)+10; S.lvl=12; for(let i=0;i<60;i++){const cs=CASES[3+i%60];const {e}=rollCase(cs);addInv(e.cid?{u:++UID,kind:'case',cid:e.cid,f:0,t:false,ts:Date.now(),kills:0}:makeInst(e.key),cs.n)} save(); refresh(); });
await p.evaluate(()=>openCaseView(CASE_BY.cyber)); await p.waitForTimeout(700); await p.screenshot({path:`${out}/${tag}-caseview.png`});
await p.evaluate(()=>{count=3;segSet("countSeg","n",3);caseState()}); await p.click('#openBtn'); await p.waitForTimeout(380); await p.screenshot({path:`${out}/${tag}-crate.png`});
await p.waitForTimeout(2600); await p.screenshot({path:`${out}/${tag}-spin.png`});
await p.waitForTimeout(4600); await p.screenshot({path:`${out}/${tag}-reveal.png`});
await p.evaluate(()=>closeReveal()); await p.waitForTimeout(200); await p.mouse.wheel(0,1200); await p.waitForTimeout(500); await p.screenshot({path:`${out}/${tag}-drops.png`});
for (const t of ['inv','upgrade','contract','market','profile']) { await p.evaluate(t=>go(t),t); await p.waitForTimeout(900); await p.screenshot({path:`${out}/${tag}-f-${t}.png`}) }
await p.evaluate(()=>go('inv')); await p.waitForTimeout(300); await p.evaluate(()=>openItem(S.inv.find(i=>i.kind!=='case'))); await p.waitForTimeout(800); await p.mouse.move(W*0.62,H*0.3); await p.waitForTimeout(300); await p.screenshot({path:`${out}/${tag}-item.png`});
console.log(errs.join('\n')||'OK'); await b.close();
