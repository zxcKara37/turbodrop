import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, file, outDir, tabsArg] = process.argv;
const b = await chromium.launch();
const errs = [];
for (const [w,h,tag] of [[1280,900,'pc'],[390,844,'ph']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(tag+' '+m.type()+': '+m.text()); });
  p.on('pageerror', e => errs.push(tag+' pageerror: '+e.message));
  await p.goto('file://'+file); await p.waitForTimeout(1500);
  const tabs = (tabsArg||'').split(',').filter(Boolean);
  for (const t of tabs) {
    const sel = `[data-tab="${t}"]`;
    if (await p.$(sel)) { await p.click(sel); await p.waitForTimeout(700); }
    const sw = await p.evaluate(()=>document.documentElement.scrollWidth - innerWidth);
    if (sw>0) errs.push(`${tag} ${t}: horizontal overflow ${sw}px`);
    await p.screenshot({ path: `${outDir}/${tag}-${t}.png`, fullPage: tag==='pc' ? false : false });
  }
}
console.log(errs.join('\n') || 'no console errors');
await b.close();
