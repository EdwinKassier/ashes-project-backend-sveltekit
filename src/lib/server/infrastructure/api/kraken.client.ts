export interface KrakenOHLCResponse {
	error: string[];
	result: Record<string, Array<[number, string, string, string, string, string, string, number]>>;
}

export class KrakenClient {
	private readonly baseUrl = 'https://api.kraken.com/0/public';

	async fetchOHLC(symbol: string): Promise<KrakenOHLCResponse> {
		const url = `${this.baseUrl}/OHLC?pair=${symbol}USD&interval=21600&since=1548111600`;
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Kraken API error: ${response.statusText}`);
			}
			return (await response.json()) as KrakenOHLCResponse;
		} catch (error) {
			console.error(`Failed to fetch OHLC for ${symbol}:`, error);
			throw error;
		}
	}

	async checkSymbolExists(symbol: string): Promise<boolean> {
		try {
			const data = await this.fetchOHLC(symbol);
			return !(data.error && data.error.length > 0);
		} catch {
			return false;
		}
	}

	extractDataPoints(
		response: KrakenOHLCResponse
	): Array<[number, string, string, string, string, string, string, number]> {
		const resultKeys = Object.keys(response.result || {}).filter((k) => k !== 'last');
		const dataKey = resultKeys[0];
		return dataKey ? response.result[dataKey] ?? [] : [];
	}
}
