import { ArticleStatus, Prisma } from "@prisma/client"
import * as articleRepo from "@/repositories/articleRepository"
import { computeReadingTimeMinutes, slugify } from "@/lib/utils"
import { track } from "@/lib/analytics"
import type { ArticleCardData } from "@/types/content"

/**
 * Business logic for articles. Route handlers and Server Components call
 * into this service, never the repository directly, so rules like
 * "compute reading time on save" or "snapshot a revision before editing"
 * live in exactly one place.
 */

export type CreateArticleInput = {
	title: string
	slug?: string
	excerpt: string
	content: string
	heroImage?: string | null
	authorId: string
	categoryId: string
	tagIds?: string[]
	status?: ArticleStatus
	featured?: boolean
	trending?: boolean
	scheduledAt?: Date | string | null
	seoTitle?: string | null
	seoDescription?: string | null
	canonicalUrl?: string | null
	ogImage?: string | null
}

export async function getArticleForReading(slug: string) {
	const article = await articleRepo.findPublishedArticleBySlug(slug)
	if (!article) return null
	void track({ name: "article_view", articleId: article.id, path: `/articles/${slug}` })
	return article
}

export async function getRelatedArticles(slug: string, limit = 3) {
	const article = await articleRepo.findPublishedArticleBySlug(slug)
	if (!article) return []
	return articleRepo.listRelatedArticles(article, limit)
}

export async function listArticlesForCategory(categorySlug: string, page = 1, pageSize = 12) {
	return articleRepo.listArticles({ categorySlug, page, pageSize })
}

export async function listTrendingArticles(limit = 5) {
	const { items } = await articleRepo.listArticles({ trending: true, pageSize: limit })
	if (items.length > 0) return items
	// Fall back to most recent published articles when no article is flagged trending yet.
	const fallback = await articleRepo.listArticles({ pageSize: limit })
	return fallback.items
}

export async function getFeaturedArticle(categorySlug?: string) {
	const { items } = await articleRepo.listArticles({ featured: true, categorySlug, pageSize: 1 })
	if (items[0]) return items[0]
	const fallback = await articleRepo.listArticles({ categorySlug, pageSize: 1 })
	return fallback.items[0] ?? null
}

export async function listLatestArticles(limit = 8) {
	const { items } = await articleRepo.listArticles({ pageSize: limit })
	return items
}

function asDate(value: Date | string | null | undefined) {
	if (value == null) return null
	return value instanceof Date ? value : new Date(value)
}

function publishedAtFor(status: ArticleStatus | undefined, scheduledAt: Date | string | null | undefined) {
	if (status === ArticleStatus.PUBLISHED) return new Date()
	if (status === ArticleStatus.SCHEDULED) return asDate(scheduledAt)
	return null
}

export async function createArticle(input: CreateArticleInput) {
	const status = input.status ?? ArticleStatus.DRAFT
	return articleRepo.createArticle({
		title: input.title,
		slug: input.slug ? slugify(input.slug) : slugify(input.title),
		excerpt: input.excerpt,
		content: input.content,
		heroImage: input.heroImage ?? null,
		author: { connect: { id: input.authorId } },
		category: { connect: { id: input.categoryId } },
		status,
		featured: input.featured ?? false,
		trending: input.trending ?? false,
		readingTime: computeReadingTimeMinutes(input.content),
		scheduledAt: asDate(input.scheduledAt),
		publishedAt: publishedAtFor(status, input.scheduledAt),
		seoTitle: input.seoTitle ?? null,
		seoDescription: input.seoDescription ?? null,
		canonicalUrl: input.canonicalUrl ?? null,
		ogImage: input.ogImage ?? null,
		tags: input.tagIds
			? { create: input.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
			: undefined,
	})
}

export type UpdateArticleInput = Partial<CreateArticleInput> & { editedBy?: string | null }

export async function updateArticle(id: string, input: UpdateArticleInput) {
	// Snapshot the current state as a revision before applying the update.
	await articleRepo.createRevisionSnapshot(id, input.editedBy ?? null)

	const data: Prisma.ArticleUncheckedUpdateInput = {}
	if (input.title !== undefined) data.title = input.title
	if (input.slug !== undefined) data.slug = slugify(input.slug)
	if (input.excerpt !== undefined) data.excerpt = input.excerpt
	if (input.content !== undefined) {
		data.content = input.content
		data.readingTime = computeReadingTimeMinutes(input.content)
	}
	if (input.heroImage !== undefined) data.heroImage = input.heroImage
	if (input.authorId !== undefined) data.authorId = input.authorId
	if (input.categoryId !== undefined) data.categoryId = input.categoryId
	if (input.featured !== undefined) data.featured = input.featured
	if (input.trending !== undefined) data.trending = input.trending
	if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle
	if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription
	if (input.canonicalUrl !== undefined) data.canonicalUrl = input.canonicalUrl
	if (input.ogImage !== undefined) data.ogImage = input.ogImage
	if (input.scheduledAt !== undefined) data.scheduledAt = asDate(input.scheduledAt)
	if (input.status !== undefined) {
		data.status = input.status
		data.publishedAt = publishedAtFor(input.status, input.scheduledAt)
	}

	return articleRepo.updateArticle(id, data)
}

export function toArticleCardData(article: articleRepo.ArticleWithRelations): ArticleCardData {
	return {
		slug: article.slug,
		title: article.title,
		excerpt: article.excerpt,
		heroImage: article.heroImage,
		readingTime: article.readingTime,
		publishedAt: article.publishedAt,
		author: { name: article.author.name, slug: article.author.slug, avatarUrl: article.author.avatarUrl },
		category: { name: article.category.name, slug: article.category.slug },
	}
}

export async function deleteArticle(id: string) {
	return articleRepo.deleteArticle(id)
}
