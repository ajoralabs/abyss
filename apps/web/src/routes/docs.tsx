import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/docs')({
	component: DocsPage,
});

type PackageManager = 'bun' | 'npm' | 'pnpm' | 'brew';

const installCommands: Record<PackageManager, { cli: string }> = {
	bun: { cli: 'bun add -g @abysslabs/cli' },
	npm: {
		cli: 'npm install -g @abysslabs/cli',
	},
	pnpm: { cli: 'pnpm add -g @abysslabs/cli' },
	brew: { cli: 'brew install abyss' },
};

function DocsPage() {
	const [activePm, setActivePm] = useState<PackageManager>('bun');
	const [activeSection, setActiveSection] = useState('Getting Started');

	const docSections = [
		{
			title: 'Getting Started',
			icon: '⚡',
			items: [
				{
					title: 'Install the CLI',
					description:
						'Install @abysslabs/cli globally using your preferred package manager',
					code: installCommands[activePm].cli,
				},
				{
					title: 'Quick Start',
					description:
						'Launch the GUI server and send your first API request in seconds',
					code: 'abyss --port 4567',
				},
				{
					title: 'Project Structure',
					description:
						'Understand the monorepo layout — apps/cli, apps/web, packages/core',
				},
			],
		},
		{
			title: 'CLI Reference',
			icon: '▸',
			items: [
				{
					title: 'abyss',
					description: 'Start the local GUI server and open the web interface',
					code: 'abyss [--port 4567] [--no-open]',
				},
				{
					title: '--port',
					description:
						'Specify a custom port for the GUI server (default: 4567)',
				},
				{
					title: '--no-open',
					description:
						'Start the server without opening a browser window — useful for CI/headless environments',
				},
			],
		},
		{
			title: 'API Testing',
			icon: '◆',
			items: [
				{
					title: 'HTTP Methods',
					description:
						'Full support for GET, POST, PUT, PATCH, DELETE, OPTIONS, and HEAD',
				},
				{
					title: 'Request Builder',
					description:
						'Visual editor for headers, query params, body (JSON / Form Data / Raw), and auth tokens',
				},
				{
					title: 'Response Inspector',
					description:
						'Syntax-highlighted response viewer with timing breakdowns, headers, and status codes',
				},
				{
					title: 'Collections',
					description:
						'Organize requests into nested collections with drag-and-drop reordering',
				},
			],
		},
		{
			title: 'Authentication',
			icon: '⛋',
			items: [
				{
					title: 'Better Auth',
					description:
						'Built-in email/password authentication powered by Better Auth with session management',
				},
				{
					title: 'Organizations',
					description:
						'Multi-tenant workspace support — invite team members and manage access per organization',
				},
				{
					title: 'Request Auth',
					description:
						'Bearer tokens, Basic Auth, API Key (header or query), with OAuth 2.0 coming soon',
				},
			],
		},
		{
			title: 'Tunneling',
			icon: '◎',
			items: [
				{
					title: 'Adapter System',
					description:
						'Pluggable tunnel adapters for exposing local servers to the internet',
				},
				{
					title: 'BYOK',
					description:
						'Bring Your Own Key — use your ngrok, Cloudflare, or outray.dev credentials',
				},
				{
					title: 'Custom Adapters',
					description:
						'Implement the TunnelAdapter interface to use any tunneling provider',
				},
			],
		},
		{
			title: '@abysslabs/sdk',
			icon: '◈',
			items: [
				{
					title: 'Programmatic Testing',
					description:
						'Coming Soon: A powerful SDK for writing API tests in TypeScript',
				},
				{
					title: 'CI/CD Integration',
					description:
						'Coming Soon: Run Abyss collections in GitHub Actions, GitLab CI, or any CI pipeline',
				},
			],
		},
		{
			title: 'Environment & Variables',
			icon: '⬡',
			items: [
				{
					title: 'Environment Variables',
					description:
						'Define and switch between dev, staging, and production variable sets',
				},
				{
					title: 'Dynamic Interpolation',
					description:
						'Use {{variables}} in URLs, headers, query params, and request bodies',
				},
				{
					title: 'Import & Export',
					description:
						'Import collections from Postman/Insomnia, export as JSON or cURL',
				},
			],
		},
	];

	const activeContent =
		docSections.find((s) => s.title === activeSection) || docSections[0];

	return (
		<div className="docs-page bg-abyss-950 min-h-screen pt-20">
			<div className="container mx-auto px-6 max-w-7xl">
				<div className="flex flex-col lg:flex-row gap-12">
					{/* Sidebar */}
					<aside className="lg:w-64 shrink-0">
						<div className="sticky top-24">
							<div className="mb-8">
								<h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
									Documentation
								</h4>
								<nav className="flex flex-col gap-1">
									{docSections.map((section) => (
										<button
											type="button"
											key={section.title}
											onClick={() => setActiveSection(section.title)}
											className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all text-left group ${
												activeSection === section.title
													? 'bg-white/10 text-white'
													: 'text-gray-400 hover:bg-white/5 hover:text-white'
											}`}
										>
											<span className="flex items-center gap-3">
												<span
													className={`w-5 text-center ${activeSection === section.title ? 'text-neon-cyan' : 'opacity-70'}`}
												>
													{section.icon}
												</span>
												{section.title}
											</span>
											{activeSection === section.title && (
												<motion.div
													layoutId="activeDot"
													className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
												/>
											)}
										</button>
									))}
								</nav>
							</div>

							<div>
								<h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
									Resources
								</h4>
								<nav className="flex flex-col gap-1">
									<a
										href="https://github.com/ajoralabs/abyss"
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
									>
										<ExternalLink size={16} />
										GitHub
									</a>
								</nav>
							</div>
						</div>
					</aside>

					{/* Main Content */}
					<main className="flex-1 min-w-0 pb-24">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeSection}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
							>
								<div className="flex items-center gap-4 mb-8">
									<div className="w-12 h-12 rounded-xl bg-linear-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center text-2xl text-neon-cyan">
										{activeContent.icon}
									</div>
									<div>
										<h1 className="text-3xl font-bold text-white mb-2">
											{activeContent.title}
										</h1>
										<p className="text-gray-400">
											Section details and usage guide.
										</p>
									</div>
								</div>

								{/* Install Tabs (Only for Getting Started) */}
								{activeSection === 'Getting Started' && (
									<div className="mb-12 bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1">
										<div className="flex gap-1 border-b border-white/5 px-2 pb-2 mb-4">
											{(['bun', 'npm', 'pnpm', 'brew'] as const).map((pm) => (
												<button
													type="button"
													key={pm}
													className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
														activePm === pm
															? 'bg-white/10 text-white'
															: 'text-gray-400 hover:text-white'
													}`}
													onClick={() => setActivePm(pm)}
												>
													{pm}
												</button>
											))}
										</div>
										<div className="px-4 pb-4">
											<div className="font-mono text-sm">
												<span className="text-gray-500">$</span>{' '}
												<span className="text-neon-cyan">
													{installCommands[activePm].cli}
												</span>
											</div>
										</div>
									</div>
								)}

								<div className="grid gap-6">
									{activeContent.items.map((item) => (
										<div
											key={item.title}
											className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
										>
											<h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
												{item.title}
											</h3>
											<p className="text-gray-400 mb-4 leading-relaxed">
												{item.description}
											</p>
											{item.code && (
												<div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-neon-cyan/90 border border-white/5 flex justify-between items-center group/code">
													{item.code}
												</div>
											)}
										</div>
									))}
								</div>
							</motion.div>
						</AnimatePresence>
					</main>
				</div>
			</div>
		</div>
	);
}
