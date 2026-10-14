import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/tools/blank.html');
for (const f of ['00-util','10-geom','20-patterns','30-render','40-parts','41-weapons','50-skins','60-economy','61-cases','62-casebuild']) await p.addScriptTag({path:'src/js/'+f+'.js'});
const r = await p.evaluate(()=>{
  const v=verifyCases();
  const bad=v.filter(x=>!x.ok);
  // симуляция 10000 открытий
  const sim=CASES.map(cs=>{const N=10000,c=new Array(cs.items.length).fill(0);for(let i=0;i<N;i++){const {e}=rollCase(cs);c[cs.items.indexOf(e)]++}
    let maxz=0;cs.items.forEach((e,i)=>{const p=e.t/TICKETS,exp=N*p,sd=Math.sqrt(N*p*(1-p));maxz=Math.max(maxz,Math.abs(c[i]-exp)/sd)});
    const chi=cs.items.reduce((a,e,i)=>{const exp=N*e.t/TICKETS;return a+(c[i]-exp)**2/exp},0);return {id:cs.id,maxz:+maxz.toFixed(2),chi:+chi.toFixed(1),df:cs.items.length-1}});
  return {n:CASES.length,nonfree:CASES.filter(c=>!c.free).length,cats:[...new Set(CASES.map(c=>c.cat))].length,bad,
    table:v.map(x=>`${x.id.padEnd(12)} ${String(x.items).padStart(2)} ${String(x.price).padStart(8)} ${(x.rtp*100).toFixed(2)}% ${x.sum}`).join('\n'),
    sim:sim.map(s=>`${s.id}:z${s.maxz}/chi${s.chi}(df${s.df})`).join('  '), weap:WKEYS.length, skins:SKIN_IDS.length, tex:SKIN_RAW.length};
});
console.log(r.table); console.log('cases',r.n,'nonfree',r.nonfree,'cats',r.cats,'weapons',r.weap,'skins',r.skins,'textures',r.tex); console.log('BAD',JSON.stringify(r.bad)); console.log(r.sim);
await b.close();
