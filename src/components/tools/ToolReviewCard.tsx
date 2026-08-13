import { Check, X } from "lucide-react"
import type { ToolDetailData } from "@/types/content"
import type { ToolReviewViewModel } from "@/services/toolService"

export function ToolReviewCard({ tool }: { tool: ToolDetailData | ToolReviewViewModel }) {
	return (
		<div className="grid gap-6 sm:grid-cols-2">
			<div className="rounded-card border border-nexora-border p-6">
				<h3 className="mb-4 text-h4 text-nexora-text">Pros</h3>
				<ul className="flex flex-col gap-3">
					{tool.pros.map((pro) => (
						<li key={pro} className="flex items-start gap-2 text-small text-nexora-muted">
							<Check size={16} className="mt-0.5 shrink-0 text-nexora-success" aria-hidden="true" />
							{pro}
						</li>
					))}
				</ul>
			</div>
			<div className="rounded-card border border-nexora-border p-6">
				<h3 className="mb-4 text-h4 text-nexora-text">Cons</h3>
				<ul className="flex flex-col gap-3">
					{tool.cons.map((con) => (
						<li key={con} className="flex items-start gap-2 text-small text-nexora-muted">
							<X size={16} className="mt-0.5 shrink-0 text-nexora-danger" aria-hidden="true" />
							{con}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
