import { useState, useCallback, useEffect, useRef } from 'react';
import {
	Send,
	ChevronDown,
	Plus,
	Trash2,
	Activity,
	Globe,
	ShieldCheck,
	Zap,
	Copy,
	Check,
	FileText,
	AlertTriangle,
	X,
} from 'lucide-react';
import {
	cn,
	formatBytes,
	getStatusColor,
	getStatusBgColor,
	tryFormatJson,
	normalizeUrl,
	validateUrl,
	METHOD_TEXT_COLORS as METHOD_COLORS,
	METHOD_BG_COLORS as METHOD_BG,
} from '../../lib/utils';
import {
	useRequestStore,
	generateId,
	type HttpMethod,
	type HeaderEntry,
	type HistoryEntry,
} from '../store/request-store';

interface ProxyResponse {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
	latencyMs: number;
	size: number;
	error?: string;
}

type ResponseTab = 'body' | 'headers';

// ─── Tab Bar ────────────────────────────────────────

function TabBar() {
	const { state, dispatch } = useRequestStore();

	return (
		<div className="flex items-center border-b border-white/5 bg-white/2 shrink-0 overflow-x-auto">
			{state.tabs.map((tab) => {
				const isActive = tab.id === state.activeTabId;
				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tabId: tab.id })}
						className={cn(
							'flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-r border-white/5 transition-all group shrink-0 max-w-[200px]',
							isActive
								? 'bg-white/5 text-white'
								: 'text-gray-500 hover:text-gray-300 hover:bg-white/3',
						)}
					>
						<span
							className={cn(
								'w-1.5 h-1.5 rounded-full shrink-0',
								isActive
									? METHOD_BG[tab.method].replace('/10', '')
									: 'bg-gray-600',
							)}
						/>
						<span className="truncate">
							{tab.url
								? `${tab.method} ${tab.url.replace(/^https?:\/\//, '').slice(0, 30)}`
								: tab.name}
						</span>
						{state.tabs.length > 1 && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									dispatch({ type: 'CLOSE_TAB', tabId: tab.id });
								}}
								className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-all shrink-0"
							>
								<X size={10} />
							</button>
						)}
					</button>
				);
			})}
			<button
				type="button"
				onClick={() => dispatch({ type: 'ADD_TAB' })}
				className="px-3 py-2.5 text-gray-600 hover:text-neon-cyan hover:bg-white/3 transition-all shrink-0"
			>
				<Plus size={14} />
			</button>
		</div>
	);
}

// ─── Main Requester ─────────────────────────────────

