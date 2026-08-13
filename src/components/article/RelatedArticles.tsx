import { SectionHeader } from "@/components/ui/SectionHeader"
import { ArticleGrid } from "@/components/article/ArticleGrid"
import type { ArticleCardData } from "@/types/content"

export function RelatedArticles({ articles }: { articles: ArticleCardData[] }) {
	if (articles.length === 0) return null
	return (
		<section aria-labelledby="related-articles-heading" className="mt-16">
			<SectionHeader title="Related Articles" />
			<ArticleGrid articles={articles} />
		</section>
	)
}
