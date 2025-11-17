const { test, expect } = require('@playwright/test');
const loginPage = require('../../pages/loginPage');
const homePage = require('../../pages/homePage');
const testData = require('../../data/testData.json')

test.describe('SauceDemo - Login Page', () => {


  let LoginPage, HomePage;

    test.beforeEach('fresh page and login before each test', async({page}) => {
        LoginPage = new loginPage(page);  
        HomePage = new homePage(page);

        await page.goto(testData.URL);
        await LoginPage.login('standard_user', 'secret_sauce')
        await expect(page.locator('[id="react-burger-menu-btn"]')).toBeVisible()
    });

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
      await expect(page).toHaveURL("https://saucelabs.com/")
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

  test('product tests - products & cart badge', async ({page}) => {

    await test.step('add product to cart', async () => {
       await HomePage.addToCart("sauce-labs-bike-light")
       await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("1")

       await HomePage.addToCart("sauce-labs-fleece-jacket")
       await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("2")
    });

    await test.step('remove product from cart', async () => {
       await HomePage.removeFromCart("sauce-labs-bike-light")
       await HomePage.removeFromCart("sauce-labs-fleece-jacket")
       await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible()
   });
    
});

test('product tests - sorting products', async ({page}) => {

  await test.step('Name (Z to A) sort', async () => {
    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "za"})

    await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Test.allTheThings() T-Shirt (Red)")
    await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Sauce Labs Backpack")

  });

  await test.step('Name (A to Z) sort', async () => {

    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "az"})

    await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Backpack")
    await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Test.allTheThings() T-Shirt (Red)")
   
  });

  await test.step('Price (low to high) sort', async () => {

    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "lohi"})

    await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Onesie")
    await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Sauce Labs Fleece Jacket")
   
  });

  await test.step('Price (high to low) sort', async () => {

    await page.locator('[data-test="product-sort-container"]').click()
    await page.locator('[data-test="product-sort-container"]').selectOption({value: "hilo"})

    await expect(page.locator('[data-test="inventory-item"]').nth(0)).toContainText("Sauce Labs Fleece Jacket")
    await expect(page.locator('[data-test="inventory-item"]').nth(5)).toContainText("Sauce Labs Onesie")
   
  });
  
});

});
