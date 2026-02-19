import {
	existsSync,
	mkdirSync,
	readFileSync,
	type Stats,
	writeFileSync,
} from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import type { RequestListener } from 'node:http';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { eventHandler, H3, type H3Event, HTTPError, readBody } from 'h3';
import { toNodeHandler } from 'h3/node';
import { listen } from 'listhen';
import { lookup } from 'mime-types';

const DEFAULT_PORT = 4567;

// ─── Workspace Persistence ──────────────────────────

const WORKSPACE_DIR = resolve(homedir(), '.abyss');
const WORKSPACE_FILE = resolve(WORKSPACE_DIR, 'workspace.json');

function ensureWorkspaceDir(): void {
	if (!existsSync(WORKSPACE_DIR)) {
		mkdirSync(WORKSPACE_DIR, { recursive: true });
	}
}

function readWorkspace(): unknown {
	ensureWorkspaceDir();
	if (!existsSync(WORKSPACE_FILE)) {
		return null;
	}
	try {
		const content = readFileSync(WORKSPACE_FILE, 'utf-8');
		return JSON.parse(content);
	} catch {
		return null;
	}
}

function writeWorkspace(data: unknown): void {
	ensureWorkspaceDir();
	writeFileSync(WORKSPACE_FILE, JSON.stringify(data, null, 2));
}

// ─── Server ─────────────────────────────────────────

export async function startServer(
	port = DEFAULT_PORT,
): Promise<{ url: string; stop: () => void }> {
	const devPath = resolve(import.meta.dirname || __dirname, '../../gui/dist');
	const prodPath = resolve(import.meta.dirname || __dirname, '../client');

	const webDistPath = existsSync(resolve(prodPath, 'index.html'))
		? prodPath
		: devPath;

	const app = new H3();

	// CORS Preflight
	app.use(
		eventHandler((event) => {
			if (event.req.method === 'OPTIONS') {
				event.res.headers.set('Access-Control-Allow-Origin', '*');
				event.res.headers.set(
					'Access-Control-Allow-Methods',
					'GET, POST, PUT, OPTIONS',
				);
				event.res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
				return null;
			}
		}),
	);

	// ─── API Routes ─────────────────────────

	// Proxy endpoint
	app.use(
		'/api/proxy',
		eventHandler(async (event) => {
			// Set CORS headers for the response
			event.res.headers.set('Access-Control-Allow-Origin', '*');

			if (event.req.method === 'POST') {
				return handleProxy(event);
			}
		}),
	);

	// Workspace state — read/write
	app.use(
		'/api/workspace',
		eventHandler(async (event) => {
			event.res.headers.set('Access-Control-Allow-Origin', '*');

			if (event.req.method === 'GET') {
				const data = readWorkspace();
				return data ?? {};
			}

			if (event.req.method === 'PUT') {
				try {
					const body = await readBody(event);
					writeWorkspace(body);
					return { ok: true };
				} catch (err) {
					const message =
						err instanceof Error ? err.message : 'Failed to save workspace';
					throw new HTTPError({
						statusCode: 400,
						message,
					});
				}
			}
		}),
	);

	// ─── Static Files ───────────────────────

	app.use(
		eventHandler(async (event) => {
			// Skip if already handled (API routes)
			if (event.path.startsWith('/api/')) return;

			const filePath = event.path === '/' ? '/index.html' : event.path;
			let fullPath = resolve(webDistPath, `.${filePath}`);

			// Prevent directory traversal
			if (!fullPath.startsWith(webDistPath)) {
				throw new HTTPError({ statusCode: 403, message: 'Forbidden' });
			}

			let stats: Stats;
			try {
				stats = await stat(fullPath);
			} catch {
				// If file doesn't exist, fall back to SPA index.html
				fullPath = resolve(webDistPath, 'index.html');
				try {
					stats = await stat(fullPath);
				} catch {
					throw new HTTPError({ statusCode: 404, message: 'Not Found' });
				}
			}

			if (stats.isDirectory()) {
				throw new HTTPError({ statusCode: 403, message: 'Forbidden' });
			}

			const mimeType = lookup(fullPath) || 'application/octet-stream';
			event.res.headers.set('Content-Type', mimeType);

			const fileStream = await readFile(fullPath); // Simple read for now
			return fileStream;
		}),
	);

	const listener = await listen(toNodeHandler(app) as RequestListener, {
		port,
		hostname: '127.0.0.1',
		showURL: false,
	});

	return {
		url: listener.url,
		stop: () => listener.close(),
	};
}

interface ProxyRequestBody {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
}

interface ProxyResponse {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
	latencyMs: number;
	size: number;
	error?: string;
}

async function handleProxy(event: H3Event): Promise<ProxyResponse> {
	try {
		const payload = (await readBody(event)) as ProxyRequestBody;

		if (!payload.url) {
			throw new HTTPError({
				statusCode: 400,
				message: 'Missing required field: url',
			});
		}

		// Validate URL format and protocol
		let parsedUrl: URL;
		try {
			parsedUrl = new URL(payload.url);
		} catch {
			return {
				status: 0,
				statusText: 'Invalid URL',
				headers: {},
				body: '',
				latencyMs: 0,
				size: 0,
				error: `Invalid URL: ${payload.url}`,
			};
		}

		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			return {
				status: 0,
				statusText: 'Invalid Protocol',
				headers: {},
				body: '',
				latencyMs: 0,
				size: 0,
				error: `Only HTTP and HTTPS are supported, got: ${parsedUrl.protocol}`,
			};
		}

		const startTime = performance.now();

		const fetchInit: RequestInit = {
			method: payload.method || 'GET',
			headers: payload.headers || {},
		};

		// Only attach body for methods that support it
		const methodsWithBody = ['POST', 'PUT', 'PATCH'];
		if (payload.body && methodsWithBody.includes(fetchInit.method as string)) {
			fetchInit.body = payload.body;
		}

		const proxyResponse = await fetch(payload.url, fetchInit);

		const endTime = performance.now();
		const latencyMs = Math.round(endTime - startTime);

		const responseBody = await proxyResponse.text();
		const responseHeaders: Record<string, string> = {};
		proxyResponse.headers.forEach((value, key) => {
			responseHeaders[key] = value;
		});

		return {
			status: proxyResponse.status,
			statusText: proxyResponse.statusText,
			headers: responseHeaders,
			body: responseBody,
			latencyMs,
			size: new TextEncoder().encode(responseBody).length,
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown proxy error';
		return {
			status: 0,
			statusText: 'Network Error',
			headers: {},
			body: '',
			latencyMs: 0,
			size: 0,
			error: message,
		};
	}
}
