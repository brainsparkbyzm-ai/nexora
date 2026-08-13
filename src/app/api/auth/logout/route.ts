import { apiSuccess } from "@/lib/apiResponse"
import { clearSessionCookie } from "@/lib/auth"

export async function POST() {
	await clearSessionCookie()
	return apiSuccess({ status: "logged_out" })
}
