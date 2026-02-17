#!/usr/bin/env bun
import { defineCommand, runMain } from 'citty';
import pkg from '../package.json';
import devCommand from './commands/dev';

const SUB_COMMANDS = ['login', 'logout', 'whoami', 'dev'] as const;

const main = defineCommand({
	meta: {
		name: 'voidflux',
		version: pkg.version,
		description: 'VoidFlux — API testing from your terminal',
	},
	subCommands: {
		login: () => import('./commands/login').then((r) => r.default),
		logout: () => import('./commands/logout').then((r) => r.default),
		whoami: () => import('./commands/whoami').then((r) => r.default),
		dev: () => import('./commands/dev').then((r) => r.default),
	},
	// Inherit args from dev command so bare 'voidflux --port 3000' works
	args: devCommand.args,
	async run(ctx) {
		// When a subcommand is specified (e.g. `voidflux dev`), citty calls
		// both this root run() AND the subcommand's run(). Skip the root
		// execution in that case to avoid starting the server twice.
		const hasSubCommand = SUB_COMMANDS.some((cmd) =>
			process.argv.includes(cmd),
		);
		if (hasSubCommand) return;

		// Default behavior: bare `voidflux` starts the dev server
		if (devCommand.run) {
			return devCommand.run(
				ctx as unknown as Parameters<typeof devCommand.run>[0],
			);
		}
	},
});

runMain(main);
