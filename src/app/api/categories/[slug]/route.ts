import { apiError, apiSuccess } from "@/lib/apiResponse"
import { findCategoryBySlug } from "@/repositories/categoryRepository"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params

    const category = await findCategoryBySlug(slug)

    if (!category) {
        return apiError("Category not found.", 404)
    }

    return apiSuccess(category)
}