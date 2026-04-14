import { APIResponse } from '@playwright/test';
import { Actor } from '../core/Actor';
import { Task } from '../core/Task';
import { CallApi } from '../abilities/CallApi';

export interface UpdateProductData {
    title?: string;
    price?: number;
}

export class UpdateProductTask implements Task<APIResponse> {

    // Constructor privado — obliga a usar el factory method UpdateProductTask.on()
    private constructor(
        private readonly productId: number,
        private readonly updates: UpdateProductData,
    ) {}

    // Factory method — recibe el id del producto y los campos a actualizar
    static on(productId: number, updates: UpdateProductData): UpdateProductTask {
        return new UpdateProductTask(productId, updates);
    }

    async performAs(actor: Actor): Promise<APIResponse> {
        const api = actor.abilityTo<CallApi>(CallApi);
        return api.requestContext.put(`/products/${this.productId}`, {
            headers: api.buildHeaders(),
            data: this.updates,
        });
    }
}
