import { apiError, apiSuccess } from "@/lib/apiResponse"
import { getToolReview } from "@/services/toolService"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params

    const tool = await getToolReview(slug)

    if (!tool) {
        return apiError("Tool not found.", 404)
    }

    return apiSuccess(tool)
}