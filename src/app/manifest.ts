import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

/**
 * Minimal web app manifest (Rule 9). Uses placeholder icons under
 * public/icons -- replace with real brand icons before launch (see README).
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.name,
		short_name: siteConfig.name,
		description: siteConfig.description,
		start_url: "/",
		display: "standalone",
		background_color: "#0a0e1a",
		theme_color: "#0a0e1a",
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	}
}
