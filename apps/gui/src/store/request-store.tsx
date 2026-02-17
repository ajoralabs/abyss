import {
	createContext,
	useContext,
	useReducer,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
	useRef,
} from 'react';

// ─── Types ──────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HeaderEntry {
	id: string;
	key: string;
	value: string;
	active: boolean;
}

export interface RequestTab {
	id: string;
	name: string;
	method: HttpMethod;
	url: string;
	headers: HeaderEntry[];
	body: string;
}

export interface SavedRequest {
	id: string;
	name: string;
	method: HttpMethod;
	url: string;
	headers: HeaderEntry[];
	body: string;
	createdAt: number;
}

export interface CollectionFolder {
	id: string;
	name: string;
	requests: SavedRequest[];
	expanded: boolean;
}

export interface Collection {
	id: string;
	name: string;
	description: string;
	folders: CollectionFolder[];
	requests: SavedRequest[];
	createdAt: number;
	updatedAt: number;
}

export interface EnvVariable {
	id: string;
	key: string;
	value: string;
	secret: boolean;
	active: boolean;
}

export interface Environment {
	id: string;
	name: string;
	variables: EnvVariable[];
	createdAt: number;
}

export interface HistoryEntry {
	id: string;
	timestamp: number;
	method: HttpMethod;
	url: string;
	headers: HeaderEntry[];
	body: string;
	response: {
		status: number;
		statusText: string;
		latencyMs: number;
		size: number;
		body: string;
		headers: Record<string, string>;
		error?: string;
	};
}

export interface AppSettings {
	maxHistoryEntries: number;
}

// ─── State ──────────────────────────────────────────

interface RequestState {
	tabs: RequestTab[];
	activeTabId: string;
	history: HistoryEntry[];
	settings: AppSettings;
	collections: Collection[];
	environments: Environment[];
	activeEnvironmentId: string | null;
}

function generateId(): string {
	return Math.random().toString(36).slice(2, 10);
}

function createDefaultTab(): RequestTab {
	return {
		id: generateId(),
		name: 'New Request',
		method: 'GET',
		url: '',
		headers: [
			{
				id: generateId(),
				key: 'Content-Type',
				value: 'application/json',
				active: true,
			},
		],
		body: '',
	};
}

const defaultTab = createDefaultTab();

const defaultSettings: AppSettings = {
	maxHistoryEntries: 50,
};

function createDefaultState(): RequestState {
	return {
		tabs: [createDefaultTab()],
		activeTabId: defaultTab.id,
		history: [],
		settings: defaultSettings,
		collections: [],
		environments: [],
		activeEnvironmentId: null,
	};
}

function mergeServerState(parsed: Record<string, unknown>): RequestState {
	const base = createDefaultState();
	return {
		tabs:
			Array.isArray(parsed.tabs) && parsed.tabs.length > 0
				? (parsed.tabs as RequestTab[])
				: base.tabs,
		activeTabId: (parsed.activeTabId as string) || base.activeTabId,
		history: Array.isArray(parsed.history)
			? (parsed.history as HistoryEntry[])
			: [],
		settings: {
			...defaultSettings,
			...((parsed.settings as Partial<AppSettings>) || {}),
		},
		collections: Array.isArray(parsed.collections)
			? (parsed.collections as Collection[])
			: [],
		environments: Array.isArray(parsed.environments)
			? (parsed.environments as Environment[])
			: [],
		activeEnvironmentId: (parsed.activeEnvironmentId as string | null) ?? null,
	};
}

// ─── Actions ────────────────────────────────────────

