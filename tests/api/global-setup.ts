import { request } from '@playwright/test';
import dotenv from 'dotenv';
import { TokenManager } from '../../src/utils/TokenManager';

dotenv.config();

export default async function globalSetup(): Promise<void> {

    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    if (!username || !password) {
        throw new Error('[global-setup] TEST_USERNAME o TEST_PASSWORD no están definidos en .env');
    }

    const baseURL = process.env.BASE_URL as string;


    const context = await request.newContext({
        baseURL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });

    try {
        const response = await context.post('/auth/login', {
            data: { username, password, expiresInMins: 30 },
        });

        if (!response.ok()) {
            throw new Error(`[global-setup] Login fallido con status ${response.status()}`);
        }

        const body = await response.json();
        TokenManager.save(body.accessToken);
        console.log('[global-setup] Token renovado y guardado en .env');

    } finally {
        await context.dispose();
    }
}
