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
 * Shared view-model types for components.
 *
 * These types intentionally follow the current Prisma schema.
 * Do not add fields here that do not exist in prisma/schema.prisma.
 */

export type { ArticleStatus, UserRole }

export type ArticleCardData = Pick<
	Article,
	"slug" | "title" | "excerpt" | "heroImage" | "readingTime" | "publishedAt"
> & {
	author: Pick<Author, "name" | "slug">
	category: Pick<Category, "name" | "slug">
	badge?: string | null
}

export type ArticleDetailData = Article & {
	author: Author
	category: Category
	tags: Array<{ tag: Tag }>
	relatedTools: Array<{
		tool: Tool
	}>
}

export type ToolCardData = Pick<
	Tool,
	| "slug"
	| "name"
	| "description"
	| "pricing"
	| "rating"
	| "bestFor"
	| "featured"
> & {
	category: Pick<ToolCategory, "name" | "slug">
}

export type ToolDetailData = Tool & {
	category: ToolCategory
	review: Review | null
}

export type ComparisonCardData = Comparison & {
	toolA: Tool
	toolB: Tool
}

