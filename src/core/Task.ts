import {Actor} from './Actor';

export interface Task <T> {
  performAs(actor: Actor): Promise<T>;
}