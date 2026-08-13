import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Affiliate Disclosure",
	description: "How NEXORA uses affiliate links, and how that never affects our editorial judgment.",
	path: "/affiliate-disclosure",
})

export default function AffiliateDisclosurePage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Affiliate Disclosure</h1>
			<p>
				Some links to AI tools on NEXORA are affiliate links. If you sign up or make a purchase through one of
				these links, we may earn a commission at no additional cost to you.
			</p>
			<p>
				Affiliate relationships never influence which tools we cover, how we rate them, or what we say in our
				reviews. See our <a href="/editorial-policy">Editorial Policy</a> for more.
			</p>
		</div>
	)
}
