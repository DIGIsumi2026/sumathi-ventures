import { expect, test, type Page } from '@playwright/test';

const quote =
  'Our Goal is to become Globally Present, Regionally Strong, Sri Lankan based leader in Ventures';
const section = '.sv-chairman-quote';
const visibleText = (page: Page) =>
  page
    .locator(`${section} .text-type__char:not(.text-type__char--pending)`)
    .allTextContents()
    .then((characters) => characters.join(''));

test('quote types on first section entry, keeps its layout and remains complete without replaying', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator(section)).not.toBeInViewport();
  await page.waitForTimeout(350);
  expect(await visibleText(page)).toBe('');
  await expect(page.locator(`${section} .text-type__cursor`)).toHaveCount(0);
  await page.locator(section).scrollIntoViewIfNeeded();
  await expect.poll(() => visibleText(page)).not.toBe('');
  const partial = await visibleText(page);
  expect(quote.startsWith(partial)).toBe(true);
  expect(partial.length).toBeLessThan(quote.length);
  await expect(page.locator(`${section} .text-type__cursor`)).toHaveCount(1);
  await expect(page.getByRole('heading', { name: quote, exact: true })).toHaveCount(1);
  const heading = page.locator('#chairman-quote-title');
  const initial = await heading.boundingBox();
  await page.locator(section).scrollIntoViewIfNeeded();
  await page.locator(section).screenshot({ path: test.info().outputPath('chairman-typing.png') });
  await expect.poll(() => visibleText(page), { timeout: 15000 }).toBe(quote);
  await expect(page.locator(`${section} .text-type__cursor`)).toHaveCount(0);
  const complete = await heading.boundingBox();
  expect(complete!.height).toBeCloseTo(initial!.height, 0);
  await page.waitForTimeout(2800);
  expect(await visibleText(page)).toBe(quote);
  await page.locator(section).screenshot({ path: test.info().outputPath('chairman-complete.png') });
  await page.locator('.sv-hero-carousel').scrollIntoViewIfNeeded();
  await page.locator(section).scrollIntoViewIfNeeded();
  expect(await visibleText(page)).toBe(quote);
  expect(errors).toEqual([]);
});

for (const width of [1440, 768, 390]) {
  test(`reduced motion shows the complete quote immediately at ${width}px`, async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydrat|server rendered/i.test(message.text())) {
        hydrationErrors.push(message.text());
      }
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => visibleText(page)).toBe(quote);
    await expect(page.locator(`${section} .text-type__cursor`)).toBeHidden();
    await page.locator(section).scrollIntoViewIfNeeded();
    const bounds = await page.locator(section).boundingBox();
    const heading = await page.locator('#chairman-quote-title').boundingBox();
    const footer = await page.locator(`${section} footer`).boundingBox();
    expect(heading!.y).toBeGreaterThanOrEqual(bounds!.y);
    expect(footer!.y + footer!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page
      .locator(section)
      .screenshot({ path: test.info().outputPath(`chairman-${width}.png`) });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(200);
    expect(await visibleText(page)).toBe(quote);
    expect(hydrationErrors).toEqual([]);
  });
}
