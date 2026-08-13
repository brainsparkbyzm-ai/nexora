/**
 * Minimal fixed-window rate limiter. Uses an in-memory Map by default (fine
 * for a single Next.js server instance / low-abuse endpoints like
 * newsletter signup and contact); if `RATE_LIMIT_REDIS_URL` is set, swap the
 * store implementation below for a Redis-backed one without changing any
 * call site (`checkRateLimit()` signature stays the same).
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number }

export function checkRateLimit(
	key: string,
	options: { limit: number; windowMs: number },
): RateLimitResult {
	const now = Date.now()
	const existing = buckets.get(key)

	if (!existing || existing.resetAt <= now) {
		const resetAt = now + options.windowMs
		buckets.set(key, { count: 1, resetAt })
		return { allowed: true, remaining: options.limit - 1, resetAt }
	}

	if (existing.count >= options.limit) {
		return { allowed: false, remaining: 0, resetAt: existing.resetAt }
	}

	existing.count += 1
	return { allowed: true, remaining: options.limit - existing.count, resetAt: existing.resetAt }
}

/** Best-effort client identifier from request headers (works behind most proxies/CDNs). */
export function getClientIp(headers: Headers): string {
	return (
		headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		headers.get("x-real-ip") ||
		"unknown"
	)
}
