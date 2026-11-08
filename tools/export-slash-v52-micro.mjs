import {mkdirSync,writeFileSync} from 'node:fs';
import {createV52Microglints} from '../src/build-slash-v52-micro.mjs';
const out='effects/slash/arc/microglints-v5-2';
mkdirSync(out,{recursive:true});
for(const x of createV52Microglints()){
 writeFileSync(out+'/'+x.id+'.png',x.bytes);
 console.log(x.id,x.bytes.length,x.counts.join(','));
}
