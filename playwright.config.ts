import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';


dotenv.config();

export default defineConfig({

    testDir: './tests',
    globalSetup: './tests/api/global-setup.ts',

    fullyParallel: true,


    forbidOnly: !!process.env.CI,


    retries: process.env.CI ? 1 : 0,


    ...(process.env.CI ? { workers: 1 } : {}),


    reporter: 'html',

    use: {
        trace: 'on',
    },

    projects: [

        {
            name: 'Test API',
            testDir: './tests/api',

            fullyParallel: false,

            use: {
                baseURL: process.env.BASE_URL ?? 'https://dummyjson.com',
                extraHTTPHeaders: {
                    'Content-Type': 'application/json',
                },
            },
        },

        {
            name: 'Test UI',

            testDir: './tests/ui',

            use: {
                ...devices['Desktop Chrome'],
                baseURL: process.env.UI_BASE_URL ?? 'https://www.demoblaze.com',
                headless: true,
                trace: 'on-first-retry',
            },
        },
    ],
});
