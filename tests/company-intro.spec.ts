import { expect, test, type Page } from '@playwright/test';
import { companyCandles, companyVolumes } from '../src/data/companyChart';

const section = '.sv-company-intro';
const chart = '.sv-market-chart';
const paragraphs = [
  'Incorporated on the 30th October 2020, Sumathi Ventures is driven by the visionary leadership of Mr. Thilanga Sumathipala- a veteran businessman with a wealth of expertise in the corporate world driving many organizations to the height of progress',
  'Sumathi Ventures is a fully owned subsidiary of Sumathi Universal Management and Investment PVT Limited (SUMI) a management holding company which has established business ventures in the fields of Printing, Trading, Hospitality, & Information Technology Services.',
  'The company will leverage the intellectual property, practices and resources of its potential venture partners and combine these inputs with SUMIs financial capital and local reputation and market presence through structures such as Joint ventures, BOOT, PPP’s, to achieve mutually agreed upon business outcomes.',
];
async function openIntro(page: Page) {
  await page.goto('/about/', { waitUntil: 'domcontentloaded' });
  await page.locator(section).scrollIntoViewIfNeeded();
  await expect(page.locator(chart)).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.sv-company-intro__content')).toHaveCSS('opacity', '1');
}

test('synthetic candles and volume data have matching timestamps and valid ranges', () => {
  expect(companyCandles).toHaveLength(40);
  expect(companyVolumes).toHaveLength(40);
  for (const [index, candle] of companyCandles.entries()) {
    expect(candle.time).toBe(companyVolumes[index].time);
    expect(candle.high).toBeGreaterThanOrEqual(Math.max(candle.open, candle.close));
    expect(candle.low).toBeLessThanOrEqual(Math.min(candle.open, candle.close));
  }
});

