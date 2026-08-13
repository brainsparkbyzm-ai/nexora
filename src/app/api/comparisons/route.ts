import { apiSuccess } from "@/lib/apiResponse"
import { listAllComparisons } from "@/services/toolService"

export async function GET() {
	const comparisons = await listAllComparisons()
	return apiSuccess(comparisons)
}
