import { expect, test } from '@playwright/test';

const hero = '.sv-about-hero';
const video = `${hero} video`;
const image = `${hero} .sv-about-hero__final img`;

test('desktop video finishes on the loaded thumbnail and does not loop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/about/');
  await expect(page.locator(video)).toHaveCount(1);
  await expect(page.locator(image)).toHaveAttribute(
    'src',
    '/images/about-us/about-hero-thumbnail.jpeg',
  );
  await expect
    .poll(() => page.locator(image).evaluate((node) => (node as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await expect
    .poll(() => page.locator(video).evaluate((node) => (node as HTMLVideoElement).readyState))
    .toBeGreaterThanOrEqual(2);
  expect(await page.locator(video).evaluate((node) => (node as HTMLVideoElement).loop)).toBe(false);
  await page.locator(video).evaluate((node) => {
    const player = node as HTMLVideoElement;
    player.currentTime = player.duration - 0.15;
  });
  await expect(page.locator(video)).toHaveCount(0, { timeout: 10000 });
  await expect(page.locator(`${hero} h1`)).toBeVisible();
  await expect(page.locator(`${hero} .sv-about-hero__overlay`)).toHaveClass(/is-visible/);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(video)).toHaveCount(0);
  expect(errors).toEqual([]);
  await expect(page.locator(`${hero} h1`)).toHaveCSS('opacity', '1');
  await expect(page.locator(`${hero} .sv-about-hero__content`)).toHaveCSS('opacity', '1');
  await page
    .locator(hero)
    .screenshot({ path: test.info().outputPath('about-desktop-thumbnail.png') });
});

for (const width of [390, 768, 1024]) {
  test(`only the thumbnail loads at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const videoRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().endsWith('about-us.mp4')) videoRequests.push(request.url());
    });
    await page.goto('/about/');
    await expect(page.locator(`${hero} h1`)).toBeVisible();
    await expect(page.locator(video)).toHaveCount(0);
    await expect
      .poll(() => page.locator(image).evaluate((node) => (node as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    expect(videoRequests).toEqual([]);
    await expect(page.locator(`${hero} h1`)).toHaveCSS('opacity', '1');
    await expect(page.locator(`${hero} .sv-about-hero__content`)).toHaveCSS('opacity', '1');
    await page
      .locator(hero)
      .screenshot({ path: test.info().outputPath(`about-thumbnail-${width}.png`) });
  });
}

test('coarse-pointer tablet in landscape and reduced motion both use only the thumbnail', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 1024 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const tablet = await context.newPage();
    await tablet.goto('/about/');
    await expect(tablet.locator(`${hero} h1`)).toBeVisible();
    await expect(tablet.locator(video)).toHaveCount(0);
  } finally {
    await context.close();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about/');
  await expect(page.locator(`${hero} h1`)).toBeVisible();
  await expect(page.locator(video)).toHaveCount(0);
});

test('video failure falls back to the thumbnail and resizing to tablet removes playback', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route('**/videos/about/about-us.mp4', (route) => route.abort());
  await page.goto('/about/');
  await expect(page.locator(`${hero} h1`)).toBeVisible();
  await expect(page.locator(video)).toHaveCount(0);
  await page.unroute('**/videos/about/about-us.mp4');
  await page.reload();
  await expect(page.locator(video)).toHaveCount(1);
  await page.setViewportSize({ width: 1024, height: 1000 });
  await expect(page.locator(video)).toHaveCount(0);
  await expect(page.locator(`${hero} h1`)).toBeVisible();
});
