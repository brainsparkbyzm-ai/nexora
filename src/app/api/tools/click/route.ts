import type { NextRequest } from "next/server"
import { apiError, apiSuccess } from "@/lib/apiResponse"
import { resolveAffiliateClick } from "@/services/toolService"

export async function POST(request: NextRequest) {
	let body: unknown
	try {
		body = await request.json()
	} catch {
		return apiError("Invalid JSON body.")
	}
	const toolId = typeof (body as { toolId?: unknown })?.toolId === "string" ? (body as { toolId: string }).toolId : ""
	const source = typeof (body as { source?: unknown })?.source === "string" ? (body as { source: string }).source : undefined
	if (!toolId) return apiError("toolId is required.")

	await resolveAffiliateClick(toolId, source)
	return apiSuccess({ status: "tracked" })
}
