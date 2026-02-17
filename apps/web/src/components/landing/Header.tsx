import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', to: '/features' },
    { name: 'Pricing', to: '/' }, // Anchor links would be better but keeping simple for now
    { name: 'Roadmap', to: '/' },
    { name: 'Docs', to: '/docs' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-abyss-950/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-electric-violet flex items-center justify-center text-abyss-950">
              <Zap size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
            </div> */}
            <img src="/logo.png" alt="VoidFlux" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-xl tracking-tight text-white">VoidFlux</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/your-username/postman-alt"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/5 hover:border-white/10">
              Download v1.0
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-abyss-950/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-2xl font-bold text-white py-4 border-b border-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex justify-center gap-6 mt-8">
                <a href="#" className="flex items-center gap-2 text-gray-400">
                  <Github size={24} />
                  GitHub
                </a>
              </div>
              <button className="mt-4 w-full py-4 rounded-xl bg-neon-cyan text-abyss-950 font-bold text-lg">
                Download for macOS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
