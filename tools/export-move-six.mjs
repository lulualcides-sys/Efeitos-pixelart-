import {mkdirSync,writeFileSync} from 'node:fs';
import {createMoveSheets} from '../src/build-move-six.mjs';
const dir='effects/moves/six-v1';mkdirSync(dir,{recursive:true});
for(const x of createMoveSheets()){writeFileSync(dir+'/'+x.id+'.png',x.bytes);console.log(x.id,x.bytes.length,x.counts.map(y=>y.reduce((a,b)=>a+b,0)).join(','));}
