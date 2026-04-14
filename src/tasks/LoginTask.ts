import { APIResponse } from '@playwright/test';
import { Actor } from '../core/Actor';
import { Task } from '../core/Task';
import { CallAnApi } from '../abilities/CallAnApi';
import { TokenManager } from '../utils/TokenManager';

// LoginTask implementa Task<APIResponse>
// T = APIResponse porque la tarea devuelve la respuesta HTTP completa.
// Esto permite que el test pueda hacerle preguntas a esa respuesta.
export class LoginTask implements Task<APIResponse> {

    // Constructor privado — obliga a usar el factory method LoginTask.with()
    // Esto hace el código de test más legible:
    // alice.attemptsTo(LoginTask.with('emilys', 'emilyspass'))
    private constructor(
        private readonly username: string,
        private readonly password: string,
    ) {}

    // Factory method estático — crea una LoginTask con credenciales específicas
    static with(username: string, password: string): LoginTask {
        return new LoginTask(username, password);
    }

    // Implementación del método de la interfaz Task.
    // Recibe el actor para poder obtener su habilidad CallAnApi.
    async performAs(actor: Actor): Promise<APIResponse> {
        // Recupera la habilidad CallAnApi del actor.
        // Si el actor no la tiene, lanzará un error descriptivo.
        const api = actor.abilityTo<CallAnApi>(CallAnApi);

        // Hace la petición POST al endpoint de login
        const response = await api.requestContext.post('/auth/login', {
            headers: api.buildHeaders(),
            data: {
                username: this.username,
                password: this.password,
                expiresInMins: 30, // El token expira en 30 minutos
            },
        });

        // Si el login fue exitoso (status 2xx), guarda el token
        // para que otros tests puedan reutilizarlo sin hacer login de nuevo
        if (response.ok()) {
            const body = await response.json();
            TokenManager.save(body.accessToken);
            api.withToken(body.accessToken);
        }

        // Siempre devuelve la respuesta completa para que el test
        // pueda verificar el status, el body, los headers, etc.
        return response;
    }
}    