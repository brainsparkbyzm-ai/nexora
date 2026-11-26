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
			<p className="max-w-2xl text-body text-nexora-muted">
				One email, once a week. The most important AI agents, tools and workflows — explained clearly, without the hype.
				A practical briefing for people who want to understand what is changing and decide which developments are worth their attention.
			</p>

			<section className="w-full max-w-2xl rounded-card border border-nexora-border bg-nexora-surface/40 p-6 text-left sm:p-8">
				<h2 className="text-h3 text-nexora-text">What you will find in each issue</h2>
				<ul className="mt-5 space-y-4 text-body leading-relaxed text-nexora-muted">
					<li>
						<strong className="text-nexora-text">Useful AI developments.</strong>{" "}
						A clear explanation of important changes in AI assistants, agents and the tools people use to get work done.
					</li>
					<li>
						<strong className="text-nexora-text">Tools worth understanding.</strong>{" "}
						Practical context on what a tool does, who it may help and where it fits into a real workflow.
					</li>
					<li>
						<strong className="text-nexora-text">Workflows you can apply.</strong>{" "}
						Ideas for using automation and AI to make research, writing, planning and repetitive tasks more manageable.
					</li>
				</ul>
			</section>

			<p className="max-w-2xl text-body leading-relaxed text-nexora-muted">
				The briefing is for curious professionals, creators, builders and teams at any stage of exploring AI.
				You do not need to follow every launch or learn every new tool. The goal is to give you useful context,
				straightforward explanations and a better starting point for deciding what to try next.
			</p>

			<NewsletterForm placement="page" />
		</div>
	)
}
