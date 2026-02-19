import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Server } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/admin/')({
	component: AdminPage,
});

function AdminPage() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-white">
					Platform Administration
				</h1>
				<p className="text-gray-400">Manage Abyss instance and users.</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">10,482</div>
						<p className="text-xs text-muted-foreground">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Tunnels
						</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+573</div>
						<p className="text-xs text-muted-foreground">
							+201 since last hour
						</p>
					</CardContent>
				</Card>
				<Card className="bg-white/5 border-white/10 text-white">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Server Status</CardTitle>
						<Server className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-neon-cyan">Healthy</div>
						<p className="text-xs text-muted-foreground">Uptime 99.99%</p>
					</CardContent>
				</Card>
			</div>

			<div className="rounded-xl border border-white/10 bg-white/5 p-6">
				<h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0"
						>
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan text-xs font-bold">
									UD
								</div>
								<div>
									<p className="text-sm font-medium text-white">
										User deployed new Mock Server
									</p>
									<p className="text-xs text-gray-400">2 minutes ago</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
