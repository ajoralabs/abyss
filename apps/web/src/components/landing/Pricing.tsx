import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check, Star } from 'lucide-react';

export const Pricing = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.pricing-card', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        scrollTrigger: {
          trigger: container.current,
          start: 'top 70%',
        },
      });
    },
    { scope: container },
  );

  const tiers = [
    {
      name: 'Pelagic',
      price: 'Free',
      description: 'Forever free for local development.',
      features: [
        'Unlimited Local Collections',
        'No File Upload Limits',
        'Run Locally (No Cloud)',
        'Community Support',
      ],
      highlight: false,
    },
    {
      name: 'Abyssal',
      price: '$19',
      period: '/mo',
      description: 'For professionals needing power.',
      features: [
        'Cloud Workspace Sync',
        'Smart Tunneling (Custom Domains)',
        'AI Doc Generation',
        'Team Sync (P2P encrypted)',
      ],
      highlight: true,
      glowColor: 'shadow-[0_0_50px_-10px_rgba(0,240,255,0.3)] border-neon-cyan/50',
    },
    {
      name: 'Hadal',
      price: '$49',
      period: '/seat',
      description: 'For teams and organizations.',
      features: ['Shared Workspaces', 'SSO & RBAC', 'Audit Log Retention', 'Priority Support'],
      highlight: false,
    },
  ];

  return (
    <section ref={container} className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Depth</h2>
          <p className="text-xl text-gray-400">Fair pricing. No per-request limits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`pricing-card relative p-8 rounded-3xl border backdrop-blur-md flex flex-col ${tier.highlight ? `bg-abyss-900/80 ${tier.glowColor}` : 'bg-white/5 border-white/10 hover:border-white/20'}`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon-cyan text-abyss-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <Star size={12} fill="currentColor" /> Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 ${tier.highlight ? 'text-neon-cyan' : 'text-white'}`}
                >
                  {tier.name}
                </h3>
                <p className="text-gray-400 text-sm h-10">{tier.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-gray-500">{tier.period}</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check
                      size={16}
                      className={`mt-0.5 ${tier.highlight ? 'text-neon-cyan' : 'text-gray-500'}`}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`w-full py-4 rounded-xl font-bold transition-all ${tier.highlight ? 'bg-neon-cyan text-abyss-950 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {tier.highlight ? 'Upgrade to Pro' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
