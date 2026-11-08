import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const url='https://pokemon-vfx-pixelart-v3-revisao.vercel.app/';
const binary=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath:binary,args:['--no-sandbox','--disable-dev-shm-usage','--ignore-gpu-blocklist']});
await mkdir('test-evidence/v3',{recursive:true});
try {
 for(const vp of [{width:390,height:844},{width:1280,height:720}]){
  const page=await browser.newPage({viewport:vp});const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)missing.push([r.status(),r.url()])});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction('window.__torre2FxPreviewV3?.loaded===true',null,{timeout:20000});
  assert.equal(await page.locator('nav button').count(),6);
  assert.equal(await page.evaluate('window.__torre2FxPreviewV3.atlas.naturalHeight'),2304);
  for(let i=0;i<6;i++){
   await page.locator('nav button').nth(i).click();
   assert.equal(await page.evaluate('window.__torre2FxPreviewV3.state.index'),i);
   await page.locator('#impact').click();
   assert.equal(await page.evaluate('window.__torre2FxPreviewV3.state.frame'),10);
   await page.screenshot({path:'test-evidence/v3/'+vp.width+'-'+i+'.png'});
   await page.locator('#step').click();
   assert.equal(await page.evaluate('window.__torre2FxPreviewV3.state.frame'),11);
   await page.locator('#again').click();
   assert.equal(await page.evaluate('window.__torre2FxPreviewV3.state.paused'),false);
  }
  await page.waitForTimeout(350);
  assert.ok(await page.evaluate('window.__torre2FxPreviewV3.state.shown')>10);
  assert.deepEqual(errors,[]);
  assert.deepEqual(missing,[]);
  console.log('PASS SIX V3 FX',vp.width,'all six attacks, image frames, pause, replay, contact, next frame');
  await page.close();
 }
}finally{await browser.close();}
