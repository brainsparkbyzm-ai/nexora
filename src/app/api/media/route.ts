import type { NextRequest } from "next/server"
import { apiError, apiSuccess, apiRateLimited } from "@/lib/apiResponse"
import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadMedia, isAllowedMediaFile, MAX_UPLOAD_BYTES } from "@/lib/storage"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit"

export async function POST(request: NextRequest) {
	const session = await requireRole("AUTHOR")
	if (!session) return apiError("Unauthorized. Author role or higher is required.", 401)

	// Rate-limited per authenticated user + IP so this authenticated write
	// endpoint is bounded like every other public/sensitive route (Rule 8),
	// without punishing an entire office/NAT for one editor's bulk upload.
	const ip = getClientIp(request.headers)
	const rateLimit = checkRateLimit(`media-upload:${session.sub}:${ip}`, { windowMs: 60_000, limit: 20 })
	if (!rateLimit.allowed) {
		return apiRateLimited(Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)))
	}

	const formData = await request.formData()
	const file = formData.get("file")
	const altText = String(formData.get("altText") ?? "")
	if (!(file instanceof File)) return apiError("A file is required.")
	if (!isAllowedMediaFile(file.type, file.size)) {
		const maxMb = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))
		return apiError(`Unsupported file type or file too large (max ${maxMb}MB).`)
	}
	if (!altText.trim()) return apiError("Alt text is required for editorial images.")

	const buffer = Buffer.from(await file.arrayBuffer())
	const uploaded = await uploadMedia({ buffer, contentType: file.type, filename: file.name })

	const media = await prisma.media.create({
		data: {
			filename: file.name,
			url: uploaded.url,
			altText,
			width: null,
			height: null,
			fileType: file.type,
		},
	})
	return apiSuccess(media, 201)
}
