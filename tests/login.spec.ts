import { test, expect } from '@playwright/test';
import { PASSWORD, validUsers, lockedUsers } from '../test-data/users';

test.describe('Valid users can sign in', () => {
  for (const username of validUsers) {
    test(`login succeeds for ${username}`, async ({ page }) => {
      //prediction : valid users can sign in and redirct to /inventory.html
      await page.goto('https://www.saucedemo.com/');
      await page.getByTestId('username').fill(username);
      await page.getByTestId('password').fill(PASSWORD);
      await page.getByTestId('login-button').click();

      await expect(page).toHaveURL(/inventory.html/);
    });
  }
});

test.describe('Locked users cannot sign in', () => {
  for (const username of lockedUsers) {
    test(`login is blocked for ${username}`, async ({ page }) => {
    //prediction: locked users can not login with valid username and password
      await page.goto('https://www.saucedemo.com/');
      await page.getByTestId('username').fill(username);
      await page.getByTestId('password').fill(PASSWORD);
      await page.getByTestId('login-button').click();

      await expect(page.getByTestId('error')).toContainText(
        'this user has been locked out'
      );
    });
  }

  test('login fails with a valid username and wrong password', async ({ page }) => {
    // prediction: a valid username with a wrong password shows a mismatch error and stays on the login page
    await page.goto('https://www.saucedemo.com/');
    await page.getByTestId('username').fill(validUsers[0]);
    await page.getByTestId('password').fill('wrong_password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  test('login fails with username filled and password blank', async ({ page }) => {
    // prediction: a missing password shows "Password is required"
    await page.goto('https://www.saucedemo.com/');
    await page.getByTestId('username').fill(validUsers[0]);
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('Epic sadface: Password is required');
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  test('Blank fields cannot sign in', async ({ page }) => {
    // prediction: submitting an empty form shows "Username is required
    await page.goto('https://www.saucedemo.com/');
    await page.getByTestId('username').fill(validUsers[0]);
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('Epic sadface: Username is required');
    await expect(page).not.toHaveURL(/inventory.html/);
  });
});
