import type { Screen, Device } from '@mobilewright/core';
import { expect } from '@mobilewright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
    constructor(screen: Screen, device: Device) {
        super(screen, device);
    }

    cartHeading = () => this.screen.getByTestId('com.androidsample.generalstore:id/toolbar_title');

    cartProductList = () => this.screen.getByTestId('com.androidsample.generalstore:id/rvCartProductList');

    cartItemName = (name: string) => this.screen.getByText(name);

    totalAmount = () => this.screen.getByTestId('com.androidsample.generalstore:id/totalAmountLbl');

    emailCheckbox = () => this.screen.getByTestId('com.androidsample.generalstore:id/checkBoxTerms');

    proceedButton = () => this.screen.getByText('Visit to the website to complete purchase');

    termsLink = () => this.screen.getByText('Please read our terms and conditions');

    async verifyCartPageVisible(): Promise<void> {
        await expect(this.cartHeading()).toBeVisible();
        await expect(this.cartProductList()).toBeVisible();
    }

    async verifyItemInCart(productName: string): Promise<void> {
        await expect(this.cartItemName(productName)).toBeVisible();
    }

    async getTotalAmount(): Promise<string> {
        return await this.totalAmount().getText();
    }

    async checkEmailOffers(): Promise<void> {
        await this.emailCheckbox().tap();
    }

    async proceedToCheckout(): Promise<void> {
        await this.proceedButton().scrollIntoViewIfNeeded({ maxSwipes: 5, direction: 'up' });
        await this.proceedButton().tap();
    }

    async tapTermsAndConditions(): Promise<void> {
        await this.termsLink().tap();
    }
}
