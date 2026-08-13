import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = buildMetadata({
	title: "About NEXORA",
	description: "NEXORA is an independent publication covering AI agents, automation and the future of work.",
	path: "/about",
})

export default function AboutPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>About {siteConfig.name}</h1>
			<p>
				{siteConfig.name} is an independent technology publication covering AI agents, automation, AI tools and
				the future of work. We investigate and explain how artificial intelligence is changing the way people and
				businesses operate — through original reporting, hands-on tool testing, and practical guides.
			</p>
			<h2>What we cover</h2>
			<p>
				AI agents, automation systems, productivity tools, business AI use cases, software reviews, tool
				comparisons, tutorials and original research.
			</p>
			<h2>Editorial independence</h2>
			<p>
				Our reviews and recommendations are based on independent testing and analysis. Some articles contain
				affiliate links; see our <a href="/affiliate-disclosure">Affiliate Disclosure</a> and{" "}
				<a href="/editorial-policy">Editorial Policy</a> for details.
			</p>
		</div>
	)
}
