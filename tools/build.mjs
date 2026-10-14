import fs from 'fs';
const order = fs.readdirSync('src/js').filter(f=>f.endsWith('.js')).sort();
const js = order.map(f=>`/* ---- ${f} ---- */\n`+fs.readFileSync('src/js/'+f,'utf8')).join('\n');
const css = fs.readFileSync('src/styles.css','utf8');
const body = fs.readFileSync('src/body.html','utf8');
const head = `<title>ТурбоДроп</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Симулятор кейсов: оружие и скины рисуются кодом, честные шансы, батлы, апгрейды, контракты и мини-игры.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Golos+Text:wght@400;500;700;800&display=swap">
<style>
${css}</style>
`;
const out = head + body + `\n<script>\n${js}\n</script>\n`;
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/index.html', out);
const skel = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n';
fs.writeFileSync('dist/test.html', skel + out + '\n</body></html>');
console.log('built', (out.length/1024).toFixed(1)+' KB', order.length+' js files');
