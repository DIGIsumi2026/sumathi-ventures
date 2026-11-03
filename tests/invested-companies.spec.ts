import { expect, test, type Page } from '@playwright/test';

const section = '.sv-invested-companies';
const loop = `${section} .logoloop`;
const track = `${loop} .logoloop__track`;
const position = (page: Page) =>
  page
    .locator(track)
    .evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41);

async function openSection(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator(section).scrollIntoViewIfNeeded();
  await expect(page.locator(loop)).not.toHaveAttribute('data-intro', '');
  expect(
    await page
      .locator(section)
      .evaluate((node) => node.previousElementSibling?.classList.contains('sv-news')),
  ).toBe(true);
  await expect(page.locator(section)).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('heading', { name: 'Our Invested Companies' })).toBeVisible();
}

test('desktop loop loads the supplied logos, moves left, pauses on hover and supports dragging', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openSection(page);
  const primary = page.locator(`${loop} .logoloop__list:not([aria-hidden])`);
  await expect(primary.locator('img')).toHaveCount(16);
  const sources = await primary
    .locator('img')
    .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).src));
  for (const source of sources) expect((await page.request.get(source)).ok()).toBe(true);
  await page.locator('#invested-companies-title').hover();
  const initial = await position(page);
  await expect.poll(() => position(page)).toBeLessThan(initial - 15);
  const bounds = await page.locator(loop).boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.waitForTimeout(1700);
  const paused = await position(page);
  await page.waitForTimeout(300);
  expect(Math.abs((await position(page)) - paused)).toBeLessThan(2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2 - 150, bounds!.y + bounds!.height / 2, {
    steps: 12,
  });
  await expect(page.locator(loop)).toHaveAttribute('data-dragging', '');
  await page.mouse.up();
  await expect(page.locator(loop)).not.toHaveAttribute('data-dragging', '');
  expect(Math.abs((await position(page)) - paused)).toBeGreaterThan(50);
  await page.locator('#invested-companies-title').hover();
  await page.locator(section).screenshot({ path: test.info().outputPath('companies-desktop.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('reduced motion keeps logos stationary and responsive across desktop, tablet and mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openSection(page);
  for (const width of [1920, 1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const initial = await position(page);
    await page.waitForTimeout(200);
    expect(await position(page)).toBeCloseTo(initial, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const image = page.locator(`${loop} img`).first();
    const imageBox = await image.boundingBox();
    expect(imageBox!.width / imageBox!.height).toBeCloseTo(1, 1);
    if (width === 390)
      await page
        .locator(section)
        .screenshot({ path: test.info().outputPath('companies-mobile.png') });
  }
});

test('mobile swipe drags the logo row while retaining vertical page scrolling', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    await openSection(page);
    await expect(page.locator(loop)).toHaveCSS('touch-action', 'pan-y pinch-zoom');
    const before = await position(page);
    const bounds = await page.locator(loop).boundingBox();
    const cdp = await context.newCDPSession(page);
    const y = bounds!.y + bounds!.height / 2;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 320, y }],
    });
      await page.waitForTimeout(30);
    for (const x of [280, 240, 200, 160, 120, 80]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(async () => Math.abs((await position(page)) - before)).toBeGreaterThan(50);
  } finally {
    await context.close();
  }
});
