
import { test, expect, APIResponse } from '@playwright/test';
import { Actor } from '../../src/core/Actor';
import { CallApi } from '../../src/abilities/CallApi';
import { GetProfileTask } from '../../src/tasks/GetProfileTask';
import { ResponseStatus } from '../../src/questions/ResponseStatus';
import { ResponseBody } from '../../src/questions/ResponseBody';
import { TokenManager } from '../../src/utils/TokenManager';

test('TC-02 | Perfil autenticado — el token almacenado permite obtener el perfil', async ({ request }) => {
    let bob: Actor;
    let response: APIResponse;

    await test.step('Given: Bob está autenticado con el token almacenado', async () => {
        const api = new CallApi(request).withToken(TokenManager.get() as string);
        bob = Actor.named('Bob').whoCan(api);
    });

    await test.step('When: Bob solicita su perfil', async () => {
        response = await bob.attemptsTo(GetProfileTask.create());
    });

    await test.step('Then: La respuesta es 200 y el perfil contiene los datos del usuario', async () => {
        const status = await bob.asks(ResponseStatus.of(response));
        expect(status, 'Con token válido debe retornar 200').toBe(200);

        const body = await bob.asks(
            ResponseBody.of<{ id: number; username: string; email: string }>(response)
        );
        expect(body.id, 'El perfil debe tener un id').toBeDefined();
        expect(body.username, 'El perfil debe incluir el username').toBeTruthy();
        expect(body.email, 'El perfil debe incluir el email').toBeTruthy();
    });
});