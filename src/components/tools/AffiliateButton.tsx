"use client"

import { AFFILIATE_DISCLOSURE_SHORT } from "@/lib/affiliate"

export function AffiliateButton({
	toolId,
	toolSlug,
	targetUrl,
	source,
	label = "Visit Website",
}: {
	toolId: string
	toolSlug: string
	targetUrl: string
	source?: string
	label?: string
}) {
	async function handleClick() {
		try {
			await fetch("/api/tools/click", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ toolId, source }),
			})
		} catch {
			// Never block navigation on analytics failure.
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<a
				href={targetUrl}
				target="_blank"
				rel="nofollow sponsored noopener"
				onClick={handleClick}
				data-tool-slug={toolSlug}
				className="inline-flex items-center justify-center rounded-pill bg-nexora-blue px-6 py-3 text-small font-semibold text-white transition-opacity hover:opacity-90"
			>
				{label}
			</a>
			<p className="text-caption text-nexora-muted-2">{AFFILIATE_DISCLOSURE_SHORT}</p>
		</div>
	)
}
