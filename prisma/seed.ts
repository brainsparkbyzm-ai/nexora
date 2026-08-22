import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://nexora.ai"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nexora.ai"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeThisAdminPassword123!"

type ToolSeed = {
  slug: string
  name: string
  description: string
  websiteUrl: string
  pricing: string
  rating: number
  pros: string[]
  cons: string[]
  bestFor: string
  features: Record<string, unknown>
  affiliateUrl?: string
  affiliateDisclosure?: string
  lastReviewedAt: Date
  featured: boolean
  categorySlug: string
}

type ArticleSeed = {
  slug: string
  title: string
  excerpt: string
  content: string
  categorySlug: string
  authorSlug: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  featured: boolean
  trending: boolean
  readingTime: number
  heroImage: string
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  schemaType: string
  publishedAt: Date
  tagSlugs: string[]
  relatedToolSlugs: string[]
}

const now = new Date()
const publishedBase = new Date("2026-08-01T09:00:00.000Z")
const reviewedAt = new Date("2026-08-15T09:00:00.000Z")

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const logoUrl = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const imageUrl = (query: string, index: number) =>
  `https://images.unsplash.com/photo-${query}?auto=format&fit=crop&w=1600&q=80&ixid=nexora-${index}`

const estimateReadingTime = (html: string) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  return Math.max(4, Math.ceil(text.split(" ").length / 210))
}

const buildArticleHtml = (args: {
  title: string
  intro: string
  sections: Array<{ heading: string; body: string }>
  conclusion: string
}) => `
<article>
  <p>${args.intro}</p>
  ${args.sections
    .map(
      (section) => `
  <h2>${section.heading}</h2>
  <p>${section.body}</p>`,
    )
    .join("\n")}
  <h2>Editorial verdict</h2>
  <p>${args.conclusion}</p>
</article>
`.trim()

const assertUnique = <T>(items: T[], getKey: (item: T) => string, label: string) => {
  const seen = new Set<string>()
  for (const item of items) {
    const key = getKey(item)
    if (seen.has(key)) {
      throw new Error(`Duplicate ${label}: ${key}`)
    }
    seen.add(key)
  }
}

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message)
}

const authors = [
  {
    slug: "mira-khan",
    name: "Mira Khan",
    role: "Editor in Chief",
    bio: "Mira leads Nexora’s editorial coverage of AI tools, practical automation and responsible technology adoption.",
  },
  {
    slug: "daniel-reyes",
    name: "Daniel Reyes",
    role: "Senior Tools Analyst",
    bio: "Daniel reviews AI software with a focus on workflow fit, pricing clarity, privacy posture and everyday reliability.",
  },
  {
    slug: "sana-patel",
    name: "Sana Patel",
    role: "Automation Editor",
    bio: "Sana covers AI agents, business automation and the systems teams use to move from experiments to production workflows.",
  },
  {
    slug: "leo-martin",
    name: "Leo Martin",
    role: "Developer Tools Editor",
    bio: "Leo writes about AI coding assistants, developer platforms, documentation workflows and technical productivity.",
  },
]

const categories = [
  {
    slug: "ai-agents",
    name: "AI Agents",
    description: "Practical coverage of AI agents, autonomous workflows and multi-step AI systems.",
    heroImage: imageUrl("1526378722484-bd91ca387e72", 1),
  },
  {
    slug: "ai-coding",
    name: "AI Coding",
    description: "Guides and analysis for AI coding assistants, developer workflows and software teams.",
    heroImage: imageUrl("1515879218367-8466d910aaa4", 2),
  },
  {
    slug: "ai-writing",
    name: "AI Writing",
    description: "Editorial guidance for AI writing, content operations, SEO workflows and brand-safe publishing.",
    heroImage: imageUrl("1455390582262-044cdead277a", 3),
  },
  {
    slug: "ai-research",
    name: "AI Research",
    description: "Tools and workflows for research, knowledge management, analysis and evidence gathering.",
    heroImage: imageUrl("1454165804606-c3d57bc86b40", 4),
  },
  {
    slug: "ai-image-generation",
    name: "AI Image Generation",
    description: "Coverage of AI image tools, visual ideation, creative production and design workflows.",
    heroImage: imageUrl("1500530855697-b586d89ba3ee", 5),
  },
  {
    slug: "automation",
    name: "Automation",
    description: "Automation guides for connecting apps, reducing manual work and building reliable processes.",
    heroImage: imageUrl("1516321318423-f06f85e504b3", 6),
  },
  {
    slug: "business-ai",
    name: "Business AI",
    description: "Analysis of AI adoption, productivity systems, operations, sales and decision support.",
    heroImage: imageUrl("1552664730-d307ca884978", 7),
  },
]

const tags = [
  "AI Agents",
  "Automation",
  "Productivity",
  "AI Coding",
  "Developer Tools",
  "AI Writing",
  "SEO",
  "Research",
  "Knowledge Management",
  "Image Generation",
  "Design",
  "Business AI",
  "Marketing",
  "No Code",
  "Data Analysis",
  "Startups",
  "Enterprise AI",
  "Content Strategy",
  "Workflow",
  "Comparison",
  "Reviews",
  "Prompting",
  "Operations",
  "Customer Support",
  "Sales",
].map((name) => ({ slug: slugify(name), name }))

const toolCategories = [
  { slug: "chat-assistants", name: "Chat Assistants" },
  { slug: "coding", name: "Coding" },
  { slug: "writing", name: "Writing" },
  { slug: "research", name: "Research" },
  { slug: "image-video", name: "Image & Video" },
  { slug: "automation", name: "Automation" },
  { slug: "productivity", name: "Productivity" },
  { slug: "business", name: "Business" },
  { slug: "marketing", name: "Marketing" },
  { slug: "data", name: "Data" },
]

