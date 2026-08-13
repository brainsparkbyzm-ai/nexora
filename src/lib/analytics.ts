/**
 * Analytics abstraction. Components/route handlers call `track()` /
 * `trackPageView()` — never a vendor SDK directly — so the analytics
 * provider (Plausible by default; swappable for GA4/PostHog/etc.) can
 * change without touching call sites, and so events still work if no
 * provider is configured (they simply become a `ViewEvent`/log row).
 */
import { prisma } from "@/lib/prisma"

export type AnalyticsEvent =
	| { name: "page_view"; path: string; referrer?: string | null }
	| { name: "article_view"; articleId: string; path: string }
	| { name: "search"; query: string; resultCount: number }
	| { name: "tool_click"; toolId: string; source?: string }
	| { name: "affiliate_click"; toolId: string; source?: string }
	| { name: "newsletter_signup"; email: string }

export async function track(event: AnalyticsEvent): Promise<void> {
	try {
		switch (event.name) {
			case "page_view":
				await prisma.viewEvent.create({
					data: { path: event.path, referrer: event.referrer ?? null },
				})
				return
			case "article_view":
				await prisma.viewEvent.create({
					data: { articleId: event.articleId, path: event.path },
				})
				return
			case "search":
				await prisma.searchLog.create({
					data: { query: event.query, resultCount: event.resultCount },
				})
				return
			case "tool_click":
				// Directory/article click-through without an affiliate redirect.
				return
			case "affiliate_click":
				await prisma.affiliateClick.create({
					data: { toolId: event.toolId, source: event.source ?? null },
				})
				return
			case "newsletter_signup":
				return
		}
	} catch (error) {
		// Analytics must never break the user-facing request.
		console.error("analytics.track failed", error)
	}
}
