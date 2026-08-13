import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

export type SeoInput = {
	title: string
	description: string
	path: string // e.g. "/articles/my-slug"
	image?: string | null
	canonicalUrl?: string | null
	type?: "website" | "article"
	noindex?: boolean
}

/** Builds a Next.js Metadata object with consistent canonical/OG/Twitter tags. */
export function buildMetadata(input: SeoInput): Metadata {
	const url = input.canonicalUrl ? new URL(input.canonicalUrl, siteConfig.url).toString() : new URL(input.path, siteConfig.url).toString()
	const image = input.image ?? siteConfig.seoDefaults.defaultOgImage

	return {
		title: input.title,
		description: input.description,
		alternates: { canonical: url },
		robots: input.noindex ? { index: false, follow: false } : { index: true, follow: true },
		openGraph: {
			title: input.title,
			description: input.description,
			url,
			siteName: siteConfig.name,
			type: input.type ?? "website",
			images: image ? [{ url: image }] : undefined,
			locale: siteConfig.locale,
		},
		twitter: {
			card: "summary_large_image",
			title: input.title,
			description: input.description,
			site: siteConfig.twitterHandle,
			images: image ? [image] : undefined,
		},
	}
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD) builders. Only ever fed real, existing content —
// never fabricated ratings/counts (see docs/ARCHITECTURE.md §22).
// ---------------------------------------------------------------------------

export function organizationSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.name,
		url: siteConfig.url,
		logo: new URL(siteConfig.logo.mark, siteConfig.url).toString(),
		sameAs: Object.values(siteConfig.socialLinks),
	}
}

export function websiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name,
		url: siteConfig.url,
		potentialAction: {
			"@type": "SearchAction",
			target: `${siteConfig.url}/search?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	}
}

export function articleSchema(article: {
	title: string
	excerpt: string
	slug: string
	heroImage?: string | null
	publishedAt?: Date | null
	updatedAt: Date
	authorName: string
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.excerpt,
		image: article.heroImage ? [article.heroImage] : undefined,
		datePublished: article.publishedAt?.toISOString(),
		dateModified: article.updatedAt.toISOString(),
		author: { "@type": "Person", name: article.authorName },
		publisher: {
			"@type": "Organization",
			name: siteConfig.name,
			logo: { "@type": "ImageObject", url: new URL(siteConfig.logo.mark, siteConfig.url).toString() },
		},
		mainEntityOfPage: new URL(`/articles/${article.slug}`, siteConfig.url).toString(),
	}
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: new URL(item.path, siteConfig.url).toString(),
		})),
	}
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
	if (faqs.length === 0) return null
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: { "@type": "Answer", text: faq.answer },
		})),
	}
}

export function softwareApplicationSchema(tool: {
	name: string
	description: string
	rating?: number | null
	ratingCount?: number | null
}) {
	const base: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: tool.name,
		description: tool.description,
		applicationCategory: "BusinessApplication",
	}
	// Only attach aggregateRating when we have a *real* rating on file.
	if (tool.rating != null && tool.ratingCount != null && tool.ratingCount > 0) {
		base.aggregateRating = {
			"@type": "AggregateRating",
			ratingValue: tool.rating,
			ratingCount: tool.ratingCount,
		}
	}
	return base
}
