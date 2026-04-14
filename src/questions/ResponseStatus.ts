import { APIResponse } from '@playwright/test';
import { Question } from '../core/Questions';
import { Actor } from '../core/Actor';

// ResponseStatus implementa Question<number>
// T = number porque el status HTTP es un número (200, 401, 404, etc.)
export class ResponseStatus implements Question<number> {

    // Constructor privado — usa el factory method ResponseStatus.of(response)
    private constructor(private readonly response: APIResponse) {}

    // Factory method — crea una instancia con la respuesta que se quiere consultar
    static of(response: APIResponse): ResponseStatus {
        return new ResponseStatus(response);
    }

    // Implementación de la interfaz Question.
    // El actor no se usa aquí porque el status viene directamente de la respuesta,
    // pero la interfaz lo requiere para mantener la consistencia del patrón.
    async answeredBy(_actor: Actor): Promise<number> {
        return this.response.status();
    }
}