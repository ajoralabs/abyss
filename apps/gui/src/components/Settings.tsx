import { useState, useEffect } from 'react';
import { useRequestStore } from '../store/request-store';
import {
	Settings as SettingsIcon,
	Trash2,
	Save,
	Database,
	AlertTriangle,
	Check,
	Cloud,
	CloudOff,
	Loader2,
} from 'lucide-react';

export function Settings() {
	const { state, dispatch, syncStatus } = useRequestStore();
	const [maxHistory, setMaxHistory] = useState(
		state.settings.maxHistoryEntries,
	);
	const [saved, setSaved] = useState(false);

	// Update local state when store state changes (e.g. initial load)
	useEffect(() => {
		setMaxHistory(state.settings.maxHistoryEntries);
	}, [state.settings.maxHistoryEntries]);

	const handleSave = () => {
		dispatch({
			type: 'UPDATE_SETTINGS',
			updates: { maxHistoryEntries: maxHistory },
		});
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	const handleClearHistory = () => {
		if (confirm('Are you sure you want to clear request history?')) {
			dispatch({ type: 'CLEAR_HISTORY' });
		}
	};

	const handleResetAll = () => {
		if (
			confirm(
				'WARNING: This will delete ALL data, including history, collections, and settings. This cannot be undone.',
			)
		) {
			dispatch({ type: 'CLEAR_DATA' });
			window.location.reload(); // Force reload to clear any lingering state
		}
	};

	const syncIcon =
		syncStatus === 'synced' ? (
			<Cloud size={14} className="text-green-400" />
		) : syncStatus === 'syncing' || syncStatus === 'loading' ? (
			<Loader2 size={14} className="text-neon-cyan animate-spin" />
		) : (
			<CloudOff size={14} className="text-red-400" />
		);

	const syncLabel =
		syncStatus === 'synced'
			? 'Synced'
			: syncStatus === 'syncing'
				? 'Syncing…'
				: syncStatus === 'loading'
					? 'Loading…'
					: 'Sync error';

	return (
		<div className="flex-1 flex flex-col h-full bg-abyss-950/50 relative overflow-hidden font-body">
			{/* Ambient Background */}
			<div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-electric-violet/5 rounded-full blur-[120px] pointer-events-none" />

			{/* Header */}
			<div className="px-6 py-5 border-b border-white/5 bg-white/2 backdrop-blur-md relative z-10 flex items-center gap-3">
				<SettingsIcon size={18} className="text-neon-cyan" />
				<h1 className="text-lg font-brand font-bold text-white">Settings</h1>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-6 relative z-10">
				<div className="max-w-2xl mx-auto space-y-8">
					{/* Workspace Section */}
					<div className="space-y-4">
						<h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
							<Database size={14} className="text-neon-cyan" />
							Workspace Storage
						</h2>
						<div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-bold text-gray-200">
										Data Location
									</p>
									<p className="text-xs text-gray-500 mt-1">
										All workspace data is stored on the host machine.
									</p>
								</div>
								<code className="font-mono text-xs text-neon-cyan bg-white/5 px-3 py-1.5 rounded-lg">
									~/.voidflux/workspace.json
								</code>
							</div>

							<div className="flex items-center justify-between border-t border-white/5 pt-4">
								<div>
									<p className="text-sm font-bold text-gray-200">Sync Status</p>
									<p className="text-xs text-gray-500 mt-1">
										Shared across all connected devices on the network.
									</p>
								</div>
								<div className="flex items-center gap-2 text-xs font-bold">
									{syncIcon}
									<span
										className={
											syncStatus === 'synced'
												? 'text-green-400'
												: syncStatus === 'error'
													? 'text-red-400'
													: 'text-gray-400'
										}
									>
										{syncLabel}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2 bg-neon-cyan/5 border border-neon-cyan/10 rounded-lg px-4 py-3 text-xs text-gray-400">
								<Check size={14} className="text-neon-cyan shrink-0" />
								<span>
									Collections, environments, and history persist even if you
									uninstall. Any device connecting to this CLI instance sees the
									same workspace.
								</span>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
								<button
									type="button"
									onClick={handleClearHistory}
									className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all"
								>
									<Trash2 size={14} className="text-gray-500" />
									Clear History
								</button>
								<button
									type="button"
									onClick={handleResetAll}
									className="flex items-center justify-center gap-2 px-4 py-3 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 hover:border-red-400/30 rounded-xl text-xs font-bold text-red-400 transition-all"
								>
									<AlertTriangle size={14} />
									Reset Everything
								</button>
							</div>
						</div>
					</div>

					{/* Application Section */}
					<div className="space-y-4">
						<h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
							<SettingsIcon size={14} className="text-electric-violet" />
							Application Config
						</h2>
						<div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-6">
							<div>
								<label
									htmlFor="max-history"
									className="block text-sm font-bold text-gray-200 mb-2"
								>
									Max History Items
								</label>
								<div className="flex gap-4">
									<input
										id="max-history"
										type="number"
										value={maxHistory}
										onChange={(e) => setMaxHistory(Number(e.target.value))}
										className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:border-neon-cyan/50 transition-all outline-none"
									/>
									<button
										type="button"
										onClick={handleSave}
										className="px-6 py-2.5 bg-neon-cyan text-abyss-950 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
									>
										{saved ? <Check size={16} /> : <Save size={16} />}
										{saved ? 'Saved' : 'Save'}
									</button>
								</div>
								<p className="text-xs text-gray-500 mt-2">
									Older history items will be automatically removed when this
									limit is reached.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
