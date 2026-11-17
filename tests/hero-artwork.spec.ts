import { expect, test } from '@playwright/test';

for (const width of [320, 390, 768, 1440]) {
  test(`mascot links stay accessible and clear of hero content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?lang=fr');
    const artwork = page.locator('.hero-art');
    await expect(artwork.locator('a')).toHaveCount(3);
    await expect(artwork.locator('img')).toHaveCount(3);
    await expect(page.locator('.hero-art__tux img')).toHaveAttribute('src', '/mascots/tux.png');
    expect(await page.locator('.hero-art__tux img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBe(265);
    await expect(page.locator('.hero__frame')).toHaveCount(0);
    expect(await artwork.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');
    for (const link of await artwork.locator('a').all()) {
      expect(await link.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('auto');
      await expect(link).toHaveAccessibleName(/Linux|Docker|Go/);
    }
    for (const image of await artwork.locator('img').all()) {
      await expect(image).toHaveAttribute('alt', '');
      expect(await image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      expect(await image.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => {
      const mascots = [...document.querySelectorAll('.hero-art img')].map((el) => el.getBoundingClientRect());
      const content = [...document.querySelectorAll('.hero__content h1, .hero__actions a, .hero__credits')].map((el) => el.getBoundingClientRect());
      return mascots.every((a) => content.every((b) =>
        a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom
      ));
    })).toBe(true);
    await expect(page.locator('.hero__actions a').first()).toHaveAttribute('href', '/#projects');
    await expect(page.locator('.hero__credits')).toHaveAccessibleName('Crédits des illustrations');
    const credits = await page.request.get('/mascots/CREDITS.md');
    expect(credits.ok()).toBe(true);
  });
}

test('mascots and hero actions render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  await expect(page.locator('.hero-art img')).toHaveCount(3);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Abdulmalek');
  await expect(page.locator('.hero__actions a').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Linux · homelab notes' })).toHaveAttribute('href', '/blog/building-a-homelab');
  await expect(page.locator('#hero-lab')).not.toHaveAttribute('open', '');
  await page.locator('#hero-lab summary').click();
  await expect(page.locator('.hero__terminal')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

for (const route of ['/', '/blog', '/blog/building-a-homelab']) {
  test(`flowing lines cover the whole page on ${route}`, async ({ page }) => {
    await page.goto(route);
    const lines = page.locator('.site-lines');
    await expect(lines).toHaveAttribute('aria-hidden', 'true');
    expect(await lines.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');
    expect(await lines.evaluate((el) => getComputedStyle(el, '::before').backgroundImage)).toContain('/photos/site-lines.svg');
    expect(await lines.evaluate((el) =>
      el.getBoundingClientRect().height === document.getElementById('__site')!.getBoundingClientRect().height
    )).toBe(true);
    const asset = await page.request.get('/photos/site-lines.svg');
    expect(asset.ok()).toBe(true);
  });
}

test('mascot labels support focus, dismissal, and real project destinations', async ({ page }) => {
  await page.goto('/');
  const tux = page.getByRole('link', { name: 'Linux · homelab notes' });
  await tux.focus();
  await expect(tux.locator('.hero-art__label')).toHaveCSS('opacity', '1');
  await page.keyboard.press('Escape');
  await expect(tux.locator('.hero-art__label')).toHaveCSS('opacity', '0');
  await expect(tux).toBeFocused();
  const docker = page.getByRole('link', { name: 'Docker · Nostroguard source' });
  await docker.focus();
  await expect(docker.locator('.hero-art__label')).toHaveCSS('opacity', '1');
  await expect(docker).toHaveAttribute('href', 'https://github.com/7n4xt/Nostroguard');
  await expect(page.getByRole('link', { name: 'Go · Forum-Go source' })).toHaveAttribute('href', 'https://github.com/7n4xt/Forum-go');
  await tux.focus();
  await expect(tux.locator('.hero-art__label')).toHaveCSS('opacity', '1');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/blog\/building-a-homelab/);
});

test('mobile terminal is keyboard-expandable and desktop stays open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lang=fr');
  const lab = page.locator('#hero-lab');
  await expect(lab).not.toHaveAttribute('open', '');
  await expect(page.locator('.hero__terminal')).toBeHidden();
  await expect(lab.locator('summary')).toContainText('Dans mon homelab');
  await lab.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(lab).toHaveAttribute('open', '');
  await expect(page.locator('.hero__terminal')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(lab).not.toHaveAttribute('open', '');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(lab).toHaveAttribute('open', '');
  await expect(lab.locator('summary')).toBeHidden();
  await expect(page.locator('.hero__terminal')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(lab).not.toHaveAttribute('open', '');
});

test('network packet plays once and disappears', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const packet = page.locator('.site-lines__packet use');
  await expect(packet).toHaveAttribute('href', '/photos/site-lines.svg#packet-route');
  await expect(packet).toHaveCSS('animation-iteration-count', '1');
  await packet.evaluate((el) => el.getAnimations().forEach((animation) => animation.finish()));
  await expect(packet).toHaveCSS('opacity', '0');
  await page.goto('/blog');
  await expect(page.locator('.site-lines__packet')).toHaveCount(0);
});

test('reduced motion suppresses the network packet', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.site-lines__packet')).toBeHidden();
  await expect(page.locator('.site-lines__packet use')).toHaveCSS('animation-name', 'none');
});
