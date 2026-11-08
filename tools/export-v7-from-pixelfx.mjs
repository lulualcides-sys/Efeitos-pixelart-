// New V7 source pack: renders artist-directed MIT PixelFX effects to real sprite atlases.
// Standalone regeneration; does NOT read or modify the rejected V1–V6 code.
// No CSS / Phaser.Graphics / runtime procedural effect generation.
import {execFileSync} from 'node:child_process';
import {existsSync,mkdirSync,readFileSync,writeFileSync,copyFileSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {mkdtempSync} from 'node:fs';
import {createHash} from 'node:crypto';

export const SOURCE_REV='a84159688af3ca37a4be05a0d422b94451b2e24e';
export const SOURCE_URL='https://github.com/patch-gg/pixelfx.git';
export const SOURCE_LICENSE='MIT';
export const EFFECTS=[
 {id:'fireball',source:'fire/fireball',fps:18,role:'Flame Burst: burning projectile'},
 {id:'fire-hit',source:'explosions/small-explosion',fps:12,role:'Flame Burst: impact flames'},
 {id:'frost-wind',source:'ice/frost-breath',fps:18,role:'Frost Breath: continuous frozen air'},
 {id:'ice-break',source:'ice/ice-shatter',fps:14,role:'Frost Breath: crystalline contact'},
 {id:'wind-cut',source:'melee/sword-slash',fps:22,role:'Air Slash and Razor Shell: bright curved edge'},
 {id:'water-hit',source:'water/splash',fps:14,role:'Razor Shell: splash and droplets'},
 {id:'punch-hit',source:'impacts/blunt-hit',fps:22,role:'Shadow Punch and Meteor Mash: physical contact'},
 {id:'shadow-wisp',source:'shadow/shadow-tendrils',fps:14,role:'Shadow Punch: supernatural residue'},
 {id:'steel-spark',source:'impacts/crit-hit',fps:22,role:'Meteor Mash: metallic critical hit'}
];

const dst=resolve('assets/v7/atlas');mkdirSync(dst,{recursive:true});
const tmp=mkdtempSync(join(tmpdir(),'pixelfx-v7-'));
try{
 execFileSync('git',['clone','--no-checkout','--filter=blob:none','--quiet',SOURCE_URL,tmp],{stdio:'inherit',timeout:150000});
 execFileSync('git',['checkout','--quiet',SOURCE_REV],{cwd:tmp,stdio:'inherit',timeout:60000});
 const actual=execFileSync('git',['rev-parse','HEAD'],{cwd:tmp,encoding:'utf8'}).trim();
 if(actual!==SOURCE_REV)throw new Error('Upstream not pinned: '+actual);
 const list=[];
 for(const effect of EFFECTS){
  console.log('V7 render source',effect.id,effect.source);
  execFileSync('node',['tools/render.mjs',effect.source,'--sheet','--fps',String(effect.fps),
    '--no-actor','--bg','none','--out',join(tmp,'_renders')],{cwd:tmp,stdio:'inherit',timeout:150000});
  const name=effect.source.split('/').at(-1),folder=join(tmp,'_renders',effect.source);
  const f=join(folder,name+'.png'),j=join(folder,name+'.json');
  if(!existsSync(f)||!existsSync(j))throw new Error(effect.id+' missing exported atlas');
  const png=readFileSync(f),json=JSON.parse(readFileSync(j,'utf8'));
  if(png.length<500||png.length>15e6||png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'
    ||!Array.isArray(json.frames)||json.frames.length<6||json.frames.length>250)
    throw new Error(effect.id+' invalid rendered sprite sheet');
  copyFileSync(f,join(dst,effect.id+'.png'));
  copyFileSync(j,join(dst,effect.id+'.json'));
  list.push({...effect,frames:json.frames.length,frameSize:json.meta.pixelfx.frameSize,
    bytes:png.length,sha256:createHash('sha256').update(png).digest('hex'),
    png:'atlas/'+effect.id+'.png',json:'atlas/'+effect.id+'.json'});
 }
 const manifest={
  version:'seven-v7-cleanroom',status:'visual-review-only',approved:false,
  gameIntegrationEnabled:false,derivedFromRejectedVersions:false,
  preservesApprovedSlashV54:true,
  source:SOURCE_URL,sourceCommit:SOURCE_REV,sourceLicense:SOURCE_LICENSE,
  licensedArtwork:'MIT PixelFX, adapted from source renderer with original material palettes and compositions',
  heroSprites:['relics/shell.png','relics/ghost.png','relics/steel.png'],
  entries:list
 };
 mkdirSync('assets/v7',{recursive:true});
 writeFileSync('assets/v7/manifest.json',JSON.stringify(manifest,null,2)+'\n');
 console.log('V7 sprite atlases exported and validated',list.map(x=>[x.id,x.frames,x.bytes]));
}finally{rmSync(tmp,{recursive:true,force:true})}
