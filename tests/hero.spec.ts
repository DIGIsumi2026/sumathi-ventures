import { test, expect, type Page } from '@playwright/test';

const viewports = [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1280, 800],
    [1024, 768],
    [900, 1200],
    [768, 1024],
    [430, 932],
    [393, 852],
    [390, 844],
    [375, 812],
    [360, 740],
    [320, 667],
];
const hero = '.sv-hero-carousel';
const copy = `${hero} .sv-hero-carousel__copy:not([hidden])`;

async function openHero(page: Page) {
    await page.goto('/');
    await expect(page.locator(hero)).toHaveAttribute('data-ready', 'true');
    await page.evaluate(() => document.fonts.ready);
}

test.describe('All slides at every requested viewport', () => {
    test.use({ reducedMotion: 'reduce' });
    for (const [width, height] of viewports) {
        test(`${width}x${height}: content, images, controls and CTA destinations`, async ({
            page,
        }, testInfo) => {
            await page.setViewportSize({ width, height });
            await openHero(page);
            const count = await page.locator(`${hero} .swiper-slide`).count();
            for (let index = 0; index < count; index++) {
                await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', String(index));
                await expect(page.locator(`${hero} .swiper-slide-active img`)).toHaveJSProperty(
                    'complete',
                    true,
                );
                expect(
                    await page
                        .locator(`${hero} .swiper-slide-active img`)
                        .evaluate((image: HTMLImageElement) => image.naturalWidth),
                ).toBeGreaterThan(0);
                await expect(page.locator(`${hero} .swiper-slide-active img`)).toHaveCSS(
                    'object-fit',
                    width <= 900 && width <= height ? 'contain' : 'cover',
                );
                await expect(page.locator(`${copy} .sv-button`)).toHaveAttribute(
                    'href',
                    /\/investment-focus\//,
                );
                await expect(page.locator(`${copy} .sv-hero-carousel__secondary`)).toHaveAttribute(
                    'href',
                    '/contact/',
                );
                const layout = await page.evaluate(
                    ({ hero, copy }) => {
                        const bounds = document.querySelector(hero)!.getBoundingClientRect();
                        const header = document
                            .querySelector('.sv-header')!
                            .getBoundingClientRect();
                        const active = document.querySelector(copy)!;
                        const content = active.getBoundingClientRect();
                        const controls = document
                            .querySelector('.sv-hero-carousel__footer')!
                            .getBoundingClientRect();
                        const clipped = Array.from(
                            active.querySelectorAll<HTMLElement>(
                                'h1, p, a, .sv-hero-carousel__quote-line',
                            ),
                        )
                            .filter((element) => {
                                const rect = element.getBoundingClientRect();
                                return (
                                    rect.left < bounds.left - 1 ||
                                    rect.right > bounds.right + 1 ||
                                    rect.top < header.bottom - 1 ||
                                    rect.bottom > controls.top + 1 ||
                                    element.scrollWidth > element.clientWidth + 1
                                );
                            })
                            .map((element) => element.className || element.tagName);
                        return {
                            clipped,
                            height: bounds.height,
                            overlap: content.bottom > controls.top,
                            overflow: document.documentElement.scrollWidth > window.innerWidth,
                        };
                    },
                    { hero, copy },
                );
                expect(layout, `Slide ${index + 1}`).toMatchObject({
                    clipped: [],
                    height,
                    overlap: false,
                    overflow: false,
                });
                if ([1440, 768, 390, 320].includes(width)) {
                    await page.screenshot({ path: testInfo.outputPath(`slide-${index + 1}.png`) });
                }
                await page.getByRole('button', { name: 'Next slide', exact: true }).click();
            }
            await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', '0');
            await expect(page.getByRole('button', { name: 'Pause slideshow' })).toHaveCount(0);
            await expect(page.locator(`${copy} .sv-hero-carousel__quote-line`).first()).toHaveCSS(
                'clip-path',
                'none',
            );
            if (width <= 600)
                await expect(page.locator('.sv-hero-carousel__pagination')).toBeHidden();
        });
    }
});

test('Stationary left-to-right reveal, image pop and rapid manual navigation', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHero(page);
    await page.getByRole('button', { name: 'Next slide', exact: true }).click();
    const line = page.locator(`${copy} .sv-hero-carousel__quote-line`).first();
    const start = await line.boundingBox();
    await expect(line).toHaveCSS('clip-path', 'inset(0px 100% 0px 0px)');
    const image = page.locator(`${hero} .swiper-slide-active img`);
    await expect(image).toHaveCSS('animation-duration', '10s');
    await expect(image).toHaveCSS('animation-name', 'svHeroImagePop');
    await expect(line).toHaveCSS('clip-path', 'inset(0px 0% 0px 0px)', { timeout: 7000 });
    const end = await line.boundingBox();
    expect(end!.x).toBeCloseTo(start!.x, 0);
    expect(end!.y).toBeCloseTo(start!.y, 0);
    await expect(line).toHaveCSS('transform', 'none');
    for (let index = 0; index < 7; index++) {
        await page.getByRole('button', { name: 'Next slide', exact: true }).click({ force: true });
        await page.waitForTimeout(80);
    }
    await expect(page.locator(copy)).toHaveCount(1);
    await expect(page.locator(`${copy} .sv-hero-carousel__quote-line`).last()).toHaveCSS(
        'clip-path',
        'inset(0px 0% 0px 0px)',
        { timeout: 7500 },
    );
    const current = await page
        .locator(`${hero} .swiper`)
        .evaluate((element: any) => element.swiper.realIndex);
    await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', String(current));
    expect(errors).toEqual([]);
});

