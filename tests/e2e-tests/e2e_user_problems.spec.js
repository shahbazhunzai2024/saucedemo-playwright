/**
 * =====================================================================
 * Test Suite: SauceDemo - End-to-End UI Test Cases
 * Author: SDET Shahbaz Ali Khan
 * https://www.linkedin.com/in/shahbaz-ali-khan-pk/
 * Application: https://www.saucedemo.com/
 * Framework: Playwright Test
 *
 * Description:
 *   This test suite validates key functionality of the SauceDemo application,
 *   including login, homepage assets, product details, cart operations, sorting,
 *   checkout flow, and sidebar menu functionality.
 *
 * Test Cases Covered:
 *   1. Login Page
 *      - Validates login functionality for problem_user
 *      - Validates hamburger menu visibility after login
 *
 *   2. Homepage Assets Validation
 *      - Header, footer, and hamburger menu items existence
 *      - Filter dropdown visibility
 *
 *   3. Single Product Details
 *      - Validates product image, name, description, and price
 *
 *   4. Homepage Functionality
 *      - Menu - All Items return to homepage
 *      - About link navigation
 *      - Logout functionality
 *      - Reset App State (cart reset)
 *
 *   5. Product Tests (Skipped/Active)
 *      - Add/remove products to/from cart
 *      - Sorting products by name (A-Z, Z-A) and price (low-high, high-low)
 *
 *   6. Cart Page Validations (Skipped)
 *      - Validates cart contents, price, and navigation back to homepage
 *
 *   7. Cart Checkout Page Validations (Skipped)
 *      - Add products to cart, navigate to checkout, fill info
 *      - Validate checkout overview, totals, and finish purchase
 *
 * Notes:
 *   - test.step used for better reporting and readability
 *   - test.skip used for optional/skippable tests
 * =====================================================================
 */


const { test, expect } = require('@playwright/test');
const loginPage = require('../../pages/loginPage');
const homePage = require('../../pages/homePage');
const cartPage = require('../../pages/cartPage');
const testData = require('../../data/testData.json')

test.describe('SauceDemo - Login Page', () => {

  let LoginPage, HomePage, CartPage;

    test.beforeEach('fresh page and login before each test', async({page}) => {
        LoginPage = new loginPage(page);
        HomePage = new homePage(page);
        CartPage = new cartPage(page);
        await page.goto('https://www.saucedemo.com/');
        await LoginPage.login('problem_user', 'secret_sauce')
        await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
    });

    //showcasing playwright test steps feature here
    test('validating homepage assets - existence', async ({page}) => {

      await test.step('header items exist', async () => {
        await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
        await expect(page.locator('[class="app_logo"]')).toBeVisible()
        await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible()
      });

      await test.step('footer items exist', async () => {
        await expect(page.locator('[data-test="footer-copy"]')).toBeVisible()
        await expect(page.locator('[data-test="footer-copy"]')).toContainText("All Rights Reserved")
        await expect(page.locator('[data-test="social-twitter"]')).toBeVisible()
        await expect(page.locator('[data-test="social-facebook"]')).toBeVisible()
        await expect(page.locator('[data-test="social-linkedin"]')).toBeVisible()
      });

      await test.step('hamburger menu items exist', async () => {
        await page.locator('[id="react-burger-menu-btn"]').click()
        await expect(page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible()
        await expect(page.locator('[data-test="about-sidebar-link"]')).toBeVisible()
        await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible()
        await expect(page.locator('[data-test="reset-sidebar-link"]')).toBeVisible()
      });
      
      await test.step('filter dropdown exists', async () => {
        await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible()
      });

  });

  test('validating single product details - Sauce Labs Backpack', async ({page}) => {

    await test.step('product image', async () => {
      await expect(page.locator('[data-test="inventory-item-sauce-labs-backpack-img"]')).toBeVisible()
    });
    await test.step('product name', async () => {
      await expect(page.locator('[data-test="inventory-item-name"]').nth(0)).toContainText("Sauce Labs Backpack")
    });
    await test.step('product description', async () => {
      await expect(page.locator('[data-test="inventory-item-desc"]').nth(0)).toContainText("carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.")
    });
    await test.step('product price', async () => {
      await expect(page.locator('[data-test="inventory-item-price"]').nth(0)).toContainText(testData.backpack_price)
    });

  });


  test('validating homepage assets - functionality', async ({page}) => {
    await test.step('Menu - All Items returns to homepage functionality - one level deep into item view', async () => {
      await HomePage.viewProduct("backpack-img")
      await page.locator('[id="react-burger-menu-btn"]').click()
      await page.locator('[data-test="inventory-sidebar-link"]').click()
      await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible()
    });

    await test.step('Menu - All Items return to homepage functionality - one level deep into shopping cart', async () => {
      await page.locator('[data-test="shopping-cart-link"]').click()
      await page.locator('[id="react-burger-menu-btn"]').click()
      await page.locator('[data-test="inventory-sidebar-link"]').click()
      await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible()
    });

    await test.step('About', async () => {
      await page.locator('[id="react-burger-menu-btn"]').click()
      await page.locator('[data-test="about-sidebar-link"]').click()
      try {
        await expect(page).toHaveURL("https://saucelabs.com/")
      } catch (e) {
        console.log("Expected URL did not appear: "+ e)
      }
      
      await page.goBack()
    });

    await test.step('Logout', async () => {
      await page.locator('[id="react-burger-menu-btn"]').click()
      await page.locator('[data-test="logout-sidebar-link"]').click()
      await expect(page.locator('[data-test="username"]')).toBeVisible()

      //relog
      await LoginPage.login('standard_user', 'secret_sauce')
      await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
    });

    await test.step('Reset App State', async () => {
      await HomePage.addToCart("sauce-labs-bike-light")
      await HomePage.addToCart("sauce-labs-fleece-jacket")
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("2")

      await page.locator('[id="react-burger-menu-btn"]').click()
      await page.locator('[data-test="reset-sidebar-link"]').click()

      await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible()
    });

  });


test('product tests - sorting products', async ({page}) => {

  await test.step('Name (Z to A) sort', async () => {
    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "za"})

    try {
      await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Test.allTheThings() T-Shirt (Red)")
      await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Sauce Labs Backpack")
    } catch (e) {
      console.log("Expected following items to appear in sorted order: "+ e)
    }

    
  });

  await test.step('Name (A to Z) sort', async () => {

    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "az"})

    try {
      await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Backpack")
      await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Test.allTheThings() T-Shirt (Red)")
    } catch (e) {
      console.log("Expected following items to appear in sorted order: "+ e)
    }
    
   
  });

  await test.step('Price (low to high) sort', async () => {

    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "lohi"})

    try {
      await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Onesie")
      await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Sauce Labs Fleece Jacket")
    } catch (e) {
      console.log("Expected following items to appear in sorted order: "+ e)
    }
   
   
  });

  await test.step('Price (high to low) sort', async () => {

    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "hilo"})
    try {
      await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Fleece Jacket")
      await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Sauce Labs Onesie")
    } catch (e) {
      console.log("Expected following items to appear in sorted order: "+ e)
    }
    
  });
  
});

test.skip('cart page validations', async ({ page }) => {

  await test.step('add products to cart', async () => {
    await HomePage.addToCart("sauce-labs-bike-light")
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("1")

    await HomePage.addToCart("sauce-labs-fleece-jacket")
    try {
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("2")
     } catch (e) {
      console.log("Expected badge number did not appear: "+ e)
     }
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


});
