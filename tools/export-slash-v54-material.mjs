import {mkdirSync,writeFileSync} from 'node:fs';
import {createV54MaterialMotifs} from '../src/build-slash-v54-material.mjs';
const target='effects/slash/arc/material-v5-4';mkdirSync(target,{recursive:true});
for(const s of createV54MaterialMotifs()){writeFileSync(target+'/'+s.id+'.png',s.bytes);console.log(s.id,s.bytes.length,s.counts.join(','));}
