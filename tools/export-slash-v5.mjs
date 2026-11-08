import {mkdirSync,writeFileSync} from 'node:fs';
import {createV5} from '../src/build-slash-v5.mjs';
const path='effects/slash/arc/sweep-v5';
mkdirSync(path,{recursive:true});
for(const item of createV5()){writeFileSync(path+'/'+item.id+'.png',item.bytes);console.log(item.id,item.counts.join(','));}
