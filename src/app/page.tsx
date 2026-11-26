import type { ComponentProps } from "react"
import Link from "next/link"

import { Hero3D } from "@/components/hero/Hero3D"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { ArticleGrid } from "@/components/article/ArticleGrid"
import { TrendingCarousel } from "@/components/article/TrendingCarousel"
import { FeaturedArticle } from "@/components/article/FeaturedArticle"
import { ToolCard } from "@/components/tools/ToolCard"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { AdSlot } from "@/components/monetization/AdSlot"

import { getHomepageSections } from "@/services/settingsService"
import {
	listTrendingArticles,
	getFeaturedArticle,
	listLatestArticles,
	listArticlesForCategory,
} from "@/services/articleService"
import { listToolsDirectory } from "@/services/toolService"
import { siteConfig } from "@/config/site"
import { buildMetadata } from "@/lib/seo"

export const revalidate = 300

export const metadata = buildMetadata({
	title: siteConfig.seoDefaults.defaultTitle,
	description: siteConfig.seoDefaults.defaultDescription,
	path: "/",
})

type ToolCardTool = ComponentProps<typeof ToolCard>["tool"]

type QuickLink = {
	label: string
	href: string
}

const quickLinks: QuickLink[] = [
	{ label: "AI Assistants", href: "/ai-assistants" },
	{ label: "Automation", href: "/automation" },
	{ label: "AI Tools", href: "/tools" },
]

