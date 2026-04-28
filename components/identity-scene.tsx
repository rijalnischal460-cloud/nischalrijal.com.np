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

type SceneProps = {
  scrollRef: React.MutableRefObject<number>
}

const ANIMATION_SPEED = 0.42
const SCROLL_SENSITIVITY = 0.1 // 10% only
const MAX_ROT_Y = 0.08
const MAX_ROT_X = 0.05

function PremiumCore({ scrollRef }: SceneProps) {
  const group = useRef<THREE.Group | null>(null)
  const core = useRef<THREE.Mesh | null>(null)
  const ring1 = useRef<THREE.Mesh | null>(null)
  const ring2 = useRef<THREE.Mesh | null>(null)
  const ring3 = useRef<THREE.Mesh | null>(null)
  const { viewport, pointer, clock } = useThree()

  const starPositions = useMemo(() => {
    const count = 220
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 2.2
      const a = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 2.6
      arr[i * 3 + 0] = Math.cos(a) * r
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = Math.sin(a) * r
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05) * ANIMATION_SPEED
    const t = clock.getElapsedTime()
    const scroll = scrollRef.current

    if (group.current) {
      const targetRotY = THREE.MathUtils.clamp(
        scroll * Math.PI * 0.35 * SCROLL_SENSITIVITY,
        -MAX_ROT_Y,
        MAX_ROT_Y,
      )
      const targetRotX = THREE.MathUtils.clamp(
        -scroll * Math.PI * 0.18 * SCROLL_SENSITIVITY,
        -MAX_ROT_X,
        MAX_ROT_X,
      )
      const targetZ = -0.1 + scroll * 0.012 // very short scroll motion

      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, 8, dt)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotX, 8, dt)
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 8, dt)
    }

    if (core.current) {
      core.current.rotation.y += 0.003
      core.current.rotation.x = Math.sin(t * 0.45) * 0.08
    }

    if (ring1.current) {
      ring1.current.rotation.z += 0.006
      ring1.current.rotation.x = Math.sin(t * 0.8) * 0.12
    }
    if (ring2.current) {
      ring2.current.rotation.y -= 0.005
      ring2.current.rotation.z = Math.cos(t * 0.7) * 0.18
    }
    if (ring3.current) {
      ring3.current.rotation.x += 0.004
      ring3.current.rotation.y = Math.sin(t * 0.6) * 0.15
    }

    // subtle pointer interaction
    if (group.current) {
      const px = (pointer.x * viewport.width) / 10
      const py = (pointer.y * viewport.height) / 10
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, px, 2.8, dt)
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, py, 2.8, dt)
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* glass core */}
      <mesh ref={core} castShadow receiveShadow>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshPhysicalMaterial
          color="#8be9fd"
          roughness={0.08}
          metalness={0.05}
          transmission={0.9}
          thickness={0.9}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* animated rings */}
      <mesh ref={ring1} rotation={[0.25, 0.1, 0]}>
        <torusGeometry args={[1.02, 0.028, 16, 120]} />
        <meshStandardMaterial color="#34d399" emissive="#1f9d7a" emissiveIntensity={0.25} />
      </mesh>

      <mesh ref={ring2} rotation={[-0.6, 0.4, 0.8]}>
        <torusGeometry args={[1.22, 0.02, 16, 140]} />
        <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.2} />
      </mesh>

      <mesh ref={ring3} rotation={[0.9, -0.2, -0.4]}>
        <torusGeometry args={[1.42, 0.015, 16, 150]} />
        <meshStandardMaterial color="#f0abfc" emissive="#a855f7" emissiveIntensity={0.22} />
      </mesh>

      {/* background particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#dbeafe" size={0.02} sizeAttenuation transparent opacity={0.85} />
      </points>

      <mesh position={[0, -1.15, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 1.75, 64]} />
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
      <PerspectiveCamera makeDefault position={[0, 0.05, 4.4]} fov={36} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} />
      <pointLight position={[-2.5, 1.5, -1]} intensity={1.1} color="#22d3ee" />
      <pointLight position={[2.1, -0.8, 2.2]} intensity={0.7} color="#f8fafc" />

      <Suspense fallback={null}>
        <Float speed={0.6} rotationIntensity={0.12} floatIntensity={0.18}>
          <PremiumCore scrollRef={scrollRef} />
        </Float>

        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.32}
          scale={8}
          blur={2.3}
          far={3}
          color="#000000"
        />

        <Environment preset="city" environmentIntensity={0.5} />
      </Suspense>
    </Canvas>
  )
}