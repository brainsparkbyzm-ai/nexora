import { prisma } from "@/lib/prisma"

export async function listCategories() {
	return prisma.category.findMany({ orderBy: { name: "asc" } })
}

export async function findCategoryBySlug(slug: string) {
	return prisma.category.findUnique({ where: { slug } })
}

export async function isKnownCategorySlug(slug: string): Promise<boolean> {
	const category = await prisma.category.findUnique({ where: { slug }, select: { id: true } })
	return category != null
}
