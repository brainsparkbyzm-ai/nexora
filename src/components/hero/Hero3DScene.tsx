"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

/**
 * The actual Three.js/R3F scene. Only ever loaded client-side via a dynamic
 * import in Hero3D.tsx — never imported directly by a page — so `three` /
 * `@react-three/*` never inflate the shared/server bundle and never block
 * article or admin pages from loading (see docs/ARCHITECTURE.md §33).
 */

function ParticleField({ count }: { count: number }) {
	const pointsRef = useRef<THREE.Points>(null)

	const positions = useMemo(() => {
		const array = new Float32Array(count * 3)
		for (let i = 0; i < count; i++) {
			const radius = 1.6 + Math.random() * 0.15
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(2 * Math.random() - 1)
			array[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
			array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
			array[i * 3 + 2] = radius * Math.cos(phi)
		}
		return array
	}, [count])

	useFrame((_, delta) => {
		if (pointsRef.current) {
			pointsRef.current.rotation.y += delta * 0.06
			pointsRef.current.rotation.x += delta * 0.015
		}
	})

	return (
		<Points ref={pointsRef} positions={positions} stride={3}>
			<PointMaterial
				transparent
				color="#7fd8ff"
				size={0.012}
				sizeAttenuation
				depthWrite={false}
				opacity={0.85}
			/>
		</Points>
	)
}

function OrbitRing({ radius, tilt, color }: { radius: number; tilt: number; color: string }) {
	const ref = useRef<THREE.Mesh>(null)
	useFrame((_, delta) => {
		if (ref.current) ref.current.rotation.z += delta * 0.08
	})
	return (
		<mesh ref={ref} rotation={[tilt, 0, 0]}>
			<torusGeometry args={[radius, 0.004, 16, 128]} />
			<meshBasicMaterial color={color} transparent opacity={0.35} />
		</mesh>
	)
}

export function Hero3DScene({ quality = "high" }: { quality?: "high" | "low" }) {
	const particleCount = quality === "high" ? 2200 : 700

	return (
		<Canvas
			dpr={quality === "high" ? [1, 1.5] : 1}
			gl={{ antialias: quality === "high", powerPreference: "low-power" }}
			camera={{ position: [0, 0, 4.2], fov: 42 }}
		>
			<ambientLight intensity={0.4} />
			<pointLight position={[3, 2, 3]} intensity={40} color="#3b82f6" />
			<pointLight position={[-3, -2, -2]} intensity={20} color="#22d3ee" />

			<mesh>
				<sphereGeometry args={[1.4, 48, 48]} />
				<meshPhysicalMaterial
					color="#0e1422"
					transmission={0.9}
					roughness={0.15}
					thickness={0.6}
					clearcoat={1}
					envMapIntensity={1.2}
				/>
			</mesh>

			<ParticleField count={particleCount} />
			<OrbitRing radius={1.85} tilt={0.6} color="#22d3ee" />
			{quality === "high" ? <OrbitRing radius={2.1} tilt={-0.4} color="#7c6cf6" /> : null}
		</Canvas>
	)
}
