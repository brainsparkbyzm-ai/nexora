import { prisma } from "@/lib/prisma"

type TagRow = {
	id: string
	name: string
	_count: {
		articles: number
	}
}

export default async function AdminTagsPage() {
	const tags: TagRow[] = await prisma.tag.findMany({
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
			<h1 className="text-h2 text-white">Tags</h1>

			<div className="flex flex-wrap gap-2">
				{tags.map((tag: TagRow) => (
					<span
						key={tag.id}
						className="rounded-full border border-admin-border bg-admin-surface px-3 py-1.5 text-small text-white"
					>
						{tag.name}{" "}
						<span className="text-admin-muted">
							({tag._count.articles})
						</span>
					</span>
				))}

				{tags.length === 0 ? (
					<p className="text-small text-admin-muted">
						No tags yet. Tags are created from the article editor.
					</p>
				) : null}
			</div>
		</div>
	)
}