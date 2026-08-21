import { PrismaClient, Pricing, ArticleType, Prisma } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

// ---------------------------------------------------------------------------
// 1. CATEGORIES
// ---------------------------------------------------------------------------
// 14 total categories. Articles are only required across the 7 "core" ones
// (5 articles each = 35 articles). Tools can belong to any of the 14.

const CATEGORIES = [
  { slug: "ai-assistants", name: "AI Assistants" },
  { slug: "ai-agents", name: "AI Agents" },
  { slug: "ai-writing", name: "AI Writing" },
  { slug: "ai-image", name: "AI Image" },
  { slug: "ai-video", name: "AI Video" },
  { slug: "ai-audio", name: "AI Audio" },
  { slug: "productivity", name: "Productivity" },
  { slug: "automation", name: "Automation" },
  { slug: "research", name: "Research" },
  { slug: "business-ai", name: "Business AI" },
  { slug: "developer-tools", name: "Developer Tools" },
  { slug: "marketing", name: "Marketing" },
  { slug: "design", name: "Design" },
  { slug: "education", name: "Education" },
] as const

const CORE_CATEGORY_SLUGS = [
  "ai-assistants",
  "ai-writing",
  "ai-image",
  "automation",
  "business-ai",
  "developer-tools",
  "productivity",
] as const

const ARTICLES_PER_CORE_CATEGORY_TARGET = 5
const TOTAL_ARTICLE_TARGET = CORE_CATEGORY_SLUGS.length * ARTICLES_PER_CORE_CATEGORY_TARGET // 35

// ---------------------------------------------------------------------------
// 2. TAGS
// ---------------------------------------------------------------------------

const TAG_NAMES = [
  "Reviews",
  "Guides",
  "AI Tools",
  "AI Agents",
  "Automation",
  "Productivity",
  "LLM",
  "Prompting",
  "AI Writing",
  "AI Image",
  "AI Video",
  "Developer Tools",
  "Business AI",
  "Marketing",
  "Research",
  "Future of Work",
] as const

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ---------------------------------------------------------------------------
// 3. AUTHORS
// ---------------------------------------------------------------------------

const AUTHORS = [
  {
    slug: "elena-cho",
    name: "Elena Cho",
    role: "Senior AI Editor",
    bio: "Elena covers AI agents, automation, and enterprise AI adoption, with a focus on how the future of work actually changes on the ground rather than in press releases.",
  },
  {
    slug: "marcus-webb",
    name: "Marcus Webb",
    role: "AI Tools Reviewer",
    bio: "Marcus reviews AI software the way he'd want a colleague to: real workflows, real trade-offs, and an honest answer about who a tool is and isn't for.",
  },
] as const

// ---------------------------------------------------------------------------
// 4. TOOLS — 50 total, 25 free / 25 paid, spread across all 14 categories.
//    Descriptions are specific on purpose — no "an AI tool for productivity."
// ---------------------------------------------------------------------------

type ToolSeed = {
  slug: string
  name: string
  description: string
  websiteUrl: string
  pricing: "FREE" | "PAID"
  categorySlug: (typeof CATEGORIES)[number]["slug"]
  featured?: boolean
}

