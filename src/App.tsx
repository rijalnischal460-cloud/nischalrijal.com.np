/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { CurrentFocus } from './sections/Focus';
import { Interests } from './sections/Interests';
import { Contact } from './sections/Contact';
import { Resume } from './sections/Resume';
import { Footer } from './sections/Footer';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen h-auto w-full max-w-full overflow-x-hidden bg-white font-sans text-black transition-colors duration-500 selection:bg-black/10 dark:bg-zinc-950 dark:text-white dark:selection:bg-white/20">
        <motion.div
          className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-black dark:bg-white"
          style={{ scaleX }}
        />

        <Navbar onOpenResume={() => setIsResumeOpen(true)} />

        <main className="w-full max-w-full overflow-x-hidden min-h-screen h-auto">
          <Hero />
          <motion.div
            className="w-full max-w-full overflow-x-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1 }}
          >
            <About />
            <Skills />
            <Projects />
            <CurrentFocus />
            <Interests />
            <Contact />
          </motion.div>
        </main>

        <Footer />
        <Resume isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      </div>
    </ThemeProvider>
  );
}