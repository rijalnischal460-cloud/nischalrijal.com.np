import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Menu, X, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenResume: () => void;
}

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Focus', href: '#focus' },
  { label: 'Interests', href: '#interests' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({ onOpenResume }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const scrollToId = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMenu();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/70'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-4xl font-extrabold tracking-tight text-black dark:text-white"
          aria-label="Go to top"
        >
          Nischal<span className="text-blue-600">.</span>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToId(item.href)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-black/5 hover:text-black dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={onOpenResume}
            className="ml-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-black/5 hover:text-black dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <FileText size={16} />
            Resume
          </button>
          <button
            onClick={toggleTheme}
            className="ml-1 rounded-lg p-2 text-zinc-600 transition hover:bg-black/5 hover:text-black dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-600 transition hover:bg-black/5 hover:text-black dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setIsOpen((v) => !v)}
            className="rounded-lg p-2 text-zinc-700 transition hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMenu}
        />
      )}

      <motion.aside
        className={`fixed right-0 top-0 z-50 h-dvh w-72 border-l border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900 md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={false}
        animate={{ x: isOpen ? 0 : 320 }}
        transition={{ type: 'tween', duration: 0.25 }}
      >
        <div className="flex h-20 items-center justify-between border-b border-black/5 px-5 dark:border-white/10">
          <span className="text-lg font-semibold text-black dark:text-white">Menu</span>
          <button
            onClick={closeMenu}
            className="rounded-lg p-2 text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col p-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToId(item.href)}
              className="rounded-lg px-3 py-3 text-left text-base font-medium text-zinc-700 transition hover:bg-black/5 hover:text-black dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              onOpenResume();
              closeMenu();
            }}
            className="mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-3 text-left text-base font-medium text-zinc-700 transition hover:bg-black/5 hover:text-black dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <FileText size={18} />
            Resume
          </button>
        </div>
      </motion.aside>
    </header>
  );
}