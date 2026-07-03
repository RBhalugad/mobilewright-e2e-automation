import { test as base } from '@mobilewright/test';
import { HomePage } from '../pages/homePage';

type Pages = {
    homePage: HomePage;
};

export const test = base.extend<Pages>({
    homePage: async ({ screen, device }, use) => {
        await use(new HomePage(screen, device));
    },
});

export { expect } from '@mobilewright/test';
