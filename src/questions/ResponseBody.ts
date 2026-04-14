import { APIResponse } from '@playwright/test';
import { Question } from '../core/Questions';
import { Actor } from '../core/Actor';

// ResponseBody es doblemente genérica:
// - La clase en sí es Question<T>
// - T es el tipo del cuerpo JSON que el test espera recibir
// Ejemplo: ResponseBody.of<{ accessToken: string }>(response)
// garantiza que body.accessToken existe y es string en TypeScript
export class ResponseBody<T = Record<string, unknown>> implements Question<T> {

    private constructor(private readonly response: APIResponse) {}

    // Factory method genérico — permite especificar el tipo del cuerpo
    // en el momento de uso, no en el momento de definición
    static of<T>(response: APIResponse): ResponseBody<T> {
        return new ResponseBody<T>(response);
    }

    // Parsea el cuerpo de la respuesta como JSON y lo tipea como T
    async answeredBy(_actor: Actor): Promise<T> {
        return await this.response.json() as Promise<T>;
    }
}