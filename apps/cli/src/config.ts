import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import chalk from 'chalk';

export const CONFIG_PATH = join(homedir(), '.voidfluxrc');

export interface VoidfluxConfig {
	mode: 'local' | 'cloud';
	onboarded: boolean;
	token?: string;
}

export function loadConfig(): VoidfluxConfig | null {
	if (!existsSync(CONFIG_PATH)) {
		return null;
	}
	try {
		const content = readFileSync(CONFIG_PATH, 'utf-8');
		const config = JSON.parse(content);
		return config;
	} catch (err) {
		return null;
	}
}

export function saveConfig(config: VoidfluxConfig): void {
	try {
		writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch (err) {
		console.error(chalk.red('Failed to save configuration.'), err);
	}
}

export function updateConfig(updates: Partial<VoidfluxConfig>): VoidfluxConfig {
	const current = loadConfig() || { mode: 'local', onboarded: false };
	const newConfig = { ...current, ...updates };
	saveConfig(newConfig);
	return newConfig;
}
