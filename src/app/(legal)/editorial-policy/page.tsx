import Link from "next/link"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Editorial Policy",
	description:
		"How NEXORA researches, writes, reviews, sources, and corrects its content.",
	path: "/editorial-policy",
})

export default function EditorialPolicyPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Editorial Policy</h1>

			<p>
				<strong>Last updated: August 20, 2026</strong>
			</p>

			<p>
				NEXORA is committed to publishing useful, accurate, transparent,
				and independently produced technology content for its readers.
			</p>

			<h2>Editorial Independence</h2>

			<p>
				Our editorial team decides what to cover and how to cover it
				independently of advertisers, affiliate partners, and sponsors.
				Commercial relationships do not determine our editorial coverage,
				ratings, rankings, or recommendations.
			</p>

			<h2>Sourcing and Accuracy</h2>

			<p>
				We prioritize original research, hands-on testing, official
				documentation, primary sources, and other verifiable sources.
				We aim to distinguish factual information from analysis and
				editorial opinion.
			</p>

			<p>
				We do not knowingly publish fabricated statistics, fake reviews,
				misleading claims, or unsupported factual statements.
			</p>

			<h2>Reviews and Ratings</h2>

			<p>
				AI tool reviews may include direct testing by our editorial team.
				When we review a product, we consider factors such as ease of use,
				capabilities, reliability, pricing, features, and overall value.
			</p>

			<p>
				Affiliate relationships, advertising arrangements, or payments do
				not determine review scores or recommendations.
			</p>

			<h2>AI-Assisted Content</h2>

			<p>
				Where AI-assisted tools are used during the research, drafting,
				editing, or production process, our editorial team remains
				responsible for reviewing the final published content for accuracy,
				clarity, and usefulness.
			</p>

			<h2>Corrections and Updates</h2>

			<p>
				We make reasonable efforts to correct factual errors when they are
				identified. Published content may also be updated when information,
				pricing, product features, or other relevant details change.
			</p>

			<h2>Reader Feedback</h2>

			<p>
				If you believe an article contains an error or misleading
				information, please contact us through our{" "}
				<Link href="/contact">Contact page</Link>.
			</p>

			<h2>Related Policies</h2>

			<ul>
				<li>
					<Link href="/affiliate-disclosure">
						Affiliate Disclosure
					</Link>
				</li>
				<li>
					<Link href="/privacy">Privacy Policy</Link>
				</li>
				<li>
					<Link href="/terms">Terms of Use</Link>
				</li>
			</ul>
		</div>
	)
}