type Action =
	| { type: 'ADD_TAB' }
	| { type: 'CLOSE_TAB'; tabId: string }
	| { type: 'SET_ACTIVE_TAB'; tabId: string }
	| {
			type: 'UPDATE_TAB';
			tabId: string;
			updates: Partial<Omit<RequestTab, 'id'>>;
	  }
	| { type: 'ADD_HISTORY'; entry: HistoryEntry }
	| { type: 'CLEAR_HISTORY' }
	| { type: 'LOAD_FROM_HISTORY'; entry: HistoryEntry }
	| { type: 'UPDATE_SETTINGS'; updates: Partial<AppSettings> }
	| { type: 'CLEAR_DATA' }
	// Collection actions
	| { type: 'CREATE_COLLECTION'; name: string; description?: string }
	| { type: 'DELETE_COLLECTION'; collectionId: string }
	| { type: 'RENAME_COLLECTION'; collectionId: string; name: string }
	| {
			type: 'ADD_REQUEST_TO_COLLECTION';
			collectionId: string;
			folderId?: string;
			request: SavedRequest;
	  }
	| {
			type: 'REMOVE_REQUEST_FROM_COLLECTION';
			collectionId: string;
			folderId?: string;
			requestId: string;
	  }
	| { type: 'CREATE_FOLDER'; collectionId: string; name: string }
	| { type: 'DELETE_FOLDER'; collectionId: string; folderId: string }
	| { type: 'TOGGLE_FOLDER'; collectionId: string; folderId: string }
	| { type: 'LOAD_FROM_COLLECTION'; request: SavedRequest }
	// Environment actions
	| { type: 'CREATE_ENVIRONMENT'; name: string }
	| { type: 'DELETE_ENVIRONMENT'; environmentId: string }
	| { type: 'RENAME_ENVIRONMENT'; environmentId: string; name: string }
	| { type: 'DUPLICATE_ENVIRONMENT'; environmentId: string }
	| { type: 'SET_ACTIVE_ENVIRONMENT'; environmentId: string | null }
	| { type: 'ADD_VARIABLE'; environmentId: string; variable: EnvVariable }
	| { type: 'DELETE_VARIABLE'; environmentId: string; variableId: string }
	| {
			type: 'UPDATE_VARIABLE';
			environmentId: string;
			variableId: string;
			updates: Partial<Omit<EnvVariable, 'id'>>;
	  }
	// Server sync
	| { type: 'HYDRATE_FROM_SERVER'; serverState: RequestState };

// ─── Reducer ────────────────────────────────────────

