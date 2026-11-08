import {mkdirSync,writeFileSync} from 'node:fs';
import {createMoveSheetsV2} from '../src/build-move-six-v2.mjs';
const out='effects/moves/six-v2';mkdirSync(out,{recursive:true});
for(const s of createMoveSheetsV2()){writeFileSync(`${out}/${s.id}.png`,s.bytes);console.log(s.id,s.bytes.length,s.counts.map(q=>q.reduce((a,b)=>a+b,0)).join(','));}