const toolData: ToolSeed[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    description: "A general-purpose AI assistant for writing, analysis, brainstorming, coding help and everyday productivity.",
    websiteUrl: "https://chatgpt.com",
    pricing: "Freemium",
    rating: 4.8,
    pros: ["Strong general reasoning", "Wide ecosystem", "Useful for many roles"],
    cons: ["Advanced features require paid plans", "Outputs still require review"],
    bestFor: "General AI assistance, writing, coding support and knowledge work.",
    features: { logoUrl: logoUrl("chatgpt.com"), websiteUrl: "https://chatgpt.com", modes: ["chat", "analysis", "files"] },
    affiliateUrl: "https://chatgpt.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "chat-assistants",
  },
  {
    slug: "claude",
    name: "Claude",
    description: "An AI assistant known for long-context reasoning, drafting, analysis and careful conversational workflows.",
    websiteUrl: "https://claude.ai",
    pricing: "Freemium",
    rating: 4.7,
    pros: ["Excellent long-form writing", "Strong document analysis", "Careful tone"],
    cons: ["Usage limits vary by plan", "Some integrations depend on workspace setup"],
    bestFor: "Long documents, editorial workflows, analysis and thoughtful drafting.",
    features: { logoUrl: logoUrl("claude.ai"), websiteUrl: "https://claude.ai", strengths: ["long context", "writing", "analysis"] },
    affiliateUrl: "https://claude.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "chat-assistants",
  },
  {
    slug: "google-gemini",
    name: "Google Gemini",
    description: "Google’s AI assistant for search-connected reasoning, productivity and multimodal work.",
    websiteUrl: "https://gemini.google.com",
    pricing: "Freemium",
    rating: 4.5,
    pros: ["Strong Google ecosystem fit", "Multimodal capabilities", "Helpful for search-adjacent tasks"],
    cons: ["Feature availability varies", "Best value depends on Google Workspace usage"],
    bestFor: "Google Workspace users and multimodal research workflows.",
    features: { logoUrl: logoUrl("gemini.google.com"), websiteUrl: "https://gemini.google.com", ecosystem: "Google" },
    affiliateUrl: "https://gemini.google.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "chat-assistants",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    description: "An AI answer engine focused on web research, cited summaries and fast topic exploration.",
    websiteUrl: "https://www.perplexity.ai",
    pricing: "Freemium",
    rating: 4.6,
    pros: ["Citation-forward research", "Fast answer discovery", "Useful for market scans"],
    cons: ["Sources still need verification", "Not a replacement for deep primary research"],
    bestFor: "Research briefs, competitive scans and source-backed exploration.",
    features: { logoUrl: logoUrl("perplexity.ai"), websiteUrl: "https://www.perplexity.ai", citationSupport: true },
    affiliateUrl: "https://www.perplexity.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "research",
  },
  {
    slug: "notion-ai",
    name: "Notion AI",
    description: "AI built into Notion for summarizing pages, drafting content, finding answers and improving workspace knowledge.",
    websiteUrl: "https://www.notion.so/product/ai",
    pricing: "Paid add-on",
    rating: 4.5,
    pros: ["Native workspace context", "Good for docs and notes", "Reduces switching tools"],
    cons: ["Best inside Notion", "Value depends on workspace quality"],
    bestFor: "Teams that already manage docs, projects and knowledge in Notion.",
    features: { logoUrl: logoUrl("notion.so"), websiteUrl: "https://www.notion.so/product/ai", workspaceNative: true },
    affiliateUrl: "https://www.notion.so/product/ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "productivity",
  },
  {
    slug: "microsoft-copilot",
    name: "Microsoft Copilot",
    description: "AI assistance across Microsoft 365 apps for drafting, meeting summaries, spreadsheets and workplace productivity.",
    websiteUrl: "https://copilot.microsoft.com",
    pricing: "Paid",
    rating: 4.4,
    pros: ["Deep Microsoft 365 fit", "Useful meeting and document support", "Enterprise controls"],
    cons: ["Most valuable on paid business plans", "Setup quality affects outcomes"],
    bestFor: "Organizations standardized on Microsoft 365.",
    features: { logoUrl: logoUrl("microsoft.com"), websiteUrl: "https://copilot.microsoft.com", ecosystem: "Microsoft 365" },
    affiliateUrl: "https://copilot.microsoft.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "productivity",
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    description: "An AI coding assistant that suggests code, explains logic and helps developers work faster in supported editors.",
    websiteUrl: "https://github.com/features/copilot",
    pricing: "Paid",
    rating: 4.7,
    pros: ["Excellent IDE integration", "Strong autocomplete", "Useful for tests and boilerplate"],
    cons: ["Requires code review", "Quality varies by codebase context"],
    bestFor: "Developers who want AI help directly inside their coding environment.",
    features: { logoUrl: logoUrl("github.com"), websiteUrl: "https://github.com/features/copilot", editorSupport: true },
    affiliateUrl: "https://github.com/features/copilot",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "coding",
  },
  {
    slug: "cursor",
    name: "Cursor",
    description: "An AI-first code editor for editing, understanding and refactoring codebases with project-aware assistance.",
    websiteUrl: "https://www.cursor.com",
    pricing: "Freemium",
    rating: 4.7,
    pros: ["Codebase-aware chat", "Fast refactoring workflows", "Popular with AI-native developers"],
    cons: ["Editor migration may be required", "Review discipline is essential"],
    bestFor: "Developers who want an AI-native coding environment.",
    features: { logoUrl: logoUrl("cursor.com"), websiteUrl: "https://www.cursor.com", codebaseChat: true },
    affiliateUrl: "https://www.cursor.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "coding",
  },
  {
    slug: "windsurf",
    name: "Windsurf",
    description: "An AI coding environment designed for agentic development workflows and multi-file code changes.",
    websiteUrl: "https://windsurf.com",
    pricing: "Freemium",
    rating: 4.4,
    pros: ["Agentic coding flow", "Good for multi-file tasks", "Modern developer experience"],
    cons: ["Requires careful validation", "Plan limits may affect heavy users"],
    bestFor: "Developers testing AI-assisted project editing and refactoring.",
    features: { logoUrl: logoUrl("windsurf.com"), websiteUrl: "https://windsurf.com", agenticCoding: true },
    affiliateUrl: "https://windsurf.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "coding",
  },
  {
    slug: "replit",
    name: "Replit",
    description: "A browser-based development platform with AI assistance for building, testing and deploying small applications.",
    websiteUrl: "https://replit.com",
    pricing: "Freemium",
    rating: 4.3,
    pros: ["Fast browser setup", "Beginner friendly", "Integrated hosting options"],
    cons: ["Complex production apps may outgrow it", "Costs can rise with usage"],
    bestFor: "Prototyping, learning, demos and small web apps.",
    features: { logoUrl: logoUrl("replit.com"), websiteUrl: "https://replit.com", browserIde: true },
    affiliateUrl: "https://replit.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "coding",
  },
  {
    slug: "v0",
    name: "v0",
    description: "Vercel’s AI interface builder for generating React and UI components from natural-language prompts.",
    websiteUrl: "https://v0.dev",
    pricing: "Freemium",
    rating: 4.4,
    pros: ["Fast UI prototyping", "Good React output", "Useful for design-to-code iteration"],
    cons: ["Still needs engineering review", "Best in modern frontend stacks"],
    bestFor: "Frontend prototypes, landing pages and component exploration.",
    features: { logoUrl: logoUrl("v0.dev"), websiteUrl: "https://v0.dev", frontendFocused: true },
    affiliateUrl: "https://v0.dev",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "coding",
  },
  {
    slug: "bolt-new",
    name: "Bolt",
    description: "An AI app-building platform for quickly creating web applications from prompts in a browser environment.",
    websiteUrl: "https://bolt.new",
    pricing: "Freemium",
    rating: 4.3,
    pros: ["Very fast app starts", "Accessible for non-specialists", "Good demo velocity"],
    cons: ["Production hardening still required", "Token limits can matter"],
    bestFor: "MVPs, prototypes and quick web app experiments.",
    features: { logoUrl: logoUrl("bolt.new"), websiteUrl: "https://bolt.new", appGeneration: true },
    affiliateUrl: "https://bolt.new",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "coding",
  },
  {
    slug: "lovable",
    name: "Lovable",
    description: "An AI product builder that helps users generate full-stack app prototypes through conversational prompts.",
    websiteUrl: "https://lovable.dev",
    pricing: "Freemium",
    rating: 4.3,
    pros: ["Strong prototype workflow", "Helpful for founders", "Good visual iteration"],
    cons: ["Complex requirements need developer review", "Generated apps require testing"],
    bestFor: "Startup prototypes, internal tools and product experiments.",
    features: { logoUrl: logoUrl("lovable.dev"), websiteUrl: "https://lovable.dev", productBuilder: true },
    affiliateUrl: "https://lovable.dev",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "coding",
  },
  {
    slug: "jasper",
    name: "Jasper",
    description: "An AI writing and marketing platform for brand-controlled campaigns, content production and team workflows.",
    websiteUrl: "https://www.jasper.ai",
    pricing: "Paid",
    rating: 4.3,
    pros: ["Marketing workflow focus", "Brand voice features", "Team collaboration"],
    cons: ["More expensive than basic writing tools", "Requires editorial process"],
    bestFor: "Marketing teams producing recurring branded content.",
    features: { logoUrl: logoUrl("jasper.ai"), websiteUrl: "https://www.jasper.ai", brandVoice: true },
    affiliateUrl: "https://www.jasper.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "writing",
  },
  {
    slug: "copy-ai",
    name: "Copy.ai",
    description: "A go-to-market AI platform for marketing copy, sales workflows and repeatable content operations.",
    websiteUrl: "https://www.copy.ai",
    pricing: "Freemium",
    rating: 4.2,
    pros: ["Useful templates", "GTM workflow positioning", "Good for repeatable copy tasks"],
    cons: ["Outputs need editing", "Best features are plan-dependent"],
    bestFor: "Marketing and sales teams creating repeatable messaging.",
    features: { logoUrl: logoUrl("copy.ai"), websiteUrl: "https://www.copy.ai", gtmWorkflows: true },
    affiliateUrl: "https://www.copy.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "writing",
  },
  {
    slug: "grammarly",
    name: "Grammarly",
    description: "A writing assistant for grammar, clarity, tone and productivity across documents, email and web apps.",
    websiteUrl: "https://www.grammarly.com",
    pricing: "Freemium",
    rating: 4.5,
    pros: ["Excellent writing polish", "Works across many surfaces", "Easy adoption"],
    cons: ["Advanced tone features are paid", "Not a full content strategy tool"],
    bestFor: "Professionals who write frequently across email, docs and web apps.",
    features: { logoUrl: logoUrl("grammarly.com"), websiteUrl: "https://www.grammarly.com", writingPolish: true },
    affiliateUrl: "https://www.grammarly.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "writing",
  },
  {
    slug: "writesonic",
    name: "Writesonic",
    description: "An AI content platform for articles, ads, SEO copy and marketing workflows.",
    websiteUrl: "https://writesonic.com",
    pricing: "Freemium",
    rating: 4.1,
    pros: ["Broad content features", "SEO-oriented workflows", "Accessible pricing entry"],
    cons: ["Quality varies by prompt", "Editorial review remains necessary"],
    bestFor: "Small teams producing marketing and SEO drafts.",
    features: { logoUrl: logoUrl("writesonic.com"), websiteUrl: "https://writesonic.com", seoWriting: true },
    affiliateUrl: "https://writesonic.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "writing",
  },
  {
    slug: "surfer-seo",
    name: "Surfer SEO",
    description: "A content optimization platform for planning, writing and improving search-focused editorial pages.",
    websiteUrl: "https://surferseo.com",
    pricing: "Paid",
    rating: 4.2,
    pros: ["Helpful content briefs", "SERP-informed recommendations", "Good editorial workflow"],
    cons: ["Can encourage over-optimization if misused", "Not a substitute for expertise"],
    bestFor: "SEO teams creating structured content briefs and optimization workflows.",
    features: { logoUrl: logoUrl("surferseo.com"), websiteUrl: "https://surferseo.com", seoOptimization: true },
    affiliateUrl: "https://surferseo.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "marketing",
  },
  {
    slug: "frase",
    name: "Frase",
    description: "An SEO content tool for researching search intent, building briefs and drafting optimized articles.",
    websiteUrl: "https://www.frase.io",
    pricing: "Paid",
    rating: 4.1,
    pros: ["Strong brief generation", "Useful competitor summaries", "Good for content teams"],
    cons: ["Requires strategic judgment", "Interface can feel dense"],
    bestFor: "Content teams building topic briefs and search-driven outlines.",
    features: { logoUrl: logoUrl("frase.io"), websiteUrl: "https://www.frase.io", contentBriefs: true },
    affiliateUrl: "https://www.frase.io",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "marketing",
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    description: "An AI image generation tool known for stylized, polished and visually distinctive creative output.",
    websiteUrl: "https://www.midjourney.com",
    pricing: "Paid",
    rating: 4.7,
    pros: ["High visual quality", "Strong artistic styles", "Great ideation tool"],
    cons: ["Prompt learning curve", "Workflow may not suit every production team"],
    bestFor: "Creative ideation, concept art, editorial visuals and moodboards.",
    features: { logoUrl: logoUrl("midjourney.com"), websiteUrl: "https://www.midjourney.com", imageGeneration: true },
    affiliateUrl: "https://www.midjourney.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "image-video",
  },
  {
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    description: "Adobe’s generative AI suite for commercially safer image creation and creative workflow integration.",
    websiteUrl: "https://www.adobe.com/products/firefly.html",
    pricing: "Freemium",
    rating: 4.4,
    pros: ["Adobe ecosystem integration", "Commercially oriented positioning", "Good design workflow fit"],
    cons: ["Best value for Adobe users", "Creative range differs from other tools"],
    bestFor: "Design teams already using Adobe Creative Cloud.",
    features: { logoUrl: logoUrl("adobe.com"), websiteUrl: "https://www.adobe.com/products/firefly.html", creativeCloud: true },
    affiliateUrl: "https://www.adobe.com/products/firefly.html",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "image-video",
  },
  {
    slug: "canva",
    name: "Canva",
    description: "A visual design platform with AI features for social graphics, presentations, documents and brand assets.",
    websiteUrl: "https://www.canva.com",
    pricing: "Freemium",
    rating: 4.6,
    pros: ["Easy for non-designers", "Large template library", "Useful AI design features"],
    cons: ["Advanced brand workflows may need paid plans", "Less flexible than pro design suites"],
    bestFor: "Teams creating everyday marketing visuals quickly.",
    features: { logoUrl: logoUrl("canva.com"), websiteUrl: "https://www.canva.com", templates: true },
    affiliateUrl: "https://www.canva.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "image-video",
  },
  {
    slug: "runway",
    name: "Runway",
    description: "A generative video and creative AI platform for producing, editing and experimenting with moving visuals.",
    websiteUrl: "https://runwayml.com",
    pricing: "Freemium",
    rating: 4.4,
    pros: ["Strong video generation", "Creative editing tools", "Useful for concept development"],
    cons: ["Output control can vary", "Credits and rendering costs matter"],
    bestFor: "Video concepts, creative campaigns and experimental media production.",
    features: { logoUrl: logoUrl("runwayml.com"), websiteUrl: "https://runwayml.com", videoGeneration: true },
    affiliateUrl: "https://runwayml.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "image-video",
  },
  {
    slug: "leonardo-ai",
    name: "Leonardo AI",
    description: "An AI creative platform for image generation, game assets, product visuals and design exploration.",
    websiteUrl: "https://leonardo.ai",
    pricing: "Freemium",
    rating: 4.3,
    pros: ["Strong creative controls", "Useful asset workflows", "Good style exploration"],
    cons: ["Interface has many options", "Commercial review still required"],
    bestFor: "Designers, game creators and visual teams exploring AI assets.",
    features: { logoUrl: logoUrl("leonardo.ai"), websiteUrl: "https://leonardo.ai", creativeAssets: true },
    affiliateUrl: "https://leonardo.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "image-video",
  },
  {
    slug: "ideogram",
    name: "Ideogram",
    description: "An AI image generator with strong text rendering capabilities for posters, graphics and branded concepts.",
    websiteUrl: "https://ideogram.ai",
    pricing: "Freemium",
    rating: 4.2,
    pros: ["Better text-in-image workflows", "Good for posters and concepts", "Simple interface"],
    cons: ["Not perfect for all typography", "Requires brand review"],
    bestFor: "Social graphics, poster concepts and image ideas with readable text.",
    features: { logoUrl: logoUrl("ideogram.ai"), websiteUrl: "https://ideogram.ai", textRendering: true },
    affiliateUrl: "https://ideogram.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "image-video",
  },
  {
    slug: "zapier",
    name: "Zapier",
    description: "A no-code automation platform for connecting apps, moving data and building repeatable business workflows.",
    websiteUrl: "https://zapier.com",
    pricing: "Freemium",
    rating: 4.6,
    pros: ["Huge app ecosystem", "Accessible no-code setup", "Strong automation templates"],
    cons: ["Complex workflows can get costly", "Debugging requires process discipline"],
    bestFor: "Small and mid-sized teams automating app-to-app workflows.",
    features: { logoUrl: logoUrl("zapier.com"), websiteUrl: "https://zapier.com", appIntegrations: true },
    affiliateUrl: "https://zapier.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "automation",
  },
  {
    slug: "make",
    name: "Make",
    description: "A visual automation platform for building multi-step workflows, integrations and operational systems.",
    websiteUrl: "https://www.make.com",
    pricing: "Freemium",
    rating: 4.5,
    pros: ["Powerful visual builder", "Flexible scenarios", "Good for complex automations"],
    cons: ["Learning curve", "Requires careful error handling"],
    bestFor: "Operations teams building more customized no-code automations.",
    features: { logoUrl: logoUrl("make.com"), websiteUrl: "https://www.make.com", visualAutomation: true },
    affiliateUrl: "https://www.make.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "automation",
  },
  {
    slug: "n8n",
    name: "n8n",
    description: "A workflow automation platform for technical teams that need flexible integrations and self-hosting options.",
    websiteUrl: "https://n8n.io",
    pricing: "Freemium",
    rating: 4.5,
    pros: ["Developer-friendly", "Self-hosting option", "Flexible workflow logic"],
    cons: ["More technical than basic no-code tools", "Maintenance matters when self-hosted"],
    bestFor: "Technical operations teams and builders who want control over automation.",
    features: { logoUrl: logoUrl("n8n.io"), websiteUrl: "https://n8n.io", selfHosting: true },
    affiliateUrl: "https://n8n.io",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "automation",
  },
  {
    slug: "airtable",
    name: "Airtable",
    description: "A flexible database and workflow platform for managing structured information, approvals and lightweight apps.",
    websiteUrl: "https://www.airtable.com",
    pricing: "Freemium",
    rating: 4.4,
    pros: ["Flexible database views", "Good team workflows", "Useful automation layer"],
    cons: ["Can become messy without governance", "Advanced scale requires paid plans"],
    bestFor: "Teams building operational databases and lightweight internal workflows.",
    features: { logoUrl: logoUrl("airtable.com"), websiteUrl: "https://www.airtable.com", databaseWorkflows: true },
    affiliateUrl: "https://www.airtable.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "automation",
  },
  {
    slug: "bardeen",
    name: "Bardeen",
    description: "An AI automation tool for browser-based workflows, sales research and repetitive web tasks.",
    websiteUrl: "https://www.bardeen.ai",
    pricing: "Freemium",
    rating: 4.1,
    pros: ["Useful browser automations", "Good for prospecting workflows", "Fast setup for repetitive tasks"],
    cons: ["Browser-dependent workflows can break", "Needs careful data review"],
    bestFor: "Sales, recruiting and research teams automating browser tasks.",
    features: { logoUrl: logoUrl("bardeen.ai"), websiteUrl: "https://www.bardeen.ai", browserAutomation: true },
    affiliateUrl: "https://www.bardeen.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "automation",
  },
  {
    slug: "relay-app",
    name: "Relay.app",
    description: "A workflow automation tool combining human approvals, AI steps and app integrations.",
    websiteUrl: "https://www.relay.app",
    pricing: "Freemium",
    rating: 4.2,
    pros: ["Human-in-the-loop workflows", "Modern interface", "Good approval patterns"],
    cons: ["Smaller ecosystem than older platforms", "Best for defined processes"],
    bestFor: "Teams that need automations with review steps and approvals.",
    features: { logoUrl: logoUrl("relay.app"), websiteUrl: "https://www.relay.app", humanInLoop: true },
    affiliateUrl: "https://www.relay.app",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "automation",
  },
  {
    slug: "otter-ai",
    name: "Otter.ai",
    description: "An AI meeting assistant for transcription, summaries, action items and searchable conversation records.",
    websiteUrl: "https://otter.ai",
    pricing: "Freemium",
    rating: 4.2,
    pros: ["Good meeting capture", "Searchable transcripts", "Useful action summaries"],
    cons: ["Accuracy depends on audio quality", "Privacy policy should be reviewed"],
    bestFor: "Teams that need searchable meeting notes and follow-up summaries.",
    features: { logoUrl: logoUrl("otter.ai"), websiteUrl: "https://otter.ai", meetingTranscription: true },
    affiliateUrl: "https://otter.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "productivity",
  },
  {
    slug: "fireflies-ai",
    name: "Fireflies.ai",
    description: "An AI meeting assistant for recording, transcribing and analyzing calls across common meeting platforms.",
    websiteUrl: "https://fireflies.ai",
    pricing: "Freemium",
    rating: 4.2,
    pros: ["Broad meeting platform support", "Conversation search", "Useful team notes"],
    cons: ["Requires consent-aware usage", "Summaries need review for nuance"],
    bestFor: "Sales, recruiting and customer teams with recurring calls.",
    features: { logoUrl: logoUrl("fireflies.ai"), websiteUrl: "https://fireflies.ai", callAnalysis: true },
    affiliateUrl: "https://fireflies.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "productivity",
  },
  {
    slug: "fathom",
    name: "Fathom",
    description: "An AI note-taking tool for meetings, call summaries and follow-up workflows.",
    websiteUrl: "https://fathom.video",
    pricing: "Freemium",
    rating: 4.3,
    pros: ["Simple meeting summaries", "Useful highlights", "Good individual productivity fit"],
    cons: ["Team features vary by plan", "Requires meeting recording norms"],
    bestFor: "Professionals who want fast call notes without manual transcription.",
    features: { logoUrl: logoUrl("fathom.video"), websiteUrl: "https://fathom.video", meetingNotes: true },
    affiliateUrl: "https://fathom.video",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "productivity",
  },
  {
    slug: "mem",
    name: "Mem",
    description: "An AI note-taking and knowledge tool focused on capturing ideas and resurfacing useful information.",
    websiteUrl: "https://get.mem.ai",
    pricing: "Paid",
    rating: 4.0,
    pros: ["AI-assisted knowledge retrieval", "Good personal notes concept", "Minimal capture friction"],
    cons: ["Best for committed note-takers", "Team knowledge needs structure"],
    bestFor: "Individuals building an AI-assisted personal knowledge system.",
    features: { logoUrl: logoUrl("get.mem.ai"), websiteUrl: "https://get.mem.ai", personalKnowledge: true },
    affiliateUrl: "https://get.mem.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "productivity",
  },
  {
    slug: "tana",
    name: "Tana",
    description: "A structured note-taking workspace with AI features for knowledge graphs, tasks and connected notes.",
    websiteUrl: "https://tana.inc",
    pricing: "Paid",
    rating: 4.1,
    pros: ["Powerful structured notes", "Flexible knowledge graph", "Good for advanced users"],
    cons: ["Learning curve", "Can feel complex for simple notes"],
    bestFor: "Power users building structured knowledge and task systems.",
    features: { logoUrl: logoUrl("tana.inc"), websiteUrl: "https://tana.inc", structuredNotes: true },
    affiliateUrl: "https://tana.inc",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "productivity",
  },
  {
    slug: "linear",
    name: "Linear",
    description: "A product development and issue tracking platform with AI-assisted workflows for modern software teams.",
    websiteUrl: "https://linear.app",
    pricing: "Freemium",
    rating: 4.5,
    pros: ["Fast product workflow", "Clean interface", "Strong engineering team fit"],
    cons: ["Less suited to traditional project management", "Best with disciplined issue hygiene"],
    bestFor: "Product and engineering teams managing focused software work.",
    features: { logoUrl: logoUrl("linear.app"), websiteUrl: "https://linear.app", issueTracking: true },
    affiliateUrl: "https://linear.app",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "productivity",
  },
  {
    slug: "figma-ai",
    name: "Figma AI",
    description: "AI features inside Figma for design exploration, content generation and faster interface iteration.",
    websiteUrl: "https://www.figma.com/ai",
    pricing: "Paid",
    rating: 4.3,
    pros: ["Native design workflow", "Useful ideation support", "Strong collaboration"],
    cons: ["Best for Figma users", "AI output needs design review"],
    bestFor: "Product designers and teams already collaborating in Figma.",
    features: { logoUrl: logoUrl("figma.com"), websiteUrl: "https://www.figma.com/ai", designNative: true },
    affiliateUrl: "https://www.figma.com/ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "image-video",
  },
  {
    slug: "descript",
    name: "Descript",
    description: "An AI-powered audio and video editing platform built around transcription, overdub and fast content editing.",
    websiteUrl: "https://www.descript.com",
    pricing: "Freemium",
    rating: 4.4,
    pros: ["Text-based editing", "Great for podcasts and videos", "Useful AI cleanup tools"],
    cons: ["Advanced usage needs paid plan", "Final edits still need human polish"],
    bestFor: "Podcasters, educators and video teams editing spoken content.",
    features: { logoUrl: logoUrl("descript.com"), websiteUrl: "https://www.descript.com", textBasedEditing: true },
    affiliateUrl: "https://www.descript.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "image-video",
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    description: "An AI voice platform for voice generation, dubbing and audio localization workflows.",
    websiteUrl: "https://elevenlabs.io",
    pricing: "Freemium",
    rating: 4.5,
    pros: ["High-quality voices", "Useful dubbing workflows", "Developer API available"],
    cons: ["Responsible voice use is essential", "Costs scale with usage"],
    bestFor: "Creators and teams producing voiceovers, narration and localized audio.",
    features: { logoUrl: logoUrl("elevenlabs.io"), websiteUrl: "https://elevenlabs.io", voiceGeneration: true },
    affiliateUrl: "https://elevenlabs.io",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: true,
    categorySlug: "image-video",
  },
  {
    slug: "synthesia",
    name: "Synthesia",
    description: "An AI video generation platform for creating presenter-style training, onboarding and business videos.",
    websiteUrl: "https://www.synthesia.io",
    pricing: "Paid",
    rating: 4.3,
    pros: ["Business video workflow", "Useful avatars", "Good for training content"],
    cons: ["Not suited to every brand tone", "Script quality drives results"],
    bestFor: "Training, enablement and internal communications teams.",
    features: { logoUrl: logoUrl("synthesia.io"), websiteUrl: "https://www.synthesia.io", avatarVideo: true },
    affiliateUrl: "https://www.synthesia.io",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "image-video",
  },
  {
    slug: "pika",
    name: "Pika",
    description: "An AI video generation tool for creating short visual clips, motion experiments and creative concepts.",
    websiteUrl: "https://pika.art",
    pricing: "Freemium",
    rating: 4.1,
    pros: ["Fast short video concepts", "Accessible creative workflow", "Good experimentation"],
    cons: ["Consistency can vary", "Commercial workflow needs review"],
    bestFor: "Creators testing short-form AI video ideas.",
    features: { logoUrl: logoUrl("pika.art"), websiteUrl: "https://pika.art", shortVideo: true },
    affiliateUrl: "https://pika.art",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "image-video",
  },
  {
    slug: "gong",
    name: "Gong",
    description: "A revenue intelligence platform that analyzes sales conversations, pipeline activity and customer interactions.",
    websiteUrl: "https://www.gong.io",
    pricing: "Paid",
    rating: 4.4,
    pros: ["Strong sales insights", "Conversation intelligence", "Enterprise revenue workflows"],
    cons: ["Requires sales process maturity", "Pricing is not ideal for very small teams"],
    bestFor: "Sales organizations improving pipeline visibility and coaching.",
    features: { logoUrl: logoUrl("gong.io"), websiteUrl: "https://www.gong.io", revenueIntelligence: true },
    affiliateUrl: "https://www.gong.io",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "business",
  },
  {
    slug: "intercom-fin",
    name: "Intercom Fin",
    description: "An AI customer support agent built into Intercom for resolving support questions and escalating complex issues.",
    websiteUrl: "https://www.intercom.com/fin",
    pricing: "Paid",
    rating: 4.3,
    pros: ["Native support workflow", "Good escalation patterns", "Strong help-center integration"],
    cons: ["Requires clean support content", "Costs depend on resolution volume"],
    bestFor: "Support teams using Intercom and maintaining strong documentation.",
    features: { logoUrl: logoUrl("intercom.com"), websiteUrl: "https://www.intercom.com/fin", supportAgent: true },
    affiliateUrl: "https://www.intercom.com/fin",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "business",
  },
  {
    slug: "zendesk-ai",
    name: "Zendesk AI",
    description: "AI features for Zendesk support teams, including automated answers, agent assistance and ticket insights.",
    websiteUrl: "https://www.zendesk.com/ai",
    pricing: "Paid",
    rating: 4.2,
    pros: ["Enterprise support fit", "Agent productivity features", "Works with ticket history"],
    cons: ["Best for Zendesk customers", "Requires support content governance"],
    bestFor: "Support organizations operating on Zendesk.",
    features: { logoUrl: logoUrl("zendesk.com"), websiteUrl: "https://www.zendesk.com/ai", customerSupport: true },
    affiliateUrl: "https://www.zendesk.com/ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "business",
  },
  {
    slug: "hubspot-ai",
    name: "HubSpot AI",
    description: "AI tools inside HubSpot for marketing, sales, service content and CRM productivity.",
    websiteUrl: "https://www.hubspot.com/artificial-intelligence",
    pricing: "Paid",
    rating: 4.2,
    pros: ["CRM-native workflows", "Useful for GTM teams", "Broad marketing and sales fit"],
    cons: ["Best for HubSpot customers", "Plan tiers affect access"],
    bestFor: "Go-to-market teams already using HubSpot CRM.",
    features: { logoUrl: logoUrl("hubspot.com"), websiteUrl: "https://www.hubspot.com/artificial-intelligence", crmNative: true },
    affiliateUrl: "https://www.hubspot.com/artificial-intelligence",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "business",
  },
  {
    slug: "salesforce-einstein",
    name: "Salesforce Einstein",
    description: "Salesforce’s AI layer for CRM insights, sales assistance, service automation and enterprise workflows.",
    websiteUrl: "https://www.salesforce.com/artificial-intelligence",
    pricing: "Paid",
    rating: 4.2,
    pros: ["Enterprise CRM integration", "Broad AI capabilities", "Strong governance options"],
    cons: ["Complex setup", "Best for Salesforce-heavy organizations"],
    bestFor: "Large teams using Salesforce as their central CRM platform.",
    features: { logoUrl: logoUrl("salesforce.com"), websiteUrl: "https://www.salesforce.com/artificial-intelligence", enterpriseCrm: true },
    affiliateUrl: "https://www.salesforce.com/artificial-intelligence",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "business",
  },
  {
    slug: "tableau-pulse",
    name: "Tableau Pulse",
    description: "AI-powered analytics features in Tableau that surface metrics, insights and business data narratives.",
    websiteUrl: "https://www.tableau.com/products/tableau-pulse",
    pricing: "Paid",
    rating: 4.1,
    pros: ["Business intelligence fit", "Metric monitoring", "Useful narrative insights"],
    cons: ["Requires data quality", "Best in Tableau ecosystem"],
    bestFor: "Analytics teams standardizing metrics and business insight workflows.",
    features: { logoUrl: logoUrl("tableau.com"), websiteUrl: "https://www.tableau.com/products/tableau-pulse", biInsights: true },
    affiliateUrl: "https://www.tableau.com/products/tableau-pulse",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "data",
  },
  {
    slug: "power-bi-copilot",
    name: "Power BI Copilot",
    description: "AI assistance for Power BI users creating reports, exploring data and generating business insights.",
    websiteUrl: "https://powerbi.microsoft.com",
    pricing: "Paid",
    rating: 4.1,
    pros: ["Microsoft analytics fit", "Helpful report assistance", "Good enterprise adoption path"],
    cons: ["Requires clean semantic models", "Licensing can be complex"],
    bestFor: "Microsoft-centric analytics and business intelligence teams.",
    features: { logoUrl: logoUrl("microsoft.com"), websiteUrl: "https://powerbi.microsoft.com", analyticsCopilot: true },
    affiliateUrl: "https://powerbi.microsoft.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "data",
  },
  {
    slug: "hex",
    name: "Hex",
    description: "A collaborative analytics workspace with notebooks, apps and AI features for data teams.",
    websiteUrl: "https://hex.tech",
    pricing: "Freemium",
    rating: 4.3,
    pros: ["Great collaborative notebooks", "Useful data apps", "Strong analytics workflow"],
    cons: ["Technical users get the most value", "Requires data stack integration"],
    bestFor: "Data teams building analysis, dashboards and internal data apps.",
    features: { logoUrl: logoUrl("hex.tech"), websiteUrl: "https://hex.tech", collaborativeAnalytics: true },
    affiliateUrl: "https://hex.tech",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "data",
  },
  {
    slug: "julius-ai",
    name: "Julius AI",
    description: "An AI data analysis assistant for exploring spreadsheets, creating charts and asking questions about datasets.",
    websiteUrl: "https://julius.ai",
    pricing: "Freemium",
    rating: 4.1,
    pros: ["Accessible data analysis", "Good spreadsheet exploration", "Helpful charting"],
    cons: ["Sensitive data needs care", "Complex analysis requires validation"],
    bestFor: "Non-technical users exploring datasets and spreadsheets.",
    features: { logoUrl: logoUrl("julius.ai"), websiteUrl: "https://julius.ai", spreadsheetAnalysis: true },
    affiliateUrl: "https://julius.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "data",
  },
  {
    slug: "rows",
    name: "Rows",
    description: "A modern spreadsheet with integrations and AI features for analysis, reporting and lightweight operations.",
    websiteUrl: "https://rows.com",
    pricing: "Freemium",
    rating: 4.1,
    pros: ["Spreadsheet familiarity", "Good integrations", "Useful AI formulas and analysis"],
    cons: ["Not a full BI replacement", "Team workflows need structure"],
    bestFor: "Teams combining spreadsheet workflows with integrations and AI.",
    features: { logoUrl: logoUrl("rows.com"), websiteUrl: "https://rows.com", aiSpreadsheet: true },
    affiliateUrl: "https://rows.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "data",
  },
  {
    slug: "beautiful-ai",
    name: "Beautiful.ai",
    description: "An AI-assisted presentation platform for creating polished decks with smart layouts and brand consistency.",
    websiteUrl: "https://www.beautiful.ai",
    pricing: "Paid",
    rating: 4.1,
    pros: ["Fast slide creation", "Clean templates", "Good business presentation fit"],
    cons: ["Less flexible than manual design tools", "Paid plans needed for teams"],
    bestFor: "Business teams creating polished presentations quickly.",
    features: { logoUrl: logoUrl("beautiful.ai"), websiteUrl: "https://www.beautiful.ai", presentations: true },
    affiliateUrl: "https://www.beautiful.ai",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "business",
  },
  {
    slug: "gamma",
    name: "Gamma",
    description: "An AI presentation and document builder for creating narrative decks, microsites and visual briefs.",
    websiteUrl: "https://gamma.app",
    pricing: "Freemium",
    rating: 4.3,
    pros: ["Fast narrative decks", "Modern visual output", "Useful for briefs and proposals"],
    cons: ["Brand customization may need tuning", "Not ideal for every corporate template"],
    bestFor: "Founders, consultants and teams creating visual narratives quickly.",
    features: { logoUrl: logoUrl("gamma.app"), websiteUrl: "https://gamma.app", aiPresentations: true },
    affiliateUrl: "https://gamma.app",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "business",
  },
  {
    slug: "typeform",
    name: "Typeform",
    description: "A form and survey platform with AI-assisted form creation for research, feedback and lead capture.",
    websiteUrl: "https://www.typeform.com",
    pricing: "Freemium",
    rating: 4.2,
    pros: ["Excellent form experience", "Good templates", "Useful for research and marketing"],
    cons: ["Advanced responses require paid plans", "Not a full research platform"],
    bestFor: "Teams collecting structured feedback, leads and survey responses.",
    features: { logoUrl: logoUrl("typeform.com"), websiteUrl: "https://www.typeform.com", forms: true },
    affiliateUrl: "https://www.typeform.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "marketing",
  },
  {
    slug: "semrush",
    name: "Semrush",
    description: "A marketing intelligence platform for SEO research, content planning, competitive analysis and reporting.",
    websiteUrl: "https://www.semrush.com",
    pricing: "Paid",
    rating: 4.4,
    pros: ["Broad SEO toolkit", "Competitive research", "Strong reporting"],
    cons: ["Can be expensive", "Data requires interpretation"],
    bestFor: "Marketing teams managing SEO, content and competitive research.",
    features: { logoUrl: logoUrl("semrush.com"), websiteUrl: "https://www.semrush.com", seoSuite: true },
    affiliateUrl: "https://www.semrush.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "marketing",
  },
  {
    slug: "ahrefs",
    name: "Ahrefs",
    description: "An SEO platform for backlink analysis, keyword research, competitor monitoring and content planning.",
    websiteUrl: "https://ahrefs.com",
    pricing: "Paid",
    rating: 4.5,
    pros: ["Excellent backlink data", "Strong keyword research", "Reliable SEO workflows"],
    cons: ["Paid-only for serious use", "Requires SEO knowledge"],
    bestFor: "SEO professionals and editorial teams building organic search strategy.",
    features: { logoUrl: logoUrl("ahrefs.com"), websiteUrl: "https://ahrefs.com", backlinkResearch: true },
    affiliateUrl: "https://ahrefs.com",
    affiliateDisclosure: "Nexora may earn a commission from qualifying partner links when available.",
    lastReviewedAt: reviewedAt,
    featured: false,
    categorySlug: "marketing",
  },
]

