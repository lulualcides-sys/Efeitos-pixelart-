// V8: actual recoloured, separately rendered MIT PixelFX atlases.
// These are new PNG/JSON files, NOT a Phaser/CSS tint applied at runtime.
// Source pinned to exact V7-approved research upstream commit; V7 bytes untouched.
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync,copyFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
const REV='a84159688af3ca37a4be05a0d422b94451b2e24e';
const upstream='https://github.com/patch-gg/pixelfx.git';
const dest=resolve('assets/v8/atlases');
const source=mkdtempSync(join(tmpdir(),'v8-pixelfx-'));
const entries=[
 {id:'sky-cut',source:'melee/sword-slash',fps:24,
  options:{palette:['#10334a','#1d5474','#2c84a8','#51b7d3','#8ad9e9','#c5f3fb','#ffffff'],
   sparks:['#ffffff','#d5f8ff','#9ceaff','#4ba6c6'],radius:49,seed:2},
  role:'Air Slash: pure icy-white air crescent with no fire/metal sparks'},
 {id:'spectral-hit',source:'impacts/crit-hit',fps:24,
  options:{palette:['#18112b','#332052','#533576','#8351a9','#ad7bce','#d5b1ee','#ecd9ff','#ffffff'],seed:9},
  role:'Shadow Punch: mystical amethyst critical contact, independent from steel'},
 {id:'meteor-hit',source:'impacts/crit-hit',fps:24,
  options:{palette:['#102c43','#245776','#347f9e','#5aadc4','#91cfdf','#c2e7f1','#e7f9ff','#ffffff'],seed:4},
  role:'Meteor Mash: blue-silver starburst, no orange/fire material'}
];
try{
 execFileSync('git',['clone','--no-checkout','--filter=blob:none','--quiet',upstream,source],
  {stdio:'inherit',timeout:150000});
 execFileSync('git',['checkout','--quiet',REV],{cwd:source,stdio:'inherit',timeout:60000});
 if(execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim()!==REV)
  throw new Error('Upstream revision changed');
 mkdirSync(dest,{recursive:true});
 const manifest={version:'v8-authentic-materials',approved:false,gameIntegrationEnabled:false,
  source:upstream,sourceCommit:REV,license:'MIT',entries:[]};
 for(const spec of entries){
  const r=join(source,'_rendered');
  execFileSync('node',['tools/render.mjs',spec.source,'--sheet','--no-actor','--bg','none',
    '--fps',String(spec.fps),'--opts',JSON.stringify(spec.options),'--out',r],
    {cwd:source,stdio:'inherit',timeout:180000});
  const basename=spec.source.split('/').at(-1),folder=join(r,spec.source);
  const png=readFileSync(join(folder,basename+'.png')),json=JSON.parse(readFileSync(join(folder,basename+'.json'),'utf8'));
  if(png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||
   !Array.isArray(json.frames)||json.frames.length<12)throw new Error(spec.id+' invalid PNG or frames');
  writeFileSync(join(dest,spec.id+'.png'),png);
  json.meta.image=spec.id+'.png';
  writeFileSync(join(dest,spec.id+'.json'),JSON.stringify(json,null,1)+'\n');
  manifest.entries.push({id:spec.id,source:spec.source,frameName:basename,
   options:spec.options,role:spec.role,frames:json.frames.length,
   frameSize:json.meta.pixelfx.frameSize,bytes:png.length,
   sha256:createHash('sha256').update(png).digest('hex')});
  console.log('Verified material-tuned atlas',spec.id,png.length,json.frames.length);
 }
 writeFileSync(join(dest,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
}finally{rmSync(source,{recursive:true,force:true})}
