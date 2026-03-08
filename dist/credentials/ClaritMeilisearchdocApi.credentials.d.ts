import { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class ClaritMeilisearchdocApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: Icon;
    documentationUrl: string;
    test: {
        request: {
            baseURL: string;
            url: string;
        };
    };
    properties: INodeProperties[];
}
