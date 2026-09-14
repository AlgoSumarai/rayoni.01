import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop content, service selection and quotation submission', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Building today.');
  await page.locator('img').evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (img) => {
        (img as HTMLImageElement).loading = 'eager';
        await (img as HTMLImageElement).decode();
      }),
    );
  });
  const images = await page
    .locator('img')
    .evaluateAll((images) =>
      images
        .filter(
          (img) =>
            !(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalWidth === 0,
        )
        .map((img) => img.getAttribute('src')),
    );
  expect(images).toEqual([]);
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  const card = page
    .locator('.service-card')
    .filter({ has: page.getByRole('heading', { name: 'Construction & property', exact: true }) });
  await card.getByText('Explore services', { exact: true }).click();
  await expect(
    card.getByText('Air-conditioning installation and repairs', { exact: true }),
  ).toBeVisible();
  await card.getByRole('link', { name: 'Request a quote' }).click();
  await expect(page.getByLabel('Service category')).toHaveValue('construction');
  await page.getByLabel('Full name').fill('Website QA');
  await page.getByLabel('Company / organisation').fill('Local test');
  await page.getByLabel('Email address').fill('qa@example.com');
  await page.getByLabel('Phone number').fill('+27 11 555 0100');
  await page
    .getByLabel('Tell us about your project')
    .fill('Local automated test: request a construction quotation.');
  await page.getByLabel('Project / service location').fill('Westonaria');
  await page
    .locator('input[type=file]')
    .setInputFiles({
      name: 'test-rfq.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\nTest RFQ'),
    });
  await expect(page.getByText('test-rfq.pdf', { exact: false })).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Submit quotation request' }).click();
  await expect(page.getByRole('heading', { name: 'Your brief is in.' })).toBeVisible();
  await expect(page.locator('.reference')).toContainText('RYN-');
  expect(errors).toEqual([]);
});

test('mobile navigation, contact submission and no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('img').evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (img) => {
        (img as HTMLImageElement).loading = 'eager';
        await (img as HTMLImageElement).decode();
      }),
    );
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.screenshot({ path: 'test-results/hero-mobile.png' });
  await page.locator('#services').screenshot({ path: 'test-results/services-mobile.png' });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation')).toBeHidden();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('navigation')).toBeHidden();
  await page.getByLabel('Full name').fill('Mobile QA');
  await page.getByLabel('Email address').fill('mobile@example.com');
  await page.getByLabel('Your message').fill('A local test of the contact form on mobile.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your message is in.' })).toBeVisible();
  await page.goto('/request-a-quote');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'test-results/quote-mobile.png', fullPage: true });
});

test('accessible home and quotation form', async ({ page }) => {
  await page.goto('/');
  let results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
  await page.goto('/request-a-quote');
  results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(
    results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
});

test('network failure keeps the enquiry available for retry', async ({ page }) => {
  await page.goto('/#contact');
  await page.route('**/api/enquiries', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Your enquiry could not be saved. Please try again shortly.' }),
    }),
  );
  await page.getByLabel('Full name').fill('Retry QA');
  await page.getByLabel('Email address').fill('retry@example.com');
  await page
    .getByLabel('Your message')
    .fill('Please retain this text if the server is unavailable.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('could not be saved');
  await expect(page.getByLabel('Your message')).toHaveValue(
    'Please retain this text if the server is unavailable.',
  );
});

test('small phones and tablets keep both pages within the viewport', async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/request-a-quote']) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
});
