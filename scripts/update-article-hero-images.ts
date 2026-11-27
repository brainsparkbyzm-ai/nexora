/**
 * One-time, retry-safe hero-image update for nine reviewed Nexora articles.
 *
 * Run from the project root:
 *   node --env-file=.env --import tsx scripts/update-article-hero-images.ts
 *
 * Writes/preserves a JSON backup before any database write. The database
 * change is one guarded PostgreSQL statement, so the nine changes are atomic.
 * Already-updated rows are skipped, allowing a safe retry after a timeout.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { Prisma, PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not configured.")

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
})

const backupPath = resolve(process.cwd(), "article-hero-images-backup-2026-11-27.json")

const updates = [
  {
    slug: "choose-the-right-ai-assistant-for-work",
    expectedTitle: "How to Choose the Right AI Assistant for Your Work",
    expectedCurrentImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1761912149936-8f662fc2a13e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "github-copilot-vs-cursor",
    expectedTitle: "GitHub Copilot vs Cursor: Which AI Coding Tool Is Worth Your Money?",
    expectedCurrentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1753613648242-6b6c5b88e4d1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "ai-research-tools-comparison",
    expectedTitle: "Best AI Research Tools in 2026: Perplexity vs ChatGPT vs Claude vs You.com",
    expectedCurrentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1784729553968-07da5d7b7c99?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "build-ai-workflow-from-scratch",
    expectedTitle: "How to Build an AI Workflow From Scratch (Step-by-Step)",
    expectedCurrentImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1758873269117-d5845126928a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "human-review-ai-generated-content",
    expectedTitle: "A Human Review Workflow for AI-Generated Content",
    expectedCurrentImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1758874573188-5d7380fa647a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "ai-image-commercial-use-rights-checklist",
    expectedTitle: "AI-Generated Images for Business: A Rights and Quality Checklist",
    expectedCurrentImage: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1758519288480-1489c17b1519?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "n8n-first-workflow-beginners",
    expectedTitle: "Build Your First n8n Workflow: A Beginner-Friendly Blueprint",
    expectedCurrentImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1763568258367-1c52beb60be7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "ai-automation-small-business",
    expectedTitle: "AI Automation for Small Businesses: 8 Tasks to Automate This Month",
    expectedCurrentImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1758876203026-99a024dc43b9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    slug: "enterprise-ai-adoption-guide-2026",
    expectedTitle: "Enterprise AI Adoption in 2026: What Actually Works and What Doesn't",
    expectedCurrentImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    newImage: "https://images.unsplash.com/photo-1758873268379-39301764793f?auto=format&fit=crop&w=1200&q=80"
  }
] as const

type Backup = {
  entries: Array<{
    slug: string
    previousHeroImage: string | null
    newImage: string
  }>
}

async function main() {
  try {
    const rows = await prisma.article.findMany({
      where: { slug: { in: updates.map((item) => item.slug) } },
      select: { id: true, slug: true, title: true, heroImage: true },
    })

    if (rows.length !== updates.length) {
      throw new Error(
        `Expected ${updates.length} target articles, found ${rows.length}. No changes made.`
      )
    }

    const bySlug = new Map(rows.map((row) => [row.slug, row]))
    const pending: Array<{
      slug: string
      previousHeroImage: string
      newImage: string
    }> = []

    for (const item of updates) {
      const row = bySlug.get(item.slug)
      if (!row) throw new Error(`Missing article ${item.slug}. No changes made.`)
      if (row.title !== item.expectedTitle) {
        throw new Error(`Unexpected title for ${item.slug}. No changes made.`)
      }

      if (row.heroImage === item.newImage) {
        continue
      }

      if (row.heroImage !== item.expectedCurrentImage) {
        throw new Error(
          `Current image for ${item.slug} is neither the reviewed original nor the new image. No changes made.`
        )
      }

      pending.push({
        slug: row.slug,
        previousHeroImage: item.expectedCurrentImage,
        newImage: item.newImage,
      })
    }

    // Keep the original backup from the first attempt. Validate it rather than
    // overwriting it, so retries never lose the pre-change image values.
    if (existsSync(backupPath)) {
      const backup = JSON.parse(readFileSync(backupPath, "utf8")) as Backup
      if (!Array.isArray(backup.entries) || backup.entries.length !== updates.length) {
        throw new Error("Existing image backup is incomplete or invalid. No changes made.")
      }

      const backupBySlug = new Map(backup.entries.map((entry) => [entry.slug, entry]))
      for (const item of updates) {
        const entry = backupBySlug.get(item.slug)
        if (
          !entry ||
          entry.previousHeroImage !== item.expectedCurrentImage ||
          entry.newImage !== item.newImage
        ) {
          throw new Error(
            `Existing image backup does not match reviewed target ${item.slug}. No changes made.`
          )
        }
      }
      console.log("Existing JSON backup found and validated; it will be kept unchanged.")
    } else {
      const backup = {
        createdAt: new Date().toISOString(),
        note: "Exact original heroImage values before the one-time Nexora article image update.",
        entries: updates.map((item) => ({
          slug: item.slug,
          previousHeroImage: item.expectedCurrentImage,
          newImage: item.newImage,
        })),
      }
      writeFileSync(backupPath, JSON.stringify(backup, null, 2) + "\n", {
        encoding: "utf8",
        flag: "wx",
      })
      console.log(`JSON backup created: ${backupPath}`)
    }

    if (pending.length === 0) {
      console.log("All nine article images are already updated. No database changes needed.")
      return
    }

    // One PostgreSQL statement avoids a slow multi-operation transaction.
    // The eligible-count guard makes this an all-or-nothing update even if a
    // row changes between the read above and this statement.
    const values = Prisma.join(
      pending.map((item) =>
        Prisma.sql`(${item.slug}, ${item.previousHeroImage}, ${item.newImage})`
      )
    )

    const result = await prisma.$queryRaw<Array<{ updatedCount: number }>>(Prisma.sql`
      WITH updates(slug, previous_image, new_image) AS (
        VALUES ${values}
      ),
      eligible AS (
        SELECT COUNT(*)::int AS total
        FROM "Article" AS article
        INNER JOIN updates ON updates.slug = article.slug
        WHERE article."heroImage" IS NOT DISTINCT FROM updates.previous_image
      ),
      changed AS (
        UPDATE "Article" AS article
        SET "heroImage" = updates.new_image,
            "updatedAt" = NOW()
        FROM updates, eligible
        WHERE eligible.total = ${pending.length}
          AND article.slug = updates.slug
          AND article."heroImage" IS NOT DISTINCT FROM updates.previous_image
        RETURNING article.slug
      )
      SELECT COUNT(*)::int AS "updatedCount" FROM changed
    `)

    const updatedCount = result[0]?.updatedCount ?? 0
    if (updatedCount !== pending.length) {
      throw new Error(
        `Safe update guard expected ${pending.length} rows but updated ${updatedCount}. No further changes attempted; inspect database state before retrying.`
      )
    }

    const verifyRows = await prisma.article.findMany({
      where: { slug: { in: updates.map((item) => item.slug) } },
      select: { slug: true, heroImage: true },
    })
    const verifyBySlug = new Map(verifyRows.map((row) => [row.slug, row.heroImage]))
    const failures = updates.filter((item) => verifyBySlug.get(item.slug) !== item.newImage)
    if (failures.length > 0) {
      throw new Error(
        `Post-update verification failed for: ${failures.map((item) => item.slug).join(", ")}. Keep backup file and inspect before retrying.`
      )
    }

    console.log(`Successfully updated and verified ${updates.length} unique article images.`)
    console.log("Article text, tags, categories, status and SEO fields were not changed.")
    console.log(`Original image backup kept at: ${backupPath}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error("Article image update stopped safely:", error)
  process.exitCode = 1
})
