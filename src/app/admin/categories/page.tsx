import { prisma } from "@/lib/prisma"
import { CategoryCreateForm } from "@/components/admin/CategoryCreateForm"

type CategoryRow = {
	id: string
	name: string
	slug: string
	_count: {
		articles: number
	}
}

export default async function AdminCategoriesPage() {
	const categories: CategoryRow[] = await prisma.category.findMany({
		orderBy: { name: "asc" },
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
			<h1 className="text-h2 text-white">Categories</h1>

			<CategoryCreateForm />

			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Name</th>
							<th className="p-4">Slug</th>
							<th className="p-4">Articles</th>
						</tr>
					</thead>

					<tbody>
						{categories.map((category: CategoryRow) => (
							<tr
								key={category.id}
								className="border-b border-admin-border last:border-0"
							>
								<td className="p-4 text-white">
									{category.name}
								</td>

								<td className="p-4 text-admin-muted">
									/{category.slug}
								</td>

								<td className="p-4 text-admin-muted">
									{category._count.articles}
								</td>
							</tr>
						))}

						{categories.length === 0 ? (
							<tr>
								<td
									colSpan={3}
									className="p-4 text-admin-muted"
								>
									No categories yet.
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	)
}
