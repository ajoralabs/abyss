import { defineCommand } from 'citty';
import { openBrowser } from '../open-browser';
import { startServer } from '../server';
import { runSetup } from '../setup';
import gradient from 'gradient-string';
import boxen from 'boxen';
import ora from 'ora';
import chalk from 'chalk';
import pkg from '../../package.json';

export default defineCommand({
	meta: {
		name: 'dev',
		description: 'Start Abyss (GUI + Proxy)',
	},
	args: {
		port: {
			type: 'string',
			description: 'Port to serve the GUI on',
			default: '4567',
		},
		'no-open': {
			type: 'boolean',
			description: 'Skip opening the browser automatically',
			default: false,
		},
	},
	async run({ args }) {
		const port = Number.parseInt(args.port, 10);

		// Abyss Theme Gradient
		const abyssGradient = gradient(['#00F0FF', '#7B2CFF']);

		// ASCII Art Logo
		const logo = `
 ██ ▗██   ███▄ ▄███▓ ██▓▓█████▄   █████▒██▓    █    ██  ▒██   ██▒
▓██░ ██▓  ▓██▒▀█▀ ██▒▓██▒▒██▀ ██▌▓██   ▒▓██▒    ██  ▓██▒▒▒ █ █ ▒░
▒██▀▀██░  ▓██    ▓██░▒██▒░██   █▌▒████ ░▒██░   ▓██  ▒██░░░  █   ░
░▓█ ░██   ▒██    ▒██ ░██░░▓█▄   ▌░▓█▒  ░▒██░   ▓▓█  ░██░ ░ █ █ ▒ 
░▓█▒░██▓  ▒██▒   ░██▒░██░░▒████▓ ░▒█░   ░██████▒▒█████▓ ▒██▒ ▒██▒
 ▒ ░░▒░▒  ░ ▒░   ░  ░░▓   ▒▒▓  ▒  ▒ ░   ░ ▒░▓  ░▒▓▒ ▒ ▒ ▒▒ ░ ░▓ ░
 ▒ ░▒░ ░  ░  ░      ░ ▒ ░ ░ ▒  ▒  ░     ░ ░ ▒  ░░▒░ ░ ░ ░░   ░▒ ░
 ░  ░░ ░  ░      ░    ▒ ░ ░ ░  ░  ░ ░     ░ ░   ░░░ ░ ░  ░    ░  
 ░  ░  ░         ░    ░     ░               ░  ░    ░      ░    ░  
                          ░                                      
    `;

		// Render Boxed Startup Banner
		console.log(
			boxen(
				abyssGradient(logo) +
					'\n\n' +
					chalk.cyan(`System Online • v${pkg.version}`),
				{
					padding: 1,
					margin: 1,
					borderStyle: 'round',
					borderColor: 'cyan',
					float: 'center',
				},
			),
		);

		await runSetup();

		const spinner = ora({
			text: chalk.dim('Initializing Quantum Tunnel...'),
			color: 'cyan',
			spinner: 'dots12', // Sci-fi style spinner
		}).start();

		try {
			const { url } = await startServer(port);

			// Simulate slight delay for effect (can remove later if annoying)
			await new Promise((r) => setTimeout(r, 800));

			spinner.succeed(chalk.green(`Interface Active at ${chalk.bold(url)}`));

			if (!args['no-open']) {
				spinner.text = chalk.dim('Launching Visual Interface...');
				await openBrowser(url);
				spinner.succeed(chalk.blue('Visual Interface Launched'));
			}

			console.log(
				'\n' + chalk.dim('Press Ctrl+C to disconnect from the Void.'),
			);
		} catch (err) {
			spinner.fail(chalk.red('Initialization Failed'));
			console.error(err);
			process.exit(1);
		}
	},
});
