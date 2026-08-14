import type { Metadata } from "next"

import { SearchPageClient } from "@/app/search/SearchPageClient"
import {
	searchContent,
	POPULAR_SEARCHES,
} from "@/services/searchService"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
	title: "Search NEXORA",
	description:
		"Search articles, AI tools, categories and reviews across NEXORA.",
	path: "/search",
	noindex: true,
})

type SearchParams = {
	q?: string
	type?: string
	category?: string
	page?: string
}

type Props = {
	searchParams: Promise<SearchParams>
}

type SearchType =
	| "article"
	| "tool"
	| "category"
	| "review"
	| undefined

export default async function SearchPage({
	searchParams,
}: Props) {
	const params = await searchParams

	const query = params.q ?? ""
	const page = Math.max(
		1,
		Number(params.page ?? "1") || 1,
	)

	const type = params.type as SearchType

	const result = query
		? await searchContent({
				query,
				type: type ?? "all",
				categorySlug: params.category,
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