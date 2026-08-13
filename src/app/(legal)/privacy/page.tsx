import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Privacy Policy",
	description: "How NEXORA collects, uses and protects your information.",
	path: "/privacy",
})

export default function PrivacyPolicyPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Privacy Policy</h1>
			<p>This policy explains what information NEXORA collects and how it is used.</p>
			<h2>Information we collect</h2>
			<ul>
				<li>Newsletter signup: email address and, optionally, first name.</li>
				<li>Usage data: pages viewed, searches performed, and tool/affiliate link clicks (aggregated, not sold).</li>
				<li>Admin accounts: name, email and hashed password for editorial staff.</li>
			</ul>
			<h2>How we use it</h2>
			<p>To operate the newsletter, improve content and site performance, and maintain admin security.</p>
			<h2>Your choices</h2>
			<p>You can unsubscribe from the newsletter at any time via the link in every email.</p>
		</div>
	)
}
