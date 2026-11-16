#!/usr/bin/env node
// HnS-extract: LOCAL capture/PNG-frame organizer. Never reads ROM or BPS files.
// No external Node packages; ffmpeg is required for encoding frame previews.
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,readdirSync,copyFileSync,readFileSync,writeFileSync,renameSync,rmSync,statSync} from 'node:fs';
import {basename,extname,join,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';

export const CATEGORIES=Object.freeze(['projectiles','impacts','contact','area','ui','bosses']);
const packageRoot=resolve(fileURLToPath(new URL('..',import.meta.url)));
const MAX_FRAMES=180;
const help=`Importador local de capturas e quadros PNG (nao extrai assets internos da ROM).
Uso:
  node hns-extract/tools/import.mjs --input ./gravacao.mp4 --category impacts --slug onda-de-choque --start 3.2 --duration 1.5 --fps 12
  node hns-extract/tools/import.mjs --input ./meus-frames --category bosses --slug chefe-esquiva --fps 12
Opcoes: --name "Descricao" --source "arquivo do usuario" --crop 96:96:100:40 (somente video)
         --workspace ./diretorio-local (opcional; padrao hns-extract/workspace)
Requer ffmpeg instalado no seu computador. Por padrao, saida privada e ignorada pelo Git.
`;

function die(message){throw new Error(message);}
function run(cmd,args){
 const p=spawnSync(cmd,args,{encoding:'utf8',maxBuffer:1024*1024*8});
 if(p.error)die(cmd+': '+p.error.message);
 if(p.status!==0)die(cmd+' falhou: '+(p.stderr||p.stdout||'sem detalhes').trim().slice(-1600));
}
export function parseArgs(argv){
 if(argv.includes('--help')||argv.includes('-h'))return {help:true};
 const allowed=new Set(['input','category','slug','name','source','start','duration','fps','crop','workspace']);
 const args={};
 for(let i=0;i<argv.length;i+=2){
  const flag=argv[i],name=flag?.startsWith('--')?flag.slice(2):null;
  if(!name||!allowed.has(name)||!argv[i+1]||argv[i+1].startsWith('--'))die('Argumento invalido: '+String(flag)+'\n'+help);
  if(Object.hasOwn(args,name))die('Parametro duplicado: '+name);
  args[name]=argv[i+1];
 }
 for(const req of ['input','category','slug'])if(!args[req])die('Obrigatorio: --'+req);
 if(!CATEGORIES.includes(args.category))die('Categoria invalida: '+args.category);
 if(!/^[a-z0-9][a-z0-9-]{1,59}$/.test(args.slug))die('Slug invalido; use letras minusculas, numeros e hifens (2 a 60 caracteres).');
 if(args.name&&args.name.length>120)die('Nome longo demais.');
 if(args.source&&args.source.length>200)die('Descricao de origem longa demais.');
 for(const field of ['start','duration','fps']){
  if(args[field]!==undefined&&!/^\d+(?:\.\d+)?$/.test(args[field]))die('Numero invalido: '+field);
 }
 const start=Number(args.start??0), duration=Number(args.duration??1.5),fps=Number(args.fps??12);
 if(start>36000||duration<=0||duration>6||fps<4||fps>30||!Number.isInteger(fps))die('Limites: start <= 36000, duracao 0-6s, fps inteiro de 4 a 30.');
 if(args.crop&&!/^\d{1,4}:\d{1,4}:\d{1,4}:\d{1,4}$/.test(args.crop))die('Crop: largura:altura:x:y, todos inteiros.');
 return {...args,start,duration,fps,workspace:resolve(args.workspace??join(packageRoot,'workspace')),input:resolve(args.input)};
}

function fileHash(path){return createHash('sha256').update(readFileSync(path)).digest('hex');}
function sortedPngs(dir){return readdirSync(dir).filter(f=>/^.*\.png$/i.test(f)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));}
export function importCapture(raw){
 const args=typeof raw==='object'&&!Array.isArray(raw)?raw:parseArgs(raw);
 if(args.help){process.stdout.write(help);return null;}
 if(!existsSync(args.input))die('Arquivo/pasta de entrada inexistente: '+args.input);
 if(!existsSync(args.workspace))mkdirSync(args.workspace,{recursive:true});
 const st=statSync(args.input),ext=extname(args.input).toLowerCase();
 if(!st.isDirectory()&&!['.mp4','.mkv','.mov','.webm','.gif'].includes(ext))die('Entrada deve ser video/GIF ou pasta com quadros PNG, nunca ROM/BPS.');
 if(st.isDirectory()&&(args.crop||args.start!==0))die('Pasta de PNGs nao aceita --crop ou --start: prepare os frames antes.');
 const dir=join(args.workspace,args.category,args.slug);
 if(existsSync(dir))die('Ja existe: '+dir+' (nao sobrescrever arquivos).');
 const tmp=join(args.workspace,'.tmp-'+args.slug+'-'+process.pid);
 if(existsSync(tmp))die('Pasta temporaria ja existe.');
 mkdirSync(join(tmp,'frames'),{recursive:true});
 const dest=join(tmp,'frames');
 try{
  let frameCount=0;
  if(st.isDirectory()){
   const pngs=sortedPngs(args.input);
   if(pngs.length<2||pngs.length>MAX_FRAMES)die('Pasta deve conter de 2 a '+MAX_FRAMES+' quadros .png.');
   for(const name of pngs){
    if(!statSync(join(args.input,name)).isFile())die('Quadro invalido: '+name);
    copyFileSync(join(args.input,name),join(dest,'frame-'+String(frameCount++).padStart(4,'0')+'.png'));
   }
  } else {
   if(args.crop){const [w,h]=args.crop.split(':').map(Number);if(w<1||h<1||w>4096||h>4096)die('Dimensoes de recorte invalidas.');}
   const vf=(args.crop?'crop='+args.crop+',':'')+'fps='+args.fps;
   const cmd=['-hide_banner','-loglevel','error','-y'];
   if(args.start>0)cmd.push('-ss',String(args.start));
   cmd.push('-i',args.input,'-t',String(args.duration),'-vf',vf,'-frames:v',String(Math.min(MAX_FRAMES,Math.ceil(args.duration*args.fps))),'-start_number','0',join(dest,'frame-%04d.png'));
   run('ffmpeg',cmd);
   frameCount=sortedPngs(dest).length;
   if(frameCount<2)die('Nenhum trecho animado util encontrado (menos de 2 quadros).');
  }
  // Use the same source frames for preview, contact sheet and provenance manifest.
  const source=['-hide_banner','-loglevel','error','-y','-framerate',String(args.fps),'-start_number','0','-i',join(dest,'frame-%04d.png')];
  run('ffmpeg',[...source,'-filter_complex','[0:v]split[a][b];[a]palettegen[p];[b][p]paletteuse=dither=none','-loop','0',join(tmp,'preview.gif')]);
  run('ffmpeg',[...source,'-vf','tile=4x4','-frames:v','1',join(tmp,'contact-sheet.png')]);
  copyFileSync(join(dest,'frame-0000.png'),join(tmp,'poster.png'));
  const entry={
   id:args.category+'/'+args.slug,
   category:args.category,slug:args.slug,name:args.name||args.slug.replaceAll('-',' '),
   source:args.source||basename(args.input),sourceKind:st.isDirectory()?'frames':'capture',
   sourceSHA256:st.isDirectory()?null:fileHash(args.input),
   rightsStatus:'private-review',copyrightClearance:false,
   fps:args.fps,frameCount,durationSeconds:Number((frameCount/args.fps).toFixed(3)),
   preview:args.category+'/'+args.slug+'/preview.gif',
   poster:args.category+'/'+args.slug+'/poster.png',
   contactSheet:args.category+'/'+args.slug+'/contact-sheet.png',
   extractedInternalRomAsset:false,backgroundMayBePresent:true
  };
  mkdirSync(join(args.workspace,args.category),{recursive:true});
  // Commit the complete folder before exposing it in the catalog.
  renameSync(tmp,dir);
  const catalogPath=join(args.workspace,'catalog.json');
  let catalog={schemaVersion:1,sourceProject:'HnS Legends — local private footage review',items:[]};
  if(existsSync(catalogPath))catalog=JSON.parse(readFileSync(catalogPath,'utf8'));
  if(!Array.isArray(catalog.items)||catalog.items.some(x=>x.id===entry.id))die('Catalogo inconsistente/duplicado');
  catalog.items.push(entry);catalog.items.sort((a,b)=>a.id.localeCompare(b.id));
  writeFileSync(catalogPath,JSON.stringify(catalog,null,2)+'\n');
  process.stdout.write('Importado: '+entry.id+' | '+frameCount+' quadros | '+relative(process.cwd(),dir)+'\n');
  return entry;
 }catch(err){
  rmSync(tmp,{recursive:true,force:true});
  throw err;
 }
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{importCapture(process.argv.slice(2));}catch(err){console.error('ERRO: '+err.message);process.exitCode=1;}
}