const articlePlans = [
  ["ai-agents", "Practical AI Agent Workflows That Actually Save Time", "A field guide to agent workflows that reduce manual work without creating fragile automation.", "AI agents are most useful when they handle bounded, repeatable work with clear review points rather than vague end-to-end promises.", ["Agent Scope", "Reliable Handoffs", "Human Review"], ["chatgpt", "claude", "zapier"], ["AI Agents", "Automation", "Workflow"]],
  ["ai-agents", "How to Evaluate an AI Agent Before You Trust It", "A practical checklist for testing autonomy, reliability and risk before adding AI agents to real operations.", "Before an AI agent touches production work, teams need to understand what it can decide, what it can change and when it should stop.", ["Define Permissions", "Test Failure Modes", "Measure Outcomes"], ["claude", "notion-ai", "n8n"], ["AI Agents", "Enterprise AI", "Operations"]],
  ["ai-agents", "AI Agents vs Automations: What Teams Should Use", "A clear comparison of classic automation and agentic workflows for business teams.", "Automation and agents overlap, but they are not the same. Choosing the wrong pattern can make simple work harder to maintain.", ["When Automation Wins", "When Agents Help", "Governance Questions"], ["zapier", "make", "relay-app"], ["AI Agents", "Automation", "Comparison"]],
  ["ai-agents", "The Human-in-the-Loop AI Agent Playbook", "How to design AI workflows that keep humans involved at the right moments.", "The most durable AI systems do not remove human judgment; they reserve it for decisions that truly require context and accountability.", ["Approval Gates", "Escalation Paths", "Audit Trails"], ["relay-app", "intercom-fin", "zendesk-ai"], ["AI Agents", "Operations", "Workflow"]],
  ["ai-agents", "Building AI Agents for Content Operations", "How editorial teams can use agents for briefs, refreshes and quality checks without publishing thin content.", "Content agents should support editorial judgment, not replace it. The best setups combine structured inputs with clear review standards.", ["Brief Generation", "Content Refreshes", "Quality Controls"], ["jasper", "copy-ai", "notion-ai"], ["AI Agents", "Content Strategy", "SEO"]],
  ["ai-agents", "AI Agent Safety for Small Teams", "Simple operating rules for using AI agents responsibly in lean companies.", "Small teams can benefit from agents, but they need boundaries around credentials, customer data, payments and public publishing.", ["Access Boundaries", "Dry Runs", "Incident Recovery"], ["n8n", "make", "chatgpt"], ["AI Agents", "Startups", "Operations"]],
  ["ai-coding", "Best AI Coding Workflows for Production Teams", "How engineering teams can use AI coding tools without weakening review, testing or architecture standards.", "AI coding tools are valuable when they accelerate known engineering practices instead of bypassing them.", ["Code Review", "Testing Discipline", "Refactoring Workflows"], ["github-copilot", "cursor", "windsurf"], ["AI Coding", "Developer Tools", "Productivity"]],
  ["ai-coding", "Cursor vs GitHub Copilot for Everyday Development", "A practical comparison of two popular AI coding workflows for modern software teams.", "Choosing an AI coding assistant is less about raw suggestions and more about how the tool fits your editor, repo and review process.", ["Editor Experience", "Codebase Context", "Team Adoption"], ["cursor", "github-copilot", "linear"], ["AI Coding", "Comparison", "Developer Tools"]],
  ["ai-coding", "Using AI to Refactor Code Without Creating Risk", "A careful approach to AI-assisted refactoring across real codebases.", "AI can speed up refactoring, but safe refactors still need small scopes, tests and understandable diffs.", ["Set Boundaries", "Ask for Small Diffs", "Validate Behavior"], ["cursor", "windsurf", "github-copilot"], ["AI Coding", "Developer Tools", "Workflow"]],
  ["ai-coding", "AI App Builders: Where They Help and Where They Break", "An honest guide to app-generation tools for prototypes, MVPs and production handoff.", "AI app builders are excellent for learning and prototyping, but production readiness still depends on architecture, security and maintenance.", ["Prototype Speed", "Production Gaps", "Handoff Checklist"], ["bolt-new", "lovable", "replit"], ["AI Coding", "Startups", "No Code"]],
  ["ai-coding", "Prompting AI Coding Tools Like a Senior Engineer", "How to give coding assistants context that leads to smaller, safer and more useful changes.", "Good AI coding prompts read like good engineering tickets: clear scope, constraints, acceptance criteria and known risks.", ["Context Blocks", "Acceptance Criteria", "Review Prompts"], ["github-copilot", "cursor", "v0"], ["AI Coding", "Prompting", "Developer Tools"]],
  ["ai-coding", "AI Frontend Tools for Faster UI Prototypes", "How frontend teams can use AI tools to explore layouts, components and interaction ideas.", "AI frontend tools are strongest when teams use them for iteration and exploration, then apply design and engineering standards before release.", ["Component Drafts", "Design Constraints", "Production Cleanup"], ["v0", "figma-ai", "canva"], ["AI Coding", "Design", "Developer Tools"]],
  ["ai-writing", "AI Writing Workflows That Do Not Produce Thin Content", "A reader-first process for using AI writing tools without sacrificing originality or usefulness.", "AI writing works best as an editorial assistant for structure, research organization and revision rather than a shortcut to generic articles.", ["Editorial Inputs", "Human Examples", "Revision Standards"], ["jasper", "grammarly", "copy-ai"], ["AI Writing", "Content Strategy", "SEO"]],
  ["ai-writing", "How to Build Brand Voice Into AI Content Tools", "A practical framework for making AI-assisted writing sound consistent and credible.", "Brand voice is not a magic prompt. It is a set of examples, rules and editorial decisions that guide every draft.", ["Voice Guidelines", "Example Libraries", "Review Loops"], ["jasper", "copy-ai", "grammarly"], ["AI Writing", "Marketing", "Content Strategy"]],
  ["ai-writing", "SEO Content in the AI Era: What Still Works", "How to create search content that remains useful, differentiated and AdSense-safe.", "Search-friendly content still depends on helpful information, clear structure and honest intent. AI does not remove that requirement.", ["Search Intent", "Helpful Structure", "Avoiding Filler"], ["surfer-seo", "frase", "semrush"], ["SEO", "AI Writing", "Marketing"]],
  ["ai-writing", "AI Editing Checklist for Publishers", "A practical checklist for reviewing AI-assisted drafts before publication.", "AI-assisted editorial teams need a repeatable review process for accuracy, originality, tone and reader value.", ["Accuracy Review", "Originality Review", "Tone Review"], ["grammarly", "notion-ai", "claude"], ["AI Writing", "Content Strategy", "Productivity"]],
  ["ai-writing", "Best AI Tools for Marketing Copy Workflows", "How marketers can combine AI tools for campaigns, landing pages, ads and email drafts.", "Marketing teams get better results when they map AI tools to specific campaign stages rather than asking one tool to do everything.", ["Campaign Briefs", "Copy Variants", "Final Approval"], ["copy-ai", "jasper", "writesonic"], ["AI Writing", "Marketing", "Workflow"]],
  ["ai-writing", "How to Refresh Old Articles With AI Assistance", "A responsible process for updating older content without losing trust or editorial quality.", "Refreshing articles with AI should improve accuracy, clarity and usefulness. It should not inflate word count for its own sake.", ["Content Audit", "Update Strategy", "Quality Review"], ["frase", "surfer-seo", "notion-ai"], ["AI Writing", "SEO", "Content Strategy"]],
  ["ai-research", "AI Research Workflows for Better Decisions", "How to use AI research tools for faster briefs while keeping source quality high.", "AI research tools can compress discovery time, but good decisions still require source checking, context and careful synthesis.", ["Source Triangulation", "Research Notes", "Decision Briefs"], ["perplexity", "claude", "notion-ai"], ["Research", "Business AI", "Knowledge Management"]],
  ["ai-research", "Perplexity, ChatGPT and Claude for Research", "A practical comparison of popular AI tools for research-heavy knowledge work.", "Each major assistant has a different research profile. The right choice depends on source needs, document depth and synthesis quality.", ["Source Discovery", "Document Analysis", "Synthesis Quality"], ["perplexity", "chatgpt", "claude"], ["Research", "Comparison", "Productivity"]],
  ["ai-research", "How to Turn Research Notes Into Useful Briefs", "A workflow for moving from scattered sources to clear, decision-ready research briefs.", "The output of research should not be a pile of links. It should help a reader understand options, tradeoffs and next steps.", ["Organize Evidence", "Write Findings", "State Uncertainty"], ["notion-ai", "perplexity", "mem"], ["Research", "Knowledge Management", "Productivity"]],
  ["ai-research", "AI Tools for Market and Competitor Research", "How startups and operators can use AI for market scans without fabricating certainty.", "Market research with AI is useful for mapping the field, but teams should avoid treating generated summaries as verified market truth.", ["Market Mapping", "Competitor Profiles", "Validation Steps"], ["perplexity", "semrush", "ahrefs"], ["Research", "Startups", "Marketing"]],
  ["ai-research", "Building a Personal AI Knowledge System", "How to combine notes, search and AI summaries into a useful personal knowledge workflow.", "A good knowledge system helps you retrieve context when needed. AI makes that easier, but structure still matters.", ["Capture Rules", "Retrieval Habits", "Review Cadence"], ["mem", "tana", "notion-ai"], ["Knowledge Management", "Productivity", "Research"]],
  ["ai-research", "AI Data Analysis for Non-Technical Teams", "A practical guide to using AI tools with spreadsheets and business data responsibly.", "AI can help non-technical teams explore data, but results should be checked against definitions, source tables and business context.", ["Prepare Data", "Ask Better Questions", "Validate Charts"], ["julius-ai", "rows", "hex"], ["Data Analysis", "Business AI", "Research"]],
  ["ai-image-generation", "Choosing the Right AI Image Generator", "A practical guide to matching image tools with editorial, design and campaign needs.", "AI image tools vary widely in style, control, licensing posture and workflow fit. The best choice depends on the job.", ["Visual Quality", "Control Needs", "Commercial Review"], ["midjourney", "adobe-firefly", "leonardo-ai"], ["Image Generation", "Design", "Reviews"]],
  ["ai-image-generation", "AI Images for Editorial Sites Without Clickbait", "How publishers can use AI visuals that support the article instead of misleading readers.", "AI-generated editorial images should create context and curiosity without pretending to document real events.", ["Image Relevance", "Disclosure Norms", "Avoiding Misleading Visuals"], ["canva", "adobe-firefly", "ideogram"], ["Image Generation", "Content Strategy", "Design"]],
  ["ai-image-generation", "Midjourney vs Adobe Firefly for Creative Teams", "A balanced comparison of two major AI image workflows for brand and editorial use.", "Midjourney and Firefly serve different creative needs. One often excels at stylized exploration, while the other fits Adobe-centered production.", ["Creative Range", "Workflow Fit", "Commercial Considerations"], ["midjourney", "adobe-firefly", "figma-ai"], ["Image Generation", "Comparison", "Design"]],
  ["ai-image-generation", "AI Video Tools for Modern Content Teams", "How to evaluate generative video tools for concepts, explainers and short-form campaigns.", "AI video can speed up concept development, but production teams still need standards for brand fit, rights and quality control.", ["Concept Clips", "Editing Workflow", "Approval Standards"], ["runway", "pika", "descript"], ["Image Generation", "Marketing", "Design"]],
  ["ai-image-generation", "Designing Brand-Safe AI Visual Workflows", "A workflow for using AI visuals while protecting brand consistency and audience trust.", "Brand-safe AI visuals come from constraints: approved styles, review gates, asset rules and clear usage policies.", ["Style Systems", "Asset Review", "Usage Rules"], ["canva", "figma-ai", "adobe-firefly"], ["Design", "Image Generation", "Workflow"]],
  ["ai-image-generation", "AI Voice and Video for Training Content", "How teams can create useful training materials with AI voice and video tools.", "AI voice and video tools are strongest for repeatable internal content, especially when scripts are accurate and approvals are clear.", ["Script Quality", "Voice Governance", "Update Cadence"], ["elevenlabs", "synthesia", "descript"], ["Business AI", "Image Generation", "Productivity"]],
  ["automation", "Automation Strategy for Small Teams", "A practical way to choose which workflows to automate first.", "Automation should remove repeated manual work, not create hidden complexity. Small teams need simple criteria for choosing what to automate.", ["Find Repetition", "Estimate Risk", "Start Small"], ["zapier", "make", "airtable"], ["Automation", "Operations", "Startups"]],
  ["automation", "Zapier vs Make vs n8n: Which Fits Your Team", "A practical comparison of three popular automation platforms.", "Automation platforms differ in ease of use, flexibility and maintenance responsibility. The right choice depends on who owns the workflow.", ["Ease of Use", "Complex Logic", "Ownership Model"], ["zapier", "make", "n8n"], ["Automation", "Comparison", "No Code"]],
  ["automation", "Human Approval Workflows for AI Automation", "How to add review steps to automations that affect customers, money or public content.", "The safest automation systems know when to pause. Approval steps are essential for work that carries reputational or financial risk.", ["Approval Design", "Exception Handling", "Audit Records"], ["relay-app", "make", "n8n"], ["Automation", "AI Agents", "Operations"]],
  ["automation", "No-Code Automation Mistakes That Break Workflows", "Common automation mistakes and how teams can avoid brittle systems.", "Most automation failures are not caused by the tool. They come from unclear ownership, weak testing and missing error paths.", ["Ownership", "Testing", "Monitoring"], ["zapier", "make", "bardeen"], ["Automation", "No Code", "Workflow"]],
  ["automation", "Automating Content Operations Without Losing Quality", "How editorial teams can automate repetitive tasks while keeping human review where it matters.", "Content automation should support planning, formatting and distribution while leaving editorial judgment with people.", ["Planning Workflows", "Distribution Steps", "Quality Gates"], ["airtable", "notion-ai", "zapier"], ["Automation", "Content Strategy", "Operations"]],
  ["automation", "Browser Automation for Research and Sales Teams", "How browser-based automation can reduce repetitive web work without compromising data quality.", "Browser automation is useful for structured tasks, but teams should treat extracted information as input for review, not final truth.", ["Use Cases", "Data Hygiene", "Review Process"], ["bardeen", "perplexity", "typeform"], ["Automation", "Sales", "Research"]],
  ["business-ai", "How Businesses Should Evaluate AI Tools", "A practical framework for buying AI software without chasing hype.", "The best AI tool evaluation starts with workflow value, data risk and team adoption rather than feature lists alone.", ["Workflow Fit", "Risk Review", "Adoption Plan"], ["chatgpt", "microsoft-copilot", "notion-ai"], ["Business AI", "Enterprise AI", "Reviews"]],
  ["business-ai", "AI for Customer Support: What to Automate First", "How support teams can introduce AI without damaging customer trust.", "Support AI works best when it starts with accurate answers to common questions and clear escalation to human support.", ["Knowledge Base Quality", "Escalation Rules", "Customer Experience"], ["intercom-fin", "zendesk-ai", "notion-ai"], ["Business AI", "Customer Support", "Automation"]],
  ["business-ai", "Revenue Teams and AI: Practical Use Cases", "How sales and marketing teams can use AI for research, coaching and follow-up.", "Revenue AI should improve preparation and follow-through, not pressure teams into generic outreach or careless automation.", ["Call Insights", "Account Research", "Follow-Up Quality"], ["gong", "hubspot-ai", "salesforce-einstein"], ["Business AI", "Sales", "Marketing"]],
  ["business-ai", "AI Analytics Tools for Better Business Decisions", "How AI-assisted analytics can help teams ask better questions of their data.", "AI analytics is most useful when teams already agree on metric definitions and data quality standards.", ["Metric Definitions", "Narrative Insights", "Decision Reviews"], ["tableau-pulse", "power-bi-copilot", "hex"], ["Business AI", "Data Analysis", "Operations"]],
  ["business-ai", "The AI Productivity Stack for Executives", "A focused guide to AI tools that help leaders manage documents, meetings and decisions.", "Executives benefit most from AI tools that reduce information overload and improve decision preparation.", ["Meeting Intelligence", "Document Review", "Decision Briefs"], ["microsoft-copilot", "fathom", "claude"], ["Business AI", "Productivity", "Knowledge Management"]],
  ["business-ai", "Building an AI Tool Policy for Your Company", "A practical policy framework for AI tools, data handling and team adoption.", "An AI tool policy should be clear enough to guide daily work without blocking responsible experimentation.", ["Allowed Use", "Sensitive Data", "Review Responsibilities"], ["chatgpt", "notion-ai", "microsoft-copilot"], ["Business AI", "Enterprise AI", "Operations"]],
] as const

