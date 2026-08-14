import type { NextRequest } from "next/server"
import {
	apiError,
	apiSuccess,
	apiRateLimited,
} from "@/lib/apiResponse"
import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
	uploadMedia,
	isAllowedMediaFile,
	MAX_UPLOAD_BYTES,
} from "@/lib/storage"
import {
	checkRateLimit,
	getClientIp,
} from "@/lib/rateLimit"

export async function POST(request: NextRequest) {
	const session = await requireRole("ADMIN")

	if (!session) {
		return apiError(
			"Unauthorized. Admin role is required.",
			401,
		)
	}

	const ip = getClientIp(request.headers)

	const rateLimit = checkRateLimit(
		`media-upload:${session.sub}:${ip}`,
		{
			windowMs: 60_000,
			limit: 20,
		},
	)

	if (!rateLimit.allowed) {
		const retryAfter = Math.max(
			1,
			Math.ceil(
				(rateLimit.resetAt - Date.now()) / 1000,
			),
		)

		return apiRateLimited(retryAfter)
	}

	let formData: FormData

	try {
		formData = await request.formData()
	} catch {
		return apiError("Invalid multipart form data.")
	}

	const file = formData.get("file")
	const alt = String(
		formData.get("altText") ?? "",
	).trim()

	if (!(file instanceof File)) {
		return apiError("A file is required.")
	}

	if (!isAllowedMediaFile(file.type, file.size)) {
		const maxMb = Math.round(
			MAX_UPLOAD_BYTES / (1024 * 1024),
		)

		return apiError(
			`Unsupported file type or file too large (max ${maxMb}MB).`,
		)
	}

	if (!alt) {
		return apiError(
			"Alt text is required for editorial images.",
		)
	}

	try {
		const buffer = Buffer.from(
			await file.arrayBuffer(),
		)

		const uploaded = await uploadMedia({
			buffer,
			contentType: file.type,
			filename: file.name,
		})

		const media = await prisma.media.create({
			data: {
				url: uploaded.url,
				type: file.type,
				alt,
				title: file.name,
			},
		})

		return apiSuccess(media, 201)
	} catch (error) {
		return apiError(
			error instanceof Error
				? error.message
				: "Failed to upload media.",
			500,
		)
	}
}