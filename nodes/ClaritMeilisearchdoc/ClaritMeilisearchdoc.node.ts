import * as fs from 'fs';
import * as path from 'path';
import { Meilisearch } from "meilisearch";
import type {IExecuteFunctions,INodeExecutionData,INodeType,INodeTypeDescription, JsonObject, Icon} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError} from 'n8n-workflow';

const store_data_path_conf = path.join(__dirname, 'data.json');
const store_data_config = JSON.parse(fs.readFileSync(store_data_path_conf, 'utf8'));

// console.log(store_data)
const nodeDescription = {
		displayName: 'ClarIT Meilisearch Doc',
		name: 'claritMeilisearchdoc',
		group: ['input'],
		version: 1,
		description: 'Meilisearch Doc Integrator',
		defaults: {
			name: 'ClarIT Meilisearch Doc',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
				required:true,
				default: '',
			},
			{
				displayName: 'URL Meilisearch',
				name: 'url_meilisearch',
				type:  'string',
				default: '',
				placeholder: (store_data_config as JsonObject)?.url as string ?? 'http://localhost:7700',
				required:  (store_data_config as JsonObject)?.url as string === "http://127.0.0.1:7700" ? true : false, 
				description: 'URL intern meilisearch',
			},
			{
				displayName: 'Index',
				name: 'index_meilisearch',
				type:  'string',
				default: '',
				placeholder: (store_data_config as JsonObject)?.index as string ?? '{{index}}',
				required:  (store_data_config as JsonObject)?.index as string === "{{index}}" ? true : false, 
				description: 'Index-ul unde salvam datele',
			}
		]
	};
// eslint-disable-next-line @n8n/community-nodes/icon-validation
export class ClaritMeilisearchdoc implements INodeType {
	//widget form
	description = {
		...nodeDescription,
		icon:{ light: 'file:../../icons/clarit_icon.svg', dark: 'file:../../icons/clarit_icon.svg' } as Icon,
	} as INodeTypeDescription;
	//execution function
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('meilisearchAuthApi');
		const cred_data = credentials?.api_key as string;
		

		let item: INodeExecutionData;
		let data_produse: JsonObject;
		let url_meilisearch: string;
		let index_meilisearch: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				data_produse = this.getNodeParameter('data_produse', itemIndex, '') as JsonObject;
				url_meilisearch = this.getNodeParameter('url_meilisearch', itemIndex, '') as string;
				index_meilisearch = this.getNodeParameter('index_meilisearch', itemIndex, '') as string;
				item = items[itemIndex];

				let dist_url;
				let dist_index;

				const stored_url = (store_data_config as JsonObject)?.url as string;
				const stored_index = (store_data_config as JsonObject)?.index as string;

				if(stored_url !== url_meilisearch || stored_index !== index_meilisearch){
					await fs.promises.writeFile(store_data_path_conf, JSON.stringify({"url":url_meilisearch !== "" ? url_meilisearch : stored_url,"index":index_meilisearch !== "" ? index_meilisearch : stored_index}));
					dist_url = url_meilisearch !== "" ? url_meilisearch : stored_url;
					dist_index = index_meilisearch !== "" ? index_meilisearch : stored_index;
				} else {
					dist_url = stored_url;
					dist_index = stored_index;
				}

				const client = new Meilisearch({
					host: dist_url,
					apiKey: cred_data,
				})
				
				const index = client.index(dist_index)

				await index.addDocuments(data_produse as unknown as JsonObject[]).then(response =>{
					item.json.response = response;
				}).catch(error =>{
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				})

			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
