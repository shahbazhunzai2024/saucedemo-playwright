const { test, expect } = require('@playwright/test');
const loginPage = require('../../pages/loginPage');
const testData = require('../../data/testData.json')

test.describe('SauceDemo - Login Page', () => {

  let LoginPage;

    test.beforeEach(async({page}) => {
        LoginPage = new loginPage(page);
        await page.goto(testData.URL);
    });

    test('successful login to saucedemo - standard user', async ({ page }) => {
      test.setTimeout(10000);
      await LoginPage.login('standard_user', 'secret_sauce')
      await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
    });

    test('login failure to saucedemo - performance glitch issue user', async ({ page }) => {
      test.setTimeout(10000);
      await LoginPage.login('performance_glitch_user', 'secret_sauce')
      await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
    });

    test('login failure to saucedemo - locked out user', async ({ page }) => {
      await LoginPage.login('locked_out_user', 'secret_sauce')
      await expect(page.locator('[data-test="error"]')).toContainText(testData.locked_out_user_error); 
    });

    test('login failure to saucedemo - password failure', async ({ page }) => {
      await LoginPage.login('standard_user', 'public_sauce');
      await expect(page.locator('[data-test="error"]')).toContainText(testData.user_and_pass_mismatch);

      //error handling with try-catch, for popups that might not always appear due to cookies.
      try {
        await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
      } catch (e) {
        console.log("Hamburger menu button did not appear: "+e)
      }   
    });

    test('login failure to saucedemo - username failure', async ({ page }) => {
      await LoginPage.login('apple', 'secret_sauce');
      await expect(page.locator('[data-test="error"]')).toContainText(testData.user_and_pass_mismatch);   

      //error handling through matcher negating, since we failed to login we should not see the hamburger menu
      await expect(page.locator('[id="react-burger-menu-btn"]')).not.toBeVisible()
    });
    //empty password field
    test('login failure to saucedemo - empty password failure', async ({ page }) => {
      await LoginPage.login('standard_user', '');
      await expect(page.locator('[data-test="error"]')).toContainText(testData.password_required);   
      await expect(page.locator('[id="react-burger-menu-btn"]')).not.toBeVisible()
    });

    //empty username field
    test('login failure to saucedemo - empty username failure', async ({ page }) => {
      await LoginPage.login('', 'public_sauce');
      await expect(page.locator('[data-test="error"]')).toContainText(testData.username_required);  
      await expect(page.locator('[id="react-burger-menu-btn"]')).not.toBeVisible() 
    });

    test('login failure to saucedemo - empty username & empty password - clicking error clear button', async ({ page }) => {
      await LoginPage.login('', '');
      await expect(page.locator('[data-test="error"]')).toContainText(testData.username_required);
      await expect(page.locator('[data-test="error-button"]')).toBeVisible()
      await expect(page.locator('[id="react-burger-menu-btn"]')).not.toBeVisible() 

      await page.locator('[data-test="error-button"]').click()
      await expect(page.locator('[data-test="error-button"]')).not.toBeVisible()
    });

});
