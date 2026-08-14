import type { Metadata } from "next"

import { SectionHeader } from "@/components/ui/SectionHeader"
import { ToolCard } from "@/components/tools/ToolCard"
import { Pagination } from "@/components/ui/Pagination"

import { listToolsDirectory } from "@/services/toolService"
import { buildMetadata } from "@/lib/seo"

import type { ToolCardData } from "@/types/content"

export const revalidate = 600

export const metadata: Metadata = buildMetadata({
	title: "AI Tool Directory",
	description:
		"Independently reviewed AI agents, automation platforms and productivity tools.",
	path: "/tools",
})

type Props = {
	searchParams: Promise<{
		category?: string
		page?: string
	}>
}

export default async function ToolsDirectoryPage({
	searchParams,
}: Props) {
	const params = await searchParams

	const requestedPage = Number(params.page ?? "1")

	const page = Number.isFinite(requestedPage)
		? Math.max(1, requestedPage)
		: 1

	const category = params.category?.trim() || undefined

	const result = await listToolsDirectory({
		categorySlug: category,
		page,
	})

	const items = result.items as ToolCardData[]

	return (
		<div className="nexora-page relative min-h-screen overflow-hidden pb-24 pt-8 sm:pt-12 lg:pt-16">
			{/* ============================================================
			    AMBIENT BACKGROUND
			============================================================ */}

			<div
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
				aria-hidden="true"
			>
				<div className="absolute left-[-14rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-nexora-blue/10 blur-[140px] animate-ambient-pulse" />

				<div
					className="absolute right-[-14rem] top-[18%] h-[32rem] w-[32rem] rounded-full bg-nexora-turquoise/10 blur-[140px] animate-ambient-pulse"
					style={{
						animationDelay: "1.5s",
					}}
				/>

				<div
					className="absolute bottom-[5%] left-[35%] h-[26rem] w-[26rem] rounded-full bg-nexora-vanilla/5 blur-[130px] animate-ambient-pulse"
					style={{
						animationDelay: "3s",
					}}
				/>

				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(7,16,20,0.58)_100%)]" />
			</div>

			<div className="mx-auto flex w-full max-w-content flex-col gap-14 px-4 sm:gap-18 lg:gap-20">
				{/* ========================================================
				    PAGE HERO
				======================================================== */}

				<section className="relative">
					<div
						className="pointer-events-none absolute left-1/2 top-[-6rem] h-[22rem] w-[44rem] -translate-x-1/2 rounded-full bg-nexora-turquoise/8 blur-[130px]"
						aria-hidden="true"
					/>

					<div className="nexora-card nexora-3d relative overflow-hidden rounded-card border border-white/5 px-5 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
						<div
							className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexora-turquoise/50 to-transparent"
							aria-hidden="true"
						/>

						<div
							className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-nexora-blue/10 blur-[90px]"
							aria-hidden="true"
						/>

						<div
							className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-nexora-turquoise/10 blur-[90px]"
							aria-hidden="true"
						/>

						<div className="relative z-10">
							<span className="nexora-badge inline-flex rounded-pill border border-nexora-turquoise/20 bg-nexora-turquoise/5 px-4 py-1.5 text-metadata font-semibold uppercase tracking-[0.14em] text-nexora-cyan">
								NEXORA Intelligence Directory
							</span>

							<h1 className="nexora-glow-text mt-5 text-h1 text-nexora-text">
								The Best AI Tools,{" "}
								<span className="nexora-gradient-text">
									Reviewed
								</span>
							</h1>

							<p className="mx-auto mt-5 max-w-2xl text-body leading-relaxed text-nexora-muted">
								Independently tested AI agents, automation
								platforms and productivity software — with
								clear pros, cons and pricing.
							</p>

							<div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-nexora-turquoise to-transparent" />

							<div className="mt-7 flex flex-wrap justify-center gap-3">
								<span className="nexora-glass rounded-pill border border-white/5 px-4 py-2 text-caption text-nexora-muted">
									AI Agents
								</span>

								<span className="nexora-glass rounded-pill border border-white/5 px-4 py-2 text-caption text-nexora-muted">
									Automation
								</span>

								<span className="nexora-glass rounded-pill border border-white/5 px-4 py-2 text-caption text-nexora-muted">
									Productivity
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* ========================================================
				    TOOLS SECTION
				======================================================== */}

				<section className="nexora-section animate-fade-up">
					<div className="flex flex-col gap-8">
						<SectionHeader
							title={
								category
									? `${category} Tools`
									: "All Tools"
							}
						/>

						{/* TOOL GRID / EMPTY STATE */}

						{items.length > 0 ? (
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
								{items.map((tool, index) => (
									<div
										key={tool.slug}
										className="nexora-tool-card nexora-3d animate-card-enter"
										style={{
											animationDelay: `${index * 80}ms`,
										}}
									>
										<ToolCard tool={tool} />
									</div>
								))}
							</div>
						) : (
							<div className="nexora-glass rounded-card border border-white/5 px-6 py-16 text-center sm:px-10">
								<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-nexora-turquoise/20 bg-nexora-turquoise/5 text-xl">
									✦
								</div>

								<h2 className="mt-5 text-h2 text-nexora-text">
									No AI tools found
								</h2>

								<p className="mx-auto mt-3 max-w-md text-body text-nexora-muted">
									We couldn't find any tools for this
									category yet. Check another category or
									come back soon.
								</p>
							</div>
						)}

						{/* PAGINATION */}

						{items.length > 0 ? (
							<div className="pt-4">
								<Pagination
									page={page}
									pageSize={result.pageSize}
									total={result.total}
									basePath="/tools"
								/>
							</div>
						) : null}
					</div>
				</section>

				{/* ========================================================
				    DIRECTORY CTA
				======================================================== */}

				<section className="animate-scale-in">
					<div className="nexora-glass nexora-3d relative overflow-hidden rounded-card border border-white/5 px-6 py-10 text-center sm:px-10 sm:py-14">
						<div
							className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-nexora-blue/10 blur-[90px]"
							aria-hidden="true"
						/>

						<div
							className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-nexora-turquoise/10 blur-[90px]"
							aria-hidden="true"
						/>

						<div className="relative z-10">
							<span className="nexora-badge inline-flex rounded-pill border border-nexora-vanilla/20 bg-nexora-vanilla/5 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.14em] text-nexora-vanilla">
								NEXORA Research
							</span>

							<h2 className="nexora-glow-text mt-4 text-h2 text-nexora-text">
								Find the right tool for the job
							</h2>

							<p className="mx-auto mt-3 max-w-xl text-body leading-relaxed text-nexora-muted">
								Explore practical AI software selected for
								real workflows, automation and modern
								productivity.
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}