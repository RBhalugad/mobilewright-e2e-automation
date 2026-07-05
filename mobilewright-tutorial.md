# Mobilewright Tutorial

### Mobile Automation for iOS & Android — Playwright-Style

---

## Table of Contents

1. [What is Mobilewright?](#1-what-is-mobilewright)
2. [Why Mobilewright?](#2-why-mobilewright)
3. [Prerequisites](#3-prerequisites)
4. [Installation & Setup](#4-installation--setup)
5. [Your First Test](#5-your-first-test)
6. [Core Concepts](#6-core-concepts)
7. [Finding Elements](#7-finding-elements)
8. [Actions](#8-actions)
9. [Assertions](#9-assertions)
10. [Chaining & Filtering](#10-chaining--filtering)
11. [Working with WebViews](#11-working-with-webviews)
12. [Configuration File](#12-configuration-file)
13. [Test Fixtures](#13-test-fixtures)
14. [CLI Reference](#14-cli-reference)
15. [AI Agent Integration](#15-ai-agent-integration)
16. [Real Devices in the Cloud](#16-real-devices-in-the-cloud)

---

## 1. What is Mobilewright?

Mobilewright is a mobile automation framework for iOS and Android, modeled directly after Playwright's architecture and developer experience. It targets real devices, simulators, and emulators through a clean, auto-waiting API built on top of `mobilecli`.

If you already know Playwright, you already know Mobilewright. The mental model, locator API, assertion style, and configuration format are nearly identical — just targeting a phone instead of a browser.

---

## 2. Why Mobilewright?

| Feature                   | Mobilewright                     | Appium                  | Detox             | XCTest/Espresso  |
| ------------------------- | -------------------------------- | ----------------------- | ----------------- | ---------------- |
| API style                 | Playwright-style                 | Selenium (WebDriver)    | Custom            | Native framework |
| Auto-wait                 | Built-in, every action           | Manual waits            | Partial           | Manual           |
| Setup                     | `npm install mobilewright`       | Server + drivers + caps | React Native only | Xcode/AS only    |
| Cross-platform            | iOS + Android, one API           | Yes, verbose            | React Native only | Single platform  |
| AI agent support          | First-class (accessibility tree) | Limited                 | No                | No               |
| Real devices in the cloud | Via Mobile Next Cloud            | Yes (complex)           | Simulators only   | Yes              |
| Locators                  | Semantic roles + labels          | XPath, CSS, ID          | Test IDs          | Native queries   |

The headline difference: Mobilewright exposes the device's **accessibility tree** — deterministic, token-efficient, and requiring no vision model — making it ideal for use with AI agents like Claude, Cursor, or any LLM-based coding agent.

---

## 3. Prerequisites

- **Node.js >= 18**
- A booted iOS Simulator, Android Emulator, or connected real device
- Xcode (for iOS)
- Android SDK Platform Tools / Android Studio (for Android)

Run the built-in doctor to check your environment:

```bash
npx mobilewright doctor
```

This checks Xcode, Android SDK, simulators, ADB, and other dependencies — and tells you exactly what's missing and how to fix it. Add `--json` for machine-readable output.

---

## 4. Installation & Setup

```bash
npm install mobilewright
```

That's it. No separate server process, no driver installation, no capability objects.

For Playwright Test integration (recommended for running test suites), also install:

```bash
npm install @mobilewright/test
```

---

## 5. Your First Test

Here's a complete example — a login flow on an iOS app:

```typescript
import { ios, expect } from 'mobilewright';

const device = await ios.launch({ bundleId: 'com.example.myapp' });
const { screen } = device;

// Fill login form
await screen.getByLabel('Email').fill('user@example.com');
await screen.getByLabel('Password').fill('password123');
await screen.getByRole('button', { name: 'Sign In' }).tap();

// Assert success
await expect(screen.getByText('Welcome back')).toBeVisible();

// Capture screenshot
const screenshot = await screen.screenshot();

await device.close();
```

The same test on Android:

```typescript
import { android, expect } from 'mobilewright';

const device = await android.launch({ bundleId: 'com.example.myapp' });
const { screen } = device;

await screen.getByLabel('Email').fill('user@example.com');
await screen.getByLabel('Password').fill('password123');
await screen.getByRole('button', { name: 'Sign In' }).tap();

await expect(screen.getByText('Welcome back')).toBeVisible();
await device.close();
```

Notice: **the test body is identical**. The only difference is the launcher (`ios` vs `android`).

---

## 6. Core Concepts

Mobilewright has three main building blocks:

### Device

Manages the connection lifecycle and exposes device/app-level controls. You get it from `ios.launch()` or `android.launch()`.

```typescript
const device = await ios.launch();
```

### Screen

Entry point for finding and interacting with elements. Access it via `device.screen`.

```typescript
const { screen } = device;
```

### Locator

A lazy, chainable element reference. No queries run until you call an action or assertion on it. Multiple chained calls compose into one precise lookup.

```typescript
const loginBtn = screen.getByRole('button', { name: 'Sign In' });
// Nothing has happened yet — loginBtn is just a reference
await loginBtn.tap(); // Now the element is found and tapped
```

---

## 7. Finding Elements

Mobilewright provides several locator factories on `screen`. Use the most semantic one available — it leads to more resilient tests.

### By Role (Recommended)

Maps semantic roles to platform-specific element types automatically:

```typescript
screen.getByRole('button', { name: 'Sign In' });
screen.getByRole('textfield');
screen.getByRole('switch');
screen.getByRole('checkbox');
screen.getByRole('slider');
screen.getByRole('list');
screen.getByRole('image');
screen.getByRole('header');
screen.getByRole('tab');
```

Role mapping reference:

| Role        | iOS                        | Android                      |
| ----------- | -------------------------- | ---------------------------- |
| `button`    | Button, ImageButton        | Button, ImageButton          |
| `textfield` | TextField, SecureTextField | EditText                     |
| `text`      | StaticText                 | TextView                     |
| `image`     | Image                      | ImageView                    |
| `switch`    | Switch                     | Switch, Toggle               |
| `checkbox`  | —                          | Checkbox                     |
| `slider`    | Slider                     | SeekBar                      |
| `list`      | Table, CollectionView      | ListView, RecyclerView       |
| `header`    | NavigationBar              | Toolbar, Header              |
| `listitem`  | Cell                       | LinearLayout, RelativeLayout |

### By Label

```typescript
screen.getByLabel('Email');
screen.getByLabel('Search');
```

### By Test ID

```typescript
screen.getByTestId('login-button');
screen.getByTestId('product-card-42');
```

### By Text

```typescript
screen.getByText('Welcome'); // exact match
screen.getByText(/welcome/i); // RegExp match
screen.getByText('welcome', { exact: false }); // substring match
```

### By Type

```typescript
screen.getByType('TextField');
screen.getByType('Cell');
screen.getByType('NavigationBar');
```

### By Placeholder

```typescript
screen.getByPlaceholder('Search...');
screen.getByPlaceholder('Enter your email');
```

### Locator Priority

When multiple strategies are available, prefer in this order:
`getByTestId` → `getByRole` → `getByLabel` → `getByText`

---

## 8. Actions

All actions **auto-wait** for the element to be visible, enabled, and have stable bounds before interacting. No manual `waitFor` needed before acting.

### Tap

```typescript
await screen.getByRole('button', { name: 'Submit' }).tap();
await screen.getByLabel('Profile').doubleTap();
await screen.getByLabel('Item').longPress({ duration: 1000 });
```

### Fill Text

```typescript
// Taps to focus, clears existing content, then types
await screen.getByLabel('Email').fill('user@example.com');

// Clear only
await screen.getByLabel('Search').clear();
```

### Swipe

```typescript
// Swipe the whole screen
await screen.swipe('up');
await screen.swipe('down', { distance: 300, duration: 500 });

// Swipe on a specific element
await screen.getByType('Cell').swipe({ direction: 'left' });
```

### Scroll

```typescript
// Scroll until element is visible
await screen.getByText('Footer Item').scrollIntoViewIfNeeded();
```

### Device-level Actions

```typescript
// Press hardware/virtual buttons
await screen.pressButton('HOME');
await screen.pressButton('BACK');

// Raw coordinate tap (use only as last resort)
await screen.tap(195, 400);
await screen.doubleTap(195, 400);
await screen.longPress(195, 400, 1000);
```

### Screenshots

```typescript
// Full screen
const png = await screen.screenshot();
const jpeg = await screen.screenshot({ format: 'jpeg', quality: 80 });

// Cropped to element bounds
const elementPng = await screen.getByLabel('Profile Photo').screenshot();
```

### Device & App Controls

```typescript
// Orientation
await device.setOrientation('landscape');
await device.setOrientation('portrait');
const current = await device.getOrientation();

// Screen info
const { width, height, scale } = await device.screenSize();

// Deep links & URLs
await device.goto('myapp://settings');
await device.openUrl('https://example.com');

// App lifecycle
await device.launchApp('com.example.app');
await device.launchApp('com.example.app', { locales: ['fr-FR'] });
await device.terminateApp('com.example.app');
const apps = await device.listApps();
const foreground = await device.getForegroundApp();

// Install / uninstall
await device.installApp('/path/to/app.ipa');
await device.uninstallApp('com.example.app');
```

---

## 9. Assertions

All assertions **poll repeatedly** until satisfied or timeout (default 5s). Use `.not` to negate.

```typescript
import { expect } from 'mobilewright';

// Visibility
await expect(locator).toBeVisible();
await expect(locator).not.toBeVisible();
await expect(locator).toBeHidden();

// State
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeSelected();
await expect(locator).toBeFocused();
await expect(locator).toBeChecked();

// Text content
await expect(locator).toHaveText('Welcome back!');
await expect(locator).toHaveText(/welcome/i);
await expect(locator).toContainText('back');
await expect(locator).toBeEmpty(); // element has no text

// Input values
await expect(locator).toHaveValue('user@example.com');
await expect(locator).toHaveValue(/@example\.com$/);

// Count
await expect(locator).toHaveCount(3);

// Custom timeout
await expect(locator).toBeVisible({ timeout: 10_000 });
```

---

## 10. Chaining & Filtering

### Chain Locators (Scoped Search)

```typescript
// Tap the Delete button inside the first Cell row
const row = screen.getByType('Cell');
await row.getByRole('button', { name: 'Delete' }).tap();

// Read the navigation bar title
const title = await screen.getByType('NavigationBar').getByType('StaticText').getText();
```

Child lookups use **bounds-based containment**: any element whose bounds fit within the parent's bounds is considered a child. This works correctly even with flat accessibility lists.

### Filter Locators

Refine a locator that matches multiple elements:

```typescript
// Keep only cells that contain "In stock"
screen.getByType('Cell').filter({ hasText: 'In stock' });

// Exclude cells containing "Sold out"
screen.getByType('Cell').filter({ hasNotText: /sold out/i });

// Keep cells containing a child button
screen.getByType('Cell').filter({ has: screen.getByRole('button') });

// Keep cells NOT containing an Ad label
screen.getByType('Cell').filter({ hasNot: screen.getByText('Ad') });
```

### Combine Locators

```typescript
// Match elements that satisfy BOTH locators
locator.and(screen.getByRole('button'));

// Match elements that satisfy EITHER locator
locator.or(screen.getByText('Retry'));
```

### Work with Multiple Matches

```typescript
locator.first(); // first match
locator.last(); // last match
locator.nth(2); // zero-indexed; negative counts from end
await locator.count(); // number of matching elements
await locator.all(); // array of Locators, one per match
```

### Explicit Waiting

```typescript
await locator.waitFor({ state: 'visible' });
await locator.waitFor({ state: 'hidden' });
await locator.waitFor({ state: 'enabled' });
await locator.waitFor({ state: 'disabled', timeout: 10_000 });
```

### Query Element State (No Wait)

```typescript
await locator.exists(); // boolean — present in hierarchy right now
await locator.isVisible();
await locator.isEnabled();
await locator.isSelected();
await locator.isFocused();
await locator.isChecked();
await locator.getText(); // waits for visibility first
await locator.getValue(); // raw value (e.g. text field content)
await locator.boundingBox(); // { x, y, width, height }
```

---

## 11. Working with WebViews

Apps that embed web content (Cordova, Capacitor, Ionic, or raw WKWebView/Android WebView) expose a real DOM. Use `screen.getByWebView()` to get a **Playwright-compatible Page** and drive web content with the exact Playwright API.

```typescript
// Find the web view and resolve its page
const webview = screen.getByWebView();
const page = await webview.page();

// From here it's standard Playwright
await page.goto('https://example.com/login');
await page.getByLabel('Email').fill('user@example.com');
await page.getByRole('button', { name: 'Sign In' }).click();

await expect(page).toHaveURL(/dashboard/);
await expect(page.getByText('Welcome')).toBeVisible();
```

If the app has multiple WebViews, target by test ID:

```typescript
const webview = screen.getByWebView({ testId: 'checkout-web' });
```

**Supported Page actions:** `goto`, `reload`, `goBack`, `goForward`, `url`, `title`, `content`, `waitForURL`, `waitForLoadState`, `close`.

**Supported Web Locator actions:** `click`, `fill`, `type`, `press`, `focus`, `hover`, `scrollIntoViewIfNeeded`, `getText`, `getValue`, `textContent`, `innerText`, `getAttribute`, `boundingBox`, `isVisible`, `isEnabled`, `isChecked`, `waitFor`, `first`, `last`, `nth`, `count`, `all`.

---

## 12. Configuration File

Create `mobilewright.config.ts` in your project root:

```typescript
import { defineConfig } from 'mobilewright';

export default defineConfig({
    platform: 'ios',
    bundleId: 'com.example.myapp',
    deviceName: /iPhone 16/,
    timeout: 10_000,

    use: {
        actionTimeout: 5_000,
        appLaunchTimeout: 20_000,
        animations: 'off', // disable system animations for speed
    },

    expect: {
        timeout: 5_000,
    },

    reporter: 'html',
    retries: 1,
    workers: 2,
    outputDir: 'test-results',
    viewTree: 'on-failure', // attach accessibility tree to failed tests
});
```

### Multi-device / Multi-platform Matrix

Run tests against multiple devices in one command using `projects`:

```typescript
export default defineConfig({
    projects: [
        { name: 'iPhone 16', use: { platform: 'ios', deviceName: /iPhone 16/ } },
        { name: 'Pixel 9', use: { platform: 'android', deviceName: /Pixel 9/ } },
    ],
});
```

### Installing Apps Before Tests

```typescript
export default defineConfig({
    installApps: ['./builds/app.ipa'], // or .apk
    bundleId: 'com.example.myapp',
});
```

---

## 13. Test Fixtures

`@mobilewright/test` extends Playwright Test with mobile-specific fixtures: `device`, `screen`, and `bundleId`.

```typescript
import { test, expect } from '@mobilewright/test';

// Apply settings to all tests in this file
test.use({
    bundleId: 'com.example.myapp',
    video: 'retain-on-failure',
    viewTree: 'on-failure',
});

test('user can sign in', async ({ device, screen, bundleId }) => {
    // Fresh-launch the app before the test
    await device.terminateApp(bundleId).catch(() => {});
    await device.launchApp(bundleId);

    await screen.getByLabel('Email').fill('user@example.com');
    await screen.getByLabel('Password').fill('password123');
    await screen.getByRole('button', { name: 'Sign In' }).tap();

    await expect(screen.getByText('Welcome back')).toBeVisible();
});

test('user can sign out', async ({ device, screen, bundleId }) => {
    await screen.getByRole('tab', { name: 'Profile' }).tap();
    await screen.getByRole('button', { name: 'Sign Out' }).tap();

    await expect(screen.getByText('Sign In')).toBeVisible();
});
```

The `device` fixture connects **once per worker**, and `device.close()` is called automatically after all tests complete.

### Per-file / Per-block Options via `test.use()`

| Option          | Type                                   | Description                                   |
| --------------- | -------------------------------------- | --------------------------------------------- |
| `bundleId`      | `string`                               | App bundle ID for these tests                 |
| `platform`      | `'ios' \| 'android'`                   | Target platform                               |
| `deviceName`    | `RegExp`                               | RegExp to match device name                   |
| `installApps`   | `string \| string[]`                   | APK/IPA paths to install before tests         |
| `autoAppLaunch` | `boolean`                              | Launch app before each test (default: `true`) |
| `viewTree`      | `'on-failure' \| 'off'`                | Attach accessibility tree on failure          |
| `video`         | `'on' \| 'retain-on-failure' \| 'off'` | Record video (default: `'off'`)               |

---

## 14. CLI Reference

### `mobilewright doctor`

Verify your environment is ready for automation.

```bash
npx mobilewright doctor
npx mobilewright doctor --json
```

### `mobilewright init`

Scaffold a config file and example test.

```bash
npx mobilewright init
# creates: mobilewright.config.ts, example.test.ts
```

### `mobilewright devices`

List all connected devices, simulators, and emulators.

```bash
npx mobilewright devices

# Output:
# ID                                      Name               Platform  Type        State
# 00008110-0011281A112A801E               VPhone             ios       real-device booted
# 5A5FCFCA-27EC-4D1B-B412-BAE629154EE0   iPhone 17 Pro      ios       simulator   booted
```

### `mobilewright inspect`

Open the **Mobilewright Inspector** — a browser-based UI showing a live screenshot alongside every element and its best locator. Click any element to highlight its bounding box. Elements sharing a locator get a `dup` badge.

```bash
npx mobilewright inspect
npx mobilewright inspect --port 4621
```

### `mobilewright screenshot`

Capture a screenshot of a connected device.

```bash
npx mobilewright screenshot                         # saves screenshot.png
npx mobilewright screenshot -o home.png             # custom output path
npx mobilewright screenshot -d <device-id>          # specific device
npx mobilewright screenshot --url ws://host:12000   # remote mobilecli
```

### `mobilewright install`

Install the mobilecli agent on a device.

```bash
npx mobilewright install
npx mobilewright install -d <device-id>
npx mobilewright install --force
npx mobilewright install --provisioning-profile <path>  # iOS
```

### `mobilewright test`

Run your test suite.

```bash
npx mobilewright test                         # run all tests
npx mobilewright test login.test.ts           # specific file
npx mobilewright test --grep "sign in"        # filter by name
npx mobilewright test --reporter html         # HTML report
npx mobilewright test --retries 2             # retry flaky tests
npx mobilewright test --workers 4             # parallel workers
npx mobilewright test --list                  # list without running
```

### `mobilewright show-report`

Open the HTML report.

```bash
npx mobilewright show-report
npx mobilewright show-report mobilewright-report/
```

### `mobilewright merge-reports`

Merge blob reports from sharded/parallel CI runs.

```bash
npx mobilewright merge-reports ./blob-reports
npx mobilewright merge-reports ./blob-reports --reporter json
```

---

## 15. AI Agent Integration

Mobilewright is built with AI agents as a first-class use case. Because it exposes the device's accessibility tree (not just screenshots), an LLM agent can:

- Read the full screen structure as text
- Make precise, deterministic interactions
- Avoid needing any computer-vision model

Combine with **mobile-mcp** to let Claude or any coding agent control a real device via natural language:

```bash
# In your claude_desktop_config.json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "npx",
      "args": ["-y", "@mobilenext/mobile-mcp@latest"]
    }
  }
}
```

In your agent's code, actions look like this — readable and self-documenting:

```typescript
// An AI agent can drive a real phone with semantic, readable actions
await screen.getByRole('button', { name: 'Sign In' }).tap();
await screen.getByLabel('Email').fill('user@example.com');
await expect(screen.getByText('Welcome')).toBeVisible();
```

No XPath. No coordinates. No vision model.

### Disable Telemetry

Both Mobilewright and mobile-mcp collect anonymous usage data via PostHog. To disable:

```bash
MOBILEWRIGHT_DISABLE_TELEMETRY=1 npx mobilewright test
```

---

## 16. Real Devices in the Cloud

Need real phones — not just simulators? **Mobile Next Cloud** provides API access to hundreds of real Android and iOS devices. Your existing Mobilewright tests run unchanged — just point your config at the Mobile Next Cloud endpoint.

```typescript
export default defineConfig({
    // Point at Mobile Next Cloud
    use: {
        serverUrl: 'wss://cloud.mobilenext.io',
    },
    bundleId: 'com.example.myapp',
});
```

Mobile Next Cloud is the only device cloud with native Mobilewright support. It handles provisioning, real device rotation, and parallel test execution at scale.

---

## Framework Compatibility Reference

| Framework            | iOS | Android | Notes                             |
| -------------------- | --- | ------- | --------------------------------- |
| UIKit / Storyboards  | ✅  | —       | Full native element types         |
| SwiftUI              | ✅  | —       | Maps to XCUIElementType           |
| Jetpack Compose      | —   | ✅      | Renders to native a11y nodes      |
| Android Views (XML)  | —   | ✅      | Full native element types         |
| React Native         | ✅  | ✅      | RN-specific types mapped to roles |
| Expo                 | ✅  | ✅      | Same as React Native              |
| Flutter              | ⏳  | ⏳      | Requires Dart VM Service driver   |
| .NET MAUI            | ✅  | ✅      | Compiles to native controls       |
| Cordova / Capacitor  | ✅  | ✅      | WebView content via a11y tree     |
| NativeScript         | ✅  | ✅      | Renders to native views           |
| Kotlin Multiplatform | ⏳  | ✅      | iOS Compose support in progress   |

---

## Quick Reference Card

```typescript
// Launch
const device = await ios.launch({ bundleId: 'com.example.app' });
const { screen } = device;

// Find elements
screen.getByRole('button', { name: 'Sign In' });
screen.getByLabel('Email');
screen.getByTestId('submit-btn');
screen.getByText('Welcome');
screen.getByText(/welcome/i);
screen.getByPlaceholder('Search...');

// Act
await locator.tap();
await locator.doubleTap();
await locator.longPress({ duration: 1000 });
await locator.fill('text here');
await locator.clear();
await locator.scrollIntoViewIfNeeded();

// Assert
await expect(locator).toBeVisible();
await expect(locator).toHaveText('...');
await expect(locator).toHaveValue('...');
await expect(locator).toBeEnabled();
await expect(locator).toHaveCount(3);

// Screen actions
await screen.swipe('up');
await screen.pressButton('HOME');
await screen.screenshot();

// Device
await device.setOrientation('landscape');
await device.goto('myapp://deep-link');
await device.launchApp('com.example.app');
await device.terminateApp('com.example.app');
await device.close();
```

---

_Licensed under the Apache License 2.0_
