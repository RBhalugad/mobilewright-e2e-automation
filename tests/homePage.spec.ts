import { test, expect } from './fixtures/commonFixtures';

test.describe('General Store homePage', () => {
    test('app launches and shows home screen', async ({ homePage }) => {
        await homePage.verifyHomeScreenVisible();
    });

    test('verify gender radio buttons are displayed', async ({ homePage }) => {
        await homePage.verifyGenderRadioButtonsVisible();
        await homePage.selectFemale();
        await expect(homePage.femaleRadio()).toBeVisible();
        await homePage.selectMale();
        await expect(homePage.maleRadio()).toBeVisible();
    });

    test('enter name in name field', async ({ homePage }) => {
        await expect(homePage.yourNameLabel()).toBeVisible();
        await homePage.enterName('John Doe');
    });
});
