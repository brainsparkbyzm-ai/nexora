import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = buildMetadata({
	title: "Contact NEXORA",
	description: "Get in touch with the NEXORA editorial and partnerships team.",
	path: "/contact",
})

export default function ContactPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Contact Us</h1>
			<p>We welcome tips, corrections, partnership and advertising inquiries.</p>
			<ul>
				<li>Editorial: editorial@{siteConfig.domain}</li>
				<li>Advertise / Partnerships: partners@{siteConfig.domain}</li>
				<li>General: hello@{siteConfig.domain}</li>
			</ul>
		</div>
	)
}
