/**
 * Centralized site metadata + navigation + homepage section configuration.
 *
 * Editorial/product changes (renaming a nav item, reordering the homepage,
 * enabling/disabling a section, changing SEO defaults) happen HERE, not by
 * editing page components. Longer term, `homepageSections` and `nav` are
 * designed to be moved into `SiteSettings` (see prisma/schema.prisma) and
 * edited from /admin/settings without a deploy — src/services/settingsService.ts
 * already reads through this shape so that migration is additive.
 */

export type NavItem = { label: string; href: string }

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
	// For category-backed sections, the Category.slug to pull articles from.
	categorySlug?: string
	title?: string
}

export const siteConfig = {
	name: "NEXORA",
	tagline: "The Future of Work Is Agentic",
	description:
		"NEXORA is a premium AI technology publication covering AI agents, automation, productivity, business AI, and the software reshaping how people work.",
	url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexora.com",
	domain: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexora.com").hostname,
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
		defaultTitle: "NEXORA — AI Agents, Automation & the Future of Work",
		defaultDescription:
			"In-depth AI agent guides, automation workflows, tool reviews and comparisons for people building the future of work.",
		defaultOgImage: "/og/default-og.png",
	},
} as const

export const primaryNav: NavItem[] = [
	{ label: "AI Agents", href: "/ai-agents" },
	{ label: "Automation", href: "/automation" },
	{ label: "AI Tools", href: "/ai-tools" },
	{ label: "Productivity", href: "/productivity" },
	{ label: "Business", href: "/business-ai" },
	{ label: "Reviews", href: "/reviews" },
]

export const mobileNav: NavItem[] = [
	...primaryNav,
	{ label: "Guides", href: "/guides" },
	{ label: "About", href: "/about" },
]

export const footerNav = {
	explore: [
		{ label: "AI Agents", href: "/ai-agents" },
		{ label: "Automation", href: "/automation" },
		{ label: "AI Tools", href: "/ai-tools" },
		{ label: "Productivity", href: "/productivity" },
		{ label: "Business AI", href: "/business-ai" },
	] satisfies NavItem[],
	resources: [
		{ label: "Guides", href: "/guides" },
		{ label: "Reviews", href: "/reviews" },
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

// Default homepage layout — order + enabled state drive src/app/page.tsx.
// Reordering or disabling a section is a config change, never a code change.
export const defaultHomepageSections: HomepageSectionConfig[] = [
	{ key: "hero", enabled: true },
	{ key: "trending", enabled: true, title: "Trending Now" },
	{ key: "featured", enabled: true, title: "Featured Story" },
	{ key: "latest", enabled: true, title: "Latest Articles" },
	{ key: "aiAgents", enabled: true, categorySlug: "ai-agents", title: "AI Agents" },
	{ key: "automation", enabled: true, categorySlug: "automation", title: "Automation" },
	{ key: "productivity", enabled: true, categorySlug: "productivity", title: "AI Productivity" },
	{ key: "toolReviews", enabled: true, title: "AI Tool Reviews" },
	{ key: "bestTools", enabled: true, title: "Best AI Tools" },
	{ key: "businessAI", enabled: true, categorySlug: "business-ai", title: "Business AI" },
	{ key: "guides", enabled: true, categorySlug: "guides", title: "AI Guides" },
	{ key: "newsletter", enabled: true },
]

// Fixed top-level categories referenced throughout the app (seed data,
// category routes, nav). Editors can still add further categories from
// /admin/categories; those simply won't appear in primaryNav until added
// there, but will work at /[category].
export const coreCategorySlugs = [
	"ai-agents",
	"automation",
	"ai-tools",
	"productivity",
	"business-ai",
	"reviews",
	"guides",
] as const