export default async function HomePage() {
	const sections = await getHomepageSections()

	const [
		trending,
		featured,
		latestResult,
		aiAgentsResult,
		automationResult,
		productivityResult,
		businessAIResult,
		guidesResult,
		tools,
	] = await Promise.all([
		listTrendingArticles(8),
		getFeaturedArticle(),
		listLatestArticles(6),
		listArticlesForCategory("ai-assistants", 1, 3),
		listArticlesForCategory("automation", 1, 3),
		listArticlesForCategory("future-of-work", 1, 3),
		listArticlesForCategory("business-ai", 1, 3),
		listArticlesForCategory("ai-writing", 1, 3),
		listToolsDirectory({
			featuredOnly: true,
			pageSize: 6,
		}),
	])

	const latest = latestResult
	const aiAgents = aiAgentsResult.items
	const automation = automationResult.items
	const productivity = productivityResult.items
	const businessAI = businessAIResult.items
	const guides = guidesResult.items

	const enabled = new Set(
		sections
			.filter((section) => section.enabled)
			.map((section) => section.key),
	)

	const typedTools = tools.items as ToolCardTool[]

	return (
		<div className="nexora-page relative min-h-screen overflow-hidden pb-24 pt-4 sm:pt-8">
			{/* ============================================================
			    GLOBAL AMBIENT BACKGROUND
			============================================================ */}

			<div
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute left-[-18rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-nexora-blue/10 blur-[120px] animate-ambient-pulse" />

				<div
					className="absolute right-[-16rem] top-[12%] h-[32rem] w-[32rem] rounded-full bg-nexora-turquoise/10 blur-[130px] animate-ambient-pulse"
					style={{ animationDelay: "1.5s" }}
				/>

				<div
					className="absolute bottom-[8%] left-[30%] h-[28rem] w-[28rem] rounded-full bg-nexora-vanilla/5 blur-[120px] animate-ambient-pulse"
					style={{ animationDelay: "3s" }}
				/>

				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(7,16,20,0.55)_100%)]" />

				<div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />
			</div>

			<div className="flex flex-col gap-16 sm:gap-24 lg:gap-28">
				{/* ============================================================
				    HERO
				============================================================ */}

				{enabled.has("hero") ? (
					<section className="nexora-hero relative overflow-hidden px-4 pt-8 sm:pt-14 lg:pt-20">
						<div
							className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-nexora-blue/10 blur-[150px]"
							aria-hidden="true"
						/>

						<div
							className="pointer-events-none absolute left-1/2 top-[35%] h-[20rem] w-[38rem] -translate-x-1/2 rounded-full bg-nexora-turquoise/5 blur-[120px]"
							aria-hidden="true"
						/>

						<div className="relative mx-auto grid max-w-hero items-center gap-10 lg:grid-cols-2 lg:gap-16">
							{/* HERO COPY */}

							<div className="relative z-10 flex flex-col gap-6 text-center lg:text-left">
								<span className="nexora-badge nexora-glass mx-auto inline-flex w-fit items-center gap-2 rounded-pill border border-nexora-turquoise/20 px-4 py-2 text-caption font-semibold uppercase tracking-[0.16em] text-nexora-turquoise lg:mx-0">
									<span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-nexora-turquoise shadow-glow-turquoise" />
									NEXORA Intelligence Briefing
								</span>

								<h1 className="nexora-glow-text text-display text-nexora-text">
									THE FUTURE OF{" "}
									<span className="nexora-gradient-text">
										WORK IS AGENTIC
									</span>
								</h1>

								<p className="mx-auto max-w-xl text-body leading-relaxed text-nexora-muted lg:mx-0">
									Discover the AI agents, automation systems and
									intelligent tools transforming the way people work.
								</p>

								{/* CTA */}

								<div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
									<Link
										href="/ai-assistants"
										className="nexora-button group relative overflow-hidden rounded-pill bg-gradient-to-r from-nexora-blue via-nexora-turquoise to-nexora-blue bg-[length:200%_100%] px-6 py-3 text-small font-semibold text-[#071014] shadow-glow-blue transition-all duration-smooth hover:bg-right hover:shadow-glow-turquoise"
									>
										<span className="relative z-10">
											Explore AI
										</span>

										<span
											aria-hidden="true"
											className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-smooth group-hover:translate-x-full"
										/>
									</Link>

									<Link
										href="/ai-writing"
										className="nexora-button nexora-glass group rounded-pill border border-nexora-blue/20 px-6 py-3 text-small font-semibold text-nexora-text transition-all duration-smooth hover:-translate-y-0.5 hover:border-nexora-turquoise/50 hover:text-nexora-vanilla"
									>
										Latest Research
									</Link>
								</div>

								{/* QUICK LINKS */}

								<nav
									className="mt-2 flex flex-wrap justify-center gap-2.5 lg:justify-start"
									aria-label="Popular NEXORA sections"
								>
									{quickLinks.map((item, index) => (
										<Link
											key={item.label}
											href={item.href}
											className="nexora-hover-lift nexora-glass rounded-pill border border-white/5 px-4 py-2 text-caption text-nexora-muted transition-all duration-normal hover:border-nexora-turquoise/30 hover:text-nexora-turquoise"
											style={{
												animationDelay: `${index * 100}ms`,
											}}
										>
											{item.label}
										</Link>
									))}
								</nav>
							</div>

							{/* HERO 3D */}

							<div className="relative z-10 min-h-[20rem] sm:min-h-[28rem] lg:min-h-[34rem]">
								<div
									className="absolute inset-[10%] -z-10 rounded-full bg-nexora-turquoise/10 blur-[100px]"
									aria-hidden="true"
								/>

								<div className="nexora-3d relative h-full w-full">
									<Hero3D />
								</div>

								{/* FLOATING TOPIC BADGES */}

								<div
									className="pointer-events-none absolute inset-0 hidden sm:block"
									aria-hidden="true"
								>
									{[
										"AI Agents",
										"Automation",
										"Productivity",
										"AI Tools",
										"Business",
									].map((label, index) => (
										<span
											key={label}
											className="nexora-glass nexora-badge absolute rounded-pill border border-white/10 px-3 py-1.5 text-caption font-medium text-nexora-text shadow-glow animate-float"
											style={{
												top: `${10 + index * 17}%`,
												left:
													index % 2 === 0
														? "-3%"
														: undefined,
												right:
													index % 2 === 1
														? "-3%"
														: undefined,
												animationDelay: `${index * 700}ms`,
											}}
										>
											{label}
										</span>
									))}
								</div>
							</div>
						</div>
					</section>
				) : null}

				{/* ============================================================
				    TRENDING
				============================================================ */}

				{enabled.has("trending") && trending.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="Trending Now"
							href="/search?sort=trending"
						/>

						<div className="nexora-card nexora-3d overflow-hidden rounded-card border border-white/5 p-2">
							<TrendingCarousel articles={trending} />
						</div>
					</section>
				) : null}

				{/* ============================================================
				    FEATURED
				============================================================ */}

				{enabled.has("featured") && featured ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader title="Featured Story" />

						<div className="nexora-3d">
							<FeaturedArticle article={featured} />
						</div>
					</section>
				) : null}

				{/* ============================================================
				    LATEST
				============================================================ */}

				{enabled.has("latest") && latest.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="Latest Articles"
							href="/search?sort=newest"
						/>

						<div className="nexora-article-card">
							<ArticleGrid articles={latest} />
						</div>
					</section>
				) : null}

				{/* ============================================================
				    AD
				============================================================ */}

				<div className="mx-auto w-full max-w-content px-4">
					<div className="nexora-glass overflow-hidden rounded-card border border-white/5 p-2 opacity-90 transition-all duration-normal hover:border-nexora-turquoise/20">
						<AdSlot placement="homepage-feed" />
					</div>
				</div>

				{/* ============================================================
				    AI AGENTS
				============================================================ */}

				{enabled.has("aiAgents") && aiAgents.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="AI Assistants"
							href="/ai-assistants"
						/>

						<ArticleGrid articles={aiAgents} />
					</section>
				) : null}

				{/* ============================================================
				    AUTOMATION
				============================================================ */}

				{enabled.has("automation") && automation.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="Automation"
							href="/automation"
						/>

						<ArticleGrid articles={automation} />
					</section>
				) : null}

				{/* ============================================================
				    PRODUCTIVITY
				============================================================ */}

				{enabled.has("productivity") && productivity.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="Future of Work"
							href="/future-of-work"
						/>

						<ArticleGrid articles={productivity} />
					</section>
				) : null}

				{/* ============================================================
				    BEST AI TOOLS
				============================================================ */}

				{enabled.has("bestTools") && typedTools.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="Best AI Tools"
							href="/tools"
						/>

						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{typedTools.map((tool, index) => (
								<div
									key={tool.slug}
									className="nexora-tool-card nexora-3d animate-card-enter"
									style={{
										animationDelay: `${index * 80}ms`,
									}}
								>
									<ToolCard tool={tool} />
								</div>
							))}
						</div>
					</section>
				) : null}

				{/* ============================================================
				    BUSINESS AI
				============================================================ */}

				{enabled.has("businessAI") && businessAI.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="Business AI"
							href="/business-ai"
						/>

						<ArticleGrid articles={businessAI} />
					</section>
				) : null}

				{/* ============================================================
				    GUIDES
				============================================================ */}

				{enabled.has("guides") && guides.length > 0 ? (
					<section className="nexora-section mx-auto w-full max-w-content px-4 animate-fade-up">
						<SectionHeader
							title="AI Writing"
							href="/ai-writing"
						/>

						<ArticleGrid articles={guides} />
					</section>
				) : null}

				{/* ============================================================
				    NEWSLETTER
				============================================================ */}

				{enabled.has("newsletter") ? (
					<section className="mx-auto w-full max-w-content px-4 animate-scale-in">
						<GlassPanel className="nexora-card nexora-3d relative flex flex-col items-center gap-5 overflow-hidden p-8 text-center sm:p-12 lg:p-14">
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
								The NEXORA{" "}
								<span className="nexora-gradient-text">
									Briefing
								</span>
							</h2>

							<p className="relative max-w-md text-body text-nexora-muted">
								One email, once a week. The most important AI
								agents, tools and workflows — explained.
							</p>

							<div className="relative w-full max-w-xl">
								<NewsletterForm placement="homepage" />
							</div>
						</GlassPanel>
					</section>
				) : null}

			</div>
		</div>
	)
}