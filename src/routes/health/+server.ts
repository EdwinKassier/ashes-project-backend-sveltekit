import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json({
		status: 'UP',
		uptime: process.uptime(),
		version: '0.0.1', // Should ideally come from package.json
		timestamp: new Date().toISOString()
	});
};
