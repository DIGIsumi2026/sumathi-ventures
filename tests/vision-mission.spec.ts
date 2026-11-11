import { expect, test } from '@playwright/test';

const section = '.sv-vision-mission';
const vision = '.sv-vision-mission__row--vision';
const mission = '.sv-vision-mission__row--mission';
const filters = 'filter[id^="sv-fade-mist-"]';
const visionText =
  'To become a Global company most admired for our partnerships and performance amongst competitors with our portfolio of services. We are positioned for long term growth that will benefit our valued customers, partners & Society.';
const missionText =
  'We intend to remain true to our logo and uphold the highest levels of integrity as we accomplish our vision and persevere to become the best.';

test('mist reveals text and images on entry, settles cleanly and does not replay', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/about/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator(filters).count()).toBeGreaterThan(0);
  await expect(page.locator(`${vision} h2`)).toHaveCSS('visibility', 'hidden');
  for (const row of [vision, mission]) {
    for (const part of ['.sv-vision-mission__content', '.sv-vision-mission__image']) {
      const element = page.locator(`${row} ${part}`);
      await element.evaluate((node) => node.scrollIntoView({ block: 'center' }));
      const target = part.endsWith('content') ? element.locator('h2') : element;
      await expect(target).toHaveCSS('visibility', 'visible');
      if (row === vision && part.endsWith('content')) {
        await expect(target).toHaveCSS('filter', /url\(.+sv-fade-mist-.+blur/);
        await page
          .locator(vision)
          .screenshot({ path: test.info().outputPath('vision-mist-reveal.png') });
      }
      await expect(target).toHaveCSS('filter', 'none', { timeout: 6000 });
      if (part.endsWith('content'))
        await expect(element.locator('.sv-vision-mission__accent')).toHaveCSS('filter', 'none');
    }
  }
  await expect(page.locator(filters)).toHaveCount(0);
  await expect(page.locator(`${vision} p`)).toHaveText(visionText);
  await expect(page.locator(`${mission} p`)).toHaveText(missionText);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator(vision).evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await expect(page.locator(`${vision} h2`)).toHaveCSS('filter', 'none');
  await page
    .locator(section)
    .screenshot({ path: test.info().outputPath('vision-mission-complete.png') });
  await page.locator('.sv-desktop-nav').getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.locator(section)).toHaveCount(0);
  await expect(page.locator(filters)).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const width of [1440, 768, 390]) {
  test(`reduced-motion content and original assets remain readable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/about/', { waitUntil: 'domcontentloaded' });
    await page.locator(section).evaluate((node) => node.scrollIntoView());
    await expect(page.locator(`${vision} p`)).toHaveText(visionText);
    await expect(page.locator(`${mission} p`)).toHaveText(missionText);
    await expect(page.locator(`${vision} h2`)).toHaveCSS('filter', 'none');
    await expect(page.locator(`${mission} h2`)).toBeVisible();
    await expect(page.locator(`${vision} img`)).toHaveAttribute(
      'src',
      '/images/about-us/vision.png',
    );
    await expect(page.locator(`${mission} img`)).toHaveAttribute(
      'src',
      '/images/about-us/mission.png',
    );
    await expect(page.locator(filters)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 390)
      await page
        .locator(section)
        .screenshot({ path: test.info().outputPath('vision-mission-mobile.png') });
  });
}

test('changing reduced-motion preference restores all content and removes active masks', async ({
  page,
}) => {
  await page.goto('/about/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator(filters).count()).toBeGreaterThan(0);
  await page.locator(vision).evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator(filters)).toHaveCount(0);
  await expect(page.locator(`${vision} h2`)).toHaveCSS('visibility', 'visible');
  await expect(page.locator(`${mission} h2`)).toHaveCSS('visibility', 'visible');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator(filters)).toHaveCount(0);
});

test('section text and images remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/about/');
    await expect(page.locator(`${vision} p`)).toBeVisible();
    await expect(page.locator(`${mission} p`)).toHaveText(missionText);
    await expect(page.locator(`${mission} img`)).toBeVisible();
  } finally {
    await context.close();
  }
});
