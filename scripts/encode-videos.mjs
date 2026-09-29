import ffmpeg from 'ffmpeg-static';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const selected=[0,2,7,8,9,11,12,13];
for(const v of JSON.parse(readFileSync('src/media-manifest.json','utf8')).filter(v=>selected.includes(Number(v.id.split('-')[1])))){
 const out='public/assets/'+v.id+'.mp4';
 if(existsSync(out))continue;
 execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-i','Materiali/'+v.file,'-vf','scale=720:-2','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart','-y',out]);
 console.log('Encoded '+v.file);
}

const custom=[{file:'risposta.mov',id:'iperboat-risposta'}];
for(const v of custom){
 const source='Materiali/'+v.file,out='public/assets/'+v.id+'.mp4',poster='public/assets/'+v.id+'.webp';
 if(!existsSync(out)){
  execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-i',source,'-vf','scale=720:-2','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart','-y',out]);
  console.log('Encoded '+v.file);
 }
 if(!existsSync(poster)) execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-ss','2','-i',source,'-frames:v','1','-vf','scale=720:-2','-y',poster]);
}
