import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

type NewsletterSubscriber = {
	id: string
	email: string
	createdAt: Date
	unsubscribedAt: Date | null
}

export default async function AdminNewsletterPage() {
	const [total, active, recent] = await Promise.all([
		prisma.newsletterSubscriber.count(),
		prisma.newsletterSubscriber.count({
			where: { unsubscribedAt: null },
		}),
		prisma.newsletterSubscriber.findMany({
			orderBy: { createdAt: "desc" },
			take: 50,
		}),
	])

	const subscribers: NewsletterSubscriber[] = recent

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Newsletter</h1>

			<div className="flex gap-4">
				<div className="rounded-card border border-admin-border bg-admin-surface p-5">
					<p className="text-caption text-admin-muted">
						Active subscribers
					</p>
					<p className="mt-2 text-h2 text-white">
						{active.toLocaleString()}
					</p>
				</div>

				<div className="rounded-card border border-admin-border bg-admin-surface p-5">
					<p className="text-caption text-admin-muted">
						Total ever subscribed
					</p>
					<p className="mt-2 text-h2 text-white">
						{total.toLocaleString()}
					</p>
				</div>
			</div>

			<div className="overflow-x-auto rounded-card border border-admin-border">
				<table className="w-full text-small">
					<thead>
						<tr className="border-b border-admin-border bg-admin-surface text-left text-admin-muted">
							<th className="p-4">Email</th>
							<th className="p-4">Subscribed</th>
							<th className="p-4">Status</th>
						</tr>
					</thead>

					<tbody>
						{subscribers.map((subscriber: NewsletterSubscriber) => (
							<tr
								key={subscriber.id}
								className="border-b border-admin-border last:border-0"
							>
								<td className="p-4 text-white">
									{subscriber.email}
								</td>

								<td className="p-4 text-admin-muted">
									{formatDate(subscriber.createdAt)}
								</td>

								<td className="p-4 text-admin-muted">
									{subscriber.unsubscribedAt
										? "Unsubscribed"
										: "Active"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}