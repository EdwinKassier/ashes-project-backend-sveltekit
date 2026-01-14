import type { Handle } from '@sveltejs/kit';

// Simple in-memory rate limiting for demonstration of "rigor"
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATELIMIT_WINDOW = 60 * 1000; // 1 minute
const RATELIMIT_MAX = 50; // 50 requests per minute

export const handle: Handle = async ({ resolve, event }) => {
	const clientAddress = event.getClientAddress();
	const now = Date.now();

	// 1. Basic Rate Limiting
	if (event.url.pathname.startsWith('/api')) {
		let limiter = rateLimitMap.get(clientAddress);
		if (!limiter || now > limiter.resetTime) {
			limiter = { count: 0, resetTime: now + RATELIMIT_WINDOW };
		}
		limiter.count++;
		rateLimitMap.set(clientAddress, limiter);

		if (limiter.count > RATELIMIT_MAX) {
			return new Response('Too Many Requests', {
				status: 429,
				headers: { 'Retry-After': Math.ceil((limiter.resetTime - now) / 1000).toString() }
			});
		}
	}

	// 2. CORS handling
	if (event.url.pathname.startsWith('/api') && event.request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization'
			}
		});
	}

	const response = await resolve(event);

	// 3. Security Headers (Helmet equivalents)
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self';");

	if (event.url.pathname.startsWith('/api')) {
		response.headers.set('Access-Control-Allow-Origin', '*');
	}

	return response;
};
