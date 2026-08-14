/**
 * Analytics abstraction.
 *
 * Components and route handlers call track() / trackPageView()
 * instead of talking to an analytics vendor directly.
 *
 * The implementation below matches the current Prisma schema.
 */

import { prisma } from "@/lib/prisma"

export type AnalyticsEvent =
	| {
			name: "page_view"
			path: string
			referrer?: string | null
	  }
	| {
			name: "article_view"
			articleId: string
			path: string
	  }
	| {
			name: "search"
			query: string
			resultCount: number
	  }
	| {
			name: "tool_click"
			toolId: string
			source?: string
	  }
	| {
			name: "affiliate_click"
			toolId: string
			source?: string
	  }
	| {
			name: "newsletter_signup"
			email: string
	  }

export async function track(event: AnalyticsEvent): Promise<void> {
	try {
		switch (event.name) {
			case "page_view": {
				await prisma.viewEvent.create({
					data: {
						path: event.path,
					},
				})
				return
			}

			case "article_view": {
				await prisma.viewEvent.create({
					data: {
						articleId: event.articleId,
						path: event.path,
					},
				})
				return
			}

			case "search": {
				await prisma.searchLog.create({
					data: {
						query: event.query,
					},
				})
				return
			}

			case "tool_click": {
				// Tool clicks are currently not persisted by the
				// existing Prisma schema.
				return
			}

			case "affiliate_click": {
				await prisma.affiliateClick.create({
					data: {
						toolId: event.toolId,
					},
				})
				return
			}

			case "newsletter_signup": {
				// Newsletter signups are persisted by the
				// newsletter route, not analytics.
				return
			}
		}
	} catch (error) {
		// Analytics must never break a user-facing request.
		console.error("analytics.track failed", error)
	}
}

