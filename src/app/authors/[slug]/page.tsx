import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { ArticleGrid } from "@/components/article/ArticleGrid"
import { prisma } from "@/lib/prisma"
import { listArticles } from "@/repositories/articleRepository"
import { toArticleCardData } from "@/services/articleService"
import { buildMetadata } from "@/lib/seo"

export const revalidate = 600

type Props = {
    params: {
        slug: string
    }
}

type AuthorData = {
    id: string
    slug: string
    name: string
    bio: string | null
    role: string | null
    avatarUrl: string | null
}

async function getAuthor(slug: string): Promise<AuthorData | null> {
    const author = await prisma.author.findUnique({
        where: {
            slug,
        },
    })

    if (!author) {
        return null
    }

    return {
        id: author.id,
        slug: author.slug,
        name: author.name,
        bio: author.bio,
        role: author.role,
        avatarUrl: author.avatarUrl,
    }
}

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const author = await getAuthor(params.slug)

    if (!author) {
        return {}
    }

    return buildMetadata({
        title: `${author.name} — NEXORA`,
        description:
            author.bio ||
            `Articles by ${author.name} on NEXORA.`,
        path: `/authors/${author.slug}`,
    })
}

export default async function AuthorPage({
    params,
}: Props) {
    const author = await getAuthor(params.slug)

    if (!author) {
        notFound()
    }

    const { items } = await listArticles({
        authorId: author.id,
        pageSize: 12,
    })

    return (
        <div className="mx-auto w-full max-w-content px-4 py-16">
            <div className="flex flex-col items-center gap-4 text-center">
                {author.avatarUrl ? (
                    <Image
                        src={author.avatarUrl}
                        alt={author.name}
                        width={96}
                        height={96}
                        className="rounded-full"
                    />
                ) : null}

                <h1 className="text-h1 text-nexora-text">
                    {author.name}
                </h1>

                {author.role ? (
                    <p className="text-small text-nexora-cyan">
                        {author.role}
                    </p>
                ) : null}

                {author.bio ? (
                    <p className="max-w-xl text-body text-nexora-muted">
                        {author.bio}
                    </p>
                ) : null}
            </div>

            <section className="mt-14">
                <SectionHeader title="Latest Articles" />

                <ArticleGrid
                    articles={items.map(toArticleCardData)}
                />
            </section>
        </div>
    )
}