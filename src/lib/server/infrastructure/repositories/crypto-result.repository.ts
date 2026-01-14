import prisma from '../database/prisma';

export interface CreateResultDTO {
	query: string;
	symbol: string;
	investment: number;
	numberOfCoins: number;
	profit: number;
	growthFactor: number;
	lambos: number;
}

export interface ResultEntity {
	QUERY: string;
	SYMBOL: string;
	NUMBERCOINS: number;
	PROFIT: number;
	GROWTHFACTOR: number;
	LAMBOS: number;
	INVESTMENT: number;
	GENERATIONDATE: Date;
}

export class CryptoResultRepository {
	async findBySymbolAndInvestment(
		symbol: string,
		investment: number
	): Promise<ResultEntity | null> {
		try {
			const result = await prisma.results.findFirst({
				where: { SYMBOL: symbol, INVESTMENT: investment }
			});
			return result;
		} catch (error) {
			console.error('Error retrieving valid final result:', error);
			return null;
		}
	}

	async create(data: CreateResultDTO): Promise<void> {
		try {
			await prisma.results.create({
				data: {
					QUERY: data.query,
					SYMBOL: data.symbol,
					INVESTMENT: data.investment,
					NUMBERCOINS: data.numberOfCoins,
					PROFIT: data.profit,
					GROWTHFACTOR: data.growthFactor,
					LAMBOS: data.lambos,
					GENERATIONDATE: new Date()
				}
			});
			console.log(`Result saved for ${data.symbol}-${data.investment}`);
		} catch (error) {
			console.error('Error inserting into results:', error);
			throw error;
		}
	}
}
