import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:390,height:844}});
await p.goto('file://'+process.cwd()+'/dist/test.html'); await p.waitForTimeout(1000);
if (process.argv[2]) { await p.evaluate(process.argv[2]); await p.waitForTimeout(800) }
console.log(await p.evaluate(()=>{const W=innerWidth,r=[];document.querySelectorAll('body *').forEach(e=>{const b=e.getBoundingClientRect();if(b.right>W+1&&b.width>0&&getComputedStyle(e).position!=='fixed'){let a=e,clip=false;while(a=a.parentElement){const s=getComputedStyle(a);if(s.overflowX!=='visible'||s.overflow==='hidden'){clip=true;break}}if(!clip)r.push(e.tagName+'.'+e.className+' '+Math.round(b.right))}});return r.slice(0,15).join('\n')}));
await b.close();
