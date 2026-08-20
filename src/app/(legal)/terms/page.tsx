import type { Metadata } from "next"
import Link from "next/link"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Terms of Service",
	description:
		"Terms governing access to and use of the NEXORA website, content, tools, and services.",
	path: "/terms",
})

export default function TermsPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Terms of Service</h1>

			<p>
				<strong>Last updated: August 20, 2026</strong>
			</p>

			<p>
				These Terms of Service govern your use of the NEXORA website and
				its content, features, and services. By accessing or using NEXORA,
				you agree to these terms.
			</p>

			<h2>1. Use of the Website</h2>

			<p>
				You agree to use NEXORA lawfully and responsibly. You must not
				attempt to interfere with the operation or security of the website,
				access restricted systems without authorization, distribute
				malicious code, or use automated methods to abuse or overload the
				service.
			</p>

			<h2>2. Content and Information</h2>

			<p>
				NEXORA publishes articles, reviews, comparisons, guides, tool
				information, and other technology-related content for general
				informational and educational purposes.
			</p>

			<p>
				We make reasonable efforts to provide accurate and useful
				information, but technology, product features, pricing, availability,
				and other information may change over time.
			</p>

			<h2>3. No Professional Advice</h2>

			<p>
				Content published on NEXORA does not constitute financial, legal,
				medical, investment, or other professional advice. You should
				consider appropriate professional advice where necessary.
			</p>

			<h2>4. Third-Party Websites and Services</h2>

			<p>
				NEXORA may link to third-party websites, products, services, or
				tools. We do not control third-party websites and are not responsible
				for their content, availability, security, or privacy practices.
			</p>

			<h2>5. Affiliate Links and Advertising</h2>

			<p>
				Some pages may contain affiliate links or advertisements. NEXORA
				may receive compensation from qualifying purchases or other
				actions involving affiliate links.
			</p>

			<p>
				For more information, please see our{" "}
				<Link href="/affiliate-disclosure">
					Affiliate Disclosure
				</Link>
				.
			</p>

			<h2>6. Intellectual Property</h2>

			<p>
				Unless otherwise stated, the original text, branding, graphics,
				and other materials published by NEXORA are protected by applicable
				intellectual property laws. You may not reproduce or redistribute
				substantial portions of our content without appropriate permission.
			</p>

			<h2>7. Availability</h2>

			<p>
				We may modify, suspend, or discontinue portions of the website or
				its features at any time. We do not guarantee that the website will
				always be available, uninterrupted, or error-free.
			</p>

			<h2>8. Limitation of Liability</h2>

			<p>
				To the extent permitted by applicable law, NEXORA is not liable for
				losses or damages arising from reliance on website content,
				third-party services, links, products, or temporary website
				unavailability.
			</p>

			<h2>9. Changes to These Terms</h2>

			<p>
				We may update these Terms of Service from time to time. When we
				make changes, we will update the "Last updated" date on this page.
				Continued use of NEXORA after changes are published constitutes
				acceptance of the updated terms to the extent permitted by law.
			</p>

			<h2>10. Contact</h2>

			<p>
				If you have questions about these Terms of Service, please visit
				our <Link href="/contact">Contact page</Link>.
			</p>
		</div>
	)
}
