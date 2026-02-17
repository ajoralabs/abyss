import { useState } from 'react';
import {
	Box,
	Plus,
	Trash2,
	Copy,
	ChevronRight,
	ChevronDown,
	MoreHorizontal,
	Pencil,
	X,
	Save,
	Check,
	Globe,
	Lock,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
	useRequestStore,
	generateId,
	type Environment,
	type EnvVariable,
} from '../store/request-store';

// ─── Environments Page ───────────────────────────────

export function Environments() {
	const { state, dispatch } = useRequestStore();
	const { environments, activeEnvironmentId } = state;
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState('');

	const handleCreate = () => {
		if (!newName.trim()) return;
		dispatch({ type: 'CREATE_ENVIRONMENT', name: newName.trim() });
		setNewName('');
		setCreating(false);
	};

	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			{/* Header */}
			<div className="p-6 border-b border-white/5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-lime/20 to-neon-cyan/20 flex items-center justify-center border border-white/10">
							<Box size={20} className="text-electric-lime" />
						</div>
						<div>
							<h1 className="text-xl font-brand font-bold text-white">
								Environments
							</h1>
							<p className="text-sm text-gray-400">
								{environments.length} environment
								{environments.length !== 1 ? 's' : ''}
								{activeEnvironmentId && (
									<>
										{' · '}
										<span className="text-electric-lime">
											{environments.find((e) => e.id === activeEnvironmentId)
												?.name ?? 'Unknown'}{' '}
											active
										</span>
									</>
								)}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => setCreating(true)}
						className="flex items-center gap-2 px-4 py-2 rounded-xl bg-electric-lime/10 hover:bg-electric-lime/20 text-electric-lime border border-electric-lime/20 transition-all text-sm font-medium active:scale-[0.97]"
					>
						<Plus size={16} />
						<span className="hidden sm:inline">New Environment</span>
					</button>
				</div>

				{/* Syntax Hint */}
				<div className="mt-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-gray-400">
					<span className="text-gray-500">Tip:</span> Use{' '}
					<code className="font-mono text-electric-lime/80 bg-electric-lime/5 px-1.5 py-0.5 rounded">
						{'{{variableName}}'}
					</code>{' '}
					syntax in your URLs, headers, and request bodies to inject variables.
				</div>

				{/* Inline Create Form */}
				{creating && (
					<div className="mt-4 flex items-center gap-2">
						<input
							type="text"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleCreate();
								if (e.key === 'Escape') setCreating(false);
							}}
							placeholder="Environment name (e.g. Production, Staging)..."
							className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-electric-lime/50 focus:ring-1 focus:ring-electric-lime/20 transition-all outline-none"
							autoFocus
						/>
						<button
							type="button"
							onClick={handleCreate}
							className="p-2.5 rounded-xl bg-electric-lime/10 text-electric-lime hover:bg-electric-lime/20 border border-electric-lime/20 transition-all"
						>
							<Save size={16} />
						</button>
						<button
							type="button"
							onClick={() => setCreating(false)}
							className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
						>
							<X size={16} />
						</button>
					</div>
				)}
			</div>

			{/* Environment List */}
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{environments.length === 0 && !creating && (
					<EmptyState onCreateClick={() => setCreating(true)} />
				)}
				{environments.map((env) => (
					<EnvironmentCard key={env.id} environment={env} />
				))}
			</div>
		</div>
	);
}

// ─── Empty State ─────────────────────────────────────

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
	return (
		<div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
			<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-lime/10 to-neon-cyan/10 flex items-center justify-center border border-white/5 mb-6 animate-breathe">
				<Box size={32} className="text-electric-lime/60" />
			</div>
			<h2 className="text-lg font-brand font-bold text-white mb-2">
				No Environments Yet
			</h2>
			<p className="text-sm text-gray-400 max-w-xs mb-6">
				Create environments to manage variables like base URLs, tokens, and API
				keys across different stages.
			</p>
			<button
				type="button"
				onClick={onCreateClick}
				className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric-lime/10 hover:bg-electric-lime/20 text-electric-lime border border-electric-lime/20 transition-all text-sm font-medium"
			>
				<Plus size={16} />
				Create First Environment
			</button>
		</div>
	);
}

