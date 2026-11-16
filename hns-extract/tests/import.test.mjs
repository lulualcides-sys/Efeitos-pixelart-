import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseArgs,CATEGORIES,importCapture} from '../tools/import.mjs';

test('CLI allows only known categories and safe slugs',()=>{
 assert.deepEqual(CATEGORIES,['projectiles','impacts','contact','area','ui','bosses']);
 const argv=['--input','/temporary/video.mp4','--category','impacts','--slug','hit-01','--start','0.2','--duration','1.5','--fps','12'];
 const args=parseArgs(argv);
 assert.equal(args.category,'impacts');assert.equal(args.start,.2);assert.equal(args.fps,12);
 assert.throws(()=>parseArgs(['--input','a.mp4','--category','impacts','--slug','../evil']),/Slug invalido/);
 assert.throws(()=>parseArgs(['--input','a.mp4','--category','other','--slug','valid']),/Categoria invalida/);
 assert.throws(()=>parseArgs(['--input','a.mp4','--category','impacts','--slug','valid','--duration','20']),/Limites/);
 assert.throws(()=>parseArgs(['--input','a.mp4','--category','impacts','--slug','valid','--fps','5.5']),/Limites/);
 assert.throws(()=>parseArgs(['--input','a.mp4','--category','impacts','--slug','valid','--fps','12;rm']),/Numero invalido/);
 assert.throws(()=>parseArgs(['--input','a.mp4','--category','impacts','--slug','valid','--crop','0;rm']),/Crop/);
 assert.equal(parseArgs(['--help']).help,true);
});
test('video import makes local GIF, PNG frames, catalog and does not overwrite',t=>{
 const ff=spawnSync('ffmpeg',['-version'],{encoding:'utf8'});
 if(ff.status!==0){t.skip('ffmpeg not installed; CI requires ffmpeg');return;}
 const dir=mkdtempSync(join(tmpdir(),'hns-extract-'));
 try{
  const video=join(dir,'synthetic.mp4'),work=join(dir,'workspace');
  const make=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','testsrc2=size=64x64:rate=12:duration=1','-c:v','mpeg4','-q:v','5',video],{encoding:'utf8'});
  assert.equal(make.status,0,make.stderr);
  const args=parseArgs(['--input',video,'--category','impacts','--slug','synthetic-hit','--fps','12','--duration','1','--workspace',work]);
  const entry=importCapture(args);
  assert.equal(entry.id,'impacts/synthetic-hit');
  assert.equal(entry.rightsStatus,'private-review');
  assert.equal(entry.copyrightClearance,false);
  assert.ok(entry.frameCount>=8);
  assert.ok(entry.sourceSHA256?.length===64);
  const folder=join(work,'impacts','synthetic-hit');
  assert.ok(existsSync(join(folder,'frames','frame-0000.png')));
  const gif=readFileSync(join(folder,'preview.gif'));
  assert.equal(gif.toString('ascii',0,6),'GIF89a');
  const poster=readFileSync(join(folder,'poster.png'));
  const contact=readFileSync(join(folder,'contact-sheet.png'));
  assert.equal(poster.subarray(1,4).toString(),'PNG');
  assert.equal(contact.subarray(1,4).toString(),'PNG');
  const catalog=JSON.parse(readFileSync(join(work,'catalog.json'),'utf8'));
  assert.equal(catalog.items.length,1);
  assert.equal(catalog.items[0].id,'impacts/synthetic-hit');
  assert.throws(()=>importCapture(args),/Ja existe/);
  assert.equal(JSON.parse(readFileSync(join(work,'catalog.json'),'utf8')).items.length,1);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('public skeleton declares empty assets and ignores local workspace',()=>{
 const manifest=JSON.parse(readFileSync('hns-extract/manifest.json','utf8'));
 assert.deepEqual(manifest.items,[]);
 assert.equal(manifest.defaultPublicationPermission,false);
 const ignore=readFileSync('hns-extract/.gitignore','utf8');
 assert.match(ignore,/workspace\//);
 assert.match(ignore,/\*\.gba/);
 const doc=readFileSync('hns-extract/README.md','utf8');
 assert.match(doc,/NÃO|não|nao/i);
 assert.match(doc,/não lê\/descompacta ROMs/i);
 const html=readFileSync('hns-extract/gallery.html','utf8');
 assert.match(html,/safePath/);
 assert.match(html,/workspace\/catalog\.json/);
});
