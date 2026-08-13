import type {
	Article,
	Author,
	Category,
	Tag,
	Tool,
	ToolCategory,
	Review,
	Comparison,
	ArticleStatus,
	UserRole,
} from "@prisma/client"

/**
 * Shared view-model types for components. Prisma model types are re-exported
 * / composed here so components import from one place (`@/types/content`)
 * instead of reaching into `@prisma/client` or repositories directly.
 */

export type { ArticleStatus, UserRole }

export type ArticleCardData = Pick<
	Article,
	"slug" | "title" | "excerpt" | "heroImage" | "readingTime" | "publishedAt"
> & {
	author: Pick<Author, "name" | "slug" | "avatarUrl">
	category: Pick<Category, "name" | "slug">
	badge?: string | null
}

export type ArticleDetailData = Article & {
	author: Author
	category: Category
	tags: Array<{ tag: Tag }>
}

export type ToolCardData = Pick<
	Tool,
	"slug" | "name" | "logoUrl" | "description" | "pricing" | "rating" | "bestFor" | "featured"
> & {
	category: Pick<ToolCategory, "name" | "slug">
}

export type ToolDetailData = Tool & {
	category: ToolCategory
	review: Review | null
}

export type ComparisonCardData = Comparison & { toolA: Tool; toolB: Tool }
