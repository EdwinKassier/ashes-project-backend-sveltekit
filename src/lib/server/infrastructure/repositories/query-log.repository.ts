import prisma from '../database/prisma';

export interface CreateLogDTO {
	symbol: string;
	investment: number;
}

export class QueryLogRepository {
	async create(data: CreateLogDTO): Promise<void> {
		try {
			await prisma.logging.create({
				data: {
					SYMBOL: data.symbol,
					INVESTMENT: data.investment,
					GENERATIONDATE: new Date()
				}
			});
			console.log(`Log saved for ${data.symbol}`);
		} catch (error) {
			console.error('Error inserting into logging:', error);
			throw error;
		}
	}
}
