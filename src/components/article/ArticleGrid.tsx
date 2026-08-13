import { ArticleCard } from "@/components/article/ArticleCard"
import type { ArticleCardData } from "@/types/content"

export function ArticleGrid({ articles }: { articles: ArticleCardData[] }) {
	if (articles.length === 0) {
		return <p className="text-small text-nexora-muted">No articles yet. Check back soon.</p>
	}
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{articles.map((article, index) => (
				<ArticleCard key={article.slug} article={article} priority={index === 0} />
			))}
		</div>
	)
}