for (const [width, height] of [[1920, 1080], [1600, 900], [1440, 900], [1280, 800], [1024, 768], [820, 1180], [430, 932], [390, 844], [375, 812], [360, 800]]) {
  test(`company introduction renders intact at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error' && /hydrat|server rendered/i.test(message.text())) errors.push(message.text()); });
    await openIntro(page);
    expect(await page.locator(section).evaluate((node) => node.previousElementSibling?.classList.contains('sv-vision-mission'))).toBe(true);
    await expect(page.locator(`${section} .sv-company-intro__content > p`)).toHaveText(paragraphs);
    await expect(page.locator(`${section} li`)).toHaveText(['Printing', 'Trading', 'Hospitality', 'Information Technology']);
    await expect(page.locator(chart)).toHaveAttribute('data-point-count', '40');
    await expect(page.locator(chart)).toHaveAttribute('data-playback', 'static');
    await expect(page.locator(chart)).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator(chart)).toHaveCSS('pointer-events', 'none');
    await expect(page.locator(`${chart} canvas`).first()).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.sv-footer').getByRole('link', { name: 'Charts by TradingView' })).toHaveAttribute('href', 'https://www.tradingview.com/');
    await expect(page.locator(`${section} video, ${section} iframe, ${section} button`)).toHaveCount(0);
    const composition = await page.locator(section).evaluate((node) => {
      const graph = node.querySelector('.sv-company-intro__chart')!.getBoundingClientRect();
      const badge = node.querySelector('.sv-company-intro__badge')!.getBoundingClientRect();
      const content = node.querySelector('.sv-company-intro__content')!.getBoundingClientRect();
      return {
        graphRight: graph.right, graphLeft: graph.left, graphBottom: graph.bottom,
        badgeTop: badge.top, contentWidth: content.width,
        opacity: Number(getComputedStyle(node.querySelector('.sv-company-intro__chart')!).opacity),
        leadingBullet: getComputedStyle(node.querySelector('li')!, '::before').content,
      };
    });
    expect(composition.opacity).toBeGreaterThanOrEqual(.6);
    expect(composition.leadingBullet).toBe('none');
    if (width <= 700) {
      expect(composition.graphBottom).toBeLessThan(composition.badgeTop);
      expect(composition.graphRight - composition.graphLeft).toBeGreaterThan(width);
    } else {
      expect(composition.graphLeft).toBeGreaterThan(width * .4);
      expect(composition.contentWidth).toBeLessThan(width * .62);
    }
    expect(errors).toEqual([]);
    if ([1920, 1440, 820, 390].includes(width)) await page.locator(section).screenshot({
      path: test.info().outputPath(`company-intro-${width}.png`),
      style: '.sv-header, .skip-link, .sv-top, .sv-custom-cursor { visibility: hidden !important; }',
    });
  });
}

test('chart progressively updates, completes and softly loops', async ({ page }) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openIntro(page);
  const count = () => page.locator(chart).getAttribute('data-point-count').then(Number);
  const initial = await count();
  await expect.poll(count).toBeGreaterThan(initial);
  await expect.poll(count, { timeout: 20000 }).toBe(40);
  await expect(page.locator(chart)).toHaveAttribute('data-resetting', 'true', { timeout: 3000 });
  await expect.poll(count).toBeLessThan(10);
  await expect(page.locator(chart)).toHaveAttribute('data-resetting', 'false');
});

test('chart pauses offscreen and with a hidden tab, responds to reduced motion and cleans up on navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openIntro(page);
  const count = () => page.locator(chart).getAttribute('data-point-count').then(Number);
  await expect(page.locator(chart)).toHaveAttribute('data-playback', 'playing');
  const bounds = await page.locator(section).boundingBox();
  await page.mouse.move(1300, Math.max(120, bounds!.y + 200));
  await expect(page.locator('.sv-custom-cursor')).toHaveCSS('opacity', '1');
  await expect(page.locator('.sv-cursor-label')).toBeEmpty();
  await expect(page.locator('html')).toHaveClass(/sv-cursor-enabled/);
  await page.locator('.sv-about-hero').scrollIntoViewIfNeeded();
  await expect(page.locator(chart)).toHaveAttribute('data-playback', 'paused');
  const paused = await count();
  await page.waitForTimeout(850);
  expect(await count()).toBe(paused);
  await page.locator(section).scrollIntoViewIfNeeded();
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.locator(chart)).toHaveAttribute('data-playback', 'paused');
  const hidden = await count();
  await page.waitForTimeout(850);
  expect(await count()).toBe(hidden);
  await page.evaluate(() => { delete (document as unknown as { hidden?: boolean }).hidden; document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(count).toBeGreaterThan(hidden);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator(chart)).toHaveAttribute('data-playback', 'static');
  await expect(page.locator(chart)).toHaveAttribute('data-point-count', '40');
  await page.locator('.sv-desktop-nav').getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.locator(chart)).toHaveCount(0);
  await page.locator('.sv-desktop-nav').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.locator(section).scrollIntoViewIfNeeded();
  await expect(page.locator(chart)).toHaveAttribute('data-ready', 'true');
  await expect(page.locator(chart)).toHaveCount(1);
});

test('company copy is visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/about/');
    await expect(page.locator(`${section} .sv-company-intro__content > p`)).toHaveText(paragraphs);
    await expect(page.locator('.sv-company-intro__content')).toHaveCSS('opacity', '1');
  } finally { await context.close(); }
});

test('chart continues animating through desktop, mobile and small mobile resizing without remounting', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openIntro(page);
  const count = () => page.locator(chart).getAttribute('data-point-count').then(Number);
  await expect.poll(count).toBeGreaterThan(7);
  await page.locator(`${chart} canvas`).first().evaluate((canvas) => canvas.setAttribute('data-resize-probe', 'original'));
  for (const width of [390, 360, 1440]) {
    const before = await count();
    await page.setViewportSize({ width, height: 900 });
    await page.locator(section).scrollIntoViewIfNeeded();
    await expect(page.locator(chart)).toHaveAttribute('data-playback', 'playing');
    await expect(page.locator(`${chart} canvas`).first()).toHaveAttribute('data-resize-probe', 'original');
    expect(await count()).toBeGreaterThanOrEqual(before);
    await expect.poll(count).toBeGreaterThan(before);
  }
});
