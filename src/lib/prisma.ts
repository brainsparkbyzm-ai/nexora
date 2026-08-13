import { PrismaClient } from "@prisma/client"

/**
 * Prisma client singleton. In Next.js dev mode, modules can be re-evaluated
 * on every request; caching the client on `globalThis` avoids exhausting
 * the Postgres connection pool with repeated `new PrismaClient()` calls.
 */
declare global {
	// eslint-disable-next-line no-var
	var __nexoraPrisma: PrismaClient | undefined
}

export const prisma =
	globalThis.__nexoraPrisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
	})

if (process.env.NODE_ENV !== "production") {
	globalThis.__nexoraPrisma = prisma
}
