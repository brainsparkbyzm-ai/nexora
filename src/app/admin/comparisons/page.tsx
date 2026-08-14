import { prisma } from "@/lib/prisma"

type ComparisonRow = {
	id: string
	title: string
	slug: string
}

export default async function AdminComparisonsPage() {
	const comparisons: ComparisonRow[] = await prisma.comparison.findMany({
		orderBy: {
			createdAt: "desc",
		},
	})

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Comparisons</h1>

			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Title</th>
							<th className="p-4">Slug</th>
						</tr>
					</thead>

					<tbody>
						{comparisons.map((comparison: ComparisonRow) => (
							<tr
								key={comparison.id}
								className="border-b border-admin-border last:border-0"
							>
								<td className="p-4 text-white">
									{comparison.title}
								</td>

								<td className="p-4 text-admin-muted">
									/compare/{comparison.slug}
								</td>
							</tr>
						))}

						{comparisons.length === 0 ? (
							<tr>
								<td
									colSpan={2}
									className="p-4 text-admin-muted"
								>
									No comparisons yet.
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	)
}