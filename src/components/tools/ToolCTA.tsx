import Link from "next/link"

/** Lightweight internal-navigation CTA used from article bodies/related-tools rails (contrast with AffiliateButton, which is an outbound link). */
export function ToolCTA({ href, label = "See full review" }: { href: string; label?: string }) {
	return (
		<Link
			href={href}
			className="inline-flex items-center gap-1 text-caption font-semibold text-nexora-cyan hover:opacity-80"
		>
			{label} &rarr;
		</Link>
	)
}

export function ReviewCTA({ href }: { href: string }) {
	return <ToolCTA href={href} label="Read the full review" />
}
