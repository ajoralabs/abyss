import { defineCommand } from 'citty';
import prompts from 'prompts';
import chalk from 'chalk';
import { updateConfig, loadConfig } from '../config';

export default defineCommand({
	meta: {
		name: 'login',
		description: 'Authenticate with Abyss Cloud',
	},
	async run() {
		const config = loadConfig();
		if (config?.token) {
			console.log(
				chalk.yellow(
					'You are already logged in. Run `abyss logout` to sign out.',
				),
			);
			return;
		}

		console.log(
			chalk.cyan(
				'To login, please generate a Personal Access Token from your dashboard.',
			),
		);

		const response = await prompts({
			type: 'password',
			name: 'token',
			message: 'Paste your Personal Access Token:',
			validate: (value) => (value.length < 10 ? 'Token seems too short' : true),
		});

		if (!response.token) {
			console.log(chalk.yellow('Login cancelled.'));
			return;
		}

		updateConfig({ token: response.token, mode: 'cloud' });
		console.log(
			chalk.green('\nSuccessfully logged in! Cloud Sync enabled. 🚀'),
		);
	},
});
