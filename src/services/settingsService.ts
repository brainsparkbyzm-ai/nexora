import { prisma } from "@/lib/prisma"
import { defaultHomepageSections, type HomepageSectionConfig } from "@/config/site"

/**
 * Reads/writes the singleton SiteSettings row. Admin > Settings edits flow
 * through here; the public site (homepage, footer, SEO defaults) reads
 * through here too, falling back to src/config/site.ts defaults when no
 * database row exists yet (fresh installs).
 */

export async function getSiteSettings() {
	const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } })
	return settings
}

export async function getHomepageSections(): Promise<HomepageSectionConfig[]> {
	const settings = await getSiteSettings()
	if (settings?.homepageSections) {
		return settings.homepageSections as unknown as HomepageSectionConfig[]
	}
	return defaultHomepageSections
}

export async function upsertSiteSettings(data: {
	siteName?: string
	logoUrl?: string | null
	description?: string | null
	defaultSeoTitle?: string | null
	defaultSeoDescription?: string | null
	socialLinks?: Record<string, string>
	newsletterEnabled?: boolean
	adsEnabled?: boolean
	affiliateEnabled?: boolean
	homepageSections?: HomepageSectionConfig[]
}) {
	return prisma.siteSettings.upsert({
		where: { id: "singleton" },
		create: { id: "singleton", ...data },
		update: data,
	})
}
