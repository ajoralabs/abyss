import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const METHOD_COLORS: Record<string, string> = {
	GET: 'text-blue-400 bg-blue-400/10',
	POST: 'text-green-400 bg-green-400/10',
	PUT: 'text-amber-400 bg-amber-400/10',
	PATCH: 'text-orange-400 bg-orange-400/10',
	DELETE: 'text-red-400 bg-red-400/10',
};

// Simplified variant for select inputs where we only want text color
export const METHOD_TEXT_COLORS: Record<string, string> = {
	GET: 'text-blue-400',
	POST: 'text-green-400',
	PUT: 'text-amber-400',
	PATCH: 'text-orange-400',
	DELETE: 'text-red-400',
};

export const METHOD_BG_COLORS: Record<string, string> = {
	GET: 'bg-blue-400/10',
	POST: 'bg-green-400/10',
	PUT: 'bg-amber-400/10',
	PATCH: 'bg-orange-400/10',
	DELETE: 'bg-red-400/10',
};

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTime(timestamp: number): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);

	if (diffMin < 1) return 'just now';
	if (diffMin < 60) return `${diffMin}m ago`;

	const diffHours = Math.floor(diffMin / 60);
	if (diffHours < 24) return `${diffHours}h ago`;

	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function getStatusColor(status: number): string {
	if (status >= 200 && status < 300) return 'text-green-400';
	if (status >= 300 && status < 400) return 'text-blue-400';
	if (status >= 400 && status < 500) return 'text-amber-400';
	if (status >= 500) return 'text-red-400';
	return 'text-gray-400';
}

export function getStatusBgColor(status: number): string {
	if (status >= 200 && status < 300)
		return 'bg-green-400/10 border-green-400/20';
	if (status >= 300 && status < 400) return 'bg-blue-400/10 border-blue-400/20';
	if (status >= 400 && status < 500)
		return 'bg-amber-400/10 border-amber-400/20';
	if (status >= 500) return 'bg-red-400/10 border-red-400/20';
	return 'bg-gray-400/10 border-gray-400/20';
}

export function normalizeUrl(raw: string): string {
	const trimmed = raw.trim();
	if (!trimmed) return '';
	if (!/^https?:\/\//i.test(trimmed)) {
		// Default to http for localhost/127.0.0.1 for convenience
		if (
			trimmed.startsWith('localhost') ||
			trimmed.startsWith('127.0.0.1') ||
			trimmed.includes('.local')
		) {
			return `http://${trimmed}`;
		}
		return `https://${trimmed}`;
	}
	return trimmed;
}

export function validateUrl(raw: string): string | null {
	if (!raw.trim()) return 'URL is required';
	const normalized = normalizeUrl(raw);
	try {
		const parsed = new URL(normalized);
		if (!['http:', 'https:'].includes(parsed.protocol)) {
			return 'Only HTTP and HTTPS protocols are supported';
		}
		if (!parsed.hostname) {
			return 'Enter a valid domain';
		}
		return null;
	} catch {
		return 'Invalid URL format';
	}
}

export function tryFormatJson(text: string): string {
	try {
		return JSON.stringify(JSON.parse(text), null, 2);
	} catch {
		return text;
	}
}
