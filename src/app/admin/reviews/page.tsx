import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export default async function AdminReviewsPage() {
	const reviews = await prisma.review.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			tool: {
				select: {
					name: true,
					rating: true,
					lastReviewedAt: true,
				},
			},
		},
	})

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Reviews</h1>
			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Tool</th>
							<th className="p-4">Rating</th>
							<th className="p-4">Last reviewed</th>
						</tr>
					</thead>
					<tbody>
						{reviews.map((review) => (
							<tr key={review.id} className="border-b border-admin-border last:border-0">
								<td className="p-4 text-white">{review.tool.name}</td>
								<td className="p-4 text-admin-muted">{review.tool.rating ?? "—"}</td>
								<td className="p-4 text-admin-muted">{formatDate(review.tool.lastReviewedAt ?? review.updatedAt)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
