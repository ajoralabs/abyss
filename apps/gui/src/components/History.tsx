import { useRequestStore, type HistoryEntry } from '../store/request-store';
import { Clock, Trash2, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { cn, formatTime, getStatusColor, METHOD_COLORS } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

function HistoryRow({
	entry,
	onLoad,
}: {
	entry: HistoryEntry;
	onLoad: (entry: HistoryEntry) => void;
}) {
	const urlDisplay = entry.url.replace(/^https?:\/\//, '');

	return (
		<button
			type="button"
			onClick={() => onLoad(entry)}
			className="w-full flex items-center gap-4 px-5 py-3.5 border-b border-white/5 hover:bg-white/3 transition-all group text-left"
		>
			{/* Method Badge */}
			<span
				className={cn(
					'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0',
					METHOD_COLORS[entry.method] ?? 'text-gray-400 bg-gray-400/10',
				)}
			>
				{entry.method}
			</span>

			{/* URL */}
			<span className="flex-1 font-mono text-xs text-gray-300 truncate">
				{urlDisplay}
			</span>

			{/* Status */}
			{entry.response.error ? (
				<span className="flex items-center gap-1 text-[10px] text-red-400 font-mono shrink-0">
					<AlertTriangle size={10} />
					Error
				</span>
			) : (
				<span
					className={cn(
						'text-xs font-mono font-bold shrink-0',
						getStatusColor(entry.response.status),
					)}
				>
					{entry.response.status}
				</span>
			)}

			{/* Latency */}
			<span className="text-[10px] font-mono text-gray-600 w-14 text-right shrink-0">
				{entry.response.latencyMs}ms
			</span>

			{/* Time */}
			<span className="text-[10px] text-gray-600 w-16 text-right shrink-0">
				{formatTime(entry.timestamp)}
			</span>

			{/* Action */}
			<ArrowUpRight
				size={14}
				className="text-gray-700 group-hover:text-neon-cyan transition-colors shrink-0"
			/>
		</button>
	);
}

export function History() {
	const { state, dispatch } = useRequestStore();
	const navigate = useNavigate();

	const handleLoad = (entry: HistoryEntry) => {
		dispatch({ type: 'LOAD_FROM_HISTORY', entry });
		navigate('/');
	};

	const handleClear = () => {
		dispatch({ type: 'CLEAR_HISTORY' });
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-abyss-950/50 relative overflow-hidden font-body">
			{/* Ambient Background */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />

			{/* Header */}
			<div className="px-6 py-5 border-b border-white/5 bg-white/2 backdrop-blur-md relative z-10 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Clock size={18} className="text-neon-cyan" />
					<h1 className="text-lg font-brand font-bold text-white">
						Request History
					</h1>
					<span className="text-[10px] text-gray-600 font-mono bg-white/5 px-2 py-0.5 rounded-full">
						{state.history.length} requests
					</span>
				</div>
				{state.history.length > 0 && (
					<button
						type="button"
						onClick={handleClear}
						className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all border border-transparent hover:border-red-400/20"
					>
						<Trash2 size={12} />
						Clear all
					</button>
				)}
			</div>

			{/* History List */}
			<div className="flex-1 overflow-y-auto relative z-10">
				{state.history.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center gap-3 opacity-20">
						<Clock size={32} className="text-gray-500" />
						<p className="text-center text-gray-500 text-xs uppercase tracking-widest leading-relaxed">
							No requests yet
							<br />
							Sent requests will appear here
						</p>
					</div>
				) : (
					state.history.map((entry) => (
						<HistoryRow key={entry.id} entry={entry} onLoad={handleLoad} />
					))
				)}
			</div>
		</div>
	);
}
