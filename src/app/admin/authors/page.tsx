import { prisma } from "@/lib/prisma"

type AuthorRow = {
	id: string
	name: string
	role: string | null
	_count: {
		articles: number
	}
}

export default async function AdminAuthorsPage() {
	const authors: AuthorRow[] = await prisma.author.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			_count: {
				select: {
					articles: true,
				},
			},
		},
	})

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Authors</h1>

			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Name</th>
							<th className="p-4">Role</th>
							<th className="p-4">Articles</th>
						</tr>
					</thead>

					<tbody>
						{authors.map((author: AuthorRow) => (
							<tr
								key={author.id}
								className="border-b border-admin-border last:border-0"
							>
								<td className="p-4 text-white">
									{author.name}
								</td>

								<td className="p-4 text-admin-muted">
									{author.role ?? "—"}
								</td>

								<td className="p-4 text-admin-muted">
									{author._count.articles}
								</td>
							</tr>
						))}

						{authors.length === 0 ? (
							<tr>
								<td
									colSpan={3}
									className="p-4 text-admin-muted"
								>
									No authors yet.
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	)
}