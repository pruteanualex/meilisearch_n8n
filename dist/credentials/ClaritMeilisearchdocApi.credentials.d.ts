import { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class ClaritMeilisearchdocApi implements ICredentialType {
    name: string;
    displayName: string;
    icon: Icon;
    documentationUrl: string;
    properties: INodeProperties[];
    test: {
        request: {
            baseURL: 'http://domain.ro:7700';
            url: '/indexes/{index}/search';
        };
    };
}
