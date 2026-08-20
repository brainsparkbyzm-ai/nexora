import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Cookie Policy",
	description: "How NEXORA uses cookies and similar technologies for functionality, analytics, and advertising.",
	path: "/cookies",
})

export default function CookiePolicyPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Cookie Policy</h1>

			<p>
				<strong>Last updated: August 20, 2026</strong>
			</p>

			<p>
				This Cookie Policy explains how NEXORA ("NEXORA," "we," "us,"
				or "our") uses cookies and similar technologies when you visit
				our website.
			</p>

			<h2>1. What Are Cookies?</h2>

			<p>
				Cookies are small text files that may be stored on your device
				when you visit a website. They can help websites operate
				properly, remember preferences, understand usage, and provide
				relevant services.
			</p>

			<h2>2. How NEXORA Uses Cookies</h2>

			<p>
				Depending on the features and services enabled on NEXORA, we
				may use cookies and similar technologies for the following
				purposes:
			</p>

			<h3>Essential / Session Cookies</h3>

			<p>
				These cookies may be used to operate essential website
				functionality and to keep authorized administrative or editorial
				users securely signed in.
			</p>

			<h3>Analytics Cookies</h3>

			<p>
				We may use analytics technologies to understand how visitors
				use NEXORA, including pages viewed, navigation patterns,
				traffic sources, and website performance.
			</p>

			<h3>Advertising Cookies</h3>

			<p>
				If advertising is enabled, NEXORA may use third-party
				advertising services such as Google AdSense. Advertising
				providers may use cookies or similar technologies to deliver,
				measure, and personalize advertisements.
			</p>

			<h2>3. Third-Party Cookies</h2>

			<p>
				Some cookies may be placed by third-party services that appear
				on or support NEXORA. These may include analytics providers,
				advertising providers, security services, or other integrated
				services.
			</p>

			<p>
				Third parties may process information collected through their
				cookies according to their own privacy policies.
			</p>

			<h2>4. Advertising and Google AdSense</h2>

			<p>
				If NEXORA uses Google AdSense, Google and its advertising
				partners may use cookies or similar technologies to serve and
				measure advertisements.
			</p>

			<p>
				Where applicable, users may manage personalized advertising
				preferences through Google's available advertising controls.
			</p>

			<h2>5. Your Cookie Choices</h2>

			<p>
				You can control or remove cookies through your browser settings.
				You may also be able to control certain advertising and analytics
				preferences through available consent-management and
				third-party privacy controls.
			</p>

			<p>
				Disabling certain cookies may affect some website functionality.
			</p>

			<h2>6. Consent</h2>

			<p>
				Where applicable law requires consent for non-essential cookies
				or similar technologies, NEXORA will request consent before
				using those technologies.
			</p>

			<h2>7. Changes to This Cookie Policy</h2>

			<p>
				We may update this Cookie Policy when our technologies, services,
				or legal requirements change. When we make changes, we will
				update the "Last updated" date at the top of this page.
			</p>

			<h2>8. Contact</h2>

			<p>
				If you have questions about our use of cookies, please visit
				our <a href="/contact">Contact page</a>.
			</p>

			<p>
				For information about how NEXORA handles personal information,
				please see our <a href="/privacy">Privacy Policy</a>.
			</p>
		</div>
	)
}