const heroImages = [
  imageUrl("1677442136019-21780ecad995", 101),
  imageUrl("1550751827-4bd374c3f58b", 102),
  imageUrl("1516321497487-e288fb19713f", 103),
  imageUrl("1504384308090-c894fdcc538d", 104),
  imageUrl("1497366754035-f200968a6e72", 105),
  imageUrl("1483058712412-4245e9b90334", 106),
  imageUrl("1518005020951-eccb494ad742", 107),
  imageUrl("1555066931-4365d14bab8c", 108),
  imageUrl("1515879218367-8466d910aaa4", 109),
  imageUrl("1551288049-bebda4e38f71", 110),
  imageUrl("1500530855697-b586d89ba3ee", 111),
  imageUrl("1519389950473-47ba0277781c", 112),
  imageUrl("1455390582262-044cdead277a", 113),
  imageUrl("1499750310107-5fef28a66643", 114),
  imageUrl("1432888622747-4eb9a8efeb07", 115),
  imageUrl("1497366811353-6870744d04b2", 116),
  imageUrl("1516321318423-f06f85e504b3", 117),
  imageUrl("1526378722484-bd91ca387e72", 118),
  imageUrl("1454165804606-c3d57bc86b40", 119),
  imageUrl("1552664730-d307ca884978", 120),
  imageUrl("1518770660439-4636190af475", 121),
  imageUrl("1500534314209-a25ddb2bd429", 122),
  imageUrl("1500530855697-b586d89ba3ee", 123),
  imageUrl("1518005020951-eccb494ad742", 124),
  imageUrl("1498050108023-c5249f4df085", 125),
  imageUrl("1504384308090-c894fdcc538d", 126),
  imageUrl("1516321497487-e288fb19713f", 127),
  imageUrl("1550751827-4bd374c3f58b", 128),
  imageUrl("1485827404703-89b55fcc595e", 129),
  imageUrl("1500530855697-b586d89ba3ee", 130),
  imageUrl("1519389950473-47ba0277781c", 131),
  imageUrl("1497366754035-f200968a6e72", 132),
  imageUrl("1483058712412-4245e9b90334", 133),
  imageUrl("1516321318423-f06f85e504b3", 134),
  imageUrl("1551288049-bebda4e38f71", 135),
  imageUrl("1499750310107-5fef28a66643", 136),
  imageUrl("1555066931-4365d14bab8c", 137),
  imageUrl("1526378722484-bd91ca387e72", 138),
  imageUrl("1454165804606-c3d57bc86b40", 139),
  imageUrl("1552664730-d307ca884978", 140),
  imageUrl("1518770660439-4636190af475", 141),
  imageUrl("1500534314209-a25ddb2bd429", 142),
]

