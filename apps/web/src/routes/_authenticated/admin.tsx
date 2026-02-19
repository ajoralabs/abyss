import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_authenticated/admin')({
	beforeLoad: async ({ context }) => {
		const { data: session } = await authClient.getSession();

		// RBAC Check: Enforce 'admin' role
		if (!session || session.user.role !== 'admin') {
			throw redirect({
				to: '/login',
				search: {
					// Use location.href if available on client, otherwise default to '/' for server-side
					redirect: typeof location !== 'undefined' ? location.href : '/',
				},
			});
		}
	},
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<div className="w-full">
			<Outlet />
		</div>
	);
}
