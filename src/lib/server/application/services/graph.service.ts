import { KrakenClient } from '../../infrastructure/api/kraken.client';

export class GraphService {
	private krakenClient: KrakenClient;

	constructor() {
		this.krakenClient = new KrakenClient();
	}

	async getGraphData(symbol: string): Promise<Array<{ x: string; y: number }>> {
		try {
			const json = await this.krakenClient.fetchOHLC(symbol);

			if (json.error && json.error.length > 0) {
				throw new Error("Symbol doesn't exist");
			}

			const data = this.krakenClient.extractDataPoints(json);

			const graphData = data.map((row) => ({
				x: new Date(row[0] * 1000).toISOString(),
				y: parseFloat(row[4])
			}));

			return graphData;
		} catch (error) {
			console.error(`Graph data generation failed for ${symbol}:`, error);
			throw error;
		}
	}
}
