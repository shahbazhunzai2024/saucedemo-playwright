const { test, expect } = require('@playwright/test');
const loginPage = require('../../pages/loginPage');
const homePage = require('../../pages/homePage');
const cartPage = require('../../pages/cartPage');
const testData = require('../../data/testData.json')

test.describe('SauceDemo - Cart Page', () => {

  let LoginPage, HomePage, CartPage;

  test.beforeEach('fresh page and login before each test', async({page}) => {
    LoginPage = new loginPage(page); 
    HomePage = new homePage(page); 
    CartPage = new cartPage(page);

    await page.goto(testData.URL);
    await LoginPage.login('standard_user', 'secret_sauce')
    await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
});

    test('cart page validations', async ({ page }) => {

      await test.step('add products to cart', async () => {
        await HomePage.addToCart("sauce-labs-bike-light")
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("1")
 
        await HomePage.addToCart("sauce-labs-fleece-jacket")
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("2")
     });
      
      await test.step('navigating to cart page', async () => {
        await CartPage.clickOn('shopping_cart_link')
        await expect(page.locator('[id="continue-shopping"]')).toBeVisible()
        
      });

      await test.step('validating cart content & price', async () => {
        await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Bike Light")
        await expect(page.locator('[data-test="inventory-item-price"]').nth(0)).toContainText(testData.bike_light_price, { exact: true })
        await expect(page.locator('[data-test="inventory-item"]').nth(1)).toContainText("Sauce Labs Fleece Jacket")
        await expect(page.locator('[data-test="inventory-item-price"]').nth(1)).toContainText(testData.fleece_price, { exact: true })
      });

      await test.step('navigating back to homepage - continue shopping', async () => {
        await page.locator('[data-test="continue-shopping"]').click()
        await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible()
      });

    });

    test('cart checkout page validations', async ({ page }) => {

      await test.step('add products to cart', async () => {
        await HomePage.addToCart("sauce-labs-bike-light")
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("1")
 
        await HomePage.addToCart("sauce-labs-fleece-jacket")
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("2")
     });
      
      await test.step('navigating to cart page', async () => {
        await CartPage.clickOn('shopping_cart_link')
        await expect(page.locator('[id="continue-shopping"]')).toBeVisible()
        
      });

      await test.step('validating cart content & price', async () => {
        await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Bike Light")
        await expect(page.locator('[data-test="inventory-item-price"]').nth(0)).toContainText(testData.bike_light_price, { exact: true })
        await expect(page.locator('[data-test="inventory-item"]').nth(1)).toContainText("Sauce Labs Fleece Jacket")
        await expect(page.locator('[data-test="inventory-item-price"]').nth(1)).toContainText(testData.fleece_price, { exact: true })
      });

      await test.step('clicking checkout', async () => {
        await page.locator('[data-test="checkout"]').click()
        await expect(page.locator('[data-test="title"]')).toBeVisible()
        await expect(page.locator('[data-test="title"]')).toContainText("Checkout: Your Information")
      });

      await test.step('missing checkout info - first name', async () => {
        await CartPage.fillCheckoutInfo("", "Custard", "70007") 
        await expect(page.locator('[data-test="error"]')).toContainText("Error: First Name is required")
      });

      await test.step('missing checkout info - last name', async () => {
        await CartPage.fillCheckoutInfo("Andy", "", "70007") 
        await expect(page.locator('[data-test="error"]')).toContainText("Error: Last Name is required")
      });

      await test.step('missing checkout info - zipcode', async () => {
        await CartPage.fillCheckoutInfo("Andy", "Custard", "") 
        await expect(page.locator('[data-test="error"]')).toContainText("Error: Postal Code is required")
      });

      await test.step('filling checkout info', async () => {
        await CartPage.fillCheckoutInfo("Andy", "Custard", "70007") 
      });

      await test.step('validating checkout:overview page', async () => {
        
        let finalValues = await CartPage.calculateCheckoutValues([testData.bike_light_price, testData.fleece_price])
        console.log("ARRAY: "+ finalValues)
        await expect(page.locator('[data-test="subtotal-label"]')).toContainText(finalValues[0])
        await expect(page.locator('[data-test="tax-label"]')).toContainText(finalValues[1])
        await expect(page.locator('[data-test="total-label"]')).toContainText(finalValues[2])

      });

      await test.step('finish the purchase', async () => {
        await page.locator('[data-test="finish"]').click() 
        await expect(page.locator('[data-test="complete-header"]')).toContainText(testData.order_thanks)
        await expect(page.locator('[data-test="back-to-products"]')).toBeVisible()

        await page.locator('[data-test="back-to-products"]').click()
        await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible()
      });

    });

});
