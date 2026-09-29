import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = process.env.PORTFOLIO_BASE_URL ?? 'http://127.0.0.1:4173/';
const assert = (condition, message) => { if (!condition) throw Error(message); };
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
mkdirSync('verification', { recursive: true });

for (const [width, height] of [[375, 812], [390, 844], [430, 932], [768, 1024], [1024, 900], [1440, 960]]) {
  await page.setViewportSize({ width, height });
  await page.goto(base);
  await page.locator('.more-work').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('.creative-wall img')].every(image => image.complete && image.naturalWidth > 0));
  for (const card of await page.locator('.perspective-card').all()) {
    await card.scrollIntoViewIfNeeded();
    await card.locator('img').evaluate(image => image.decode());
  }
  await page.locator('.perspectives-track').evaluate(element => { element.scrollLeft = 0; });
  const state = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    wallTiles: document.querySelectorAll('.creative-wall .wall-tile').length,
    cards: document.querySelectorAll('.perspective-card').length,
    carouselScrollable: document.querySelector('.perspectives-track').scrollWidth > document.querySelector('.perspectives-track').clientWidth,
  }));
  assert(state.documentWidth === state.viewportWidth, `Overflow orizzontale a ${width}px`);
  assert(state.wallTiles === 2, `Numero collage errato a ${width}px`);
  assert(state.cards === 5 && state.carouselScrollable, `Carosello non valido a ${width}px`);
  if (width === 390 || width === 1440) await page.screenshot({ path: `verification/more-${width}.png` });
}

await page.setViewportSize({ width: 1440, height: 960 });
await page.goto(base);
await page.locator('.perspectives-carousel').scrollIntoViewIfNeeded();
const track = page.locator('.perspectives-track');
const next = page.getByRole('button', { name: 'Contenuto successivo' });
const previous = page.getByRole('button', { name: 'Contenuto precedente' });
const start = await track.evaluate(element => element.scrollLeft);
await next.click();
await page.waitForTimeout(500);
assert(await track.evaluate(element => element.scrollLeft) > start, 'Freccia successiva non funzionante');
await previous.click();
await page.waitForTimeout(500);
assert(await track.evaluate(element => element.scrollLeft) < 20, 'Freccia precedente non funzionante');
await track.focus();
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(500);
assert(await track.evaluate(element => element.scrollLeft) > start, 'Navigazione da tastiera non funzionante');

const links = await page.locator('.more-work a[target="_blank"]').evaluateAll(elements => elements.map(element => ({ href: element.getAttribute('href'), rel: element.getAttribute('rel') })));
assert(links.every(link => link.rel === 'noopener noreferrer'), 'Rel di sicurezza mancante');
assert(links.some(link => link.href?.includes('gorillasburger_napoli')), 'Link Gorillas mancante');
assert(links.some(link => link.href?.includes('serra_carni')), 'Link Serra mancante');
assert(links.some(link => link.href?.includes('armacontact')), 'Link Arma Contact mancante');
assert(await page.locator('.perspective-card').nth(2).locator('a').count() === 0, 'Postural Bed non deve avere un link inventato');
assert(errors.length === 0, `Errori console: ${errors.join(' | ')}`);

console.log('More Perspectives verificata a 375, 390, 430, 768, 1024 e 1440 px.');
await browser.close();
