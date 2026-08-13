import { apiError, apiSuccess } from "@/lib/apiResponse"
import { requireRole } from "@/lib/auth"
import { listCategories } from "@/repositories/categoryRepository"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"
import type { NextRequest } from "next/server"

export async function GET() {
	const categories = await listCategories()
	return apiSuccess(categories)
}

export async function POST(request: NextRequest) {
	const session = await requireRole("EDITOR")
	if (!session) return apiError("Unauthorized. Editor role or higher is required.", 401)

	let body: { name?: string; description?: string }
	try {
		body = await request.json()
	} catch {
		return apiError("Invalid JSON body.")
	}
	if (!body.name) return apiError("name is required.")

	const category = await prisma.category.create({
		data: { name: body.name, slug: slugify(body.name), description: body.description },
	})
	return apiSuccess(category, 201)
}
