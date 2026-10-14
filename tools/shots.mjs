// Скриншоты всех вкладок на ПК и телефоне + сбор ошибок консоли
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const out = process.argv[2], tabs = (process.argv[3]||'cases,battle,upgrade,contract,games,market,inv,profile').split(','), sizes = (process.argv[4]||'pc,ph').split(',');
const b = await chromium.launch(); const errs = [];
for (const tag of sizes) {
  const [w,h] = tag==='pc'?[1280,860]:[390,844];
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor: tag==='pc'?1:2, hasTouch: tag==='ph' });
  const p = await ctx.newPage();
  p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(tag+' '+m.type()+': '+m.text()) });
  p.on('pageerror', e => errs.push(tag+' PAGEERROR: '+e.message));
  await p.goto('file://'+process.cwd()+'/dist/test.html'); await p.waitForTimeout(1200);
  if (process.env.SEED) await p.evaluate(process.env.SEED);
  for (const t of tabs) {
    await p.evaluate(t=>{ if(window.go) go(t) }, t); await p.waitForTimeout(t==='cases'?1500:900);
    const sw = await p.evaluate(()=>document.documentElement.scrollWidth - innerWidth);
    if (sw>0) errs.push(`${tag} ${t}: горизонтальный скролл ${sw}px`);
    await p.screenshot({ path:`${out}/${tag}-${t}.png`, fullPage: !!process.env.FULL });
  }
  await ctx.close();
}
console.log(errs.length? errs.join('\n') : 'OK: ошибок нет'); await b.close();
