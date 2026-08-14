import type { NextRequest } from "next/server"
import { apiError, apiSuccess } from "@/lib/apiResponse"
import { requireRole } from "@/lib/auth"
import { listToolsDirectory } from "@/services/toolService"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest) {
	const params = request.nextUrl.searchParams

	const result = await listToolsDirectory({
		categorySlug: params.get("category") ?? undefined,
		featuredOnly: params.get("featured") === "true",
		page: Number(params.get("page") ?? "1") || 1,
		pageSize: Math.min(50, Number(params.get("pageSize") ?? "20") || 20),
	})

	return apiSuccess(result)
}

export async function POST(request: NextRequest) {
	const session = await requireRole("ADMIN")

	if (!session) {
		return apiError("Unauthorized. Admin role is required.", 401)
	}

	let body: Record<string, unknown>

	try {
		body = await request.json()
	} catch {
		return apiError("Invalid JSON body.")
	}

	const name = typeof body.name === "string" ? body.name.trim() : ""
	const categoryId =
		typeof body.categoryId === "string" ? body.categoryId.trim() : ""
	const websiteUrl =
		typeof body.websiteUrl === "string" ? body.websiteUrl.trim() : ""

	if (!name || !categoryId || !websiteUrl) {
		return apiError(
			"name, categoryId and websiteUrl are required.",
		)
	}

	const tool = await prisma.tool.create({
		data: {
			name,
			slug: slugify(name),
			categoryId,
			websiteUrl,
			description:
				typeof body.description === "string"
					? body.description
					: "",
			pricing:
				typeof body.pricing === "string"
					? body.pricing
					: null,
			affiliateUrl:
				typeof body.affiliateUrl === "string"
					? body.affiliateUrl
					: null,
			pros: Array.isArray(body.pros) ? body.pros : [],
			cons: Array.isArray(body.cons) ? body.cons : [],
			features: Array.isArray(body.features)
				? body.features
				: [],
		},
	})

	return apiSuccess(tool, 201)
}