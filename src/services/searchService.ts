import { prisma, } from "@/lib/prisma"
import { ArticleStatus, Prisma, type Category } from "@prisma/client"
import { track } from "@/lib/analytics"
import type { ArticleCardData, ToolCardData } from "@/types/content"

/**
 * Site-wide search across articles, tools, categories, and reviews.
 * Server-side (Prisma contains/insensitive) so results stay fast and
 * correct without shipping a client-side search index.
 *
 * "review" results surface as Tools that have a published Review attached
 * (Review is a 1:1 extension of Tool -- see prisma/schema.prisma) and are
 * returned in the same `tools` bucket, since the search UI (SearchPageClient)
 * renders tool results through the existing ToolCard component rather than a
 * separate reviews list.
 */

export type SearchResultType = "all" | "article" | "tool" | "category" | "review"

export type SearchFilters = {
	query: string
	type?: SearchResultType
	categorySlug?: string
	page?: number
	pageSize?: number
}

export type SearchResult = {
	articles: ArticleCardData[]
	tools: ToolCardData[]
	categories: Category[]
	totalCount: number
	page: number
	pageSize: number
}

export async function searchContent(filters: SearchFilters): Promise<SearchResult> {
	const page = Math.max(1, filters.page ?? 1)
	const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 10))
	const q = filters.query.trim()
	const type = filters.type ?? "all"

	if (!q) return { articles: [], tools: [], categories: [], totalCount: 0, page, pageSize }

	const wantsArticles = type === "all" || type === "article"
	const wantsTools = type === "all" || type === "tool" || type === "review"
	const wantsCategories = type === "all" || type === "category"

	const toolConditions: Prisma.ToolWhereInput[] = [
		{ name: { contains: q, mode: "insensitive" } },
		{ description: { contains: q, mode: "insensitive" } },
	]
	if (type === "review") {
		toolConditions.push({ review: { summary: { contains: q, mode: "insensitive" } } })
	}

	const [articles, tools, categories] = await Promise.all([
		wantsArticles
			? prisma.article.findMany({
					where: {
						status: ArticleStatus.PUBLISHED,
						...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
						OR: [
							{ title: { contains: q, mode: "insensitive" } },
							{ excerpt: { contains: q, mode: "insensitive" } },
						],
					},
					include: { author: true, category: true },
					take: pageSize,
					skip: (page - 1) * pageSize,
					orderBy: { publishedAt: "desc" },
				})
			: Promise.resolve([]),
		wantsTools
			? prisma.tool.findMany({
					where: {
						...(type === "review" ? { review: { isNot: null } } : {}),
						OR: toolConditions,
					},
					include: { category: true },
					take: pageSize,
					skip: (page - 1) * pageSize,
					orderBy: { name: "asc" },
				})
			: Promise.resolve([]),
		wantsCategories
			? prisma.category.findMany({
					where: { name: { contains: q, mode: "insensitive" } },
					take: pageSize,
				})
			: Promise.resolve([]),
	])

	const totalCount = articles.length + tools.length + categories.length
	void track({ name: "search", query: q, resultCount: totalCount })

	return { articles, tools, categories, totalCount, page, pageSize }
}

export const POPULAR_SEARCHES = [
	"best AI agents",
	"ChatGPT vs Claude",
	"AI automation workflows",
	"AI productivity tools",
	"multi-agent systems",
]
