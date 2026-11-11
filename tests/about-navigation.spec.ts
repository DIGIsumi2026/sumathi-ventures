import { expect, test } from '@playwright/test';

test('navbar navigation to About never leaves the page wrapper blank', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(process.env.ABOUT_NAV_ORIGIN || '/');
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.locator('.sv-desktop-nav').getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator('.sv-about-hero')).toBeVisible();
    await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1', { timeout: 7000 });
    await expect(page.locator('.sv-about-hero')).toHaveCSS('background-color', 'rgb(3, 26, 20)');
    if (attempt === 0) await page.screenshot({ path: test.info().outputPath('about-via-navbar.png') });
    await page.locator('.sv-desktop-nav').getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page.locator('.sv-hero-carousel')).toBeVisible();
    await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
    await page.evaluate(() => window.scrollTo(0, 500));
  }
});

test('mobile navigation to About renders the thumbnail and visible page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(process.env.ABOUT_NAV_ORIGIN || '/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('.sv-drawer nav').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('.sv-about-hero h1')).toHaveCSS('opacity', '1');
  await expect(page.locator('.sv-about-hero video')).toHaveCount(0);
});

test('reduced-motion route changes keep About and Contact visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(process.env.ABOUT_NAV_ORIGIN || '/');
  await page.locator('.sv-desktop-nav').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.locator('.sv-about-hero h1')).toHaveCSS('opacity', '1');
  await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
  await page.locator('.sv-header__actions .sv-button').click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
});
