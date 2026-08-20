import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Privacy Policy",
	description: "NEXORA Privacy Policy — how we collect, use, protect, and manage information.",
	path: "/privacy",
})

export default function PrivacyPolicyPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Privacy Policy</h1>

			<p>
				<strong>Last updated: August 20, 2026</strong>
			</p>

			<p>
				NEXORA ("NEXORA," "we," "us," or "our") respects your privacy.
				This Privacy Policy explains what information we may collect when
				you use the NEXORA website, how we use it, and the choices available
				to you.
			</p>

			<h2>1. Information We Collect</h2>

			<h3>Information You Provide</h3>
			<ul>
				<li>
					<strong>Newsletter information:</strong> When you subscribe to
					our newsletter, we may collect your email address and, if
					provided, your first name.
				</li>
				<li>
					<strong>Contact information:</strong> If you contact us, we
					may receive the information you choose to provide, such as
					your name, email address, and message.
				</li>
				<li>
					<strong>Account information:</strong> Authorized editorial
					or administrative users may have account information such as
					their name, email address, and securely hashed password.
				</li>
			</ul>

			<h3>Automatically Collected Information</h3>
			<p>
				When you visit NEXORA, certain technical and usage information
				may be collected automatically, including:
			</p>
			<ul>
				<li>Pages or articles viewed</li>
				<li>Searches performed</li>
				<li>Referring and exit pages</li>
				<li>General browser and device information</li>
				<li>Approximate geographic information</li>
				<li>IP address or similar technical identifiers</li>
				<li>Website interactions and link clicks</li>
				<li>Date and time of visits</li>
			</ul>

			<h2>2. Cookies and Similar Technologies</h2>
			<p>
				NEXORA may use cookies, local storage, pixels, tags, and similar
				technologies to operate the website, remember preferences, analyze
				traffic, improve performance, and improve the user experience.
			</p>
			<p>
				Third-party services, including analytics and advertising
				providers, may also use cookies or similar technologies when
				enabled on our website.
			</p>
			<p>
				For more information, please see our <a href="/cookies">Cookie Policy</a>.
			</p>

			<h2>3. Advertising</h2>
			<p>
				NEXORA may display advertisements provided by third-party
				advertising companies, including Google AdSense, if and when
				advertising is enabled on the website.
			</p>
			<p>
				Third-party advertising providers may use cookies or similar
				technologies to collect information about users' visits to this
				and other websites in order to provide, measure, and personalize
				advertising.
			</p>
			<p>
				Where applicable, Google and its advertising partners may use
				advertising cookies to serve ads based on a user's visits to
				NEXORA and/or other websites.
			</p>
			<p>
				Users may be able to manage or opt out of personalized advertising
				through Google's advertising settings and other available privacy
				controls.
			</p>

			<h2>4. Analytics</h2>
			<p>
				NEXORA may use third-party analytics services to understand how
				visitors use the website, including which pages are visited, how
				users navigate the website, and how the website performs.
			</p>

			<h2>5. How We Use Information</h2>
			<ul>
				<li>Operate and maintain NEXORA</li>
				<li>Provide newsletter services</li>
				<li>Respond to messages and inquiries</li>
				<li>Improve articles, features, and website performance</li>
				<li>Understand website traffic and usage</li>
				<li>Detect and prevent security issues or abuse</li>
				<li>Maintain administrative and editorial security</li>
				<li>Display and measure advertising where applicable</li>
				<li>Comply with applicable legal obligations</li>
			</ul>

			<h2>6. Third-Party Services</h2>
			<p>
				NEXORA may use third-party services for functions such as website
				hosting, analytics, email/newsletter delivery, advertising,
				affiliate links, security, and fraud prevention.
			</p>
			<p>
				These third parties may process information according to their
				own privacy policies and applicable laws.
			</p>

			<h2>7. Affiliate Links</h2>
			<p>
				Some NEXORA pages may contain affiliate links. If you click an
				affiliate link and make a qualifying purchase or take another
				qualifying action, NEXORA may receive a commission at no additional
				cost to you.
			</p>
			<p>
				Please see our <a href="/affiliate-disclosure">Affiliate Disclosure</a>{" "}
				for more information.
			</p>

			<h2>8. Data Retention</h2>
			<p>
				We retain information only for as long as reasonably necessary
				for the purposes described in this Privacy Policy, including
				providing services, maintaining records, protecting the website,
				resolving disputes, and complying with legal obligations.
			</p>

			<h2>9. Data Security</h2>
			<p>
				We use reasonable technical and organizational measures designed
				to protect information from unauthorized access, alteration,
				disclosure, or destruction. However, no method of transmission
				or electronic storage is completely secure.
			</p>

			<h2>10. Your Choices and Rights</h2>
			<p>
				Depending on your location and applicable law, you may have rights
				regarding your personal information, which may include access,
				correction, deletion, objection, restriction, or withdrawal of
				consent where applicable.
			</p>
			<p>
				You can unsubscribe from the NEXORA newsletter at any time using
				the unsubscribe link included in our emails.
			</p>

			<h2>11. Children's Privacy</h2>
			<p>
				NEXORA is not intentionally directed toward children under the
				applicable age of digital consent. We do not knowingly collect
				personal information from children for purposes prohibited by
				applicable law.
			</p>

			<h2>12. International Visitors</h2>
			<p>
				NEXORA may be accessed by visitors from different countries.
				Depending on the services we use, information may be processed
				or stored in countries other than the country where you live.
			</p>

			<h2>13. Changes to This Privacy Policy</h2>
			<p>
				We may update this Privacy Policy from time to time to reflect
				changes to our services, technology, legal requirements, or
				privacy practices. When we make changes, we will update the
				"Last updated" date at the top of this page.
			</p>

			<h2>14. Contact Us</h2>
			<p>
				If you have questions about this Privacy Policy or NEXORA's
				privacy practices, please visit our{" "}
				<a href="/contact">Contact page</a>.
			</p>
		</div>
	)
}
