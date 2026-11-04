import { expect, test } from '@playwright/test';

const cursor = '.sv-custom-cursor';
test('desktop theme, pointer tracking, magnetic CTA and keyboard fallback', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator(cursor)).toHaveCount(1);
  await expect(page.locator(cursor)).toHaveAttribute('data-enabled', 'true');
  await page.mouse.move(500, 200);
  await expect(page.locator('html')).toHaveClass(/sv-cursor-enabled/);
  await expect(page.locator('.sv-cursor-dot')).toHaveCSS('background-color', 'rgb(18, 62, 48)');
  await expect(page.locator(cursor)).toHaveCSS('pointer-events', 'none');
  await page.waitForTimeout(500);
  const dot = await page.locator('.sv-cursor-dot').boundingBox();
  expect(dot!.x + dot!.width / 2).toBeCloseTo(500, 0);
  const button = page.locator('.sv-header__actions [data-magnetic]');
  await button.hover({ position: { x: 25, y: 20 } });
  await expect(page.locator(cursor)).toHaveAttribute('data-state', 'interactive');
  await expect
    .poll(() =>
      button
        .locator('[data-magnetic-content]')
        .evaluate((node) => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m41)),
    )
    .toBeGreaterThan(0.5);
  await page.keyboard.press('Tab');
  await expect(page.locator('html')).not.toHaveClass(/sv-cursor-enabled/);
  await page.mouse.move(500, 200);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.locator(cursor)).toHaveCSS('opacity', '0');
  expect(errors).toEqual([]);
});

test('context labels, button priority and investment dragging remain functional', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route('**/data/newsVideos.json', (route) =>
    route.fulfill({
      json: [{ id: 'test', videoUrl: 'https://youtu.be/testVid0001', title: 'Test insight' }],
    }),
  );
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ body: '<html></html>', contentType: 'text/html' }),
  );
  await page.goto('/');
  const card = page.locator('.sv-investment-card').nth(1);
  await card.hover({ position: { x: 80, y: 80 } });
  await expect(page.locator('.sv-cursor-label')).toHaveText('EXPLORE ↗');
  await expect(page.locator('.sv-cursor-shape')).toHaveCSS('backdrop-filter', 'blur(10px) saturate(1.4)');
  // Focus pauses the moving carousel and reveals its CTA before testing cursor priority.
  await card.locator('a').focus();
  await card.locator('a').hover();
  await expect(page.locator(cursor)).toHaveAttribute('data-state', 'interactive');
  await expect(page.locator('.sv-cursor-label')).toBeEmpty();
  await card.hover({ position: { x: 80, y: 80 } });
  await page.mouse.down();
  await expect(page.locator('.sv-cursor-label')).toHaveText('DRAGGING ↔');
  const wrapper = page.locator('.sv-investment-carousel__track');
  const before = await wrapper.getAttribute('style');
  await page.mouse.move(300, 500, { steps: 10 });
  await page.mouse.up();
  await expect.poll(() => wrapper.getAttribute('style')).not.toBe(before);
  await page.locator('.sv-news').scrollIntoViewIfNeeded();
  await page.locator('.sv-news__card-content').first().hover();
  await expect(page.locator('.sv-cursor-label')).toHaveText('READ ↗');
  await page.locator('.sv-home-contact-cta__eyebrow').hover();
  await expect(page.locator('.sv-cursor-label')).toHaveText('CONNECT ↗');
  await page.locator('.sv-home-contact-cta__btn').first().hover();
  await expect(page.locator(cursor)).toHaveAttribute('data-state', 'interactive');
  await page.locator('.sv-sector__link').first().hover();
  await expect(page.locator('.sv-cursor-label')).toHaveText('VIEW ↗');
  expect(await page.evaluate(() => {
    const ring = document.querySelector('.sv-cursor-ring')!.getBoundingClientRect();
    const label = document.querySelector('.sv-cursor-label')!.getBoundingClientRect();
    return Math.abs(label.x + label.width / 2 - ring.x - ring.width / 2);
  })).toBeLessThan(0.5);
  await page.screenshot({ path: test.info().outputPath('themed-cursor.png') });
});

test('cursor stays visible while scrolling and updates labels beneath a stationary pointer', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const panel = document.createElement('div');
    panel.id = 'cursor-scroll-fixture';
    panel.style.cssText = 'position:fixed;z-index:2000;left:100px;top:150px;width:350px;height:300px;overflow:auto;background:white';
    panel.innerHTML = '<div data-cursor="READ ↗" style="height:600px">First panel</div><div data-cursor="CONNECT ↗" style="height:600px">Second panel</div>';
    document.body.appendChild(panel);
  });
  await page.mouse.move(200, 250);
  await expect(page.locator('.sv-cursor-label')).toHaveText('READ ↗');
  await page.mouse.wheel(0, 550);
  await expect(page.locator('.sv-cursor-label')).toHaveText('CONNECT ↗');
  await expect(page.locator('html')).toHaveClass(/sv-cursor-enabled/);
  await expect(page.locator(cursor)).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.scrollBy(0, 300));
  await expect(page.locator('html')).toHaveClass(/sv-cursor-enabled/);
  await expect(page.locator('.sv-cursor-label')).toHaveText('CONNECT ↗');
});

test('global cursor survives navigation and leaves form fields and text selection native', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.sv-header__actions .sv-button').click();
  await expect(page).toHaveURL(/contact/);
  await expect(page.locator(cursor)).toHaveCount(1);
  const input = page.locator('input[name="name"]');
  await input.hover();
  await expect(page.locator('html')).not.toHaveClass(/sv-cursor-enabled/);
  await expect(input).toHaveCSS('cursor', 'text');
  await input.fill('Cursor test');
  await expect(input).toHaveValue('Cursor test');
  await page.locator('textarea').hover();
  await expect(page.locator('html')).not.toHaveClass(/sv-cursor-enabled/);
  await page.locator('select').first().hover();
  await expect(page.locator('html')).not.toHaveClass(/sv-cursor-enabled/);
  const paragraph = page.locator('.sv-inner-hero p').last();
  await paragraph.scrollIntoViewIfNeeded();
  const box = await paragraph.boundingBox();
  await page.mouse.move(box!.x + 5, box!.y + 10);
  await page.mouse.down();
  await page.mouse.move(box!.x + 180, box!.y + 10, { steps: 12 });
  await page.mouse.up();
  expect((await page.evaluate(() => getSelection()?.toString()))!.length).toBeGreaterThan(0);
});

test('reduced motion disables cursor and magnetic movement, including live preference changes', async ({
  page,
}) => {
  await page.goto('/');
  await page.mouse.move(400, 200);
  await expect(page.locator(cursor)).toHaveAttribute('data-enabled', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator(cursor)).toBeHidden();
  await expect(page.locator('html')).not.toHaveClass(/sv-cursor-enabled/);
  const button = page.locator('.sv-header__actions [data-magnetic]');
  await button.hover();
  await expect
    .poll(() =>
      button
        .locator('[data-magnetic-content]')
        .evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41),
    )
    .toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.mouse.move(450, 200);
  await expect(page.locator('html')).toHaveClass(/sv-cursor-enabled/);
});

test('touch and coarse pointers keep native behavior with no active cursor', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await expect(page.locator(cursor)).toBeHidden();
    await expect(page.locator(cursor)).not.toHaveAttribute('data-enabled', 'true');
    await page.getByRole('button', { name: 'Open menu' }).tap();
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();
    await expect(page.locator('html')).not.toHaveClass(/sv-cursor-enabled/);
  } finally {
    await context.close();
  }
});
