import { expect, test } from '@playwright/test';

const section = '.sv-foundation-values';
const focus = `${section} .sv-true-focus`;
const words = `${focus} .sv-focus-word`;

for (const width of [1440, 390]) {
  test(`Foundation Values focus animates and stays aligned at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydrat/i.test(message.text())) errors.push(message.text());
    });
    await page.goto('/about/');
    await page.locator(section).scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Foundation Values', exact: true })).toBeVisible();
    await expect(page.locator('.sv-foundation-values__content')).toHaveCSS('opacity', '1');
    await expect(page.locator(`${focus} .sv-focus-corner`)).toHaveCount(4);
    await expect(page.locator(`${focus} .sv-focus-corner`).first()).toHaveCSS('border-top-color', 'rgb(39, 255, 111)');
    await expect(page.locator(`${words}.active`)).toHaveText('Values');
    await expect(page.locator(words).first()).toHaveCSS('filter', 'blur(5px)');
    await expect(page.locator(`${words}.active`)).toHaveText('Foundation');

    // Pause playback without removing the frame so its final position can be checked.
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect.poll(async () => {
      const word = await page.locator(`${words}.active`).boundingBox();
      const corner = await page.locator(`${focus} .top-left`).boundingBox();
      return Math.abs(corner!.x - (word!.x - 10)) + Math.abs(corner!.y - (word!.y - 10));
    }).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator(section).screenshot({
      path: test.info().outputPath(`foundation-focus-${width}.png`),
      style: '.sv-header, .sv-top, .skip-link, .sv-custom-cursor { visibility:hidden !important; }',
    });
    expect(errors).toEqual([]);
  });
}

test('reduced motion keeps the full heading sharp and responds to live preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about/');
  await page.locator(section).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Foundation Values', exact: true })).toBeVisible();
  await expect(page.locator(`${focus} .sv-focus-frame`)).toHaveCount(0);
  for (const word of await page.locator(words).all()) await expect(word).toHaveCSS('filter', 'blur(0px)');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator(`${focus} .sv-focus-corner`)).toHaveCount(4);
  await expect(page.locator(`${words}.active`)).toHaveText('Values');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator(`${focus} .sv-focus-frame`)).toHaveCount(0);
  for (const word of await page.locator(words).all()) await expect(word).toHaveCSS('filter', 'blur(0px)');
});
