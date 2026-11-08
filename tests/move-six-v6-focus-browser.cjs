'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.mjs':'text/javascript; charset=utf-8','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let file;
 try{file=path.resolve(root,'.'+decodeURI((req.url||'/').split('?')[0]))}
 catch{res.writeHead(400).end();return}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 if(file===root)file=path.join(root,'moves-v6-focus.html');
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404).end();return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data);
 });
});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
  headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader',
    '--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
  for(const [id,viewport,mobile] of [['desktop',{width:1024,height:900},false],['mobile',{width:390,height:844},true]]){
   const page=await browser.newPage({viewport,hasTouch:mobile,isMobile:mobile});
   const err=[],bad=[];
   page.on('pageerror',e=>err.push(String(e)));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))bad.push(r.status()+' '+r.url())});
   await page.goto('http://127.0.0.1:'+server.address().port+'/moves-v6-focus.html',
    {waitUntil:'domcontentloaded',timeout:35000});
   await page.waitForFunction(()=>window.__v6focus?.ready===true,null,{timeout:55000});
   const init=await page.evaluate(()=>({
    renderer:window.__v6focus.renderer,
    textures:window.__v6focus.textures,
    move:window.__v6focus.move,
    version:window.__v6focus.version,
    canvas:[document.querySelector('#stage canvas')?.width,document.querySelector('#stage canvas')?.height],
    errors:window.__v6focus.errors
   }));
   assert.deepEqual(init,{renderer:'WebGL',textures:17,move:'flame-burst',version:'v6',canvas:[420,360],errors:[]},id);
   const out=path.join(root,'evidence/moves-six-v6-focus');fs.mkdirSync(out,{recursive:true});
   for(const move of ['flame-burst','frost-breath','air-slash','razor-shell','shadow-punch','meteor-mash']){
    await page.locator('#move').selectOption(move);
    await page.waitForFunction(v=>window.__v6focus.move===v,move);
    await page.locator('#travel').click();
    await page.waitForFunction(()=>window.__v6focus.frame===7&&window.__v6focus.visibleMaterials>0);
    if(id==='mobile')await page.screenshot({path:path.join(out,'mobile-'+move+'-travel.png'),fullPage:true});
    await page.locator('#impact').click();
    await page.waitForFunction(()=>window.__v6focus.frame===10&&window.__v6focus.visibleMaterials>0);
    await page.screenshot({path:path.join(out,id+'-'+move+'-impact.png'),fullPage:true});
   }
   await page.locator('#material').click();
   await page.waitForFunction(()=>window.__v6focus.materialOn===false&&window.__v6focus.visibleMaterials===0);
   await page.locator('#material').click();
   await page.waitForFunction(()=>window.__v6focus.materialOn===true&&window.__v6focus.visibleMaterials>0);
   await page.locator('#v5').click();
   await page.waitForFunction(()=>window.__v6focus.version==='v5'&&window.__v6focus.layers===3);
   await page.locator('#v6').click();
   await page.waitForFunction(()=>window.__v6focus.version==='v6'&&window.__v6focus.layers>3);
   await page.locator('#prev').click();
   await page.waitForFunction(()=>window.__v6focus.move==='shadow-punch');
   await page.locator('#next').click();
   await page.waitForFunction(()=>window.__v6focus.move==='meteor-mash');
   await page.locator('#play').click();
   await page.waitForFunction(()=>window.__v6focus.paused===false);
   await page.locator('#slow').click();
   await page.locator('#normal').click();
   assert.deepEqual(err,[],id+' focus browser JS');
   assert.deepEqual(bad,[],id+' focus local resource');
   console.log('PASS',id,'focus viewer: six individual move selectors, travel/impact frames, 11 CC0 textures, toggles, V5 comparison, mobile 390px');
   await page.close();
  }
 }finally{await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error(e);process.exitCode=1});
