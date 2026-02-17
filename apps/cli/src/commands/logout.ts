import { defineCommand } from 'citty';
import chalk from 'chalk';
import { updateConfig, loadConfig } from '../config';

export default defineCommand({
	meta: {
		name: 'logout',
		description: 'Sign out and disable Cloud Sync',
	},
	async run() {
		const config = loadConfig();
		if (!config?.token) {
			console.log(chalk.yellow('You are not logged in.'));
			return;
		}

		updateConfig({ token: undefined, mode: 'local' });
		console.log(
			chalk.green('Logged out successfully. Switched to Local mode. 🔒'),
		);
	},
});
