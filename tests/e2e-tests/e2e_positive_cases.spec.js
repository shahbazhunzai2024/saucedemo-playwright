/**
 * Author: Shahbaz Ali Khan
 * Role: SDET
 * https://www.linkedin.com/in/shahbaz-ali-khan-pk/
 * Description: This test suite automates the end-to-end functionality of the SauceDemo web application,
 * including login, homepage validation, product details, cart operations, sorting, and checkout flow.
 * Each test case includes steps to verify UI elements, functional flows, and assertions against expected values.
 */

const { test, expect } = require('@playwright/test');
const loginPage = require('../../pages/loginPage');
const homePage = require('../../pages/homePage');
const cartPage = require('../../pages/cartPage');
const testData = require('../../data/testData.json');

test.describe('SauceDemo - Login Page', () => {

    test.describe.configure({ 

  });

  let LoginPage, HomePage, CartPage;

  // -------------------------------------------
  // BEFORE EACH: LOGIN & SETUP
  // -------------------------------------------
  test.beforeEach('fresh page and login before each test', async ({ page }) => {
    LoginPage = new loginPage(page);
    HomePage = new homePage(page);
    CartPage = new cartPage(page);

    await page.goto('https://www.saucedemo.com/');
    await LoginPage.login('standard_user', 'secret_sauce');
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
  });

  // -------------------------------------------
  // Test Case 1: Validate homepage UI elements exist
  // -------------------------------------------
  test('TC01 - validating homepage assets - existence', async ({ page }) => {
    const headerIcon = page.locator('#react-burger-menu-btn');
    const appLogo = page.locator('.app_logo');
    const cartIcon = page.locator('[data-test="shopping-cart-link"]');
    const footerCopy = page.locator('[data-test="footer-copy"]');
    const twitterIcon = page.locator('[data-test="social-twitter"]');
    const facebookIcon = page.locator('[data-test="social-facebook"]');
    const linkedinIcon = page.locator('[data-test="social-linkedin"]');
    const sortDropdown = page.locator('[data-test="product-sort-container"]');

    await test.step('header items exist', async () => {
      await expect(headerIcon).toBeVisible();
      await expect(appLogo).toBeVisible();
      await expect(cartIcon).toBeVisible();
    });

    await test.step('footer items exist', async () => {
      await expect(footerCopy).toBeVisible();
      await expect(footerCopy).toContainText("All Rights Reserved");
      await expect(twitterIcon).toBeVisible();
      await expect(facebookIcon).toBeVisible();
      await expect(linkedinIcon).toBeVisible();
    });

    await test.step('hamburger menu items exist', async () => {
      await headerIcon.click();
      await expect(page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="about-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="reset-sidebar-link"]')).toBeVisible();
    });

    await test.step('filter dropdown exists', async () => {
      await expect(sortDropdown).toBeVisible();
    });

  });

  // -------------------------------------------
  // Test Case 2: Validate single product details
  // -------------------------------------------
  test('TC02 - validating single product details - Sauce Labs Backpack', async ({ page }) => {
    const productImage = page.locator('[data-test="inventory-item-sauce-labs-backpack-img"]');
    const productName = page.locator('[data-test="inventory-item-name"]').nth(0);
    const productDesc = page.locator('[data-test="inventory-item-desc"]').nth(0);
    const productPrice = page.locator('[data-test="inventory-item-price"]').nth(0);

    await test.step('product image', async () => {
      await expect(productImage).toBeVisible();
    });

    await test.step('product name', async () => {
      await expect(productName).toContainText("Sauce Labs Backpack");
    });

    await test.step('product description', async () => {
      await expect(productDesc).toContainText("carry.allTheThings()");
    });

    await test.step('product price', async () => {
      await expect(productPrice).toContainText(testData.backpack_price);
    });

  });

  // -------------------------------------------
  // Test Case 3: Validate homepage functional flows
  // -------------------------------------------
  test('TC03 - validating homepage assets - functionality', async ({ page }) => {
    const menuBtn = page.locator('#react-burger-menu-btn');
    const allItems = page.locator('[data-test="inventory-sidebar-link"]');
    const aboutLink = page.locator('[data-test="about-sidebar-link"]');
    const logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    const resetLink = page.locator('[data-test="reset-sidebar-link"]');
    const cartIcon = page.locator('[data-test="shopping-cart-link"]');
    const sortDropdown = page.locator('[data-test="product-sort-container"]');

    await test.step('Menu - All Items return from product view', async () => {
      await HomePage.viewProduct("backpack-img");
      await menuBtn.click();
      await allItems.click();
      await expect(sortDropdown).toBeVisible();
    });

    await test.step('Menu - All Items return from cart view', async () => {
      await cartIcon.click();
      await menuBtn.click();
      await allItems.click();
      await expect(sortDropdown).toBeVisible();
    });

    await test.step('About', async () => {
      await menuBtn.click();
      await aboutLink.click();
      await expect(page).toHaveURL("https://saucelabs.com/");
      await page.goBack();
    });

    await test.step('Logout', async () => {
      await menuBtn.click();
      await logoutLink.click();
      await expect(page.locator('[data-test="username"]')).toBeVisible();

      await LoginPage.login('standard_user', 'secret_sauce');
      await expect(menuBtn).toBeVisible();
    });

    await test.step('Reset App State', async () => {
      await HomePage.addToCart("sauce-labs-bike-light");
      await HomePage.addToCart("sauce-labs-fleece-jacket");
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("2");

      await menuBtn.click();
      await resetLink.click();
      await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });

  });

  // -------------------------------------------
  // Test Case 4: Validate adding/removing products & cart badge
  // -------------------------------------------
  test('TC04 - product tests - products & cart badge', async ({ page }) => {
    const badge = page.locator('[data-test="shopping-cart-badge"]');

    await test.step('add product to cart', async () => {
      await HomePage.addToCart("sauce-labs-bike-light");
      await expect(badge).toHaveText("1");

      await HomePage.addToCart("sauce-labs-fleece-jacket");
      await expect(badge).toHaveText("2");
    });

    await test.step('remove product from cart', async () => {
      await HomePage.removeFromCart("sauce-labs-bike-light");
      await HomePage.removeFromCart("sauce-labs-fleece-jacket");
      await expect(badge).not.toBeVisible();
    });

  });

  // -------------------------------------------
  // Test Case 5: Validate product sorting
  // -------------------------------------------
  test('TC05 - product tests - sorting products', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    const firstItem = page.locator('[data-test="inventory-item"]').nth(0);
    const lastItem = page.locator('[data-test="inventory-item"]').nth(5);

    async function selectSort(value) {
      await sortDropdown.click();
      await sortDropdown.selectOption({ value });
    }

    await test.step('Name (Z to A) sort', async () => {
      await selectSort("za");
      await expect(firstItem).toContainText("Test.allTheThings() T-Shirt (Red)");
      await expect(lastItem).toContainText("Sauce Labs Backpack");
    });

    await test.step('Name (A to Z) sort', async () => {
      await selectSort("az");
      await expect(firstItem).toContainText("Sauce Labs Backpack");
      await expect(lastItem).toContainText("Test.allTheThings() T-Shirt (Red)");
    });

    await test.step('Price (low to high) sort', async () => {
      await selectSort("lohi");
      await expect(firstItem).toContainText("Sauce Labs Onesie");
      await expect(lastItem).toContainText("Sauce Labs Fleece Jacket");
    });

    await test.step('Price (high to low) sort', async () => {
      await selectSort("hilo");
      await expect(firstItem).toContainText("Sauce Labs Fleece Jacket");
      await expect(lastItem).toContainText("Sauce Labs Onesie");
    });

  });

  // -------------------------------------------
  // Test Case 6: Cart page validations
  // -------------------------------------------
  test('TC06 - cart page validations', async ({ page }) => {
    const badge = page.locator('[data-test="shopping-cart-badge"]');

    await test.step('add products to cart', async () => {
      await HomePage.addToCart("sauce-labs-bike-light");
      await expect(badge).toHaveText("1");

      await HomePage.addToCart("sauce-labs-fleece-jacket");
      await expect(badge).toHaveText("2");
    });

    await test.step('navigating to cart page', async () => {
      await CartPage.clickOn('shopping_cart_link');
      await expect(page.locator('#continue-shopping')).toBeVisible();
    });

    await test.step('validating cart content & price', async () => {
      await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Bike Light");
      await expect(page.locator('[data-test="inventory-item-price"]').nth(0)).toContainText(testData.bike_light_price, { exact: true });

      await expect(page.locator('[data-test="inventory-item"]').nth(1)).toContainText("Sauce Labs Fleece Jacket");
      await expect(page.locator('[data-test="inventory-item-price"]').nth(1)).toContainText(testData.fleece_price, { exact: true });
    });

    await test.step('navigating back to homepage - continue shopping', async () => {
      await page.locator('[data-test="continue-shopping"]').click();
      await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
    });

  });

  // -------------------------------------------
  // Test Case 7: Checkout page validations
  // -------------------------------------------
  test('TC07 - cart checkout page validations', async ({ page }) => {
    const badge = page.locator('[data-test="shopping-cart-badge"]');

    await test.step('add products to cart', async () => {
      await HomePage.addToCart("sauce-labs-bike-light");
      await expect(badge).toHaveText("1");

      await HomePage.addToCart("sauce-labs-fleece-jacket");
      await expect(badge).toHaveText("2");
    });

    await test.step('navigating to cart page', async () => {
      await CartPage.clickOn('shopping_cart_link');
      await expect(page.locator('#continue-shopping')).toBeVisible();
    });

    await test.step('validating cart content & price', async () => {
      await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Bike Light");
      await expect(page.locator('[data-test="inventory-item-price"]').nth(0)).toContainText(testData.bike_light_price, { exact: true });

      await expect(page.locator('[data-test="inventory-item"]').nth(1)).toContainText("Sauce Labs Fleece Jacket");
      await expect(page.locator('[data-test="inventory-item-price"]').nth(1)).toContainText(testData.fleece_price, { exact: true });
    });

    await test.step('clicking checkout', async () => {
      await page.locator('[data-test="checkout"]').click();
      await expect(page.locator('[data-test="title"]')).toContainText("Checkout: Your Information");
    });

    await test.step('filling checkout info', async () => {
      await CartPage.fillCheckoutInfo("Andy", "Custard", "70007");
    });

    await test.step('validating checkout:overview page', async () => {
      const finalValues = await CartPage.calculateCheckoutValues([
        testData.bike_light_price,
        testData.fleece_price
      ]);

      await expect(page.locator('[data-test="subtotal-label"]')).toContainText(finalValues[0]);
      await expect(page.locator('[data-test="tax-label"]')).toContainText(finalValues[1]);
      await expect(page.locator('[data-test="total-label"]')).toContainText(finalValues[2]);
    })

    await test.step('finish the purchase', async () => {
      await page.locator('[data-test="finish"]').click();
      await expect(page.locator('[data-test="complete-header"]')).toContainText(testData.order_thanks);

      await page.locator('[data-test="back-to-products"]').click();
      await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
    })

  });

});