test('Autoplay continues on hover and pauses for focus and offscreen content', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHero(page);
    const progress = () =>
        page
            .locator(hero)
            .evaluate((element) =>
                Number(getComputedStyle(element).getPropertyValue('--sv-hero-progress')),
            );
    await page.mouse.move(-5, -5);
    await expect.poll(progress).toBeGreaterThan(0.05);
    await expect(page.getByRole('button', { name: /Pause slideshow|Play slideshow/ })).toHaveCount(0);
    await expect(page.locator('.sv-hero-carousel__meta')).toHaveCount(0);
    await expect(page.locator('.sv-hero-carousel__meta-line')).toHaveCount(0);
    await page.mouse.move(1200, 250);
    const hovered = await progress();
    await expect.poll(progress).toBeGreaterThan(hovered + 0.05);
    await page.locator(`${copy} .sv-button`).focus();
    const paused = await progress();
    await page.waitForTimeout(600);
    expect(await progress()).toBeCloseTo(paused, 1);
    await page.locator('.skip-link').focus();
    await expect.poll(progress).toBeGreaterThan(paused + 0.03);
    await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', '1', { timeout: 8500 });
    expect(await progress()).toBeLessThan(0.1);
    await page.waitForTimeout(1300);
    expect(await progress()).toBeLessThan(0.25);
    await page
        .locator('.sv-intro')
        .evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await expect(page.locator(hero)).toHaveAttribute('data-motion-paused', 'true');
    const offscreen = await progress();
    await page.waitForTimeout(500);
    expect(await progress()).toBeCloseTo(offscreen, 1);
});

test('Keyboard pagination and resizing desktop to mobile and back', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHero(page);
    await page.getByRole('button', { name: 'Show hero slide 3' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', '2');
    await expect(page.locator(`${copy} .sv-hero-carousel__quote-line`).first()).toHaveText(
        'Technology That Moves',
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(`${copy} .sv-hero-carousel__quote-line`).first()).toHaveText(
        'Technology That',
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator(`${copy} .sv-hero-carousel__quote-line`).first()).toHaveText(
        'Technology That Moves',
    );
    await page.getByRole('button', { name: 'Previous slide', exact: true }).click();
    await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', '1');
});

test('Touch swipe changes the active slide', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 393, height: 852 },
        hasTouch: true,
        isMobile: true,
        reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await openHero(page);
    const session = await context.newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: 340, y: 180 }],
    });
    for (const x of [280, 220, 160, 100, 40]) {
        await session.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x, y: 180 }],
        });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', '1');
    await context.close();
});

test('Every mobile slide replays its stationary reveal and keeps the group image contained', async ({
    page,
}, testInfo) => {
    test.setTimeout(45000);
    await page.setViewportSize({ width: 390, height: 844 });
    await openHero(page);
    await page.locator(`${copy} .sv-button`).focus();
    const count = await page.locator(`${hero} .swiper-slide`).count();
    for (let index = 0; index < count; index++) {
        await expect(page.locator(copy)).toHaveAttribute('data-hero-copy', String(index));
        const line = page.locator(`${copy} .sv-hero-carousel__quote-line`).last();
        const start = await line.boundingBox();
        await expect(line).toHaveCSS('clip-path', 'inset(0px 0% 0px 0px)', { timeout: 7000 });
        const finish = await line.boundingBox();
        expect(finish!.x).toBeCloseTo(start!.x, 0);
        expect(finish!.y).toBeCloseTo(start!.y, 0);
        await expect(page.locator(`${copy} .sv-hero-carousel__eyebrow`)).toHaveCSS('opacity', '1');
        await expect(page.locator(`${copy} .sv-hero-carousel__actions`)).toHaveCSS('opacity', '1');
        await expect(page.locator(`${hero} .swiper-slide-active img`)).toHaveCSS(
            'object-fit',
            'contain',
        );
        await page.screenshot({
            path: testInfo.outputPath(`mobile-motion-slide-${index + 1}.png`),
        });
        await page.getByRole('button', { name: 'Next slide', exact: true }).click();
    }
});
