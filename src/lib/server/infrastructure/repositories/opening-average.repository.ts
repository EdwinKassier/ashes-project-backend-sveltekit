import prisma from '../database/prisma';

export interface CreateOpeningAverageDTO {
	symbol: string;
	average: number;
}

export class OpeningAverageRepository {
	async findBySymbol(symbol: string): Promise<number | null> {
		try {
			const result = await prisma.opening_Average.findFirst({
				where: { SYMBOL: symbol }
			});
			return result ? result.AVERAGE : null;
		} catch (error) {
			console.error('Error retrieving historical cache:', error);
			return null;
		}
	}

	async create(data: CreateOpeningAverageDTO): Promise<void> {
		try {
			await prisma.opening_Average.create({
				data: {
					SYMBOL: data.symbol,
					AVERAGE: data.average,
					GENERATIONDATE: new Date()
				}
			});
			console.log(`Opening average saved for ${data.symbol}`);
		} catch (error) {
			console.error('Error inserting into opening_average:', error);
			throw error;
		}
	}
}
