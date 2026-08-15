import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { AffiliateButton } from "@/components/tools/AffiliateButton"
import { ToolCard } from "@/components/tools/ToolCard"
import { ArticleGrid } from "@/components/article/ArticleGrid"

import { formatRating, formatDate } from "@/lib/utils"
import { getToolReview } from "@/services/toolService"
import {
	buildMetadata,
	breadcrumbSchema,
	softwareApplicationSchema,
	faqSchema,
} from "@/lib/seo"
import { sanitizeHtml } from "@/lib/sanitize"

export const revalidate = 600

type Props = {
	params: Promise<{
		slug: string
	}>
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata> {
	const { slug } = await params
	const tool = await getToolReview(slug)

	if (!tool) {
		return {}
	}

	return buildMetadata({
		title: `${tool.name} Review — Pricing, Pros & Cons`,
		description: tool.description,
		path: `/tools/${tool.slug}`,
	})
}

export default async function ToolReviewPage({ params }: Props) {
	const { slug } = await params
	const tool = await getToolReview(slug)

	if (!tool) {
		notFound()
	}

	const rating = formatRating(tool.rating)

	return (
		<div className="nexora-page relative min-h-screen overflow-hidden pb-24 pt-8 sm:pt-12">
			{/* Ambient background */}
			<div
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute left-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-nexora-blue/10 blur-[140px]" />

				<div className="absolute right-[-180px] top-[18%] h-[500px] w-[500px] rounded-full bg-nexora-turquoise/10 blur-[150px]" />

				<div className="absolute bottom-[5%] left-[30%] h-[420px] w-[420px] rounded-full bg-nexora-vanilla/5 blur-[140px]" />

				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(7,16,20,0.5)_100%)]" />
			</div>

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify([
						breadcrumbSchema([
							{
								name: "Home",
								path: "/",
							},
							{
								name: "AI Tools",
								path: "/tools",
							},
							{
								name: tool.name,
								path: `/tools/${tool.slug}`,
							},
						]),
						...(tool.rating != null
							? [softwareApplicationSchema(tool)]
							: []),
						...(tool.faq.length > 0
							? [faqSchema(tool.faq)]
							: []),
					]),
				}}
			/>

			<main className="mx-auto w-full max-w-hero px-4">
				{/* Breadcrumb-style context */}
				<div className="mb-8 flex flex-wrap items-center gap-2 text-caption text-nexora-muted">
					<span>AI Tools</span>
					<span className="text-nexora-muted-2">/</span>
					<span className="text-nexora-turquoise">
						{tool.category.name}
					</span>
				</div>

				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
					{/* Main content */}
					<div className="min-w-0">
						{/* Hero */}
						<section className="nexora-glass nexora-3d relative overflow-hidden rounded-card border border-nexora-blue/15 p-6 sm:p-8 lg:p-10">
							<div
								className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-nexora-turquoise/10 blur-[90px]"
								aria-hidden="true"
							/>

							<div
								className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-nexora-blue/10 blur-[90px]"
								aria-hidden="true"
							/>

							<div className="relative">
								<div className="mb-5 flex flex-wrap items-center gap-3">
									<span className="nexora-badge rounded-pill border border-nexora-turquoise/20 bg-nexora-turquoise/5 px-3 py-1.5 text-caption font-semibold uppercase tracking-[0.12em] text-nexora-turquoise">
										AI Tool Review
									</span>

									<span className="rounded-pill border border-nexora-border bg-nexora-surface/40 px-3 py-1.5 text-caption text-nexora-muted">
										{tool.category.name}
									</span>
								</div>

								<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
									<div className="min-w-0">
										<h1 className="nexora-glow-text text-h1 text-nexora-text">
											{tool.name}
										</h1>

										<p className="mt-3 max-w-2xl text-body leading-7 text-nexora-muted">
											{tool.description}
										</p>
									</div>

									{rating ? (
										<div className="shrink-0 rounded-card border border-nexora-vanilla/20 bg-nexora-vanilla/5 px-5 py-4 text-center shadow-glow">
											<div className="text-caption uppercase tracking-wide text-nexora-muted">
												NEXORA Rating
											</div>

											<div className="mt-1 text-h3 font-bold text-nexora-vanilla">
												★ {rating}
												<span className="text-small font-medium text-nexora-muted">
													{" "}
													/ 5
												</span>
											</div>
										</div>
									) : null}
								</div>

								{tool.bestFor ? (
									<div className="mt-7 rounded-card border border-nexora-turquoise/15 bg-nexora-turquoise/5 px-5 py-4">
										<p className="text-small leading-6 text-nexora-muted">
											<span className="font-semibold text-nexora-turquoise">
												Best for:
											</span>{" "}
											{tool.bestFor}
										</p>
									</div>
								) : null}
							</div>
						</section>

						{/* Pros / Cons */}
						{tool.pros.length > 0 || tool.cons.length > 0 ? (
							<section className="mt-8 grid gap-5 md:grid-cols-2">
								{tool.pros.length > 0 ? (
									<div className="nexora-glass nexora-hover-lift rounded-card border border-nexora-success/15 p-6">
										<div className="mb-5 flex items-center gap-3">
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-nexora-success/10 text-nexora-success">
												✓
											</div>

											<h2 className="text-h4 text-nexora-text">
												Pros
											</h2>
										</div>

										<ul className="flex flex-col gap-3">
											{tool.pros.map((pro) => (
												<li
													key={pro}
													className="flex items-start gap-3 rounded-md border border-nexora-success/10 bg-nexora-success/5 px-4 py-3 text-small leading-6 text-nexora-muted"
												>
													<span
														className="mt-0.5 shrink-0 text-nexora-success"
														aria-hidden="true"
													>
														✓
													</span>

													<span>{pro}</span>
												</li>
											))}
										</ul>
									</div>
								) : null}

								{tool.cons.length > 0 ? (
									<div className="nexora-glass nexora-hover-lift rounded-card border border-red-400/15 p-6">
										<div className="mb-5 flex items-center gap-3">
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400/10 text-red-400">
												×
											</div>

											<h2 className="text-h4 text-nexora-text">
												Cons
											</h2>
										</div>

										<ul className="flex flex-col gap-3">
											{tool.cons.map((con) => (
												<li
													key={con}
													className="flex items-start gap-3 rounded-md border border-red-400/10 bg-red-400/5 px-4 py-3 text-small leading-6 text-nexora-muted"
												>
													<span
														className="mt-0.5 shrink-0 text-red-400"
														aria-hidden="true"
													>
														×
													</span>

													<span>{con}</span>
												</li>
											))}
										</ul>
									</div>
								) : null}
							</section>
						) : null}

						{/* Features */}
						{tool.features.length > 0 ? (
							<section className="mt-8 nexora-glass rounded-card border border-nexora-border p-6 sm:p-8">
								<div className="mb-6">
									<span className="text-caption font-semibold uppercase tracking-[0.14em] text-nexora-turquoise">
										Capabilities
									</span>

									<h2 className="mt-2 text-h3 text-nexora-text">
										Features
									</h2>
								</div>

								<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
									{tool.features.map((feature) => (
										<li
											key={feature}
											className="nexora-hover-lift rounded-md border border-nexora-border bg-nexora-surface/30 px-4 py-3 text-small leading-6 text-nexora-muted transition-all hover:border-nexora-turquoise/30 hover:text-nexora-text"
										>
											<span className="mr-2 text-nexora-turquoise">
												◆
											</span>

											{feature}
										</li>
									))}
								</ul>
							</section>
						) : null}

						{/* Review */}
						{tool.reviewBodyHtml ? (
							<section className="nexora-glass rounded-card border border-nexora-border p-6 sm:p-8">
								<div className="mb-7">
									<span className="text-caption font-semibold uppercase tracking-[0.14em] text-nexora-turquoise">
										NEXORA Analysis
									</span>

									<h2 className="mt-2 text-h3 text-nexora-text">
										Our Review
									</h2>
								</div>

								<div
									className="prose-nexora"
									dangerouslySetInnerHTML={{
										__html: sanitizeHtml(
											tool.reviewBodyHtml,
										),
									}}
								/>
							</section>
						) : null}

						{/* FAQ */}
						{tool.faq.length > 0 ? (
							<section className="mt-8">
								<div className="mb-6">
									<span className="text-caption font-semibold uppercase tracking-[0.14em] text-nexora-turquoise">
										Need to know
									</span>

									<h2 className="mt-2 text-h3 text-nexora-text">
										Frequently Asked Questions
									</h2>
								</div>

								<div className="flex flex-col gap-3">
									{tool.faq.map((item) => (
										<div
											key={item.question}
											className="nexora-glass nexora-hover-lift rounded-card border border-nexora-border p-5 transition-all hover:border-nexora-turquoise/25"
										>
											<p className="font-semibold leading-6 text-nexora-text">
												{item.question}
											</p>

											<p className="mt-2 text-small leading-6 text-nexora-muted">
												{item.answer}
											</p>
										</div>
									))}
								</div>
							</section>
						) : null}

						{/* Alternatives */}
						{tool.alternatives.length > 0 ? (
							<section className="mt-8">
								<div className="mb-6">
									<span className="text-caption font-semibold uppercase tracking-[0.14em] text-nexora-turquoise">
										Compare
									</span>

									<h2 className="mt-2 text-h3 text-nexora-text">
										Alternatives
									</h2>
								</div>

								<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
									{tool.alternatives.map((alt) => (
										<ToolCard
											key={alt.slug}
											tool={alt}
										/>
									))}
								</div>
							</section>
						) : null}

						{/* Related articles */}
						{tool.relatedArticles.length > 0 ? (
							<section className="mt-8">
								<div className="mb-6">
									<span className="text-caption font-semibold uppercase tracking-[0.14em] text-nexora-turquoise">
										Keep exploring
									</span>

									<h2 className="mt-2 text-h3 text-nexora-text">
										Related Articles
									</h2>
								</div>

								<ArticleGrid
									articles={tool.relatedArticles}
								/>
							</section>
						) : null}

						{/* Review metadata */}
						<div className="mt-8 rounded-card border border-nexora-border bg-nexora-surface/20 px-5 py-4">
							<p className="text-caption leading-6 text-nexora-muted-2">
								Last reviewed{" "}
								<span className="text-nexora-muted">
									{formatDate(tool.lastReviewed)}
								</span>
								. Ratings reflect independent NEXORA
								testing, not vendor claims.
							</p>
						</div>
					</div>

					{/* Pricing sidebar */}
					<aside className="lg:sticky lg:top-24 lg:h-fit">
						<div className="nexora-glass nexora-3d relative overflow-hidden rounded-card border border-nexora-turquoise/20 p-6 shadow-glow">
							<div
								className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-nexora-turquoise/10 blur-[70px]"
								aria-hidden="true"
							/>

							<div className="relative">
								<span className="text-caption font-semibold uppercase tracking-[0.14em] text-nexora-turquoise">
									Pricing
								</span>

								<p className="mt-3 text-h3 text-nexora-text">
									{tool.pricing ?? "Varies"}
								</p>

								<div className="my-6 h-px bg-nexora-border" />

								<div className="mb-6 space-y-3 text-small text-nexora-muted">
									<div className="flex items-center justify-between gap-4">
										<span>Independent review</span>
										<span className="text-nexora-success">
											✓
										</span>
									</div>

									<div className="flex items-center justify-between gap-4">
										<span>Pros & cons</span>
										<span className="text-nexora-success">
											✓
										</span>
									</div>

									<div className="flex items-center justify-between gap-4">
										<span>Pricing checked</span>
										<span className="text-nexora-success">
											✓
										</span>
									</div>
								</div>

								<AffiliateButton
									toolId={tool.id}
									toolSlug={tool.slug}
									targetUrl={
										tool.affiliateUrl ||
										tool.websiteUrl
									}
									source="tool-review-sidebar"
									label={`Visit ${tool.name}`}
								/>

								<p className="mt-4 text-center text-caption leading-5 text-nexora-muted-2">
									External links may be affiliate links.
								</p>
							</div>
						</div>
					</aside>
				</div>
			</main>
		</div>
	)
}
