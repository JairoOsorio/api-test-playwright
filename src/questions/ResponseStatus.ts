import { APIResponse } from '@playwright/test';
import { Question } from '../core/Question';
import { Actor } from '../core/Actor';


export class ResponseStatus implements Question<number> {


    private constructor(private readonly response: APIResponse) {}


    static of(response: APIResponse): ResponseStatus {
        return new ResponseStatus(response);
    }

    async answeredBy(_actor: Actor): Promise<number> {
        return this.response.status();
    }
}