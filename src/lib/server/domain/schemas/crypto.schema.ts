import { z } from 'zod';

export const CryptoRequestSchema = z.object({
	symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
	investment: z.coerce
		.number({ invalid_type_error: 'Investment must be a positive number' })
		.positive('Investment must be a positive number')
});

export type CryptoRequest = z.infer<typeof CryptoRequestSchema>;
