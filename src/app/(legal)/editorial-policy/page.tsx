import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Editorial Policy",
	description: "How NEXORA researches, writes, reviews and corrects its content.",
	path: "/editorial-policy",
})

export default function EditorialPolicyPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Editorial Policy</h1>
			<h2>Independence</h2>
			<p>
				Our editorial team decides what to cover and how to cover it independently of advertisers, affiliate
				partners and sponsors. Commercial relationships never determine our ratings or recommendations.
			</p>
			<h2>Sourcing &amp; accuracy</h2>
			<p>
				We prioritize original research, hands-on testing, and verifiable sources. We do not publish fabricated
				statistics, fake reviews, or unsupported claims.
			</p>
			<h2>Reviews &amp; ratings</h2>
			<p>
				AI tool reviews reflect direct testing by our editorial team against a consistent set of criteria (ease of
				use, capability, pricing, and support). Ratings are never purchased.
			</p>
			<h2>Corrections</h2>
			<p>If you spot an error, contact editorial@nexora.ai and we will review and correct it promptly.</p>
		</div>
	)
}
