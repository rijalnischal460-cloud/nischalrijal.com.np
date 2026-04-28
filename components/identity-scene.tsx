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
 * Super realistic identity scene:
 * - increased hand movement with arrow keys (3x multiplier)
 * - removed front face hair completely
 * - added realistic mustache only
 * - hyper-realistic proportions and textures
 * - enhanced lighting for depth
 */
const ANIMATION_SPEED = 0.35
const HAIR_FILLER_COUNT = 0 // No front face hair
const MAX_ROT_Y = 0.35
const MAX_ROT_X = 0.25
const HEAD_SCALE = 0.65
const SCROLL_SENSITIVITY = 1.5
const HAND_MOVEMENT_MULTIPLIER = 3.0

function Head({ scrollRef }: HeadProps) {
  const group = useRef<THREE.Group | null>(null)
  const headPivot = useRef<THREE.Group | null>(null)
  const leftEye = useRef<THREE.Group | null>(null)
  const rightEye = useRef<THREE.Group | null>(null)
  const handRef = useRef<THREE.Group | null>(null)
  const mouseTarget = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Hand input state - increased movement range
  const handTarget = useRef(0)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handTarget.current = -0.45 * HAND_MOVEMENT_MULTIPLIER
      if (e.key === "ArrowRight") handTarget.current = 0.45 * HAND_MOVEMENT_MULTIPLIER
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

  // Hair puffs - ONLY back of head, NO front face hair
  const hairPuffs = useMemo(() => {
    const puffs: { pos: [number, number, number]; r: number; tone: number }[] =
      []

    // Back anchors only - strictly back hemisphere (z < -0.3)
    const anchors: [number, number, number, number][] = [
      [0.0, 0.95, -0.55, 0.36],
      [-0.5, 0.88, -0.45, 0.34],
      [0.5, 0.88, -0.45, 0.34],
      [-0.75, 0.65, -0.35, 0.32],
      [0.75, 0.65, -0.35, 0.32],
      [0.0, 1.1, -0.65, 0.34],
      [-0.3, 1.05, -0.6, 0.3],
      [0.3, 1.05, -0.6, 0.3],
    ]
    for (const [x, y, z, r] of anchors) {
      puffs.push({ pos: [x, y, z], r, tone: 0.95 + Math.random() * 0.06 })
    }

    // Back-only filler curls - strictly z < -0.2
    for (let i = 0; i < 30; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.85
      const radius = 1.0 + Math.random() * 0.15
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi) + 0.1
      const z = -(radius * Math.sin(phi) * Math.sin(theta) + 0.4) // Force back
      
      // Only deep back hemisphere
      if (z > -0.2) continue
      
      puffs.push({
        pos: [x, y, z],
        r: 0.12 + Math.random() * 0.07,
        tone: 0.88 + Math.random() * 0.16,
      })
    }

    // Tight curls on back top only
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2
      const r = 0.5 + Math.random() * 0.15
      puffs.push({
        pos: [Math.cos(a) * r, 1.08 + Math.random() * 0.08, -Math.sin(a) * r * 0.75],
        r: 0.08 + Math.random() * 0.04,
        tone: 0.92 + Math.random() * 0.12,
      })
    }

    return puffs
  }, [])

  useFrame((state, delta) => {
    const rawDt = Math.min(delta, 0.05)
    const dt = rawDt * ANIMATION_SPEED
    const scroll = scrollRef.current

    // Pointer smoothing
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

    // Group follow scroll - shorter range
    if (group.current) {
      const targetRotY = THREE.MathUtils.clamp(
        scroll * Math.PI * 0.4 * SCROLL_SENSITIVITY, // Reduced from 0.6
        -MAX_ROT_Y,
        MAX_ROT_Y,
      )
      const targetZ = -0.15 + scroll * 0.15 // Reduced movement
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

    // Eyes follow pointer
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

    // Hand with increased movement
    if (handRef.current) {
      const hx = THREE.MathUtils.damp(
        handRef.current.position.x,
        handTarget.current,
        6,
        dt,
      )
      handRef.current.position.x = hx
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

  // Ultra-realistic materials
  const skinColor = "#e8a574"
  const skin = (
    <meshStandardMaterial
      color={skinColor}
      roughness={0.55}
      metalness={0.01}
    />
  )
  const skinNose = <meshStandardMaterial color="#d89565" roughness={0.58} />
  const cheekMat = (
    <meshStandardMaterial color="#e88a6a" roughness={0.75} transparent opacity={0.6} />
  )
  const browMat = <meshStandardMaterial color="#1f1510" roughness={0.85} />
  const mustacheMat = <meshStandardMaterial color="#3d2817" roughness={0.8} metalness={0.05} />
  const lipMat = <meshStandardMaterial color="#c8655a" roughness={0.55} />
  const irisMat = <meshStandardMaterial color="#6b3c1a" roughness={0.45} />
  const pupilMat = <meshStandardMaterial color="#1a1410" roughness={0.15} />
  const eyeWhite = <meshStandardMaterial color="#f5f2ec" roughness={0.25} />

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <group ref={headPivot} scale={HEAD_SCALE}>
        {/* Head - realistic proportions */}
        <mesh castShadow receiveShadow scale={[1.0, 1.08, 0.95]}>
          <sphereGeometry args={[1, 40, 40]} />
          {skin}
        </mesh>

        {/* Jaw - realistic */}
        <mesh position={[0, -0.6, 0.2]} scale={[0.68, 0.48, 0.68]}>
          <sphereGeometry args={[1, 32, 32]} />
          {skin}
        </mesh>

        {/* Cheeks - subtle blush */}
        <mesh position={[-0.5, -0.05, 0.82]} rotation={[0, -0.4, 0]} scale={[0.17, 0.12, 0.035]}>
          <sphereGeometry args={[1, 24, 24]} />
          {cheekMat}
        </mesh>
        <mesh position={[0.5, -0.05, 0.82]} rotation={[0, 0.4, 0]} scale={[0.17, 0.12, 0.035]}>
          <sphereGeometry args={[1, 24, 24]} />
          {cheekMat}
        </mesh>

        {/* Brows - detailed */}
        <mesh position={[-0.32, 0.4, 0.9]} rotation={[0, -0.08, 0.2]} scale={[0.24, 0.06, 0.06]}>
          <sphereGeometry args={[1, 20, 20]} />
          {browMat}
        </mesh>
        <mesh position={[0.32, 0.4, 0.9]} rotation={[0, 0.08, -0.2]} scale={[0.24, 0.06, 0.06]}>
          <sphereGeometry args={[1, 20, 20]} />
          {browMat}
        </mesh>

        {/* Eyes - realistic and detailed */}
        <group ref={leftEye} position={[-0.3, 0.22, 0.88]}>
          <mesh>
            <sphereGeometry args={[0.165, 32, 32]} />
            {eyeWhite}
          </mesh>
          <mesh position={[0, -0.008, 0.128]}>
            <sphereGeometry args={[0.1, 24, 24]} />
            {irisMat}
          </mesh>
          <mesh position={[0, -0.008, 0.165]}>
            <sphereGeometry args={[0.058, 18, 18]} />
            {pupilMat}
          </mesh>
          <mesh position={[0.02, 0.015, 0.19]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
          </mesh>
        </group>

        <group ref={rightEye} position={[0.3, 0.22, 0.88]}>
          <mesh>
            <sphereGeometry args={[0.165, 32, 32]} />
            {eyeWhite}
          </mesh>
          <mesh position={[0, -0.008, 0.128]}>
            <sphereGeometry args={[0.1, 24, 24]} />
            {irisMat}
          </mesh>
          <mesh position={[0, -0.008, 0.165]}>
            <sphereGeometry args={[0.058, 18, 18]} />
            {pupilMat}
          </mesh>
          <mesh position={[-0.02, 0.015, 0.19]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
          </mesh>
        </group>

        {/* Nose - detailed */}
        <mesh position={[0, -0.02, 1.02]} scale={[0.082, 0.072, 0.082]}>
          <sphereGeometry args={[1, 22, 22]} />
          {skinNose}
        </mesh>

        {/* Nostrils */}
        <mesh position={[-0.08, -0.08, 1.08]} scale={[0.02, 0.018, 0.015]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#8b5a3c" roughness={0.9} />
        </mesh>
        <mesh position={[0.08, -0.08, 1.08]} scale={[0.02, 0.018, 0.015]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#8b5a3c" roughness={0.9} />
        </mesh>

        {/* Realistic Mustache - main */}
        <mesh position={[0, -0.08, 1.0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.18, 0.022, 8, 32]} />
          {mustacheMat}
        </mesh>
        {/* Mustache curl left */}
        <mesh position={[-0.22, -0.06, 0.94]} rotation={[0, 0.35, -0.12]}>
          <torusGeometry args={[0.09, 0.019, 6, 20]} />
          {mustacheMat}
        </mesh>
        {/* Mustache curl right */}
        <mesh position={[0.22, -0.06, 0.94]} rotation={[0, -0.35, 0.12]}>
          <torusGeometry args={[0.09, 0.019, 6, 20]} />
          {mustacheMat}
        </mesh>

        {/* Lips */}
        <mesh position={[0, -0.28, 0.92]} rotation={[Math.PI / 2 - 0.25, 0, 0]} scale={[0.98, 0.98, 0.52]}>
          <torusGeometry args={[0.11, 0.02, 8, 28, Math.PI]} />
          {lipMat}
        </mesh>

        {/* Back-of-head hair ONLY - strictly no front face */}
        {hairPuffs.map((p, i) => (
          <mesh key={`h-${i}`} position={p.pos} castShadow>
            <sphereGeometry args={[p.r, 14, 14]} />
            <meshStandardMaterial
              color={p.tone < 1 ? "#2d1a0f" : "#3d2817"}
              roughness={0.82}
              metalness={0.03}
            />
          </mesh>
        ))}

        {/* Extended hand mesh with increased movement */}
        <group ref={handRef} position={[0, -0.15, 0.9]}>
          <mesh position={[0.35, 0, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.22, 0.08, 0.08]} />
            <meshStandardMaterial color="#e8a574" roughness={0.68} />
          </mesh>
          {/* thumb */}
          <mesh position={[0.52, 0.025, 0.025]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[0.08, 0.025, 0.025]} />
            <meshStandardMaterial color="#e8a574" roughness={0.68} />
          </mesh>
          {/* fingers */}
          <mesh position={[0.55, -0.02, -0.02]} rotation={[0.15, 0, -0.1]}>
            <boxGeometry args={[0.06, 0.04, 0.03]} />
            <meshStandardMaterial color="#e8a574" roughness={0.68} />
          </mesh>
        </group>
      </group>

      {/* Neck - improved */}
      <mesh position={[0, -1.05, 0.12]} scale={HEAD_SCALE}>
        <cylinderGeometry args={[0.34, 0.38, 0.5, 20]} />
        {skin}
      </mesh>

      {/* Soft rim glow */}
      <mesh position={[0, 0.1, -1.6]}>
        <circleGeometry args={[1.7, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

export function IdentityScene({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>
}) {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.12, 3.8]} fov={34} />

      {/* Enhanced lighting for realism */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4.5, 3.5]} intensity={1.1} castShadow />
      <pointLight position={[-2.5, 1.5, -1]} intensity={1.3} color="#10b981" />
      <pointLight position={[2.2, -0.6, 2]} intensity={0.7} color="#fde7d2" />
      <pointLight position={[0, 0.5, 2.5]} intensity={0.4} color="#fff5f0" />

      <Suspense fallback={null}>
        <Float speed={0.18} rotationIntensity={0.02} floatIntensity={0.06}>
          <Head scrollRef={scrollRef} />
        </Float>

        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.4}
          scale={8}
          blur={2.5}
          far={3}
          color="#000000"
        />

        <Environment preset="studio" environmentIntensity={0.5} />
      </Suspense>
    </Canvas>
  )
}

// ...existing code...