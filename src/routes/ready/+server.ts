import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/infrastructure/database/prisma';

export const GET: RequestHandler = async () => {
	try {
		// Simple query to verify DB connection
		await prisma.$queryRaw`SELECT 1`;

		return json({
			status: 'READY',
			database: 'CONNECTED',
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Readiness check failed:', error);
		return json(
			{
				status: 'NOT_READY',
				database: 'DISCONNECTED',
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 503 }
		);
	}
};