const TOOLS: ToolSeed[] = [
  // ---- FREE (25) ----
  {
    slug: "chatgpt",
    name: "ChatGPT",
    description:
      "OpenAI's conversational assistant for writing, research, coding help, and everyday problem-solving, with a free tier that covers most casual use cases.",
    websiteUrl: "https://chatgpt.com",
    pricing: "FREE",
    categorySlug: "ai-assistants",
    featured: true,
  },
  {
    slug: "claude",
    name: "Claude",
    description:
      "Anthropic's assistant built around careful reasoning and long-document handling, well suited to writing, analysis, and coding work that needs sustained context.",
    websiteUrl: "https://claude.ai",
    pricing: "FREE",
    categorySlug: "ai-assistants",
    featured: true,
  },
  {
    slug: "gemini",
    name: "Gemini",
    description:
      "Google's assistant, deeply integrated with Search, Workspace, and Android, useful for anyone already living in the Google ecosystem.",
    websiteUrl: "https://gemini.google.com",
    pricing: "FREE",
    categorySlug: "ai-assistants",
    featured: true,
  },
  {
    slug: "microsoft-copilot",
    name: "Microsoft Copilot",
    description:
      "Microsoft's assistant woven into Windows, Edge, and Office, aimed at people who want AI help without leaving the apps they already use.",
    websiteUrl: "https://copilot.microsoft.com",
    pricing: "FREE",
    categorySlug: "ai-assistants",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    description:
      "An answer engine that pairs a chat interface with live web search and cited sources, built for research rather than open-ended conversation.",
    websiteUrl: "https://perplexity.ai",
    pricing: "FREE",
    categorySlug: "research",
    featured: true,
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    description:
      "An open-weight model family known for strong reasoning and coding performance at a fraction of the usual compute cost.",
    websiteUrl: "https://chat.deepseek.com",
    pricing: "FREE",
    categorySlug: "ai-assistants",
  },
  {
    slug: "duckduckgo-ai-chat",
    name: "DuckDuckGo AI Chat",
    description:
      "A privacy-focused chat interface that lets you try several AI models anonymously, without an account or chat history tied to your identity.",
    websiteUrl: "https://duckduckgo.com/aichat",
    pricing: "FREE",
    categorySlug: "ai-assistants",
  },
  {
    slug: "poe",
    name: "Poe",
    description:
      "Quora's multi-model chat platform where a subscription, or limited free credits, gets you access to many different AI models side by side.",
    websiteUrl: "https://poe.com",
    pricing: "FREE",
    categorySlug: "ai-assistants",
  },
  {
    slug: "character-ai",
    name: "Character.AI",
    description:
      "A platform for chatting with and building persona-driven AI characters, popular for roleplay, companionship-style chat, and creative writing prompts.",
    websiteUrl: "https://character.ai",
    pricing: "FREE",
    categorySlug: "ai-agents",
  },
  {
    slug: "notebooklm",
    name: "NotebookLM",
    description:
      "Google's research assistant that turns your own uploaded documents into a source-grounded chat, including an audio-summary 'podcast' feature.",
    websiteUrl: "https://notebooklm.google",
    pricing: "FREE",
    categorySlug: "research",
    featured: true,
  },
  {
    slug: "google-ai-studio",
    name: "Google AI Studio",
    description:
      "A free browser-based playground for prototyping with Gemini models, including function calling and multimodal inputs, before writing production code.",
    websiteUrl: "https://aistudio.google.com",
    pricing: "FREE",
    categorySlug: "developer-tools",
  },
  {
    slug: "hugging-face",
    name: "Hugging Face",
    description:
      "The largest open hub for AI models, datasets, and demo spaces, where free tiers let developers experiment before ever touching a GPU bill.",
    websiteUrl: "https://huggingface.co",
    pricing: "FREE",
    categorySlug: "developer-tools",
    featured: true,
  },
  {
    slug: "github-copilot-free",
    name: "GitHub Copilot Free",
    description:
      "A limited but genuinely useful free tier of GitHub's code completion and chat assistant, enough to try it inside VS Code before upgrading.",
    websiteUrl: "https://github.com/features/copilot",
    pricing: "FREE",
    categorySlug: "developer-tools",
  },
  {
    slug: "grammarly",
    name: "Grammarly",
    description:
      "A writing assistant that checks grammar, tone, and clarity as you type, with a free tier that covers the basics across browsers and documents.",
    websiteUrl: "https://grammarly.com",
    pricing: "FREE",
    categorySlug: "ai-writing",
    featured: true,
  },
  {
    slug: "quillbot",
    name: "QuillBot",
    description:
      "A paraphrasing and grammar tool aimed at students and non-native English writers who need to rework sentences quickly.",
    websiteUrl: "https://quillbot.com",
    pricing: "FREE",
    categorySlug: "ai-writing",
  },
  {
    slug: "canva",
    name: "Canva",
    description:
      "A drag-and-drop design tool with Magic Studio AI features for text-to-image, background removal, and instant resizing built into its free plan.",
    websiteUrl: "https://canva.com",
    pricing: "FREE",
    categorySlug: "design",
    featured: true,
  },
  {
    slug: "remove-bg",
    name: "Remove.bg",
    description:
      "A single-purpose tool that strips the background out of any photo in seconds, with a generous free daily allowance.",
    websiteUrl: "https://remove.bg",
    pricing: "FREE",
    categorySlug: "ai-image",
  },
  {
    slug: "capcut",
    name: "CapCut",
    description:
      "A mobile-first video editor with AI captioning, background removal, and templates, free to use with an optional paid tier for extras.",
    websiteUrl: "https://capcut.com",
    pricing: "FREE",
    categorySlug: "ai-video",
  },
  {
    slug: "otter-ai",
    name: "Otter.ai",
    description:
      "A meeting transcription tool that generates live notes, speaker labels, and summaries, with a free tier covering a few hundred minutes a month.",
    websiteUrl: "https://otter.ai",
    pricing: "FREE",
    categorySlug: "productivity",
  },
  {
    slug: "notion",
    name: "Notion",
    description:
      "An all-in-one workspace for notes, docs, and databases that bundles a limited amount of AI writing and Q&A credits into its free plan.",
    websiteUrl: "https://notion.so",
    pricing: "FREE",
    categorySlug: "productivity",
    featured: true,
  },
  {
    slug: "zapier",
    name: "Zapier",
    description:
      "The most widely used no-code automation tool for connecting apps, with a free plan that covers light, single-step workflows.",
    websiteUrl: "https://zapier.com",
    pricing: "FREE",
    categorySlug: "automation",
    featured: true,
  },
  {
    slug: "ifttt",
    name: "IFTTT",
    description:
      "A simple automation tool for connecting apps and smart-home devices with plain 'if this, then that' logic, free for a handful of active applets.",
    websiteUrl: "https://ifttt.com",
    pricing: "FREE",
    categorySlug: "automation",
  },
  {
    slug: "krea",
    name: "Krea",
    description:
      "A real-time AI image and video generation tool that updates as you sketch or type, with free daily generations.",
    websiteUrl: "https://krea.ai",
    pricing: "FREE",
    categorySlug: "ai-image",
  },
  {
    slug: "photoroom",
    name: "Photoroom",
    description:
      "A background-removal and product-photo tool aimed at small sellers who need clean listing photos without a studio.",
    websiteUrl: "https://photoroom.com",
    pricing: "FREE",
    categorySlug: "ai-image",
  },
  {
    slug: "suno",
    name: "Suno",
    description:
      "A text-to-song generator that writes lyrics and composes full tracks from a short prompt, with a free tier for casual songwriting.",
    websiteUrl: "https://suno.com",
    pricing: "FREE",
    categorySlug: "ai-audio",
  },

  // ---- PAID (25) ----
  {
    slug: "midjourney",
    name: "Midjourney",
    description:
      "A Discord-and-web image generator known for its distinctive, painterly default aesthetic, popular with artists and designers; no meaningful free tier remains.",
    websiteUrl: "https://midjourney.com",
    pricing: "PAID",
    categorySlug: "ai-image",
    featured: true,
  },
  {
    slug: "jasper",
    name: "Jasper",
    description:
      "A brand-focused AI writing platform built for marketing teams, with style guides and brand-voice controls that generic chat assistants don't offer.",
    websiteUrl: "https://jasper.ai",
    pricing: "PAID",
    categorySlug: "ai-writing",
    featured: true,
  },
  {
    slug: "runway",
    name: "Runway",
    description:
      "A professional AI video generation and editing suite used in film and ad production for shot generation and visual-effects work.",
    websiteUrl: "https://runwayml.com",
    pricing: "PAID",
    categorySlug: "ai-video",
    featured: true,
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    description:
      "The most widely used AI voice platform for realistic text-to-speech, voice cloning, and dubbing, priced by monthly character generation.",
    websiteUrl: "https://elevenlabs.io",
    pricing: "PAID",
    categorySlug: "ai-audio",
    featured: true,
  },
  {
    slug: "cursor",
    name: "Cursor",
    description:
      "An AI-native code editor built on top of VS Code, with deep codebase-aware chat and multi-file editing that free coding assistants struggle to match.",
    websiteUrl: "https://cursor.com",
    pricing: "PAID",
    categorySlug: "developer-tools",
    featured: true,
  },
  {
    slug: "windsurf",
    name: "Windsurf",
    description:
      "An agentic coding IDE built around a 'flow' mode that can plan and execute multi-step coding tasks with less manual back-and-forth.",
    websiteUrl: "https://windsurf.com",
    pricing: "PAID",
    categorySlug: "developer-tools",
  },
  {
    slug: "synthesia",
    name: "Synthesia",
    description:
      "An AI avatar video platform used heavily in corporate training and localization, turning a script into a presenter-led video in minutes.",
    websiteUrl: "https://synthesia.io",
    pricing: "PAID",
    categorySlug: "ai-video",
  },
  {
    slug: "copy-ai",
    name: "Copy.ai",
    description:
      "A workflow-focused AI writing platform aimed at marketing and sales teams that need repeatable, on-brand copy at volume.",
    websiteUrl: "https://copy.ai",
    pricing: "PAID",
    categorySlug: "marketing",
  },
  {
    slug: "writesonic",
    name: "Writesonic",
    description:
      "An AI content platform bundling long-form articles, ad copy, and basic SEO research tools into one marketing-oriented subscription.",
    websiteUrl: "https://writesonic.com",
    pricing: "PAID",
    categorySlug: "marketing",
  },
  {
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    description:
      "Adobe's generative AI, trained on licensed and public-domain content, integrated directly into Photoshop and Illustrator for commercially safer output.",
    websiteUrl: "https://firefly.adobe.com",
    pricing: "PAID",
    categorySlug: "design",
    featured: true,
  },
  {
    slug: "descript",
    name: "Descript",
    description:
      "An audio and video editor that lets you edit recordings by editing a text transcript, widely used for podcast and video production.",
    websiteUrl: "https://descript.com",
    pricing: "PAID",
    categorySlug: "ai-audio",
  },
  {
    slug: "gamma",
    name: "Gamma",
    description:
      "An AI presentation and document generator that turns a short brief into a designed deck or webpage in minutes.",
    websiteUrl: "https://gamma.app",
    pricing: "PAID",
    categorySlug: "productivity",
  },
  {
    slug: "superhuman",
    name: "Superhuman",
    description:
      "A speed-focused email client with AI triage, summarization, and drafting features aimed at people who live in their inbox.",
    websiteUrl: "https://superhuman.com",
    pricing: "PAID",
    categorySlug: "productivity",
  },
  {
    slug: "clay",
    name: "Clay",
    description:
      "A go-to-market data and AI enrichment tool that lets sales and growth teams build highly personalized outbound campaigns at scale.",
    websiteUrl: "https://clay.com",
    pricing: "PAID",
    categorySlug: "business-ai",
  },
  {
    slug: "glean",
    name: "Glean",
    description:
      "An enterprise AI search assistant that indexes a company's internal tools and documents so employees can ask questions across all of them at once.",
    websiteUrl: "https://glean.com",
    pricing: "PAID",
    categorySlug: "business-ai",
    featured: true,
  },
  {
    slug: "harvey",
    name: "Harvey",
    description:
      "An AI platform built specifically for law firms, handling contract review, research, and drafting with legal-specific guardrails.",
    websiteUrl: "https://harvey.ai",
    pricing: "PAID",
    categorySlug: "business-ai",
  },
  {
    slug: "tabnine",
    name: "Tabnine",
    description:
      "A code-completion assistant that can run fully on private infrastructure, aimed at engineering teams with strict code-privacy requirements.",
    websiteUrl: "https://tabnine.com",
    pricing: "PAID",
    categorySlug: "developer-tools",
  },
  {
    slug: "sourcegraph-cody",
    name: "Sourcegraph Cody",
    description:
      "A codebase-aware AI assistant built on Sourcegraph's code search, tuned for navigating and explaining large, unfamiliar repositories.",
    websiteUrl: "https://sourcegraph.com/cody",
    pricing: "PAID",
    categorySlug: "developer-tools",
  },
  {
    slug: "surfer-seo",
    name: "Surfer SEO",
    description:
      "A content-optimization tool that scores drafts against top-ranking pages for a keyword, used by SEO and content teams to close gaps before publishing.",
    websiteUrl: "https://surferseo.com",
    pricing: "PAID",
    categorySlug: "marketing",
  },
  {
    slug: "ideogram",
    name: "Ideogram",
    description:
      "An AI image generator particularly strong at rendering legible text inside images, useful for posters, logos, and social graphics.",
    websiteUrl: "https://ideogram.ai",
    pricing: "PAID",
    categorySlug: "ai-image",
  },
  {
    slug: "heygen",
    name: "HeyGen",
    description:
      "An AI avatar and video-translation tool that can dub a presenter's video into another language while matching their lip movements.",
    websiteUrl: "https://heygen.com",
    pricing: "PAID",
    categorySlug: "ai-video",
  },
  {
    slug: "murf-ai",
    name: "Murf",
    description:
      "A studio-style AI voiceover tool with a timeline editor, aimed at explainer videos, e-learning, and corporate narration.",
    websiteUrl: "https://murf.ai",
    pricing: "PAID",
    categorySlug: "ai-audio",
  },
  {
    slug: "fireflies-ai",
    name: "Fireflies.ai",
    description:
      "A meeting-recording assistant that integrates with calendars and CRMs to auto-log call notes and action items for sales and ops teams.",
    websiteUrl: "https://fireflies.ai",
    pricing: "PAID",
    categorySlug: "business-ai",
  },
  {
    slug: "clockwise",
    name: "Clockwise",
    description:
      "A calendar-optimization tool that automatically reshuffles flexible meetings to protect focus time across a whole team.",
    websiteUrl: "https://getclockwise.com",
    pricing: "PAID",
    categorySlug: "productivity",
  },
  {
    slug: "speak",
    name: "Speak",
    description:
      "An AI-powered language-learning app focused on real spoken conversation practice rather than flashcard-style drills.",
    websiteUrl: "https://speak.com",
    pricing: "PAID",
    categorySlug: "education",
  },
]

