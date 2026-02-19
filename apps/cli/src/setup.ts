import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import prompts from 'prompts';
import chalk from 'chalk';

const CONFIG_PATH = join(homedir(), '.abyssrc');

interface AbyssConfig {
	mode: 'local' | 'cloud';
	onboarded: boolean;
}

export async function runSetup(): Promise<AbyssConfig> {
	// Check if config exists
	if (existsSync(CONFIG_PATH)) {
		try {
			const content = readFileSync(CONFIG_PATH, 'utf-8');
			const config = JSON.parse(content);
			// Simple validation
			if (config?.mode) {
				return config as AbyssConfig;
			}
		} catch {
			// Invalid config, ignore and re-run setup
		}
	}

	// Interactive Setup
	console.log(
		chalk.cyan.bold("\n✨ Welcome to Abyss! Let's get you set up.\n"),
	);

	const response = await prompts({
		type: 'select',
		name: 'mode',
		message: 'How would you like to use Abyss?',
		choices: [
			{
				title: 'Local First (Offline, Private)',
				value: 'local',
				description: 'All data stays on your machine. No account required.',
			},
			{
				title: 'Cloud Sync (Coming Soon)',
				value: 'cloud',
				description: 'Sync history & collections across devices.',
			},
		],
		initial: 0,
	});

	// Handle cancellation (Ctrl+C during prompt)
	if (!response.mode) {
		console.log(chalk.yellow('\nSetup skipped. Defaulting to Local mode.'));
		return { mode: 'local', onboarded: false };
	}

	if (response.mode === 'cloud') {
		console.log(chalk.yellow('\n⚠️  Cloud Sync is currently in development.'));
		console.log(
			chalk.dim(
				'We have noted your preference. Proceeding in Local Mode for now.\n',
			),
		);
	} else {
		console.log(
			chalk.green('\n✔  Local Mode selected. Your data is private.\n'),
		);
	}

	const config: AbyssConfig = {
		mode: response.mode,
		onboarded: true,
	};

	try {
		writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
		// console.log(chalk.dim('Configuration saved to ~/.abyssrc'));
	} catch (err) {
		console.warn(chalk.red('Failed to save configuration.'), err);
	}

	return config;
}
