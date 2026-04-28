"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Loader2, Check, Github, Mail } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [msg, setMsg] = useState("")

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMsg("")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setStatus("error")
        setMsg(data.error ?? "Something went wrong.")
        return
      }
      setStatus("success")
      setMsg(data.message ?? "Subscribed.")
      setEmail("")
    } catch {
      setStatus("error")
      setMsg("Network error.")
    }
  }

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0a0b0a] pt-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-20">
          {/* Newsletter */}
          <div className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#10b981]">
              The Letter
            </p>
            <h3 className="mt-3 max-w-xl font-serif text-3xl text-balance text-white sm:text-4xl md:text-5xl">
              Occasional notes on code,{" "}
              <em className="text-[#10b981]">cinema and Nepal</em>.
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
              A quiet, low-frequency newsletter on what I’m learning, building
              and watching. No spam, ever.
            </p>

            <form
              onSubmit={onSubscribe}
              className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  disabled={status === "loading"}
                  className="w-full rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#10b981]/50 focus:ring-2 focus:ring-[#10b981]/20 disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10b981] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-black transition-all hover:bg-[#0ea371] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : status === "success" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                )}
                {status === "success" ? "Subscribed" : "Subscribe"}
              </button>
            </form>

            <AnimatePresence>
              {msg && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-3 text-[12px] tracking-wide ${
                    status === "error" ? "text-red-400" : "text-[#10b981]"
                  }`}
                >
                  {msg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
                Sitemap
              </p>
              <ul className="mt-4 space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => scrollTo(l.href)}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-y-px opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-1 group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
                Elsewhere
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="mailto:horahaina123@gmail.com"
                    className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    horahaina123@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/rijalnischal460-cloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" />
                    github.com/rijalnischal460-cloud
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/5 py-8 sm:flex-row sm:items-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            © {new Date().getFullYear()} Nischal Rijal · Made in Nepal
          </p>
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            Built with React · Three.js · Framer Motion
          </p>
        </div>

        {/* Watermark */}
        <div
          aria-hidden
          className="pointer-events-none -mb-6 select-none overflow-hidden"
        >
          <p className="font-serif text-[18vw] leading-[0.85] tracking-tight text-white/[0.04]">
            NISCHAL RIJAL
          </p>
        </div>
      </div>
    </footer>
  )
}
