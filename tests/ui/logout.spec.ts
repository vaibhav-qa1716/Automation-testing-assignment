import { openSauceDemo } from '../../utils/ui-navigation';
import { test, expect } from '@playwright/test';

test('logs out and returns to the login page', async ({ page }) => {
  await openSauceDemo(page);
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByTestId('logout-sidebar-link').click();

  await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
  await expect(page.getByTestId('login-button')).toBeVisible();
});
