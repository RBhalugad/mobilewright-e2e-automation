import { defineConfig } from 'mobilewright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    platform: 'android',
    bundleId: 'com.androidsample.generalstore',
    deviceName: /S23/,
    //installApps: path.join(__dirname, 'resources', 'General-Store.apk'),
    timeout: 60_000,
    testDir: './tests',
    reporter: 'html',
});