const articles: ArticleSeed[] = articlePlans.map((plan, index) => {
  const [
    categorySlug,
    title,
    excerpt,
    intro,
    sectionA,
    sectionB,
    sectionC,
    relatedToolSlugs,
    tagNames,
  ] = plan

  const content = buildArticleHtml({
    title,
    intro,
    sections: [
      {
        heading: sectionA,
        body: `Start by defining the job clearly. Teams get better results when they connect the tool to a real workflow, name the owner and describe what a successful output looks like. This prevents the common mistake of adopting AI because it feels impressive rather than because it improves a measurable process.`,
      },
      {
        heading: sectionB,
        body: `The strongest implementation is usually narrow at first. Test the workflow on realistic examples, document the edge cases and keep a human review step wherever the output affects customers, revenue, legal commitments or public publishing. Reliability improves when the process is observable and easy to correct.`,
      },
      {
        heading: sectionC,
        body: `After the initial rollout, review cost, quality and time saved. A useful AI workflow should reduce friction without creating hidden maintenance work. If the tool requires constant rewriting, unclear prompts or repeated manual cleanup, the workflow needs redesign rather than more automation.`,
      },
    ],
    conclusion: `For most teams, the winning approach is practical rather than flashy: choose a narrow use case, use trustworthy inputs, review important outputs and keep improving the workflow based on real usage.`,
  })

  return {
    slug: slugify(title),
    title,
    excerpt,
    content,
    categorySlug,
    authorSlug: authors[index % authors.length].slug,
    status: "PUBLISHED",
    featured: index % 7 === 0,
    trending: index % 6 === 0,
    readingTime: estimateReadingTime(content),
    heroImage: heroImages[index],
    seoTitle: title.length <= 60 ? title : `${title.slice(0, 57).trim()}...`,
    seoDescription: excerpt.length <= 160 ? excerpt : `${excerpt.slice(0, 157).trim()}...`,
    canonicalUrl: `${SITE_URL}/articles/${slugify(title)}`,
    schemaType: "Article",
    publishedAt: new Date(publishedBase.getTime() + index * 24 * 60 * 60 * 1000),
    tagSlugs: tagNames.map(slugify),
    relatedToolSlugs: [...relatedToolSlugs],
  }
})

