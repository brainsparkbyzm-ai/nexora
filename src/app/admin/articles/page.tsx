import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ArticleStatus } from "@prisma/client"
import { formatDate } from "@/lib/utils"

type Props = { searchParams: { status?: string } }

export default async function AdminArticlesPage({ searchParams }: Props) {
	const status = searchParams.status && searchParams.status in ArticleStatus ? (searchParams.status as ArticleStatus) : undefined

	const articles = await prisma.article.findMany({
		where: status ? { status } : undefined,
		orderBy: { updatedAt: "desc" },
		take: 50,
		include: { author: { select: { name: true } }, category: { select: { name: true } } },
	})

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-h2 text-white">Articles{status ? ` — ${status}` : ""}</h1>
				<Link href="/admin/articles/new" className="rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white">
					New Article
				</Link>
			</div>

			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full min-w-[720px] text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Title</th>
							<th className="p-4">Status</th>
							<th className="p-4">Category</th>
							<th className="p-4">Author</th>
							<th className="p-4">Updated</th>
						</tr>
					</thead>
					<tbody>
						{articles.map((article) => (
							<tr key={article.id} className="border-b border-admin-border last:border-0 hover:bg-admin-surface">
								<td className="p-4">
									<Link href={`/admin/articles/${article.slug}`} className="font-medium text-white hover:text-nexora-cyan">
										{article.title}
									</Link>
								</td>
								<td className="p-4 text-admin-muted">{article.status}</td>
								<td className="p-4 text-admin-muted">{article.category.name}</td>
								<td className="p-4 text-admin-muted">{article.author.name}</td>
								<td className="p-4 text-admin-muted">{formatDate(article.updatedAt)}</td>
							</tr>
						))}
						{articles.length === 0 ? (
							<tr>
								<td className="p-4 text-admin-muted" colSpan={5}>
									No articles yet.
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	)
}
