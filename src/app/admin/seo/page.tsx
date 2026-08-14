import { prisma } from "@/lib/prisma"
import Link from "next/link"

type ArticleSeoRow = {
	title: string
	slug: string
	seoTitle: string | null
	seoDescription: string | null
	heroImage: string | null
	canonicalUrl: string | null
}

type ArticleSeoWarning = ArticleSeoRow & {
	warnings: string[]
}

export default async function AdminSeoPage() {
	const articles: ArticleSeoRow[] = await prisma.article.findMany({
		where: { status: "PUBLISHED" },
		select: {
			title: true,
			slug: true,
			seoTitle: true,
			seoDescription: true,
			heroImage: true,
			canonicalUrl: true,
		},
	})

	const withWarnings: ArticleSeoWarning[] = articles
		.map((article: ArticleSeoRow) => {
			const warnings: string[] = []

			if (!article.seoTitle) {
				warnings.push("Missing SEO title")
			} else if (article.seoTitle.length > 60) {
				warnings.push("SEO title too long")
			}

			if (!article.seoDescription) {
				warnings.push("Missing meta description")
			} else if (article.seoDescription.length > 160) {
				warnings.push("Meta description too long")
			}

			if (!article.heroImage) {
				warnings.push("Missing hero image")
			}

			if (!article.canonicalUrl) {
				warnings.push("Missing canonical URL")
			}

			return {
				...article,
				warnings,
			}
		})
		.filter((article: ArticleSeoWarning) => article.warnings.length > 0)

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">SEO Health</h1>

			<p className="text-small text-admin-muted">
				{withWarnings.length} published articles need SEO attention.
			</p>

			<div className="flex flex-col gap-3">
				{withWarnings.map((article: ArticleSeoWarning) => (
					<div
						key={article.slug}
						className="rounded-card border border-admin-border bg-admin-surface p-4"
					>
						<Link
							href={`/admin/articles/${article.slug}`}
							className="font-medium text-white hover:text-nexora-cyan"
						>
							{article.title}
						</Link>

						<ul className="mt-2 flex flex-wrap gap-2">
							{article.warnings.map((warning: string) => (
								<li
									key={warning}
									className="rounded-full bg-admin-warning/10 px-3 py-1 text-caption text-admin-warning"
								>
									{warning}
								</li>
							))}
						</ul>
					</div>
				))}

				{withWarnings.length === 0 ? (
					<p className="text-small text-admin-muted">
						All published articles pass SEO checks.
					</p>
				) : null}
			</div>
		</div>
	)
}