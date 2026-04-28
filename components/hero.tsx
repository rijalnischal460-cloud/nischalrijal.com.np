"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowDown, Sparkles, Github } from "lucide-react"

const IdentityScene = dynamic(
  () => import("./identity-scene").then((m) => m.IdentityScene),
  { ssr: false },
)

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      targetRef.current = total > 0 ? scrolled / total : 0
    }

    const tick = () => {
      // Smooth lerp toward target — buttery, no jitter.
      scrollRef.current += (targetRef.current - scrollRef.current) * 0.08
      rafRef.current = requestAnimationFrame(tick)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-[200vh] w-full"
      aria-label="Hero"
    >
      {/* Sticky stage */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Ambient gradient backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.10),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(255,255,255,0.04),_transparent_50%)]" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
        </div>

        {/* 3D canvas */}
        <div className="absolute inset-0">
          <IdentityScene scrollRef={scrollRef} />
        </div>

        {/* Text overlay */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="animate-float-soft"
          >
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
              </span>
              Open to Opportunities
              <Sparkles className="h-3 w-3 text-[#10b981]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-serif text-[48px] leading-[1.02] tracking-tight text-balance text-white sm:text-[72px] md:text-[96px] lg:text-[120px]"
          >
            Nischal Rijal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="mt-4 text-[11px] uppercase tracking-[0.42em] text-white/55 sm:text-xs"
          >
            2nd Year Software Engineering Student · Nepal
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 1 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <button
              onClick={() =>
                document
                  .querySelector("#projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-2 rounded-full bg-[#10b981] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-black transition-all hover:bg-[#0ea371]"
            >
              View Projects
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
            </button>
            <a
              href="https://github.com/rijalnischal460-cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-white/85 transition-all hover:border-white/30 hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/40">
            <span>Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-white/15">
              <motion.span
                animate={{ y: [-40, 40] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 top-0 block h-6 w-px bg-[#10b981]"
              />
            </span>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0b0a]" />
      </div>
    </section>
  )
}
