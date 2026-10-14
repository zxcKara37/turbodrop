import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, url, out, w='1280', h='900', full='1'] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:+w,height:+h}});
const errs=[]; p.on('console',m=>{if(['error','warning'].includes(m.type()))errs.push(m.text())}); p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto(url); await p.waitForFunction(()=>document.title.startsWith('done'),null,{timeout:120000}).catch(()=>{});
console.log(await p.title()); await p.screenshot({path:out, fullPage: full==='1'}); console.log(errs.join('\n')); await b.close();
