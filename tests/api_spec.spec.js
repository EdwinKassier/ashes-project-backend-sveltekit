import { test, expect } from '@playwright/test';

test('UI render test', async ({ page }) => {
	await page.goto('/');
	const h1Text = await page.textContent('h1');
	expect(h1Text).toContain("Welcome to Edwin's SvelteKit API");
});

test('Test api - all valid', async ({ request }) => {
	const response = await request.get(`api/process_request`, {
		params: {
			symbol: 'ETH',
			investment: 123
		}
	});
	expect(response.ok()).toBeTruthy();

	const body = await response.json();

	expect(body.result.SYMBOL).toBe('ETH');
	expect(body.result.NUMBERCOINS).toBeGreaterThan(0);
    // New implementation returns array directly
	expect(Array.isArray(body.graph_data)).toBeTruthy();
	expect(body.graph_data.length).toBeGreaterThanOrEqual(1);
    expect(body.graph_data[0]).toHaveProperty('x');
    expect(body.graph_data[0]).toHaveProperty('y');
});

test('Test api - invalid symbol', async ({ request }) => {
	const response = await request.get(`api/process_request`, {
		params: {
			symbol: 'INVALID_COIN_123',
			investment: 123
		}
	});
	expect(response.ok()).toBeTruthy();

	const body = await response.json();
	expect(body.result).toBe("Symbol doesn't exist");
});

test('Test api - empty symbol', async ({ request }) => {
	const response = await request.get(`api/process_request`, {
		params: {
            symbol: '',
			investment: 123
		}
	});
	expect(response.ok()).toBeTruthy();

	const body = await response.json();
	// Zod message from schema: "Symbol is required"
	expect(body.result).toBe("Symbol is required");
});

test('Test api - invalid investment', async ({ request }) => {
	const response = await request.get(`api/process_request`, {
		params: {
			symbol: 'ETH',
			investment: 'not-a-number'
		}
	});
	expect(response.ok()).toBeTruthy();

	const body = await response.json();
    // Zod message for coerce.number fail is usually "Expected number, received NaN" 
    // but our schema has .positive("Investment must be a positive number")
	expect(body.result).toContain("Investment must be a positive number");
});

test('Test api - monitoring endpoints', async ({ request }) => {
    const health = await request.get('health');
    expect(health.ok()).toBeTruthy();
    const healthBody = await health.json();
    expect(healthBody.status).toBe('UP');

    const ready = await request.get('ready');
    expect(ready.ok()).toBeTruthy();
    const readyBody = await ready.json();
    expect(readyBody.status).toBe('READY');
});
