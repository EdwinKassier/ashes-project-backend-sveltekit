import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CryptoAnalysisService } from './crypto-analysis.service';
import { ResourceNotFoundError } from '../../domain/errors/domain.error';

// Mock dependencies
vi.mock('../../infrastructure/repositories/crypto-result.repository', () => ({
	CryptoResultRepository: class {
		create = vi.fn();
		findBySymbolAndInvestment = vi.fn().mockResolvedValue(null);
	}
}));
vi.mock('../../infrastructure/repositories/opening-average.repository', () => ({
	OpeningAverageRepository: class {
		create = vi.fn();
		findBySymbol = vi.fn().mockResolvedValue(null);
	}
}));
vi.mock('../../infrastructure/repositories/query-log.repository', () => ({
	QueryLogRepository: class {
		create = vi.fn().mockResolvedValue(undefined);
	}
}));
vi.mock('../../infrastructure/api/kraken.client', () => ({
	KrakenClient: class {
		fetchOHLC = vi.fn();
		checkSymbolExists = vi.fn();
		extractDataPoints = vi.fn();
	}
}));

import { KrakenClient } from '../../infrastructure/api/kraken.client';

describe('CryptoAnalysisService', () => {
	let service: CryptoAnalysisService;
	let mockKraken: any;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new CryptoAnalysisService();
		// Access the mocked instance (this is a bit hacky in vitest but works with class mocks)
		mockKraken = (service as any).krakenClient;
	});

	it('should throw ResourceNotFoundError if symbol does not exist', async () => {
		mockKraken.checkSymbolExists.mockResolvedValue(false);

		await expect(service.analyze('FAKE', 100)).rejects.toThrow(ResourceNotFoundError);
	});

	it('should return analysis result for valid symbol', async () => {
		mockKraken.checkSymbolExists.mockResolvedValue(true);

		const mockOhlcData = { result: { 'BTCUSD': [] } };
		mockKraken.fetchOHLC.mockResolvedValue(mockOhlcData);

		const mockDataPoints = [
			[1609459200, '29000', '29500', '28500', '29200', '29100', '100', 50],
			[1609545600, '29200', '29800', '29000', '29500', '29300', '120', 60],
			[1609632000, '29500', '30000', '29200', '29800', '29500', '110', 55],
			[1609718400, '29800', '30200', '29500', '30000', '29700', '130', 65],
		];
		mockKraken.extractDataPoints.mockReturnValue(mockDataPoints);

		const result = await service.analyze('BTC', 1000);

		expect(result).toHaveProperty('SYMBOL', 'BTC');
		expect(result).toHaveProperty('INVESTMENT', 1000);
		expect(result).toHaveProperty('PROFIT');
		expect(result).toHaveProperty('NUMBERCOINS');
	});
});
