"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  Code2,
  Server,
  Atom,
  Boxes,
  Palette,
  Globe2,
  type LucideIcon,
} from "lucide-react"
import { useRef } from "react"

type Skill = {
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
}

const skills: Skill[] = [
  {
    icon: Code2,
    title: "Frontend Development",
    description:
      "Crafting clean, accessible interfaces with a focus on motion, hierarchy and editorial typography.",
    tags: ["React", "Next.js", "Tailwind"],
  },
  {
    icon: Server,
    title: "Backend Development",
    description:
      "Designing REST APIs, data models and reliable server logic for fullstack web apps.",
    tags: ["Node.js", "Express", "REST"],
  },
  {
    icon: Atom,
    title: "React & Vite",
    description:
      "Component-driven architectures with modern build tooling, hooks and state patterns.",
    tags: ["Hooks", "Vite", "SWR"],
  },
  {
    icon: Globe2,
    title: "Node.js & Express",
    description:
      "Building API routes, middleware, validation and clean fullstack pipelines end-to-end.",
    tags: ["APIs", "Routing", "Auth"],
  },
  {
    icon: Palette,
    title: "UI / UX Design",
    description:
      "Calm layouts, intentional spacing and motion that supports the story instead of distracting.",
    tags: ["Figma", "Motion", "Systems"],
  },
  {
    icon: Boxes,
    title: "3D Web (Three.js)",
    description:
      "Scroll-bound scenes, custom materials and interactive 3D objects with React Three Fiber.",
    tags: ["R3F", "Drei", "GLSL"],
  },
]

function TiltCard({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 18 })
  const sy = useSpring(y, { stiffness: 150, damping: 18 })

  const rotateX = useTransform(sy, [-50, 50], [6, -6])
  const rotateY = useTransform(sx, [-50, 50], [-6, 6])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Icon = skill.icon

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-colors hover:border-[#10b981]/30"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),_rgba(16,185,129,0.18),_transparent_60%)]" />
      </div>

      <div className="relative flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-[#10b981] transition-all group-hover:border-[#10b981]/40 group-hover:shadow-[0_0_24px_-4px_rgba(16,185,129,0.5)]">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.32em] text-white/30">
            0{index + 1}
          </span>
        </div>

        <div>
          <h3 className="font-serif text-2xl text-white">{skill.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            {skill.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {skill.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/65"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="relative px-4 py-24 sm:py-32 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#10b981]">
              02 — Capabilities
            </p>
            <h2 className="mt-3 font-serif text-4xl text-balance text-white sm:text-5xl md:text-6xl">
              Skills that shape <em className="text-[#10b981]">the craft</em>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55">
            A snapshot of the tools and disciplines I use to build calm, fast and
            expressive web experiences as a student-developer in Nepal.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <TiltCard key={s.title} skill={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
