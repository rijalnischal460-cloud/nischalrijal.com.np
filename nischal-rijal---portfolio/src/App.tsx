/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { motion, useScroll, useSpring } from 'motion/react';

import { useState } from 'react';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-500 font-sans">
        {/* Progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-black dark:bg-white z-60 origin-left"
          style={{ scaleX }}
        />
        
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />
        
        <main>
          <Hero />
          
          <motion.div
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

