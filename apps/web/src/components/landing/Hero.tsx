import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Code2, Globe, Activity } from 'lucide-react';
import { Link } from '@tanstack/react-router';

gsap.registerPlugin(useGSAP);

export const Hero = () => {
	const container = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subRef = useRef<HTMLParagraphElement>(null);
	const visualRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

			// Chaotic text reveal
			const chars = titleRef.current?.querySelectorAll('.char');
			if (chars) {
				tl.to(chars, {
					y: 0,
					opacity: 1,
					stagger: 0.02,
					duration: 1.2,
					ease: 'power4.out',
				});
			}

			tl.fromTo(
				subRef.current,
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.8 },
				'-=0.6',
			);

			tl.fromTo(
				'.hero-actions > *',
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, stagger: 0.1, duration: 0.8 },
				'-=0.6',
			);

			// Visual Reveal
			tl.fromTo(
				visualRef.current,
				{ opacity: 0, x: 50, rotationY: 20 },
				{ opacity: 1, x: 0, rotationY: -10, duration: 1.5, ease: 'power2.out' },
				'-=1',
			);

			// Ambient float for platform icons
			gsap.to('.platform-icon', {
				y: -10,
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				stagger: {
					each: 0.5,
					from: 'random',
				},
			});

			// Ambient float for Visual
			gsap.to(visualRef.current, {
				y: -20,
				rotationY: -5,
				duration: 6,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});
		},
		{ scope: container },
	);

	return (
		<section
			ref={container}
			className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden pt-20"
		>
			{/* Background Atmosphere */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<img
					src="/branding/hero-bg.png"
					alt="Abyss Atmosphere"
					className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
				/>
				<div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-neon-cyan/5 blur-[120px] animate-pulse-slow" />
				<div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-electric-violet/5 blur-[120px] animate-pulse-slow delay-1000" />
			</div>

			<div className="container mx-auto z-10 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Content Side */}
				<div className="flex flex-col justify-center">
					{/* Massive Kinetic Typography */}
					<h1
						ref={titleRef}
						className="text-[10vw] lg:text-[7vw] leading-[0.9] font-bold tracking-tighter text-white mb-8 select-none"
					>
						{'ABYSS'.split('').map((char, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Splitting text requires index keys
							<span key={`${char}-${i}`} className="char inline-block">
								{char}
							</span>
						))}
					</h1>

					<p
						ref={subRef}
						className="text-lg md:text-xl text-gray-400 font-light max-w-xl leading-relaxed"
					>
						The native API client for the post-cloud era.{' '}
						<span className="text-white font-medium">Local-first.</span>
						<br />
						<span className="text-neon-cyan/80 font-medium">
							Tunneling (Coming Soon).
						</span>{' '}
						<span className="text-electric-violet/80 font-medium">
							@abysslabs/sdk (Coming Soon).
						</span>
					</p>
					<div className="hero-actions flex flex-col items-start gap-8">
						<div className="flex gap-4 items-center">
							<Link
								to="/docs"
								className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-none hover:bg-neon-cyan transition-colors flex items-center gap-4 overflow-hidden clip-path-slant"
							>
								<span className="relative z-10">Get Started</span>
								<ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
								<div className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
							</Link>

							<a
								href="https://github.com/ajoralabs/abyss"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center"
							>
								<img
									src="https://img.shields.io/github/stars/ajoralabs/abyss?style=social&label=Star&color=1a1b26"
									alt="GitHub stars"
									className="h-7"
								/>
							</a>
						</div>

						{/* Platform Availability */}
						<div className="flex items-center gap-6 text-gray-500 font-mono text-sm">
							<div
								className="flex items-center gap-2 platform-icon hover:text-white transition-colors cursor-help"
								title="Abyss SDK — Coming Soon"
							>
								<Code2 size={18} />
								<span>@abysslabs/sdk</span>
							</div>
						</div>
					</div>
				</div>

				{/* Abstract Visual Side - Reintroducing Image/Component */}
				<div
					ref={visualRef}
					className="relative hidden lg:block h-[600px] perspective-1000"
				>
					<div className="relative w-full h-full transform-style-3d rotate-y-[-10deg] rotate-x-[5deg]">
						{/* Main Glass Panel */}
						<div className="absolute inset-0 bg-abyss-950/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden group">
							{/* Header Bar */}
							<div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
								<div className="flex gap-2">
									<div className="w-3 h-3 rounded-full bg-red-500/50" />
									<div className="w-3 h-3 rounded-full bg-yellow-500/50" />
									<div className="w-3 h-3 rounded-full bg-green-500/50" />
								</div>
								<div className="flex-1 text-center font-mono text-xs text-gray-500">
									api.abyss.dev
								</div>
							</div>

							{/* Interface Mock */}
							<div className="p-6 font-mono text-sm relative">
								<div className="flex gap-4 text-neon-cyan mb-4">
									<span>POST</span>
									<span className="text-white">/v1/quantum/tunnel</span>
								</div>
								<div className="space-y-2 text-gray-400">
									<div className="flex justify-between border-b border-white/5 py-2">
										<span>Content-Type</span>
										<span className="text-electric-violet">
											application/json
										</span>
									</div>
									<div className="flex justify-between border-b border-white/5 py-2">
										<span>Authorization</span>
										<span className="text-electric-violet">Bearer vf_...</span>
									</div>
								</div>
								<div className="mt-8 p-4 bg-black/20 rounded border border-white/5 text-xs leading-relaxed">
									<span className="text-gray-500">{'// Payload'}</span>
									<br />
									<span className="text-yellow-400">{'{'}</span>
									<br />
									&nbsp;&nbsp;<span className="text-blue-400">"tunnel_id"</span>
									: <span className="text-green-400">"vf_8x92m"</span>,<br />
									&nbsp;&nbsp;<span className="text-blue-400">"region"</span>:{' '}
									<span className="text-green-400">"us-east-1"</span>,<br />
									&nbsp;&nbsp;<span className="text-blue-400">"encrypted"</span>
									: <span className="text-pink-400">true</span>
									<br />
									<span className="text-yellow-400">{'}'}</span>
								</div>

								<div className="absolute bottom-6 right-6">
									<div className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded text-xs flex items-center gap-2">
										<div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
										Connected
									</div>
								</div>
							</div>

							{/* Scanline Effect */}
							<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-scan pointer-events-none" />
						</div>

						{/* Floating Fragments */}
						<div className="absolute -right-10 top-20 w-40 p-4 bg-abyss-950/60 backdrop-blur-md border border-white/10 rounded-xl shadow-xl transform translate-z-20 animate-float-delayed">
							<div className="flex items-center gap-3">
								<Activity size={20} className="text-green-400" />
								<div>
									<div className="text-xs text-gray-400">Latency</div>
									<div className="text-lg font-bold text-white">4ms</div>
								</div>
							</div>
						</div>

						<div className="absolute -left-10 bottom-40 w-40 p-4 bg-abyss-950/60 backdrop-blur-md border border-white/10 rounded-xl shadow-xl transform translate-z-10 animate-float">
							<div className="flex items-center gap-3">
								<Globe size={20} className="text-pink-400" />
								<div>
									<div className="text-xs text-gray-400">Uptime</div>
									<div className="text-lg font-bold text-white">99.9%</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Decorative Grid Lines */}
			<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
			<div className="absolute top-0 right-20 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />

			<style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .translate-z-10 { transform: translateZ(20px); }
                .translate-z-20 { transform: translateZ(40px); }
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(1000%); }
                }
                .animate-scan { animation: scan 3s linear infinite; }
            `}</style>
		</section>
	);
};
