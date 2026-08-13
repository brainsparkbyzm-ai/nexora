/**
 * Affiliate link + disclosure helpers. Centralizing this means changing the
 * tracking param, default tag, or disclosure copy is a one-file change
 * (see docs/ARCHITECTURE.md §25).
 */

export function buildAffiliateUrl(baseUrl: string, toolSlug: string): string {
	const param = process.env.AFFILIATE_TRACKING_PARAM || "ref"
	const tag = process.env.AFFILIATE_DEFAULT_TAG || "nexora"
	try {
		const url = new URL(baseUrl)
		url.searchParams.set(param, `${tag}-${toolSlug}`)
		return url.toString()
	} catch {
		return baseUrl
	}
}

export const AFFILIATE_DISCLOSURE_SHORT =
	"NEXORA may earn a commission if you sign up through links on this page. This never affects our editorial rankings."
