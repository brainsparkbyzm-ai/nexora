import Link from "next/link"
import { OptimizedImage } from "@/components/media/OptimizedImage"
import { formatDate } from "@/lib/utils"
import type { ArticleCardData } from "@/types/content"

export function FeaturedArticle({ article }: { article: ArticleCardData }) {
	return (
		<Link
			href={`/articles/${article.slug}`}
			className="nexora-glass group grid min-w-0 grid-cols-1 gap-0 overflow-hidden rounded-card shadow-glow lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
		>
			<div className="relative min-w-0 w-full overflow-hidden">
				<OptimizedImage
					src={article.heroImage || "/placeholders/article-fallback.jpg"}
					alt={article.title}
					wrapperClassName="h-full min-h-[260px] min-w-0 w-full lg:min-h-[420px]"
					aspectRatio="16/9"
				/>
			</div>
			<div className="flex min-w-0 flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
				<span className="text-metadata font-semibold uppercase tracking-wide text-nexora-cyan">
					Featured &middot; {article.category.name}
				</span>
				<h3 className="break-words text-3xl font-bold leading-tight text-nexora-text transition-colors group-hover:text-white sm:text-4xl xl:text-5xl">
					{article.title}
				</h3>
				<p className="text-body leading-relaxed text-nexora-muted">{article.excerpt}</p>
				<div className="flex flex-wrap items-center gap-2 text-caption text-nexora-muted-2">
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
	)
}
