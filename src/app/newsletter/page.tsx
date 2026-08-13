import type { Metadata } from "next"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Subscribe to the NEXORA Briefing",
	description: "Get the most important AI agents, tools and workflows in your inbox weekly.",
	path: "/newsletter",
})

export default function NewsletterPage() {
	return (
		<div className="mx-auto flex w-full max-w-article flex-col items-center gap-6 px-4 py-24 text-center">
			<h1 className="text-h1 text-nexora-text">The NEXORA Briefing</h1>
			<p className="max-w-md text-body text-nexora-muted">
				One email, once a week. The most important AI agents, tools and workflows — explained clearly, without the
				hype.
			</p>
			<NewsletterForm placement="page" />
		</div>
	)
}
