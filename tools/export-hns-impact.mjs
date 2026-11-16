// Rebuild transparent original PNG sprite sheets and animated GIF previews. Node 20+.
import {mkdirSync,writeFileSync} from 'node:fs';
import {IMPACT_SPECS,createImpactArtifacts} from '../src/hns-impact-studies.mjs';
const dir='effects/hns-impact-studies';
mkdirSync(dir,{recursive:true});
for(const spec of IMPACT_SPECS){
 const files=createImpactArtifacts(spec);
 writeFileSync(`${dir}/${spec.id}.png`,files.png);
 writeFileSync(`${dir}/${spec.id}.gif`,files.gif);
 console.log(spec.id,files.png.length,files.gif.length);
}
