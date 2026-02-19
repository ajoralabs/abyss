import {
	BrowserRouter,
	Routes,
	Route,
	Outlet,
	Link,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import {
	Layers,
	Activity,
	Settings as SettingsIcon,
	Box,
	Globe,
	Zap,
	Plus,
} from 'lucide-react';
import { cn } from '../lib/utils';

import { ApiRequester } from './components/ApiRequester';
import { Collections } from './components/Collections';
import { Environments } from './components/Environments';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { RequestProvider, useRequestStore } from './store/request-store';

function App() {
	return (
		<BrowserRouter>
			<RequestProvider>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<ApiRequester />} />
						<Route path="collections" element={<Collections />} />
						<Route path="history" element={<History />} />
						<Route path="env" element={<Environments />} />
						<Route path="tunnel" element={<Placeholder title="Tunneling" />} />
						<Route path="settings" element={<Settings />} />
					</Route>
				</Routes>
			</RequestProvider>
		</BrowserRouter>
	);
}

function Layout() {
	const { dispatch } = useRequestStore();
	const navigate = useNavigate();

	return (
		<div className="flex h-screen overflow-hidden bg-abyss-950 text-white relative font-sans">
			<div className="bg-noise" />
			<div className="aurora-mesh" />

			{/* Floating Sidebar */}
			<aside className="w-16 lg:w-64 m-4 flex flex-col glass-panel rounded-2xl relative z-10 transition-all duration-300">
				{/* Brand */}
				<div className="p-4 flex items-center gap-3 border-b border-white/5">
					<img
						src="/logo.png"
						alt="Abyss"
						className="w-8 h-8 object-contain rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] mix-blend-screen"
					/>
					<span className="font-brand font-bold text-lg tracking-tight hidden lg:block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
						Abyss
					</span>
				</div>

				{/* New Request Button */}
				<div className="p-2 border-b border-white/5">
					<button
						type="button"
						onClick={() => {
							dispatch({ type: 'ADD_TAB' });
							navigate('/');
						}}
						className="w-full flex items-center justify-center lg:justify-start gap-3 p-2.5 rounded-xl bg-neon-cyan/5 hover:bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 transition-all group active:scale-[0.98]"
					>
						<Plus size={20} />
						<span className="hidden lg:block font-bold text-sm">
							New Request
						</span>
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
					<NavLink to="/" icon={Zap} label="Requester" />
					<NavLink to="/collections" icon={Layers} label="Collections" />
					<NavLink to="/history" icon={Activity} label="History" />
					<NavLink to="/env" icon={Box} label="Environments" />
					<NavLink to="/tunnel" icon={Globe} label="Tunneling" />
				</nav>

				{/* Bottom Actions */}
				<div className="p-2 border-t border-white/5">
					<NavLink to="/settings" icon={SettingsIcon} label="Settings" />
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 my-4 mr-4 glass-panel rounded-2xl relative z-10 overflow-hidden flex flex-col shadow-2xl">
				<Outlet />
			</main>
		</div>
	);
}

function NavLink({
	to,
	icon: Icon,
	label,
}: {
	to: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
	label: string;
}) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={cn(
				'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group border border-transparent',
				isActive
					? 'bg-white/10 text-white shadow-[0_0_15px_rgba(0,240,255,0.1)] border-white/10'
					: 'text-gray-400 hover:text-white hover:bg-white/5',
			)}
		>
			<Icon
				size={20}
				className={cn(
					'transition-colors',
					isActive ? 'text-neon-cyan' : 'group-hover:text-neon-cyan',
				)}
			/>
			<span className="hidden lg:block font-medium text-sm">{label}</span>

			{/* Active Indicator Dot */}
			<div
				className={cn(
					'ml-auto w-1.5 h-1.5 rounded-full bg-neon-cyan transition-opacity hidden lg:block',
					isActive ? 'opacity-100 shadow-[0_0_8px_#00f0ff]' : 'opacity-0',
				)}
			/>
		</Link>
	);
}

function Placeholder({ title }: { title: string }) {
	return (
		<div className="flex-1 flex flex-col items-center justify-center text-gray-500">
			<h1 className="text-2xl font-brand font-bold text-white mb-2">{title}</h1>
			<p>Module under construction.</p>
		</div>
	);
}

export default App;
