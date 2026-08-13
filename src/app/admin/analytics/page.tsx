import { prisma } from "@/lib/prisma"

export default async function AdminAnalyticsPage() {
	const [pageViews, articleViews, searches, toolClicks, affiliateClicks, signups] = await Promise.all([
		prisma.viewEvent.count(),
		prisma.viewEvent.count({ where: { articleId: { not: null } } }),
		prisma.searchLog.count(),
		prisma.affiliateClick.count(),
		prisma.affiliateClick.count(),
		prisma.newsletterSubscriber.count(),
	])

	const rows = [
		{ label: "Page views", value: pageViews },
		{ label: "Article views", value: articleViews },
		{ label: "Searches", value: searches },
		{ label: "Tool clicks", value: toolClicks },
		{ label: "Affiliate clicks", value: affiliateClicks },
		{ label: "Newsletter signups", value: signups },
	]

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Analytics</h1>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
				{rows.map((row) => (
					<div key={row.label} className="rounded-card border border-admin-border bg-admin-surface p-5">
						<p className="text-caption text-admin-muted">{row.label}</p>
						<p className="mt-2 text-h3 text-white">{row.value.toLocaleString()}</p>
					</div>
				))}
			</div>
			<p className="text-caption text-admin-muted">
				Events are recorded through the central analytics service (src/lib/analytics.ts), which can forward to a
				third-party provider without changing call sites elsewhere in the app.
			</p>
		</div>
	)
}
