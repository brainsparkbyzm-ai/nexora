import { cx } from "@/lib/utils"

/** GPU-friendly skeleton loader (opacity pulse only — never animates layout). */
export function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={cx("animate-pulse rounded-md bg-nexora-surface-raised", className)}
			aria-hidden="true"
		/>
	)
}

export function ArticleCardSkeleton() {
	return (
		<div className="rounded-card border border-nexora-border p-4">
			<Skeleton className="mb-4 h-40 w-full" />
			<Skeleton className="mb-2 h-3 w-1/3" />
			<Skeleton className="mb-2 h-5 w-full" />
			<Skeleton className="h-4 w-2/3" />
		</div>
	)
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: count }).map((_, i) => (
				<ArticleCardSkeleton key={i} />
			))}
		</div>
	)
}
