'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.gif':'image/gif','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let filename;
 try{filename=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));}catch{res.writeHead(400).end();return;}
 if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(filename===root)filename=path.join(root,'hns-impact-lab.html');
 fs.readFile(filename,(err,body)=>{if(err){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream'});res.end(body);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
  for(const [id,viewport,isMobile] of [['desktop',{width:1280,height:1000},false],['mobile',{width:390,height:844},true]]){
   const page=await browser.newPage({viewport,isMobile,hasTouch:isMobile});
   const errors=[],httpErrors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1'))httpErrors.push(r.status()+' '+r.url());});
   await page.goto('http://127.0.0.1:'+server.address().port+'/hns-impact-lab.html',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>window.__impactLab?.ready===true,null,{timeout:35000});
   const initial=await page.evaluate(()=>({...window.__impactLab}));
   assert.equal(initial.renderer,'WebGL',id);
   assert.equal(initial.spriteCount,4,id);
   await page.waitForFunction(initial=>window.__impactLab.frame!==initial,initial.frame,{timeout:6000});
   await page.locator('#pause').click();
   const frozen=await page.evaluate(()=>window.__impactLab.frame);
   await page.waitForTimeout(200);
   assert.equal(await page.evaluate(()=>window.__impactLab.frame),frozen,id+' pause works');
   await page.locator('#replay').click();
   assert.equal(await page.evaluate(()=>window.__impactLab.frame),0,id+' replay starts from frame 0');
   await page.locator('#speed').click();
   assert.equal(await page.locator('#speed').getAttribute('aria-pressed'),'true');
   await page.locator('#background').click();
   assert.equal(await page.locator('#background').getAttribute('aria-pressed'),'true');
   const assets=await page.evaluate(async()=>{
    const paths=['ember-hit','frost-hit','volt-hit','tide-hit'].flatMap(id=>['png','gif'].map(ext=>'./effects/hns-impact-studies/'+id+'.'+ext));
    return Promise.all(paths.map(async p=>{const r=await fetch(p);const b=await r.arrayBuffer();return{path:p,status:r.status,size:b.byteLength}}));
   });
   assert.equal(assets.length,8,id);
   assert.ok(assets.every(a=>a.status===200&&a.size>1000),id+' all sprite sheets / GIFs loaded');
   assert.deepEqual(errors,[],id+' JavaScript errors');
   assert.deepEqual(httpErrors,[],id+' missing assets');
   const folder=path.join(root,'evidence/hns-impact-studies');
   fs.mkdirSync(folder,{recursive:true});
   await page.screenshot({path:path.join(folder,id+'-review.png'),fullPage:true});
   await page.close();
  }
  console.log('HnS impact studies: desktop/mobile WebGL QA passed');
 } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
