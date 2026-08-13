import type { Metadata } from "next"
import { SearchPageClient } from "@/app/search/SearchPageClient"
import { searchContent, POPULAR_SEARCHES } from "@/services/searchService"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Search NEXORA",
	description: "Search articles, AI tools, categories and reviews across NEXORA.",
	path: "/search",
	noindex: true,
})

type Props = { searchParams: { q?: string; type?: string; category?: string; page?: string } }

export default async function SearchPage({ searchParams }: Props) {
	const query = searchParams.q ?? ""
	const page = Math.max(1, Number(searchParams.page ?? "1") || 1)
	const result = query
		? await searchContent({
				query,
				type: (searchParams.type as "article" | "tool" | "category" | "review" | undefined) ?? "all",
				categorySlug: searchParams.category,
				page,
		  })
		: null

	return (
		<SearchPageClient
			initialQuery={query}
			initialResult={result}
			popularSearches={POPULAR_SEARCHES}
			page={page}
		/>
	)
}
