import { expect, test, type Page } from '@playwright/test';
import { parseNewsVideos } from '../src/lib/newsVideos';
import { getYouTubeEmbedUrl, getYouTubeVideoId } from '../src/utils/youtube';

// Synthetic IDs are intercepted in-browser; no sample videos enter the published JSON.
const videos = Array.from({ length: 6 }, (_, index) => ({
  id: `video-${index + 1}`,
  videoUrl: `https://www.youtube.com/watch?v=testVid000${index + 1}`,
  category: 'Conversations',
  title: index === 1 ? 'සිංහල தமிழ் perspectives' : `Test conversation ${index + 1}`,
  description: 'A description that can wrap naturally without clipping the card content.',
  date: '2026-10-01',
}));

async function mockMedia(page: Page) {
  await page.route('https://img.youtube.com/**', (route) => {
    if (route.request().url().includes('testVid0001/maxresdefault')) {
      return route.fulfill({ status: 404 });
    }
    return route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#245741"/><circle cx="640" cy="360" r="160" fill="#baf19c"/></svg>',
    });
  });
  await page.route('https://www.youtube-nocookie.com/embed/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><body style="margin:0;background:#123e30;color:white">Intercepted test player</body></html>',
    }),
  );
}

async function openSection(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('.sv-news').scrollIntoViewIfNeeded();
  await expect(page.locator('.sv-news__card')).toHaveCount(6);
}

test('YouTube URLs, embed modes, editable blanks and malformed dates are handled', () => {
  const id = 'testVid0001';
  for (const url of [
    `https://youtube.com/watch?v=${id}&t=12`,
    `https://youtu.be/${id}`,
    `https://youtube.com/shorts/${id}`,
    `https://youtube.com/embed/${id}`,
  ])
    expect(getYouTubeVideoId(url)).toBe(id);
  expect(getYouTubeVideoId(`https://youtube.com.evil.test/watch?v=${id}`)).toBeNull();
  expect(getYouTubeVideoId('javascript:alert(1)')).toBeNull();
  expect(getYouTubeVideoId('https://youtu.be/short')).toBeNull();
  const preview = new URL(getYouTubeEmbedUrl(id, { muted: true, controls: false, loop: true })!);
  expect(Object.fromEntries(preview.searchParams)).toMatchObject({
    autoplay: '1',
    mute: '1',
    controls: '0',
    loop: '1',
    playlist: id,
    playsinline: '1',
  });
  const modal = new URL(getYouTubeEmbedUrl(id)!);
  expect(Object.fromEntries(modal.searchParams)).toMatchObject({
    autoplay: '1',
    mute: '0',
    controls: '1',
  });
  expect(parseNewsVideos([{ videoUrl: '' }])).toEqual([]);
  expect(parseNewsVideos([videos[0], videos[0]])).toHaveLength(1);
  expect(() => parseNewsVideos([{ ...videos[0], date: '2026-02-30' }])).toThrow();
  expect(() => parseNewsVideos([{ videoUrl: 'https://example.com/video' }])).toThrow();
  expect(parseNewsVideos([{ videoUrl: videos[0].videoUrl }])[0].title).toBe('Watch video');
});

