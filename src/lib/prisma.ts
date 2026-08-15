import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

declare global {
	// eslint-disable-next-line no-var
	var __nexoraPrisma: PrismaClient | undefined
}

function createPrismaClient() {
	const connectionString = process.env.DATABASE_URL

	if (!connectionString) {
		throw new Error("DATABASE_URL is not configured.")
	}

	const adapter = new PrismaNeon({
		connectionString,
	})

	return new PrismaClient({
		adapter,
	})
}

export const prisma =
	globalThis.__nexoraPrisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
	globalThis.__nexoraPrisma = prisma
}

