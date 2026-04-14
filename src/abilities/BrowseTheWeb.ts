import { Page } from '@playwright/test';

export class BrowseTheWeb {
    static readonly abilityName = 'BrowseTheWeb';

    readonly name = BrowseTheWeb.abilityName;

    constructor(private readonly page: Page) {}

    get currentPage(): Page {
        return this.page;
    }
}
