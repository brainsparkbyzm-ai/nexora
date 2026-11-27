/**
 * Restore the exact heroImage values from the JSON backup created by
 * update-article-hero-images.ts. Refuses to overwrite any image that changed
 * after the update, so later editorial work is not silently discarded.
 *
 * Run from the project root:
 *   node --env-file=.env --import tsx scripts/restore-article-hero-images.ts
 */
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not configured.")

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
})

const backupPath = resolve(process.cwd(), "article-hero-images-backup-2026-11-27.json")

type Backup = {
  entries: Array<{
    slug: string
    previousHeroImage: string | null
    newImage: string
  }>
}

async function main() {
  try {
    if (!existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}. No changes made.`)
    }

    const backup = JSON.parse(readFileSync(backupPath, "utf8")) as Backup
    if (!Array.isArray(backup.entries) || backup.entries.length === 0) {
      throw new Error("Backup file has no image entries. No changes made.")
    }

    const rows = await prisma.article.findMany({
      where: { slug: { in: backup.entries.map((entry) => entry.slug) } },
      select: { id: true, slug: true, heroImage: true },
    })
    if (rows.length !== backup.entries.length) {
      throw new Error("Article set differs from backup. No changes made.")
    }

    const bySlug = new Map(rows.map((row) => [row.slug, row]))
    for (const entry of backup.entries) {
      const row = bySlug.get(entry.slug)
      if (!row || row.heroImage !== entry.newImage) {
        throw new Error(
          `Current image for ${entry.slug} changed after backup. No changes made.`
        )
      }
    }

    await prisma.$transaction(
      backup.entries.map((entry) => {
        const row = bySlug.get(entry.slug)!
        return prisma.article.update({
          where: { id: row.id },
          data: { heroImage: entry.previousHeroImage },
        })
      })
    )

    console.log(`Restored ${backup.entries.length} article hero images from backup.`)
    console.log("The backup file was kept unchanged.")
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error("Article image restore stopped safely:", error)
  process.exitCode = 1
})
