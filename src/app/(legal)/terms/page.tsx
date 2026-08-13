import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Terms of Service",
	description: "Terms governing use of the NEXORA website.",
	path: "/terms",
})

export default function TermsPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Terms of Service</h1>
			<p>
				By using NEXORA, you agree to use the site lawfully and not to misuse, scrape at scale, or attempt to
				compromise the security of the site or its underlying systems.
			</p>
			<h2>Content</h2>
			<p>
				All articles, reviews and comparisons are provided for informational purposes and do not constitute
				financial, legal or professional advice.
			</p>
			<h2>Changes</h2>
			<p>We may update these terms from time to time; continued use of the site constitutes acceptance.</p>
		</div>
	)
}
