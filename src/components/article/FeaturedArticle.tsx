import Link from "next/link"
import { OptimizedImage } from "@/components/media/OptimizedImage"
import { formatDate } from "@/lib/utils"
import type { ArticleCardData } from "@/types/content"

export function FeaturedArticle({ article }: { article: ArticleCardData }) {
	return (
		<Link
			href={`/articles/${article.slug}`}
			className="nexora-glass group grid gap-0 overflow-hidden rounded-card shadow-glow lg:grid-cols-2"
		>
			<OptimizedImage
				src={article.heroImage || "/placeholders/article-fallback.jpg"}
				alt={article.title}
				wrapperClassName="h-full min-h-[260px]"
				aspectRatio="4/3"
			/>
			<div className="flex flex-col justify-center gap-4 p-8 lg:p-12">
				<span className="text-metadata font-semibold uppercase tracking-wide text-nexora-cyan">
					Featured &middot; {article.category.name}
				</span>
				<h3 className="text-h1 leading-tight text-nexora-text transition-colors group-hover:text-white">
					{article.title}
				</h3>
				<p className="text-body text-nexora-muted">{article.excerpt}</p>
				<div className="flex items-center gap-2 text-caption text-nexora-muted-2">
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
