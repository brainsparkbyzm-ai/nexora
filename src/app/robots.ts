import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

/**
 * Keep public content crawlable. Admin and API endpoints are private app
 * surfaces; search pages are crawlable so Google can observe their noindex
 * metadata instead of discovering blocked URLs without that directive.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin", "/admin/", "/api/"],
			},
		],
		sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
	}
}