function requestReducer(state: RequestState, action: Action): RequestState {
	switch (action.type) {
		case 'ADD_TAB': {
			const newTab = createDefaultTab();
			return {
				...state,
				tabs: [...state.tabs, newTab],
				activeTabId: newTab.id,
			};
		}

		case 'CLOSE_TAB': {
			if (state.tabs.length <= 1) return state;
			const filtered = state.tabs.filter((t) => t.id !== action.tabId);
			const newActiveId =
				state.activeTabId === action.tabId
					? filtered[filtered.length - 1].id
					: state.activeTabId;
			return {
				...state,
				tabs: filtered,
				activeTabId: newActiveId,
			};
		}

		case 'SET_ACTIVE_TAB':
			return { ...state, activeTabId: action.tabId };

		case 'UPDATE_TAB':
			return {
				...state,
				tabs: state.tabs.map((t) =>
					t.id === action.tabId ? { ...t, ...action.updates } : t,
				),
			};

		case 'ADD_HISTORY':
			return {
				...state,
				history: [action.entry, ...state.history].slice(
					0,
					state.settings.maxHistoryEntries,
				),
			};

		case 'CLEAR_HISTORY':
			return { ...state, history: [] };

		case 'LOAD_FROM_HISTORY': {
			const entry = action.entry;
			const existingTab = state.tabs.find((t) => t.id === state.activeTabId);
			// If the active tab is empty, load into it
			if (existingTab && !existingTab.url) {
				return {
					...state,
					tabs: state.tabs.map((t) =>
						t.id === state.activeTabId
							? {
									...t,
									method: entry.method,
									url: entry.url,
									headers: entry.headers,
									body: entry.body,
									name: deriveTabName(entry.url, entry.method),
								}
							: t,
					),
				};
			}
			// Otherwise, create a new tab
			const newTab: RequestTab = {
				id: generateId(),
				name: deriveTabName(entry.url, entry.method),
				method: entry.method,
				url: entry.url,
				headers: entry.headers,
				body: entry.body,
			};
			return {
				...state,
				tabs: [...state.tabs, newTab],
				activeTabId: newTab.id,
			};
		}

		case 'UPDATE_SETTINGS':
			return {
				...state,
				settings: { ...state.settings, ...action.updates },
				// If we reduce the history limit, truncate immediately
				history:
					action.updates.maxHistoryEntries &&
					action.updates.maxHistoryEntries < state.history.length
						? state.history.slice(0, action.updates.maxHistoryEntries)
						: state.history,
			};

		case 'CLEAR_DATA':
			return {
				tabs: [createDefaultTab()],
				activeTabId: defaultTab.id,
				history: [],
				settings: defaultSettings,
				collections: [],
				environments: [],
				activeEnvironmentId: null,
			};

		// ─── Collection Cases ────────────────────────────

		case 'CREATE_COLLECTION': {
			const newCollection: Collection = {
				id: generateId(),
				name: action.name,
				description: action.description || '',
				folders: [],
				requests: [],
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};
			return {
				...state,
				collections: [...state.collections, newCollection],
			};
		}

		case 'DELETE_COLLECTION':
			return {
				...state,
				collections: state.collections.filter(
					(c) => c.id !== action.collectionId,
				),
			};

		case 'RENAME_COLLECTION':
			return {
				...state,
				collections: state.collections.map((c) =>
					c.id === action.collectionId
						? { ...c, name: action.name, updatedAt: Date.now() }
						: c,
				),
			};

		case 'ADD_REQUEST_TO_COLLECTION': {
			return {
				...state,
				collections: state.collections.map((c) => {
					if (c.id !== action.collectionId) return c;
					if (action.folderId) {
						return {
							...c,
							updatedAt: Date.now(),
							folders: c.folders.map((f) =>
								f.id === action.folderId
									? { ...f, requests: [...f.requests, action.request] }
									: f,
							),
						};
					}
					return {
						...c,
						updatedAt: Date.now(),
						requests: [...c.requests, action.request],
					};
				}),
			};
		}

		case 'REMOVE_REQUEST_FROM_COLLECTION': {
			return {
				...state,
				collections: state.collections.map((c) => {
					if (c.id !== action.collectionId) return c;
					if (action.folderId) {
						return {
							...c,
							updatedAt: Date.now(),
							folders: c.folders.map((f) =>
								f.id === action.folderId
									? {
											...f,
											requests: f.requests.filter(
												(r) => r.id !== action.requestId,
											),
										}
									: f,
							),
						};
					}
					return {
						...c,
						updatedAt: Date.now(),
						requests: c.requests.filter((r) => r.id !== action.requestId),
					};
				}),
			};
		}

		case 'CREATE_FOLDER': {
			const newFolder: CollectionFolder = {
				id: generateId(),
				name: action.name,
				requests: [],
				expanded: true,
			};
			return {
				...state,
				collections: state.collections.map((c) =>
					c.id === action.collectionId
						? {
								...c,
								folders: [...c.folders, newFolder],
								updatedAt: Date.now(),
							}
						: c,
				),
			};
		}

		case 'DELETE_FOLDER':
			return {
				...state,
				collections: state.collections.map((c) =>
					c.id === action.collectionId
						? {
								...c,
								folders: c.folders.filter((f) => f.id !== action.folderId),
								updatedAt: Date.now(),
							}
						: c,
				),
			};

		case 'TOGGLE_FOLDER':
			return {
				...state,
				collections: state.collections.map((c) =>
					c.id === action.collectionId
						? {
								...c,
								folders: c.folders.map((f) =>
									f.id === action.folderId
										? { ...f, expanded: !f.expanded }
										: f,
								),
							}
						: c,
				),
			};

		case 'LOAD_FROM_COLLECTION': {
			const req = action.request;
			const existingTab = state.tabs.find((t) => t.id === state.activeTabId);
			if (existingTab && !existingTab.url) {
				return {
					...state,
					tabs: state.tabs.map((t) =>
						t.id === state.activeTabId
							? {
									...t,
									method: req.method,
									url: req.url,
									headers: req.headers,
									body: req.body,
									name: req.name,
								}
							: t,
					),
				};
			}
			const newTab: RequestTab = {
				id: generateId(),
				name: req.name,
				method: req.method,
				url: req.url,
				headers: req.headers,
				body: req.body,
			};
			return {
				...state,
				tabs: [...state.tabs, newTab],
				activeTabId: newTab.id,
			};
		}

		// ─── Environment Cases ────────────────────────────

		case 'CREATE_ENVIRONMENT': {
			const newEnv: Environment = {
				id: generateId(),
				name: action.name,
				variables: [],
				createdAt: Date.now(),
			};
			return {
				...state,
				environments: [...state.environments, newEnv],
			};
		}

		case 'DELETE_ENVIRONMENT':
			return {
				...state,
				environments: state.environments.filter(
					(e) => e.id !== action.environmentId,
				),
				activeEnvironmentId:
					state.activeEnvironmentId === action.environmentId
						? null
						: state.activeEnvironmentId,
			};

		case 'RENAME_ENVIRONMENT':
			return {
				...state,
				environments: state.environments.map((e) =>
					e.id === action.environmentId ? { ...e, name: action.name } : e,
				),
			};

		case 'DUPLICATE_ENVIRONMENT': {
			const source = state.environments.find(
				(e) => e.id === action.environmentId,
			);
			if (!source) return state;
			const dupe: Environment = {
				...source,
				id: generateId(),
				name: `${source.name} (Copy)`,
				variables: source.variables.map((v) => ({ ...v, id: generateId() })),
				createdAt: Date.now(),
			};
			return {
				...state,
				environments: [...state.environments, dupe],
			};
		}

		case 'SET_ACTIVE_ENVIRONMENT':
			return { ...state, activeEnvironmentId: action.environmentId };

		case 'ADD_VARIABLE':
			return {
				...state,
				environments: state.environments.map((e) =>
					e.id === action.environmentId
						? { ...e, variables: [...e.variables, action.variable] }
						: e,
				),
			};

		case 'DELETE_VARIABLE':
			return {
				...state,
				environments: state.environments.map((e) =>
					e.id === action.environmentId
						? {
								...e,
								variables: e.variables.filter(
									(v) => v.id !== action.variableId,
								),
							}
						: e,
				),
			};

		case 'UPDATE_VARIABLE':
			return {
				...state,
				environments: state.environments.map((e) =>
					e.id === action.environmentId
						? {
								...e,
								variables: e.variables.map((v) =>
									v.id === action.variableId ? { ...v, ...action.updates } : v,
								),
							}
						: e,
				),
			};

		case 'HYDRATE_FROM_SERVER': {
			const server = action.serverState;
			return {
				...state,
				// Server is source of truth for shared workspace data
				collections: server.collections ?? state.collections,
				environments: server.environments ?? state.environments,
				activeEnvironmentId:
					server.activeEnvironmentId ?? state.activeEnvironmentId,
				history: server.history ?? state.history,
				settings: server.settings ?? state.settings,
			};
		}

		default:
			return state;
	}
}

