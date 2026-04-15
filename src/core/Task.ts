import { Actor } from './Actor';

export interface Task<T = void> {
    performAs(actor: Actor): Promise<T>;
}
