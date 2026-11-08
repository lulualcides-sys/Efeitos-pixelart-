import {mkdirSync,writeFileSync} from 'node:fs';
import {createMoveSheetsV4} from '../src/build-move-six-v4.mjs';
const dir='effects/moves/six-v4';mkdirSync(dir,{recursive:true});
for(const x of createMoveSheetsV4()){writeFileSync(`${dir}/${x.id}.png`,x.bytes);console.log(x.id,x.bytes.length)}
