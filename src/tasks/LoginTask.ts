import { APIResponse } from '@playwright/test';
import { Actor } from '../core/Actor';
import { Task } from '../core/Task';
import { CallApi } from '../abilities/CallApi';
import { TokenManager } from '../utils/TokenManager';


export class LoginTask implements Task<APIResponse> {


    private constructor(
        private readonly username: string,
        private readonly password: string,
    ) {}


    static with(username: string, password: string): LoginTask {
        return new LoginTask(username, password);
    }

    async performAs(actor: Actor): Promise<APIResponse> {

        const api = actor.abilityTo<CallApi>(CallApi);


        const response = await api.requestContext.post('/auth/login', {
            headers: api.buildHeaders(),
            data: {
                username: this.username,
                password: this.password,
                expiresInMins: 30, // El token expira en 30 minutos
            },
        });

        if (response.ok()) {
            const body = await response.json();
            TokenManager.save(body.accessToken);
            api.withToken(body.accessToken);
        }

        return response;
    }
}    