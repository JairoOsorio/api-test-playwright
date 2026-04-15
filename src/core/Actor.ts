
import { Task } from './Task';
import { Question } from './Question';

export class Actor {


    private abilities: Map<string, unknown> = new Map();
    private constructor(public name: string) {}


    static named(name: string): Actor {
        return new Actor(name);
    }

    whoCan(...abilities: { name: string }[]): this {
        abilities.forEach(a => this.abilities.set(a.name, a));
        return this;
    }

    abilityTo<T extends { name: string }>(cls: { abilityName: string }): T {
        const ability = this.abilities.get(cls.abilityName);
        if (!ability) {
            throw new Error(`${this.name} does not have the ability to ${cls.abilityName}`);
        }
        return ability as T;
    }

    async attemptsTo<T>(task: Task<T>): Promise<T> {
        return task.performAs(this);
    }

    async asks<T>(question: Question<T>): Promise<T> {
        return question.answeredBy(this);
    }
}
