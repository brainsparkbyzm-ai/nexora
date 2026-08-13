/**
 * Static fallback for the 3D intelligence orb. Rendered when WebGL is
 * unavailable/disabled and as the low-power/reduced-motion default, so the
 * hero (and the rest of the page) never depends on 3D rendering to work
 * (see docs/ARCHITECTURE.md §68).
 */
export function HeroFallback() {
	return (
		<div className="relative mx-auto aspect-square w-full max-w-lg" aria-hidden="true">
			<div className="absolute inset-0 rounded-full bg-gradient-to-br from-nexora-blue/30 via-nexora-cyan/20 to-nexora-violet/20 blur-2xl animate-orb-pulse" />
			<div className="nexora-glass absolute inset-8 rounded-full border border-nexora-border" />
			<div className="absolute inset-16 rounded-full border border-nexora-cyan/30" />
			<div className="absolute inset-24 rounded-full border border-nexora-blue/40" />
		</div>
	)
}
