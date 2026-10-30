import { test, expect, type Page } from '@playwright/test';

const viewport = '.sv-investment-carousel';
const track = '.sv-investment-carousel__track';
const cards = '.sv-investment-card';

async function openCarousel(page: Page) {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.locator(viewport).evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await page.mouse.move(-5, -5);
  await expect(page.locator(track)).toHaveCSS('display', 'flex');
}

async function position(page: Page) {
  return page
    .locator(track)
    .evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
}

async function flick(page: Page, from: number, to: number, y: number) {
  const session = await page.context().newCDPSession(page);
  const timestamp = Date.now() / 1000;
  // Consistent input timing keeps test-runner latency from turning a flick into a hold.
  await session.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: from,
    y,
    button: 'left',
    buttons: 1,
    clickCount: 1,
    timestamp,
  });
  for (let step = 1; step <= 7; step++) {
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: from + ((to - from) * step) / 7,
      y,
      buttons: 1,
      timestamp: timestamp + step * 0.02,
    });
  }
  await session.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: to,
    y,
    button: 'left',
    buttons: 0,
    clickCount: 1,
    timestamp: timestamp + 0.16,
  });
  await session.detach();
}

test('Reference card dimensions, heading weight and removed image numbers', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1478, height: 1000 });
  await openCarousel(page);
  await expect(page.locator('#investment-fields-title')).toHaveCSS('font-weight', '600');
  await expect(page.locator(cards)).toHaveCount(6);
  await expect(page.locator('.sv-investment-card__number')).toHaveCount(0);
  const box = await page.locator(cards).first().boundingBox();
  expect(box!.width).toBeCloseTo(450, 0);
  expect(box!.height).toBeCloseTo(600, 0);
  const gap = await page
    .locator(track)
    .evaluate((element) => parseFloat(getComputedStyle(element).gap));
  expect(gap).toBeCloseTo(40, 0);
  const finalGap = await page
    .locator(cards)
    .last()
    .evaluate((element) => parseFloat(getComputedStyle(element).marginRight));
  expect(finalGap).toBe(gap);
  for (const link of await page.locator(`${cards} a`).all()) {
    await expect(link).toHaveCSS('opacity', '1');
    await expect(link).toHaveAttribute('href', /^\/investment-fields\//);
  }
  await page.screenshot({ path: testInfo.outputPath('investment-desktop.png') });
});

test('Steady leftward drift pauses on hover with image zoom, then resumes immediately', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1478, height: 1000 });
  await openCarousel(page);
  await expect.poll(async () => Math.abs(await position(page))).toBeGreaterThan(5);
  const start = await position(page);
  const started = Date.now();
  await page.waitForTimeout(1000);
  const speed = (start - (await position(page))) / ((Date.now() - started) / 1000);
  expect(speed).toBeGreaterThan(35);
  expect(speed).toBeLessThan(65);
  await page.locator(viewport).hover({ position: { x: 750, y: 150 } });
  await page.waitForTimeout(400);
  const paused = await position(page);
  await page.waitForTimeout(500);
  expect(await position(page)).toBeCloseTo(paused, 0);
  const imageScale = () => page.locator(`${cards} img`).nth(1).evaluate(
    element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
  );
  await expect.poll(imageScale).toBeCloseTo(1.065, 3);
  await expect(page.locator('.sv-investment-card__content').nth(1)).toHaveCSS('transform', 'none');
  await page.mouse.move(-5, -5);
  await expect
    .poll(async () => paused - (await position(page)), { timeout: 1000 })
    .toBeGreaterThan(10);
  await expect.poll(imageScale).toBeCloseTo(1.015, 3);
});

test('Drag follows both directions and retains momentum before returning to auto-scroll', async ({
  page,
}) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1478, height: 1000 });
  await openCarousel(page);
  const bounds = await page.locator(viewport).boundingBox();
  const y = bounds!.y + 160;
  await page.mouse.move(850, y);
  await page.waitForTimeout(400);
  const start = await position(page);
  await flick(page, 850, 500, y);
  const dragged = await position(page);
  expect(dragged).toBeLessThan(start - 200);
  await page.waitForTimeout(200);
  expect(await position(page)).toBeLessThan(dragged - 5);
  await page.waitForTimeout(900);
  const reverse = await position(page);
  await flick(page, 500, 850, y);
  expect(await position(page)).toBeGreaterThan(reverse + 200);
  await page.waitForTimeout(1500);
  await page.mouse.move(-5, -5);
  const resumed = await position(page);
  const period = await page.locator(track).evaluate(element => {
    const gap = parseFloat(getComputedStyle(element).gap);
    return Array.from(element.children).reduce((width, card) => width + (card as HTMLElement).offsetWidth + gap, 0);
  });
  await expect
    .poll(async () => {
      const distance = ((resumed - await position(page)) % period + period) % period;
      return distance > 10 && distance < 100;
    }, { timeout: 1500 })
    .toBe(true);
  for (let repeat = 0; repeat < 2; repeat++) {
    await page.mouse.move(1300, y);
    await page.mouse.down();
    await page.mouse.move(100, y, { steps: 25 });
    await page.mouse.up();
    await page.waitForTimeout(500);
  }
  const loop = await page.locator(viewport).evaluate((element) => {
    const width = element.clientWidth;
    const rectangles = Array.from(element.querySelectorAll('.sv-investment-card'))
      .map((card) => card.getBoundingClientRect())
      .filter((rect) => rect.right > 0 && rect.left < width)
      .sort((a, b) => a.left - b.left);
    return {
      leading: rectangles[0].left,
      trailing: rectangles.at(-1)!.right,
      gaps: rectangles.slice(1).map((rect, index) => rect.left - rectangles[index].right),
    };
  });
  expect(loop.leading).toBeLessThan(41);
  expect(loop.trailing).toBeGreaterThan(1478 - 41);
  for (const gap of loop.gaps) expect(gap).toBeCloseTo(40, 0);
});

test('Reduced motion stays still, allows drag, and live preference changes restart autoplay', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCarousel(page);
  const initial = await position(page);
  await page.waitForTimeout(600);
  expect(await position(page)).toBe(initial);
  const bounds = await page.locator(viewport).boundingBox();
  const y = bounds!.y + 150;
  await page.mouse.move(850, y);
  await page.mouse.down();
  await page.mouse.move(600, y, { steps: 12 });
  expect(await position(page)).toBeLessThan(initial - 100);
  await page.mouse.up();
  await page.mouse.move(-5, -5);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(300);
  const restarted = await position(page);
  await expect.poll(async () => restarted - (await position(page))).toBeGreaterThan(10);
});

test('Mobile touch drag keeps links visible without document overflow', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await openCarousel(page);
  const bounds = await page.locator(viewport).boundingBox();
  const y = Math.round(bounds!.y + 130);
  const start = await position(page);
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 330, y }],
  });
  for (const x of [280, 230, 180, 130, 80]) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(async () => start - (await position(page))).toBeGreaterThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(page.locator(`${cards} a`).first()).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath('investment-mobile.png') });
  await context.close();
});
