import Link from "next/link"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { OptimizedImage } from "@/components/media/OptimizedImage"
import { formatRating } from "@/lib/utils"
import type { ToolCardData } from "@/types/content"

export function ToolCard({ tool }: { tool: ToolCardData }) {
	const rating = formatRating(tool.rating)
	return (
		<GlassPanel as="article" className="flex flex-col gap-4 p-5 hover:-translate-y-1">
			<div className="flex items-center gap-3">
				<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-nexora-surface-raised">
					{tool.logoUrl ? (
						<OptimizedImage src={tool.logoUrl} alt={`${tool.name} logo`} aspectRatio="1/1" />
					) : null}
				</div>
				<div>
					<Link href={`/tools/${tool.slug}`} className="text-h4 text-nexora-text hover:text-white">
						{tool.name}
					</Link>
					<div className="text-caption text-nexora-muted">{tool.category.name}</div>
				</div>
				{rating ? (
					<span className="ml-auto shrink-0 rounded-pill bg-nexora-surface-raised px-2.5 py-1 text-caption font-semibold text-nexora-cyan">
						★ {rating}
					</span>
				) : null}
			</div>
			<p className="line-clamp-3 text-small text-nexora-muted">{tool.description}</p>
			<div className="mt-auto flex items-center justify-between text-caption text-nexora-muted-2">
				<span>{tool.pricing ?? "Pricing varies"}</span>
				<Link href={`/tools/${tool.slug}`} className="font-semibold text-nexora-cyan hover:opacity-80">
					Read review &rarr;
				</Link>
			</div>
		</GlassPanel>
	)
}
