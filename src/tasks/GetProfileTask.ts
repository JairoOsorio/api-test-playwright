
import { APIResponse } from '@playwright/test';
import { Actor } from '../core/Actor';
import { Task } from '../core/Task';
import { CallApi } from '../abilities/CallApi';

export class GetProfileTask implements Task<APIResponse> {
    static create(): GetProfileTask {
        return new GetProfileTask();
    }

    async performAs(actor: Actor): Promise<APIResponse> {
        const api = actor.abilityTo<CallApi>(CallApi);
        return api.requestContext.get('/auth/me', {
            headers: api.buildHeaders(),
        });
    }
}