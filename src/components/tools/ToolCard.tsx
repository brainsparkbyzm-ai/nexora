import Link from "next/link"
import type { ToolCardData } from "@/types/content"

export function ToolCard({ tool }: { tool: ToolCardData }) {
	return (
		<Link
			href={`/tools/${tool.slug}`}
			className="nexora-glass group flex flex-col gap-4 rounded-card p-5 transition-colors hover:border-nexora-blue"
		>
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-nexora-surface-raised text-sm font-bold text-nexora-cyan">
					{tool.name.charAt(0).toUpperCase()}
				</div>

				<div className="min-w-0">
					<h3 className="truncate text-h4 text-nexora-text transition-colors group-hover:text-white">
						{tool.name}
					</h3>

					{tool.category ? (
						<p className="text-caption text-nexora-muted">
							{tool.category.name}
						</p>
					) : null}
				</div>
			</div>

			{tool.description ? (
				<p className="line-clamp-3 text-small text-nexora-muted">
					{tool.description}
				</p>
			) : null}

			<div className="flex flex-wrap items-center gap-2 text-caption text-nexora-muted">
				{tool.pricing ? (
					<span>{tool.pricing}</span>
				) : null}

				{tool.rating !== null && tool.rating !== undefined ? (
					<>
						<span aria-hidden="true">·</span>
						<span>★ {tool.rating}</span>
					</>
				) : null}

				{tool.bestFor ? (
					<>
						<span aria-hidden="true">·</span>
						<span className="truncate">{tool.bestFor}</span>
					</>
				) : null}
			</div>

			{tool.featured ? (
				<span className="w-fit rounded-full bg-nexora-blue/15 px-2 py-1 text-caption font-semibold text-nexora-cyan">
					Featured
				</span>
			) : null}
		</Link>
	)
}

