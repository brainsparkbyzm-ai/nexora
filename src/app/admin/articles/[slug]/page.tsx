import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ArticleEditorForm } from "@/components/admin/ArticleEditorForm"

type Props = {
	params: Promise<{
		slug: string
	}>
}

export default async function EditArticlePage({ params }: Props) {
	const { slug } = await params

	const [article, categories] = await Promise.all([
		prisma.article.findUnique({
			where: { slug },
		}),
		prisma.category.findMany({
			orderBy: { name: "asc" },
		}),
	])

	if (!article) {
		notFound()
	}

	return (
		<ArticleEditorForm
			mode="edit"
			categories={categories}
			initialArticle={article}
		/>
	)
}