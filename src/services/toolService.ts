import * as toolRepo from "@/repositories/toolRepository"
import { track } from "@/lib/analytics"
import type {
	ArticleCardData,
	ToolCardData,
} from "@/types/content"

type FaqItem = {
	question: string
	answer: string
}

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

function parseStringArray(raw: unknown): string[] {
	if (!Array.isArray(raw)) return []

	return raw.filter(
		(value): value is string => typeof value === "string",
	)
}

export type ToolReviewViewModel = {
	id: string
	slug: string
	name: string
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
	category: {
		name: string
		slug: string
	}
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

export async function getToolReview(
	slug: string,
): Promise<ToolReviewViewModel | null> {
	const tool = await toolRepo.findToolBySlug(slug)

	if (!tool) return null

	const [alternatives, relatedArticles] = await Promise.all([
		toolRepo.listAlternativeTools(
			tool.id,
			tool.categoryId,
			3,
		),
		toolRepo.listRelatedArticlesForTool(
			tool.id,
			3,
		),
	])

	return {
		id: tool.id,
		slug: tool.slug,
		name: tool.name,
		description: tool.description,
		websiteUrl: tool.websiteUrl,
		pricing: tool.pricing,
		rating: tool.rating,

		pros: parseStringArray(tool.pros),
		cons: parseStringArray(tool.cons),
		bestFor: tool.bestFor,
		features: parseStringArray(tool.features),

		affiliateUrl: tool.affiliateUrl,
		affiliateDisclosure: tool.affiliateDisclosure,
		featured: tool.featured,

		category: {
			name: tool.category.name,
			slug: tool.category.slug,
		},

		reviewBodyHtml: null,
		faq: [],

		lastReviewed:
			tool.lastReviewedAt ?? tool.updatedAt,

		alternatives: alternatives.map(
			(alt): ToolCardData => ({
				slug: alt.slug,
				name: alt.name,
				description: alt.description,
				pricing: alt.pricing,
				rating: alt.rating,
				bestFor: alt.bestFor,
				featured: alt.featured,
				category: {
					name: alt.category.name,
					slug: alt.category.slug,
				},
			}),
		),

		relatedArticles: relatedArticles.map(
			(article): ArticleCardData => ({
				slug: article.slug,
				title: article.title,
				excerpt: article.excerpt,
				heroImage: article.heroImage,
				readingTime: article.readingTime,
				publishedAt: article.publishedAt,

				author: {
					name: article.author.name,
					slug: article.author.slug,
				},

				category: {
					name: article.category.name,
					slug: article.category.slug,
				},
			}),
		),
	}
}

export async function getComparison(slug: string) {
	return toolRepo.findComparisonBySlug(slug)
}

export async function listAllComparisons() {
	return toolRepo.listComparisons()
}

export async function resolveAffiliateClick(
	toolId: string,
	source?: string,
) {
	await track({
		name: "affiliate_click",
		toolId,
		source,
	})

	return {
		toolId,
		source: source ?? null,
	}
}