import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { SectionHeader } from "@/components/ui/SectionHeader"
import { ArticleGrid } from "@/components/article/ArticleGrid"
import { FeaturedArticle } from "@/components/article/FeaturedArticle"
import { GlassPanel } from "@/components/ui/GlassPanel"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { Pagination } from "@/components/ui/Pagination"
import { AdSlot } from "@/components/monetization/AdSlot"

import {
    findCategoryBySlug,
    isKnownCategorySlug,
} from "@/repositories/categoryRepository"

import {
    listArticlesForCategory,
    getFeaturedArticle,
} from "@/services/articleService"

import { listTools } from "@/repositories/toolRepository"
import { ToolCard } from "@/components/tools/ToolCard"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { coreCategorySlugs } from "@/config/site"

export const revalidate = 300

type Props = {
    params: {
        category: string
    }
    searchParams: {
        page?: string
    }
}

export async function generateStaticParams() {
    return coreCategorySlugs.map((category) => ({
        category,
    }))
}

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const category = await findCategoryBySlug(params.category)

    if (!category) {
        return {}
    }

    return buildMetadata({
        title: `${category.name} — Articles, Guides & Analysis`,
        description:
            category.description ??
            `Latest ${category.name} articles from NEXORA.`,
        path: `/${category.slug}`,
    })
}

export default async function CategoryPage({
    params,
    searchParams,
}: Props) {
    const slug = params.category

    const knownCategory = await isKnownCategorySlug(slug)

    if (!knownCategory) {
        notFound()
    }

    const category = await findCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const requestedPage = Number(searchParams.page ?? "1")

    const page = Number.isFinite(requestedPage)
        ? Math.max(1, requestedPage)
        : 1

    const pageSize = 9

    const [featured, articlesResult, relatedToolsResult] =
        await Promise.all([
            getFeaturedArticle(category.slug),

            listArticlesForCategory(
                category.slug,
                page,
                pageSize,
            ),

            listTools({
                categorySlug: category.slug,
                pageSize: 3,
            }),
        ])

    const { items, total } = articlesResult

    const relatedTools = relatedToolsResult.items

    return (
        <div className="flex flex-col gap-16 pb-24 pt-10">
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
                                name: category.name,
                                path: `/${category.slug}`,
                            },
                        ]),
                    ),
                }}
            />

            <section className="mx-auto w-full max-w-content px-4 text-center">
                <span className="text-metadata font-semibold uppercase tracking-wide text-nexora-cyan">
                    Category
                </span>

                <h1 className="mt-3 text-h1 text-nexora-text">
                    {category.name}
                </h1>

                {category.description ? (
                    <p className="mx-auto mt-4 max-w-2xl text-body text-nexora-muted">
                        {category.description}
                    </p>
                ) : null}
            </section>

            {featured ? (
                <section className="mx-auto w-full max-w-content px-4">
                    <FeaturedArticle article={featured} />
                </section>
            ) : null}

            <section className="mx-auto w-full max-w-content px-4">
                <SectionHeader title="Latest" />

                <ArticleGrid articles={items} />

                <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    basePath={`/${category.slug}`}
                />
            </section>

            <div className="mx-auto w-full max-w-content px-4">
                <AdSlot placement="category-feed" />
            </div>

            {relatedTools.length > 0 ? (
                <section className="mx-auto w-full max-w-content px-4">
                    <SectionHeader
                        title="Related AI Tools"
                        href="/tools"
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {relatedTools.map(
                            (
                                tool: (typeof relatedTools)[number],
                            ) => (
                                <ToolCard
                                    key={tool.slug}
                                    tool={tool}
                                />
                            ),
                        )}
                    </div>
                </section>
            ) : null}

            <section className="mx-auto w-full max-w-content px-4">
                <GlassPanel className="flex flex-col items-center gap-4 p-10 text-center">
                    <h2 className="text-h2 text-nexora-text">
                        Stay ahead in {category.name}
                    </h2>

                    <NewsletterForm placement="category" />
                </GlassPanel>
            </section>
        </div>
    )
}

