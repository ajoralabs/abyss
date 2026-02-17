import { useState, useRef, useEffect } from 'react';
import {
	Layers,
	Plus,
	Trash2,
	FolderPlus,
	ChevronRight,
	ChevronDown,
	MoreHorizontal,
	Play,
	FileText,
	Pencil,
	X,
	Save,
	FolderOpen,
	Box,
	Cloud,
	CloudOff,
	Loader2,
	Search,
	Globe,
	Check,
} from 'lucide-react';
import { cn, METHOD_COLORS } from '../../lib/utils';
import {
	useRequestStore,
	generateId,
	type Collection,
	type CollectionFolder,
	type SavedRequest,
} from '../store/request-store';

// ─── Collections Workspace ───────────────────────────

export function Collections() {
	const { state, dispatch, syncStatus } = useRequestStore();
	const { collections, environments, activeEnvironmentId } = state;
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
		null,
	);
	const [searchQuery, setSearchQuery] = useState('');

	const activeEnv = environments.find((e) => e.id === activeEnvironmentId);

	const handleCreate = () => {
		if (!newName.trim()) return;
		dispatch({ type: 'CREATE_COLLECTION', name: newName.trim() });
		setNewName('');
		setCreating(false);
	};

	// Find the selected request across all collections
	const findRequest = (): {
		request: SavedRequest;
		collectionId: string;
		collectionName: string;
		folderId?: string;
		folderName?: string;
	} | null => {
		if (!selectedRequestId) return null;
		for (const col of collections) {
			for (const req of col.requests) {
				if (req.id === selectedRequestId) {
					return {
						request: req,
						collectionId: col.id,
						collectionName: col.name,
					};
				}
			}
			for (const folder of col.folders) {
				for (const req of folder.requests) {
					if (req.id === selectedRequestId) {
						return {
							request: req,
							collectionId: col.id,
							collectionName: col.name,
							folderId: folder.id,
							folderName: folder.name,
						};
					}
				}
			}
		}
		return null;
	};

	const selected = findRequest();

	// Filter requests by search
	const filterMatch = (text: string) =>
		!searchQuery || text.toLowerCase().includes(searchQuery.toLowerCase());

	// Sync status indicator
	const syncIndicator =
		syncStatus === 'synced' ? (
			<Cloud size={12} className="text-green-400" />
		) : syncStatus === 'syncing' || syncStatus === 'loading' ? (
			<Loader2 size={12} className="text-neon-cyan animate-spin" />
		) : (
			<CloudOff size={12} className="text-red-400" />
		);

	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			{/* Workspace Header */}
			<div className="px-5 py-3 border-b border-white/5 bg-white/2 backdrop-blur-md flex items-center gap-3">
				<Layers size={16} className="text-neon-cyan shrink-0" />
				<h1 className="text-sm font-brand font-bold text-white mr-auto">
					Workspace
				</h1>

				{/* Environment Switcher */}
				<EnvironmentSwitcher
					environments={environments}
					activeEnvironmentId={activeEnvironmentId}
					activeEnvName={activeEnv?.name}
					onSwitch={(id) =>
						dispatch({ type: 'SET_ACTIVE_ENVIRONMENT', environmentId: id })
					}
				/>

				{/* Sync indicator */}
				<div
					className="flex items-center gap-1.5 text-[10px] text-gray-500"
					title={`Sync: ${syncStatus}`}
				>
					{syncIndicator}
					<span className="hidden lg:inline">
						{syncStatus === 'synced' ? 'Saved' : syncStatus}
					</span>
				</div>
			</div>

			{/* Main Split Layout */}
			<div className="flex-1 flex overflow-hidden">
				{/* ─── Sidebar Tree ─────────────────────── */}
				<div className="w-72 xl:w-80 border-r border-white/5 flex flex-col bg-white/[0.01] overflow-hidden">
					{/* Search + Actions */}
					<div className="p-3 flex items-center gap-2 border-b border-white/5">
						<div className="flex-1 flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/5 focus-within:border-neon-cyan/30 transition-all">
							<Search size={12} className="text-gray-500 shrink-0" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search requests…"
								className="bg-transparent text-xs text-white placeholder-gray-600 outline-none w-full"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery('')}
									className="text-gray-500 hover:text-white transition-colors"
								>
									<X size={10} />
								</button>
							)}
						</div>
						<button
							type="button"
							onClick={() => setCreating(true)}
							className="p-1.5 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 border border-neon-cyan/20 transition-all shrink-0"
							title="New Collection"
						>
							<Plus size={14} />
						</button>
					</div>

					{/* Tree Content */}
					<div className="flex-1 overflow-y-auto py-1">
						{/* Inline Create */}
						{creating && (
							<div className="px-3 py-2 flex items-center gap-2">
								<Layers size={12} className="text-neon-cyan shrink-0" />
								<input
									type="text"
									ref={(el) => el?.focus()}
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') handleCreate();
										if (e.key === 'Escape') setCreating(false);
									}}
									onBlur={() => {
										if (!newName.trim()) setCreating(false);
									}}
									placeholder="Collection name…"
									className="flex-1 bg-white/5 border border-neon-cyan/30 rounded px-2 py-1 text-xs text-white placeholder-gray-600 outline-none"
								/>
								<button
									type="button"
									onClick={handleCreate}
									className="text-neon-cyan p-1 hover:bg-white/5 rounded transition-all"
								>
									<Check size={12} />
								</button>
								<button
									type="button"
									onClick={() => setCreating(false)}
									className="text-gray-500 p-1 hover:bg-white/5 rounded transition-all"
								>
									<X size={12} />
								</button>
							</div>
						)}

						{collections.length === 0 && !creating && (
							<EmptyTreeState onCreateClick={() => setCreating(true)} />
						)}

						{collections.map((collection) => (
							<CollectionTreeNode
								key={collection.id}
								collection={collection}
								selectedRequestId={selectedRequestId}
								onSelectRequest={setSelectedRequestId}
								filterMatch={filterMatch}
							/>
						))}
					</div>

					{/* Sidebar Footer */}
					<div className="p-3 border-t border-white/5 text-[10px] text-gray-600">
						{collections.length} collection{collections.length !== 1 ? 's' : ''}{' '}
						·{' '}
						{collections.reduce(
							(sum, c) =>
								sum +
								c.requests.length +
								c.folders.reduce((fs, f) => fs + f.requests.length, 0),
							0,
						)}{' '}
						requests
					</div>
				</div>

				{/* ─── Detail Panel ─────────────────────── */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{selected ? (
						<RequestDetailPanel
							selected={selected}
							onClose={() => setSelectedRequestId(null)}
						/>
					) : (
						<WorkspaceEmptyState
							collectionsCount={collections.length}
							activeEnv={activeEnv?.name}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

// ─── Environment Switcher ────────────────────────────

function EnvironmentSwitcher({
	environments,
	activeEnvironmentId,
	activeEnvName,
	onSwitch,
}: {
	environments: { id: string; name: string }[];
	activeEnvironmentId: string | null;
	activeEnvName?: string;
	onSwitch: (id: string | null) => void;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className={cn(
					'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
					activeEnvironmentId
						? 'bg-lime-400/10 text-lime-400 border-lime-400/20 hover:bg-lime-400/15'
						: 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white',
				)}
			>
				<Box size={12} />
				<span className="max-w-24 truncate">{activeEnvName ?? 'No Env'}</span>
				<ChevronDown
					size={10}
					className={cn('transition-transform', open && 'rotate-180')}
				/>
			</button>

			{open && (
				<div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-abyss-800 border border-white/10 shadow-2xl py-1 overflow-hidden">
					{/* No environment option */}
					<button
						type="button"
						onClick={() => {
							onSwitch(null);
							setOpen(false);
						}}
						className={cn(
							'w-full flex items-center gap-2 px-3 py-2 text-xs transition-all',
							!activeEnvironmentId
								? 'text-white bg-white/5'
								: 'text-gray-400 hover:text-white hover:bg-white/5',
						)}
					>
						<Globe size={12} className="text-gray-500" />
						No Environment
						{!activeEnvironmentId && (
							<Check size={10} className="ml-auto text-lime-400" />
						)}
					</button>

					{environments.length > 0 && (
						<div className="border-t border-white/5 my-1" />
					)}

					{environments.map((env) => (
						<button
							key={env.id}
							type="button"
							onClick={() => {
								onSwitch(env.id);
								setOpen(false);
							}}
							className={cn(
								'w-full flex items-center gap-2 px-3 py-2 text-xs transition-all',
								activeEnvironmentId === env.id
									? 'text-lime-400 bg-lime-400/5'
									: 'text-gray-400 hover:text-white hover:bg-white/5',
							)}
						>
							<Box
								size={12}
								className={
									activeEnvironmentId === env.id
										? 'text-lime-400'
										: 'text-gray-500'
								}
							/>
							<span className="truncate">{env.name}</span>
							{activeEnvironmentId === env.id && (
								<Check size={10} className="ml-auto text-lime-400" />
							)}
						</button>
					))}

					{environments.length === 0 && (
						<p className="px-3 py-2 text-[10px] text-gray-600">
							Create environments in the Environments tab.
						</p>
					)}
				</div>
			)}
		</div>
	);
}

// ─── Collection Tree Node ────────────────────────────

function CollectionTreeNode({
	collection,
	selectedRequestId,
	onSelectRequest,
	filterMatch,
}: {
	collection: Collection;
	selectedRequestId: string | null;
	onSelectRequest: (id: string) => void;
	filterMatch: (text: string) => boolean;
}) {
	const { state, dispatch } = useRequestStore();
	const [expanded, setExpanded] = useState(true);
	const [showMenu, setShowMenu] = useState(false);
	const [renaming, setRenaming] = useState(false);
	const [editName, setEditName] = useState(collection.name);
	const [creatingFolder, setCreatingFolder] = useState(false);
	const [newFolderName, setNewFolderName] = useState('');

	const hasMatchingRequests =
		collection.requests.some((r) => filterMatch(r.url || r.name)) ||
		collection.folders.some(
			(f) =>
				filterMatch(f.name) ||
				f.requests.some((r) => filterMatch(r.url || r.name)),
		);

	// Hide entire collection if search is active and nothing matches
	if (!filterMatch(collection.name) && !hasMatchingRequests) return null;

	const handleRename = () => {
		if (!editName.trim()) return;
		dispatch({
			type: 'RENAME_COLLECTION',
			collectionId: collection.id,
			name: editName.trim(),
		});
		setRenaming(false);
	};

	const handleCreateFolder = () => {
		if (!newFolderName.trim()) return;
		dispatch({
			type: 'CREATE_FOLDER',
			collectionId: collection.id,
			name: newFolderName.trim(),
		});
		setNewFolderName('');
		setCreatingFolder(false);
	};

	const handleSaveCurrentRequest = () => {
		const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
		if (!activeTab || !activeTab.url) return;
		const saved: SavedRequest = {
			id: generateId(),
			name: activeTab.name || `${activeTab.method} ${activeTab.url}`,
			method: activeTab.method,
			url: activeTab.url,
			headers: activeTab.headers,
			body: activeTab.body,
			createdAt: Date.now(),
		};
		dispatch({
			type: 'ADD_REQUEST_TO_COLLECTION',
			collectionId: collection.id,
			request: saved,
		});
	};

	return (
		<div className="select-none">
			{/* Collection header row */}
			<div className="group flex items-center gap-1 px-3 py-1.5 hover:bg-white/5 transition-all">
				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					className="p-0.5 text-gray-500 hover:text-white transition-colors"
				>
					{expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
				</button>

				{renaming ? (
					<input
						type="text"
						ref={(el) => el?.focus()}
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						onKeyDown={(e) => {
							e.stopPropagation();
							if (e.key === 'Enter') handleRename();
							if (e.key === 'Escape') setRenaming(false);
						}}
						onBlur={handleRename}
						onClick={(e) => e.stopPropagation()}
						className="flex-1 bg-white/5 border border-neon-cyan/30 rounded px-2 py-0.5 text-xs text-white outline-none"
					/>
				) : (
					<button
						type="button"
						onClick={() => setExpanded(!expanded)}
						className="flex-1 flex items-center gap-1.5 min-w-0 text-left"
					>
						<FolderOpen size={13} className="text-electric-violet shrink-0" />
						<span className="text-xs font-semibold text-gray-200 truncate">
							{collection.name}
						</span>
						<span className="text-[10px] text-gray-600 ml-auto shrink-0">
							{collection.requests.length +
								collection.folders.reduce((s, f) => s + f.requests.length, 0)}
						</span>
					</button>
				)}

				{/* Actions (visible on hover) */}
				<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
					<button
						type="button"
						onClick={handleSaveCurrentRequest}
						className="p-1 rounded text-gray-600 hover:text-neon-cyan transition-colors"
						title="Save active request here"
					>
						<Save size={11} />
					</button>
					<button
						type="button"
						onClick={() => setCreatingFolder(true)}
						className="p-1 rounded text-gray-600 hover:text-neon-cyan transition-colors"
						title="New folder"
					>
						<FolderPlus size={11} />
					</button>
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowMenu(!showMenu)}
							className="p-1 rounded text-gray-600 hover:text-white transition-colors"
						>
							<MoreHorizontal size={11} />
						</button>
						{showMenu && (
							<CollectionMenu
								onRename={() => {
									setRenaming(true);
									setShowMenu(false);
								}}
								onDelete={() =>
									dispatch({
										type: 'DELETE_COLLECTION',
										collectionId: collection.id,
									})
								}
								onClose={() => setShowMenu(false)}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Expanded children */}
			{expanded && (
				<div className="ml-3 border-l border-white/5">
					{/* Create folder inline */}
					{creatingFolder && (
						<div className="flex items-center gap-1.5 px-3 py-1">
							<FolderPlus size={11} className="text-gray-500 shrink-0" />
							<input
								type="text"
								ref={(el) => el?.focus()}
								value={newFolderName}
								onChange={(e) => setNewFolderName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleCreateFolder();
									if (e.key === 'Escape') setCreatingFolder(false);
								}}
								placeholder="Folder name…"
								className="flex-1 bg-transparent text-xs text-white placeholder-gray-600 outline-none"
							/>
							<button
								type="button"
								onClick={handleCreateFolder}
								className="text-neon-cyan text-[10px] hover:underline"
							>
								Add
							</button>
						</div>
					)}

					{/* Folders */}
					{collection.folders.map((folder) => (
						<FolderTreeNode
							key={folder.id}
							folder={folder}
							collectionId={collection.id}
							selectedRequestId={selectedRequestId}
							onSelectRequest={onSelectRequest}
							filterMatch={filterMatch}
						/>
					))}

					{/* Root-level requests */}
					{collection.requests.map((req) => {
						if (!filterMatch(req.url || req.name)) return null;
						return (
							<RequestTreeRow
								key={req.id}
								request={req}
								collectionId={collection.id}
								selected={selectedRequestId === req.id}
								onSelect={() => onSelectRequest(req.id)}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

// ─── Folder Tree Node ────────────────────────────────

function FolderTreeNode({
	folder,
	collectionId,
	selectedRequestId,
	onSelectRequest,
	filterMatch,
}: {
	folder: CollectionFolder;
	collectionId: string;
	selectedRequestId: string | null;
	onSelectRequest: (id: string) => void;
	filterMatch: (text: string) => boolean;
}) {
	const { dispatch } = useRequestStore();

	const hasMatches =
		filterMatch(folder.name) ||
		folder.requests.some((r) => filterMatch(r.url || r.name));
	if (!hasMatches) return null;

	return (
		<div>
			<div className="group flex items-center gap-1.5 px-3 py-1 hover:bg-white/5 transition-all">
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: 'TOGGLE_FOLDER',
							collectionId,
							folderId: folder.id,
						})
					}
					className="p-0.5 text-gray-500 hover:text-white transition-colors"
				>
					{folder.expanded ? (
						<ChevronDown size={10} />
					) : (
						<ChevronRight size={10} />
					)}
				</button>
				<FolderOpen size={12} className="text-amber-400/70 shrink-0" />
				<span className="text-xs text-gray-300 flex-1 truncate">
					{folder.name}
				</span>
				<span className="text-[10px] text-gray-600">
					{folder.requests.length}
				</span>
				<button
					type="button"
					onClick={() =>
						dispatch({
							type: 'DELETE_FOLDER',
							collectionId,
							folderId: folder.id,
						})
					}
					className="p-0.5 rounded text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
				>
					<Trash2 size={10} />
				</button>
			</div>

			{folder.expanded && (
				<div className="ml-4">
					{folder.requests.map((req) => {
						if (!filterMatch(req.url || req.name)) return null;
						return (
							<RequestTreeRow
								key={req.id}
								request={req}
								collectionId={collectionId}
								folderId={folder.id}
								selected={selectedRequestId === req.id}
								onSelect={() => onSelectRequest(req.id)}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

// ─── Request Tree Row ────────────────────────────────

function RequestTreeRow({
	request,
	collectionId,
	folderId,
	selected,
	onSelect,
}: {
	request: SavedRequest;
	collectionId: string;
	folderId?: string;
	selected: boolean;
	onSelect: () => void;
}) {
	const { dispatch } = useRequestStore();

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				'group w-full flex items-center gap-1.5 px-3 py-1.5 text-left transition-all',
				selected
					? 'bg-neon-cyan/10 border-r-2 border-neon-cyan'
					: 'hover:bg-white/5',
			)}
		>
			<FileText size={11} className="text-gray-600 shrink-0" />
			<span
				className={cn(
					'text-[10px] font-mono font-bold px-1 py-0.5 rounded shrink-0',
					METHOD_COLORS[request.method] || 'text-gray-400',
				)}
			>
				{request.method}
			</span>
			<span className="text-xs text-gray-300 flex-1 truncate font-mono">
				{request.url || request.name}
			</span>

			{/* Quick actions */}
			<span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					type="button"
					className="p-0.5 rounded text-gray-500 hover:text-neon-cyan transition-colors cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						dispatch({ type: 'LOAD_FROM_COLLECTION', request });
					}}
					title="Load into requester"
				>
					<Play size={10} />
				</button>
				<button
					type="button"
					className="p-0.5 rounded text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						dispatch({
							type: 'REMOVE_REQUEST_FROM_COLLECTION',
							collectionId,
							folderId,
							requestId: request.id,
						});
					}}
					title="Remove"
				>
					<Trash2 size={10} />
				</button>
			</span>
		</button>
	);
}

// ─── Request Detail Panel ────────────────────────────

function RequestDetailPanel({
	selected,
	onClose,
}: {
	selected: {
		request: SavedRequest;
		collectionId: string;
		collectionName: string;
		folderId?: string;
		folderName?: string;
	};
	onClose: () => void;
}) {
	const { dispatch } = useRequestStore();
	const { request, collectionName, folderName } = selected;

	const location = folderName
		? `${collectionName} / ${folderName}`
		: collectionName;

	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			{/* Detail Header */}
			<div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
				<div>
					<p className="text-[10px] text-gray-500 mb-1">{location}</p>
					<div className="flex items-center gap-2">
						<span
							className={cn(
								'text-xs font-mono font-bold px-2 py-0.5 rounded',
								METHOD_COLORS[request.method] || 'text-gray-400',
							)}
						>
							{request.method}
						</span>
						<span className="text-sm font-mono text-white truncate">
							{request.url}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => dispatch({ type: 'LOAD_FROM_COLLECTION', request })}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 border border-neon-cyan/20 text-xs font-medium transition-all active:scale-[0.97]"
					>
						<Play size={12} />
						Open in Requester
					</button>
					<button
						type="button"
						onClick={onClose}
						className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
					>
						<X size={14} />
					</button>
				</div>
			</div>

			{/* Detail Body */}
			<div className="flex-1 overflow-y-auto p-6 space-y-6">
				{/* URL */}
				<div>
					<h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
						URL
					</h3>
					<div className="font-mono text-sm text-gray-200 bg-white/5 rounded-lg px-4 py-3 border border-white/5 break-all">
						{request.url || '(empty)'}
					</div>
				</div>

				{/* Headers */}
				{request.headers.length > 0 && (
					<div>
						<h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
							Headers ({request.headers.filter((h) => h.active).length} active)
						</h3>
						<div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
							{request.headers.map((header) => (
								<div
									key={header.id}
									className={cn(
										'flex gap-2 px-4 py-2 border-b border-white/5 last:border-0 text-xs font-mono',
										!header.active && 'opacity-40',
									)}
								>
									<span className="text-neon-cyan font-semibold min-w-[120px]">
										{header.key}
									</span>
									<span className="text-gray-400">{header.value}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Body */}
				{request.body && (
					<div>
						<h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
							Body
						</h3>
						<pre className="font-mono text-xs text-gray-300 bg-white/5 rounded-lg px-4 py-3 border border-white/5 overflow-x-auto max-h-60 whitespace-pre-wrap">
							{request.body}
						</pre>
					</div>
				)}

				{/* Meta */}
				<div className="text-[10px] text-gray-600 pt-2 border-t border-white/5">
					Saved {new Date(request.createdAt).toLocaleString()}
				</div>
			</div>
		</div>
	);
}

// ─── Empty States ────────────────────────────────────

function EmptyTreeState({ onCreateClick }: { onCreateClick: () => void }) {
	return (
		<div className="flex flex-col items-center py-12 px-4 text-center">
			<Layers size={24} className="text-gray-600 mb-3" />
			<p className="text-xs text-gray-500 mb-3">No collections yet</p>
			<button
				type="button"
				onClick={onCreateClick}
				className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-cyan/10 text-neon-cyan text-xs border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-all"
			>
				<Plus size={12} />
				Create Collection
			</button>
		</div>
	);
}

function WorkspaceEmptyState({
	collectionsCount,
	activeEnv,
}: {
	collectionsCount: number;
	activeEnv?: string;
}) {
	return (
		<div className="flex-1 flex flex-col items-center justify-center text-center px-8">
			<div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 mb-4">
				<FileText size={24} className="text-gray-600" />
			</div>
			<h2 className="text-sm font-brand font-bold text-gray-300 mb-1">
				{collectionsCount === 0
					? 'Create your first collection'
					: 'Select a request'}
			</h2>
			<p className="text-xs text-gray-600 max-w-xs mb-4">
				{collectionsCount === 0
					? 'Organize your API requests into collections for faster workflows.'
					: 'Click on a request in the sidebar to view its details, or load it into the requester.'}
			</p>

			{activeEnv && (
				<div className="flex items-center gap-1.5 text-[10px] text-lime-400/70 bg-lime-400/5 px-3 py-1.5 rounded-full border border-lime-400/10">
					<Box size={10} />
					<span>Active: {activeEnv}</span>
				</div>
			)}
		</div>
	);
}

// ─── Context Menu ────────────────────────────────────

function CollectionMenu({
	onRename,
	onDelete,
	onClose,
}: {
	onRename: () => void;
	onDelete: () => void;
	onClose: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose();
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [onClose]);

	return (
		<div
			ref={ref}
			className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl bg-abyss-800 border border-white/10 shadow-2xl py-1 overflow-hidden"
		>
			<button
				type="button"
				onClick={onRename}
				className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-all"
			>
				<Pencil size={12} />
				Rename
			</button>
			<button
				type="button"
				onClick={onDelete}
				className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
			>
				<Trash2 size={12} />
				Delete
			</button>
		</div>
	);
}
