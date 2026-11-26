import type { Metadata } from "next"

import { ArticleGrid } from "@/components/article/ArticleGrid"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { listLatestArticles } from "@/services/articleService"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"

export const revalidate = 300

export const metadata: Metadata = buildMetadata({
	title: "All Articles — AI Guides, Research & Analysis",
	description:
		"Explore the latest NEXORA articles on AI assistants, automation, business AI, productivity and the future of work.",
	path: "/articles",
})

export default async function ArticlesPage() {
	const articles = await listLatestArticles(50)

	return (
		<div className="relative min-h-screen overflow-hidden pb-24 pt-8 sm:pt-12">
			<div
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute left-[-14rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-nexora-blue/10 blur-[130px]" />
				<div className="absolute right-[-14rem] top-[18%] h-[30rem] w-[30rem] rounded-full bg-nexora-turquoise/10 blur-[130px]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(7,16,20,0.58)_100%)]" />
			</div>

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						breadcrumbSchema([
							{ name: "Home", path: "/" },
							{ name: "Articles", path: "/articles" },
						]),
					),
				}}
			/>

			<div className="mx-auto flex w-full max-w-content flex-col gap-12 px-4 sm:gap-16">
				<section className="nexora-card nexora-3d relative overflow-hidden rounded-card border border-white/5 px-5 py-12 text-center sm:px-10 sm:py-16">
					<div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexora-turquoise/50 to-transparent" />
					<div className="relative z-10">
						<span className="nexora-badge inline-flex rounded-pill border border-nexora-turquoise/20 bg-nexora-turquoise/5 px-4 py-1.5 text-metadata font-semibold uppercase tracking-[0.14em] text-nexora-cyan">
							NEXORA Library
						</span>
						<h1 className="nexora-glow-text mt-4 text-h1 text-nexora-text">
							All Articles
						</h1>
						<p className="mx-auto mt-4 max-w-2xl text-body leading-relaxed text-nexora-muted">
							Explore practical guides, research and analysis on AI assistants,
							automation, business AI and the future of work.
						</p>
					</div>
				</section>

				<section className="nexora-section">
					<SectionHeader title="Latest Articles" />
					<div className="nexora-article-card">
						<ArticleGrid articles={articles} />
					</div>
				</section>
			</div>
		</div>
	)
}
