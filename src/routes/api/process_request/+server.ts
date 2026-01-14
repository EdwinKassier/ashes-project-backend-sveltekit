import { json, type RequestHandler } from '@sveltejs/kit';
import { CryptoRequestSchema } from '$lib/server/domain/schemas/crypto.schema';
import { CryptoAnalysisService } from '$lib/server/application/services/crypto-analysis.service';
import { GraphService } from '$lib/server/application/services/graph.service';
import { DomainError, ResourceNotFoundError } from '$lib/server/domain/errors/domain.error';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const params = {
			symbol: url.searchParams.get('symbol') ?? '',
			investment: url.searchParams.get('investment')
		};

		// Validation
		const validation = CryptoRequestSchema.safeParse(params);

		if (!validation.success) {
			return json({
				result: validation.error.issues[0].message,
				graph_data: validation.error.issues[0].message
			});
		}

		const { symbol, investment } = validation.data;

		const cryptoService = new CryptoAnalysisService();
		const graphService = new GraphService();

		const [analysisResult, graphData] = await Promise.all([
			cryptoService.analyze(symbol, investment),
			graphService.getGraphData(symbol)
		]);

		return json({
			result: analysisResult,
			graph_data: graphData
		});
	} catch (err: any) {
		console.error('API Error:', err);

		// Handle Domain Errors
		if (err instanceof ResourceNotFoundError) {
			return json({
				result: "Symbol doesn't exist",
				graph_data: "Symbol doesn't exist"
			});
		}

		if (err instanceof DomainError) {
			return json({
				result: err.message,
				graph_data: err.message
			});
		}

		// Fallback for unexpected errors
		return json({
			error: 'Internal server error',
			message: process.env.NODE_ENV === 'development' ? err.message : undefined
		}, { status: 500 });
	}
};
