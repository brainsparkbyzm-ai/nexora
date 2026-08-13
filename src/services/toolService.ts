import * as toolRepo from "@/repositories/toolRepository"
import { track } from "@/lib/analytics"
import type { ArticleCardData, ToolCardData } from "@/types/content"

type FaqItem = { question: string; answer: string }

/**
 * `Review.faq` is a loosely-typed Prisma `Json?` column. Validate its shape
 * at the boundary instead of trusting `as FaqItem[]` so malformed/legacy
 * seed data can never crash a tool review page render.
 */
function parseFaq(raw: unknown): FaqItem[] {
	if (!Array.isArray(raw)) return []
	return raw.filter(
		(item): item is FaqItem =>
			typeof item === "object" &&
			item !== null &&
			typeof (item as Record<string, unknown>).question === "string" &&
			typeof (item as Record<string, unknown>).answer === "string",
	)
}

/**
 * Flat view model consumed directly by `src/app/tools/[slug]/page.tsx`.
 *
 * IMPORTANT: this does NOT return `{ tool, alternatives }`. Every field
 * below is accessed directly as `tool.<field>` (e.g. `tool.name`,
 * `tool.reviewBodyHtml`, `tool.alternatives`) -- there is exactly one shape,
 * and it is this one. Do not reintroduce a nested `{ tool, alternatives }`
 * wrapper; update this type and its one consumer together if the shape
 * ever needs to change.
 */
export type ToolReviewViewModel = {
	id: string
	slug: string
	name: string
	logoUrl: string | null
	description: string
	websiteUrl: string
	pricing: string | null
	rating: number | null
	pros: string[]
	cons: string[]
	bestFor: string | null
	features: string[]
	affiliateUrl: string | null
	affiliateDisclosure: string | null
	featured: boolean
	category: { name: string; slug: string }
	reviewBodyHtml: string | null
	faq: FaqItem[]
	lastReviewed: Date
	alternatives: ToolCardData[]
	relatedArticles: ArticleCardData[]
}

export async function listToolsDirectory(params: {
	categorySlug?: string
	featuredOnly?: boolean
	search?: string
	page?: number
	pageSize?: number
}) {
	return toolRepo.listTools({
		categorySlug: params.categorySlug,
		featured: params.featuredOnly,
		search: params.search,
		page: params.page,
		pageSize: params.pageSize,
	})
}

export async function getToolReview(slug: string): Promise<ToolReviewViewModel | null> {
	const tool = await toolRepo.findToolBySlug(slug)
	if (!tool) return null

	const [alternatives, relatedArticles] = await Promise.all([
		toolRepo.listAlternativeTools(tool.id, tool.categoryId, 3),
		toolRepo.listRelatedArticlesForTool(tool.id, 3),
	])

	return {
		id: tool.id,
		slug: tool.slug,
		name: tool.name,
		logoUrl: tool.logoUrl,
		description: tool.description,
		websiteUrl: tool.websiteUrl,
		pricing: tool.pricing,
		rating: tool.rating,
		pros: tool.pros,
		cons: tool.cons,
		bestFor: tool.bestFor,
		features: tool.features,
		affiliateUrl: tool.affiliateUrl,
		affiliateDisclosure: tool.affiliateDisclosure,
		featured: tool.featured,
		category: { name: tool.category.name, slug: tool.category.slug },
		reviewBodyHtml: tool.review?.body ?? null,
		faq: parseFaq(tool.review?.faq),
		lastReviewed: tool.lastReviewedAt ?? tool.review?.updatedAt ?? tool.updatedAt,
		alternatives: alternatives.map((alt) => ({
			slug: alt.slug,
			name: alt.name,
			logoUrl: alt.logoUrl,
			description: alt.description,
			pricing: alt.pricing,
			rating: alt.rating,
			bestFor: alt.bestFor,
			featured: alt.featured,
			category: { name: alt.category.name, slug: alt.category.slug },
		})),
		relatedArticles: relatedArticles.map((article) => ({
			slug: article.slug,
			title: article.title,
			excerpt: article.excerpt,
			heroImage: article.heroImage,
			readingTime: article.readingTime,
			publishedAt: article.publishedAt,
			author: {
				name: article.author.name,
				slug: article.author.slug,
				avatarUrl: article.author.avatarUrl,
			},
			category: { name: article.category.name, slug: article.category.slug },
		})),
	}
}

export async function getComparison(slug: string) {
	return toolRepo.findComparisonBySlug(slug)
}

export async function listAllComparisons() {
	return toolRepo.listComparisons()
}

export async function resolveAffiliateClick(toolId: string, source?: string) {
	await track({ name: "affiliate_click", toolId, source })
	return { toolId, source: source ?? null }
}
