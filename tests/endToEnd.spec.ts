import { test, expect } from '../fixtures/commonFixtures';

test.describe('General Store end to end', () => {
    test.setTimeout(120_000);

    const testData = {
        countryName: 'Brazil',
        gender: 'female',
        userName: 'John Doe',
        items: ['Jordan 6 Rings', 'Nike SFB Jungle'],
    };

    test('add two items to cart and checkout', async ({ homePage, productPage, cartPage }) => {
        await test.step('Verify home screen is visible', async () => {
            await homePage.verifyHomeScreenVisible();
        });

        await test.step('Enter Details', async () => {
            await homePage.selectCountry(testData.countryName);
            await homePage.selectFemale();
            await homePage.enterName(testData.userName);
            await homePage.hideKeyboard();
            await homePage.tapLetsShop();
        });

        await test.step('Add two items to cart', async () => {
            await productPage.verifyProductsPageVisible();
            for (const item of testData.items) {
                await productPage.addToCart(item);
            }
            await productPage.tapCartIcon();
        });

        await test.step('Verify cart page is visible', async () => {
            await cartPage.verifyCartPageVisible();
        });
    });

    test.afterEach(async ({ homePage }) => {
        await homePage.terminateApp('com.androidsample.generalstore');
    });
});
