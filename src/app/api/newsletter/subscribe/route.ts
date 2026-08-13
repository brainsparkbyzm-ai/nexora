import type { NextRequest } from "next/server"
import { apiError, apiRateLimited, apiSuccess } from "@/lib/apiResponse"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit"
import { subscribeToNewsletter } from "@/services/newsletterService"

export async function POST(request: NextRequest) {
	const ip = getClientIp(request.headers)
	const rateLimit = checkRateLimit(`newsletter:${ip}`, { windowMs: 60_000, limit: 5 })
	if (!rateLimit.allowed) return apiRateLimited(Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)))

	let body: unknown
	try {
		body = await request.json()
	} catch {
		return apiError("Invalid JSON body.")
	}

	const result = await subscribeToNewsletter(body)
	if (!result.success) return apiError(result.message, 422, result.fieldErrors)

	return apiSuccess({ status: result.alreadySubscribed ? "already_subscribed" : "subscribed" })
}
