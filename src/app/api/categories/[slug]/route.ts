import { apiError, apiSuccess } from "@/lib/apiResponse"
import { findCategoryBySlug } from "@/repositories/categoryRepository"

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
	const category = await findCategoryBySlug(params.slug)
	if (!category) return apiError("Category not found.", 404)
	return apiSuccess(category)
}
