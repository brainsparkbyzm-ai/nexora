import { Check, X } from "lucide-react"

type ToolReviewCardProps = {
	tool: {
		pros: unknown
		cons: unknown
	}
}

function toStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return []
	}

	return value.filter(
		(item): item is string => typeof item === "string",
	)
}

export function ToolReviewCard({ tool }: ToolReviewCardProps) {
	const pros = toStringArray(tool.pros)
	const cons = toStringArray(tool.cons)

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<section className="rounded-card border border-nexora-border bg-nexora-surface p-6">
				<h3 className="mb-4 text-h4 text-nexora-text">
					Pros
				</h3>

				{pros.length > 0 ? (
					<ul className="flex flex-col gap-3">
						{pros.map((pro, index) => (
							<li
								key={`${pro}-${index}`}
								className="flex items-start gap-2 text-small text-nexora-muted"
							>
								<Check
									size={16}
									className="mt-0.5 shrink-0 text-nexora-success"
									aria-hidden="true"
								/>
								<span>{pro}</span>
							</li>
						))}
					</ul>
				) : (
					<p className="text-small text-nexora-muted">
						No pros listed.
					</p>
				)}
			</section>

			<section className="rounded-card border border-nexora-border bg-nexora-surface p-6">
				<h3 className="mb-4 text-h4 text-nexora-text">
					Cons
				</h3>

				{cons.length > 0 ? (
					<ul className="flex flex-col gap-3">
						{cons.map((con, index) => (
							<li
								key={`${con}-${index}`}
								className="flex items-start gap-2 text-small text-nexora-muted"
							>
								<X
									size={16}
									className="mt-0.5 shrink-0 text-red-400"
									aria-hidden="true"
								/>
								<span>{con}</span>
							</li>
						))}
					</ul>
				) : (
					<p className="text-small text-nexora-muted">
						No cons listed.
					</p>
				)}
			</section>
		</div>
	)
}

