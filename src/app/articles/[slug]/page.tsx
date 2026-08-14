import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { OptimizedImage } from "@/components/media/OptimizedImage"
import { Breadcrumbs } from "@/components/article/Breadcrumbs"
import { TableOfContents } from "@/components/article/TableOfContents"
import { ShareButtons } from "@/components/article/ShareButtons"
import { RelatedArticles } from "@/components/article/RelatedArticles"
import { AuthorCard } from "@/components/authors/AuthorCard"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { AdSlot } from "@/components/monetization/AdSlot"
import { ToolCard } from "@/components/tools/ToolCard"
import {
  getArticleForReading,
  getRelatedArticles,
} from "@/services/articleService"
import { formatDate } from "@/lib/utils"
import {
  buildMetadata,
  articleSchema,
  breadcrumbSchema,
} from "@/lib/seo"
import { siteConfig } from "@/config/site"
import { sanitizeHtml } from "@/lib/sanitize"

export const revalidate = 120

type Props = {
  params: {
    slug: string
  }
}

/**
 * Extract h2/h3 headings directly on the server.
 * This avoids importing a client component helper
 * into the Server Component.
 */
function extractTableOfContents(html: string) {
  if (!html || typeof html !== "string") {
    return []
  }

  const matches = Array.from(
    html.matchAll(
      /<h([23])(?:\s[^>]*)?\sid=["']([^"']+)["'](?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi
    )
  )

  return matches.map((match) => ({
    level: Number(match[1]) as 2 | 3,
    id: match[2] ?? "",
    text: match[3] ?? ""
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .trim(),
  }))
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const article = await getArticleForReading(params.slug)

  if (!article) {
    return {}
  }

  return buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/articles/${article.slug}`,
    image: article.ogImage || article.heroImage || undefined,
    canonicalUrl: article.canonicalUrl || undefined,
    type: "article",
  })
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleForReading(params.slug)

  if (!article) {
    notFound()
  }

  const related = await getRelatedArticles(params.slug, 3)

  const toc = extractTableOfContents(article.content)

  const articleUrl = `${siteConfig.url}/articles/${article.slug}`

  return (
    <article className="pb-24 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleSchema({
              ...article,
              authorName: article.author.name,
            }),

            breadcrumbSchema([
              {
                name: "Home",
                path: "/",
              },
              {
                name: article.category.name,
                path: `/${article.category.slug}`,
              },
              {
                name: article.title,
                path: `/articles/${article.slug}`,
              },
            ]),
          ]),
        }}
      />

      <header className="mx-auto w-full max-w-article px-4">
        <Breadcrumbs
          items={[
            {
              name: "Home",
              href: "/",
            },
            {
              name: article.category.name,
              href: `/${article.category.slug}`,
            },
            {
              name: article.title,
            },
          ]}
        />

        <span className="text-metadata font-semibold uppercase tracking-wide text-nexora-cyan">
          {article.category.name}
        </span>

        <h1 className="mt-3 text-h1 leading-tight text-nexora-text">
          {article.title}
        </h1>

        {article.excerpt ? (
          <p className="mt-3 text-h4 font-normal text-nexora-muted">
            {article.excerpt}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-nexora-border py-4 text-caption text-nexora-muted">
          <span className="font-medium text-nexora-text">
            {article.author.name}
          </span>

          <span aria-hidden="true">&middot;</span>

          <span>
            Published{" "}
            {formatDate(article.publishedAt ?? article.createdAt)}
          </span>

          {article.updatedAt &&
          article.updatedAt !== article.publishedAt ? (
            <>
              <span aria-hidden="true">&middot;</span>

              <span>
                Updated {formatDate(article.updatedAt)}
              </span>
            </>
          ) : null}

          <span aria-hidden="true">&middot;</span>

          <span>{article.readingTime} min read</span>

          <div className="ml-auto">
            <ShareButtons
              url={articleUrl}
              title={article.title}
            />
          </div>
        </div>
      </header>

      {article.heroImage ? (
        <figure className="mx-auto mt-8 w-full max-w-hero px-4">
          <OptimizedImage
            src={article.heroImage}
            alt={article.title}
            priority
            aspectRatio="16/9"
          />
        </figure>
      ) : null}

      <div className="mx-auto mt-10 grid w-full max-w-hero gap-10 px-4 lg:grid-cols-[220px_1fr]">
        <TableOfContents items={toc} />

        <div className="mx-auto w-full max-w-article">
          <AdSlot placement="article-top" />

          <main
            className="prose-nexora mt-6"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(article.content),
            }}
          />

          <div className="mt-10">
            <AdSlot placement="article-bottom" />
          </div>

          {article.relatedTools.length > 0 ? (
            <section
              aria-labelledby="recommended-tools-heading"
              className="mt-12"
            >
              <h2
                id="recommended-tools-heading"
                className="mb-4 text-h4 text-nexora-text"
              >
                Recommended AI Tools
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
	{article.relatedTools.map((relation) => {
		const tool = relation.tool

		return (
			<ToolCard
				key={tool.slug}
				tool={tool}
			/>
		)
	})}
</div>
</section>
) : null}

          <section className="mt-12">
            <NewsletterForm placement="article" />
          </section>

          <section
            aria-labelledby="author-heading"
            className="mt-12"
          >
            <h2
              id="author-heading"
              className="sr-only"
            >
              About the author
            </h2>

            <AuthorCard author={article.author} />
          </section>
        </div>
      </div>

      <div className="mx-auto w-full max-w-hero px-4">
        <RelatedArticles articles={related} />
      </div>
    </article>
  )
}