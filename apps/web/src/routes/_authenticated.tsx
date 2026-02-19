import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ context }) => {
		const { data: session } = await authClient.getSession();
		if (!session) {
			throw redirect({
				to: '/login',
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<div className="min-h-screen bg-abyss-950 text-white">
			<nav className="border-b border-white/10 bg-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
				<span className="font-bold text-lg">Abyss Dashboard</span>
				<div className="flex gap-4 items-center">
					<button
					type='button'
						onClick={async () => {
							await authClient.signOut();
							window.location.href = '/login';
						}}
						className="text-sm text-gray-400 hover:text-white transition-colors"
					>
						Sign Out
					</button>
				</div>
			</nav>
			<main className="p-6 container mx-auto max-w-7xl">
				<Outlet />
			</main>
		</div>
	);
}
