import { APIResponse } from '@playwright/test';
import { Question } from '../core/Question';
import { Actor } from '../core/Actor';


export class ResponseBody<T = Record<string, unknown>> implements Question<T> {

    private constructor(private readonly response: APIResponse) {}

    static of<T>(response: APIResponse): ResponseBody<T> {
        return new ResponseBody<T>(response);
    }

    async answeredBy(_actor: Actor): Promise<T> {
        return await this.response.json() as Promise<T>;
    }
}