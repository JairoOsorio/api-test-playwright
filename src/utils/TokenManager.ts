import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

const ENV_PATH = path.resolve(process.cwd(), '.env');

export class TokenManager {

    static save(accessToken: string): void {

        const content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf-8') : '';
        const lines = content.split('\n');
        const idx = lines.findIndex(l => l.startsWith('ACCESS_TOKEN='));

        if (idx !== -1) {
            lines[idx] = `ACCESS_TOKEN=${accessToken}`;
        } else {
            lines.push(`ACCESS_TOKEN=${accessToken}`);
        }
        fs.writeFileSync(ENV_PATH, lines.join('\n'), { encoding: 'utf-8' });

        process.env.ACCESS_TOKEN = accessToken;
        dotenv.config({ override: true });
    }

    static get(): string | undefined {
        const token = process.env.ACCESS_TOKEN;
        if (!token) {
            throw new Error('ACCESS_TOKEN not found in environment variables');
        }
        return token;
    }

    static exists(): boolean {
        return !!process.env.ACCESS_TOKEN;
    }
}
