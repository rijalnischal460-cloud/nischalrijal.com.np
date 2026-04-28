"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"
import { MousePointer2, Sparkles, Code2, Coffee } from "lucide-react"

/**
 * A magnetic, cursor-reactive 3D dot field.
 * Inspired by tactile 3D portfolios (Bruno Simon, Thomas Bachem etc.) —
 * a grid of small spheres that lift and glow based on distance to the pointer.
 */
function DotField() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const pointer3D = useRef(new THREE.Vector3(0, 0, 0))
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  // 32 x 18 grid — comfortable density.
  const COLS = 32
  const ROWS = 18
  const COUNT = COLS * ROWS

  // Precompute base positions for each instance.
  const basePositions = useMemo(() => {
    const arr: { x: number; y: number }[] = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - (COLS - 1) / 2) * 0.34
        const y = (r - (ROWS - 1) / 2) * 0.34
        arr.push({ x, y })
      }
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (!mesh.current) return
    const dt = Math.min(delta, 0.05)

    // Project the pointer onto the dot field plane (z=0).
    const px = state.pointer.x * (state.viewport.width / 2)
    const py = state.pointer.y * (state.viewport.height / 2)
    pointer3D.current.x = THREE.MathUtils.damp(pointer3D.current.x, px, 7, dt)
    pointer3D.current.y = THREE.MathUtils.damp(pointer3D.current.y, py, 7, dt)

    const t = state.clock.elapsedTime
    const emerald = new THREE.Color("#10b981")
    const dim = new THREE.Color("#1c2520")

    for (let i = 0; i < COUNT; i++) {
      const { x, y } = basePositions[i]
      const dx = x - pointer3D.current.x
      const dy = y - pointer3D.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Magnetic lift — falls off with distance from the cursor.
      const radius = 2.4
      const lift = Math.max(0, 1 - dist / radius)
      const z =
        Math.sin(t * 0.9 + x * 0.5 + y * 0.5) * 0.04 + // ambient ripple
        Math.pow(lift, 2) * 0.85

      const scale = 0.045 + Math.pow(lift, 2) * 0.1

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)

      // Color blend toward emerald near the cursor.
      color.copy(dim).lerp(emerald, Math.pow(lift, 1.5))
      mesh.current.setColorAt(i, color)
    }

    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        roughness={0.3}
        metalness={0.2}
        emissive="#10b981"
        emissiveIntensity={0.25}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

const STATUSES = [
  "Building React components",
  "Refactoring API routes",
  "Polishing 3D scene shaders",
  "Reading design systems docs",
  "Sketching new UI ideas",
  "Wiring up Tailwind tokens",
]

const COMMANDS = [
  { cmd: "pnpm dev", out: "Local: http://localhost:3000  ·  ready in 1.2s" },
  { cmd: "git status", out: "On branch main  ·  nothing to commit, working tree clean" },
  { cmd: "pnpm build", out: "Compiled successfully  ·  6 routes  ·  98/100 lighthouse" },
  { cmd: "curl /api/health", out: '{ "ok": true, "service": "portfolio" }' },
]

export function Playground() {
  // Live time in Nepal (UTC+5:45)
  const [time, setTime] = useState<string>("")
  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kathmandu",
      }).format(new Date())
      setTime(fmt)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  // Cycling status
  const [statusIdx, setStatusIdx] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUSES.length)
    }, 3200)
    return () => window.clearInterval(id)
  }, [])

  // Typing terminal
  const [cmdIdx, setCmdIdx] = useState(0)
  const [typed, setTyped] = useState("")
  const [showOut, setShowOut] = useState(false)
  useEffect(() => {
    setTyped("")
    setShowOut(false)
    const cmd = COMMANDS[cmdIdx].cmd
    let i = 0
    const typeId = window.setInterval(() => {
      i += 1
      setTyped(cmd.slice(0, i))
      if (i >= cmd.length) {
        window.clearInterval(typeId)
        window.setTimeout(() => setShowOut(true), 350)
        window.setTimeout(() => {
          setCmdIdx((c) => (c + 1) % COMMANDS.length)
        }, 2600)
      }
    }, 60)
    return () => window.clearInterval(typeId)
  }, [cmdIdx])

  return (
    <section
      id="playground"
      className="relative px-4 py-24 sm:py-32 md:px-8"
      aria-label="Interactive playground"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#10b981]">
              04 — Live Lab
            </p>
            <h2 className="mt-3 font-serif text-4xl text-balance text-white sm:text-5xl md:text-6xl">
              An interactive{" "}
              <em className="text-[#10b981]">moment with me</em>.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55">
            Move your cursor across the canvas — every dot reacts. To the right,
            a small live snapshot of what I&apos;m doing right now.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Interactive 3D canvas */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black/60"
          >
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 0, 6], fov: 35 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[0, 0, 4]} intensity={1.4} color="#10b981" />
              <pointLight position={[-4, 2, 2]} intensity={0.6} color="#7dd3fc" />
              <Suspense fallback={null}>
                <DotField />
              </Suspense>
            </Canvas>

            {/* Decorative grid + gradient */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b0a] via-transparent to-transparent" />

            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/65 backdrop-blur">
              <MousePointer2 className="h-3 w-3 text-[#10b981]" />
              Move your cursor
            </div>
            <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[#10b981] backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Live · Reactive
            </div>
          </motion.div>

          {/* Live "now" panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Now in Nepal */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6">
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/40">
                Now in Kathmandu, Nepal
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <p className="font-serif text-5xl tracking-tight text-white tabular-nums">
                  {time || "--:--:--"}
                </p>
                <span className="text-[11px] uppercase tracking-[0.28em] text-[#10b981]">
                  NPT · UTC+5:45
                </span>
              </div>
            </div>

            {/* Currently doing */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/40">
                <Coffee className="h-3 w-3 text-[#10b981]" />
                Currently
              </div>
              <motion.p
                key={statusIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-3 font-serif text-2xl leading-snug text-white"
              >
                {STATUSES[statusIdx]}
              </motion.p>
            </div>

            {/* Typing terminal */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 font-mono text-[12px]">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] text-white/45">
                <div className="flex items-center gap-2">
                  <Code2 className="h-3 w-3 text-[#10b981]" />
                  ~/portfolio
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-[#10b981]/70" />
                </div>
              </div>
              <div className="space-y-1.5 p-4 text-white/85">
                <p>
                  <span className="text-[#10b981]">nischal@dev</span>
                  <span className="text-white/40">:~$ </span>
                  <span>{typed}</span>
                  <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-[#10b981]" />
                </p>
                {showOut && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/55"
                  >
                    {COMMANDS[cmdIdx].out}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
