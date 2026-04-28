"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowUpRight, Github } from "lucide-react"

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#playground", label: "Lab" },
  { href: "#contact", label: "Contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
    >
      <nav
        className={`relative flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled
            ? "glass shadow-[0_8px_30px_rgb(0,0,0,0.35)]"
            : "border border-transparent bg-transparent"
        }`}
      >
        <button
          onClick={() => scrollTo("#home")}
          className="group flex items-center gap-2"
          aria-label="Nischal Rijal — Home"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/40">
            <span className="absolute inset-1 rounded-full bg-[#10b981]/80 blur-[2px]" />
            <span className="relative h-2 w-2 rounded-full bg-[#10b981]" />
          </span>
          <span className="font-serif text-base tracking-tight text-white">
            Nischal<span className="text-[#10b981]">.</span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => scrollTo(l.href)}
                className="rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/rijalnischal460-cloud"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/75 transition-all hover:border-white/30 hover:text-white md:inline-flex"
          >
            <Github className="h-4 w-4" />
          </a>
          <button
            onClick={() => scrollTo("#contact")}
            className="hidden items-center gap-1.5 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-[#10b981] transition-all hover:bg-[#10b981] hover:text-black md:inline-flex"
          >
            Contact Me
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass absolute left-0 right-0 top-[calc(100%+8px)] rounded-2xl p-2 md:hidden"
            >
              <ul className="flex flex-col">
                {links.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => scrollTo(l.href)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm uppercase tracking-[0.18em] text-white/80 hover:bg-white/5"
                    >
                      {l.label}
                      <ArrowUpRight className="h-4 w-4 opacity-60" />
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => scrollTo("#contact")}
                    className="mt-1 flex w-full items-center justify-between rounded-xl bg-[#10b981] px-4 py-3 text-sm uppercase tracking-[0.18em] text-black"
                  >
                    Contact Me
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
