import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { OptimizedImage } from "@/components/media/OptimizedImage"
import { Breadcrumbs } from "@/components/article/Breadcrumbs"
import { TableOfContents } from "@/components/article/TableOfContents"
import { ShareButtons } from "@/components/article/ShareButtons"
import { RelatedArticles } from "@/components/article/RelatedArticles"
import { AuthorCard } from "@/components/authors/AuthorCard"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { AdSlot } from "@/components/monetization/AdSlot"

import {
	getArticleForReading,
	getRelatedArticles,
} from "@/services/articleService"

import { formatDate } from "@/lib/utils"

import {
	buildMetadata,
	articleSchema,
	breadcrumbSchema,
} from "@/lib/seo"

import { siteConfig } from "@/config/site"
import { sanitizeHtml } from "@/lib/sanitize"

export const revalidate = 120

type Props = {
	params: Promise<{
		slug: string
	}>
}

const articleSeoTitles: Record<string, string> = {
	"25-ai-automation-ideas-that-can-save-hours-every-week": "25 AI Automation Ideas to Save Time",
	"ai-agents-explained-what-they-are-how-they-work-and-what-they-can-do": "AI Agents Explained: How They Work",
	"ai-automation-small-business": "AI Automation for Small Businesses: 8 Ideas",
	"ai-automation-in-2026-the-complete-guide-for-beginners": "AI Automation in 2026: Beginner's Guide",
	"ai-in-customer-support-what-companies-should-automate-first": "AI for Customer Support: What to Automate",
	"ai-productivity-in-2026-how-to-get-more-done-with-less-work": "AI Productivity: Get More Done in 2026",
	"ai-productivity-mistakes-that-are-actually-making-you-slower": "AI Productivity Mistakes to Avoid",
	"ai-roi-how-to-measure-whether-your-ai-investment-is-paying-off": "AI ROI: Measure the Value of AI",
	"ai-tools-for-small-businesses-the-15-tools-worth-paying-for": "AI Tools for Business: 15 Small-Business Picks",
	"ai-workflow-automation-a-practical-framework-that-actually-works": "AI Workflow Automation: A Practical Guide",
	"best-ai-agents-in-2026-10-systems-worth-trying-right-now": "10 Best AI Agents to Try in 2026",
	"chatgpt-review-2026-is-chatgpt-still-worth-paying-for": "ChatGPT Review 2026: Is It Worth It?",
	"chatgpt-vs-claude-vs-gemini-which-ai-is-best-in-2026": "ChatGPT vs Claude vs Gemini: 2026 Guide",
	"how-to-automate-your-business-without-breaking-your-workflow": "How to Automate Your Business with AI",
	"how-to-build-an-ai-agent-a-beginner-s-step-by-step-guide": "How to Build an AI Agent: Step-by-Step",
	"how-to-build-an-ai-powered-personal-productivity-system": "Build an AI-Powered Productivity System",
	"how-to-build-an-ai-strategy-for-your-business-in-2026": "Build an AI Strategy for Your Business",
	"how-to-choose-the-right-ai-tool-without-wasting-money": "How to Choose the Right AI Tool",
	"how-to-use-ai-like-a-pro-15-practical-tips-that-actually-work": "15 Practical Ways to Use AI Better",
	"how-to-write-better-ai-prompts-the-complete-beginner-s-guide": "How to Write Better AI Prompts",
	"midjourney-review-2026-is-it-still-the-best-ai-image-generator": "Midjourney Review 2026: Is It Worth It?",
	"notion-ai-review-2026-is-it-worth-adding-to-your-workspace": "Notion AI Review 2026: Is It Worth It?",
	"the-business-ai-playbook-from-first-experiment-to-production": "The Business AI Playbook: Pilot to Scale",
	"zapier-review-2026-is-it-still-the-best-automation-tool": "Zapier Review 2026: Is It Worth It?",
	"zapier-vs-make-vs-n8n": "Zapier vs Make vs n8n: Best Automation Tool (2026)",
	"zapier-vs-make-vs-n8n-which-automation-platform-is-best": "Zapier vs Make vs n8n: Best Automation Tool (2026)",
}

