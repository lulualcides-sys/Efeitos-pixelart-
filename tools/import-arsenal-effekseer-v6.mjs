// Import official Effekseer CC0 sample textures for an ISOLATED visual-effects lab.
// The Arsenal lists Effekseer as an approved research tool; its source is NOT installed.
// These are CC0 sample textures from effekseer/Effekseer/docs/readme_sample.txt.
// Lock to an exact upstream GitHub commit, never silently change provenance.
// Node >= 22, no npm deps.
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

export const UPSTREAM='b5700082b49bc5f919610880dafddc90211a9a4e';
export const PREFIX='Release/Sample/01_NextSoft01/Texture';
export const ASSETS=Object.freeze([
 'Flame01.png','Burst01.png','Crystal001.png','Icicle001.png',
 'SwordLine01.png','Foam001.png','Fog001.png','Spark001.png',
 'Shock_wave004.png','SnowCrystals_S.png','Particle02.png'
]);
const ROOT='assets/vendor/effekseer-v6';
const LOCATIONS=ASSETS.map(name=>({
 name,url:'https://media.githubusercontent.com/media/effekseer/Effekseer/'+UPSTREAM+'/'+PREFIX+'/'+name
}));
const SIG=Buffer.from([137,80,78,71,13,10,26,10]);
async function get(entry){
 const response=await fetch(entry.url,{headers:{'User-Agent':'Efeitos-Pixelart-Arsenal-CC0-Importer/1.0'}});
 if(!response.ok)throw new Error('Download failed: '+entry.name+' HTTP '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(bytes.length<200||bytes.length>1024*1024*6||!bytes.subarray(0,8).equals(SIG))
  throw new Error('Not actual PNG (maybe LFS pointer): '+entry.name+' bytes='+bytes.length);
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 if(width<8||height<8||width>4096||height>4096)
  throw new Error('Unsafe PNG dimensions: '+entry.name+' '+width+'x'+height);
 return {name:entry.name,width,height,size:bytes.length,
  sha256:createHash('sha256').update(bytes).digest('hex'),bytes,source:entry.url};
}
mkdirSync(ROOT,{recursive:true});
const selected=await Promise.all(LOCATIONS.map(get));
for(const asset of selected){
 writeFileSync(join(ROOT,asset.name),asset.bytes);
 process.stdout.write('Verified CC0 texture '+asset.name+' '+asset.width+'x'+asset.height+' '+asset.size+'B\n');
}
const manifest={version:'effekseer-cc0-v6',source:'effekseer/Effekseer',
 upstreamCommit:UPSTREAM,sourceLicense:'CC0',
 licenseEvidence:'https://github.com/effekseer/Effekseer/blob/'+UPSTREAM+'/docs/readme_sample.txt',
 sourceDirectory:PREFIX,importedFor:'isolated Pokemon move-effects visual research',
 approved:false,gameIntegrationEnabled:false,
 files:selected.map(({name,width,height,size,sha256,source})=>({name,width,height,size,sha256,source}))};
writeFileSync(join(ROOT,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
writeFileSync(join(ROOT,'SOURCES.md'),[
 '# Effekseer CC0 Texture Resources — V6 experimental',
 '',
 'These files are original upstream sample textures and are imported **without** claiming they were authored by Efeitos Pixelart.',
 '',
 'Source: https://github.com/effekseer/Effekseer/tree/'+UPSTREAM+'/'+PREFIX,
 'Licensing confirmation: https://github.com/effekseer/Effekseer/blob/'+UPSTREAM+'/docs/readme_sample.txt (all sample effects in directory CC0).',
 'Upstream pinned revision: '+UPSTREAM,
 '',
 'These PNGs are a reference texture set for the isolated Phaser/WebGL V6 prototype; they are not the final complete Pokémon moves.',
 'No code from the desktop Effekseer editor is bundled and no source effect files are represented as rendered output.',
 'Credit appreciated: Effekseer and the sample artists. The Pokémon Arena 2D client is a **style reference only**, not the source of these pixels.',
 'Do not merge into main or replace approved V5.4 without explicit visual approval.',
 ''
].join('\n'));
console.log('Imported and verified '+selected.length+' CC0 material textures');
