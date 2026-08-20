import Link from "next/link"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Affiliate Disclosure",
	description:
		"How NEXORA uses affiliate links and how affiliate relationships do not influence our editorial judgment.",
	path: "/affiliate-disclosure",
})

export default function AffiliateDisclosurePage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Affiliate Disclosure</h1>

			<p>
				<strong>Last updated: August 20, 2026</strong>
			</p>

			<p>
				NEXORA may use affiliate links in some articles, reviews,
				comparisons, and tool recommendations. If you click an affiliate
				link and make a qualifying purchase, subscription, or other
				qualifying action, NEXORA may receive a commission at no additional
				cost to you.
			</p>

			<h2>How Affiliate Links Work</h2>

			<p>
				Affiliate links help support the operation of NEXORA, including
				content creation, research, website maintenance, and editorial
				operations.
			</p>

			<h2>Editorial Independence</h2>

			<p>
				Affiliate relationships do not determine which products or services
				we cover. They do not guarantee positive reviews, ratings, rankings,
				or recommendations.
			</p>

			<p>
				Our editorial decisions are based on factors such as usefulness,
				features, performance, reliability, value, and relevance to our
				readers.
			</p>

			<h2>Transparency</h2>

			<p>
				Where appropriate, affiliate relationships may be disclosed within
				individual articles, reviews, comparisons, or tool pages.
			</p>

			<h2>Questions</h2>

			<p>
				If you have questions about our affiliate relationships or editorial
				practices, please visit our{" "}
				<Link href="/contact">Contact page</Link>.
			</p>

			<p>
				For more information about how NEXORA makes editorial decisions,
				please see our{" "}
				<Link href="/editorial-policy">Editorial Policy</Link>.
			</p>
		</div>
	)
}
