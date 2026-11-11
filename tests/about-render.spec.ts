import { expect, test } from '@playwright/test';

for (const [width, height] of [[1920, 1080], [1366, 768], [1024, 768], [768, 1024], [667, 375], [390, 844], [320, 568]]) {
  test(`About layout renders without clipping or hydration errors at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydrat|server rendered/i.test(message.text())) errors.push(message.text());
    });
    await page.goto('/about/', { waitUntil: 'domcontentloaded' });
    const heading = page.locator('.sv-about-hero h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS('opacity', '1');
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator('.sv-about-hero').boundingBox();
    for (const selector of ['.sv-about-hero h1', '.sv-about-hero__content p', '.sv-about-hero__line']) {
      const box = await page.locator(selector).boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(bounds!.x);
      expect(box!.x + box!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
      expect(box!.y).toBeGreaterThanOrEqual(bounds!.y);
      expect(box!.y + box!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    if ([1366, 768, 320].includes(width)) await page.screenshot({ path: test.info().outputPath(`about-layout-${width}.png`), fullPage: true });
  });
}

test('About heading and description remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/about/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.sv-about-hero__content')).toHaveCSS('opacity', '1');
    await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
    await expect(page.getByText(/Bringing together opportunity/)).toBeVisible();
    await page.screenshot({ path: test.info().outputPath('about-without-javascript.png') });
  } finally { await context.close(); }
});

test('a stalled desktop intro falls back to readable page content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => new Promise<void>(() => {});
  });
  // Leave the media request pending instead of returning an error.
  await page.route('**/videos/about/about-us.mp4', () => {});
  await page.goto('/about/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.sv-about-hero video')).toHaveCount(1);
  await expect(page.locator('.sv-about-hero video')).toHaveCount(0, { timeout: 12000 });
  await expect(page.locator('.sv-about-hero h1')).toHaveCSS('opacity', '1');
});
