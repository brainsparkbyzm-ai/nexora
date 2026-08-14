import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { SectionHeader } from "@/components/ui/SectionHeader"
import { ArticleGrid } from "@/components/article/ArticleGrid"
import { FeaturedArticle } from "@/components/article/FeaturedArticle"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { Pagination } from "@/components/ui/Pagination"
import { AdSlot } from "@/components/monetization/AdSlot"
import { ToolCard } from "@/components/tools/ToolCard"

import {
	findCategoryBySlug,
	isKnownCategorySlug,
} from "@/repositories/categoryRepository"

import {
	listArticlesForCategory,
	getFeaturedArticle,
} from "@/services/articleService"

import { listTools } from "@/repositories/toolRepository"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { coreCategorySlugs } from "@/config/site"

export const revalidate = 300

type Props = {
	params: Promise<{
		category: string
	}>
	searchParams: Promise<{
		page?: string
	}>
}

export async function generateStaticParams() {
	return coreCategorySlugs.map((category) => ({
		category,
	}))
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata> {
	const { category: slug } = await params

	const category = await findCategoryBySlug(slug)

	if (!category) {
		return {}
	}

	return buildMetadata({
		title: `${category.name} — Articles, Guides & Analysis`,
		description:
			category.description ??
			`Latest ${category.name} articles from NEXORA.`,
		path: `/${category.slug}`,
	})
}

export default async function CategoryPage({
	params,
	searchParams,
}: Props) {
	const { category: slug } = await params
	const { page: pageParam } = await searchParams

	const knownCategory = await isKnownCategorySlug(slug)

	if (!knownCategory) {
		notFound()
	}

	const category = await findCategoryBySlug(slug)

	if (!category) {
		notFound()
	}

	const requestedPage = Number(pageParam ?? "1")

	const page = Number.isFinite(requestedPage)
		? Math.max(1, requestedPage)
		: 1

	const pageSize = 9

	const [featured, articlesResult, relatedToolsResult] =
		await Promise.all([
			getFeaturedArticle(category.slug),

			listArticlesForCategory(
				category.slug,
				page,
				pageSize,
			),

			listTools({
				categorySlug: category.slug,
				pageSize: 3,
			}),
		])

	const { items, total } = articlesResult

	const relatedTools = relatedToolsResult.items

	return (
		<div className="relative min-h-screen overflow-hidden pb-24 pt-8 sm:pt-12">
			{/* ============================================================
			    AMBIENT CATEGORY BACKGROUND
			============================================================ */}

			<div
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute left-[-14rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-nexora-blue/10 blur-[130px] animate-ambient-pulse" />

				<div
					className="absolute right-[-14rem] top-[18%] h-[30rem] w-[30rem] rounded-full bg-nexora-turquoise/10 blur-[130px] animate-ambient-pulse"
					style={{ animationDelay: "1.5s" }}
				/>

				<div
					className="absolute bottom-[5%] left-[35%] h-[24rem] w-[24rem] rounded-full bg-nexora-vanilla/5 blur-[120px] animate-ambient-pulse"
					style={{ animationDelay: "3s" }}
				/>

				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(7,16,20,0.58)_100%)]" />
			</div>

			{/* ============================================================
			    BREADCRUMB SEO
			============================================================ */}

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						breadcrumbSchema([
							{
								name: "Home",
								path: "/",
							},
							{
								name: category.name,
								path: `/${category.slug}`,
							},
						]),
					),
				}}
			/>

			<div className="flex flex-col gap-16 sm:gap-20 lg:gap-24">
				{/* ========================================================
				    CATEGORY HERO
				======================================================== */}

				<section className="relative mx-auto w-full max-w-content px-4">
					<div
						className="pointer-events-none absolute left-1/2 top-[-5rem] h-[20rem] w-[42rem] -translate-x-1/2 rounded-full bg-nexora-turquoise/8 blur-[120px]"
						aria-hidden="true"
					/>

					<div className="nexora-card nexora-3d relative overflow-hidden rounded-card border border-white/5 px-5 py-12 text-center sm:px-10 sm:py-16">
						<div
							className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexora-turquoise/50 to-transparent"
							aria-hidden="true"
						/>

						<div
							className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-nexora-blue/10 blur-[80px]"
							aria-hidden="true"
						/>

						<div
							className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-nexora-turquoise/10 blur-[90px]"
							aria-hidden="true"
						/>

						<div className="relative z-10">
							<span className="nexora-badge inline-flex rounded-pill border border-nexora-turquoise/20 bg-nexora-turquoise/5 px-4 py-1.5 text-metadata font-semibold uppercase tracking-[0.14em] text-nexora-cyan">
								NEXORA Category
							</span>

							<h1 className="nexora-glow-text mt-4 text-h1 text-nexora-text">
								{category.name}
							</h1>

							{category.description ? (
								<p className="mx-auto mt-4 max-w-2xl text-body leading-relaxed text-nexora-muted">
									{category.description}
								</p>
							) : (
								<p className="mx-auto mt-4 max-w-2xl text-body leading-relaxed text-nexora-muted">
									Explore the latest insights, tools, research
									and practical ideas from NEXORA.
								</p>
							)}

							<div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-nexora-turquoise to-transparent" />
						</div>
					</div>
				</section>

				{/* ========================================================
				    FEATURED STORY
				======================================================== */}

				{featured ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader title="Featured Story" />

						<div className="nexora-3d">
							<FeaturedArticle article={featured} />
						</div>
					</section>
				) : null}

				{/* ========================================================
				    ARTICLES
				======================================================== */}

				<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
					<SectionHeader title="Latest" />

					<div className="nexora-article-card">
						<ArticleGrid articles={items} />
					</div>

					<div className="mt-10">
						<Pagination
							page={page}
							pageSize={pageSize}
							total={total}
							basePath={`/${category.slug}`}
						/>
					</div>
				</section>

				{/* ========================================================
				    CATEGORY AD
				======================================================== */}

				<div className="mx-auto w-full max-w-content px-4">
					<div className="nexora-glass overflow-hidden rounded-card border border-white/5 p-2 opacity-90 transition-all duration-normal hover:border-nexora-turquoise/20">
						<AdSlot placement="category-feed" />
					</div>
				</div>

				{/* ========================================================
				    RELATED AI TOOLS
				======================================================== */}

				{relatedTools.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="Related AI Tools"
							href="/tools"
						/>

						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{relatedTools.map((tool, index) => (
								<div
									key={tool.slug}
									className="nexora-tool-card nexora-3d animate-card-enter"
									style={{
										animationDelay: `${index * 100}ms`,
									}}
								>
									<ToolCard tool={tool} />
								</div>
							))}
						</div>
					</section>
				) : null}

				{/* ========================================================
				    NEWSLETTER
				======================================================== */}

				<section className="mx-auto w-full max-w-content px-4 animate-scale-in">
					<GlassPanel className="nexora-card nexora-3d relative flex flex-col items-center gap-4 overflow-hidden p-8 text-center sm:p-12">
						<div
							className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-nexora-blue/10 blur-[80px]"
							aria-hidden="true"
						/>

						<div
							className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-nexora-turquoise/10 blur-[80px]"
							aria-hidden="true"
						/>

						<span className="nexora-badge relative rounded-pill border border-nexora-vanilla/20 bg-nexora-vanilla/5 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.14em] text-nexora-vanilla">
							NEXORA Briefing
						</span>

						<h2 className="nexora-glow-text relative text-h2 text-nexora-text">
							Stay ahead in{" "}
							<span className="nexora-gradient-text">
								{category.name}
							</span>
						</h2>

						<p className="relative max-w-lg text-body leading-relaxed text-nexora-muted">
							Get the most useful AI news, tools, workflows and
							insights delivered straight to your inbox.
						</p>

						<div className="relative mt-2 w-full max-w-xl">
							<NewsletterForm placement="category" />
						</div>
					</GlassPanel>
				</section>
			</div>
		</div>
	)
}