const comparisons = [
  {
    slug: "chatgpt-vs-claude",
    title: "ChatGPT vs Claude",
    summary: "A practical comparison of two leading AI assistants for writing, analysis and everyday knowledge work.",
    toolASlug: "chatgpt",
    toolBSlug: "claude",
    winnerSlug: "chatgpt",
    featureTable: [
      { feature: "General versatility", chatgpt: "Excellent", claude: "Excellent" },
      { feature: "Long-form writing", chatgpt: "Strong", claude: "Excellent" },
      { feature: "Ecosystem", chatgpt: "Very broad", claude: "Focused" },
    ],
    verdict:
      "ChatGPT is the broader default for most mixed workflows, while Claude is especially strong for careful long-form writing and document-heavy analysis.",
    faq: [
      { question: "Which is better for writing?", answer: "Claude is often preferred for long-form editorial drafts, while ChatGPT is more versatile across formats." },
      { question: "Which is better for teams?", answer: "The better choice depends on integrations, governance needs and the kind of work the team repeats most often." },
    ],
  },
  {
    slug: "cursor-vs-github-copilot",
    title: "Cursor vs GitHub Copilot",
    summary: "A developer-focused comparison of AI-native editing and IDE-integrated coding assistance.",
    toolASlug: "cursor",
    toolBSlug: "github-copilot",
    winnerSlug: "github-copilot",
    featureTable: [
      { feature: "IDE familiarity", cursor: "Requires editor adoption", copilot: "Works in common IDEs" },
      { feature: "Codebase chat", cursor: "Excellent", copilot: "Strong" },
      { feature: "Team rollout", cursor: "Good for AI-native teams", copilot: "Easier in GitHub workflows" },
    ],
    verdict:
      "GitHub Copilot is the safer default for broad engineering rollout, while Cursor is compelling for developers who want an AI-first editor.",
    faq: [
      { question: "Can both be used together?", answer: "Some developers test both, but teams should standardize review and security practices regardless of tool." },
      { question: "Which is safer?", answer: "Safety depends less on the tool and more on review, tests, permissions and codebase context." },
    ],
  },
  {
    slug: "zapier-vs-make",
    title: "Zapier vs Make",
    summary: "A comparison of two leading no-code automation platforms for business workflows.",
    toolASlug: "zapier",
    toolBSlug: "make",
    winnerSlug: "zapier",
    featureTable: [
      { feature: "Ease of setup", zapier: "Excellent", make: "Good" },
      { feature: "Complex workflows", zapier: "Good", make: "Excellent" },
      { feature: "App ecosystem", zapier: "Very broad", make: "Broad" },
    ],
    verdict:
      "Zapier is easier for most teams to start with, while Make offers more visual flexibility for complex operations workflows.",
    faq: [
      { question: "Which is better for beginners?", answer: "Zapier is usually easier for beginners and non-technical teams." },
      { question: "Which is better for complex automation?", answer: "Make often gives teams more control for branching, data manipulation and visual workflow design." },
    ],
  },
  {
    slug: "midjourney-vs-adobe-firefly",
    title: "Midjourney vs Adobe Firefly",
    summary: "A creative workflow comparison for image generation, brand use and editorial visuals.",
    toolASlug: "midjourney",
    toolBSlug: "adobe-firefly",
    winnerSlug: "adobe-firefly",
    featureTable: [
      { feature: "Artistic exploration", midjourney: "Excellent", firefly: "Strong" },
      { feature: "Adobe workflow", midjourney: "Limited", firefly: "Excellent" },
      { feature: "Brand production", midjourney: "Good with review", firefly: "Strong" },
    ],
    verdict:
      "Midjourney is exceptional for visual exploration, while Adobe Firefly is a stronger fit for teams already working inside Adobe production workflows.",
    faq: [
      { question: "Which creates better images?", answer: "Midjourney often creates more stylized images, while Firefly fits better into Adobe-centered commercial workflows." },
      { question: "Can publishers use AI images?", answer: "Yes, but images should be relevant, non-deceptive and reviewed for brand and rights considerations." },
    ],
  },
  {
    slug: "perplexity-vs-chatgpt",
    title: "Perplexity vs ChatGPT",
    summary: "A comparison of AI search-style research and general-purpose AI assistance.",
    toolASlug: "perplexity",
    toolBSlug: "chatgpt",
    winnerSlug: "chatgpt",
    featureTable: [
      { feature: "Source discovery", perplexity: "Excellent", chatgpt: "Strong depending on mode" },
      { feature: "General tasks", perplexity: "Good", chatgpt: "Excellent" },
      { feature: "Research summaries", perplexity: "Excellent", chatgpt: "Strong" },
    ],
    verdict:
      "Perplexity is excellent for source-led exploration, while ChatGPT is more versatile across writing, analysis, ideation and coding support.",
    faq: [
      { question: "Which is better for research?", answer: "Perplexity is strong when citations and web discovery matter most." },
      { question: "Which is better overall?", answer: "ChatGPT is usually more flexible for mixed knowledge work." },
    ],
  },
]