test.describe('Latest Insights', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockMedia(page);
    await page.route('**/data/newsVideos.json', (route) => route.fulfill({ json: videos }));
  });

  for (const width of [1920, 1440, 1280, 1100, 1024, 900, 768, 640, 430, 393, 390, 375, 360]) {
    test(`responsive carousel at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await openSection(page);
      await expect(page.locator('.sv-news')).toHaveCSS('background-color', 'rgb(237, 247, 232)');
      expect(
        await page
          .locator('.sv-news')
          .evaluate((element) =>
            element.previousElementSibling?.classList.contains('sv-chairman-quote'),
          ),
      ).toBe(true);
      const carousel = await page.locator('.sv-news__carousel').boundingBox();
      const slide = await page.locator('.sv-news__carousel .swiper-slide').first().boundingBox();
      const thumb = await page.locator('.sv-news__thumbnail').first().boundingBox();
      const count = width >= 1100 ? 3 : width >= 768 ? 2 : width >= 640 ? 1.35 : 1.1;
      const gap = width >= 1100 ? 24 : width >= 768 ? 20 : width >= 640 ? 18 : 16;
      expect(slide!.width).toBeCloseTo((carousel!.width - gap * (count - 1)) / count, 0);
      expect(thumb!.width / thumb!.height).toBeCloseTo(16 / 9, 1);
      const navigation = page.locator('.sv-news__navigation');
      if (width <= 900) await expect(navigation).toBeHidden();
      else await expect(navigation).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.locator('.sv-news iframe')).toHaveCount(0);
      expect(errors).toEqual([]);
      if (width === 1440 || width === 390) {
        await page
          .locator('.sv-news')
          .screenshot({ path: test.info().outputPath(`insights-${width}.png`) });
      }
    });
  }

  test('thumbnail fallback, manual navigation and keyboard modal lifecycle', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openSection(page);
    await expect(page.locator('.sv-news__thumbnail img').first()).toHaveAttribute(
      'src',
      /hqdefault/,
    );
    await expect(page.getByText('සිංහල தமிழ் perspectives', { exact: true })).toBeVisible();
    const slides = page.locator('.sv-news__carousel .swiper-wrapper');
    const before = await slides.evaluate((element) => getComputedStyle(element).transform);
    await page.getByRole('button', { name: 'Next videos' }).click();
    await expect
      .poll(() => slides.evaluate((element) => getComputedStyle(element).transform))
      .not.toBe(before);
    await page.getByRole('button', { name: 'Previous videos' }).click();
    const button = page.getByRole('button', { name: `Play ${videos[0].title}`, exact: true });
    await button.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: videos[0].title });
    await expect(dialog).toBeVisible();
    await expect(page.locator('.sv-news-modal iframe')).toHaveCount(1);
    const source = new URL((await page.locator('.sv-news-modal iframe').getAttribute('src'))!);
    expect(source.searchParams.get('controls')).toBe('1');
    expect(source.searchParams.get('mute')).toBe('0');
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expect(page.getByRole('button', { name: 'Close video' })).toBeFocused();
    await dialog.locator('h3').click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(button).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    await button.press('Space');
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: 'Close video' }).click();
    await expect(page.locator('.sv-news-modal iframe')).toHaveCount(0);
    await button.click();
    await expect(dialog).toBeVisible();
    await page.locator('.sv-news-modal').click({ position: { x: 4, y: 4 } });
    await expect(dialog).toHaveCount(0);
    await expect(button).toBeFocused();
  });

  test('hover intent, single muted preview, leave and resize cleanup', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openSection(page);
    const cards = page.locator('.sv-news__card');
    await cards.first().hover();
    await page.waitForTimeout(60);
    await page.locator('.sv-news__intro').hover();
    await page.waitForTimeout(200);
    await expect(page.locator('.sv-news__preview')).toHaveCount(0);
    await cards.first().hover();
    await expect(page.locator('.sv-news__preview[data-ready="true"]')).toHaveCount(1);
    const src = new URL((await page.locator('.sv-news__preview').getAttribute('src'))!);
    expect(Object.fromEntries(src.searchParams)).toMatchObject({
      autoplay: '1',
      mute: '1',
      controls: '0',
      loop: '1',
      playlist: 'testVid0001',
    });
    await cards.nth(1).hover();
    await expect(page.locator('.sv-news__preview')).toHaveCount(1);
    await expect(cards.nth(1).locator('.sv-news__preview')).toHaveCount(1);
    await page.locator('.sv-news__intro').hover();
    await expect(page.locator('.sv-news__preview')).toHaveCount(0);
    await cards.first().hover();
    await expect(page.locator('.sv-news__preview')).toHaveCount(1);
    await page.setViewportSize({ width: 900, height: 1000 });
    await expect(page.locator('.sv-news__preview')).toHaveCount(0);
    await cards.first().hover();
    await page.waitForTimeout(250);
    await expect(page.locator('.sv-news__preview')).toHaveCount(0);
  });

  test('closing removes playback before the modal exit animation finishes', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openSection(page);
    await page.locator('.sv-news__thumbnail').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('.sv-news-modal iframe')).toHaveCount(1);
    await page.getByRole('button', { name: 'Close video' }).click();
    await expect(page.locator('.sv-news-modal iframe')).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    await expect(page.locator('.sv-news-modal')).toHaveCount(0);
  });

  test('reduced motion disables previews; desktop modal traps and restores focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openSection(page);
    await page.locator('.sv-news__card').first().hover();
    await page.waitForTimeout(250);
    await expect(page.locator('.sv-news__preview')).toHaveCount(0);
    await page.locator('.sv-news__thumbnail').first().click();
    const close = page.getByRole('button', { name: 'Close video' });
    await expect(close).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('IFRAME');
    // Simulate a Tab at the outer document boundary of a cross-origin player.
    await page.evaluate(() =>
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
      ),
    );
    await expect(close).toBeFocused();
    expect(
      await page
        .locator('body > div')
        .first()
        .evaluate((element) => (element as HTMLElement).inert),
    ).toBe(true);
    await close.click();
    expect(
      await page
        .locator('body > div')
        .first()
        .evaluate((element) => (element as HTMLElement).inert),
    ).toBe(false);
  });

  test('empty editable JSON and failed fetch retry', async ({ page }) => {
    let attempts = 0;
    await page.route('**/data/newsVideos.json', (route) => {
      attempts++;
      return attempts === 1
        ? route.fulfill({ status: 503 })
        : route.fulfill({ json: [{ videoUrl: '' }] });
    });
    await page.goto('/');
    await page.locator('.sv-news').scrollIntoViewIfNeeded();
    await expect(page.getByText('We couldn’t load the videos. Please try again.')).toBeVisible();
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByText('No videos have been published yet.')).toBeVisible();
    await expect(page.locator('.sv-news__card')).toHaveCount(0);
  });

  test('touch swipes without playback and tapping opens a viewport-sized player', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await mockMedia(page);
    await page.route('**/data/newsVideos.json', (route) => route.fulfill({ json: videos }));
    await openSection(page);
    const wrapper = page.locator('.sv-news__carousel .swiper-wrapper');
    const before = await wrapper.evaluate((element) => getComputedStyle(element).transform);
    const card = await page.locator('.sv-news__thumbnail').first().boundingBox();
    const cdp = await context.newCDPSession(page);
    const y = card!.y + card!.height / 2;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 300, y }],
    });
    for (const x of [260, 220, 180, 140, 100, 60]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect
      .poll(() => wrapper.evaluate((element) => getComputedStyle(element).transform))
      .not.toBe(before);
    await expect(page.locator('.sv-news iframe, .sv-news-modal iframe')).toHaveCount(0);
    await page.getByRole('button', { name: `Play ${videos[1].title}`, exact: true }).tap();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
    const player = await page.locator('.sv-news-modal__player').boundingBox();
    expect(player!.width / player!.height).toBeCloseTo(16 / 9, 1);
    await page.getByRole('button', { name: 'Close video' }).tap();
    await expect(page.locator('.sv-news-modal iframe')).toHaveCount(0);
    await context.close();
  });
});
