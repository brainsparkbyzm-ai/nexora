import Link from "next/link"
import { Fragment } from "react"

export type Crumb = { name: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
	return (
		<nav aria-label="Breadcrumb" className="mb-4 text-caption text-nexora-muted">
			<ol className="flex flex-wrap items-center gap-1">
				{items.map((item, index) => (
					<Fragment key={`${item.name}-${index}`}>
						<li>
							{item.href ? (
								<Link href={item.href} className="hover:text-nexora-text">
									{item.name}
								</Link>
							) : (
								<span aria-current="page" className="text-nexora-text">
									{item.name}
								</span>
							)}
						</li>
						{index < items.length - 1 ? <li aria-hidden="true">/</li> : null}
					</Fragment>
				))}
			</ol>
		</nav>
	)
}
