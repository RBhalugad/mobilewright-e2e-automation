import { test as base } from '@mobilewright/test';
import { HomePage } from '../pages/homePage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';

type Pages = {
    homePage: HomePage;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<Pages>({
    homePage: async ({ screen, device }, use) => {
        await use(new HomePage(screen, device));
    },
    productPage: async ({ screen, device }, use) => {
        await use(new ProductPage(screen, device));
    },
    cartPage: async ({ screen, device }, use) => {
        await use(new CartPage(screen, device));
    },
});

export { expect } from '@mobilewright/test';