const mediaItems = [
  ...categories.map((category) => ({
    url: category.heroImage || "",
    type: "image",
    alt: `${category.name} category hero image`,
    title: `${category.name} Hero`,
  })),
  ...articles.map((article) => ({
    url: article.heroImage,
    type: "image",
    alt: article.title,
    title: `${article.title} hero image`,
  })),
]

const siteSettings = {
  id: "site-settings",
  siteName: "NEXORA",
  description: "NEXORA is a premium AI technology publication, tool directory and editorial CMS for practical AI adoption.",
  defaultSeoTitle: "NEXORA — AI Tools, Reviews and Practical Guides",
  defaultSeoDescription:
    "Discover practical AI tools, balanced reviews, workflow guides and editorial analysis for teams adopting AI responsibly.",
  socialLinks: {
    x: "https://x.com/nexora",
    linkedin: "https://www.linkedin.com/company/nexora-ai",
    github: "https://github.com/nexora",
  },
  newsletterEnabled: true,
  adsEnabled: false,
  affiliateEnabled: true,
}

async function validateSeedData() {
  assertUnique(authors, (item) => item.slug, "author slug")
  assertUnique(categories, (item) => item.slug, "category slug")
  assertUnique(tags, (item) => item.slug, "tag slug")
  assertUnique(toolCategories, (item) => item.slug, "tool category slug")
  assertUnique(toolData, (item) => item.slug, "tool slug")
  assertUnique(articles, (item) => item.slug, "article slug")
  assertUnique(comparisons, (item) => item.slug, "comparison slug")

  assert(toolData.length === 50, `Expected 50 tools, received ${toolData.length}`)

  const freeOrFreemiumTools = toolData.filter((tool) => /free|freemium/i.test(tool.pricing))
  const paidTools = toolData.filter((tool) => !/free|freemium/i.test(tool.pricing))
  assert(freeOrFreemiumTools.length === 25, `Expected 25 free/freemium tools, received ${freeOrFreemiumTools.length}`)
  assert(paidTools.length === 25, `Expected 25 paid tools, received ${paidTools.length}`)

  const categorySlugs = new Set(categories.map((category) => category.slug))
  const tagSlugs = new Set(tags.map((tag) => tag.slug))
  const toolCategorySlugs = new Set(toolCategories.map((category) => category.slug))
  const toolSlugs = new Set(toolData.map((tool) => tool.slug))
  const authorSlugs = new Set(authors.map((author) => author.slug))

  for (const tool of toolData) {
    assert(toolCategorySlugs.has(tool.categorySlug), `Tool ${tool.slug} references missing category ${tool.categorySlug}`)
    assert(tool.name.length > 1, `Tool ${tool.slug} requires a name`)
    assert(tool.description.length >= 40, `Tool ${tool.slug} description is too short`)
    assert(tool.websiteUrl.startsWith("https://"), `Tool ${tool.slug} websiteUrl must be https`)
    assert(typeof tool.features.logoUrl === "string", `Tool ${tool.slug} requires features.logoUrl`)
    assert(typeof tool.features.websiteUrl === "string", `Tool ${tool.slug} requires features.websiteUrl`)
    assert(tool.rating >= 0 && tool.rating <= 5, `Tool ${tool.slug} rating must be between 0 and 5`)
  }

  const articleCountsByCategory = new Map<string, number>()
  for (const article of articles) {
    assert(categorySlugs.has(article.categorySlug), `Article ${article.slug} references missing category ${article.categorySlug}`)
    assert(authorSlugs.has(article.authorSlug), `Article ${article.slug} references missing author ${article.authorSlug}`)
    assert(article.title.length >= 10, `Article ${article.slug} title is too short`)
    assert(article.excerpt.length >= 80, `Article ${article.slug} excerpt is too short`)
    assert(article.content.length >= 900, `Article ${article.slug} content is too short`)
    assert(article.heroImage.startsWith("https://"), `Article ${article.slug} heroImage must be https`)
    assert(article.schemaType === "Article", `Article ${article.slug} schemaType must be Article`)
    assert(article.canonicalUrl === `${SITE_URL}/articles/${article.slug}`, `Article ${article.slug} canonicalUrl is invalid`)
    assert(article.seoTitle.length >= 30 && article.seoTitle.length <= 70, `Article ${article.slug} seoTitle should be 30-70 characters`)
    assert(article.seoDescription.length >= 90 && article.seoDescription.length <= 170, `Article ${article.slug} seoDescription should be 90-170 characters`)
    for (const tagSlug of article.tagSlugs) {
      assert(tagSlugs.has(tagSlug), `Article ${article.slug} references missing tag ${tagSlug}`)
    }
    for (const toolSlug of article.relatedToolSlugs) {
      assert(toolSlugs.has(toolSlug), `Article ${article.slug} references missing tool ${toolSlug}`)
    }
    articleCountsByCategory.set(article.categorySlug, (articleCountsByCategory.get(article.categorySlug) || 0) + 1)
  }

  for (const category of categories) {
    const count = articleCountsByCategory.get(category.slug) || 0
    assert(count >= 6 && count <= 7, `Category ${category.slug} expected 6-7 articles, received ${count}`)
  }

  const heroImageSet = new Set(articles.map((article) => article.heroImage))
  assert(heroImageSet.size >= 35, "Article hero images are duplicated too heavily")

  for (const comparison of comparisons) {
    assert(toolSlugs.has(comparison.toolASlug), `Comparison ${comparison.slug} has missing toolA`)
    assert(toolSlugs.has(comparison.toolBSlug), `Comparison ${comparison.slug} has missing toolB`)
    if (comparison.winnerSlug) assert(toolSlugs.has(comparison.winnerSlug), `Comparison ${comparison.slug} has missing winner`)
    assert(comparison.toolASlug !== comparison.toolBSlug, `Comparison ${comparison.slug} compares the same tool`)
  }

  assert(siteSettings.newsletterEnabled === true, "Newsletter capability must be enabled")
  assert(siteSettings.adsEnabled === false, "adsEnabled must remain false")
  assert(siteSettings.affiliateEnabled === true, "Affiliate capability must be enabled")
}

