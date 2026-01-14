import { CryptoResultRepository } from '../../infrastructure/repositories/crypto-result.repository';
import { OpeningAverageRepository } from '../../infrastructure/repositories/opening-average.repository';
import { QueryLogRepository } from '../../infrastructure/repositories/query-log.repository';
import { KrakenClient } from '../../infrastructure/api/kraken.client';
import { AnalysisResult } from '../../domain/entities/analysis-result.entity';
import { ResourceNotFoundError, ValidationError } from '../../domain/errors/domain.error';

export class CryptoAnalysisService {
	private resultRepo: CryptoResultRepository;
	private openingRepo: OpeningAverageRepository;
	private logRepo: QueryLogRepository;
	private krakenClient: KrakenClient;

	constructor() {
		this.resultRepo = new CryptoResultRepository();
		this.openingRepo = new OpeningAverageRepository();
		this.logRepo = new QueryLogRepository();
		this.krakenClient = new KrakenClient();
	}

	async analyze(symbol: string, investment: number) {
		// 1. Log the query
		await this.logRepo.create({ symbol, investment });

		// 2. Check if result already exists (Cache)
		const cachedResult = await this.resultRepo.findBySymbolAndInvestment(symbol, investment);
		if (cachedResult) {
			return {
				...cachedResult,
				NUMBERCOINS: parseFloat(cachedResult.NUMBERCOINS.toString())
			};
		}

		// 3. Check if symbol exists on Kraken
		const exists = await this.krakenClient.checkSymbolExists(symbol);
		if (!exists) {
			throw new ResourceNotFoundError(`Symbol ${symbol}`);
		}

		// 4. Get Opening Average
		let averageStartPrice = await this.openingRepo.findBySymbol(symbol);

		if (!averageStartPrice) {
			const ohlc = await this.krakenClient.fetchOHLC(symbol);
			const dataPoints = this.krakenClient.extractDataPoints(ohlc);
			const startData = dataPoints.slice(0, 4);

			averageStartPrice = this.calculateAverage(startData);
			if (averageStartPrice === 0) {
				throw new ValidationError('Could not calculate a valid starting price from historical data');
			}

			await this.openingRepo.create({ symbol, average: averageStartPrice });
		}

		// 5. Get Current Average
		const currentOhlc = await this.krakenClient.fetchOHLC(symbol);
		const currentDataPoints = this.krakenClient.extractDataPoints(currentOhlc);
		const averageEndPrice = this.calculateAverage(currentDataPoints);

		// 6. Calculate Results (Domain Logic)
		const result = AnalysisResult.calculate(symbol, investment, averageStartPrice, averageEndPrice);

		// 7. Save Result
		await this.resultRepo.create(result.toDTO());

		// 8. Return Formatting (legacy keys for compatibility)
		return result.toLegacyFormat();
	}

	private calculateAverage(
		data: Array<[number, string, string, string, string, string, string, number]>
	): number {
		if (data.length === 0) return 0;
		const sum = data.reduce((acc, row) => acc + parseFloat(row[4]), 0);
		return sum / data.length;
	}
}
