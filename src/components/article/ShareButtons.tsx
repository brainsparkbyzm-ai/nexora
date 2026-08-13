import { Facebook, Linkedin, Link as LinkIcon, Twitter } from "lucide-react"

export function ShareButtons({ url, title }: { url: string; title: string }) {
	const encodedUrl = encodeURIComponent(url)
	const encodedTitle = encodeURIComponent(title)

	const links = [
		{
			label: "Share on X",
			href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
			Icon: Twitter,
		},
		{
			label: "Share on LinkedIn",
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
			Icon: Linkedin,
		},
		{
			label: "Share on Facebook",
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
			Icon: Facebook,
		},
	]

	return (
		<div className="flex items-center gap-2">
			{links.map(({ label, href, Icon }) => (
				<a
					key={label}
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={label}
					className="rounded-full border border-nexora-border p-2 text-nexora-muted transition-colors hover:border-nexora-blue hover:text-nexora-text"
				>
					<Icon size={16} aria-hidden="true" />
				</a>
			))}
			<span className="rounded-full border border-nexora-border p-2 text-nexora-muted" aria-hidden="true">
				<LinkIcon size={16} />
			</span>
		</div>
	)
}
