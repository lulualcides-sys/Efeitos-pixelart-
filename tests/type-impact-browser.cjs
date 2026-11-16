'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright-core');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.gif':'image/gif','.json':'application/json'};
const server=http.createServer((req,res)=>{
 let filename;try{filename=path.resolve(root,'.'+decodeURIComponent((req.url||'/').split('?')[0]));}
 catch{res.writeHead(400).end();return;}
 if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(filename===root)filename=path.join(root,'type-impact-lab.html');
 fs.readFile(filename,(err,data)=>{if(err){res.writeHead(404).end('Missing');return;}res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream'});res.end(data);});
});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
  for(const [kind,viewport,isMobile] of [['desktop',{width:1280,height:900},false],['mobile',{width:390,height:844},true]]){
   const page=await browser.newPage({viewport,isMobile,hasTouch:isMobile});
   const errs=[],httpErr=[];
   page.on('pageerror',e=>errs.push(String(e)));
   page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1')&&r.status()>=400)httpErr.push(r.url()+' HTTP '+r.status());});
   await page.goto('http://127.0.0.1:'+server.address().port+'/type-impact-lab.html',{waitUntil:'load',timeout:30000});
   const images=page.locator('.grid img');assert.equal(await images.count(),18);
   await page.evaluate(async()=>{const images=[...document.querySelectorAll('.grid img')];for(const img of images){img.loading='eager';await img.decode();}});
   const dimensions=await page.evaluate(()=>[...document.querySelectorAll('.grid img')].map(i=>({w:i.naturalWidth,h:i.naturalHeight,src:i.src})));
   assert.ok(dimensions.every(x=>x.w===96&&x.h===96),kind+' GIF frames are 96×96');
   const folder=path.join(root,'evidence/type-impact-pack');fs.mkdirSync(folder,{recursive:true});
   await page.screenshot({path:path.join(folder,kind+'-18-animated-review.png'),fullPage:true});
   await page.locator('#mode').click();
   await page.evaluate(async()=>{for(const img of document.querySelectorAll('.grid img'))await img.decode();});
   const sheets=await page.evaluate(()=>[...document.querySelectorAll('.grid img')].map(i=>[i.naturalWidth,i.naturalHeight]));
   assert.ok(sheets.every(x=>x[0]===1536&&x[1]===96),kind+' transparent spritesheets are 1536×96');
   await page.locator('#mode').click();
   assert.equal(await page.locator('#mode').getAttribute('aria-pressed'),'false');
   assert.deepEqual(errs,[],kind+' JS errors');
   assert.deepEqual(httpErr,[],kind+' missing files');
   await page.close();
  }
  console.log('18-type gallery passes desktop/mobile image loading, GIF/PNG switching and screenshots');
 }finally{await browser.close();await new Promise(ok=>server.close(ok));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
