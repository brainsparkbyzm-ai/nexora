import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

const toolWithRelations = {
	category: true,
} satisfies Prisma.ToolInclude

export type ToolWithRelations = Prisma.ToolGetPayload<{
	include: typeof toolWithRelations
}>

export async function listTools(filter: {
	categorySlug?: string
	featured?: boolean
	search?: string
	page?: number
	pageSize?: number
}) {
	const page = Math.max(1, filter.page ?? 1)
	const pageSize = Math.min(
		50,
		Math.max(1, filter.pageSize ?? 24)
	)

	const where: Prisma.ToolWhereInput = {
		...(filter.categorySlug
			? {
					category: {
						slug: filter.categorySlug,
					},
				}
			: {}),

		...(filter.featured !== undefined
			? {
					featured: filter.featured,
				}
			: {}),

		...(filter.search
			? {
					name: {
						contains: filter.search,
						mode: "insensitive",
					},
				}
			: {}),
	}

	const [items, total] = await Promise.all([
		prisma.tool.findMany({
			where,
			include: toolWithRelations,
			orderBy: {
				name: "asc",
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
		}),

		prisma.tool.count({
			where,
		}),
	])

	return {
		items,
		total,
		page,
		pageSize,
	}
}

export async function findToolBySlug(
	slug: string
): Promise<ToolWithRelations | null> {
	return prisma.tool.findUnique({
		where: {
			slug,
		},
		include: toolWithRelations,
	})
}

export async function findComparisonBySlug(slug: string) {
	return prisma.comparison.findUnique({
		where: {
			slug,
		},
		include: {
			toolA: {
				include: toolWithRelations,
			},
			toolB: {
				include: toolWithRelations,
			},
		},
	})
}

export async function listComparisons() {
	return prisma.comparison.findMany({
		include: {
			toolA: true,
			toolB: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	})
}

export async function listAlternativeTools(
	toolId: string,
	categoryId: string,
	limit: number
) {
	return prisma.tool.findMany({
		where: {
			categoryId,
			id: {
				not: toolId,
			},
		},
		include: {
			category: true,
		},
		take: Math.max(1, limit),
		orderBy: {
			rating: "desc",
		},
	})
}

/**
 * Published articles that reference a tool through
 * the ArticleTool join table, newest first.
 */
export async function listRelatedArticlesForTool(
	toolId: string,
	limit: number
) {
	const safeLimit = Math.max(1, limit)
	const links = await prisma.articleTool.findMany({
		where: {
			toolId,
			article: {
				status: "PUBLISHED",
			},
		},
		take: safeLimit,
		orderBy: {
			article: {
				publishedAt: "desc",
			},
		},
		include: {
			article: {
				include: {
					author: true,
					category: true,
				},
			},
		},
	})

	const directlyLinked = links.map((link) => link.article)
	if (directlyLinked.length >= safeLimit) {
		return directlyLinked
	}

	// Fill missing editorial links with recent articles from the tool's own
	// category. This helps older tool pages discover newer, relevant content
	// even when no explicit ArticleTool mapping exists yet.
	const tool = await prisma.tool.findUnique({
		where: { id: toolId },
		select: { category: { select: { slug: true } } },
	})
	if (!tool?.category.slug) return directlyLinked

	const fallbackArticles = await prisma.article.findMany({
		where: {
			status: "PUBLISHED",
			category: { slug: tool.category.slug },
			...(directlyLinked.length > 0
				? { id: { notIn: directlyLinked.map((article) => article.id) } }
				: {}),
		},
		include: {
			author: true,
			category: true,
		},
		orderBy: {
			publishedAt: "desc",
		},
		take: safeLimit - directlyLinked.length,
	})

	return [...directlyLinked, ...fallbackArticles].slice(0, safeLimit)
}

