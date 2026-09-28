import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('verification', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = process.env.PORTFOLIO_BASE_URL ?? 'http://127.0.0.1:5173/';
const assert = (test, message) => { if (!test) throw Error(message); };

await page.goto(base);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: 'verification/desktop.png' });
await page.locator('#education').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'verification/education.png' });
await page.locator('#work').scrollIntoViewIfNeeded();
await page.getByRole('navigation', { name: 'Progetti' }).getByRole('link', { name: /Carbone Meat House/ }).hover();
await page.waitForFunction(() => document.querySelector('.preview-label')?.textContent?.includes('Carbone Meat House'));
await page.waitForTimeout(300);
await page.screenshot({ path: 'verification/work-preview.png' });
await page.locator('.creative-wall').scrollIntoViewIfNeeded();
await page.waitForFunction(() => [...document.querySelectorAll('.creative-wall img')].every(img => img.complete && img.naturalWidth > 0));
await page.waitForFunction(() => getComputedStyle(document.querySelector('.wall-gorillas')).opacity === '1');
await page.screenshot({ path: 'verification/creative-wall.png' });
await page.locator('#contact').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'verification/desktop-contact.png' });
await page.locator('#workflow .step').nth(3).evaluate(el => el.scrollIntoView({ block: 'center' }));
await page.waitForFunction(() => document.querySelector('.process-progress')?.textContent?.includes('04 / 06'));

