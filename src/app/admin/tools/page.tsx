import Link from "next/link"
import { prisma } from "@/lib/prisma"

type ToolRow = {
	id: string
	name: string
	rating: number | null
	featured: boolean
	category: {
		name: string
	}
}

export default async function AdminToolsPage() {
	const tools: ToolRow[] = await prisma.tool.findMany({
		orderBy: { name: "asc" },
		include: {
			category: {
				select: {
					name: true,
				},
			},
		},
	})

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-h2 text-white">AI Tools</h1>

				<Link
					href="/admin/tools/new"
					className="rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white"
				>
					Add Tool
				</Link>
			</div>

			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Name</th>
							<th className="p-4">Category</th>
							<th className="p-4">Rating</th>
							<th className="p-4">Featured</th>
						</tr>
					</thead>

					<tbody>
						{tools.map((tool: ToolRow) => (
							<tr
								key={tool.id}
								className="border-b border-admin-border last:border-0"
							>
								<td className="p-4 text-white">{tool.name}</td>
								<td className="p-4 text-admin-muted">
									{tool.category.name}
								</td>
								<td className="p-4 text-admin-muted">
									{tool.rating ?? "—"}
								</td>
								<td className="p-4 text-admin-muted">
									{tool.featured ? "Yes" : "No"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}