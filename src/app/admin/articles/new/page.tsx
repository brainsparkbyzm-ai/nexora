import { prisma } from "@/lib/prisma"
import { ArticleEditorForm } from "@/components/admin/ArticleEditorForm"
import { requireRoleOrRedirect } from "@/lib/auth"

export default async function NewArticlePage() {
	const user = await requireRoleOrRedirect("AUTHOR")
	const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

	return (
		<ArticleEditorForm
			mode="create"
			categories={categories}
			initialArticle={{
				title: "",
				slug: "",
				excerpt: "",
				content: "",
				status: "DRAFT",
				authorId: user.authorId ?? undefined,
				scheduledAt: null,
			}}
		/>
	)
}
