"use client"

const items = [
  "React",
  "Node.js",
  "Fullstack",
  "Three.js",
  "JavaScript",
  "UI / UX",
  "Problem Solving",
  "TypeScript",
  "Framer Motion",
  "Tailwind",
]

export function Marquee() {
  return (
    <section
      aria-label="Skills marquee"
      className="relative overflow-hidden border-y border-white/5 bg-[#0a0b0a] py-8"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0a0b0a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0a0b0a] to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="font-serif text-3xl italic text-white/85 sm:text-5xl">
              {item}
            </span>
            <span className="text-2xl text-[#10b981]" aria-hidden>
              ✺
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
