import type { Metadata } from "next"
import Link from "next/link"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Contact NEXORA",
	description:
		"Contact the NEXORA team for editorial feedback, corrections, partnerships, and general inquiries.",
	path: "/contact",
})

export default function ContactPage() {
	return (
		<div className="prose-nexora mx-auto w-full max-w-article px-4 py-16">
			<h1>Contact Us</h1>

			<p>
				We welcome editorial feedback, corrections, partnership inquiries,
				and general questions about NEXORA.
			</p>

			<h2>Get in Touch</h2>

			<ul>
				<li>
					<strong>Email:</strong>{" "}
					<a href="mailto:ziyadmustafa2030@gmail.com">
						ziyadmustafa2030@gmail.com
					</a>
				</li>
			</ul>

			<h2>Editorial Feedback and Corrections</h2>

			<p>
				If you find an error, outdated information, or another issue with
				our content, please contact us and include the relevant article
				URL and details about the correction.
			</p>

			<h2>Partnerships and Business Inquiries</h2>

			<p>
				For partnerships, advertising, affiliate relationships, or other
				business inquiries, please use the same email address above.
			</p>

			<h2>Related Information</h2>

			<p>
				You can also review our{" "}
				<Link href="/editorial-policy">Editorial Policy</Link>,{" "}
				<Link href="/privacy">Privacy Policy</Link>, and{" "}
				<Link href="/affiliate-disclosure">
					Affiliate Disclosure
				</Link>
				.
			</p>
		</div>
	)
}
