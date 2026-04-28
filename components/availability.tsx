"use client"

import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Clock, ArrowUpRight, Github } from "lucide-react"

const facts = [
  {
    icon: Briefcase,
    label: "Role",
    value: "Software Engineering Intern",
  },
  {
    icon: GraduationCap,
    label: "Stage",
    value: "2nd-year Student",
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Part-time / Remote",
  },
]

const focus = [
  "Frontend (React, Next.js, Tailwind)",
  "Fullstack web (Node.js, APIs, databases)",
  "3D / interactive interfaces (Three.js, R3F)",
  "Clean UI, motion design, accessibility",
]

export function Availability() {
  return (
    <section
      id="availability"
      className="relative px-4 py-24 sm:py-28 md:px-8"
      aria-label="Internship availability"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[#10b981]/25 bg-gradient-to-br from-[#10b981]/[0.08] via-white/[0.02] to-transparent p-8 sm:p-12"
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full bg-[#10b981]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-[360px] w-[360px] rounded-full bg-[#10b981]/10 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-[#10b981]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
                </span>
                Open Position · Hiring Me
              </div>

              <h2 className="mt-6 font-serif text-4xl text-balance text-white sm:text-5xl md:text-[60px] md:leading-[1.05]">
                Available for{" "}
                <em className="text-[#10b981]">internship roles</em> right now.
              </h2>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70">
                I&apos;m actively looking for a software engineering internship —
                remote, hybrid or based in Nepal. I&apos;m eager to learn from a
                real engineering team, contribute to production work, and grow
                alongside thoughtful builders.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:horahaina123@gmail.com?subject=Internship%20Opportunity%20for%20Nischal%20Rijal"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#10b981] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-black transition-all hover:bg-[#0ea371]"
                >
                  Hire me as an intern
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  href="https://github.com/rijalnischal460-cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-white/85 transition-all hover:border-white/30 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  See my GitHub
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {facts.map((f, i) => {
                  const Icon = f.icon
                  return (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: 0.1 + i * 0.07 }}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-[#10b981]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                          {f.label}
                        </p>
                        <p className="text-sm text-white">{f.value}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-5 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                  What I&apos;d love to work on
                </p>
                <ul className="mt-3 space-y-2">
                  {focus.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-[13px] leading-relaxed text-white/75"
                    >
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[#10b981]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
