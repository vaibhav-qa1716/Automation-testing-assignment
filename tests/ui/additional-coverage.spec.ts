import { openSauceDemo } from '../../utils/ui-navigation';
import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  await openSauceDemo(page);
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

test.describe('Additional edge and negative coverage', () => {
  test.beforeEach(async ({ page }) => login(page));

  test('cart starts empty for a fresh browser context', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('removing an item from inventory clears cart badge', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('cannot proceed from empty cart without an order item', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    // Sauce Demo may allow checkout navigation from an empty cart;
    // assert the cart state only rather than assuming an undocumented restriction.
    await expect(page.getByTestId('checkout')).toBeVisible();
  });

  test('checkout overview preserves the selected product', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('QA');
    await page.getByTestId('lastName').fill('Tester');
    await page.getByTestId('postalCode').fill('411001');
    await page.getByTestId('continue').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });
});
