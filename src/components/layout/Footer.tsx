import Link from "next/link"
import { footerNav, siteConfig } from "@/config/site"
import { NewsletterForm } from "@/components/forms/NewsletterForm"

export function Footer() {
	return (
		<footer className="border-t border-nexora-border bg-nexora-bg-secondary">
			<div className="mx-auto max-w-content px-4 py-16">
				<div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
					<div>
						<div className="mb-4 text-h4 font-semibold text-nexora-text">{siteConfig.name}</div>
						<p className="mb-6 max-w-xs text-small text-nexora-muted">{siteConfig.description}</p>
						<NewsletterForm placement="footer" />
					</div>

					<FooterColumn title="Explore" items={footerNav.explore} />
					<FooterColumn title="Resources" items={footerNav.resources} />
					<FooterColumn title="Company" items={footerNav.company} />
				</div>

				<div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-nexora-border pt-6 text-caption text-nexora-muted sm:flex-row sm:items-center">
					<span>
						&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
					</span>
					<div className="flex gap-4">
						<a href={siteConfig.socialLinks.twitter} className="hover:text-nexora-text">
							Twitter/X
						</a>
						<a href={siteConfig.socialLinks.linkedin} className="hover:text-nexora-text">
							LinkedIn
						</a>
						<a href={siteConfig.socialLinks.youtube} className="hover:text-nexora-text">
							YouTube
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

function FooterColumn({ title, items }: { title: string; items: Array<{ label: string; href: string }> }) {
	return (
		<div>
			<div className="mb-4 text-caption font-semibold uppercase tracking-wide text-nexora-muted">{title}</div>
			<ul className="flex flex-col gap-3">
				{items.map((item) => (
					<li key={item.href}>
						<Link href={item.href} className="text-small text-nexora-muted hover:text-nexora-text">
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
