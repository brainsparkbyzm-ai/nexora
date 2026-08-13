import { NextResponse } from "next/server"

/**
 * Consistent API response envelope used by every route under /api. Keeping
 * this in one place means the response shape (and error format) can change
 * once instead of being copy-pasted into every handler (§38).
 */
export function apiSuccess<T>(data: T, init?: number) {
	return NextResponse.json({ ok: true, data }, { status: init ?? 200 })
}

export function apiError(message: string, status = 400, details?: unknown) {
	return NextResponse.json({ ok: false, error: { message, details } }, { status })
}

export function apiRateLimited(retryAfterSeconds: number) {
	return NextResponse.json(
		{ ok: false, error: { message: "Too many requests. Please try again shortly." } },
		{ status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
	)
}
