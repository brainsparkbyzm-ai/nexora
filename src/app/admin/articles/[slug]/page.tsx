import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArticleEditorForm } from "@/components/admin/ArticleEditorForm"

export default async function EditArticlePage({ params }: { params: { slug: string } }) {
	const [article, categories] = await Promise.all([
		prisma.article.findUnique({ where: { slug: params.slug } }),
		prisma.category.findMany({ orderBy: { name: "asc" } }),
	])
	if (!article) notFound()

	return <ArticleEditorForm mode="edit" categories={categories} initialArticle={article} />
}
