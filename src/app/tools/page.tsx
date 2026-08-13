import type { Metadata } from "next"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { ToolCard } from "@/components/tools/ToolCard"
import { Pagination } from "@/components/ui/Pagination"
import { listToolsDirectory } from "@/services/toolService"
import { buildMetadata } from "@/lib/seo"

export const revalidate = 600

export const metadata: Metadata = buildMetadata({
	title: "AI Tool Directory",
	description: "Independently reviewed AI agents, automation platforms and productivity tools.",
	path: "/tools",
})

type Props = { searchParams: { category?: string; page?: string } }

export default async function ToolsDirectoryPage({ searchParams }: Props) {
	const page = Math.max(1, Number(searchParams.page ?? "1") || 1)
	const { items, total, pageSize } = await listToolsDirectory({ categorySlug: searchParams.category, page })

	return (
		<div className="mx-auto w-full max-w-content px-4 py-16">
			<div className="text-center">
				<span className="text-metadata font-semibold uppercase tracking-wide text-nexora-cyan">AI Tool Directory</span>
				<h1 className="mt-3 text-h1 text-nexora-text">The Best AI Tools, Reviewed</h1>
				<p className="mx-auto mt-4 max-w-2xl text-body text-nexora-muted">
					Independently tested AI agents, automation platforms and productivity software — with clear pros, cons
					and pricing.
				</p>
			</div>

			<section className="mt-14">
				<SectionHeader title="All Tools" />
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((tool) => (
						<ToolCard key={tool.slug} tool={tool} />
					))}
				</div>
				<Pagination page={page} pageSize={pageSize} total={total} basePath="/tools" />
			</section>
		</div>
	)
}
