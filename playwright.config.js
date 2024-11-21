// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['dot'],
        ['allure-playwright'],
        [
            'json',
            {
                outputFile: 'jsonReports/jsonReport.json',
            },
        ],

        [
            'html',
            {
                open: 'never',
            },
        ],
    ],
    use: {
        /* Base URL to use for API requests */
        baseURL: 'https://gorest.co.in/public/v2', // GoRest API base URL

        /* Collect trace when retrying the failed test. */
        trace: 'on-first-retry',
    },

});
