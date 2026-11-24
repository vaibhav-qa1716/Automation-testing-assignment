import { expect, type Page } from '@playwright/test';

/** Open the real public shop and fail quickly with an actionable message if it is not the login page. */
export async function openSauceDemo(page: Page): Promise<void> {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  const username = page.getByTestId('username');
  try {
    await expect(username).toBeVisible({ timeout: 8_000 });
  } catch (error) {
    const title = await page.title().catch(() => '(unavailable)');
    const snippet = (await page.locator('body').innerText({ timeout: 2_000 }).catch(() => '(unavailable)')).slice(0, 500);
    throw new Error(`SauceDemo login page not detected. URL: ${page.url()}; HTTP status: ${response?.status() ?? 'unknown'}; title: ${title}; page text: ${snippet}. Check SAUCEDEMO_BASE_URL, network/proxy and whether the page loads manually. Original error: ${String(error)}`);
  }
}
