import {mkdirSync,writeFileSync} from 'node:fs';
import {buildV5Layers} from '../src/build-slash-layers.mjs';
const destination='effects/slash/arc/layers-v5';
mkdirSync(destination,{recursive:true});
for(const sheet of buildV5Layers()){
 writeFileSync(destination+'/'+sheet.id+'.png',sheet.bytes);
 console.log(sheet.id,sheet.counts);
}
