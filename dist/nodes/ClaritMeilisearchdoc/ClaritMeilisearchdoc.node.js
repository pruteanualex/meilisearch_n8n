"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaritMeilisearchdoc = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const meilisearch_1 = require("meilisearch");
const n8n_workflow_1 = require("n8n-workflow");
const store_data_path_conf = path.join(__dirname, 'data.json');
const store_data_config = JSON.parse(fs.readFileSync(store_data_path_conf, 'utf8'));
const nodeDescription = {
    displayName: 'ClarIT Meilisearch Doc',
    name: 'claritMeilisearchdoc',
    group: ['input'],
    version: 1,
    description: 'Meilisearch Doc Integrator',
    defaults: {
        name: 'ClarIT Meilisearch Doc',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
        {
            name: 'meilisearchAuthApi',
            required: true,
            type: 'string'
        }
    ],
    properties: [
        {
            displayName: 'JSON Produse',
            name: 'data_produse',
            type: 'json',
            required: true,
            default: '',
        },
        {
            displayName: 'URL Meilisearch',
            name: 'url_meilisearch',
            type: 'string',
            default: '',
            placeholder: (_a = store_data_config === null || store_data_config === void 0 ? void 0 : store_data_config.url) !== null && _a !== void 0 ? _a : 'http://localhost:7700',
            required: (store_data_config === null || store_data_config === void 0 ? void 0 : store_data_config.url) === "http://127.0.0.1:7700" ? true : false,
            description: 'URL intern meilisearch',
        },
        {
            displayName: 'Index',
            name: 'index_meilisearch',
            type: 'string',
            default: '',
            placeholder: (_b = store_data_config === null || store_data_config === void 0 ? void 0 : store_data_config.index) !== null && _b !== void 0 ? _b : '{{index}}',
            required: (store_data_config === null || store_data_config === void 0 ? void 0 : store_data_config.index) === "{{index}}" ? true : false,
            description: 'Index-ul unde salvam datele',
        }
    ]
};
class ClaritMeilisearchdoc {
    constructor() {
        this.description = {
            ...nodeDescription,
            icon: { light: 'file:../../icons/clarit_icon.svg', dark: 'file:../../icons/clarit_icon.svg' },
        };
    }
    async execute() {
        const items = this.getInputData();
        const credentials = await this.getCredentials('meilisearchAuthApi');
        const cred_data = credentials === null || credentials === void 0 ? void 0 : credentials.api_key;
        let item;
        let data_produse;
        let url_meilisearch;
        let index_meilisearch;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                data_produse = this.getNodeParameter('data_produse', itemIndex, '');
                url_meilisearch = this.getNodeParameter('url_meilisearch', itemIndex, '');
                index_meilisearch = this.getNodeParameter('index_meilisearch', itemIndex, '');
                item = items[itemIndex];
                let dist_url;
                let dist_index;
                const stored_url = store_data_config === null || store_data_config === void 0 ? void 0 : store_data_config.url;
                const stored_index = store_data_config === null || store_data_config === void 0 ? void 0 : store_data_config.index;
                if (stored_url !== url_meilisearch || stored_index !== index_meilisearch) {
                    await fs.promises.writeFile(store_data_path_conf, JSON.stringify({ "url": url_meilisearch !== "" ? url_meilisearch : stored_url, "index": index_meilisearch !== "" ? index_meilisearch : stored_index }));
                    dist_url = url_meilisearch !== "" ? url_meilisearch.trim() : stored_url.trim();
                    dist_index = index_meilisearch !== "" ? index_meilisearch.trim() : stored_index.trim();
                }
                else {
                    dist_url = stored_url.trim();
                    dist_index = stored_index.trim();
                }
                const client = new meilisearch_1.Meilisearch({
                    host: dist_url,
                    apiKey: cred_data,
                });
                const index = client.index(dist_index);
                await index.addDocuments(data_produse).then(response => {
                    item.json.response = response;
                }).catch(error => {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex,
                    });
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
                }
                else {
                    if (error.context) {
                        error.context.itemIndex = itemIndex;
                        throw error;
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex,
                    });
                }
            }
        }
        return [items];
    }
}
exports.ClaritMeilisearchdoc = ClaritMeilisearchdoc;
//# sourceMappingURL=ClaritMeilisearchdoc.node.js.map