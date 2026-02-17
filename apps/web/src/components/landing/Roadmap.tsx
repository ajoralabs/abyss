import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Smartphone, Monitor, Globe, Clock } from 'lucide-react';

export const Roadmap = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 70%',
        },
      });

      tl.fromTo(
        '.roadmap-line-progress',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power2.out' },
      );

      tl.from(
        '.roadmap-item',
        {
          y: 50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'back.out(1.7)',
        },
        '-=1',
      );
    },
    { scope: container },
  );

  const milestones = [
    {
      icon: Monitor,
      title: 'Native & Protocols',
      date: 'Q3 2026',
      desc: 'Windows/Linux builds. WebSocket, GraphQL, and gRPC support. Email testing sandbox.',
      status: 'In Development',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
    },
    {
      icon: Smartphone,
      title: 'AI & Security Core',
      date: 'Q4 2026',
      desc: 'OpenRouter & Ollama support. Nuclei pentesting integration. Auto-generated test scripts.',
      status: 'Planning',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/20',
    },
    {
      icon: Globe,
      title: 'The Ecosystem',
      date: '2027',
      desc: 'Headless CI/CD runners. Marketplace for plugins, themes, and community collections.',
      status: 'Concept',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20',
    },
  ];

  return (
    <section ref={container} className="py-32 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 50 Q 25 20, 50 50 T 100 50" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0 30 Q 25 60, 50 30 T 100 30" stroke="white" strokeWidth="0.2" fill="none" />
          <path d="M0 70 Q 25 40, 50 70 T 100 70" stroke="white" strokeWidth="0.2" fill="none" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Expansion Plan</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            VoidFlux CLI is available everywhere today. Native desktop performance is coming next.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line/Track */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden md:block rounded-full" />
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 -translate-y-1/2 hidden md:block rounded-full origin-left roadmap-line-progress" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {milestones.map((item, i) => (
              <div key={i} className="roadmap-item relative group">
                {/* Timeline Dot (Desktop) */}
                <div
                  className={`hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-abyss-950 border-4 border-abyss-950 items-center justify-center z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
                >
                  <div className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                </div>

                {/* Card */}
                <div
                  className={`p-8 rounded-2xl glass-panel border ${item.border} hover:border-opacity-50 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden md:mt-16`}
                >
                  <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                    <item.icon size={100} />
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mb-6`}
                    >
                      <item.icon size={28} className={item.color} />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${item.bg} ${item.color} border ${item.border}`}
                      >
                        {item.status}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-mono text-gray-500">
                        <Clock size={12} /> {item.date}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
