import type { NextRequest } from "next/server"
import { apiError, apiSuccess } from "@/lib/apiResponse"
import { requireRole } from "@/lib/auth"
import {
    findArticleByIdOrSlug,
    deleteArticle as deleteArticleRow,
} from "@/repositories/articleRepository"
import {
    getArticleForReading,
    updateArticle,
    type UpdateArticleInput,
} from "@/services/articleService"

type RouteContext = {
    params: Promise<{
        slug: string
    }>
}

export async function GET(
    _request: NextRequest,
    { params }: RouteContext,
) {
    const { slug } = await params

    const article = await getArticleForReading(slug)

    if (!article) {
        return apiError("Article not found.", 404)
    }

    return apiSuccess(article)
}

export async function PUT(
    request: NextRequest,
    { params }: RouteContext,
) {
    const { slug } = await params

    const session = await requireRole("AUTHOR")

    if (!session) {
        return apiError(
            "Unauthorized. Author role or higher is required.",
            401,
        )
    }

    const existing = await findArticleByIdOrSlug(slug)

    if (!existing) {
        return apiError("Article not found.", 404)
    }

    let body: unknown

    try {
        body = await request.json()
    } catch {
        return apiError("Invalid JSON body.")
    }

    try {
        const article = await updateArticle(
            existing.id,
            body as UpdateArticleInput,
        )

        return apiSuccess(article)
    } catch (error) {
        return apiError(
            error instanceof Error
                ? error.message
                : "Failed to update article.",
            422,
        )
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: RouteContext,
) {
    const { slug } = await params

    const session = await requireRole("EDITOR")

    if (!session) {
        return apiError(
            "Unauthorized. Editor role or higher is required.",
            401,
        )
    }

    const existing = await findArticleByIdOrSlug(slug)

    if (!existing) {
        return apiError("Article not found.", 404)
    }

    await deleteArticleRow(existing.id)

    return apiSuccess({
        status: "deleted",
    })
}