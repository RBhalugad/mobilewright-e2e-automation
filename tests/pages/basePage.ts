import { expect } from '@mobilewright/test';
import type { Screen } from '@mobilewright/core';
import type { Device } from '@mobilewright/core';

export class BasePage {
    protected screen: Screen;
    protected device: Device;

    constructor(screen: Screen, device: Device) {
        this.screen = screen;
        this.device = device;
    }

    async assertTextVisible(text: string | RegExp): Promise<void> {
        await expect(this.screen.getByText(text)).toBeVisible();
    }

    async assertTestIdVisible(testId: string): Promise<void> {
        await expect(this.screen.getByTestId(testId)).toBeVisible();
    }

    async assertPlaceholderVisible(placeholder: string): Promise<void> {
        await expect(this.screen.getByPlaceholder(placeholder)).toBeVisible();
    }

    async tapByText(text: string | RegExp): Promise<void> {
        await this.screen.getByText(text).tap();
    }

    async tapByTestId(testId: string): Promise<void> {
        await this.screen.getByTestId(testId).tap();
    }

    async tapByPlaceholder(placeholder: string): Promise<void> {
        await this.screen.getByPlaceholder(placeholder).tap();
    }

    async doubleTapByText(text: string | RegExp): Promise<void> {
        await this.screen.getByText(text).doubleTap();
    }

    async longPressByText(text: string | RegExp, durationMs?: number): Promise<void> {
        await this.screen.getByText(text).longPress({ duration: durationMs });
    }

    async fillByPlaceholder(placeholder: string, value: string): Promise<void> {
        await this.screen.getByPlaceholder(placeholder).fill(value);
    }

    async fillByTestId(testId: string, value: string): Promise<void> {
        await this.screen.getByTestId(testId).fill(value);
    }

    async swipe(direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {
        await this.screen.swipe(direction);
    }

    async scrollDown(): Promise<void> {
        await this.screen.swipe('up');
    }

    async scrollUp(): Promise<void> {
        await this.screen.swipe('down');
    }

    async scrollIntoView(testId: string): Promise<void> {
        await this.screen.getByTestId(testId).scrollIntoViewIfNeeded();
    }

    async waitForText(text: string | RegExp, timeoutMs = 10_000): Promise<void> {
        await this.screen.getByText(text).waitFor({ state: 'visible', timeout: timeoutMs });
    }

    async waitForTestId(testId: string, timeoutMs = 10_000): Promise<void> {
        await this.screen.getByTestId(testId).waitFor({ state: 'visible', timeout: timeoutMs });
    }

    async waitForTextToDisappear(text: string | RegExp, timeoutMs = 10_000): Promise<void> {
        await this.screen.getByText(text).waitFor({ state: 'hidden', timeout: timeoutMs });
    }

    async goBack(): Promise<void> {
        await this.screen.goBack();
    }

    async openUrl(url: string): Promise<void> {
        await this.device.openUrl(url);
    }

    async launchApp(bundleId: string): Promise<void> {
        await this.device.launchApp(bundleId);
    }

    async terminateApp(bundleId: string): Promise<void> {
        await this.device.terminateApp(bundleId);
    }

    async assertTextNotVisible(text: string | RegExp): Promise<void> {
        await expect(this.screen.getByText(text)).not.toBeVisible();
    }

    async assertTestIdHasText(testId: string, expectedText: string): Promise<void> {
        const actual = await this.screen.getByTestId(testId).getText();
        if (actual !== expectedText) {
            throw new Error(
                `Expected element [testId="${testId}"] to have text "${expectedText}", but got "${actual}"`,
            );
        }
    }

    async assertEnabled(testId: string): Promise<void> {
        const enabled = await this.screen.getByTestId(testId).isEnabled();
        if (!enabled) {
            throw new Error(
                `Expected element [testId="${testId}"] to be enabled, but it was disabled.`,
            );
        }
    }

    async assertSelected(testId: string): Promise<void> {
        const selected = await this.screen.getByTestId(testId).isSelected();
        if (!selected) {
            throw new Error(
                `Expected element [testId="${testId}"] to be selected, but it was not.`,
            );
        }
    }
}
