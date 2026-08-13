"use client"

import dynamic from "next/dynamic"
import { Suspense, useEffect, useState } from "react"
import { HeroFallback } from "@/components/hero/HeroFallback"

// Dynamically imported with ssr:false: three.js/R3F only ever load in the
// browser, and only on pages that render <Hero3D /> (currently just the
// homepage) — see docs/ARCHITECTURE.md §33 and §46.
const Hero3DScene = dynamic(
	() => import("@/components/hero/Hero3DScene").then((m) => m.Hero3DScene),
	{ ssr: false, loading: () => <HeroFallback /> },
)

function supportsWebGL(): boolean {
	try {
		const canvas = document.createElement("canvas")
		return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
	} catch {
		return false
	}
}

export function Hero3D() {
	const [canRender3D, setCanRender3D] = useState(false)
	const [quality, setQuality] = useState<"high" | "low">("high")

	useEffect(() => {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		const isSmallScreen = window.matchMedia("(max-width: 767px)").matches
		const lowMemory =
			"deviceMemory" in navigator && (navigator as unknown as { deviceMemory?: number }).deviceMemory != null
				? (navigator as unknown as { deviceMemory: number }).deviceMemory <= 4
				: false

		if (reducedMotion || !supportsWebGL()) {
			setCanRender3D(false)
			return
		}
		setCanRender3D(true)
		setQuality(isSmallScreen || lowMemory ? "low" : "high")
	}, [])

	if (!canRender3D) return <HeroFallback />

	return (
		<Suspense fallback={<HeroFallback />}>
			<div className="relative mx-auto aspect-square w-full max-w-lg">
				<Hero3DScene quality={quality} />
			</div>
		</Suspense>
	)
}
