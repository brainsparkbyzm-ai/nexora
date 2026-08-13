import type { NextRequest } from "next/server"
import { apiError, apiSuccess } from "@/lib/apiResponse"
import { requireRole } from "@/lib/auth"
import { getSiteSettings, upsertSiteSettings } from "@/services/settingsService"

export async function GET() {
	const settings = await getSiteSettings()
	return apiSuccess(settings)
}

export async function PUT(request: NextRequest) {
	const session = await requireRole("ADMIN")
	if (!session) return apiError("Unauthorized. Admin role or higher is required.", 401)

	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return apiError("Invalid JSON body.")
	}

	const settings = await upsertSiteSettings(body)
	return apiSuccess(settings)
}
