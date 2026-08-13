"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArticleGrid } from "@/components/article/ArticleGrid"
import { ToolCard } from "@/components/tools/ToolCard"
import { Pagination } from "@/components/ui/Pagination"
import type { SearchResult } from "@/services/searchService"

const TYPE_FILTERS = [
	{ value: "all", label: "All" },
	{ value: "article", label: "Articles" },
	{ value: "tool", label: "Tools" },
	{ value: "category", label: "Categories" },
	{ value: "review", label: "Reviews" },
] as const

export function SearchPageClient({
	initialQuery,
	initialResult,
	popularSearches,
	page,
}: {
	initialQuery: string
	initialResult: SearchResult | null
	popularSearches: string[]
	page: number
}) {
	const router = useRouter()
	const [query, setQuery] = useState(initialQuery)

	function runSearch(nextQuery: string) {
		if (!nextQuery.trim()) return
		router.push(`/search?q=${encodeURIComponent(nextQuery)}`)
	}

	return (
		<div className="mx-auto w-full max-w-content px-4 py-16">
			<h1 className="text-h1 text-nexora-text">Search NEXORA</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					runSearch(query)
				}}
				className="mt-6 flex gap-3"
			>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					type="search"
					placeholder="Search articles, tools, guides…"
					className="flex-1 rounded-md border border-nexora-border bg-nexora-surface px-4 py-3 text-body text-nexora-text placeholder:text-nexora-muted-2 focus:border-nexora-blue"
				/>
				<button type="submit" className="rounded-md bg-nexora-blue px-6 py-3 text-small font-semibold text-white">
					Search
				</button>
			</form>

			{!initialResult ? (
				<div className="mt-10">
					<p className="mb-3 text-caption font-semibold uppercase tracking-wide text-nexora-muted">Popular searches</p>
					<div className="flex flex-wrap gap-2">
						{popularSearches.map((term) => (
							<button
								key={term}
								type="button"
								onClick={() => runSearch(term)}
								className="rounded-pill border border-nexora-border px-4 py-2 text-caption text-nexora-muted hover:border-nexora-blue hover:text-nexora-text"
							>
								{term}
							</button>
						))}
					</div>
				</div>
			) : (
				<div className="mt-10">
					<div className="mb-6 flex flex-wrap gap-2">
						{TYPE_FILTERS.map((filter) => (
							<Link
								key={filter.value}
								href={`/search?q=${encodeURIComponent(initialQuery)}&type=${filter.value}`}
								className="rounded-pill border border-nexora-border px-4 py-2 text-caption text-nexora-muted hover:border-nexora-blue hover:text-nexora-text"
							>
								{filter.label}
							</Link>
						))}
					</div>

					{initialResult.totalCount === 0 ? (
						<p className="text-body text-nexora-muted">
							No results for “{initialQuery}”. Try a different term or browse a category.
						</p>
					) : (
						<>
							{initialResult.articles.length > 0 ? (
								<div className="mb-10">
									<h2 className="mb-4 text-h4 text-nexora-text">Articles</h2>
									<ArticleGrid articles={initialResult.articles} />
								</div>
							) : null}
							{initialResult.tools.length > 0 ? (
								<div className="mb-10">
									<h2 className="mb-4 text-h4 text-nexora-text">AI Tools</h2>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
										{initialResult.tools.map((tool) => (
											<ToolCard key={tool.slug} tool={tool} />
										))}
									</div>
								</div>
							) : null}
							{initialResult.categories.length > 0 ? (
								<div className="mb-10">
									<h2 className="mb-4 text-h4 text-nexora-text">Categories</h2>
									<div className="flex flex-wrap gap-2">
										{initialResult.categories.map((category) => (
											<Link
												key={category.slug}
												href={`/${category.slug}`}
												className="rounded-pill border border-nexora-border px-4 py-2 text-small text-nexora-text hover:border-nexora-blue"
											>
												{category.name}
											</Link>
										))}
									</div>
								</div>
							) : null}
							<Pagination
								page={page}
								pageSize={initialResult.pageSize}
								total={initialResult.totalCount}
								basePath={`/search?q=${encodeURIComponent(initialQuery)}`}
							/>
						</>
					)}
				</div>
			)}
		</div>
	)
}
