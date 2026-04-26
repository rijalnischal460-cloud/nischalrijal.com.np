import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Layout';

export function Hero() {
  return (
    <section className="relative flex min-h-[70svh] w-full max-w-full flex-col items-center justify-center overflow-x-hidden overflow-y-visible pt-20 pb-16 md:min-h-[90vh]">
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-200/30 blur-[120px] animate-pulse dark:bg-purple-900/10" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-200/30 blur-[120px] animate-pulse delay-700 dark:bg-indigo-900/10" />

      <div className="relative z-10 max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500 dark:text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            Available for internships
          </div>

          <h1 className="mb-8 bg-linear-to-b from-black to-zinc-500 bg-clip-text text-6xl font-bold tracking-tighter text-transparent md:text-8xl dark:from-white dark:to-zinc-400">
            Nischal Rijal
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-zinc-700 md:text-2xl dark:text-zinc-300">
            Software Engineering Student &amp; UI Designer based in{' '}
            <span className="text-black dark:text-white">Kathmandu, Nepal</span>.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() =>
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              View Projects
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Get in Touch
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-gray-400/60 p-2 dark:border-white/20">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}