export function ApiRequester() {
	const { activeTab, dispatch, addHistory } = useRequestStore();

	const [isSending, setIsSending] = useState(false);
	const [response, setResponse] = useState<ProxyResponse | null>(null);
	const [responseTab, setResponseTab] = useState<ResponseTab>('body');
	const [copied, setCopied] = useState(false);
	const [urlError, setUrlError] = useState('');
	const urlInputRef = useRef<HTMLInputElement>(null);

	// Track which tab's response we're showing
	const [responseForTabId, setResponseForTabId] = useState<string | null>(null);

	// Clear response when switching tabs
	useEffect(() => {
		if (responseForTabId && responseForTabId !== activeTab.id) {
			setResponse(null);
			setResponseForTabId(null);
		}
	}, [activeTab.id, responseForTabId]);

	const updateTab = useCallback(
		(updates: Record<string, unknown>) => {
			dispatch({ type: 'UPDATE_TAB', tabId: activeTab.id, updates });
		},
		[dispatch, activeTab.id],
	);

	const handleSend = useCallback(async () => {
		if (isSending) return;

		const error = validateUrl(activeTab.url);
		if (error) {
			setUrlError(error);
			return;
		}
		setUrlError('');

		const resolvedUrl = normalizeUrl(activeTab.url);
		setIsSending(true);
		setResponse(null);

		const activeHeaders: Record<string, string> = {};
		for (const h of activeTab.headers) {
			if (h.active && h.key.trim()) {
				activeHeaders[h.key] = h.value;
			}
		}

		try {
			const proxyPayload = {
				url: resolvedUrl,
				method: activeTab.method,
				headers: activeHeaders,
				body: ['POST', 'PUT', 'PATCH'].includes(activeTab.method)
					? activeTab.body
					: undefined,
			};

			const res = await fetch('/api/proxy', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(proxyPayload),
			});

			const data = (await res.json()) as ProxyResponse;
			setResponse(data);
			setResponseForTabId(activeTab.id);
			setResponseTab('body');

			// Update tab name from URL
			updateTab({ name: `${activeTab.method} ${resolvedUrl}` });

			// Record to history
			const historyEntry: HistoryEntry = {
				id: generateId(),
				timestamp: Date.now(),
				method: activeTab.method,
				url: resolvedUrl,
				headers: activeTab.headers,
				body: activeTab.body,
				response: {
					status: data.status,
					statusText: data.statusText,
					latencyMs: data.latencyMs,
					size: data.size,
					body: data.body,
					headers: data.headers,
					error: data.error,
				},
			};
			addHistory(historyEntry);
		} catch (err) {
			const errorResponse: ProxyResponse = {
				status: 0,
				statusText: 'Network Error',
				headers: {},
				body:
					err instanceof Error
						? err.message
						: 'Failed to reach the proxy server',
				latencyMs: 0,
				size: 0,
				error: 'Connection failed',
			};
			setResponse(errorResponse);
			setResponseForTabId(activeTab.id);
		} finally {
			setIsSending(false);
		}
	}, [activeTab, isSending, updateTab, addHistory]);

	// Ctrl+Enter / Cmd+Enter to send
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
				e.preventDefault();
				handleSend();
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [handleSend]);

	// Focus URL input on mount
	useEffect(() => {
		urlInputRef.current?.focus();
	}, []);

	const updateHeader = (
		id: string,
		field: keyof HeaderEntry,
		value: string | boolean,
	) => {
		const updated = activeTab.headers.map((h) =>
			h.id === id ? { ...h, [field]: value } : h,
		);
		updateTab({ headers: updated });
	};

	const removeHeader = (id: string) => {
		updateTab({ headers: activeTab.headers.filter((h) => h.id !== id) });
	};

	const addHeader = () => {
		updateTab({
			headers: [
				...activeTab.headers,
				{ id: generateId(), key: '', value: '', active: true },
			],
		});
	};

	const copyResponse = async () => {
		if (!response?.body) return;
		await navigator.clipboard.writeText(response.body);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const hasBody = ['POST', 'PUT', 'PATCH'].includes(activeTab.method);
	const responseHeaderEntries = response
		? Object.entries(response.headers)
		: [];

	return (
		<div className="flex-1 flex flex-col h-full bg-abyss-950/50 relative overflow-hidden font-body">
			{/* Ambient Background */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-electric-violet/5 rounded-full blur-[120px] pointer-events-none" />

			{/* Tab Bar */}
			<TabBar />

			{/* URL Bar */}
			<div className="px-6 py-4 border-b border-white/5 bg-white/2 backdrop-blur-md relative z-10">
				<div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
					{/* Method Selector */}
					<div className="relative group">
						<select
							value={activeTab.method}
							onChange={(e) =>
								updateTab({ method: e.target.value as HttpMethod })
							}
							className={cn(
								'w-full lg:w-auto appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 font-mono font-bold text-sm focus:border-neon-cyan/50 transition-all cursor-pointer',
								METHOD_COLORS[activeTab.method],
							)}
						>
							<option value="GET">GET</option>
							<option value="POST">POST</option>
							<option value="PUT">PUT</option>
							<option value="PATCH">PATCH</option>
							<option value="DELETE">DELETE</option>
						</select>
						<ChevronDown
							size={14}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
						/>
					</div>

					{/* URL Input */}
					<div className="flex-1 relative">
						<input
							ref={urlInputRef}
							type="text"
							value={activeTab.url}
							onChange={(e) => {
								updateTab({ url: e.target.value });
								if (urlError) setUrlError('');
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleSend();
							}}
							className={cn(
								'w-full bg-white/5 border rounded-xl px-4 py-3 font-mono text-sm text-gray-200 focus:bg-white/7 transition-all placeholder:text-gray-600',
								urlError
									? 'border-red-400/60 focus:border-red-400'
									: 'border-white/10 focus:border-neon-cyan/50',
							)}
							placeholder="https://api.example.com/v1/users"
						/>
						{urlError && (
							<div className="absolute -bottom-5 left-0 flex items-center gap-1 text-[10px] text-red-400 font-mono">
								<AlertTriangle size={10} />
								{urlError}
							</div>
						)}
					</div>

					{/* Send Button */}
					<button
						type="button"
						onClick={handleSend}
						disabled={isSending || !activeTab.url.trim()}
						className={cn(
							'flex items-center justify-center gap-2 px-7 py-3 bg-neon-cyan text-abyss-950 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(0,240,255,0.2)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed uppercase tracking-wider',
							isSending && 'animate-pulse',
						)}
					>
						{isSending ? (
							<Zap size={16} className="animate-spin" />
						) : (
							<Send size={16} />
						)}
						<span className="text-sm">SEND</span>
					</button>
				</div>

				{/* Status Bar */}
				<div className="mt-2 flex items-center gap-4">
					<span className="text-[10px] text-gray-600 font-mono">
						⌘ Enter to send
					</span>
					{response && !response.error && (
						<div className="flex items-center gap-3 text-[10px] font-mono">
							<span
								className={cn(
									'px-1.5 py-0.5 rounded border font-bold',
									getStatusBgColor(response.status),
									getStatusColor(response.status),
								)}
							>
								{response.status} {response.statusText}
							</span>
							<span className="text-gray-500">{response.latencyMs}ms</span>
							<span className="text-gray-500">
								{formatBytes(response.size)}
							</span>
						</div>
					)}
					{response?.error && (
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-red-400">
							<AlertTriangle size={10} />
							{response.error}
						</div>
					)}
				</div>
			</div>

			{/* Work Area — Split View */}
			<div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
				{/* Left: Request Config */}
				<div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden h-1/2 lg:h-auto">
					{/* Headers */}
					<div className="border-b border-white/5 flex flex-col max-h-[280px]">
						<div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-white/2 shrink-0">
							<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
								<ShieldCheck size={12} className="text-neon-cyan" />
								Headers
								<span className="text-gray-600 font-normal">
									({activeTab.headers.filter((h) => h.active).length} active)
								</span>
							</span>
							<button
								type="button"
								onClick={addHeader}
								className="p-1 hover:bg-white/5 rounded-lg text-gray-500 hover:text-neon-cyan transition-all"
							>
								<Plus size={14} />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto p-3 space-y-1.5">
							{activeTab.headers.map((h) => (
								<div key={h.id} className="flex gap-1.5 items-center group">
									<input
										type="checkbox"
										checked={h.active}
										onChange={(e) =>
											updateHeader(h.id, 'active', e.target.checked)
										}
										className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-neon-cyan focus:ring-neon-cyan/20 shrink-0 cursor-pointer"
									/>
									<input
										className={cn(
											'flex-1 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:border-neon-cyan/30 transition-all',
											h.active ? 'text-gray-300' : 'text-gray-600',
										)}
										placeholder="Key"
										value={h.key}
										onChange={(e) => updateHeader(h.id, 'key', e.target.value)}
									/>
									<input
										className={cn(
											'flex-1 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:border-neon-cyan/30 transition-all',
											h.active ? 'text-gray-300' : 'text-gray-600',
										)}
										placeholder="Value"
										value={h.value}
										onChange={(e) =>
											updateHeader(h.id, 'value', e.target.value)
										}
									/>
									<button
										type="button"
										onClick={() => removeHeader(h.id)}
										className="p-1 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all shrink-0"
									>
										<Trash2 size={12} />
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Body */}
					<div className="flex-1 flex flex-col overflow-hidden">
						<div className="px-4 py-2 border-b border-white/5 bg-white/2 shrink-0">
							<span
								className={cn(
									'text-[10px] font-bold uppercase tracking-widest',
									hasBody ? 'text-gray-400' : 'text-gray-600',
								)}
							>
								Request Body
								{!hasBody && (
									<span className="ml-2 text-gray-600 font-normal normal-case tracking-normal">
										— not available for {activeTab.method}
									</span>
								)}
							</span>
						</div>
						<div className="flex-1 relative overflow-hidden">
							{hasBody ? (
								<textarea
									value={activeTab.body}
									onChange={(e) => updateTab({ body: e.target.value })}
									spellCheck={false}
									className="w-full h-full bg-transparent p-4 pl-14 font-mono text-sm text-gray-300 resize-none outline-none transition-colors leading-relaxed"
									placeholder={'{\n  "key": "value"\n}'}
								/>
							) : (
								<div className="h-full flex items-center justify-center text-gray-600 text-sm">
									<p className="text-center font-mono text-xs opacity-40">
										Select POST, PUT, or PATCH
										<br />
										to add a request body
									</p>
								</div>
							)}
							{hasBody && (
								<div className="absolute top-0 left-0 w-10 h-full bg-white/2 border-r border-white/5 flex flex-col items-center pt-4 text-[10px] font-mono text-gray-700 select-none pointer-events-none">
									{activeTab.body.split('\n').map((_, i) => (
										<div
											key={`ln-${i + 1}`}
											className="leading-relaxed h-[22px] flex items-center"
										>
											{i + 1}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right: Response */}
				<div className="h-1/2 lg:h-auto lg:w-[45%] lg:min-w-[360px] flex flex-col overflow-hidden bg-black/20">
					{/* Response Metrics Bar */}
					{response && !response.error && (
						<div className="px-4 py-3 border-b border-white/5 bg-white/2 flex items-center gap-4 shrink-0 overflow-x-auto">
							<div className="flex items-center gap-2">
								<Activity size={14} className="text-neon-cyan" />
								<span className="text-xs font-mono font-bold text-white">
									{response.latencyMs}ms
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Globe size={14} className="text-electric-violet" />
								<span
									className={cn(
										'text-xs font-mono font-bold',
										getStatusColor(response.status),
									)}
								>
									{response.status}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<FileText size={14} className="text-gray-500" />
								<span className="text-xs font-mono text-gray-400">
									{formatBytes(response.size)}
								</span>
							</div>
						</div>
					)}

					{/* Response Tabs */}
					<div className="px-4 py-2 border-b border-white/5 bg-white/2 flex items-center justify-between shrink-0">
						<div className="flex gap-4">
							<button
								type="button"
								onClick={() => setResponseTab('body')}
								className={cn(
									'text-[10px] font-bold uppercase tracking-widest pb-0.5 transition-colors',
									responseTab === 'body'
										? 'text-neon-cyan border-b border-neon-cyan'
										: 'text-gray-500 hover:text-gray-300',
								)}
							>
								Body
							</button>
							<button
								type="button"
								onClick={() => setResponseTab('headers')}
								className={cn(
									'text-[10px] font-bold uppercase tracking-widest pb-0.5 transition-colors',
									responseTab === 'headers'
										? 'text-neon-cyan border-b border-neon-cyan'
										: 'text-gray-500 hover:text-gray-300',
								)}
							>
								Headers
								{responseHeaderEntries.length > 0 && (
									<span className="ml-1 text-gray-600">
										({responseHeaderEntries.length})
									</span>
								)}
							</button>
						</div>
						{response?.body && (
							<button
								type="button"
								onClick={copyResponse}
								className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-neon-cyan transition-colors"
							>
								{copied ? (
									<Check size={10} className="text-green-400" />
								) : (
									<Copy size={10} />
								)}
								{copied ? 'Copied' : 'Copy'}
							</button>
						)}
					</div>

					{/* Response Content */}
					<div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
						{isSending && (
							<div className="h-full flex flex-col items-center justify-center gap-3">
								<div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
								<p className="text-gray-500 text-[10px] uppercase tracking-widest">
									Sending request...
								</p>
							</div>
						)}

						{!isSending && !response && (
							<div className="h-full flex flex-col items-center justify-center gap-3 opacity-20">
								<div className="w-12 h-12 rounded-full border border-dashed border-gray-500 flex items-center justify-center">
									<Send size={18} className="text-gray-500" />
								</div>
								<p className="text-center text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
									Enter a URL and hit Send
									<br />
									to see the response
								</p>
							</div>
						)}

						{!isSending && response && responseTab === 'body' && (
							<pre className="text-gray-300 leading-relaxed whitespace-pre-wrap break-all">
								{tryFormatJson(response.body) || (
									<span className="text-gray-600 italic">
										Empty response body
									</span>
								)}
							</pre>
						)}

						{!isSending && response && responseTab === 'headers' && (
							<div className="space-y-1">
								{responseHeaderEntries.length === 0 ? (
									<p className="text-gray-600 italic">No response headers</p>
								) : (
									responseHeaderEntries.map(([key, value]) => (
										<div
											key={key}
											className="flex gap-2 py-1 border-b border-white/3"
										>
											<span className="text-neon-cyan/70 shrink-0 min-w-[140px]">
												{key}
											</span>
											<span className="text-gray-400 break-all">{value}</span>
										</div>
									))
								)}
							</div>
						)}
					</div>

					{/* Connection Status */}
					<div className="px-4 py-2.5 border-t border-white/5 bg-white/2 flex items-center justify-between shrink-0">
						<div className="flex items-center gap-2">
							<ShieldCheck size={14} className="text-green-400/50" />
							<span className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
								Local Proxy Active
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
							<span className="text-[9px] font-bold text-gray-500">
								CONNECTED
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
