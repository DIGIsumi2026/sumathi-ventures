import { expect, test } from '@playwright/test';

const hero = '.sv-investment-hero';
const video = `${hero} video`;
const poster = `${hero} picture img`;
const heading = 'Investing Across Industries. Building Long-Term Value.';

for (const [width, height] of [[1920, 1080], [1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 568]]) {
  test(`Investment Focus renders a loaded poster and readable content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    const mediaRequests: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydrat/i.test(message.text())) errors.push(message.text());
    });
    page.on('request', request => {
      if (request.url().includes('/videos/investment-focus/')) mediaRequests.push(request.url());
    });
    await page.goto('/investment-focus/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading, { useInnerText: true });
    await expect(page.locator(`${hero} .sv-investment-hero__content`)).toHaveCSS('opacity', '1');
    await expect(page.locator('main [data-page-hero]')).toHaveCount(1);
    await expect(page.locator(video)).toHaveCount(0);
    await expect(page.locator('.sv-investment-hero__responsive-media')).toHaveCSS('display', 'block');
    await expect.poll(() => page.locator(poster).evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await page.locator(poster).evaluate(node => (node as HTMLImageElement).currentSrc)).toContain(width <= 700 ? 'hero-mobile-poster.png' : 'hero-tablet-poster.png');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.sv-investment-hero__explore').click();
    await expect(page).toHaveURL(/#investment-fields$/);
    await expect(page.locator('#investment-fields')).toBeInViewport();
    await expect(page.locator('#investment-fields .sv-sector__link')).toHaveCount(3);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-page-hero]')!.getBoundingClientRect().bottom + scrollY + 20));
    await expect(page.locator('.sv-top')).toHaveClass(/is-shown/);
    expect(mediaRequests).toEqual([]);
    expect(errors).toEqual([]);
    if ([1440, 390].includes(width)) await page.locator(hero).screenshot({
      path: test.info().outputPath(`investment-hero-${width}.png`),
      style: '.sv-header, .sv-top, .sv-whatsapp-floating, .sv-custom-cursor, .skip-link { visibility:hidden !important; }',
    });
  });
}

test('desktop video loads, loops and is removed when changing to tablet', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/investment-focus/');
  await expect(page.locator(video)).toHaveCount(1);
  await expect.poll(() => page.locator(video).evaluate(node => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => page.locator(video).evaluate(node => (node as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  expect(await page.locator(video).evaluate(node => (node as HTMLVideoElement).loop)).toBe(true);
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator(video)).toHaveCount(0);
  await expect(page.locator(`${hero} .sv-investment-hero__content`)).toHaveCSS('opacity', '1');
});

test('failed or blocked video playback retains the thumbnail and heading', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route('**/videos/investment-focus/*.mp4', route => route.abort());
  await page.goto('/investment-focus/');
  await expect(page.locator(video)).toHaveCount(0);
  await expect(page.locator(`${hero} .sv-investment-hero__content`)).toHaveCSS('opacity', '1');
  await expect.poll(() => page.locator(poster).evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test('navbar routing between Home, About and Investment Focus never leaves blank content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (let visit = 0; visit < 2; visit++) {
    await page.locator('.sv-desktop-nav .sv-nav-dropdown > a').click();
    await expect(page).toHaveURL(/\/investment-focus\/$/);
    await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
    await expect(page.locator(`${hero} .sv-investment-hero__content`)).toHaveCSS('opacity', '1');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading, { useInnerText: true });
    await page.locator('.sv-desktop-nav').getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator('.sv-about-hero')).toBeVisible();
    await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
  }
});

test('mobile menu routes to Investment Focus and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('/videos/investment-focus/')) requests.push(request.url());
  });
  await page.goto('/about/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('.sv-drawer nav').getByRole('link', { name: 'Investment Focus', exact: true }).click();
  await expect(page).toHaveURL(/\/investment-focus\/$/);
  await expect(page.locator('.sv-drawer')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
  await expect(page.locator(video)).toHaveCount(0);
  expect(requests).toEqual([]);
});

for (const [route, title] of [['/insights/', 'Perspectives on opportunity.'], ['/investment-focus/industry/', 'Industry'], ['/investment-focus/commerce/', 'Commerce'], ['/investment-focus/technology/', 'Technology']]) {
  test(`${route} retains its own page content`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator(hero)).toHaveCount(0);
  });
}

test('Investment Focus content is visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/investment-focus/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading, { useInnerText: true });
    await expect(page.locator(`${hero} .sv-investment-hero__content`)).toHaveCSS('opacity', '1');
    await expect(page.locator(video)).toHaveCount(0);
  } finally { await context.close(); }
});
