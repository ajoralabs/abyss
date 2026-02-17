import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const DEFAULT_PORT = 4567;

// ─── Workspace Persistence ──────────────────────────

const WORKSPACE_DIR = resolve(homedir(), '.voidflux');
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

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export async function startServer(
	port = DEFAULT_PORT,
): Promise<{ url: string; stop: () => void }> {
	const webDistPath = resolve(import.meta.dir, '../../gui/dist');

	const server = Bun.serve({
		port,
		hostname: '127.0.0.1', // Security: Bind to localhost only to prevent external network access
		async fetch(request) {
			const url = new URL(request.url);

			// CORS preflight
			if (request.method === 'OPTIONS') {
				return new Response(null, { status: 204, headers: CORS_HEADERS });
			}

			// ─── API Routes ─────────────────────────

			// Proxy endpoint — forwards requests to avoid CORS
			if (url.pathname === '/api/proxy' && request.method === 'POST') {
				return handleProxy(request);
			}

			// Workspace state — read
			if (url.pathname === '/api/workspace' && request.method === 'GET') {
				const data = readWorkspace();
				return Response.json(data ?? {}, { headers: CORS_HEADERS });
			}

			// Workspace state — write
			if (url.pathname === '/api/workspace' && request.method === 'PUT') {
				try {
					const body = await request.json();
					writeWorkspace(body);
					return Response.json({ ok: true }, { headers: CORS_HEADERS });
				} catch (err) {
					const message =
						err instanceof Error ? err.message : 'Failed to save workspace';
					return Response.json(
						{ error: message },
						{ status: 400, headers: CORS_HEADERS },
					);
				}
			}

			// ─── Static Files ───────────────────────

			const filePath = url.pathname === '/' ? '/index.html' : url.pathname;

			const file = Bun.file(resolve(webDistPath, `.${filePath}`));
			if (await file.exists()) {
				return new Response(file);
			}

			// SPA fallback
			const indexFile = Bun.file(resolve(webDistPath, 'index.html'));
			if (await indexFile.exists()) {
				return new Response(indexFile);
			}

			return new Response('Not Found', { status: 404 });
		},
	});

	const serverUrl = `http://localhost:${server.port}`;

	return {
		url: serverUrl,
		stop: () => server.stop(),
	};
}

interface ProxyRequestBody {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
}

async function handleProxy(request: Request): Promise<Response> {
	try {
		const payload = (await request.json()) as ProxyRequestBody;

		if (!payload.url) {
			return Response.json(
				{ error: 'Missing required field: url' },
				{ status: 400 },
			);
		}

		// Validate URL format and protocol
		let parsedUrl: URL;
		try {
			parsedUrl = new URL(payload.url);
		} catch {
			return Response.json(
				{
					status: 0,
					statusText: 'Invalid URL',
					headers: {},
					body: '',
					latencyMs: 0,
					size: 0,
					error: `Invalid URL: ${payload.url}`,
				},
				{ status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
			);
		}

		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			return Response.json(
				{
					status: 0,
					statusText: 'Invalid Protocol',
					headers: {},
					body: '',
					latencyMs: 0,
					size: 0,
					error: `Only HTTP and HTTPS are supported, got: ${parsedUrl.protocol}`,
				},
				{ status: 200, headers: { 'Access-Control-Allow-Origin': '*' } },
			);
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

		const result = {
			status: proxyResponse.status,
			statusText: proxyResponse.statusText,
			headers: responseHeaders,
			body: responseBody,
			latencyMs,
			size: new TextEncoder().encode(responseBody).length,
		};

		return Response.json(result, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown proxy error';
		return Response.json(
			{
				status: 0,
				statusText: 'Network Error',
				headers: {},
				body: '',
				latencyMs: 0,
				size: 0,
				error: message,
			},
			{
				status: 200,
				headers: { 'Access-Control-Allow-Origin': '*' },
			},
		);
	}
}
