import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Cookie Policy",
	description: "How NEXORA uses cookies for sessions, analytics and advertising.",
	path: "/cookies",
})

export default function CookiePolicyPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Cookie Policy</h1>
			<p>NEXORA uses a small number of cookies:</p>
			<ul>
				<li>
					<strong>Session cookies</strong> — used only to keep admin/editor accounts signed in securely.
				</li>
				<li>
					<strong>Analytics</strong> — aggregated, privacy-respecting usage measurement.
				</li>
				<li>
					<strong>Advertising</strong> — only when ad slots are enabled (see Ad Settings), and only from the
					configured provider.
				</li>
			</ul>
		</div>
	)
}
