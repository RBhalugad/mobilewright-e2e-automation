import type { Screen, Device } from '@mobilewright/core';
import { expect } from '@mobilewright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
    constructor(screen: Screen, device: Device) {
        super(screen, device);
    }

    productsHeading = () => this.screen.getByText('Products');

    productName = (name: string) =>
        this.screen.getByTestId('com.androidsample.generalstore:id/productName').getByText(name);

    productPrice = (name: string) =>
        this.screen.getByTestId('com.androidsample.generalstore:id/productPrice');

    addToCartButton = () => this.screen.getByText('ADD TO CART');

    cartIcon = () => this.screen.getByTestId('com.androidsample.generalstore:id/appbar_btn_cart');

    cartCounter = () => this.screen.getByTestId('com.androidsample.generalstore:id/counterText');


    async verifyProductsPageVisible(): Promise<void> {
        await expect(this.productsHeading()).toBeVisible();
    }

    async addToCart(productName: string): Promise<void> {
        const nameLocator = this.screen.getByText(productName);
        await nameLocator.scrollIntoViewIfNeeded({ maxSwipes: 10, direction: 'up' });
        await nameLocator.waitFor({ state: 'visible', timeout: 10_000 });

        const nameBox = await nameLocator.boundingBox();

        const allButtons = await this.addToCartButton().all();
        let nearest = allButtons[0];
        let minDist = Infinity;

        for (const btn of allButtons) {
            const box = await btn.boundingBox();
            const dist = Math.abs(box.y - nameBox.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = btn;
            }
        }

        await nearest.tap({ timeout: 10_000 });
    }

    async tapCartIcon(): Promise<void> {
        await this.cartIcon().waitFor({ state: 'visible', timeout: 10_000 });
        await this.cartIcon().tap();
    }
}
