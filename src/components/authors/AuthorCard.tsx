import Link from "next/link"
import type { Author } from "@prisma/client"

export function AuthorCard({ author }: { author: Author }) {
	return (
		<Link
			href={`/authors/${author.slug}`}
			className="flex items-center gap-4 rounded-card border border-nexora-border p-5 transition-colors hover:border-nexora-blue"
		>
			<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-nexora-surface-raised text-h4 font-semibold text-nexora-cyan">
				{author.name.charAt(0).toUpperCase()}
			</div>

			<div className="min-w-0">
				<div className="truncate text-h4 text-nexora-text">
					{author.name}
				</div>

				{author.role ? (
					<div className="text-caption text-nexora-muted">
						{author.role}
					</div>
				) : null}
			</div>
		</Link>
	)
}