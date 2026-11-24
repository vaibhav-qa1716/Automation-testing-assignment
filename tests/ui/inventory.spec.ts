import { openSauceDemo } from '../../utils/ui-navigation';
import { test, expect } from '@playwright/test';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await openSauceDemo(page);
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('shows six products', async ({ page }) => {
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('sorts products by name ascending', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('az');
    const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sorts products by price ascending', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');
    const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents())
      .map(value => Number(value.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('opens product details from its name', async ({ page }) => {
    await page.getByText('Sauce Labs Backpack').click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByTestId('add-to-cart')).toBeVisible();
  });
});
