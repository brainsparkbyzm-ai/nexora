import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { prisma } from "@/lib/prisma"

/**
 * Include only URLs backed by real public records. Category and author
 * archives with no published articles are excluded to avoid thin/empty URLs.
 * Search, admin, API and other parameterized utility pages are not listed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [articles, tools, comparisons, categories, authors] = await Promise.all([
		prisma.article.findMany({
			where: { status: "PUBLISHED" },
				select: { slug: true, updatedAt: true },
		}),
		prisma.tool.findMany({
			select: { slug: true, updatedAt: true },
		}),
		prisma.comparison.findMany({
			select: { slug: true, updatedAt: true },
		}),
		prisma.category.findMany({
			where: { articles: { some: { status: "PUBLISHED" } } },
			select: { slug: true, updatedAt: true },
		}),
		prisma.author.findMany({
			where: { articles: { some: { status: "PUBLISHED" } } },
			select: { slug: true, updatedAt: true },
		}),
	])

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: siteConfig.url, changeFrequency: "daily", priority: 1 },
		{ url: new URL("/tools", siteConfig.url).toString(), changeFrequency: "daily", priority: 0.8 },
		{ url: new URL("/newsletter", siteConfig.url).toString(), changeFrequency: "monthly", priority: 0.5 },
		{ url: new URL("/about", siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.3 },
		{ url: new URL("/contact", siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.3 },
		{ url: new URL("/privacy", siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.2 },
		{ url: new URL("/terms", siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.2 },
		{ url: new URL("/cookies", siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.2 },
		{ url: new URL("/affiliate-disclosure", siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.2 },
		{ url: new URL("/editorial-policy", siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.2 },
	]

	// Legacy category slugs permanently redirect to their current canonical routes.
	// Keep redirect-only URLs out of the sitemap so crawlers see final destinations.
	const legacyRedirectCategorySlugs = new Set([
		"ai-agents",
		"ai-tools",
		"guides",
		"productivity",
		"reviews",
	])

	const categoryRoutes: MetadataRoute.Sitemap = categories
		.filter((category) => !legacyRedirectCategorySlugs.has(category.slug))
		.map((category) => ({
		url: new URL(`/${category.slug}`, siteConfig.url).toString(),
		lastModified: category.updatedAt,
		changeFrequency: "weekly",
		priority: 0.7,
	}))

	const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
		url: new URL(`/articles/${article.slug}`, siteConfig.url).toString(),
		lastModified: article.updatedAt,
		changeFrequency: "weekly",
		priority: 0.6,
	}))

	const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
		url: new URL(`/tools/${tool.slug}`, siteConfig.url).toString(),
		lastModified: tool.updatedAt,
		changeFrequency: "weekly",
		priority: 0.6,
	}))

	const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map((comparison) => ({
		url: new URL(`/compare/${comparison.slug}`, siteConfig.url).toString(),
		lastModified: comparison.updatedAt,
		changeFrequency: "monthly",
		priority: 0.5,
	}))

	const authorRoutes: MetadataRoute.Sitemap = authors.map((author) => ({
		url: new URL(`/authors/${author.slug}`, siteConfig.url).toString(),
		lastModified: author.updatedAt,
		changeFrequency: "monthly",
		priority: 0.4,
	}))

	return [
		...staticRoutes,
		...categoryRoutes,
		...articleRoutes,
		...toolRoutes,
		...comparisonRoutes,
		...authorRoutes,
	]
}