function extractTableOfContents(html: string) {
	if (!html || typeof html !== "string") {
		return []
	}

	const matches = Array.from(
		html.matchAll(
			/<h([23])(?:\s[^>]*)?\sid=["']([^"']+)["'](?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
		),
	)

	return matches.map((match) => ({
		level: Number(match[1]) as 2 | 3,
		id: match[2] ?? "",
		text: (match[3] ?? "")
			.replace(/<[^>]*>/g, "")
			.replace(/&nbsp;/gi, " ")
			.replace(/&amp;/gi, "&")
			.replace(/&lt;/gi, "<")
			.replace(/&gt;/gi, ">")
			.replace(/&quot;/gi, '"')
			.trim(),
	}))
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata> {
	const { slug } = await params

	const article = await getArticleForReading(slug)

	if (!article) {
		return {}
	}

	return buildMetadata({
		title: articleSeoTitles[article.slug] ?? article.seoTitle ?? article.title,
		description: article.seoDescription || article.excerpt,
		path: `/articles/${article.slug}`,
		image: article.heroImage || undefined,
		canonicalUrl: article.canonicalUrl || undefined,
		type: "article",
	})
}

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params

	const article = await getArticleForReading(slug)

	if (!article) {
		notFound()
	}

	const related = await getRelatedArticles(slug, 3)
	const toc = extractTableOfContents(article.content)
	const articleUrl = `${siteConfig.url}/articles/${article.slug}`

	return (
		<article className="nexora-page relative min-h-screen overflow-hidden pb-24 pt-6 sm:pt-10">
			{/* Ambient background */}
			<div
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute left-[-220px] top-[-180px] h-[560px] w-[560px] rounded-full bg-nexora-blue/10 blur-[150px]" />

				<div className="absolute right-[-220px] top-[18%] h-[520px] w-[520px] rounded-full bg-nexora-turquoise/10 blur-[150px]" />

				<div className="absolute bottom-[8%] left-[35%] h-[440px] w-[440px] rounded-full bg-nexora-vanilla/5 blur-[150px]" />

				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(7,16,20,0.48)_100%)]" />
			</div>

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify([
						articleSchema({
							...article,
							authorName: article.author.name,
						}),
						breadcrumbSchema([
							{
								name: "Home",
								path: "/",
							},
							{
								name: article.category.name,
								path: `/${article.category.slug}`,
							},
							{
								name: article.title,
								path: `/articles/${article.slug}`,
							},
						]),
					]),
				}}
			/>

			{/* Article header */}
			<header className="mx-auto w-full max-w-article px-4">
				<div className="mb-7">
					<Breadcrumbs
						items={[
							{
								name: "Home",
								href: "/",
							},
							{
								name: article.category.name,
								href: `/${article.category.slug}`,
							},
							{
								name: article.title,
							},
						]}
					/>
				</div>

				<section className="nexora-glass nexora-3d relative overflow-hidden rounded-card border border-nexora-blue/15 p-6 sm:p-8 lg:p-10">
					<div
						className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-nexora-turquoise/10 blur-[100px]"
						aria-hidden="true"
					/>

					<div
						className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-nexora-blue/10 blur-[100px]"
						aria-hidden="true"
					/>

					<div className="relative">
						<span className="nexora-badge inline-flex rounded-pill border border-nexora-turquoise/20 bg-nexora-turquoise/5 px-3 py-1.5 text-metadata font-semibold uppercase tracking-[0.14em] text-nexora-turquoise">
							{article.category.name}
						</span>

						<h1 className="nexora-glow-text mt-5 text-h1 leading-[1.08] text-nexora-text">
							{article.title}
						</h1>

						{article.excerpt ? (
							<p className="mt-5 max-w-3xl text-h4 font-normal leading-8 text-nexora-muted">
								{article.excerpt}
							</p>
						) : null}

						<div className="mt-7 flex flex-col gap-5 border-t border-nexora-border pt-5 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-caption text-nexora-muted">
								<span className="font-semibold text-nexora-text">
									{article.author.name}
								</span>

								<span
									aria-hidden="true"
									className="text-nexora-muted-2"
								>
									•
								</span>

								<span>
									Published{" "}
									{formatDate(
										article.publishedAt ??
											article.createdAt,
									)}
								</span>

								{article.updatedAt &&
								article.updatedAt !==
									article.publishedAt ? (
									<>
										<span
											aria-hidden="true"
											className="text-nexora-muted-2"
										>
											•
										</span>

										<span>
											Updated{" "}
											{formatDate(
												article.updatedAt,
											)}
										</span>
									</>
								) : null}

								<span
									aria-hidden="true"
									className="text-nexora-muted-2"
								>
									•
								</span>

								<span className="text-nexora-turquoise">
									{article.readingTime} min read
								</span>
							</div>

							<div className="shrink-0">
								<ShareButtons
									url={articleUrl}
									title={article.title}
								/>
							</div>
						</div>
					</div>
				</section>
			</header>

			{/* Hero image */}
			{article.heroImage ? (
				<figure className="mx-auto mt-8 w-full max-w-hero px-4 sm:mt-10">
					<div className="nexora-3d overflow-hidden rounded-card border border-nexora-border bg-nexora-surface/30 p-1.5">
						<OptimizedImage
							src={article.heroImage}
							alt={article.title}
							priority
							aspectRatio="16/9"
						/>
					</div>
				</figure>
			) : null}

			{/* Reading layout */}
			<div className="mx-auto mt-10 grid w-full max-w-hero gap-8 px-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
				<aside className="lg:sticky lg:top-24 lg:h-fit">
					<div className="nexora-glass rounded-card border border-nexora-border p-4">
						<TableOfContents items={toc} />
					</div>
				</aside>

				<div className="mx-auto w-full max-w-article min-w-0">
					{/* Top advertisement */}
					<div className="nexora-glass overflow-hidden rounded-card border border-nexora-border p-2">
						<AdSlot placement="article-top" />
					</div>

					{/* Article body */}
					<main
						className="prose-nexora mt-8"
						dangerouslySetInnerHTML={{
							__html: sanitizeHtml(article.content),
						}}
					/>

					{/* Bottom advertisement */}
					<div className="nexora-glass mt-10 overflow-hidden rounded-card border border-nexora-border p-2">
						<AdSlot placement="article-bottom" />
					</div>

					{/* Newsletter */}
					<section className="mt-12">
						<div className="nexora-3d overflow-hidden rounded-card">
							<NewsletterForm placement="article" />
						</div>
					</section>

					{/* Author */}
					<section
						aria-labelledby="author-heading"
						className="mt-12"
					>
						<h2
							id="author-heading"
							className="sr-only"
						>
							About the author
						</h2>

						<div className="nexora-glass rounded-card border border-nexora-border p-2">
							<AuthorCard author={article.author} />
						</div>
					</section>
				</div>
			</div>

			{/* Related articles */}
			<div className="mx-auto mt-16 w-full max-w-hero px-4">
				<div className="nexora-glass nexora-3d rounded-card border border-nexora-border p-5 sm:p-7">
					<RelatedArticles articles={related} />
				</div>
			</div>
		</article>
	)
}

