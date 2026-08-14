import type { NextRequest } from "next/server"
import { apiError, apiSuccess } from "@/lib/apiResponse"
import { getCurrentUser, requireRole } from "@/lib/auth"
import { listArticles } from "@/repositories/articleRepository"
import {
	createArticle,
	type CreateArticleInput,
} from "@/services/articleService"

export async function GET(request: NextRequest) {
	const user = await getCurrentUser()
	const params = request.nextUrl.searchParams
	const status = user ? (params.get("status") as any) : "PUBLISHED"

	const result = await listArticles({
		status: status ?? undefined,
		categorySlug: params.get("category") ?? undefined,
		page: Number(params.get("page") ?? "1") || 1,
		pageSize: Math.min(
			50,
			Number(params.get("pageSize") ?? "20") || 20,
		),
	})

	return apiSuccess(result)
}

export async function POST(request: NextRequest) {
	const session = await requireRole("ADMIN")

	if (!session) {
		return apiError("Unauthorized. Admin role is required.", 401)
	}

	let body: unknown

	try {
		body = await request.json()
	} catch {
		return apiError("Invalid JSON body.")
	}

	try {
		if (!body || typeof body !== "object") {
			return apiError("Invalid article payload.")
		}

		const article = await createArticle(body as CreateArticleInput)

		return apiSuccess(article, 201)
	} catch (error) {
		return apiError(
			error instanceof Error
				? error.message
				: "Failed to create article.",
			422,
		)
	}
}