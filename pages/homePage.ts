import type { Screen, Device } from '@mobilewright/core';
import { expect } from '@mobilewright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
    constructor(screen: Screen, device: Device) {
        super(screen, device);
    }

    heading = () => this.screen.getByText('General Store');
    countryLabel = () => this.screen.getByText('Select the country where you want to shop');
    yourNameLabel = () => this.screen.getByText('Your Name');
    shopButton = () => this.screen.getByText(/Shop/i);
    femaleRadio = () => this.screen.getByText('Female');
    maleRadio = () => this.screen.getByText('Male');
    nameInput = () => this.screen.getByPlaceholder('Enter name here');
    countryDropdown = () =>
        this.screen.getByTestId('com.androidsample.generalstore:id/spinnerCountry');
    letsShopButton = () => this.screen.getByTestId('com.androidsample.generalstore:id/btnLetsShop');

    async verifyHomeScreenVisible(): Promise<void> {
        await expect(this.heading()).toBeVisible();
        await expect(this.countryLabel()).toBeVisible();
        await expect(this.yourNameLabel()).toBeVisible();
        await expect(this.shopButton()).toBeVisible();
    }

    async verifyGenderRadioButtonsVisible(): Promise<void> {
        await expect(this.femaleRadio()).toBeVisible();
        await expect(this.maleRadio()).toBeVisible();
    }

    async selectFemale(): Promise<void> {
        await this.femaleRadio().tap();
    }

    async selectMale(): Promise<void> {
        await this.maleRadio().tap();
    }

    async selectCountry(name: string): Promise<void> {
        await this.countryDropdown().tap();
        const option = this.screen.getByText(name);
        await option.scrollIntoViewIfNeeded({ maxSwipes: 20, direction: 'up' });
        await option.waitFor({ state: 'visible', timeout: 10_000 });
        await option.tap({ timeout: 15_000 });
    }

    async enterName(name: string): Promise<void> {
        await this.nameInput().fill(name);
    }

    async tapLetsShop(): Promise<void> {
        await this.letsShopButton().tap();
    }

    async verifyNameInput(name: string): Promise<void> {
        await expect(this.nameInput()).toHaveValue(name);
    }

    async hideKeyboard(): Promise<void> {
        await this.screen.pressButton('BACK');
    }

    async tapShop(): Promise<void> {
        await this.shopButton().tap();
    }
}
