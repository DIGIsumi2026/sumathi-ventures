import { expect, test, type Page } from '@playwright/test';

const stage = '.sv-pillar-carousel__stage';
const active = '.sv-pillar-carousel__card[data-position="active"]';

async function openCarousel(page: Page) {
  await page.goto('/investment-focus/');
  await page.locator(stage).scrollIntoViewIfNeeded();
  await expect(page.locator(stage)).toHaveAttribute('data-visible', 'true');
}

test('desktop dragging, snap-back, clicking and keyboard navigation wrap without duplicate accessible slides', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:1000 });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await openCarousel(page);
  const drag = async (dx:number) => {
    const bounds = await page.locator(active).boundingBox();
    const x = bounds!.x + bounds!.width / 2;
    const y = bounds!.y + bounds!.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y + 2, { steps:12 });
    await page.mouse.up();
  };
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Industry');
  await drag(-180);
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Commerce');
  await expect(page.locator('.sv-pillar-carousel__title h3')).toHaveText('Commerce');
  await drag(180);
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Industry');
  await drag(8);
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Industry');
  await page.locator('.sv-pillar-carousel__card[data-position="right"]').click();
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Commerce');
  await page.getByRole('button', { name:'Next investment pillar' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Technology');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Industry');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Technology');
  await expect(page.getByRole('button', { name:/^Show / })).toHaveCount(3);
  await expect(page.locator('.sv-pillar-carousel__card')).toHaveCount(7);
});

for (const width of [390, 768]) {
  test(`real touch swipes move both ways and vertical gestures scroll at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport:{ width, height:1000 }, hasTouch:true, isMobile:true, reducedMotion:'reduce' });
    try {
      const page = await context.newPage();
      await openCarousel(page);
      const cdp = await context.newCDPSession(page);
      const swipe = async (dx:number, dy:number) => {
        const box = await page.locator(active).boundingBox();
        const x = box!.x + box!.width / 2;
        const y = box!.y + box!.height / 2;
        await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{ x,y }] });
        for (let step = 1; step <= 10; step++) {
          await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{ x:x + dx * step / 10, y:y + dy * step / 10 }] });
        }
        await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
      };
      await swipe(-100, 2);
      await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Commerce');
      await swipe(100, 2);
      await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Industry');
      const before = await page.evaluate(() => scrollY);
      await swipe(2, -130);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
      await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Industry');
    } finally { await context.close(); }
  });
}

test('active slide wipes into color and resizes cleanly across viewport widths', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:1000 });
  await openCarousel(page);
  await expect(page.locator(`${active} .sv-pillar-carousel__color`)).toHaveCSS('animation-name', 'sv-pillar-color-wipe');
  await expect(page.locator(`${active} > img`)).toHaveCSS('filter', 'grayscale(1)');
  await page.getByRole('button', { name:'Next investment pillar' }).click();
  await expect(page.locator(active)).toHaveAttribute('aria-label', 'Show Commerce');
  await expect(page.locator('.sv-pillar-carousel__title h3')).toHaveText('Commerce');
  await page.waitForTimeout(1100);
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height:1000 });
    await page.locator(stage).scrollIntoViewIfNeeded();
    await page.waitForTimeout(750);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const rect = await page.locator(active).boundingBox();
    expect(Math.abs(rect!.x + rect!.width / 2 - width / 2)).toBeLessThan(2);
    if ([1440,390].includes(width)) await page.locator('.sv-pillar-foundation').screenshot({
      path:test.info().outputPath(`pillars-${width}.png`),
      style:'.sv-header,.sv-top,.sv-whatsapp-floating,.sv-custom-cursor,.skip-link { visibility:hidden !important; }',
    });
  }
});
