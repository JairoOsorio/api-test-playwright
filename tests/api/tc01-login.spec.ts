import { test, expect, APIResponse } from '@playwright/test';
import { Actor } from '../../src/core/Actor';
import { CallApi } from '../../src/abilities/CallApi';
import { LoginTask } from '../../src/tasks/LoginTask';
import { ResponseStatus } from '../../src/questions/ResponseStatus';
import { ResponseBody } from '../../src/questions/ResponseBody';
import { TokenManager } from '../../src/utils/TokenManager';

test('TC-01 | Login exitoso — genera y persiste el token', async ({ request }) => {

    let alice: Actor;
    let response: APIResponse;
    let status: number;
    let body: { accessToken: string; username: string };

    const username = process.env.TEST_USERNAME
        ?? (() => { throw new Error('TEST_USERNAME no está definido en .env'); })();
    const password = process.env.TEST_PASSWORD
        ?? (() => { throw new Error('TEST_PASSWORD no está definido en .env'); })();

    await test.step('Given: Alice tiene credenciales válidas y puede llamar a la API', async () => {
        alice = Actor.named('Alice').whoCan(new CallApi(request));
    });

    await test.step('When: Alice intenta hacer login con sus credenciales', async () => {
        response = await alice.attemptsTo(LoginTask.with(username, password));
    });

    await test.step('Then: La respuesta es 200, incluye un accessToken y persiste el token', async () => {

        status = await alice.asks(ResponseStatus.of(response));
        expect(status, 'Debe retornar 200 OK').toBe(200);

        body = await alice.asks(ResponseBody.of<{ accessToken: string; username: string }>(response));
        expect(body.accessToken, 'Debe venir accessToken en el cuerpo').toBeTruthy();
        expect(body.username, 'El username del cuerpo debe coincidir con el enviado').toBe(username);
        expect(TokenManager.exists(), 'El token debe haberse guardado en .env').toBe(true);
    });


});
