import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Layout';

export function Navbar({ onOpenResume }: { onOpenResume: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-12">
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold tracking-tighter text-black dark:text-white"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Nischal<span className="text-blue-600">.</span>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group relative text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-500 transition-all group-hover:w-full" />
            </a>
          ))}
          <div className="mx-2 h-4 w-px bg-zinc-300 dark:bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenResume}
            className="rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-950"
          >
            Resume
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full p-0"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full p-0"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="text-gray-700 dark:text-gray-200"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-b border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-900 md:hidden"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-900 dark:text-gray-100"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="text-left text-lg font-bold text-blue-600"
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