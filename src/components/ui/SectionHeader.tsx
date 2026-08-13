import Link from "next/link"
import { cx } from "@/lib/utils"

export function SectionHeader({
	title,
	description,
	viewAllHref,
	href,
	className,
}: {
	title: string
	description?: string
	viewAllHref?: string
	className?: string
	href?: string
}) {
	const resolvedViewAllHref = viewAllHref ?? href

	return (
		<div className={cx("mb-8 flex items-end justify-between gap-4", className)}>
			<div>
				<h2 className="text-h2 text-nexora-text">{title}</h2>
				{description ? <p className="mt-2 max-w-xl text-small text-nexora-muted">{description}</p> : null}
			</div>
			{resolvedViewAllHref ? (
				<Link
					href={resolvedViewAllHref}
					className="shrink-0 text-caption font-medium text-nexora-cyan transition-opacity hover:opacity-80"
				>
					View all &rarr;
				</Link>
			) : null}
		</div>
	)
}
