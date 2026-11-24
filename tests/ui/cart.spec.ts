import { openSauceDemo } from '../../utils/ui-navigation';
import { test, expect } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await openSauceDemo(page);
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => login(page));

  test('adds one product and updates the cart badge', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('adds multiple products and displays the correct count', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('shows the selected product in the cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });

  test('removes a product from the cart', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(page.locator('.cart_quantity')).toHaveCount(0);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });
});
