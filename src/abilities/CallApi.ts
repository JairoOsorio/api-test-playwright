import {APIRequestContext} from "@playwright/test";

export class CallApi {
    static readonly abilityName = "CallApi";

    readonly name = CallApi.abilityName;

    private token: string | null = null;

    constructor(private readonly request: APIRequestContext) {}

    withToken(token: string): this {
        this.token = token;
        return this;
    }

    get requestContext(): APIRequestContext {
        return this.request;
    }

    buildHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }
    return headers;
    }    

}   