import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
mkdirSync('public/assets',{recursive:true});
const photos={'nunzia.jpeg':'nunzia','32.png':'carbone-graphic','94.png':'iperboat-graphic','11.png':'letizia','102.png':'postural','riviera.png':'riviera-feed','iperboat.png':'iperboat-feed','carne.png':'serra-feed','gorilla.png':'gorillas-feed','macellaio.png':'carbone-feed'};
for(const [file,name] of Object.entries(photos)) await sharp('Materiali/'+file).resize({width:1400,withoutEnlargement:true}).webp({quality:85}).toFile('public/assets/'+name+'.webp');
const videos=readdirSync('Materiali').filter(f=>/\.(mp4|mov)$/i.test(f));
const manifest=[];
for(let i=0;i<videos.length;i++){
 const file=videos[i],id='video-'+i,poster='public/assets/'+id+'.webp';
 execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-ss','2','-i','Materiali/'+file,'-frames:v','1','-vf','scale=480:-2','-y',poster]);
 manifest.push({file,id});
}
writeFileSync('src/media-manifest.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest));
