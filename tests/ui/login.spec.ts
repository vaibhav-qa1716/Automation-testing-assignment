import { openSauceDemo } from '../../utils/ui-navigation';
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await openSauceDemo(page);
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('shows an error for an incorrect password', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('wrong-password');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toContainText('Username and password do not match');
  });

  test('requires a username', async ({ page }) => {
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toContainText('Username is required');
  });

  test('requires a password', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error')).toContainText('Password is required');
  });


});
