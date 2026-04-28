"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Environment,
  ContactShadows,
  Float,
  PerspectiveCamera,
} from "@react-three/drei"
import { Suspense, useMemo, useRef, useEffect, useState } from "react"
import * as THREE from "three"

// ...existing code...

type HeadProps = {
  scrollRef: React.MutableRefObject<number>
}

/**
 * Optimised identity scene:
 * - slowed animation via ANIMATION_SPEED
 * - reduced geometry detail & fewer hair puffs for performance
 * - clamp rotations so only front-facing head is visible
 * - small "hand" that moves left/right with arrow keys
 */
const ANIMATION_SPEED = 0.35 // <1 slows animation (0.35 ~ ~3x slower)
const HAIR_FILLER_COUNT = 40 // reduce filler curls for performance
const MAX_ROT_Y = 0.35 // clamp horizontal rotation (radians)
const MAX_ROT_X = 0.25 // clamp vertical rotation (radians)

function Head({ scrollRef }: HeadProps) {
  const group = useRef<THREE.Group | null>(null)
  const headPivot = useRef<THREE.Group | null>(null)
  const leftEye = useRef<THREE.Group | null>(null)
  const rightEye = useRef<THREE.Group | null>(null)
  const handRef = useRef<THREE.Group | null>(null)
  const mouseTarget = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Hand input state (0 center, negative left, positive right)
  const handTarget = useRef(0)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handTarget.current = -0.45
      if (e.key === "ArrowRight") handTarget.current = 0.45
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        /* optional: reuse for tilt later */
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") handTarget.current = 0
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  // Hair puffs: keep anchors, much fewer filler curls and only front hemisphere
  const hairPuffs = useMemo(() => {
    const puffs: { pos: [number, number, number]; r: number; tone: number }[] =
      []

    const anchors: [number, number, number, number][] = [
      [0.0, 0.95, 0.45, 0.36],
      [-0.45, 0.92, 0.35, 0.34],
      [0.45, 0.92, 0.35, 0.34],
      [-0.7, 0.7, 0.15, 0.32],
      [0.7, 0.7, 0.15, 0.32],
      [0.0, 1.05, 0.05, 0.34],
    ]
    for (const [x, y, z, r] of anchors) {
      puffs.push({ pos: [x, y, z], r, tone: 0.95 + Math.random() * 0.06 })
    }

    // fewer filler curls, only front-facing (z >= -0.2)
    for (let i = 0; i < HAIR_FILLER_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.9
      const radius = 1.02 + Math.random() * 0.12
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi) + 0.08
      const z = radius * Math.sin(phi) * Math.sin(theta) - 0.03
      if (z < -0.3) continue // hide deep-back puffs
      puffs.push({
        pos: [x, y, z],
        r: 0.10 + Math.random() * 0.08,
        tone: 0.86 + Math.random() * 0.18,
      })
    }

    // a few tight curls on top
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const r = 0.45 + Math.random() * 0.18
      puffs.push({
        pos: [Math.cos(a) * r, 1.05 + Math.random() * 0.06, Math.sin(a) * r * 0.6],
        r: 0.07 + Math.random() * 0.03,
        tone: 0.92 + Math.random() * 0.12,
      })
    }

    return puffs
  }, [])

  useFrame((state, delta) => {
    // scaled delta for slower, stable animation and capped step to avoid jumps
    const rawDt = Math.min(delta, 0.05)
    const dt = rawDt * ANIMATION_SPEED
    const scroll = scrollRef.current

    // pointer smoothing scaled to slower animation
    const px = (state.pointer.x * viewport.width) / 6
    const py = (state.pointer.y * viewport.height) / 6
    mouseTarget.current.x = THREE.MathUtils.damp(
      mouseTarget.current.x,
      px,
      4 * ANIMATION_SPEED,
      dt,
    )
    mouseTarget.current.y = THREE.MathUtils.damp(
      mouseTarget.current.y,
      py,
      4 * ANIMATION_SPEED,
      dt,
    )

    // group follow scroll but clamped to front view
    if (group.current) {
      const targetRotY = THREE.MathUtils.clamp(
        scroll * Math.PI * 0.6,
        -MAX_ROT_Y,
        MAX_ROT_Y,
      )
      const targetZ = -0.2 + scroll * 0.25
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRotY,
        2.5,
        dt,
      )
      group.current.position.z = THREE.MathUtils.damp(
        group.current.position.z,
        targetZ,
        2.5,
        dt,
      )
    }

    if (headPivot.current) {
      const targetY = THREE.MathUtils.clamp(
        mouseTarget.current.x * 0.35,
        -MAX_ROT_Y,
        MAX_ROT_Y,
      )
      const targetX = THREE.MathUtils.clamp(
        -mouseTarget.current.y * 0.25,
        -MAX_ROT_X,
        MAX_ROT_X,
      )
      headPivot.current.rotation.y = THREE.MathUtils.damp(
        headPivot.current.rotation.y,
        targetY,
        3.5,
        dt,
      )
      headPivot.current.rotation.x = THREE.MathUtils.damp(
        headPivot.current.rotation.x,
        targetX,
        3.5,
        dt,
      )
    }

    // Eyes follow pointer with lighter stiffness
    const eyeRot = mouseTarget.current.x * 0.25
    const eyeTilt = -mouseTarget.current.y * 0.16
    if (leftEye.current) {
      leftEye.current.rotation.y = THREE.MathUtils.damp(
        leftEye.current.rotation.y,
        eyeRot,
        6,
        dt,
      )
      leftEye.current.rotation.x = THREE.MathUtils.damp(
        leftEye.current.rotation.x,
        eyeTilt,
        6,
        dt,
      )
    }
    if (rightEye.current) {
      rightEye.current.rotation.y = THREE.MathUtils.damp(
        rightEye.current.rotation.y,
        eyeRot,
        6,
        dt,
      )
      rightEye.current.rotation.x = THREE.MathUtils.damp(
        rightEye.current.rotation.x,
        eyeTilt,
        6,
        dt,
      )
    }

    // Hand follows keyboard target with smoothing
    if (handRef.current) {
      const hx = THREE.MathUtils.damp(
        handRef.current.position.x,
        handTarget.current,
        6,
        dt,
      )
      handRef.current.position.x = hx
      // small vertical bob to feel alive (slow)
      handRef.current.position.y = THREE.MathUtils.lerp(
        handRef.current.position.y,
        -0.15 + Math.sin(state.clock.getElapsedTime() * 0.6) * 0.01,
        0.06,
      )
      handRef.current.rotation.z = THREE.MathUtils.damp(
        handRef.current.rotation.z,
        (handTarget.current || 0) * -0.15,
        4,
        dt,
      )
    }
  })

  // Materials — simplified & efficient
  const skinColor = "#f3b89a"
  const skin = (
    <meshStandardMaterial
      color={skinColor}
      roughness={0.6}
      metalness={0}
    />
  )
  const skinNose = <meshStandardMaterial color="#eba88b" roughness={0.6} />
  const cheekMat = (
    <meshStandardMaterial color="#f08a76" roughness={0.8} transparent opacity={0.55} />
  )
  const browMat = <meshStandardMaterial color="#2a1a10" roughness={0.8} />
  const lipMat = <meshStandardMaterial color="#c4584b" roughness={0.6} />
  const irisMat = <meshStandardMaterial color="#7a3e15" roughness={0.5} />
  const pupilMat = <meshStandardMaterial color="#0b0703" roughness={0.2} />
  const eyeWhite = <meshStandardMaterial color="#fbf8f2" roughness={0.28} />

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <group ref={headPivot}>
        {/* Head - reduced segments for performance */}
        <mesh castShadow receiveShadow scale={[1.0, 1.06, 1.0]}>
          <sphereGeometry args={[1, 32, 32]} />
          {skin}
        </mesh>

        {/* Jaw */}
        <mesh position={[0, -0.55, 0.25]} scale={[0.7, 0.5, 0.7]}>
          <sphereGeometry args={[1, 28, 28]} />
          {skin}
        </mesh>

        {/* Cheeks */}
        <mesh position={[-0.5, -0.1, 0.78]} rotation={[0, -0.4, 0]} scale={[0.18, 0.13, 0.04]}>
          <sphereGeometry args={[1, 20, 20]} />
          {cheekMat}
        </mesh>
        <mesh position={[0.5, -0.1, 0.78]} rotation={[0, 0.4, 0]} scale={[0.18, 0.13, 0.04]}>
          <sphereGeometry args={[1, 20, 20]} />
          {cheekMat}
        </mesh>

        {/* Brows */}
        <mesh position={[-0.3, 0.42, 0.92]} rotation={[0, -0.05, 0.18]} scale={[0.22, 0.06, 0.06]}>
          <sphereGeometry args={[1, 20, 20]} />
          {browMat}
        </mesh>
        <mesh position={[0.3, 0.42, 0.92]} rotation={[0, 0.05, -0.18]} scale={[0.22, 0.06, 0.06]}>
          <sphereGeometry args={[1, 20, 20]} />
          {browMat}
        </mesh>

        {/* Eyes (kept simple) */}
        <group ref={leftEye} position={[-0.3, 0.22, 0.85]}>
          <mesh>
            <sphereGeometry args={[0.18, 28, 28]} />
            {eyeWhite}
          </mesh>
          <mesh position={[0, -0.005, 0.13]}>
            <sphereGeometry args={[0.105, 20, 20]} />
            {irisMat}
          </mesh>
          <mesh position={[0, -0.005, 0.165]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            {pupilMat}
          </mesh>
        </group>

        <group ref={rightEye} position={[0.3, 0.22, 0.85]}>
          <mesh>
            <sphereGeometry args={[0.18, 28, 28]} />
            {eyeWhite}
          </mesh>
          <mesh position={[0, -0.005, 0.13]}>
            <sphereGeometry args={[0.105, 20, 20]} />
            {irisMat}
          </mesh>
          <mesh position={[0, -0.005, 0.165]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            {pupilMat}
          </mesh>
        </group>

        {/* Nose */}
        <mesh position={[0, 0.0, 1.0]} scale={[0.085, 0.075, 0.085]}>
          <sphereGeometry args={[1, 18, 18]} />
          {skinNose}
        </mesh>

        {/* Smile */}
        <mesh position={[0, -0.27, 0.92]} rotation={[Math.PI / 2 - 0.25, 0, 0]} scale={[1, 1, 0.55]}>
          <torusGeometry args={[0.11, 0.018, 8, 24, Math.PI]} />
          {lipMat}
        </mesh>

        {/* Front-only bouncy hair (reduced complexity) */}
        {hairPuffs.map((p, i) => (
          <mesh key={`h-${i}`} position={p.pos} castShadow>
            <sphereGeometry args={[p.r, 12, 12]} />
            <meshStandardMaterial
              color={p.tone < 1 ? "#3a2110" : "#4a2a18"}
              roughness={0.85}
              metalness={0.02}
            />
          </mesh>
        ))}

        {/* Simple hand mesh that follows arrow keys */}
        <group ref={handRef} position={[0, -0.15, 0.9]}>
          <mesh position={[0.35, 0, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.18, 0.06, 0.06]} />
            <meshStandardMaterial color="#f3b89a" roughness={0.7} />
          </mesh>
          {/* small thumb */}
          <mesh position={[0.48, 0.02, 0.02]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
            <meshStandardMaterial color="#f3b89a" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Neck */}
      <mesh position={[0, -1.05, 0.15]}>
        <cylinderGeometry args={[0.32, 0.36, 0.45, 16]} />
        {skin}
      </mesh>

      {/* Soft rim glow behind head */}
      <mesh position={[0, 0.1, -1.6]}>
        <circleGeometry args={[1.7, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

export function IdentityScene({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>
}) {
  // Lower DPR to save mobile GPU cycles
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.12, 3.8]} fov={34} />

      {/* Lightweight lights */}
      <ambientLight intensity={0.48} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.0} />
      <pointLight position={[-2.5, 1.2, -1.2]} intensity={1.2} color="#10b981" />
      <pointLight position={[2, -0.8, 1.8]} intensity={0.6} color="#fde7d2" />

      <Suspense fallback={null}>
        {/* Float slowed down for performance + subtle movement */}
        <Float speed={0.18} rotationIntensity={0.02} floatIntensity={0.06}>
          <Head scrollRef={scrollRef} />
        </Float>

        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.35}
          scale={7}
          blur={2}
          far={2.5}
          color="#000000"
        />

        <Environment preset="studio" environmentIntensity={0.45} />
      </Suspense>
    </Canvas>
  )
}

// ...existing code...