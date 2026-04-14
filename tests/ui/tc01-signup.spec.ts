import { test, expect } from '@playwright/test';
import { Actor } from '../../src/core/Actor';
import { BrowseTheWeb } from '../../src/abilities/BrowseTheWeb';
import { SignUpTask } from '../../src/tasks/SignUpTask';

test('TC-01 | Sign up exitoso — el usuario se registra correctamente', async ({ page }) => {
    let bob: Actor;
    let alertMessage: string;

    const username = `testuser_${Date.now()}`;
    const password = 'Test1234!';

    await test.step('Given: Bob puede navegar en el navegador', async () => {
        bob = Actor.named('Bob').whoCan(new BrowseTheWeb(page));
    });

    await test.step('When: Bob completa el formulario de Sign up con credenciales válidas', async () => {
        alertMessage = await bob.attemptsTo(SignUpTask.with(username, password));
    });

    await test.step('Then: El sistema confirma que el registro fue exitoso', async () => {
        expect(alertMessage, 'La alerta debe confirmar el registro').toBe('Sign up successful.');
    });
});