const sizes = [];
for (const [width, height] of [[320, 568], [360, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [820, 1180], [1024, 900], [1280, 900], [1440, 960], [1920, 1080]]) {
  await page.setViewportSize({ width, height });
  await page.goto(base);
  sizes.push(await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth })));
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base);
await page.waitForTimeout(300);
await page.screenshot({ path: 'verification/mobile.png' });
await page.locator('#work').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'verification/mobile-index.png' });
assert(await page.locator('.project-index .index-view').first().evaluate(el => el.getBoundingClientRect().x < 100), 'Mobile View project CTA is misplaced');
await page.locator('.creative-wall').scrollIntoViewIfNeeded();
await page.waitForFunction(() => getComputedStyle(document.querySelector('.wall-gorillas')).opacity === '1');
await page.screenshot({ path: 'verification/mobile-wall.png' });
await page.locator('#contact').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'verification/mobile-contact.png' });
await page.getByRole('button', { name: 'Menu +' }).click();
assert(await page.getByRole('navigation', { name: 'Navigazione principale' }).getByRole('link', { name: 'Education' }).isVisible(), 'Education missing from menu');
assert(await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'), 'Menu did not lock scrolling');
await page.keyboard.press('Escape');
assert(await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden'), 'Menu did not unlock scrolling');
await page.getByRole('button', { name: 'Menu +' }).click();
await page.mouse.click(5, 600);
assert(await page.getByRole('button', { name: 'Menu +' }).isVisible(), 'Outside click did not close menu');
await page.getByRole('button', { name: 'Menu +' }).click();
await page.getByRole('navigation', { name: 'Navigazione principale' }).getByRole('link', { name: 'Selected work' }).click();
assert(page.url().endsWith('#work'), 'Mobile navigation failed');

const trigger = page.getByRole('button', { name: 'Riproduci: Ragù di agnello', exact: true });
await trigger.click();
const dialog = page.getByRole('dialog', { name: 'Video: Ragù di agnello' });
await dialog.waitFor();
assert(await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'), 'Modal did not lock scrolling');
assert(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Chiudi video'), 'Modal did not move focus');
await dialog.locator('video').evaluate(video => new Promise((resolve, reject) => {
  if (video.readyState >= 1) return resolve(true);
  video.addEventListener('loadedmetadata', () => resolve(true), { once: true });
  video.addEventListener('error', () => reject(Error('Video failed to load')), { once: true });
}));
const video = await dialog.locator('video').evaluate(video => ({ width: video.videoWidth, height: video.videoHeight, duration: video.duration }));
assert(await dialog.locator('video').evaluate(video => video.paused), 'Video started without explicit play');
await page.keyboard.press('Escape');
await dialog.waitFor({ state: 'hidden' });
assert(await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden'), 'Modal did not unlock scrolling');
assert(await trigger.evaluate(el => el === document.activeElement), 'Modal did not restore focus');
await trigger.click();
await page.getByRole('button', { name: 'Chiudi video' }).click();
await dialog.waitFor({ state: 'hidden' });
await trigger.click();
await page.mouse.click(5, 5);
await dialog.waitFor({ state: 'hidden' });

await page.getByRole('link', { name: 'Esplora il progetto' }).first().click();
await page.getByRole('heading', { name: 'La Riviera di Parthenope', exact: true }).waitFor();
assert(page.url().endsWith('/projects/riviera'), 'Project route failed');
await page.reload();
await page.getByRole('heading', { name: 'La Riviera di Parthenope', exact: true }).waitFor();
await page.getByRole('link', { name: 'Tutti i progetti' }).click();
await page.locator('#work').waitFor();
await page.waitForFunction(() => Math.abs(document.getElementById('work').getBoundingClientRect().top) < 150);
await page.locator('#riviera').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.screenshot({ path: 'verification/mobile-work.png' });
assert(await page.locator('#education h3').count() === 2, 'Education entries missing');
assert(await page.locator('.project-index .index-thumb').count() === 4, 'Selected Work thumbnails missing');
assert(await page.locator('.project-index .index-view').count() === 4, 'Selected Work links missing');

const expected = {
  riviera: 'https://www.instagram.com/larivieradiparthenopenapoli?stkn=MW9tOTZ5amNhN3VyaQ==',
  carbone: 'https://www.instagram.com/carbonemeathouse?stkn=MXg1ZWw3cnEwNGo3Mg==',
  iperboat: 'https://www.instagram.com/iperboat?stkn=eHgydTdrazU0OHJ4',
  arma: 'https://www.instagram.com/armacontact?stkn=MXdnanFybHNzNjFodg==',
};
for (const [id, url] of Object.entries(expected)) {
  const link = page.locator(`#${id} .social-link`);
  assert((await link.getAttribute('href')) === url, `Incorrect ${id} Instagram link`);
  assert(await link.getAttribute('target') === '_blank' && await link.getAttribute('rel') === 'noopener noreferrer', `Unsafe ${id} external link`);
}
for (const [name, url] of Object.entries({
  'Gorillas Burger': 'https://www.instagram.com/gorillasburger_napoli?stkn=MXU2aGhjbHIyYjZjeQ==',
  'Serra Carni': 'https://www.instagram.com/serra_carni?stkn=ZHY3eGI0eXZnaWxv',
})) {
  const link = page.getByRole('link', { name: `Instagram di ${name}` });
  assert(await link.count() === 1 && await link.getAttribute('href') === url, `Incorrect More Work link ${name}`);
  assert(await link.getAttribute('target') === '_blank' && await link.getAttribute('rel') === 'noopener noreferrer', `Unsafe More Work link ${name}`);
}
for (const id of ['riviera', 'carbone', 'iperboat', 'arma']) {
  const image = page.locator(`#${id} .feed-visual img`);
  assert(await image.count() === 1, `Missing ${id} feed`);
  await image.scrollIntoViewIfNeeded();
  await image.evaluate(img => img.decode());
}
assert(await page.locator('#contact a[href="mailto:monaconunzia97@gmail.com"]').count() === 1, 'Email link missing');
const linkedIn = page.locator('#contact a[href="https://www.linkedin.com/in/nunzia-monaco-325aa2274/"]');
assert(await linkedIn.count() === 1 && await linkedIn.getAttribute('rel') === 'noopener noreferrer', 'LinkedIn link missing or unsafe');

await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.goto(base);
await page.getByRole('button', { name: 'Pausa animazione' }).click();
assert(await page.getByRole('button', { name: 'Riprendi animazione' }).getAttribute('aria-pressed') === 'true', 'Marquee pause failed');
await page.emulateMedia({ reducedMotion: 'reduce' });
assert(await page.locator('.marquee>div').evaluate(el => getComputedStyle(el).animationName) === 'none', 'Reduced motion does not stop marquee');

await page.goto(new URL('projects/arma', base).href);
await page.getByRole('heading', { name: 'Arma Contact', exact: true }).waitFor();
await page.reload();
await page.getByRole('heading', { name: 'Arma Contact', exact: true }).waitFor();
assert(await page.locator('.detail-feed img[src*="arma-feed"]').count() === 1, 'Arma feed missing on direct route');

const report = { sizes, video, errors };
writeFileSync('verification/report.json', JSON.stringify(report, null, 2));
console.log(report);
await browser.close();
if (errors.length || sizes.some(size => size.overflow)) process.exitCode = 1;
