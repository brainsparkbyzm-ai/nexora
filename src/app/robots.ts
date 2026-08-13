import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

/**
 * Production robots.txt (Rule 32/36). Blocks admin, API, and the search
 * results endpoint (duplicate/thin content, see Rule 9) while keeping every
 * indexable public route crawlable.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin", "/admin/", "/api/", "/search"],
			},
		],
		sitemap: siteConfig.url + "/sitemap.xml",
		host: siteConfig.url,
	}
}
