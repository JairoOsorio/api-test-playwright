import { Actor } from '../core/Actor';
import { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class SignUpTask implements Task<string> {

    private constructor(
        private readonly username: string,
        private readonly password: string,
    ) {}

    static with(username: string, password: string): SignUpTask {
        return new SignUpTask(username, password);
    }

    async performAs(actor: Actor): Promise<string> {

        const page = actor.abilityTo<BrowseTheWeb>(BrowseTheWeb).currentPage;
        await page.goto('/');

        await page.locator('#signin2').click();
        await page.locator('#signInModal').waitFor({ state: 'visible' });
        await page.locator('#sign-username').fill(this.username);
        await page.locator('#sign-password').fill(this.password);

        const dialogMessage = new Promise<string>(resolve => {
            page.once('dialog', async dialog => {
                const message = dialog.message();
                await dialog.accept();
                resolve(message);
            });
        });
        await page.locator('#signInModal').getByRole('button', { name: 'Sign up' }).click();

        return await dialogMessage;
    }
}
