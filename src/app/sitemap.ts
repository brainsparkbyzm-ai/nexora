import type { MetadataRoute } from "next"

import { siteConfig, coreCategorySlugs } from "@/config/site"
import { listAllSlugs } from "@/repositories/articleRepository"
import { prisma } from "@/lib/prisma"

/**
 * Production sitemap.
 *
 * Only lists real, indexable URLs.
 * Admin, API and search URLs are intentionally excluded.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [articleSlugs, tools, comparisons, authors] = await Promise.all([
		listAllSlugs(),

		prisma.tool.findMany({
			select: {
				slug: true,
				updatedAt: true,
			},
		}),

		prisma.comparison.findMany({
			select: {
				slug: true,
				updatedAt: true,
			},
		}),

		prisma.author.findMany({
			select: {
				slug: true,
				updatedAt: true,
			},
		}),
	])

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: siteConfig.url,
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${siteConfig.url}/tools`,
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${siteConfig.url}/newsletter`,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${siteConfig.url}/about`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteConfig.url}/contact`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteConfig.url}/privacy`,
			changeFrequency: "yearly",
			priority: 0.2,
		},
		{
			url: `${siteConfig.url}/terms`,
			changeFrequency: "yearly",
			priority: 0.2,
		},
		{
			url: `${siteConfig.url}/cookies`,
			changeFrequency: "yearly",
			priority: 0.2,
		},
		{
			url: `${siteConfig.url}/affiliate-disclosure`,
			changeFrequency: "yearly",
			priority: 0.2,
		},
		{
			url: `${siteConfig.url}/editorial-policy`,
			changeFrequency: "yearly",
			priority: 0.2,
		},
	]

	const categoryRoutes: MetadataRoute.Sitemap = coreCategorySlugs.map(
		(slug) => ({
			url: `${siteConfig.url}/${slug}`,
			changeFrequency: "daily",
			priority: 0.7,
		}),
	)

	const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
		url: `${siteConfig.url}/articles/${slug}`,
		changeFrequency: "weekly",
		priority: 0.6,
	}))

	const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
		url: `${siteConfig.url}/tools/${tool.slug}`,
		lastModified: tool.updatedAt,
		changeFrequency: "weekly",
		priority: 0.6,
	}))

	const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map(
		(comparison) => ({
			url: `${siteConfig.url}/compare/${comparison.slug}`,
			lastModified: comparison.updatedAt,
			changeFrequency: "monthly",
			priority: 0.5,
		}),
	)

	const authorRoutes: MetadataRoute.Sitemap = authors.map((author) => ({
		url: `${siteConfig.url}/authors/${author.slug}`,
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