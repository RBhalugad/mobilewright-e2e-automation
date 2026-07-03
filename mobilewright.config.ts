import { defineConfig } from 'mobilewright';

export default defineConfig({
  platform: 'android',
  bundleId: 'com.androidsample.generalstore',
  deviceName: /192\.168\.1\.6:46673/,
  //installApps: './resources/General-Store.apk',
  timeout: 60_000,
  testDir: './tests',
  reporter: 'html',
});
