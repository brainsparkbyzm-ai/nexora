import type { NextRequest } from "next/server"
import { apiError, apiSuccess } from "@/lib/apiResponse"
import { unsubscribeFromNewsletter } from "@/services/newsletterService"

export async function POST(request: NextRequest) {
	let body: unknown
	try {
		body = await request.json()
	} catch {
		return apiError("Invalid JSON body.")
	}
	const email = typeof (body as { email?: unknown })?.email === "string" ? (body as { email: string }).email : ""
	if (!email) return apiError("Email is required.")

	await unsubscribeFromNewsletter(email)
	return apiSuccess({ status: "unsubscribed" })
}

export async function GET(request: NextRequest) {
	const email = request.nextUrl.searchParams.get("email")
	if (!email) return apiError("Email is required.")
	await unsubscribeFromNewsletter(email)
	return apiSuccess({ status: "unsubscribed" })
}
