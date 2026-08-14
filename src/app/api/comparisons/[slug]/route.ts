import { apiError, apiSuccess } from "@/lib/apiResponse"
import { getComparison } from "@/services/toolService"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params

    const comparison = await getComparison(slug)

    if (!comparison) {
        return apiError("Comparison not found.", 404)
    }

    return apiSuccess(comparison)
}