import { apiSuccess } from "@/lib/apiResponse"
import { prisma } from "@/lib/prisma"

export async function GET() {
	const reviews = await prisma.review.findMany({
		include: { tool: { select: { name: true, slug: true } } },
		orderBy: { createdAt: "desc" },
		take: 50,
	})
	return apiSuccess(reviews)
}
