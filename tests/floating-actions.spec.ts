import { expect, test, type Page } from '@playwright/test';

const actions = '.sv-top, .sv-whatsapp-floating';
const routes = [
  '/', '/about/', '/approach/', '/contact/', '/insights/', '/investment-focus/',
  '/investment-focus/industry/', '/investment-focus/commerce/', '/investment-focus/technology/',
  '/ventures/',
];

async function expectActions(page: Page, shown: boolean) {
  for (const action of await page.locator(actions).all()) {
    await expect(action).toHaveCSS('opacity', shown ? '1' : '0');
    await expect(action).toHaveCSS('visibility', shown ? 'visible' : 'hidden');
    await expect(action).toHaveAttribute('aria-hidden', String(!shown));
    await expect(action).toHaveAttribute('tabindex', shown ? '0' : '-1');
  }
}

for (const width of [1440, 390]) {
  for (const route of routes) {
    test(`floating actions follow the hero at ${width}px on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      await expect(page.locator('main [data-page-hero]')).toHaveCount(1);
      await expect(page.locator(actions)).toHaveCount(2);
      await expectActions(page, false);
      const end = await page.locator('[data-page-hero]').evaluate(hero => hero.getBoundingClientRect().bottom + scrollY);
      await page.evaluate(y => window.scrollTo(0, y), end - 30);
      await expectActions(page, false);
      await page.evaluate(y => window.scrollTo(0, y), end + 30);
      const canPassHero = await page.evaluate(y => document.documentElement.scrollHeight - innerHeight > y, end);
      if (!canPassHero) {
        // A short page can reach its bottom while part of its hero is still visible.
        await expectActions(page, false);
        await page.setViewportSize({ width, height: 600 });
        await page.evaluate(y => window.scrollTo(0, y), end + 30);
      }
      await expectActions(page, true);
      await expect(page.locator('.sv-whatsapp-floating')).toHaveAttribute('href', 'https://wa.me/94722259524');
      await page.locator('.sv-top').click();
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await expectActions(page, false);
    });
  }
}

test('navigation, history and viewport resizing use the current hero boundary', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-page-hero]')!.getBoundingClientRect().bottom + scrollY + 30));
  await expectActions(page, true);
  await page.locator('.sv-desktop-nav').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expectActions(page, false);
  await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-page-hero]')!.getBoundingClientRect().bottom + scrollY + 30));
  await expectActions(page, true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expectActions(page, false);
  await page.goBack();
  await expect(page).toHaveURL(new URL('/', page.url()).href);
  const passed = await page.locator('[data-page-hero]').evaluate(hero => hero.getBoundingClientRect().bottom <= 0 && scrollY > 0);
  await expectActions(page, passed);
});

test('normal-motion buttons fade in together and smooth scrolling returns to the hero', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about/');
  await expectActions(page, false);
  await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-page-hero]')!.getBoundingClientRect().bottom + scrollY + 100));
  await expectActions(page, true);
  await page.locator('.sv-top').click();
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBe(0);
  await expectActions(page, false);
});
