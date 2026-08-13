import type { Tool } from "@prisma/client"

export type FeatureRow = { feature: string; toolA: string; toolB: string }

export function ComparisonTable({
	toolA,
	toolB,
	featureTable,
}: {
	toolA: Tool
	toolB: Tool
	featureTable: FeatureRow[]
}) {
	if (featureTable.length === 0) return null
	return (
		<div className="overflow-x-auto rounded-card border border-nexora-border">
			<table className="w-full min-w-[560px] text-small">
				<thead>
					<tr className="border-b border-nexora-border bg-nexora-surface text-left">
						<th className="p-4 font-semibold text-nexora-muted">Feature</th>
						<th className="p-4 font-semibold text-nexora-text">{toolA.name}</th>
						<th className="p-4 font-semibold text-nexora-text">{toolB.name}</th>
					</tr>
				</thead>
				<tbody>
					{featureTable.map((row) => (
						<tr key={row.feature} className="border-b border-nexora-border last:border-0">
							<td className="p-4 text-nexora-muted">{row.feature}</td>
							<td className="p-4 text-nexora-text">{row.toolA}</td>
							<td className="p-4 text-nexora-text">{row.toolB}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
