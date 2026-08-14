import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { ComparisonTable } from "@/components/tools/ComparisonTable"
import { AffiliateButton } from "@/components/tools/AffiliateButton"
import { getComparison } from "@/services/toolService"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { siteConfig } from "@/config/site"

const asFeatureRows = (
	value: unknown,
): Array<{
	feature: string
	toolA: string
	toolB: string
}> =>
	Array.isArray(value)
		? value.filter(
				(
					item,
				): item is {
					feature: string
					toolA: string
					toolB: string
				} => {
					if (!item || typeof item !== "object") return false

					const row = item as Record<string, unknown>

					return (
						typeof row.feature === "string" &&
						typeof row.toolA === "string" &&
						typeof row.toolB === "string"
					)
				},
			)
		: []

const asFaq = (
	value: unknown,
): Array<{
	question: string
	answer: string
}> =>
	Array.isArray(value)
		? value.filter(
				(
					item,
				): item is {
					question: string
					answer: string
				} => {
					if (!item || typeof item !== "object") return false

					const faq = item as Record<string, unknown>

					return (
						typeof faq.question === "string" &&
						typeof faq.answer === "string"
					)
				},
			)
		: []

export const revalidate = 600

type Props = {
	params: Promise<{
		slug: string
	}>
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata> {
	const { slug } = await params

	const comparison = await getComparison(slug)

	if (!comparison) {
		return {}
	}

	return buildMetadata({
		title:
			comparison.title ||
			`${comparison.toolA.name} vs ${comparison.toolB.name}`,
		description: comparison.summary,
		path: `/compare/${comparison.slug}`,
	})
}

export default async function ComparisonPage({ params }: Props) {
	const { slug } = await params

	const comparison = await getComparison(slug)

	if (!comparison) {
		notFound()
	}

	const featureTable = asFeatureRows(comparison.featureTable)
	const faq = asFaq(comparison.faq)

	return (
		<div className="mx-auto w-full max-w-article px-4 py-16">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						breadcrumbSchema([
							{
								name: "Home",
								path: "/",
							},
							{
								name: "Compare",
								path: "/tools",
							},
							{
								name: `${comparison.toolA.name} vs ${comparison.toolB.name}`,
								path: `/compare/${comparison.slug}`,
							},
						]),
					),
				}}
			/>

			<span className="text-metadata font-semibold uppercase tracking-wide text-nexora-cyan">
				Comparison
			</span>

			<h1 className="mt-3 text-h1 text-nexora-text">
				{comparison.toolA.name} vs {comparison.toolB.name}
			</h1>

			<p className="mt-4 text-body text-nexora-muted">
				{comparison.summary}
			</p>

			{comparison.verdict ? (
				<div className="mt-6 rounded-card border border-nexora-blue/40 bg-nexora-blue/10 p-4 text-small text-nexora-text">
					<span className="font-semibold text-nexora-cyan">
						Verdict:
					</span>{" "}
					{comparison.verdict}
				</div>
			) : null}

			<section className="mt-10">
				<h2 className="mb-4 text-h4 text-nexora-text">
					Feature Comparison
				</h2>

				<ComparisonTable
					toolA={comparison.toolA}
					toolB={comparison.toolB}
					featureTable={featureTable}
				/>
			</section>

			<div className="mt-10 grid gap-6 sm:grid-cols-2">
				<div className="rounded-card border border-nexora-border p-6">
					<h3 className="mb-3 text-h4 text-nexora-text">
						{comparison.toolA.name}
					</h3>

					<AffiliateButton
						toolId={comparison.toolA.id}
						toolSlug={comparison.toolA.slug}
						targetUrl={
							comparison.toolA.affiliateUrl ||
							comparison.toolA.websiteUrl
						}
						source="comparison-page"
						label={`Try ${comparison.toolA.name}`}
					/>
				</div>

				<div className="rounded-card border border-nexora-border p-6">
					<h3 className="mb-3 text-h4 text-nexora-text">
						{comparison.toolB.name}
					</h3>

					<AffiliateButton
						toolId={comparison.toolB.id}
						toolSlug={comparison.toolB.slug}
						targetUrl={
							comparison.toolB.affiliateUrl ||
							comparison.toolB.websiteUrl
						}
						source="comparison-page"
						label={`Try ${comparison.toolB.name}`}
					/>
				</div>
			</div>

			{faq.length > 0 ? (
				<section className="mt-10">
					<h2 className="mb-4 text-h4 text-nexora-text">
						FAQ
					</h2>

					<div className="flex flex-col gap-4">
						{faq.map((item) => (
							<div
								key={item.question}
								className="rounded-md border border-nexora-border p-4"
							>
								<p className="font-semibold text-nexora-text">
									{item.question}
								</p>

								<p className="mt-1 text-small text-nexora-muted">
									{item.answer}
								</p>
							</div>
						))}
					</div>
				</section>
			) : null}
		</div>
	)
}