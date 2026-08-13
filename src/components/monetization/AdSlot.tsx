import Script from "next/script"
import { getSiteSettings } from "@/services/settingsService"

/**
 * Reusable, provider-agnostic ad placement (Rule 10/11/24/30). The public
 * site never imports an ad SDK directly -- only this component does -- so
 * switching providers or disabling ads entirely is a one-file / one-env-var
 * change (ADS_ENABLED, AD_PROVIDER).
 *
 * Renders nothing when ads are disabled or unconfigured at the environment
 * level, OR when the admin has turned ads off in Settings
 * (`SiteSettings.adsEnabled`, editable from /admin/settings). Both checks
 * must pass -- the env vars are the deploy-time "is this environment allowed
 * to serve ads at all" switch, and the DB flag is the editorial "should we
 * actually show them right now" switch. This makes SiteSettings genuinely
 * authoritative (Rule 30) instead of a setting the public site ignores.
 *
 * Always renders a fixed-height reserved container when it does render ads
 * so they never cause layout shift (CLS) or overlap navigation/content.
 */

export type AdPlacement =
	| "article-top"
	| "article-middle"
	| "article-bottom"
	| "sidebar"
	| "category-feed"
	| "homepage-feed"

const SLOT_DIMENSIONS: Record<AdPlacement, string> = {
	"article-top": "min-h-[100px]",
	"article-middle": "min-h-[250px]",
	"article-bottom": "min-h-[250px]",
	sidebar: "min-h-[600px]",
	"category-feed": "min-h-[200px]",
	"homepage-feed": "min-h-[200px]",
}

// Maps a placement to its configurable AdSense ad-unit slot ID env var.
// Every placement is independently configurable so editors can enable ads
// one placement at a time (Rule 11 -- conservative, non-flooding placement).
const SLOT_ENV_VARS: Record<AdPlacement, string | undefined> = {
	"article-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP,
	"article-middle": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MIDDLE,
	"article-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM,
	sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
	"category-feed": process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY_FEED,
	"homepage-feed": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE_FEED,
}

export async function AdSlot({ placement }: { placement: AdPlacement }) {
	const envAdsEnabled = process.env.ADS_ENABLED === "true"
	const provider = process.env.AD_PROVIDER || "adsense"
	const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
	const slotId = SLOT_ENV_VARS[placement]

	// Never render an ad container -- not even a placeholder -- unless ads are
	// explicitly enabled AND fully configured for this placement at the
	// environment level. This guarantees no deceptive/empty ad containers ship
	// to production (Rule 10).
	if (!envAdsEnabled || provider !== "adsense" || !clientId || !slotId) return null

	// Admin-level kill switch: SiteSettings.adsEnabled must also be true.
	const settings = await getSiteSettings()
	if (!settings?.adsEnabled) return null

	return (
		<div
			data-ad-placement={placement}
			data-ad-provider={provider}
			className={`flex w-full items-center justify-center overflow-hidden ${SLOT_DIMENSIONS[placement]}`}
			aria-label="Advertisement"
		>
			{/* adsbygoogle.js is loaded once globally from the root layout, gated
			    behind the same env + SiteSettings checks (see src/app/layout.tsx). */}
			<ins
				className="adsbygoogle"
				style={{ display: "block", width: "100%", height: "100%" }}
				data-ad-client={clientId}
				data-ad-slot={slotId}
				data-ad-format="auto"
				data-full-width-responsive="true"
			/>
			<AdSlotActivator />
		</div>
	)
}

// Pushes this slot to the adsbygoogle queue once the <ins> tag is in the DOM.
// Using next/script's inline strategy (rather than a client component +
// useEffect) keeps AdSlot itself a server component, so ad code never forces
// article/category/homepage pages to become client components.
function AdSlotActivator() {
	return (
		<Script id="adsbygoogle-push" strategy="afterInteractive">
			{"(window.adsbygoogle = window.adsbygoogle || []).push({});"}
		</Script>
	)
}
