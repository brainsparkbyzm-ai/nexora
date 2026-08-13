import { prisma } from "@/lib/prisma"
import { ArticleStatus, Prisma } from "@prisma/client"

/**
 * Repository layer: the ONLY place that talks to Prisma for articles.
 * Services (src/services/articleService.ts) and API routes call these
 * functions instead of `prisma.article.*` directly, so query shape changes
 * (e.g. adding a join, changing an index) happen in one place.
 */

const articleWithRelations = {
	author: true,
	category: true,
	tags: { include: { tag: true } },
	relatedTools: { include: { tool: { include: { category: true } } } },
} satisfies Prisma.ArticleInclude

export type ArticleWithRelations = Prisma.ArticleGetPayload<{ include: typeof articleWithRelations }>

export async function findPublishedArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
	return prisma.article.findFirst({
		where: { slug, status: ArticleStatus.PUBLISHED },
		include: articleWithRelations,
	})
}

export async function findArticleByIdOrSlug(idOrSlug: string): Promise<ArticleWithRelations | null> {
	return prisma.article.findFirst({
		where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
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

export async function listArticles(filter: ListArticlesFilter): Promise<{
	items: ArticleWithRelations[]
	total: number
	page: number
	pageSize: number
}> {
	const page = Math.max(1, filter.page ?? 1)
	const pageSize = Math.min(50, Math.max(1, filter.pageSize ?? 12))

	const where: Prisma.ArticleWhereInput = {
		status: filter.status ?? ArticleStatus.PUBLISHED,
		...(filter.categorySlug ? { category: { slug: filter.categorySlug } } : {}),
		...(filter.tagSlug ? { tags: { some: { tag: { slug: filter.tagSlug } } } } : {}),
		...(filter.authorSlug ? { author: { slug: filter.authorSlug } } : {}),
		...(filter.authorId ? { authorId: filter.authorId } : {}),
		...(filter.featured != null ? { featured: filter.featured } : {}),
		...(filter.trending != null ? { trending: filter.trending } : {}),
		...(filter.search
			? {
					OR: [
						{ title: { contains: filter.search, mode: "insensitive" } },
						{ excerpt: { contains: filter.search, mode: "insensitive" } },
					],
				}
			: {}),
	}

	const [items, total] = await Promise.all([
		prisma.article.findMany({
			where,
			include: articleWithRelations,
			orderBy: { publishedAt: "desc" },
			skip: (page - 1) * pageSize,
			take: pageSize,
		}),
		prisma.article.count({ where }),
	])

	return { items, total, page, pageSize }
}

export async function listRelatedArticles(article: ArticleWithRelations, limit: number) {
	return prisma.article.findMany({
		where: {
			status: ArticleStatus.PUBLISHED,
			id: { not: article.id },
			categoryId: article.categoryId,
		},
		include: articleWithRelations,
		orderBy: { publishedAt: "desc" },
		take: limit,
	})
}

export async function createArticle(data: Prisma.ArticleCreateInput) {
	return prisma.article.create({ data, include: articleWithRelations })
}

export async function updateArticle(id: string, data: Prisma.ArticleUncheckedUpdateInput) {
	return prisma.article.update({ where: { id }, data, include: articleWithRelations })
}

export async function deleteArticle(id: string) {
	return prisma.article.delete({ where: { id } })
}

export async function createRevisionSnapshot(articleId: string, editedBy: string | null) {
	const article = await prisma.article.findUniqueOrThrow({ where: { id: articleId } })
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
		where: { status: ArticleStatus.PUBLISHED },
		select: { slug: true },
	})
	return rows.map((r) => r.slug)
}
