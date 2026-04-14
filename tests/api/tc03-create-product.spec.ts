import {APIResponse, expect, test} from '@playwright/test';
import { Actor } from '../../src/core/Actor';
import { CallApi } from '../../src/abilities/CallApi';
import { ResponseStatus } from '../../src/questions/ResponseStatus';
import { ResponseBody } from '../../src/questions/ResponseBody';
import { TokenManager } from '../../src/utils/TokenManager';
import {CreateProductTask} from "../../src/tasks/CreateProductTask";


test('TC-03 | Crear producto exitosamente', async ({ request }) => {
    let carol: Actor;
    let response: APIResponse;

    await test.step('Given: Carol está autenticada y puede llamar a la API', async () => {
        const api = new CallApi(request).withToken(TokenManager.get() as string);
        carol = Actor.named('Carol').whoCan(api);
    });

    await test.step('When: Carol crea un nuevo producto', async () => {
        response = await carol.attemptsTo(
            CreateProductTask.with({ title: 'Laptop Pro', price: 999.99 })
        );

    });

    await test.step('Then: El producto fue creado con id asignado', async () => {
        const status = await carol.asks(ResponseStatus.of(response));
        expect(status).toBe(201);
        const body = await carol.asks(ResponseBody.of<{ id: number }>(response));
        expect(body.id).toBeDefined();

        const data = await response.json();
        console.log("Response:", data);

    });
});