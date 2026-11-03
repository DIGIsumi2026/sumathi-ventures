import { expect, test } from '@playwright/test';

const title = 'Let’s Start a Strategic Conversation';
const root = '#sv-home-contact-cta-title';

test('heading draws on first section entry and remains filled after hover, reentry and resize', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(1);
  await expect(page.locator(root)).not.toBeInViewport();
  const clip = page.locator(`${root} clipPath rect`);
  await page.waitForTimeout(350);
  await expect(clip).toHaveAttribute('width', '0');
  await page.locator(root).scrollIntoViewIfNeeded();
  await expect(clip).toHaveAttribute('width', '1', { timeout: 7000 });
  await expect
    .poll(() =>
      page
        .locator(`${root} [data-stroke-char]`)
        .evaluateAll((nodes) =>
          nodes.every((node) => Number.parseFloat(getComputedStyle(node).strokeDashoffset) === 0),
        ),
    )
    .toBe(true);
  await page.locator(root).scrollIntoViewIfNeeded();
  await page.locator(root).hover();
  await page.locator('.sv-hero-carousel').scrollIntoViewIfNeeded();
  await page.locator(root).scrollIntoViewIfNeeded();
  await expect(clip).toHaveAttribute('width', '1');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(clip).toHaveAttribute('width', '1');
  await page
    .locator('.sv-home-contact-cta')
    .screenshot({ path: test.info().outputPath('contact-animated-complete.png') });
  expect(errors).toEqual([]);
});

for (const width of [1440, 768, 390]) {
  test(`responsive filled heading with reduced motion at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`${root} clipPath rect`)).toHaveAttribute('width', '1');
    await page.locator(root).scrollIntoViewIfNeeded();
    const heading = await page.locator(root).boundingBox();
    const banner = await page.locator('.sv-home-contact-cta').boundingBox();
    expect(heading!.y).toBeGreaterThanOrEqual(banner!.y);
    expect(heading!.y + heading!.height).toBeLessThanOrEqual(banner!.y + banner!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Call Us', exact: true })).toBeVisible();
    await page
      .locator('.sv-home-contact-cta')
      .screenshot({ path: test.info().outputPath(`contact-${width}.png`) });
  });
}
