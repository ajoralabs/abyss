import { defineCommand } from 'citty';
import chalk from 'chalk';
import { loadConfig } from '../config';

export default defineCommand({
	meta: {
		name: 'whoami',
		description: 'Show current session status',
	},
	async run() {
		const config = loadConfig();
		if (!config?.token) {
			console.log(
				chalk.gray('Status: ') +
					chalk.red('Not Logged In') +
					chalk.dim(' (Local Mode)'),
			);
			return;
		}

		console.log(
			chalk.gray('Status: ') +
				chalk.green('Logged In') +
				chalk.dim(' (Cloud Mode)'),
		);
		// In a real app, verify token with API.
		console.log(chalk.dim(`Token: ${config.token.slice(0, 6)}...`));
	},
});
