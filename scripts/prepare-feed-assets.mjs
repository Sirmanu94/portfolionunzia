import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public/assets', { recursive: true });
const feeds = {
  'riviera.png': 'riviera-feed',
  'iperboat.png': 'iperboat-feed',
  'carne.png': 'serra-feed',
  'gorilla.png': 'gorillas-feed',
  'macellaio.png': 'carbone-feed',
  'armas.png': 'arma-feed',
};
for (const [source, name] of Object.entries(feeds)) {
  await sharp('Materiali/' + source).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86 }).toFile('public/assets/' + name + '.webp');
  console.log(`${source} → ${name}.webp`);
}