function deriveTabName(url: string, method: HttpMethod): string {
	try {
		const parsed = new URL(url);
		const path = parsed.pathname === '/' ? '' : parsed.pathname;
		const short = path.split('/').filter(Boolean).slice(-2).join('/');
		return short ? `${method} /${short}` : `${method} ${parsed.hostname}`;
	} catch {
		return `${method} Request`;
	}
}

// ─── Server Sync ────────────────────────────────────

async function fetchWorkspaceFromServer(): Promise<RequestState | null> {
	try {
		const res = await fetch('/api/workspace');
		if (!res.ok) return null;
		const data = await res.json();
		// Empty object = first run, no workspace yet
		if (!data || Object.keys(data).length === 0) return null;
		return mergeServerState(data);
	} catch {
		return null;
	}
}

async function saveWorkspaceToServer(state: RequestState): Promise<boolean> {
	try {
		const res = await fetch('/api/workspace', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(state),
		});
		return res.ok;
	} catch {
		return false;
	}
}

// ─── Context ────────────────────────────────────────

interface RequestContextValue {
	state: RequestState;
	dispatch: React.Dispatch<Action>;
	activeTab: RequestTab;
	addHistory: (entry: HistoryEntry) => void;
	syncStatus: 'loading' | 'syncing' | 'synced' | 'error';
}

const RequestContext = createContext<RequestContextValue | null>(null);

export function RequestProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(
		requestReducer,
		undefined,
		createDefaultState,
	);
	const [syncStatus, setSyncStatus] =
		useState<RequestContextValue['syncStatus']>('loading');
	const stateRef = useRef(state);
	const isHydratedRef = useRef(false);
	stateRef.current = state;

	// On mount: load workspace from server (~/.voidflux/workspace.json)
	useEffect(() => {
		let cancelled = false;

		async function hydrateFromServer() {
			const serverState = await fetchWorkspaceFromServer();
			if (cancelled) return;

			if (serverState) {
				dispatch({ type: 'HYDRATE_FROM_SERVER', serverState });
			}
			isHydratedRef.current = true;
			setSyncStatus('synced');
		}

		hydrateFromServer();
		return () => {
			cancelled = true;
		};
	}, []);

	// Save to server on every state change (debounced 500ms)
	// Skip the initial save before hydration completes
	useEffect(() => {
		if (!isHydratedRef.current) return;

		const handler = setTimeout(() => {
			setSyncStatus('syncing');
			saveWorkspaceToServer(state)
				.then((ok) => setSyncStatus(ok ? 'synced' : 'error'))
				.catch(() => setSyncStatus('error'));
		}, 500);

		return () => clearTimeout(handler);
	}, [state]);

	// Poll server for changes from other devices (every 5s)
	useEffect(() => {
		const interval = setInterval(async () => {
			const serverState = await fetchWorkspaceFromServer();
			if (!serverState) return;

			const local = stateRef.current;
			const changed =
				JSON.stringify(serverState.collections) !==
					JSON.stringify(local.collections) ||
				JSON.stringify(serverState.environments) !==
					JSON.stringify(local.environments) ||
				JSON.stringify(serverState.history) !== JSON.stringify(local.history);

			if (changed) {
				dispatch({ type: 'HYDRATE_FROM_SERVER', serverState });
			}
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const activeTab =
		state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0];

	const addHistory = useCallback((entry: HistoryEntry) => {
		dispatch({ type: 'ADD_HISTORY', entry });
	}, []);

	return (
		<RequestContext.Provider
			value={{ state, dispatch, activeTab, addHistory, syncStatus }}
		>
			{children}
		</RequestContext.Provider>
	);
}

export function useRequestStore() {
	const ctx = useContext(RequestContext);
	if (!ctx) {
		throw new Error('useRequestStore must be used within RequestProvider');
	}
	return ctx;
}

export { generateId };
