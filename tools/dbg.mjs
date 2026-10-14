import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage();
p.on('console',m=>console.log('C',m.text())); p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/tools/blank.html');
for (const f of ['00-util','10-geom','20-patterns','30-render','40-parts','41-weapons','50-skins']) await p.addScriptTag({path:'src/js/'+f+'.js'});
const r = await Promise.race([p.evaluate(`(()=>{const out=[];const t=performance.now();for(const k of ${JSON.stringify(process.argv[2]||'ak74')}.split(',')){console.log('asm '+k);const A=assemble(k);console.log('parts '+A.parts.length);renderGun({type:k,skin:SKINS.camo0,tier:0},2.4);console.log('ok '+k+' '+Math.round(performance.now()-t))}return 'done'})()`), new Promise(r=>setTimeout(()=>r('TIMEOUT'),15000))]);
console.log(r); process.exit(0);
