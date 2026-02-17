import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Terminal, Box } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const UserStory = () => {
  const container = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current || !container.current || !visualsRef.current) return;

    // Text Reveal
    const chars = textRef.current.querySelectorAll('.story-char');
    gsap.fromTo(chars,
      { opacity: 0.1, filter: 'blur(5px)', y: 10 },
      {
        opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.05,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 1,
        }
      }
    );

    // Visual Timeline Animation
    const Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: visualsRef.current,
        start: 'top 70%',
        end: 'bottom 70%',
        scrub: 1,
      }
    });

    Timeline
      .fromTo('.step-1', { opacity: 0.2, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 })
      .to('.connector-1', { height: '40px', opacity: 1, duration: 0.5 })
      .fromTo('.step-2', { opacity: 0.2, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 })
      .to('.connector-2', { height: '40px', opacity: 1, duration: 0.5 })
      .fromTo('.step-3', { opacity: 0.2, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 });

  }, { scope: container });

  const storyText = "It starts with a localhost request. It ends with a production SDK. No login walls in between.";

  return (
    <section ref={container} className="py-40 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          {/* Narrative Text */}
          <div className="lg:w-1/2">
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-bold uppercase tracking-widest">
              The Full Cycle
            </div>
            <h2 ref={textRef} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-12">
              {storyText.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-[0.25em] story-char">
                  {word}
                </span>
              ))}
            </h2>
            <p className="text-xl text-gray-400 max-w-md">
              From the first <code className="text-white bg-white/10 px-1 rounded">GET /</code> to shipping client libraries in Swift, Kotlin, and TS. We power the entire journey.
            </p>
          </div>

          {/* Visual Progression */}
          <div ref={visualsRef} className="lg:w-1/2 relative flex flex-col items-center">

            {/* Step 1: Local */}
            <div className="step-1 w-full glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Terminal size={24} />
              </div>
              <div className="font-mono text-sm">
                <div className="text-gray-500">// Local Development</div>
                <div className="text-white">localhost:3000/api/users</div>
                <div className="text-green-400 text-xs mt-1">200 OK • 2ms</div>
              </div>
            </div>

            {/* Connector */}
            <div className="connector-1 w-0.5 bg-gradient-to-b from-blue-500/50 to-pink-500/50 h-0 opacity-0" />

            {/* Step 2: Tunnel */}
            <div className="step-2 w-full glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                <Globe size={24} />
              </div>
              <div className="font-mono text-sm">
                <div className="text-gray-500">// Smart Tunnel (via Outray)</div>
                <div className="text-white">https://hummingbird.outray.dev/vf...</div>
                <div className="text-pink-400 text-xs mt-1">Coming Soon • Public Access</div>
              </div>
            </div>

            {/* Connector */}
            <div className="connector-2 w-0.5 bg-gradient-to-b from-pink-500/50 to-orange-500/50 h-0 opacity-0" />

            {/* Step 3: SDK */}
            <div className="step-3 w-full glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <Box size={24} />
              </div>
              <div className="font-mono text-sm">
                <div className="text-gray-500">// Generated SDK</div>
                <div className="text-white">import &#123; Client &#125; from '@api/client'</div>
                <div className="text-orange-400 text-xs mt-1">TypeScript • Type-Safe</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
