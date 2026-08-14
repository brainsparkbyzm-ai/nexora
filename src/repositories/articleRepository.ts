import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type ArticleStatus = NonNullable<Prisma.ArticleWhereInput["status"]>

/**
 * Repository layer: the ONLY place that talks to Prisma for articles.
 * Services and API routes call these functions instead of prisma.article.* directly.
 */

const articleWithRelations = {
	author: true,
	category: true,
	tags: {
		include: {
			tag: true,
		},
	},
} satisfies Prisma.ArticleInclude

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
	include: typeof articleWithRelations
}>

export async function findPublishedArticleBySlug(
	slug: string
): Promise<ArticleWithRelations | null> {
	return prisma.article.findFirst({
		where: {
			slug,
			status: "PUBLISHED",
		},
		include: articleWithRelations,
	})
}

export async function findArticleByIdOrSlug(
	idOrSlug: string
): Promise<ArticleWithRelations | null> {
	return prisma.article.findFirst({
		where: {
			OR: [
				{ id: idOrSlug },
				{ slug: idOrSlug },
			],
		},
		include: articleWithRelations,
	})
}

export type ListArticlesFilter = {
	status?: ArticleStatus
	categorySlug?: string
	tagSlug?: string
	authorSlug?: string
	authorId?: string
	featured?: boolean
	trending?: boolean
	search?: string
	page?: number
	pageSize?: number
}

export async function listArticles(
	filter: ListArticlesFilter
): Promise<{
	items: ArticleWithRelations[]
	total: number
	page: number
	pageSize: number
}> {
	const page = Math.max(1, filter.page ?? 1)
	const pageSize = Math.min(
		50,
		Math.max(1, filter.pageSize ?? 12)
	)

	const where: Prisma.ArticleWhereInput = {
		status: filter.status ?? "PUBLISHED",
	}

	if (filter.categorySlug) {
		where.category = {
			slug: filter.categorySlug,
		}
	}

	if (filter.tagSlug) {
		where.tags = {
			some: {
				tag: {
					slug: filter.tagSlug,
				},
			},
		}
	}

	if (filter.authorSlug) {
		where.author = {
			slug: filter.authorSlug,
		}
	}

	if (filter.authorId) {
		where.authorId = filter.authorId
	}

	if (filter.featured !== undefined) {
		where.featured = filter.featured
	}

	if (filter.trending !== undefined) {
		where.trending = filter.trending
	}

	if (filter.search) {
		where.OR = [
			{
				title: {
					contains: filter.search,
					mode: "insensitive",
				},
			},
			{
				excerpt: {
					contains: filter.search,
					mode: "insensitive",
				},
			},
		]
	}

	const [items, total] = await Promise.all([
		prisma.article.findMany({
			where,
			include: articleWithRelations,
			orderBy: {
				publishedAt: "desc",
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
		}),

		prisma.article.count({
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

export async function listRelatedArticles(
	article: ArticleWithRelations,
	limit: number
): Promise<ArticleWithRelations[]> {
	return prisma.article.findMany({
		where: {
			status: "PUBLISHED",
			id: {
				not: article.id,
			},
			categoryId: article.categoryId,
		},
		include: articleWithRelations,
		orderBy: {
			publishedAt: "desc",
		},
		take: Math.max(1, limit),
	})
}

export async function createArticle(
	data: Prisma.ArticleCreateInput
): Promise<ArticleWithRelations> {
	return prisma.article.create({
		data,
		include: articleWithRelations,
	})
}

export async function updateArticle(
	id: string,
	data: Prisma.ArticleUncheckedUpdateInput
): Promise<ArticleWithRelations> {
	return prisma.article.update({
		where: {
			id,
		},
		data,
		include: articleWithRelations,
	})
}

export async function deleteArticle(id: string) {
	return prisma.article.delete({
		where: {
			id,
		},
	})
}

export async function createRevisionSnapshot(
	articleId: string,
	editedBy: string | null
) {
	const article = await prisma.article.findUniqueOrThrow({
		where: {
			id: articleId,
		},
	})

	return prisma.revision.create({
		data: {
			articleId,
			title: article.title,
			excerpt: article.excerpt,
			content: article.content,
			editedBy,
		},
	})
}

export async function listAllSlugs(): Promise<string[]> {
	const rows = await prisma.article.findMany({
		where: {
			status: "PUBLISHED",
		},
		select: {
			slug: true,
		},
	})

	return rows.map((row) => row.slug)
}