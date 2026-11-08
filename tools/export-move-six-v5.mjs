import {mkdirSync,writeFileSync} from 'node:fs';
import {createMoveSheetsV5} from '../src/build-move-six-v5.mjs';
const dir='effects/moves/six-v5';mkdirSync(dir,{recursive:true});
for(const s of createMoveSheetsV5()){writeFileSync(`${dir}/${s.id}.png`,s.bytes);console.log(s.id,s.bytes.length)}
