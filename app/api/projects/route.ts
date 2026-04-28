import { NextResponse } from "next/server"

export type Project = {
  id: string
  title: string
  description: string
  stack: string[]
  year: string
  category: string
  // Lightweight metrics rendered as the live preview on each card.
  metrics: {
    label: string
    // 0..100 — used to draw the animated mini-bar.
    value: number
    suffix?: string
  }[]
  highlights: string[]
}

const projects: Project[] = [
  {
    id: "p1",
    title: "TaskFlow — Team Productivity Suite",
    description:
      "A clean, keyboard-first task and project manager for small teams. Drag-and-drop boards, live presence and a focus timer that keeps work moving.",
    stack: ["Next.js", "Postgres", "WebSockets", "Tailwind"],
    year: "2025",
    category: "Productivity",
    highlights: [
      "Realtime board sync via WebSockets",
      "Keyboard-first navigation",
      "Daily focus timer + analytics",
    ],
    metrics: [
      { label: "Active users", value: 78, suffix: "k" },
      { label: "Avg. tasks / day", value: 64 },
      { label: "Lighthouse", value: 98, suffix: "/100" },
    ],
  },
  {
    id: "p2",
    title: "PulseChat — Realtime Messaging",
    description:
      "A modern chat app with typing indicators, threaded replies, file sharing and presence. Built for fast conversations on any device.",
    stack: ["React", "Node.js", "Socket.IO", "Redis"],
    year: "2025",
    category: "Realtime",
    highlights: [
      "Sub-100 ms message delivery",
      "Threaded replies & reactions",
      "Mobile-ready PWA shell",
    ],
    metrics: [
      { label: "Median latency", value: 45, suffix: " ms" },
      { label: "Daily messages", value: 92, suffix: "k" },
      { label: "Uptime", value: 99, suffix: ".9%" },
    ],
  },
  {
    id: "p3",
    title: "Skyline — Weather Intelligence",
    description:
      "A beautifully animated weather dashboard with hourly precision, severe-weather alerts and a 7-day cinematic forecast designed for one quick glance.",
    stack: ["Next.js", "OpenWeather API", "Framer Motion", "Tailwind"],
    year: "2025",
    category: "Data Viz",
    highlights: [
      "Hourly + 7-day forecasts",
      "Severe-weather push alerts",
      "Animated gradient skies",
    ],
    metrics: [
      { label: "Cities covered", value: 88 },
      { label: "API hit rate", value: 96, suffix: "%" },
      { label: "Avg. load", value: 1, suffix: ".1s" },
    ],
  },
]

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: projects.length,
    projects,
  })
}
