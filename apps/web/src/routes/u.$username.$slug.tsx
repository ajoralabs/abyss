import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/u/$username/$slug')({
	component: PublicDocsPage,
	loader: async ({ params }) => {
		// Mock fetching data
		return {
			username: params.username,
			projectSlug: params.slug,
			title: `${params.slug} API Documentation`,
			version: '1.0.0',
			description: `Public API documentation for ${params.slug} by ${params.username}.`,
		};
	},
});

function PublicDocsPage() {
	const data = Route.useLoaderData();
	const [activeSection, setActiveSection] = useState('Introduction');

	// Mock sections
	const sections = [
		{ title: 'Introduction', content: 'Welcome to the documentation.' },
		{ title: 'Authentication', content: 'How to authenticate requests.' },
		{ title: 'Endpoints', content: 'List of available endpoints.' },
	];

	return (
		<div className="min-h-screen bg-abyss-950 text-white pt-20">
			<div className="container mx-auto px-6 max-w-7xl">
				{/* Header */}
				<div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
					<div>
						<div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
							<span>{data.username}</span>
							<ChevronRight className="h-4 w-4" />
							<span className="text-white">{data.projectSlug}</span>
						</div>
						<h1 className="text-4xl font-bold">{data.title}</h1>
						<p className="text-gray-400 mt-2">{data.description}</p>
					</div>
					<div className="flex gap-3">
						<Button
							variant="outline"
							className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
						>
							<Share2 className="mr-2 h-4 w-4" /> Share
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					<aside className="lg:col-span-1">
						<nav className="space-y-1">
							{sections.map((section) => (
								<button
									type="button"
									key={section.title}
									onClick={() => setActiveSection(section.title)}
									className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === section.title ? 'bg-neon-cyan/10 text-neon-cyan font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
								>
									{section.title}
								</button>
							))}
						</nav>
					</aside>

					{/* Content */}
					<main className="lg:col-span-3 min-h-[500px]">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeSection}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="prose prose-invert max-w-none"
							>
								<h2>{activeSection}</h2>
								<p>
									{sections.find((s) => s.title === activeSection)?.content}
								</p>

								{/* Mock API visualizer */}
								<div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-4">
									<div className="flex items-center gap-4 mb-4">
										<span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
											GET
										</span>
										<code className="text-sm font-mono">/api/v1/users</code>
									</div>
									<p className="text-sm text-gray-400">
										Returns a list of users.
									</p>
								</div>
							</motion.div>
						</AnimatePresence>
					</main>
				</div>
			</div>
		</div>
	);
}
