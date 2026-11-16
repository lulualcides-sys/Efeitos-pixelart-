// Rebuild 14 original GIF previews and indexed PNG sheets, without touching earlier four effects.
import {mkdirSync,writeFileSync} from 'node:fs';
import {NEW_TYPE_IMPACTS,buildTypeImpact} from '../src/type-impact-pack.mjs';
const dir='effects/type-impact-pack';
mkdirSync(dir,{recursive:true});
for(const spec of NEW_TYPE_IMPACTS){
 const {png,gif}=buildTypeImpact(spec);
 writeFileSync(dir+'/'+spec.id+'.png',png);
 writeFileSync(dir+'/'+spec.id+'.gif',gif);
 console.log(spec.type+' | '+spec.id+' | PNG '+png.length+' bytes | GIF '+gif.length+' bytes');
}
