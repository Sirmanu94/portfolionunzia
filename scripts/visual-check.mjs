import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
for (const width of [768, 1024, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('http://127.0.0.1:5173/');
  for (const [selector, name] of [['#work', 'work'], ['.creative-wall', 'wall'], ['#contact', 'contact']]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForFunction(selector => {
      const el = document.querySelector(selector);
      return el && getComputedStyle(el).opacity === '1';
    }, selector);
    if (name === 'wall') await page.waitForFunction(() => [...document.querySelectorAll('.creative-wall img')].every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: `verification/${width}-${name}.png` });
  }
}
await page.setViewportSize({ width: 1440, height: 960 });
await page.goto('http://127.0.0.1:5173/');
for (const id of ['riviera', 'carbone', 'iperboat', 'arma']) {
  await page.locator('#' + id).scrollIntoViewIfNeeded();
  await page.waitForFunction(id => {
    const image = document.querySelector(`#${id} .feed-visual img`);
    return !image || (image.complete && image.naturalWidth > 0);
  }, id);
  await page.screenshot({ path: `verification/1440-${id}.png` });
}
await browser.close();