// ─── Environment Card ────────────────────────────────

function EnvironmentCard({ environment }: { environment: Environment }) {
	const { state, dispatch } = useRequestStore();
	const [expanded, setExpanded] = useState(true);
	const [showMenu, setShowMenu] = useState(false);
	const [renaming, setRenaming] = useState(false);
	const [editName, setEditName] = useState(environment.name);
	const [addingVar, setAddingVar] = useState(false);
	const [newVarKey, setNewVarKey] = useState('');
	const [newVarValue, setNewVarValue] = useState('');

	const isActive = state.activeEnvironmentId === environment.id;

	const handleRename = () => {
		if (!editName.trim()) return;
		dispatch({
			type: 'RENAME_ENVIRONMENT',
			environmentId: environment.id,
			name: editName.trim(),
		});
		setRenaming(false);
	};

	const handleAddVariable = () => {
		if (!newVarKey.trim()) return;
		dispatch({
			type: 'ADD_VARIABLE',
			environmentId: environment.id,
			variable: {
				id: generateId(),
				key: newVarKey.trim(),
				value: newVarValue,
				secret: false,
				active: true,
			},
		});
		setNewVarKey('');
		setNewVarValue('');
		setAddingVar(false);
	};

	return (
		<div
			className={cn(
				'rounded-2xl border transition-all overflow-hidden',
				isActive
					? 'border-electric-lime/30 bg-electric-lime/[0.02] shadow-[0_0_20px_rgba(204,255,0,0.05)]'
					: 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]',
			)}
		>
			{/* Environment Header */}
			<div
				className="flex items-center gap-3 p-4 cursor-pointer select-none"
				onClick={() => setExpanded(!expanded)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded);
				}}
				tabIndex={0}
				role="button"
			>
				<div className="text-gray-400 transition-transform">
					{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
				</div>

				<div
					className={cn(
						'w-8 h-8 rounded-lg flex items-center justify-center border shrink-0',
						isActive
							? 'bg-electric-lime/20 border-electric-lime/30'
							: 'bg-white/5 border-white/10',
					)}
				>
					{isActive ? (
						<Globe size={14} className="text-electric-lime" />
					) : (
						<Box size={14} className="text-gray-400" />
					)}
				</div>

				{renaming ? (
					<input
						type="text"
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						onKeyDown={(e) => {
							e.stopPropagation();
							if (e.key === 'Enter') handleRename();
							if (e.key === 'Escape') setRenaming(false);
						}}
						onBlur={handleRename}
						onClick={(e) => e.stopPropagation()}
						className="flex-1 bg-white/5 border border-electric-lime/30 rounded-lg px-2 py-1 text-sm text-white outline-none"
						autoFocus
					/>
				) : (
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<h3 className="text-sm font-bold text-white truncate">
								{environment.name}
							</h3>
							{isActive && (
								<span className="text-[10px] px-2 py-0.5 rounded-full bg-electric-lime/20 text-electric-lime font-medium">
									Active
								</span>
							)}
						</div>
						<p className="text-xs text-gray-500">
							{environment.variables.length} variable
							{environment.variables.length !== 1 ? 's' : ''}
						</p>
					</div>
				)}

				{/* Action buttons */}
				<div
					className="flex items-center gap-1"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
				>
					{/* Toggle Active */}
					<button
						type="button"
						onClick={() =>
							dispatch({
								type: 'SET_ACTIVE_ENVIRONMENT',
								environmentId: isActive ? null : environment.id,
							})
						}
						className={cn(
							'p-1.5 rounded-lg transition-all',
							isActive
								? 'text-electric-lime bg-electric-lime/10'
								: 'text-gray-500 hover:text-electric-lime hover:bg-white/5',
						)}
						title={isActive ? 'Deactivate' : 'Set as active'}
					>
						{isActive ? <Check size={14} /> : <Globe size={14} />}
					</button>
					<button
						type="button"
						onClick={() => setAddingVar(!addingVar)}
						className="p-1.5 rounded-lg text-gray-500 hover:text-electric-lime hover:bg-white/5 transition-all"
						title="Add variable"
					>
						<Plus size={14} />
					</button>
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowMenu(!showMenu)}
							className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
						>
							<MoreHorizontal size={14} />
						</button>
						{showMenu && (
							<EnvironmentMenu
								onRename={() => {
									setRenaming(true);
									setShowMenu(false);
								}}
								onDuplicate={() => {
									dispatch({
										type: 'DUPLICATE_ENVIRONMENT',
										environmentId: environment.id,
									});
									setShowMenu(false);
								}}
								onDelete={() =>
									dispatch({
										type: 'DELETE_ENVIRONMENT',
										environmentId: environment.id,
									})
								}
								onClose={() => setShowMenu(false)}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Expanded Content */}
			{expanded && (
				<div className="border-t border-white/5">
					{/* Add Variable Form */}
					{addingVar && (
						<div className="px-4 py-3 flex items-center gap-2 bg-white/[0.02] border-b border-white/5">
							<input
								type="text"
								value={newVarKey}
								onChange={(e) => setNewVarKey(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleAddVariable();
									if (e.key === 'Escape') setAddingVar(false);
								}}
								placeholder="Key"
								className="w-1/3 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 outline-none font-mono focus:border-electric-lime/30"
								autoFocus
							/>
							<span className="text-gray-600">=</span>
							<input
								type="text"
								value={newVarValue}
								onChange={(e) => setNewVarValue(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleAddVariable();
									if (e.key === 'Escape') setAddingVar(false);
								}}
								placeholder="Value"
								className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 outline-none font-mono focus:border-electric-lime/30"
							/>
							<button
								type="button"
								onClick={handleAddVariable}
								className="px-3 py-1.5 text-xs rounded-lg bg-electric-lime/20 text-electric-lime hover:bg-electric-lime/30 transition-all font-medium"
							>
								Add
							</button>
							<button
								type="button"
								onClick={() => setAddingVar(false)}
								className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-all"
							>
								<X size={14} />
							</button>
						</div>
					)}

					{/* Variable Table Header */}
					{environment.variables.length > 0 && (
						<div className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-wider text-gray-600 border-b border-white/5">
							<div className="w-6" />
							<div className="w-1/3">Key</div>
							<div className="flex-1">Value</div>
							<div className="w-20 text-right">Actions</div>
						</div>
					)}

					{/* Variable Rows */}
					{environment.variables.map((variable) => (
						<VariableRow
							key={variable.id}
							variable={variable}
							environmentId={environment.id}
						/>
					))}

					{/* Empty state within environment */}
					{environment.variables.length === 0 && !addingVar && (
						<div className="p-6 text-center">
							<p className="text-xs text-gray-500">
								No variables yet. Click{' '}
								<Plus size={10} className="inline text-gray-400" /> to add one.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// ─── Variable Row ────────────────────────────────────

function VariableRow({
	variable,
	environmentId,
}: {
	variable: EnvVariable;
	environmentId: string;
}) {
	const { dispatch } = useRequestStore();
	const [editing, setEditing] = useState(false);
	const [editKey, setEditKey] = useState(variable.key);
	const [editValue, setEditValue] = useState(variable.value);
	const [showSecret, setShowSecret] = useState(false);

	const handleSave = () => {
		dispatch({
			type: 'UPDATE_VARIABLE',
			environmentId,
			variableId: variable.id,
			updates: { key: editKey, value: editValue },
		});
		setEditing(false);
	};

	const displayValue =
		variable.secret && !showSecret
			? '•'.repeat(Math.min(variable.value.length, 20))
			: variable.value;

	return (
		<div className="group flex items-center gap-2 px-4 py-2 hover:bg-white/[0.03] transition-all border-b border-white/[0.02]">
			{/* Toggle Active */}
			<button
				type="button"
				onClick={() =>
					dispatch({
						type: 'UPDATE_VARIABLE',
						environmentId,
						variableId: variable.id,
						updates: { active: !variable.active },
					})
				}
				className={cn(
					'w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0',
					variable.active
						? 'bg-electric-lime/20 border-electric-lime/50'
						: 'bg-white/5 border-white/20',
				)}
			>
				{variable.active && <Check size={10} className="text-electric-lime" />}
			</button>

			{editing ? (
				<>
					<input
						type="text"
						value={editKey}
						onChange={(e) => setEditKey(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleSave();
							if (e.key === 'Escape') setEditing(false);
						}}
						className="w-1/3 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white font-mono outline-none"
						autoFocus
					/>
					<input
						type="text"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleSave();
							if (e.key === 'Escape') setEditing(false);
						}}
						className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white font-mono outline-none"
					/>
					<button
						type="button"
						onClick={handleSave}
						className="p-1 rounded text-electric-lime hover:bg-electric-lime/10 transition-all"
					>
						<Check size={14} />
					</button>
				</>
			) : (
				<>
					<span
						className={cn(
							'w-1/3 text-sm font-mono truncate',
							variable.active
								? 'text-electric-lime/80'
								: 'text-gray-500 line-through',
						)}
					>
						{variable.key}
					</span>
					<span
						className={cn(
							'flex-1 text-sm font-mono truncate flex items-center gap-1',
							variable.active ? 'text-gray-300' : 'text-gray-600',
						)}
					>
						{displayValue}
						{variable.secret && (
							<button
								type="button"
								onClick={() => setShowSecret(!showSecret)}
								className="p-0.5 rounded text-gray-600 hover:text-gray-400 transition-all"
							>
								<Lock size={10} />
							</button>
						)}
					</span>
				</>
			)}

			{/* Actions */}
			{!editing && (
				<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity w-20 justify-end">
					<button
						type="button"
						onClick={() => {
							dispatch({
								type: 'UPDATE_VARIABLE',
								environmentId,
								variableId: variable.id,
								updates: { secret: !variable.secret },
							});
						}}
						className={cn(
							'p-1 rounded transition-all',
							variable.secret
								? 'text-amber-400 hover:text-amber-300'
								: 'text-gray-500 hover:text-amber-400',
						)}
						title={variable.secret ? 'Mark as visible' : 'Mark as secret'}
					>
						<Lock size={12} />
					</button>
					<button
						type="button"
						onClick={() => setEditing(true)}
						className="p-1 rounded text-gray-500 hover:text-neon-cyan transition-all"
						title="Edit"
					>
						<Pencil size={12} />
					</button>
					<button
						type="button"
						onClick={() =>
							dispatch({
								type: 'DELETE_VARIABLE',
								environmentId,
								variableId: variable.id,
							})
						}
						className="p-1 rounded text-gray-500 hover:text-red-400 transition-all"
						title="Delete"
					>
						<Trash2 size={12} />
					</button>
				</div>
			)}
		</div>
	);
}

// ─── Context Menu ────────────────────────────────────

function EnvironmentMenu({
	onRename,
	onDuplicate,
	onDelete,
	onClose,
}: {
	onRename: () => void;
	onDuplicate: () => void;
	onDelete: () => void;
	onClose: () => void;
}) {
	return (
		<>
			<div
				className="fixed inset-0 z-40"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === 'Escape') onClose();
				}}
				role="button"
				tabIndex={-1}
				aria-label="Close menu"
			/>
			<div className="absolute right-0 top-8 z-50 w-44 rounded-xl bg-abyss-800 border border-white/10 shadow-2xl py-1 overflow-hidden">
				<button
					type="button"
					onClick={onRename}
					className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
				>
					<Pencil size={14} />
					Rename
				</button>
				<button
					type="button"
					onClick={onDuplicate}
					className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
				>
					<Copy size={14} />
					Duplicate
				</button>
				<button
					type="button"
					onClick={onDelete}
					className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
				>
					<Trash2 size={14} />
					Delete
				</button>
			</div>
		</>
	);
}
