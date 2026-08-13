"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ArticleCard } from "@/components/article/ArticleCard"
import type { ArticleCardData } from "@/types/content"

/**
 * Horizontal carousel on mobile, static grid-like row on desktop. Scrolling
 * uses native CSS scroll-snap (no JS-driven layout animation), and the
 * arrow buttons just call scrollBy — both GPU/CPU cheap (§6).
 */
export function TrendingCarousel({ articles }: { articles: ArticleCardData[] }) {
	const scrollerRef = useRef<HTMLDivElement>(null)

	function scrollByCards(direction: 1 | -1) {
		scrollerRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" })
	}

	if (articles.length === 0) return null

	return (
		<div className="relative">
			<div
				ref={scrollerRef}
				className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{articles.map((article, index) => (
					<div key={article.slug} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
						<ArticleCard article={article} priority={index === 0} />
					</div>
				))}
			</div>
			<div className="mt-3 hidden justify-end gap-2 sm:flex">
				<button
					type="button"
					aria-label="Scroll left"
					onClick={() => scrollByCards(-1)}
					className="rounded-full border border-nexora-border p-2 text-nexora-muted hover:text-nexora-text"
				>
					<ChevronLeft size={18} />
				</button>
				<button
					type="button"
					aria-label="Scroll right"
					onClick={() => scrollByCards(1)}
					className="rounded-full border border-nexora-border p-2 text-nexora-muted hover:text-nexora-text"
				>
					<ChevronRight size={18} />
				</button>
			</div>
		</div>
	)
}
