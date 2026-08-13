import type { NextRequest } from "next/server"
import { apiError, apiRateLimited, apiSuccess } from "@/lib/apiResponse"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit"
import { searchContent } from "@/services/searchService"

export async function GET(request: NextRequest) {
	const ip = getClientIp(request.headers)
	const rateLimit = checkRateLimit(`search:${ip}`, { windowMs: 10_000, limit: 20 })
	if (!rateLimit.allowed) return apiRateLimited(Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)))

	const query = request.nextUrl.searchParams.get("q") ?? ""
	if (query.trim().length < 2) return apiSuccess({ items: [] })

	const pageSize = Math.min(20, Number(request.nextUrl.searchParams.get("pageSize") ?? "6") || 6)
	const result = await searchContent({ query, type: "all", page: 1, pageSize })

	const items = [
		...result.articles.map((a) => ({ type: "article", title: a.title, href: `/articles/${a.slug}` })),
		...result.tools.map((t) => ({ type: "tool", title: t.name, href: `/tools/${t.slug}` })),
		...result.categories.map((c) => ({ type: "category", title: c.name, href: `/${c.slug}` })),
	].slice(0, pageSize)

	return apiSuccess({ items })
}
