import "@/styles/globals.css"
import type { Metadata } from "next"
import Script from "next/script"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import CookieConsent from "@/components/monetization/CookieConsent"

import { siteConfig } from "@/config/site"
import {
	buildMetadata,
	organizationSchema,
	websiteSchema,
} from "@/lib/seo"

import { getSiteSettings } from "@/services/settingsService"

export const metadata: Metadata = {
	...buildMetadata({
		title: siteConfig.seoDefaults.defaultTitle,
		description: siteConfig.seoDefaults.defaultDescription,
		path: "/",
	}),
	title: {
		default: siteConfig.seoDefaults.defaultTitle,
		template: siteConfig.seoDefaults.titleTemplate,
	},
	metadataBase: new URL(siteConfig.url),
	formatDetection: {
		telephone: false,
	},
}

const envAdsEnabled = process.env.ADS_ENABLED === "true"
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const settings = await getSiteSettings()

	const adsEnabled =
		envAdsEnabled &&
		Boolean(settings?.adsEnabled) &&
		Boolean(adsenseClientId)

	return (
		<html lang="en">
			<body className="min-h-screen bg-nexora-bg font-sans text-nexora-text antialiased">
				{/* Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationSchema()),
					}}
				/>


				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteSchema()),
					}}
				/>

				{/* Skip Link */}
				<a
					href="#main-content"
					className="
						sr-only
						focus:not-sr-only
						focus:fixed
						focus:left-4
						focus:top-4
						focus:z-[100]
						focus:rounded-md
						focus:bg-nexora-surface
						focus:px-4
						focus:py-2
						focus:text-nexora-text
						focus:shadow-lg
					"
				>
					Skip to content
				</a>

				{/* Header */}
				<Header />

				{/* Main Content */}
				<main
					id="main-content"
					className="nexora-page"
				>
					{children}
				</main>

				{/* Footer */}
				<Footer />

				{/* Cookie Consent */}
				<CookieConsent />

				{/* Google AdSense */}
				{adsEnabled && adsenseClientId ? (
					<Script
						id="nexora-adsense"
						async
						strategy="afterInteractive"
						crossOrigin="anonymous"
						src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
					/>
				) : null}
			</body>
		</html>
	)
}
