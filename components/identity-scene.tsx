"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Environment,
  ContactShadows,
  Float,
  PerspectiveCamera,
} from "@react-three/drei"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"

type HeadProps = {
  scrollRef: React.MutableRefObject<number>
}

/**
 * Stylized Pixar-like cartoon character head:
 *  - round peachy face with rosy cheeks
 *  - big expressive eyes (sclera + warm brown iris + black pupil + spec)
 *  - thick dark brown eyebrows
 *  - small button nose
 *  - small gentle smile
 *  - bouncy chocolate-brown curls built from clustered "puff" balls
 *  - small thin neck (no torso/turtleneck)
 *  - tracks cursor + scroll for life-like motion
 */
function Head({ scrollRef }: HeadProps) {
  const group = useRef<THREE.Group>(null)
  const headPivot = useRef<THREE.Group>(null)
  const leftEye = useRef<THREE.Group>(null)
  const rightEye = useRef<THREE.Group>(null)
  const mouseTarget = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Bouncy hair: cluster of "puff" spheres on the upper hemisphere with
  // distinct big volumes (front, top, sides, back) — like the reference image.
  const hairPuffs = useMemo(() => {
    const puffs: { pos: [number, number, number]; r: number; tone: number }[] =
      []

    // Big volumetric anchor puffs — these define the silhouette
    const anchors: [number, number, number, number][] = [
      // [x, y, z, r]
      [0.0, 0.95, 0.45, 0.4], // top-front
      [-0.45, 0.92, 0.35, 0.38], // top-left
      [0.45, 0.92, 0.35, 0.38], // top-right
      [-0.7, 0.7, 0.15, 0.36], // upper-left
      [0.7, 0.7, 0.15, 0.36], // upper-right
      [0.0, 1.05, 0.05, 0.36], // crown
      [-0.55, 0.95, -0.15, 0.34], // back-left
      [0.55, 0.95, -0.15, 0.34], // back-right
      [0.0, 0.85, -0.45, 0.36], // back
      [-0.85, 0.45, 0.0, 0.3], // side-left
      [0.85, 0.45, 0.0, 0.3], // side-right
      [-0.35, 0.55, 0.78, 0.22], // front-left fringe
      [0.35, 0.55, 0.78, 0.22], // front-right fringe
      [0.0, 0.6, 0.85, 0.2], // forehead curl
    ]
    for (const [x, y, z, r] of anchors) {
      puffs.push({ pos: [x, y, z], r, tone: 0.95 + Math.random() * 0.1 })
    }

    // Filler curls — many smaller spheres scattered on the upper hemisphere
    for (let i = 0; i < 110; i++) {
      const u = Math.random()
      const v = Math.random() * 0.55 + 0.05
      const theta = u * Math.PI * 2
      const phi = Math.acos(1 - 2 * v)
      const radius = 1.05 + Math.random() * 0.18
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi) + 0.1
      const z = radius * Math.sin(phi) * Math.sin(theta) - 0.02
      // Skip the face area — keep a clean forehead hairline
      const isFace = z > 0.55 && y < 0.55
      if (isFace) continue
      puffs.push({
        pos: [x, y, z],
        r: 0.13 + Math.random() * 0.09,
        tone: 0.85 + Math.random() * 0.25,
      })
    }

    // Tiny tight curls on top to add the "spiral" feel
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2
      const r = 0.5 + Math.random() * 0.25
      puffs.push({
        pos: [Math.cos(a) * r, 1.05 + Math.random() * 0.1, Math.sin(a) * r * 0.7],
        r: 0.085 + Math.random() * 0.05,
        tone: 0.95 + Math.random() * 0.15,
      })
    }

    return puffs
  }, [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const scroll = scrollRef.current

    // Smoothly follow the pointer.
    const px = (state.pointer.x * viewport.width) / 6
    const py = (state.pointer.y * viewport.height) / 6
    mouseTarget.current.x = THREE.MathUtils.damp(
      mouseTarget.current.x,
      px,
      5,
      dt,
    )
    mouseTarget.current.y = THREE.MathUtils.damp(
      mouseTarget.current.y,
      py,
      5,
      dt,
    )

    if (group.current) {
      const targetRotY = scroll * Math.PI * 1.0
      const targetZ = -0.2 + scroll * 0.5
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRotY,
        3,
        dt,
      )
      group.current.position.z = THREE.MathUtils.damp(
        group.current.position.z,
        targetZ,
        3,
        dt,
      )
    }

    if (headPivot.current) {
      headPivot.current.rotation.y = THREE.MathUtils.damp(
        headPivot.current.rotation.y,
        mouseTarget.current.x * 0.45,
        4,
        dt,
      )
      headPivot.current.rotation.x = THREE.MathUtils.damp(
        headPivot.current.rotation.x,
        -mouseTarget.current.y * 0.3,
        4,
        dt,
      )
    }

    // Big eyes track the cursor a little for charm.
    const eyeRot = mouseTarget.current.x * 0.3
    const eyeTilt = -mouseTarget.current.y * 0.2
    if (leftEye.current) {
      leftEye.current.rotation.y = THREE.MathUtils.damp(
        leftEye.current.rotation.y,
        eyeRot,
        7,
        dt,
      )
      leftEye.current.rotation.x = THREE.MathUtils.damp(
        leftEye.current.rotation.x,
        eyeTilt,
        7,
        dt,
      )
    }
    if (rightEye.current) {
      rightEye.current.rotation.y = THREE.MathUtils.damp(
        rightEye.current.rotation.y,
        eyeRot,
        7,
        dt,
      )
      rightEye.current.rotation.x = THREE.MathUtils.damp(
        rightEye.current.rotation.x,
        eyeTilt,
        7,
        dt,
      )
    }
  })

  // Materials — soft Pixar / animation palette
  const skinColor = "#f3b89a" // peachy
  const skin = (
    <meshPhysicalMaterial
      color={skinColor}
      roughness={0.5}
      sheen={1}
      sheenColor="#ffd0b8"
      sheenRoughness={0.6}
      clearcoat={0.15}
      clearcoatRoughness={0.55}
    />
  )
  const skinNose = (
    <meshPhysicalMaterial
      color="#eba88b"
      roughness={0.55}
      sheen={1}
      sheenColor="#ffd0b8"
      sheenRoughness={0.6}
      clearcoat={0.18}
      clearcoatRoughness={0.5}
    />
  )
  const cheekMat = (
    <meshStandardMaterial
      color="#f08a76"
      roughness={0.7}
      transparent
      opacity={0.55}
    />
  )
  const browMat = (
    <meshStandardMaterial color="#2a1a10" roughness={0.7} metalness={0} />
  )
  const lipMat = <meshStandardMaterial color="#c4584b" roughness={0.45} />
  const irisMat = (
    <meshStandardMaterial color="#7a3e15" roughness={0.35} metalness={0.05} />
  )
  const pupilMat = (
    <meshStandardMaterial color="#0b0703" roughness={0.2} metalness={0} />
  )
  const eyeWhite = (
    <meshPhysicalMaterial
      color="#fbf8f2"
      roughness={0.18}
      clearcoat={0.6}
      clearcoatRoughness={0.2}
    />
  )

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <group ref={headPivot}>
        {/* Round head — slightly taller than wide for cute proportions */}
        <mesh castShadow receiveShadow scale={[1.0, 1.06, 1.0]}>
          <sphereGeometry args={[1, 64, 64]} />
          {skin}
        </mesh>

        {/* Soft jaw pad — subtle chin */}
        <mesh
          position={[0, -0.55, 0.25]}
          scale={[0.7, 0.5, 0.7]}
          castShadow
        >
          <sphereGeometry args={[1, 48, 48]} />
          {skin}
        </mesh>

        {/* Rosy cheeks — flat-feeling discs */}
        <mesh
          position={[-0.5, -0.1, 0.78]}
          rotation={[0, -0.4, 0]}
          scale={[0.18, 0.13, 0.04]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          {cheekMat}
        </mesh>
        <mesh
          position={[0.5, -0.1, 0.78]}
          rotation={[0, 0.4, 0]}
          scale={[0.18, 0.13, 0.04]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          {cheekMat}
        </mesh>

        {/* Eyebrows — thick, slightly arched */}
        <mesh
          position={[-0.3, 0.42, 0.92]}
          rotation={[0, -0.05, 0.18]}
          scale={[0.22, 0.06, 0.06]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          {browMat}
        </mesh>
        <mesh
          position={[0.3, 0.42, 0.92]}
          rotation={[0, 0.05, -0.18]}
          scale={[0.22, 0.06, 0.06]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          {browMat}
        </mesh>

        {/* Big eyes — cartoon-large sclera + iris + pupil + spec */}
        <group ref={leftEye} position={[-0.3, 0.22, 0.85]}>
          <mesh>
            <sphereGeometry args={[0.18, 40, 40]} />
            {eyeWhite}
          </mesh>
          {/* iris */}
          <mesh position={[0, -0.005, 0.13]}>
            <sphereGeometry args={[0.105, 32, 32]} />
            {irisMat}
          </mesh>
          {/* pupil */}
          <mesh position={[0, -0.005, 0.165]}>
            <sphereGeometry args={[0.06, 24, 24]} />
            {pupilMat}
          </mesh>
          {/* big spec highlight */}
          <mesh position={[0.03, 0.04, 0.18]}>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.9}
            />
          </mesh>
          {/* small secondary spec */}
          <mesh position={[-0.025, -0.03, 0.18]}>
            <sphereGeometry args={[0.01, 12, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
        <group ref={rightEye} position={[0.3, 0.22, 0.85]}>
          <mesh>
            <sphereGeometry args={[0.18, 40, 40]} />
            {eyeWhite}
          </mesh>
          <mesh position={[0, -0.005, 0.13]}>
            <sphereGeometry args={[0.105, 32, 32]} />
            {irisMat}
          </mesh>
          <mesh position={[0, -0.005, 0.165]}>
            <sphereGeometry args={[0.06, 24, 24]} />
            {pupilMat}
          </mesh>
          <mesh position={[0.03, 0.04, 0.18]}>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.9}
            />
          </mesh>
          <mesh position={[-0.025, -0.03, 0.18]}>
            <sphereGeometry args={[0.01, 12, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>

        {/* Tiny button nose */}
        <mesh position={[0, 0.0, 1.0]} scale={[0.085, 0.075, 0.085]}>
          <sphereGeometry args={[1, 28, 28]} />
          {skinNose}
        </mesh>

        {/* Small gentle smile — a flat torus arc, slightly tilted */}
        <mesh
          position={[0, -0.27, 0.92]}
          rotation={[Math.PI / 2 - 0.25, 0, 0]}
          scale={[1, 1, 0.55]}
        >
          <torusGeometry args={[0.11, 0.018, 12, 32, Math.PI]} />
          {lipMat}
        </mesh>

        {/* Bouncy curly hair — many rounded "puff" spheres */}
        {hairPuffs.map((p, i) => (
          <mesh key={`h-${i}`} position={p.pos} castShadow>
            <sphereGeometry args={[p.r, 16, 16]} />
            <meshStandardMaterial
              color={
                p.tone < 1
                  ? // slightly darker variant
                    "#3a2110"
                  : "#4a2a18"
              }
              roughness={0.85}
              metalness={0.04}
            />
          </mesh>
        ))}
      </group>

      {/* Tiny thin neck stub (matches the reference) */}
      <mesh position={[0, -1.05, 0.15]} castShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.45, 32]} />
        {skin}
      </mesh>

      {/* Soft emerald rim glow plate behind head */}
      <mesh position={[0, 0.1, -1.6]}>
        <circleGeometry args={[1.7, 64]} />
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
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.2, 4.6]} fov={36} />

      {/* Bright, friendly studio light */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[3.5, 5, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[-3.5, 1.6, -1.5]}
        intensity={2.0}
        color="#10b981"
      />
      <pointLight
        position={[3, -1, 2.5]}
        intensity={0.8}
        color="#fde7d2"
      />
      <spotLight
        position={[0, 4, 5]}
        angle={0.6}
        penumbra={0.8}
        intensity={1.1}
        color="#ffffff"
      />

      <Suspense fallback={null}>
        <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.2}>
          <Head scrollRef={scrollRef} />
        </Float>

        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.45}
          scale={9}
          blur={2.6}
          far={3}
          color="#000000"
        />

        <Environment preset="studio" environmentIntensity={0.55} />
      </Suspense>
    </Canvas>
  )
}
