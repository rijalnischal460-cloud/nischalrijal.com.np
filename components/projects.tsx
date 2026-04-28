"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowUpRight, Github, Loader2, Activity } from "lucide-react"

type Metric = {
  label: string
  value: number
  suffix?: string
}

type Project = {
  id: string
  title: string
  description: string
  stack: string[]
  github?: string
  year: string
  category: string
  metrics: Metric[]
  highlights: string[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function Projects() {
  const { data, error, isLoading } = useSWR<{
    ok: boolean
    projects: Project[]
  }>("/api/projects", fetcher, { revalidateOnFocus: false })

  return (
    <section id="projects" className="relative px-4 py-24 sm:py-32 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#10b981]">
              03 — Selected Work
            </p>
            <h2 className="mt-3 font-serif text-4xl text-balance text-white sm:text-5xl md:text-6xl">
              Projects, <em className="text-[#10b981]">in motion</em>.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55">
            Practical, useful products I&apos;ve been building — fetched live
            from the portfolio API at{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-[12px] text-white/80">
              /api/projects
            </code>
            .
          </p>
        </div>

        {isLoading && (
          <div className="mt-14 flex items-center gap-3 text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[11px] uppercase tracking-[0.28em]">
              Loading projects from server…
            </span>
          </div>
        )}

        {error && (
          <div className="mt-14 rounded-xl border border-red-500/30 bg-red-500/5 p-5 text-sm text-red-300">
            Couldn&apos;t load projects right now. Please refresh.
          </div>
        )}

        {data?.projects && (
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {data.projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Tilt on cursor for a tactile, interactive feel.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-50, 50], [6, -6]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(mx, [-50, 50], [-6, 6]), { stiffness: 200, damping: 18 })

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mx.set(e.clientX - r.left - r.width / 2)
    my.set(e.clientY - r.top - r.height / 2)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.article
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-7 transition-colors duration-500 hover:border-[#10b981]/30 hover:shadow-[0_30px_80px_-30px_rgba(16,185,129,0.35)]"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-px rounded-2xl bg-[radial-gradient(circle_at_30%_-10%,_rgba(16,185,129,0.18),_transparent_60%)]" />
      </div>

      <div className="relative flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.32em] text-white/35">
          {project.category}
        </span>
        <span className="text-[10px] uppercase tracking-[0.32em] text-white/35">
          {project.year}
        </span>
      </div>

      <h3 className="relative mt-5 font-serif text-3xl leading-tight text-white sm:text-[32px]">
        {project.title}
      </h3>

      <p className="relative mt-3 text-sm leading-relaxed text-white/60">
        {project.description}
      </p>

      {/* Highlights — practical, scannable bullets */}
      <ul className="relative mt-5 space-y-1.5">
        {project.highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-2 text-[13px] leading-relaxed text-white/70"
          >
            <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[#10b981]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {/* Live KPI strip — replaces the old "Live Demo" with dynamic, animated content */}
      <div className="relative mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/45">
          <Activity className="h-3 w-3 text-[#10b981]" />
          Live snapshot
          <span className="ml-auto inline-flex items-center gap-1 text-[#10b981]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            </span>
            online
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {project.metrics.map((m, i) => (
            <MetricBar key={m.label} metric={m} delay={i * 0.12} />
          ))}
        </div>
      </div>

      {/* Stack chips */}
      <div className="relative mt-5 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/65"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="relative mt-7 flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">
          Case study
        </span>
        <span className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all group-hover:border-[#10b981]/40 group-hover:text-[#10b981]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </motion.article>
  )
}

/** Animated metric bar: bar fills on view, number ticks up to its target. */
function MetricBar({ metric, delay = 0 }: { metric: Metric; delay?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let raf = 0
    let start = 0
    const duration = 900
    const begin = () => {
      const animate = (t: number) => {
        if (!start) start = t
        const p = Math.min(1, (t - start) / duration)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(metric.value * eased)
        if (p < 1) raf = requestAnimationFrame(animate)
      }
      raf = requestAnimationFrame(animate)
    }
    const timer = window.setTimeout(begin, delay * 1000)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [metric.value, delay])

  // Numbers <10 keep one decimal so they feel "live" instead of jumping.
  const formatted =
    metric.value < 10 ? display.toFixed(1) : Math.round(display).toString()

  // Bar width is just the value capped at 100, since most are 0..100 ratings.
  const pct = Math.min(100, metric.value)

  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.22em] text-white/40">
        {metric.label}
      </p>
      <p className="mt-1 font-serif text-[22px] leading-none text-white">
        {formatted}
        <span className="ml-0.5 text-[12px] text-white/55">
          {metric.suffix}
        </span>
      </p>
      <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/8">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1 + delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-[#10b981] to-[#34d399]"
        />
      </div>
    </div>
  )
}
