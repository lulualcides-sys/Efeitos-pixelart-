import {mkdirSync,writeFileSync} from 'node:fs';
import {createMoveSheetsV3} from '../src/build-move-six-v3.mjs';
const dir='effects/moves/six-v3';mkdirSync(dir,{recursive:true});
for(const s of createMoveSheetsV3()){writeFileSync(`${dir}/${s.id}.png`,s.bytes);console.log(s.id,s.bytes.length)}
