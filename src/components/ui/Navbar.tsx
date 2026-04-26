import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Layout';

export function Navbar({ onOpenResume }: { onOpenResume: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const ThemeIcon = () => {
    if (theme === 'dark') return <Moon size={18} className="text-zinc-400" />;
    if (theme === 'neon') return <Sparkles size={18} className="text-[#00ff9f]" />;
    return <Sun size={18} className="text-orange-500" />;
  };

  const themeLabel = theme === 'light' ? 'Switch to Dark' : theme === 'dark' ? 'Switch to Neon' : 'Switch to Light';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-4 bg-white/90 dark:bg-zinc-950/90 neon:bg-black/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 neon:border-[#00ff9f]/20 shadow-sm'
          : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold tracking-tighter text-black dark:text-white neon:text-[#00ff9f]"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Nischal<span className="text-blue-600 neon:text-[#00ff9f]">.</span>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-500 dark:text-zinc-400 neon:text-[#00ff9f]/60 hover:text-black dark:hover:text-white neon:hover:text-[#00ff9f] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 neon:bg-[#00ff9f] transition-all group-hover:w-full" />
            </a>
          ))}
          <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 neon:bg-[#00ff9f]/20 mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            title={themeLabel}
            className="w-10 h-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 neon:hover:bg-[#00ff9f]/10 neon:text-[#00ff9f]"
          >
            <ThemeIcon />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenResume}
            className="px-4 py-1.5 bg-black dark:bg-white neon:bg-[#00ff9f] text-white dark:text-zinc-950 neon:text-black text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            Resume
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            title={themeLabel}
            className="w-10 h-10 p-0 rounded-full neon:text-[#00ff9f]"
          >
            <ThemeIcon />
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 dark:text-gray-400 neon:text-[#00ff9f]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden fixed inset-0 z-40 bg-white dark:bg-zinc-950 neon:bg-black pt-24 px-6 h-screen flex flex-col"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-bold text-zinc-900 dark:text-white neon:text-[#00ff9f] hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="w-12 h-0.5 bg-gray-100 dark:bg-white/10 neon:bg-[#00ff9f]/20 my-2" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="text-3xl font-bold text-blue-600 neon:text-[#00ff9f] hover:text-zinc-900 neon:hover:text-white transition-colors"
              >
                Resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
