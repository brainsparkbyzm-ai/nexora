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
		<div className="mx-auto w-full max-w-hero px-4 py-16">
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

			<div className="grid gap-8 lg:grid-cols-[1fr_320px]">
				<div>
					<div className="flex flex-wrap items-center gap-4">
						<div>
							<h1 className="text-h1 text-nexora-text">
								{tool.name}
							</h1>

							<p className="text-caption text-nexora-muted">
								{tool.category.name}
							</p>
						</div>

						{rating ? (
							<span className="ml-auto rounded-pill bg-nexora-surface-raised px-3 py-1.5 text-small font-semibold text-nexora-cyan">
								★ {rating} / 5
							</span>
						) : null}
					</div>

					<p className="mt-6 text-body text-nexora-muted">
						{tool.description}
					</p>

					{tool.bestFor ? (
						<p className="mt-4 text-small text-nexora-text">
							<span className="font-semibold text-nexora-cyan">
								Best for:
							</span>{" "}
							{tool.bestFor}
						</p>
					) : null}

					{tool.pros.length > 0 || tool.cons.length > 0 ? (
						<section className="mt-10 grid gap-6 md:grid-cols-2">
							{tool.pros.length > 0 ? (
								<div className="rounded-card border border-nexora-border p-6">
									<h2 className="mb-4 text-h4 text-nexora-text">
										Pros
									</h2>

									<ul className="flex flex-col gap-3">
										{tool.pros.map((pro) => (
											<li
												key={pro}
												className="flex items-start gap-2 text-small text-nexora-muted"
											>
												<span
													className="mt-0.5 text-nexora-success"
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
								<div className="rounded-card border border-nexora-border p-6">
									<h2 className="mb-4 text-h4 text-nexora-text">
										Cons
									</h2>

									<ul className="flex flex-col gap-3">
										{tool.cons.map((con) => (
											<li
												key={con}
												className="flex items-start gap-2 text-small text-nexora-muted"
											>
												<span
													className="mt-0.5 text-red-400"
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

					{tool.features.length > 0 ? (
						<section className="mt-10">
							<h2 className="mb-4 text-h4 text-nexora-text">
								Features
							</h2>

							<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
								{tool.features.map((feature) => (
									<li
										key={feature}
										className="rounded-md border border-nexora-border px-4 py-2 text-small text-nexora-muted"
									>
										{feature}
									</li>
								))}
							</ul>
						</section>
					) : null}

					{tool.reviewBodyHtml ? (
						<section
							className="prose-nexora mt-10"
							dangerouslySetInnerHTML={{
								__html: sanitizeHtml(
									tool.reviewBodyHtml,
								),
							}}
						/>
					) : null}

					{tool.faq.length > 0 ? (
						<section className="mt-10">
							<h2 className="mb-4 text-h4 text-nexora-text">
								Frequently Asked Questions
							</h2>

							<div className="flex flex-col gap-4">
								{tool.faq.map((item) => (
									<div
										key={item.question}
										className="rounded-md border border-nexora-border p-4"
									>
										<p className="font-semibold text-nexora-text">
											{item.question}
										</p>

										<p className="mt-1 text-small text-nexora-muted">
											{item.answer}
										</p>
									</div>
								))}
							</div>
						</section>
					) : null}

					{tool.alternatives.length > 0 ? (
						<section className="mt-10">
							<h2 className="mb-4 text-h4 text-nexora-text">
								Alternatives
							</h2>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{tool.alternatives.map((alt) => (
									<ToolCard
										key={alt.slug}
										tool={alt}
									/>
								))}
							</div>
						</section>
					) : null}

					{tool.relatedArticles.length > 0 ? (
						<section className="mt-10">
							<h2 className="mb-4 text-h4 text-nexora-text">
								Related Articles
							</h2>

							<ArticleGrid
								articles={tool.relatedArticles}
							/>
						</section>
					) : null}

					<p className="mt-10 text-caption text-nexora-muted-2">
						Last reviewed{" "}
						{formatDate(tool.lastReviewed)}. Ratings reflect
						independent NEXORA testing, not vendor claims.
					</p>
				</div>

				<aside className="h-fit rounded-card border border-nexora-border p-6">
					<p className="mb-2 text-caption font-semibold uppercase tracking-wide text-nexora-muted">
						Pricing
					</p>

					<p className="mb-6 text-h4 text-nexora-text">
						{tool.pricing ?? "Varies"}
					</p>

					<AffiliateButton
						toolId={tool.id}
						toolSlug={tool.slug}
						targetUrl={
							tool.affiliateUrl || tool.websiteUrl
						}
						source="tool-review-sidebar"
						label={`Visit ${tool.name}`}
					/>
				</aside>
			</div>
		</div>
	)
}