// ---------------------------------------------------------------------------
// 5. VISUAL SYSTEM — every tool/article gets a subject-specific icon derived
//    from its own real domain. No shared HERO_IMAGES rotation anywhere.
// ---------------------------------------------------------------------------

function faviconFor(urlOrDomain: string): string {
  const domain = urlOrDomain.includes("://") ? new URL(urlOrDomain).hostname : urlOrDomain
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

// ---------------------------------------------------------------------------
// 6. ARTICLES
// ---------------------------------------------------------------------------
// 35 editorial articles: 5 per core category, with unique subject-specific hero images.

function articleContent(sections: { heading: string; body: string }[]): string {
  return sections.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n")
}

type ArticleSeed = {
  slug: string
  title: string
  excerpt: string
  type: "REVIEW" | "GUIDE"
  categorySlug: (typeof CORE_CATEGORY_SLUGS)[number]
  authorSlug: (typeof AUTHORS)[number]["slug"]
  heroImageUrl: string
  tagSlugs: string[]
  featured?: boolean
  trending?: boolean
  content: string
}

function generatedArticle(
  slug: string,
  title: string,
  categorySlug: (typeof CORE_CATEGORY_SLUGS)[number],
  authorSlug: (typeof AUTHORS)[number]["slug"],
  type: "REVIEW" | "GUIDE",
  heroImageUrl: string,
  tagSlugs: string[],
): ArticleSeed {
  const isReview = type === "REVIEW"
  const subject = title.replace(/^How to /, "").replace(/^Best /, "")
  return {
    slug,
    title,
    excerpt: `${subject} — a practical NEXORA guide focused on real workflows, trade-offs, quality, and what is actually worth using.`,
    type,
    categorySlug,
    authorSlug,
    heroImageUrl,
    tagSlugs,
    content: articleContent([
      { heading: isReview ? "What Stands Out" : "Start With The Real Job", body: isReview ? `The useful question is not whether ${subject} looks impressive in a demo. It is whether the product holds up when it becomes part of a recurring workflow, with real inputs, revisions, constraints, and human review.` : `Start with the recurring problem behind ${subject}. Define the outcome, the inputs, the people involved, and the point where better software would genuinely save time or improve quality.` },
      { heading: "Where It Creates Value", body: `The strongest workflow is usually the one that removes a specific bottleneck without adding a second layer of supervision. For ${subject}, that means using the technology for the parts it handles consistently while keeping judgment where mistakes are expensive.` },
      { heading: "The Trade-Offs", body: `Speed, quality, cost, integrations, privacy, context, and reliability can pull in different directions. Test ${subject} with realistic material before deciding that a feature list or benchmark tells the whole story.` },
      { heading: "Practical Verdict", body: `The premium approach is selective: keep the parts of ${subject} that measurably improve the workflow, document the process, verify important outputs, and remove anything that creates more work than it saves.` },
    ]),
  }
}

const ADDITIONAL_ARTICLES: ArticleSeed[] = [
  generatedArticle('chatgpt-review-2026', 'ChatGPT Review 2026: What It Is Actually Good At', 'ai-assistants', 'marcus-webb', 'REVIEW', 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=1600&q=85', ['reviews', 'ai-tools', 'llm']),
  generatedArticle('gemini-review-2026', 'Gemini Review 2026: Is Google’s AI Ecosystem the Real Advantage?', 'ai-assistants', 'elena-cho', 'REVIEW', 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1600&q=85', ['reviews', 'ai-tools', 'research']),
  generatedArticle('perplexity-review-2026', 'Perplexity Review 2026: The AI Search Workflow Worth Knowing', 'ai-assistants', 'marcus-webb', 'REVIEW', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=85', ['reviews', 'research', 'ai-tools']),
  generatedArticle('choose-ai-assistant-2026', 'How to Choose an AI Assistant in 2026 Without Falling for the Hype', 'ai-assistants', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-tools', 'llm']),
  generatedArticle('best-ai-writing-tools-2026', 'Best AI Writing Tools in 2026: What Actually Improves Your Drafts?', 'ai-writing', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-writing', 'ai-tools']),
  generatedArticle('ai-prompt-framework-2026', 'The 7-Part AI Prompt Framework for Better Results', 'ai-writing', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=85', ['guides', 'prompting', 'llm']),
  generatedArticle('ai-content-fact-checking-guide', 'How to Fact-Check AI-Written Content Before Publishing', 'ai-writing', 'marcus-webb', 'GUIDE', 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-writing', 'research']),
  generatedArticle('ai-writing-workflow-for-bloggers', 'A Human-Led AI Writing Workflow for Bloggers and Publishers', 'ai-writing', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-writing', 'productivity']),
  generatedArticle('midjourney-prompting-guide-2026', 'How to Prompt Midjourney for More Consistent Visuals', 'ai-image', 'marcus-webb', 'GUIDE', 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-image', 'prompting']),
  generatedArticle('ai-image-tools-for-marketers', 'AI Image Tools for Marketing: A Practical 2026 Workflow', 'ai-image', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-image', 'marketing']),
  generatedArticle('ai-image-consistency-guide', 'How to Keep AI-Generated Brand Images Consistent', 'ai-image', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-image', 'design']),
  generatedArticle('ai-image-disclosure-guide', 'AI-Generated Images: What Publishers and Brands Should Disclose', 'ai-image', 'marcus-webb', 'GUIDE', 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1600&q=85', ['guides', 'ai-image', 'business-ai']),
  generatedArticle('ai-automation-workflow-guide', 'How to Design AI Automations That Do More Than Move Data', 'automation', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=85', ['guides', 'automation', 'ai-agents']),
  generatedArticle('ai-email-automation-guide-2026', 'How to Automate Email Triage With AI Without Losing Control', 'automation', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1600&q=85', ['guides', 'automation', 'productivity']),
  generatedArticle('ai-automation-roi-guide', 'How to Calculate the ROI of an AI Automation', 'automation', 'marcus-webb', 'GUIDE', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85', ['guides', 'automation', 'business-ai']),
  generatedArticle('business-ai-adoption-roadmap-2026', 'Business AI Adoption in 2026: A Roadmap That Starts With Work', 'business-ai', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=85', ['guides', 'business-ai', 'future-of-work']),
  generatedArticle('small-business-ai-policy', 'The Small Business AI Policy: What You Actually Need', 'business-ai', 'marcus-webb', 'GUIDE', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=85', ['guides', 'business-ai', 'ai-tools']),
  generatedArticle('ai-customer-support-workflow', 'AI Customer Support: Where Automation Helps and Where Humans Should Stay', 'business-ai', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85', ['guides', 'business-ai', 'automation']),
  generatedArticle('ai-meeting-productivity-guide', 'AI Meetings in 2026: Turn Conversations Into Work, Not Just Summaries', 'business-ai', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=85', ['guides', 'business-ai', 'productivity']),
  generatedArticle('cursor-review-2026', 'Cursor Review 2026: Is the AI Coding Workflow Actually Faster?', 'developer-tools', 'marcus-webb', 'REVIEW', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=85', ['reviews', 'developer-tools', 'ai-tools']),
  generatedArticle('github-copilot-review-2026', 'GitHub Copilot Review 2026: Where It Fits in a Real Development Team', 'developer-tools', 'marcus-webb', 'REVIEW', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85', ['reviews', 'developer-tools', 'ai-tools']),
  generatedArticle('ai-code-review-guide', 'How to Use AI for Code Review Without Replacing Engineers', 'developer-tools', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1600&q=85', ['guides', 'developer-tools', 'ai-agents']),
  generatedArticle('ai-developer-tools-stack-2026', 'The AI Developer Stack in 2026: What Belongs in Your Workflow?', 'developer-tools', 'marcus-webb', 'GUIDE', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=85', ['guides', 'developer-tools', 'ai-tools']),
  generatedArticle('notion-ai-productivity-review-2026', 'Notion AI Review 2026: Does AI Actually Improve Your Workspace?', 'productivity', 'marcus-webb', 'REVIEW', 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=85', ['reviews', 'productivity', 'ai-tools']),
  generatedArticle('ai-personal-productivity-system', 'How to Build a Personal AI Productivity System That You Will Actually Use', 'productivity', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85&sat=-10', ['guides', 'productivity', 'ai-tools']),
  generatedArticle('ai-research-workflow-for-professionals', 'The AI Research Workflow for Professionals: Search, Sources, Synthesis', 'productivity', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1600&q=85', ['guides', 'research', 'productivity']),
  generatedArticle('ai-focus-time-system', 'How to Use AI to Protect Focus Time Instead of Filling Your Calendar', 'productivity', 'elena-cho', 'GUIDE', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1600&q=85', ['guides', 'productivity', 'ai-tools']),
]


const ARTICLE_DEFINITIONS: ArticleSeed[] = [
  {
    slug: "claude-review-2026",
    title: "Claude Review 2026: What Actually Happens When You Use It Daily",
    excerpt:
      "Past the launch-day hype, here's where Claude actually earns its keep once it becomes part of your daily workflow.",
    type: "REVIEW",
    categorySlug: "ai-assistants",
    authorSlug: "marcus-webb",
    heroImageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["reviews", "ai-tools", "llm"],
    featured: true,
    content: articleContent([
      {
        heading: "Introduction",
        body: "Claude is Anthropic's assistant, and it's usually described in terms of benchmarks. What matters more day to day is simpler: does it hold up once you're actually leaning on it for real work, not a demo prompt? This review is about that.",
      },
      {
        heading: "The Key Idea",
        body: "Claude's real strength is sustained attention across long, messy context. Paste in a full contract, a codebase, or a stack of meeting notes, and you tend to get coherent, specific output back — not a generic summary that could apply to any document.",
      },
      {
        heading: "How To Actually Use It Well",
        body: "Start with real material instead of toy prompts: your own draft, your own data, your own code. Use Projects (or a pinned long chat) to keep context specific to one client or codebase instead of starting fresh every time. Treat the first response as a draft to edit, not a final answer to copy-paste.",
      },
      {
        heading: "Where It Shines In Practice",
        body: "Turning rough meeting notes into a clean client email. Reviewing a lease or contract clause by clause and flagging what's unusual. Taking a messy, half-formed project plan and restructuring it into something a team can actually follow.",
      },
      {
        heading: "Mistakes People Make",
        body: "Using it like a search engine for fast-moving facts, where it can be confidently out of date. Pasting sensitive client or company data in without checking policy first. Accepting the first draft as done instead of editing it — it's a strong first pass, not a final one.",
      },
      {
        heading: "Who It's Actually For",
        body: "Writers, analysts, and anyone whose work involves long or dense documents rather than quick trivia lookups. Less essential if all you want is a fast one-line answer.",
      },
      {
        heading: "Limitations Worth Knowing",
        body: "The free tier has real usage caps that a heavy workday can hit. Memory across separate chats isn't automatic unless you turn related features on. And like any model, it can state something incorrect with total confidence — worth double-checking anything load-bearing.",
      },
      {
        heading: "Verdict",
        body: "Worth using seriously if your work is document- or code-heavy. Overkill if you just want quick answers to simple questions — a lighter tool will feel faster for that.",
      },
    ]),
  },
  {
    slug: "how-to-write-better-ai-prompts",
    title: "How to Write Better AI Prompts",
    excerpt:
      "Prompting is a skill, not luck. Small, specific changes to how you ask consistently change how useful the answer is.",
    type: "GUIDE",
    categorySlug: "ai-writing",
    authorSlug: "elena-cho",
    heroImageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["guides", "prompting", "ai-writing"],
    featured: true,
    content: articleContent([
      {
        heading: "Introduction",
        body: "Two people can type completely different prompts into the same model and get wildly different quality back. That gap is closeable, and it doesn't take long to learn.",
      },
      {
        heading: "The Key Idea",
        body: "A model can't read your mind about context it doesn't have. Almost every prompting problem is fixed the same way: give it what a smart new hire would need to do the task well — goal, audience, constraints, and an example of 'good.'",
      },
      {
        heading: "Practical Steps",
        body: "State the actual goal, not just the topic. Add real constraints: length, tone, audience, format. Include one or two examples of output you'd consider good. If the task is ambiguous, explicitly ask the model to check with you before proceeding.",
      },
      {
        heading: "An Example",
        body: "'Write a marketing email' produces something generic. 'Write a 150-word email to existing customers announcing a price change, warm but direct tone, and here's an email we sent before that landed well' produces something usable on the first try.",
      },
      {
        heading: "Mistakes To Avoid",
        body: "Vague, one-line requests with no format spec. Expecting the first attempt to be perfect instead of iterating. Not telling it who the audience is, which is often the single most useful piece of context you can add.",
      },
      {
        heading: "Who This Is For",
        body: "Anyone using AI tools for real, recurring work — not just casual one-off questions, where none of this matters as much.",
      },
      {
        heading: "Limitations",
        body: "A great prompt can't fix a genuine factual gap. If something matters and you're not sure it's right, verify it independently rather than prompting harder.",
      },
      {
        heading: "Conclusion",
        body: "Treat prompting like briefing a capable new collaborator on their first day. The clearer the brief, the less back-and-forth you'll need.",
      },
    ]),
  },
  {
    slug: "midjourney-review-2026",
    title: "Midjourney Review 2026: Is It Really Worth It?",
    excerpt:
      "Midjourney still sets the default look for AI art. Here's what that's actually worth once you factor in the price and the learning curve.",
    type: "REVIEW",
    categorySlug: "ai-image",
    authorSlug: "marcus-webb",
    heroImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["reviews", "ai-tools", "ai-image"],
    content: articleContent([
      {
        heading: "Introduction",
        body: "Midjourney has been the reference point for AI image generation's default aesthetic for years now. The question worth asking in 2026 isn't whether it's good — it's whether it's still the right tool for what you're doing.",
      },
      {
        heading: "The Key Idea",
        body: "Its strength is a distinctive, painterly house style that looks good with minimal prompting effort, at the cost of a less approachable interface than typing into a chat window.",
      },
      {
        heading: "How To Actually Use It Well",
        body: "Start with short, simple prompts before reaching for advanced parameters. Once comfortable, use style and reference-image controls to steer toward a specific look. Always generate a batch and pick, rather than expecting the first image to be the one.",
      },
      {
        heading: "Where It Shines In Practice",
        body: "Concept art for a game or film pitch. Mood-board visuals for a creative brief. Personal art experiments where a striking, stylized look matters more than literal accuracy.",
      },
      {
        heading: "Mistakes People Make",
        body: "Expecting photorealistic product shots straight out of the box — that's not its strength. Ignoring the commercial licensing terms that apply once you're using output professionally. Over-engineering a prompt instead of just generating a few variations quickly.",
      },
      {
        heading: "Who It's Actually For",
        body: "Artists, concept designers, and anyone who wants a strong default aesthetic rather than precise photorealism or exact text rendering.",
      },
      {
        heading: "Limitations Worth Knowing",
        body: "No meaningful free tier remains. It's noticeably weaker than some competitors at rendering legible text inside images. There's a real learning curve before you're getting consistent, controlled results.",
      },
      {
        heading: "Verdict",
        body: "Still a strong pick for stylized image work and concept art. Less ideal if your actual need is photoreal product photography or text-heavy graphics.",
      },
    ]),
  },
  {
    slug: "zapier-review-2026",
    title: "Zapier Review 2026: What We Learned After Testing Real Workflows",
    excerpt:
      "Zapier popularized no-code automation. Here's what held up — and what got expensive — once the workflows got slightly more real.",
    type: "REVIEW",
    categorySlug: "automation",
    authorSlug: "marcus-webb",
    heroImageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["reviews", "ai-tools", "automation"],
    featured: true,
    content: articleContent([
      {
        heading: "Introduction",
        body: "Zapier is the tool most people mean when they say 'just automate it.' This review looks at what actually holds up once a workflow gets past a single trivial step.",
      },
      {
        heading: "The Key Idea",
        body: "Its strength is breadth of integrations, not depth of logic. Thousands of apps connect in minutes, but complex branching conditions get fiddly and expensive fast as task counts climb.",
      },
      {
        heading: "How To Actually Use It Well",
        body: "Start with one single trigger-to-action zap that solves one real, specific annoyance. Only add multi-step complexity once that simple version has proven reliable for a few weeks.",
      },
      {
        heading: "Where It Shines In Practice",
        body: "A new form submission posting straight to a Slack channel. A new customer automatically getting a CRM record and a welcome email. A calendar event automatically saving meeting notes to the right folder.",
      },
      {
        heading: "Mistakes People Make",
        body: "Building a fragile ten-step zap before a one-step version has been tested and trusted. Ignoring task-count pricing until a surprising bill arrives. Not planning for what happens when a step fails partway through.",
      },
      {
        heading: "Who It's Actually For",
        body: "Small teams and solo operators automating repetitive app-to-app busywork without wanting to hire an engineer to do it.",
      },
      {
        heading: "Limitations Worth Knowing",
        body: "Pricing scales with 'tasks' and becomes real money once usage is serious. Genuinely complex conditional logic is often easier to build and maintain in code. Integration lag between apps shows up occasionally.",
      },
      {
        heading: "Verdict",
        body: "An excellent starting point for automation. Teams with heavier logic needs tend to eventually outgrow it into code-based tools for the trickiest workflows, while keeping Zapier for the simple ones.",
      },
    ]),
  },
  {
    slug: "how-to-build-an-ai-workflow",
    title: "How to Build an AI Workflow",
    excerpt:
      "There's a real gap between using AI tools occasionally and having an actual AI workflow. The difference is repeatability.",
    type: "GUIDE",
    categorySlug: "automation",
    authorSlug: "elena-cho",
    heroImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["guides", "automation", "productivity"],
    content: articleContent([
      {
        heading: "Introduction",
        body: "Plenty of people use AI tools daily without ever building an actual workflow around them. A workflow is different from a habit — it's a fixed, repeatable sequence other people can rely on too.",
      },
      {
        heading: "The Key Idea",
        body: "A real workflow has four parts: a trigger, an AI step, a human check, and an output. Skip the human check on anything customer-facing and you're taking on risk you probably don't need to.",
      },
      {
        heading: "Practical Steps",
        body: "Map the manual process exactly as it happens today, before changing anything. Find the single step AI genuinely speeds up — usually a first draft, not a final decision. Add a human review checkpoint before anything goes out the door. Automate the triggering step last, once the middle is trusted.",
      },
      {
        heading: "Examples",
        body: "An inbound lead where AI drafts a personalized reply, a human approves it, and it auto-sends. A meeting recording where AI writes the summary and it's auto-posted to the team channel after a quick glance.",
      },
      {
        heading: "Mistakes To Avoid",
        body: "Automating the entire chain before trusting any single step in isolation. Skipping the human checkpoint on anything a customer will see. Having no fallback plan for when the AI step produces something unusable.",
      },
      {
        heading: "Who This Is For",
        body: "Small teams trying to remove repetitive work without losing quality control over what actually goes out.",
      },
      {
        heading: "Limitations",
        body: "Workflows need occasional maintenance as the underlying tools and APIs change. Not every process actually benefits from automation — some are rare enough that doing them manually is still faster.",
      },
      {
        heading: "Conclusion",
        body: "Start narrow, prove one step genuinely works, then expand. Workflows that try to do everything at once tend to be the ones that break first.",
      },
    ]),
  },
  {
    slug: "what-beginners-get-wrong-about-business-ai-adoption",
    title: "What Most Beginners Get Wrong About Business AI Adoption",
    excerpt:
      "Most failed AI rollouts fail on process, not model quality. Here's the pattern behind the ones that actually stick.",
    type: "GUIDE",
    categorySlug: "business-ai",
    authorSlug: "elena-cho",
    heroImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["guides", "business-ai", "future-of-work"],
    content: articleContent([
      {
        heading: "Introduction",
        body: "It's tempting to treat an AI rollout like a software rollout: buy the license, send an announcement, done. The teams that actually see results almost never start that way.",
      },
      {
        heading: "The Key Idea",
        body: "Buying a tool isn't a strategy. The rollouts that stick start with one painful, well-defined problem, not a company-wide mandate to 'use AI more.'",
      },
      {
        heading: "Practical Steps",
        body: "Pick one measurable bottleneck instead of a vague goal. Pilot it with a small, willing team rather than the whole company. Measure before and after with a real number. Only expand once that number actually moved.",
      },
      {
        heading: "Examples",
        body: "A support team piloting AI-drafted replies for a single, high-volume ticket category before touching the rest. A sales team testing AI call summaries with two reps before rolling it out to the full floor.",
      },
      {
        heading: "Mistakes To Avoid",
        body: "Mandating a tool top-down with no training or support. Skipping a data and privacy review before real customer information touches a new tool. Expecting full automation on day one instead of assistance that a human still checks.",
      },
      {
        heading: "Who This Is For",
        body: "Managers and operators evaluating their first real AI rollout, beyond individual employees just using tools on their own.",
      },
      {
        heading: "Limitations",
        body: "Adoption still takes genuine change-management effort — tooling alone doesn't fix an unclear or broken process underneath it.",
      },
      {
        heading: "Conclusion",
        body: "Narrow pilots that prove real value consistently beat company-wide mandates that mostly create resistance.",
      },
    ]),
  },
  {
    slug: "cursor-review-2026",
    title: "Cursor Review 2026: The Features Most People Miss",
    excerpt:
      "Most people try Cursor for the autocomplete and miss the two features that actually change how you work in an existing codebase.",
    type: "REVIEW",
    categorySlug: "developer-tools",
    authorSlug: "marcus-webb",
    heroImageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["reviews", "ai-tools", "developer-tools"],
    featured: true,
    content: articleContent([
      {
        heading: "Introduction",
        body: "Cursor gets pitched as 'VS Code with AI,' which undersells it. Used well, it's closer to a second developer who's already read the whole repo.",
      },
      {
        heading: "The Key Idea",
        body: "The real value isn't autocomplete — it's codebase-aware chat and multi-file edits. It can reason about how a change in one file ripples into three others, which a simple autocomplete tool can't do.",
      },
      {
        heading: "How To Actually Use It Well",
        body: "Point it at an existing, real repository rather than a toy project first. Use inline chat for small, contained edits and agent mode for larger multi-file changes. Always review the diff before accepting — treat it like a fast junior engineer's pull request.",
      },
      {
        heading: "Where It Shines In Practice",
        body: "Refactoring a function that's called across a dozen files. Generating tests for existing, undocumented code. Onboarding into an unfamiliar codebase faster by asking it to explain what a module actually does.",
      },
      {
        heading: "Mistakes People Make",
        body: "Accepting large multi-file changes without actually reading the diff. Using it on code you don't understand well enough to properly review. Skipping version control safety nets before letting it make sweeping edits.",
      },
      {
        heading: "Who It's Actually For",
        body: "Developers working in real, existing codebases day to day, more than people writing small greenfield toy projects from scratch.",
      },
      {
        heading: "Limitations Worth Knowing",
        body: "The subscription cost adds up for a whole team. It can be confidently wrong on unfamiliar or niche frameworks. It still needs a human doing real code review before anything ships.",
      },
      {
        heading: "Verdict",
        body: "A genuine productivity gain for working developers — not a replacement for code review discipline, but a strong argument for why that discipline still matters.",
      },
    ]),
  },
  {
    slug: "notion-ai-review-2026",
    title: "Notion AI Review 2026: Before You Pay for the AI Add-On",
    excerpt:
      "Notion's core workspace is free and excellent. Here's what to actually check before paying for the AI layer on top of it.",
    type: "REVIEW",
    categorySlug: "productivity",
    authorSlug: "marcus-webb",
    heroImageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&q=85",
    tagSlugs: ["reviews", "ai-tools", "productivity"],
    content: articleContent([
      {
        heading: "Introduction",
        body: "Notion's free workspace is good enough that plenty of teams never look past it. The AI add-on is the part actually worth scrutinizing before paying for it.",
      },
      {
        heading: "The Key Idea",
        body: "It's most useful woven directly into docs you're already writing in Notion — summarizing a page, drafting from a database, autofilling table properties — and noticeably less useful as a standalone general chatbot.",
      },
      {
        heading: "How To Actually Use It Well",
        body: "Try the free included credits on real, existing pages before subscribing to anything. Specifically test the database autofill and workspace Q&A features, since those are the parts that are genuinely hard to replace with a separate tool.",
      },
      {
        heading: "Where It Shines In Practice",
        body: "Auto-summarizing a long page of meeting notes. Drafting a first-pass project brief straight from a template. Answering 'what did we decide about this' by searching across your team's own existing workspace.",
      },
      {
        heading: "Mistakes People Make",
        body: "Subscribing before specifically testing the workspace-search feature, which is the actual differentiator. Expecting it to match a dedicated general-purpose chatbot on broad knowledge questions unrelated to your workspace.",
      },
      {
        heading: "Who It's Actually For",
        body: "Teams whose knowledge already genuinely lives in Notion and want answers grounded in their own docs — not people shopping for a general-purpose assistant from scratch.",
      },
      {
        heading: "Limitations Worth Knowing",
        body: "A paid tier is required for real, regular use. Quality depends heavily on how well-organized the underlying workspace already is — it can't summarize structure that was never there.",
      },
      {
        heading: "Verdict",
        body: "Worth it if your team's knowledge already lives in Notion. Skip it if you're evaluating AI tools generally, from a blank slate.",
      },
    ]),
  },
  ...ADDITIONAL_ARTICLES,
]



// ---------------------------------------------------------------------------
// 7. COMPARISON — ChatGPT vs Claude
// ---------------------------------------------------------------------------

const COMPARISON = {
  slug: "chatgpt-vs-claude",
  title: "ChatGPT vs Claude: The Real Difference Between Them",
  summary:
    "An honest, task-by-task comparison instead of a single declared winner — because the real answer depends on what you're actually using it for.",
  toolASlug: "chatgpt",
  toolBSlug: "claude",
  content: articleContent([
    {
      heading: "General Use",
      body: "Both are strong generalists for everyday questions and drafting. ChatGPT carries the broader third-party plugin and app ecosystem; Claude tends to stay more consistent across long, careful tasks.",
    },
    {
      heading: "Writing",
      body: "Claude is often preferred for longer, more nuanced writing and editing passes. ChatGPT is fast and flexible for short-form copy and open-ended brainstorming.",
    },
    {
      heading: "Coding",
      body: "Both are strong here. Claude shows up heavily in editors like Cursor for larger refactors and codebase-aware work; ChatGPT integrates broadly across a wide range of third-party developer tools.",
    },
    {
      heading: "Research",
      body: "ChatGPT's search integration is fast for quick lookups. Claude's strength shows more when synthesizing something you've already handed it directly — a document, a codebase — than in open-ended web research.",
    },
    {
      heading: "Reasoning",
      body: "Both offer extended-thinking-style modes for harder problems. The practical gap is usually task-specific rather than one model being categorically ahead of the other.",
    },
    {
      heading: "Long-Form Work",
      body: "Claude's context handling and steadiness across long documents is a consistent standout, especially past the length where other tools start losing the thread.",
    },
    {
      heading: "Ecosystem",
      body: "ChatGPT has the larger consumer-brand footprint and third-party app ecosystem. Claude integrates deeply into developer tools and enterprise workflows.",
    },
    {
      heading: "Workflow Fit",
      body: "Pick based on where the actual work happens. Heavy document or code work leans Claude. Broad everyday assistant use works well with either, with ChatGPT's ecosystem often the tie-breaker.",
    },
  ]),
  faq: [
    {
      question: "Which one should I pick if I can only use one?",
      answer:
        "It depends on the work. Long documents and code work lean Claude; broad everyday use with lots of third-party integrations leans ChatGPT.",
    },
    {
      question: "Is one objectively smarter than the other?",
      answer:
        "No single model wins every benchmark or every task. In practice the gap is usually smaller than task fit — what you're using it for matters more than which one 'wins.'",
    },
    {
      question: "Can I use both for free?",
      answer: "Yes — both have functioning free tiers with their own usage caps.",
    },
  ] satisfies { question: string; answer: string }[],
}

// ---------------------------------------------------------------------------
// 8. SITE SETTINGS
// ---------------------------------------------------------------------------

const SITE_SETTINGS = {
  id: "singleton",
  siteTitle: "NEXORA — AI Tools, Agents, Automation & The Future of Work",
  siteDescription:
    "Practical reviews, comparisons, and guides covering AI tools, AI agents, automation, and business AI — built for people deciding what to actually use, not just what's new.",
  newsletterEnabled: true,
  seoDefaultTitle: "NEXORA — AI Tools, Agents & Automation",
  seoDefaultDescription:
    "Independent reviews, comparisons, and practical guides on AI tools, AI agents, automation, and business AI.",
}

// ---------------------------------------------------------------------------
// 9. MAIN
// ---------------------------------------------------------------------------

async function main() {
  console.log("[seed] Starting NEXORA seed...")

  // --- Categories ---
  const categoryIdBySlug = new Map<string, string>()
  for (const c of CATEGORIES) {
    const record = await prisma.toolCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    })
    categoryIdBySlug.set(c.slug, record.id)
  }

  // --- Tags ---
  const tagIdBySlug = new Map<string, string>()
  for (const name of TAG_NAMES) {
    const slug = slugify(name)
    const record = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    })
    tagIdBySlug.set(slug, record.id)
  }

  // --- Authors ---
  const authorIdBySlug = new Map<string, string>()
  for (const a of AUTHORS) {
    const record = await prisma.author.upsert({
      where: { slug: a.slug },
      update: { name: a.name, role: a.role, bio: a.bio },
      create: { slug: a.slug, name: a.name, role: a.role, bio: a.bio },
    })
    authorIdBySlug.set(a.slug, record.id)
  }

  // --- Tools ---
  const toolIdBySlug = new Map<string, string>()
  for (const t of TOOLS) {
    const categoryId = categoryIdBySlug.get(t.categorySlug)
    if (!categoryId) {
      throw new Error(`[seed] Tool "${t.slug}" references missing category "${t.categorySlug}"`)
    }
    const data = {
      name: t.name,
      description: t.description,
      websiteUrl: t.websiteUrl,
      logoUrl: faviconFor(t.websiteUrl),
      pricing: t.pricing === "FREE" ? Pricing.FREE : Pricing.PAID,
      featured: t.featured ?? false,
      categoryId,
    }
    const record = await prisma.tool.upsert({
      where: { slug: t.slug },
      update: data,
      create: { slug: t.slug, ...data },
    })
    toolIdBySlug.set(t.slug, record.id)
  }

  // --- Articles (+ tag relations) ---
  let articlesWritten = 0
  for (const a of ARTICLE_DEFINITIONS) {
    const categoryId = categoryIdBySlug.get(a.categorySlug)
    if (!categoryId) {
      throw new Error(`[seed] Article "${a.slug}" references missing category "${a.categorySlug}"`)
    }
    const authorId = authorIdBySlug.get(a.authorSlug)
    if (!authorId) {
      throw new Error(`[seed] Article "${a.slug}" references missing author "${a.authorSlug}"`)
    }

    const data = {
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      heroImageUrl: a.heroImageUrl,
      type: a.type === "REVIEW" ? ArticleType.REVIEW : ArticleType.GUIDE,
      featured: a.featured ?? false,
      trending: a.trending ?? false,
      categoryId,
      authorId,
    }
    const article = await prisma.article.upsert({
      where: { slug: a.slug },
      update: data,
      create: { slug: a.slug, ...data },
    })

    // Idempotent tag sync: clear old relations, recreate the current set.
    await prisma.articleTag.deleteMany({ where: { articleId: article.id } })
    for (const tagSlug of a.tagSlugs) {
      const tagId = tagIdBySlug.get(tagSlug)
      if (!tagId) {
        throw new Error(`[seed] Article "${a.slug}" references missing tag "${tagSlug}"`)
      }
      await prisma.articleTag.create({ data: { articleId: article.id, tagId } })
    }
    articlesWritten += 1
  }

  // --- Comparison: ChatGPT vs Claude ---
  const toolAId = toolIdBySlug.get(COMPARISON.toolASlug)
  const toolBId = toolIdBySlug.get(COMPARISON.toolBSlug)
  if (!toolAId || !toolBId) {
    throw new Error("[seed] Comparison references a tool that was not seeded")
  }
  await prisma.comparison.upsert({
    where: { slug: COMPARISON.slug },
    update: {
      title: COMPARISON.title,
      summary: COMPARISON.summary,
      content: COMPARISON.content,
      faq: COMPARISON.faq as unknown as Prisma.InputJsonValue,
      toolAId,
      toolBId,
    },
    create: {
      slug: COMPARISON.slug,
      title: COMPARISON.title,
      summary: COMPARISON.summary,
      content: COMPARISON.content,
      faq: COMPARISON.faq as unknown as Prisma.InputJsonValue,
      toolAId,
      toolBId,
    },
  })
  console.log("[seed] Comparison created/updated")

  // --- Site settings (singleton row) ---
  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS.id },
    update: {
      siteTitle: SITE_SETTINGS.siteTitle,
      siteDescription: SITE_SETTINGS.siteDescription,
      newsletterEnabled: SITE_SETTINGS.newsletterEnabled,
      seoDefaultTitle: SITE_SETTINGS.seoDefaultTitle,
      seoDefaultDescription: SITE_SETTINGS.seoDefaultDescription,
    },
    create: SITE_SETTINGS,
  })
  console.log("[seed] Site settings created/updated")

  // --- Admin account ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@nexora.dev"
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-before-deploying"
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: { email: adminEmail, password: hashedPassword, name: "NEXORA Admin" },
  })
  console.log(`[seed] Admin account configured for: ${adminEmail}`)

  // ---------------------------------------------------------------------
  // 10. VALIDATION
  // ---------------------------------------------------------------------
  const toolCount = await prisma.tool.count()
  const freeCount = await prisma.tool.count({ where: { pricing: Pricing.FREE } })
  const paidCount = await prisma.tool.count({ where: { pricing: Pricing.PAID } })

  if (toolCount !== TOOLS.length) {
    throw new Error(`[seed] Expected ${TOOLS.length} tools, found ${toolCount}`)
  }
  if (freeCount !== 25) {
    throw new Error(`[seed] Expected 25 free tools, found ${freeCount}`)
  }
  if (paidCount !== 25) {
    throw new Error(`[seed] Expected 25 paid tools, found ${paidCount}`)
  }

  const articleCount = await prisma.article.count()
  if (articleCount !== TOTAL_ARTICLE_TARGET) {
    throw new Error(`[seed] Expected exactly ${TOTAL_ARTICLE_TARGET} articles, found ${articleCount}`)
  }
  for (const slug of CORE_CATEGORY_SLUGS) {
    const categoryId = categoryIdBySlug.get(slug)
    if (!categoryId) throw new Error(`[seed] Missing core category: ${slug}`)
    const count = await prisma.article.count({ where: { categoryId } })
    if (count !== ARTICLES_PER_CORE_CATEGORY_TARGET) {
      throw new Error(`[seed] Category ${slug} expected ${ARTICLES_PER_CORE_CATEGORY_TARGET} articles, found ${count}`)
    }
  }

  const chatgpt = await prisma.tool.findUnique({ where: { slug: "chatgpt" } })
  if (!chatgpt) throw new Error("[seed] ChatGPT tool is missing")
  const claude = await prisma.tool.findUnique({ where: { slug: "claude" } })
  if (!claude) throw new Error("[seed] Claude tool is missing")

  const comparisonRecord = await prisma.comparison.findUnique({ where: { slug: COMPARISON.slug } })
  if (!comparisonRecord) throw new Error("[seed] ChatGPT vs Claude comparison is missing")

  const settingsRecord = await prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS.id } })
  if (!settingsRecord) throw new Error("[seed] Site settings are missing")

  for (const slug of CORE_CATEGORY_SLUGS) {
    if (!categoryIdBySlug.has(slug)) {
      throw new Error(`[seed] Core category "${slug}" was not seeded`)
    }
  }

  console.log(`[seed] Tools: ${toolCount} total (${freeCount} free, ${paidCount} paid)`)
  console.log(`[seed] Articles created/updated: ${articleCount}`)
  console.log("[seed] Validation passed")
  console.log("[seed] NEXORA seed completed successfully.")
}

main()
  .catch((error) => {
    console.error("[seed] Error:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