async function main() {
  await validateSeedData()

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN",
    },
  })

  const authorBySlug = new Map<string, string>()
  for (const author of authors) {
    const saved = await prisma.author.upsert({
      where: { slug: author.slug },
      update: {
        name: author.name,
        role: author.role,
        bio: author.bio,
        userId: author.slug === "mira-khan" ? adminUser.id : null,
      },
      create: {
        slug: author.slug,
        name: author.name,
        role: author.role,
        bio: author.bio,
        userId: author.slug === "mira-khan" ? adminUser.id : null,
      },
    })
    authorBySlug.set(author.slug, saved.id)
  }

  const categoryBySlug = new Map<string, string>()
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        heroImage: category.heroImage,
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        heroImage: category.heroImage,
      },
    })
    categoryBySlug.set(category.slug, saved.id)
  }

  const tagBySlug = new Map<string, string>()
  for (const tag of tags) {
    const saved = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {
        name: tag.name,
      },
      create: {
        slug: tag.slug,
        name: tag.name,
      },
    })
    tagBySlug.set(tag.slug, saved.id)
  }

  const toolCategoryBySlug = new Map<string, string>()
  for (const category of toolCategories) {
    const saved = await prisma.toolCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
      },
      create: {
        slug: category.slug,
        name: category.name,
      },
    })
    toolCategoryBySlug.set(category.slug, saved.id)
  }

  const toolBySlug = new Map<string, string>()
  for (const tool of toolData) {
    const categoryId = toolCategoryBySlug.get(tool.categorySlug)
    assert(categoryId, `Missing tool category ${tool.categorySlug}`)

    const saved = await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        pricing: tool.pricing,
        rating: tool.rating,
        pros: tool.pros,
        cons: tool.cons,
        bestFor: tool.bestFor,
        features: tool.features,
        affiliateUrl: tool.affiliateUrl,
        affiliateDisclosure: tool.affiliateDisclosure,
        lastReviewedAt: tool.lastReviewedAt,
        featured: tool.featured,
        categoryId,
      },
      create: {
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        pricing: tool.pricing,
        rating: tool.rating,
        pros: tool.pros,
        cons: tool.cons,
        bestFor: tool.bestFor,
        features: tool.features,
        affiliateUrl: tool.affiliateUrl,
        affiliateDisclosure: tool.affiliateDisclosure,
        lastReviewedAt: tool.lastReviewedAt,
        featured: tool.featured,
        categoryId,
      },
    })

    toolBySlug.set(tool.slug, saved.id)

    await prisma.review.upsert({
      where: { toolId: saved.id },
      update: {
        rating: tool.rating,
        summary: `${tool.name} is best suited for ${tool.bestFor.toLowerCase()}`,
        content: `${tool.name} earns its rating through practical workflow value, clear use cases and enough maturity for real teams. As with any AI product, teams should test it with their own data, review outputs and confirm pricing before making it part of a critical process.`,
        pros: tool.pros,
        cons: tool.cons,
      },
      create: {
        toolId: saved.id,
        rating: tool.rating,
        summary: `${tool.name} is best suited for ${tool.bestFor.toLowerCase()}`,
        content: `${tool.name} earns its rating through practical workflow value, clear use cases and enough maturity for real teams. As with any AI product, teams should test it with their own data, review outputs and confirm pricing before making it part of a critical process.`,
        pros: tool.pros,
        cons: tool.cons,
      },
    })
  }

  for (const article of articles) {
    const categoryId = categoryBySlug.get(article.categorySlug)
    const authorId = authorBySlug.get(article.authorSlug)

    assert(categoryId, `Missing category for article ${article.slug}`)
    assert(authorId, `Missing author for article ${article.slug}`)

    const saved = await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        categoryId,
        authorId,
        status: article.status,
        featured: article.featured,
        trending: article.trending,
        readingTime: article.readingTime,
        heroImage: article.heroImage,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        canonicalUrl: article.canonicalUrl,
        schemaType: article.schemaType,
        publishedAt: article.publishedAt,
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        categoryId,
        authorId,
        status: article.status,
        featured: article.featured,
        trending: article.trending,
        readingTime: article.readingTime,
        heroImage: article.heroImage,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        canonicalUrl: article.canonicalUrl,
        schemaType: article.schemaType,
        publishedAt: article.publishedAt,
      },
    })

    await prisma.articleTag.deleteMany({
      where: { articleId: saved.id },
    })

    await prisma.articleTool.deleteMany({
      where: { articleId: saved.id },
    })

    for (const tagSlug of article.tagSlugs) {
      const tagId = tagBySlug.get(tagSlug)
      assert(tagId, `Missing tag ${tagSlug}`)
      await prisma.articleTag.create({
        data: {
          articleId: saved.id,
          tagId,
        },
      })
    }

    for (const toolSlug of article.relatedToolSlugs) {
      const toolId = toolBySlug.get(toolSlug)
      assert(toolId, `Missing tool ${toolSlug}`)
      await prisma.articleTool.create({
        data: {
          articleId: saved.id,
          toolId,
        },
      })
    }

    await prisma.revision.create({
      data: {
        articleId: saved.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        editedBy: "seed",
      },
    })
  }

  for (const comparison of comparisons) {
    const toolAId = toolBySlug.get(comparison.toolASlug)
    const toolBId = toolBySlug.get(comparison.toolBSlug)
    const winnerToolId = comparison.winnerSlug ? toolBySlug.get(comparison.winnerSlug) : null

    assert(toolAId, `Missing comparison toolA ${comparison.toolASlug}`)
    assert(toolBId, `Missing comparison toolB ${comparison.toolBSlug}`)

    await prisma.comparison.upsert({
      where: { slug: comparison.slug },
      update: {
        title: comparison.title,
        summary: comparison.summary,
        toolAId,
        toolBId,
        winnerToolId,
        featureTable: comparison.featureTable,
        verdict: comparison.verdict,
        faq: comparison.faq,
      },
      create: {
        slug: comparison.slug,
        title: comparison.title,
        summary: comparison.summary,
        toolAId,
        toolBId,
        winnerToolId,
        featureTable: comparison.featureTable,
        verdict: comparison.verdict,
        faq: comparison.faq,
      },
    })
  }

  for (const item of mediaItems) {
    if (!item.url) continue
    const existing = await prisma.media.findFirst({
      where: { url: item.url },
      select: { id: true },
    })

    if (existing) {
      await prisma.media.update({
        where: { id: existing.id },
        data: {
          type: item.type,
          alt: item.alt,
          title: item.title,
        },
      })
    } else {
      await prisma.media.create({
        data: item,
      })
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: siteSettings.id },
    update: {
      siteName: siteSettings.siteName,
      description: siteSettings.description,
      defaultSeoTitle: siteSettings.defaultSeoTitle,
      defaultSeoDescription: siteSettings.defaultSeoDescription,
      socialLinks: siteSettings.socialLinks,
      newsletterEnabled: siteSettings.newsletterEnabled,
      adsEnabled: siteSettings.adsEnabled,
      affiliateEnabled: siteSettings.affiliateEnabled,
    },
    create: siteSettings,
  })

  const [
    userCount,
    authorCount,
    categoryCount,
    tagCount,
    toolCategoryCount,
    toolCount,
    articleCount,
    articleTagCount,
    articleToolCount,
    reviewCount,
    comparisonCount,
    mediaCount,
    settingsCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.author.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.toolCategory.count(),
    prisma.tool.count(),
    prisma.article.count(),
    prisma.articleTag.count(),
    prisma.articleTool.count(),
    prisma.review.count(),
    prisma.comparison.count(),
    prisma.media.count(),
    prisma.siteSettings.count(),
  ])

  assert(userCount >= 1, "Expected at least one user")
  assert(authorCount >= authors.length, "Author count validation failed")
  assert(categoryCount >= categories.length, "Category count validation failed")
  assert(tagCount >= tags.length, "Tag count validation failed")
  assert(toolCategoryCount >= toolCategories.length, "Tool category count validation failed")
  assert(toolCount >= 50, "Tool count validation failed")
  assert(articleCount >= articles.length, "Article count validation failed")
  assert(articleTagCount >= articles.reduce((sum, article) => sum + article.tagSlugs.length, 0), "Article tag relation validation failed")
  assert(articleToolCount >= articles.reduce((sum, article) => sum + article.relatedToolSlugs.length, 0), "Article tool relation validation failed")
  assert(reviewCount >= 50, "Review count validation failed")
  assert(comparisonCount >= comparisons.length, "Comparison count validation failed")
  assert(mediaCount >= mediaItems.length, "Media count validation failed")
  assert(settingsCount >= 1, "Site settings validation failed")

  const finalTools = await prisma.tool.findMany({
    select: { pricing: true },
  })

  const finalFreeOrFreemium = finalTools.filter((tool) => /free|freemium/i.test(tool.pricing || "")).length
  const finalPaid = finalTools.filter((tool) => !/free|freemium/i.test(tool.pricing || "")).length

  assert(finalFreeOrFreemium >= 25, `Expected at least 25 free/freemium tools, received ${finalFreeOrFreemium}`)
  assert(finalPaid >= 25, `Expected at least 25 paid tools, received ${finalPaid}`)

  console.log(
    JSON.stringify(
      {
        status: "ok",
        seededAt: now.toISOString(),
        users: userCount,
        authors: authorCount,
        categories: categoryCount,
        tags: tagCount,
        toolCategories: toolCategoryCount,
        tools: toolCount,
        freeOrFreemiumTools: finalFreeOrFreemium,
        paidTools: finalPaid,
        articles: articleCount,
        articleTags: articleTagCount,
        articleTools: articleToolCount,
        reviews: reviewCount,
        comparisons: comparisonCount,
        media: mediaCount,
        siteSettings: settingsCount,
        adsEnabled: siteSettings.adsEnabled,
        newsletterEnabled: siteSettings.newsletterEnabled,
        affiliateEnabled: siteSettings.affiliateEnabled,
      },
      null,
      2,
    ),
  )
}

main()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
