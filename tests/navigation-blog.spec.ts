import { expect, test } from '@playwright/test';

for (const width of [320, 390]) {
  test(`mobile menu follows forward tab order at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?lang=fr');
    const toggle = page.getByRole('button', { name: 'Ouvrir le menu' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(page.locator('.nav__link').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await expect(page.locator('.nav__link').first()).toBeFocused();
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    await expect(page.locator('.hero__actions a').first()).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
}

test('menu closes after navigation, outside click, and desktop resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.nav__toggle');
  await toggle.click();
  await page.locator('.nav__link[href="/#about"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.locator('main').click({ position: { x: 10, y: 450 } });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#primary-navigation')).toBeVisible();
});

test('all topics remain filterable although previews show only two', async ({ page }) => {
  await page.goto('/blog');
  const cards = page.locator('#blog-grid .post-card');
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);
  await expect(page.locator('#blog-count')).toHaveText(`${total} articles`);
  await expect(page.locator('.blog__filter')).toHaveCount(0);
  for (const card of await cards.all()) {
    expect(await card.locator('.post-card__tag').count()).toBeLessThanOrEqual(2);
  }
  await page.getByLabel('Filter by topic').selectOption('backend');
  await expect(page.locator('#blog-grid .post-card:visible')).toHaveCount(1);
  await expect(page.locator('#blog-count')).toHaveText('1 article');
  await expect(page.locator('#blog-grid .post-card:visible h2')).toContainText('ELPIDA');
  await page.getByRole('button', { name: 'FR — Français' }).click();
  await expect(page.getByLabel('Filtrer par sujet')).toHaveValue('backend');
  await expect(page.locator('#blog-count')).toHaveText('1 article');
  await page.getByLabel('Filtrer par sujet').selectOption('');
  await expect(page.locator('#blog-grid .post-card:visible')).toHaveCount(total);
  await page.getByLabel('Filtrer par sujet').selectOption('homelab');
  await expect(page.locator('#blog-grid .post-card:visible')).toHaveCount(2);
  await expect(page.locator('#blog-count')).toHaveText('2 articles');
});

test('article topics use a keyboard-accessible disclosure', async ({ page }) => {
  await page.goto('/blog/stage-elpida-consulting');
  const topics = page.locator('.article__topics');
  await expect(topics).not.toHaveAttribute('open', '');
  await expect(topics.locator('.article__tag:visible')).toHaveCount(0);
  await topics.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(topics.locator('.article__tag:visible')).toHaveCount(7);
  await expect(topics.locator('.article__tag').last()).toHaveText('backend');
});

test('mobile navigation and articles remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/blog');
  await expect(page.locator('#primary-navigation')).toBeVisible();
  await expect(page.locator('.nav__toggle')).toBeHidden();
  await expect(page.locator('#lang-switch')).toBeHidden();
  await expect(page.locator('#blog-tools')).toBeHidden();
  expect(await page.locator('#blog-grid .post-card:visible').count()).toBeGreaterThan(0);
  await page.locator('#blog-grid .post-card').first().getByRole('link').click();
  await page.locator('.article__topics summary').click();
  await expect(page.locator('.article__tag:visible')).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
