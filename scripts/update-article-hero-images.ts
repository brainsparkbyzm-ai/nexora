/**
 * One-time, reversible hero-image update for the nine specifically reviewed
 * Nexora articles. It never runs the full seed and never changes article text,
 * categories, tags, status, or SEO fields.
 *
 * Run from the project root:
 *   node --env-file=.env --import tsx scripts/update-article-hero-images.ts
 *
 * A JSON backup is written before any database write. Do not delete it.
 */
import { existsSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not configured.")

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
})

const backupPath = resolve(process.cwd(), "article-hero-images-backup-2026-11-27.json")

const updates = [
  {
    "slug": "choose-the-right-ai-assistant-for-work",
    "expectedTitle": "How to Choose the Right AI Assistant for Your Work",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "github-copilot-vs-cursor",
    "expectedTitle": "GitHub Copilot vs Cursor: Which AI Coding Tool Is Worth Your Money?",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1778146476147-5f8d4bd03c79?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "ai-research-tools-comparison",
    "expectedTitle": "Best AI Research Tools in 2026: Perplexity vs ChatGPT vs Claude vs You.com",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1753613648137-602c669cbe07?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "build-ai-workflow-from-scratch",
    "expectedTitle": "How to Build an AI Workflow From Scratch (Step-by-Step)",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1743385779347-1549dabf1320?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "human-review-ai-generated-content",
    "expectedTitle": "A Human Review Workflow for AI-Generated Content",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1775163024488-e88e4a71179f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "ai-image-commercial-use-rights-checklist",
    "expectedTitle": "AI-Generated Images for Business: A Rights and Quality Checklist",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1767972159871-b9f5d320be2b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "n8n-first-workflow-beginners",
    "expectedTitle": "Build Your First n8n Workflow: A Beginner-Friendly Blueprint",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1758873271772-6bbc792c1514?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "ai-automation-small-business",
    "expectedTitle": "AI Automation for Small Businesses: 8 Tasks to Automate This Month",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1758873269317-51888e824b28?auto=format&fit=crop&w=1200&q=80"
  },
  {
    "slug": "enterprise-ai-adoption-guide-2026",
    "expectedTitle": "Enterprise AI Adoption in 2026: What Actually Works and What Doesn't",
    "expectedCurrentImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    "newImage": "https://images.unsplash.com/photo-1702047094974-a3475a6e37f5?auto=format&fit=crop&w=1200&q=80"
  }
] as const

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
      id: string
      slug: string
      previousHeroImage: string | null
      newImage: string
    }> = []

    for (const item of updates) {
      const row = bySlug.get(item.slug)
      if (!row) throw new Error(`Missing article ${item.slug}. No changes made.`)
      if (row.title !== item.expectedTitle) {
        throw new Error(`Unexpected title for ${item.slug}. No changes made.`)
      }
      if (row.heroImage === item.newImage) continue
      if (row.heroImage !== item.expectedCurrentImage) {
        throw new Error(
          `Current image for ${item.slug} differs from the reviewed original. No changes made.`
        )
      }
      pending.push({
        id: row.id,
        slug: row.slug,
        previousHeroImage: row.heroImage,
        newImage: item.newImage,
      })
    }

    if (pending.length === 0) {
      console.log("All nine target article images are already updated. No changes needed.")
      return
    }

    if (existsSync(backupPath)) {
      throw new Error(
        `Backup already exists at ${backupPath}. No changes made; keep the existing backup safe.`
      )
    }

    const backup = {
      createdAt: new Date().toISOString(),
      note: "Exact previous heroImage values before the one-time Nexora article image update.",
      entries: pending.map(({ slug, previousHeroImage, newImage }) => ({
        slug,
        previousHeroImage,
        newImage,
      })),
    }
    writeFileSync(backupPath, JSON.stringify(backup, null, 2) + "\n", {
      encoding: "utf8",
      flag: "wx",
    })

    await prisma.$transaction(
      pending.map((item) =>
        prisma.article.update({
          where: { id: item.id },
          data: { heroImage: item.newImage },
        })
      )
    )

    console.log(
      `Updated ${pending.length} article hero images. Article text and SEO fields were not changed.`
    )
    console.log(`Image backup saved to: ${backupPath}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error("Article image update stopped safely:", error)
  process.exitCode = 1
})
