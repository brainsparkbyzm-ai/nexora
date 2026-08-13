import Link from "next/link"
import { cx } from "@/lib/utils"

export function Pagination({
	basePath,
	page,
	pageSize,
	total,
}: {
	basePath: string
	page: number
	pageSize: number
	total: number
}) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize))
	if (totalPages <= 1) return null

	const hrefFor = (p: number) => `${basePath}${basePath.includes("?") ? "&" : "?"}page=${p}`

	return (
		<nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
			<Link
				href={hrefFor(Math.max(1, page - 1))}
				aria-disabled={page <= 1}
				className={cx(
					"rounded-md border border-nexora-border px-3 py-2 text-caption text-nexora-muted transition-colors hover:border-nexora-blue hover:text-nexora-text",
					page <= 1 && "pointer-events-none opacity-40",
				)}
			>
				Previous
			</Link>
			<span className="px-3 py-2 text-caption text-nexora-muted">
				Page {page} of {totalPages}
			</span>
			<Link
				href={hrefFor(Math.min(totalPages, page + 1))}
				aria-disabled={page >= totalPages}
				className={cx(
					"rounded-md border border-nexora-border px-3 py-2 text-caption text-nexora-muted transition-colors hover:border-nexora-blue hover:text-nexora-text",
					page >= totalPages && "pointer-events-none opacity-40",
				)}
			>
				Next
			</Link>
		</nav>
	)
}
