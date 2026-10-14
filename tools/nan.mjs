// Проверка всего каталога: ни одной NaN/undefined/отрицательной цены
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file://'+process.cwd()+'/dist/test.html'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{let bad=[],n=0;for(const t of WKEYS)for(const s of SKIN_IDS){const k=t+':'+s;for(const f of [0,.05,.1,.2,.4,.44,.9])for(const tt of [false,true])for(const tm of [0,Date.now(),Date.now()+7*864e5]){n++;const p=priceOf({k,f,t:tt},tm||undefined);if(!Number.isFinite(p)||p<1)bad.push(k+' '+p)}}
 CASES.forEach(c=>{if(!Number.isFinite(c.price)||!Number.isFinite(c.rtp))bad.push('case '+c.id)}); return n+' цен проверено, плохих: '+bad.length+' '+bad.slice(0,5).join(',')}));
await b.close();
