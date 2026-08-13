import Link from "next/link"
import { OptimizedImage } from "@/components/media/OptimizedImage"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { formatDate } from "@/lib/utils"
import type { ArticleCardData } from "@/types/content"

export function ArticleCard({ article, priority = false }: { article: ArticleCardData; priority?: boolean }) {
	return (
		<GlassPanel as="article" className="group flex h-full flex-col overflow-hidden hover:-translate-y-1">
			<Link href={`/articles/${article.slug}`} className="flex h-full flex-col">
				<div className="relative">
					<OptimizedImage
						src={article.heroImage || "/placeholders/article-fallback.jpg"}
						alt={article.title}
						priority={priority}
						wrapperClassName="rounded-t-card"
					/>
					{article.badge ? (
						<span className="absolute left-3 top-3 rounded-pill bg-nexora-blue px-3 py-1 text-metadata font-semibold uppercase text-white">
							{article.badge}
						</span>
					) : null}
				</div>
				<div className="flex flex-1 flex-col gap-3 p-5">
					<span className="text-metadata font-semibold uppercase tracking-wide text-nexora-cyan">
						{article.category.name}
					</span>
					<h3 className="text-h4 leading-snug text-nexora-text transition-colors group-hover:text-white">
						{article.title}
					</h3>
					<p className="line-clamp-2 text-small text-nexora-muted">{article.excerpt}</p>
					<div className="mt-auto flex items-center gap-2 pt-2 text-caption text-nexora-muted-2">
						<span>{article.author.name}</span>
						<span aria-hidden="true">&middot;</span>
						{article.publishedAt ? <span>{formatDate(article.publishedAt)}</span> : null}
						{article.readingTime ? (
							<>
								<span aria-hidden="true">&middot;</span>
								<span>{article.readingTime} min read</span>
							</>
						) : null}
					</div>
				</div>
			</Link>
		</GlassPanel>
	)
}
