import { prisma } from "@/lib/prisma"
import { defaultHomepageSections } from "@/config/site"

export async function getSiteSettings() {
	return prisma.siteSettings.findUnique({
		where: {
			id: "singleton",
		},
	})
}

export async function getHomepageSections() {
	return defaultHomepageSections
}

export async function upsertSiteSettings(data: {
	siteName?: string
	description?: string
	defaultSeoTitle?: string
	defaultSeoDescription?: string
	socialLinks?: Record<string, string>
	newsletterEnabled?: boolean
	adsEnabled?: boolean
	affiliateEnabled?: boolean
}) {
	return prisma.siteSettings.upsert({
		where: {
			id: "singleton",
		},

		create: {
			id: "singleton",
			siteName: data.siteName ?? "NEXORA",
			description: data.description ?? "",
			defaultSeoTitle: data.defaultSeoTitle ?? "",
			defaultSeoDescription:
				data.defaultSeoDescription ?? "",
			socialLinks: data.socialLinks ?? {},
			newsletterEnabled:
				data.newsletterEnabled ?? true,
			adsEnabled: data.adsEnabled ?? false,
			affiliateEnabled:
				data.affiliateEnabled ?? false,
		},

		update: {
			...(data.siteName !== undefined
				? { siteName: data.siteName }
				: {}),

			...(data.description !== undefined
				? { description: data.description }
				: {}),

			...(data.defaultSeoTitle !== undefined
				? {
						defaultSeoTitle:
							data.defaultSeoTitle,
					}
				: {}),

			...(data.defaultSeoDescription !== undefined
				? {
						defaultSeoDescription:
							data.defaultSeoDescription,
					}
				: {}),

			...(data.socialLinks !== undefined
				? { socialLinks: data.socialLinks }
				: {}),

			...(data.newsletterEnabled !== undefined
				? {
						newsletterEnabled:
							data.newsletterEnabled,
					}
				: {}),

			...(data.adsEnabled !== undefined
				? {
						adsEnabled: data.adsEnabled,
					}
				: {}),

			...(data.affiliateEnabled !== undefined
				? {
						affiliateEnabled:
							data.affiliateEnabled,
					}
				: {}),
		},
	})
}