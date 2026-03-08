import {ICredentialType,INodeProperties,Icon} from 'n8n-workflow';

export class ClaritMeilisearchdocApi implements ICredentialType {
  name = 'meilisearchAuthApi';
  displayName = 'Meilisearch Auth API';
  icon: Icon = { light: 'file:../icons/example.svg', dark: 'file:../icons/example.dark.svg' };
  documentationUrl = 'https://www.clarit.ro/';
  test = {
    request: {
      baseURL: 'http://domain.ro:7700',
      url: '/indexes/{index}/search',
    },
  };
  properties: INodeProperties[] = [
    {
      displayName: 'Meilisearch Bearer token',
      name: 'api_key',
      type: 'string',
      default: '',
      typeOptions: { password: true },
    },
  ];
}