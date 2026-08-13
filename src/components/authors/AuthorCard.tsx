import Link from "next/link"
import { OptimizedImage } from "@/components/media/OptimizedImage"
import type { Author } from "@prisma/client"

export function AuthorCard({ author }: { author: Author }) {
	return (
		<Link
			href={`/authors/${author.slug}`}
			className="flex items-center gap-4 rounded-card border border-nexora-border p-5 hover:border-nexora-blue"
		>
			<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-nexora-surface-raised">
				{author.avatarUrl ? (
					<OptimizedImage src={author.avatarUrl} alt={author.name} aspectRatio="1/1" />
				) : null}
			</div>
			<div>
				<div className="text-h4 text-nexora-text">{author.name}</div>
				{author.role ? <div className="text-caption text-nexora-muted">{author.role}</div> : null}
			</div>
		</Link>
	)
}
