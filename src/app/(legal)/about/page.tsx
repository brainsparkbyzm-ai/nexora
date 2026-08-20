import Link from "next/link"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = buildMetadata({
	title: "About NEXORA",
	description:
		"NEXORA is an independent technology publication covering AI agents, automation, AI tools, productivity, business AI, and the future of work.",
	path: "/about",
})

export default function AboutPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>About {siteConfig.name}</h1>

			<p>
				<strong>Last updated: August 20, 2026</strong>
			</p>

			<p>
				{siteConfig.name} is an independent technology publication
				focused on artificial intelligence, software, and the future of
				work. We explain emerging technologies and practical tools through
				research, analysis, hands-on testing, and useful guides.
			</p>

			<h2>What We Cover</h2>

			<p>
				NEXORA covers AI agents, automation, AI tools, productivity
				software, business AI, software reviews, tool comparisons,
				tutorials, and practical guides.
			</p>

			<h2>Our Approach</h2>

			<p>
				We aim to make complex technology easier to understand and useful
				in real-world situations. Our content may include original
				research, product testing, comparisons, analysis, and information
				from publicly available and official sources.
			</p>

			<h2>Editorial Independence</h2>

			<p>
				Our editorial decisions are independent of advertisers, sponsors,
				and affiliate partners. Commercial relationships do not determine
				our coverage, ratings, reviews, or recommendations.
			</p>

			<p>
				Some NEXORA pages may contain affiliate links. If you make a
				qualifying purchase or take another qualifying action through an
				affiliate link, we may receive a commission at no additional cost
				to you.
			</p>

			<p>
				For more information, read our{" "}
				<Link href="/affiliate-disclosure">
					Affiliate Disclosure
				</Link>{" "}
				and <Link href="/editorial-policy">Editorial Policy</Link>.
			</p>

			<h2>Corrections and Feedback</h2>

			<p>
				We welcome feedback and corrections. If you believe information
				published on NEXORA is inaccurate or outdated, please contact us
				through our <Link href="/contact">Contact page</Link>.
			</p>
		</div>
	)
}
