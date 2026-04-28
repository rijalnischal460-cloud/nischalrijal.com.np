"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { GraduationCap, Hammer, Boxes } from "lucide-react"

const metrics = [
  {
    icon: GraduationCap,
    label: "Currently",
    value: "Learning Fullstack Development",
  },
  {
    icon: Hammer,
    label: "In Practice",
    value: "Building Real Projects",
  },
  {
    icon: Boxes,
    label: "Exploring",
    value: "3D Web Interfaces",
  },
]

export function About() {
  return (
    <section id="about" className="relative px-4 py-24 sm:py-32 md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left — overlapping images */}
        <div className="relative order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-white/10"
          >
            <Image
              src="/images/coding-setup.jpg"
              alt="Minimal developer desk setup at night with subtle emerald light"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b0a]/60 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-8 right-0 aspect-[4/5] w-1/2 max-w-[260px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:-bottom-12 sm:w-2/3 sm:max-w-xs"
          >
            <Image
              src="/images/nepal-mountains.jpg"
              alt="Misty Himalayan mountains in Nepal at dawn"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b0a]/60 via-transparent to-transparent" />
          </motion.div>

          <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#10b981]/15 blur-3xl" />
        </div>

        {/* Right — story */}
        <div className="order-1 lg:order-2">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.32em] text-[#10b981]"
          >
            01 — About
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-3 font-serif text-4xl text-balance text-white sm:text-5xl md:text-[56px] md:leading-[1.05]"
          >
            A student-developer{" "}
            <em className="text-[#10b981]">growing in Nepal’s tech scene</em>.
          </motion.h2>

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-white/70">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              I’m{" "}
              <span className="text-white">Nischal Rijal</span>, a 2nd year
              Software Engineering student from Nepal. I love building modern
              web experiences and slowly turning ideas into things people can
              actually use.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              Outside of code, I love{" "}
              <span className="text-white">traveling</span> and{" "}
              <span className="text-white">watching movies</span>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.26 }}
            >
              These days I’m focused on combining{" "}
              <span className="text-white">creativity and code</span> —
              fullstack development, frontend craft and immersive 3D web
              interfaces. This site is part portfolio, part journal of that
              journey.
            </motion.p>
          </div>

          {/* Metrics */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((m, i) => {
              const Icon = m.icon
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.07 }}
                  className="rounded-xl border border-white/8 bg-white/[0.02] p-4"
                >
                  <Icon className="h-4 w-4 text-[#10b981]" />
                  <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/40">
                    {m.label}
                  </p>
                  <p className="mt-1 text-sm text-white">{m.value}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
