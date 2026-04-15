import {APIResponse, expect, test} from '@playwright/test';
import { Actor } from '../../src/core/Actor';
import { CallApi } from '../../src/abilities/CallApi';
import { UpdateProductTask, UpdateProductData } from '../../src/tasks/UpdateProductTask';
import { ResponseStatus } from '../../src/questions/ResponseStatus';
import { ResponseBody } from '../../src/questions/ResponseBody';
import { TokenManager } from '../../src/utils/TokenManager';

test('TC-04 | Actualizar producto — los campos enviados se reflejan en la respuesta', async ({ request }) => {
    let dave: Actor;
    let response: APIResponse;
    const productId = 1;
    const updates: UpdateProductData = { title: 'iPhone 16 Pro Updated', price: 1299.99 };

    await test.step('Given: Dave está autenticado y puede llamar a la API', async () => {
        const api = new CallApi(request).withToken(TokenManager.get() as string);
        dave = Actor.named('Dave').whoCan(api);
    });

    await test.step(`When: Dave actualiza el producto con id ${productId}`, async () => {
        response = await dave.attemptsTo(
            UpdateProductTask.on(productId, updates),
        );
    });

    await test.step('Then: La respuesta es 200 y el producto refleja los cambios enviados', async () => {
        const status = await dave.asks(ResponseStatus.of(response));
        expect(status, 'Debe retornar 200 OK').toBe(200);

        const body = await dave.asks(ResponseBody.of<{ id: number; title: string; price: number }>(response));
        expect(body.id).toBe(productId);
        expect(body.title).toBe(updates.title);
        expect(body.price).toBe(updates.price);
    });
});
