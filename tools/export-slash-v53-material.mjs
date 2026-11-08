import {mkdirSync,writeFileSync} from 'node:fs';
import {createV53MaterialMotifs} from '../src/build-slash-v53-material.mjs';
const path='effects/slash/arc/material-v5-3';
mkdirSync(path,{recursive:true});
for(const item of createV53MaterialMotifs()){
 writeFileSync(path+'/'+item.id+'.png',item.bytes);
 console.log(item.id,item.bytes.length,item.counts.join(','));
}
