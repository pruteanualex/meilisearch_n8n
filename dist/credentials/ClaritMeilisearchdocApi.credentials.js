"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaritMeilisearchdocApi = void 0;
class ClaritMeilisearchdocApi {
    constructor() {
        this.name = 'meilisearchAuthApi';
        this.displayName = 'Meilisearch Auth API';
        this.icon = { light: 'file:../icons/example.svg', dark: 'file:../icons/example.dark.svg' };
        this.documentationUrl = 'https://www.clarit.ro/';
        this.test = {
            request: {
                baseURL: 'http://domain.ro:7700',
                url: '/indexes/{index}/search',
            },
        };
        this.properties = [
            {
                displayName: 'Meilisearch Bearer token',
                name: 'api_key',
                type: 'string',
                default: '',
                typeOptions: { password: true },
            },
        ];
    }
}
exports.ClaritMeilisearchdocApi = ClaritMeilisearchdocApi;
//# sourceMappingURL=ClaritMeilisearchdocApi.credentials.js.map