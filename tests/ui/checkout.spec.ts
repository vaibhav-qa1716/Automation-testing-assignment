import { openSauceDemo } from '../../utils/ui-navigation';
import { test, expect } from '@playwright/test';

async function reachCheckout(page: import('@playwright/test').Page) {
  await openSauceDemo(page);
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
}

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => reachCheckout(page));

  test('requires first name', async ({ page }) => {
    await page.getByTestId('lastName').fill('Patil');
    await page.getByTestId('postalCode').fill('411001');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('First Name is required');
  });

  test('requires last name', async ({ page }) => {
    await page.getByTestId('firstName').fill('Vaibhav');
    await page.getByTestId('postalCode').fill('411001');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('Last Name is required');
  });

  test('requires postal code', async ({ page }) => {
    await page.getByTestId('firstName').fill('Vaibhav');
    await page.getByTestId('lastName').fill('Patil');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toContainText('Postal Code is required');
  });

  test('continues to order overview with valid customer details', async ({ page }) => {
    await page.getByTestId('firstName').fill('Vaibhav');
    await page.getByTestId('lastName').fill('Patil');
    await page.getByTestId('postalCode').fill('411001');
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByText('Payment Information')).toBeVisible();
    await expect(page.getByText('Shipping Information')).toBeVisible();
  });

  test('calculates total as subtotal plus tax', async ({ page }) => {
    await page.getByTestId('firstName').fill('Vaibhav');
    await page.getByTestId('lastName').fill('Patil');
    await page.getByTestId('postalCode').fill('411001');
    await page.getByTestId('continue').click();

    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const totalText = await page.locator('.summary_total_label').textContent();
    const amount = (value: string | null) => Number(value?.match(/\$([\d.]+)/)?.[1]);

    expect(amount(totalText)).toBeCloseTo(amount(subtotalText) + amount(taxText), 2);
  });

  test('completes an order successfully', async ({ page }) => {
    await page.getByTestId('firstName').fill('Vaibhav');
    await page.getByTestId('lastName').fill('Patil');
    await page.getByTestId('postalCode').fill('411001');
    await page.getByTestId('continue').click();
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  });

  test('allows the user to cancel checkout details', async ({ page }) => {
    await page.getByTestId('cancel').click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
