import { Github, MessageCircle, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-abyss-950 pt-40 pb-20 overflow-hidden">
      {/* Giant Watermark */}
      <h1 className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[15vw] font-bold text-white/5 leading-none tracking-tighter pointer-events-none whitespace-nowrap select-none">
        VOIDFLUX
      </h1>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-32">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-8">
              Open source software needs better design. <br />
              <span className="text-gray-500">We're starting here.</span>
            </h2>
            <div className="flex gap-4">
              <a href="#" className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300">
                <Github size={20} />
                <span>Star on GitHub</span>
              </a>
              <a href="#" className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-discord hover:text-discord transition-all duration-300 hover:bg-[#5865F2]/10">
                <MessageCircle size={20} />
                <span>Join Discord</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-20">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Navigation</h3>
              <ul className="space-y-4">
                {['Features', 'Download', 'Changelog', 'Roadmap'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xl text-gray-300 hover:text-neon-cyan transition-colors flex items-center gap-2 group">
                      {item}
                      <ArrowUpRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Legal</h3>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'License'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xl text-gray-300 hover:text-neon-cyan transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-white/10 pt-10">
          <div className="text-sm text-gray-500">
            © 2026 VoidFlux. <br />
            Designed with <span className="text-red-500">♥</span> and <span className="text-neon-cyan">GSAP</span>.
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Current Version</p>
            <p className="font-mono text-white">v1.2.4-beta</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
