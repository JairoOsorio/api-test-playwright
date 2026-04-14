import { APIResponse } from '@playwright/test';
import { Actor } from '../core/Actor';
import { Task } from '../core/Task';
import { CallApi } from '../abilities/CallApi';

export interface ProductData {
    title: string;
    price: number;
}

export class CreateProductTask implements Task<APIResponse> {

    private constructor(private readonly product: ProductData) {}

    static with(product: ProductData): CreateProductTask {
        return new CreateProductTask(product);
    }

    async performAs(actor: Actor): Promise<APIResponse> {
        const api = actor.abilityTo<CallApi>(CallApi);
        return api.requestContext.post('/products/add', {
            headers: api.buildHeaders(),
            data: this.product,
        });
    }
}
