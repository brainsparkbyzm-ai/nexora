/**
 * Centralized site metadata + navigation + homepage section configuration.
 *
 * Editorial/product changes (renaming a nav item, reordering the homepage,
 * enabling/disabling a section, changing SEO defaults) happen HERE, not by
 * editing page components.
 */

export type NavItem = {
	label: string
	href: string
}

export type HomepageSectionKey =
	| "hero"
	| "trending"
	| "featured"
	| "latest"
	| "aiAgents"
	| "automation"
	| "productivity"
	| "toolReviews"
	| "bestTools"
	| "businessAI"
	| "guides"
	| "newsletter"

export type HomepageSectionConfig = {
	key: HomepageSectionKey
	enabled: boolean
	categorySlug?: string
	title?: string
}

/**
 * Production site URL.
 *
 * Set NEXT_PUBLIC_SITE_URL in your deployment environment.
 * Example:
 * https://your-domain.com
 *
 * The fallback keeps local development and builds from crashing when the
 * environment variable has not been configured yet.
 */
const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.nexorahub.space"

const normalizedSiteUrl = (() => {
	try {
		const url = new URL(siteUrl)
		// Production serves the www hostname; normalize the apex host so
		// canonicals, sitemap entries, robots.txt and structured data agree.
		if (url.hostname.toLowerCase() === "nexorahub.space") {
			url.hostname = "www.nexorahub.space"
		}
		return url.toString().replace(/\/$/, "")
	} catch {
		return "https://www.nexorahub.space"
	}
})()

let siteDomain = "www.nexorahub.space"

try {
	siteDomain = new URL(normalizedSiteUrl).hostname
} catch {
	// Keep a safe fallback instead of crashing the build.
	siteDomain = "www.nexorahub.space"
}

export const siteConfig = {
	name: "NEXORA",
	tagline: "The Future of Work Is Agentic",
	description:
		"NEXORA is a premium AI technology publication covering AI agents, automation, productivity, business AI, and the software reshaping how people work.",

	url: normalizedSiteUrl,
	domain: siteDomain,

	locale: "en_US",
	twitterHandle: "@nexoraAI",

	socialLinks: {
		twitter: "https://twitter.com/nexoraAI",
		linkedin: "https://linkedin.com/company/nexora",
		youtube: "https://youtube.com/@nexoraAI",
	},

	logo: {
		light: "/brand/nexora-logo-light.svg",
		dark: "/brand/nexora-logo-dark.svg",
		mark: "/brand/nexora-mark.svg",
	},

	seoDefaults: {
		titleTemplate: "%s | NEXORA",

		defaultTitle:
			"NEXORA — AI Agents, Automation & the Future of Work",

		defaultDescription:
			"In-depth AI agent guides, automation workflows, tool reviews and comparisons for people building the future of work.",

		defaultOgImage: "/og/default-og.png",
	},
} as const

export const primaryNav: NavItem[] = [
	{ label: "AI Assistants", href: "/ai-assistants" },
	{ label: "Automation", href: "/automation" },
	{ label: "AI Tools", href: "/tools" },
	{ label: "AI Writing", href: "/ai-writing" },
	{ label: "Business", href: "/business-ai" },
	{ label: "Future of Work", href: "/future-of-work" },
]

export const mobileNav: NavItem[] = [
	...primaryNav,
	{ label: "AI Image", href: "/ai-image" },
	{ label: "About", href: "/about" },
]

export const footerNav = {
	explore: [
		{ label: "AI Assistants", href: "/ai-assistants" },
		{ label: "Automation", href: "/automation" },
		{ label: "AI Tools", href: "/tools" },
		{ label: "Future of Work", href: "/future-of-work" },
		{ label: "Business AI", href: "/business-ai" },
	] satisfies NavItem[],

	resources: [
		{ label: "AI Coding", href: "/ai-coding" },
		{ label: "AI Image", href: "/ai-image" },
		{ label: "Comparisons", href: "/tools" },
		{ label: "Search", href: "/search" },
	] satisfies NavItem[],

	company: [
		{ label: "About", href: "/about" },
		{ label: "Contact", href: "/contact" },
		{ label: "Editorial Policy", href: "/editorial-policy" },
		{ label: "Privacy", href: "/privacy" },
		{ label: "Terms", href: "/terms" },
		{ label: "Cookie Policy", href: "/cookies" },
		{ label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
	] satisfies NavItem[],
}

// Default homepage layout.
export const defaultHomepageSections: HomepageSectionConfig[] = [
	{ key: "hero", enabled: true },

	{
		key: "trending",
		enabled: true,
		title: "Trending Now",
	},

	{
		key: "featured",
		enabled: true,
		title: "Featured Story",
	},

	{
		key: "latest",
		enabled: true,
		title: "Latest Articles",
	},

	{
		key: "aiAgents",
		enabled: true,
		categorySlug: "ai-assistants",
		title: "AI Assistants",
	},

	{
		key: "automation",
		enabled: true,
		categorySlug: "automation",
		title: "Automation",
	},

	{
		key: "productivity",
		enabled: true,
		categorySlug: "future-of-work",
		title: "AI Productivity",
	},

	{
		key: "toolReviews",
		enabled: true,
		title: "AI Tool Reviews",
	},

	{
		key: "bestTools",
		enabled: true,
		title: "Best AI Tools",
	},

	{
		key: "businessAI",
		enabled: true,
		categorySlug: "business-ai",
		title: "Business AI",
	},

	{
		key: "guides",
		enabled: true,
		categorySlug: "ai-writing",
		title: "AI Guides",
	},

	{
		key: "newsletter",
		enabled: true,
	},
]

export const coreCategorySlugs = [
	"ai-assistants",
	"ai-coding",
	"ai-writing",
	"ai-image",
	"automation",
	"business-ai",
	"future-of-work",
] as const
