import { PrismaClient, ArticleStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

/**
 * Development/demo seed data (§39, §84).
 *
 * This data exists purely so the app has something real to render out of the
 * box. Everything here is normal CMS content — an editor can rename,
 * archive, or delete any of it from /admin without touching code. None of
 * it is hard-coded into components; every page reads from these rows
 * through the repositories/services layer.
 */

const CORE_CATEGORIES = [
	{ slug: "ai-agents", name: "AI Agents", description: "Autonomous and multi-agent systems reshaping how work gets done." },
	{ slug: "automation", name: "Automation", description: "Workflow automation, RPA, and orchestration for modern teams." },
	{ slug: "ai-tools", name: "AI Tools", description: "Software built on top of modern AI models." },
	{ slug: "productivity", name: "Productivity", description: "AI-powered productivity workflows and habits." },
	{ slug: "business-ai", name: "Business AI", description: "How companies deploy AI in real operations." },
	{ slug: "reviews", name: "Reviews", description: "Independent, hands-on AI software reviews." },
	{ slug: "guides", name: "Guides", description: "Step-by-step tutorials for working with AI." },
]

const TOOL_CATEGORIES = [
	{ slug: "chatbots", name: "Chatbots & Assistants" },
	{ slug: "writing", name: "Writing & Content" },
	{ slug: "productivity-tools", name: "Productivity" },
	{ slug: "automation-tools", name: "Automation" },
	{ slug: "design", name: "Design & Creative" },
]

async function main() {
	// --- Admin user + author -------------------------------------------------
	// Admin credentials come from the environment so no real/production
	// password is ever hardcoded in source control (Rule 10). When these are
	// not set, the seed falls back to a clearly-labeled DEVELOPMENT-ONLY
	// demo login and prints a loud warning -- this fallback must never be
	// relied on in production.
	const adminEmail = process.env.ADMIN_EMAIL || "admin@nexora.dev"
	const adminPassword = process.env.ADMIN_PASSWORD
	if (!adminPassword) {
		console.warn(
			"[seed] ADMIN_EMAIL/ADMIN_PASSWORD not set -- using a DEVELOPMENT-ONLY demo admin login " +
			"(admin@nexora.dev / NexoraAdmin!2026). Set ADMIN_EMAIL and ADMIN_PASSWORD in your " +
			"environment before seeding a production database.",
		)
	}
	const passwordHash = await bcrypt.hash(adminPassword || "NexoraAdmin!2026", 12)
	const adminUser = await prisma.user.upsert({
		where: { email: adminEmail },
		update: {},
		create: { email: adminEmail, passwordHash, role: "ADMIN" },
	})

	const leadEditor = await prisma.author.upsert({
		where: { slug: "elena-cho" },
		update: {},
		create: {
			slug: "elena-cho",
			name: "Elena Cho",
			role: "Senior AI Editor",
			bio: "Elena covers agentic AI, automation platforms, and enterprise AI adoption. Previously a data infrastructure engineer.",
			userId: adminUser.id,
		},
	})

	const contributingAuthor = await prisma.author.upsert({
		where: { slug: "marcus-webb" },
		update: {},
		create: {
			slug: "marcus-webb",
			name: "Marcus Webb",
			role: "AI Tools Reviewer",
			bio: "Marcus tests and reviews AI software full-time, focusing on real workflows over marketing claims.",
		},
	})

	// --- Categories ------------------------------------------------------------
	const categories = new Map<string, string>()
	for (const category of CORE_CATEGORIES) {
		const row = await prisma.category.upsert({
			where: { slug: category.slug },
			update: {},
			create: category,
		})
		categories.set(category.slug, row.id)
	}

	// --- Tags --------------------------------------------------------------
	const tagNames = ["Multi-Agent", "LLM", "No-Code", "Enterprise", "Prompting", "Case Study"]
	const tagIds = new Map<string, string>()
	for (const name of tagNames) {
		const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
		const row = await prisma.tag.upsert({ where: { slug }, update: {}, create: { slug, name } })
		tagIds.set(name, row.id)
	}

	// --- Tool categories + tools ---------------------------------------------
	const toolCategoryIds = new Map<string, string>()
	for (const toolCategory of TOOL_CATEGORIES) {
		const row = await prisma.toolCategory.upsert({
			where: { slug: toolCategory.slug },
			update: {},
			create: toolCategory,
		})
		toolCategoryIds.set(toolCategory.slug, row.id)
	}

	const tools = [
		{
			slug: "chatgpt",
			name: "ChatGPT",
			categorySlug: "chatbots",
			description: "OpenAI's general-purpose conversational assistant, used for writing, coding, research and more.",
			websiteUrl: "https://chat.openai.com",
			pricing: "Free – $20/mo Plus",
			rating: 4.6,
			pros: ["Extremely versatile", "Strong reasoning and coding support", "Large plugin/GPT ecosystem"],
			cons: ["Can be verbose", "Usage limits on free tier"],
			bestFor: "General-purpose assistance and research",
			features: ["Web browsing", "Code interpreter", "Custom GPTs", "Voice mode"],
			featured: true,
		},
		{
			slug: "claude",
			name: "Claude",
			categorySlug: "chatbots",
			description: "Anthropic's assistant, known for long-context reasoning and careful, well-structured writing.",
			websiteUrl: "https://claude.ai",
			pricing: "Free – $20/mo Pro",
			rating: 4.5,
			pros: ["Excellent long-document handling", "Thoughtful, structured responses"],
			cons: ["Fewer third-party integrations than ChatGPT"],
			bestFor: "Long-form analysis and document review",
			features: ["200K+ token context", "Projects", "Artifacts"],
			featured: true,
		},
		{
			slug: "notion-ai",
			name: "Notion AI",
			categorySlug: "productivity-tools",
			description: "AI features built directly into Notion for drafting, summarizing, and organizing workspace content.",
			websiteUrl: "https://www.notion.so/product/ai",
			pricing: "Add-on from $8/mo per member",
			rating: 4.3,
			pros: ["Deeply integrated with existing docs", "Good for summarizing meeting notes"],
			cons: ["Only useful if you already live in Notion"],
			bestFor: "Teams already using Notion as their workspace",
			features: ["AI autofill", "Q&A over workspace", "Meeting notes"],
			featured: true,
		},
		{
			slug: "jasper",
			name: "Jasper",
			categorySlug: "writing",
			description: "Marketing-focused AI writing platform with brand voice controls and campaign templates.",
			websiteUrl: "https://www.jasper.ai",
			pricing: "From $49/mo",
			rating: 4.0,
			pros: ["Brand voice consistency", "Marketing-specific templates"],
			cons: ["Pricier than general chat assistants"],
			bestFor: "Marketing teams producing on-brand copy at scale",
			features: ["Brand voice", "Campaign templates", "Team workflows"],
			featured: false,
		},
		{
			slug: "zapier",
			name: "Zapier",
			categorySlug: "automation-tools",
			description: "No-code automation platform connecting thousands of apps, now with built-in AI steps.",
			websiteUrl: "https://zapier.com",
			pricing: "Free – usage-based paid tiers",
			rating: 4.4,
			pros: ["Huge app ecosystem", "No-code workflow builder"],
			cons: ["Costs scale quickly with high task volume"],
			bestFor: "Connecting SaaS tools without writing code",
			features: ["6000+ app integrations", "AI-assisted Zap building", "Multi-step workflows"],
			featured: true,
		},
		{
			slug: "midjourney",
			name: "Midjourney",
			categorySlug: "design",
			description: "AI image generation tool known for high aesthetic quality and strong stylistic control.",
			websiteUrl: "https://www.midjourney.com",
			pricing: "From $10/mo",
			rating: 4.5,
			pros: ["Best-in-class image aesthetics", "Active community and style references"],
			cons: ["Discord-based workflow has a learning curve"],
			bestFor: "Concept art, editorial imagery and creative exploration",
			features: ["Style references", "Upscaling", "Web app editor"],
			featured: false,
		},
	]

	const toolIds = new Map<string, string>()
	for (const tool of tools) {
		const row = await prisma.tool.upsert({
			where: { slug: tool.slug },
			update: {},
			create: {
				slug: tool.slug,
				name: tool.name,
				categoryId: toolCategoryIds.get(tool.categorySlug)!,
				description: tool.description,
				websiteUrl: tool.websiteUrl,
				pricing: tool.pricing,
				rating: tool.rating,
				pros: tool.pros,
				cons: tool.cons,
				bestFor: tool.bestFor,
				features: tool.features,
				featured: tool.featured,
				affiliateUrl: null,
				affiliateDisclosure: "Some links to tools on this page are affiliate links. If you buy through them, NEXORA may earn a commission at no extra cost to you. See our affiliate disclosure for details.",
				lastReviewedAt: new Date(),
			},
		})
		toolIds.set(tool.slug, row.id)

		await prisma.review.upsert({
			where: { toolId: row.id },
			update: {},
			create: {
				toolId: row.id,
				summary: `${tool.name} reviewed hands-on by the NEXORA editorial team.`,
				body: `<p>We tested ${tool.name} across real workflows for two weeks before publishing this review. ${tool.description}</p><p>Overall, it performs well for its core use case: ${tool.bestFor}.</p>`,
				faq: [
					{ question: `Is ${tool.name} worth it?`, answer: `For teams whose main need is ${tool.bestFor?.toLowerCase()}, yes — see the pros and cons above for tradeoffs.` },
				],
			},
		})
	}

	await prisma.comparison.upsert({
		where: { slug: "chatgpt-vs-claude" },
		update: {},
		create: {
			slug: "chatgpt-vs-claude",
			title: "ChatGPT vs Claude: Which AI Assistant Should You Use?",
			summary: "A side-by-side look at OpenAI's ChatGPT and Anthropic's Claude across reasoning, writing, coding and pricing.",
			toolAId: toolIds.get("chatgpt")!,
			toolBId: toolIds.get("claude")!,
			winnerToolId: null,
			featureTable: [
				{ feature: "Context window", toolA: "128K tokens", toolB: "200K tokens" },
				{ feature: "Plugin ecosystem", toolA: "Custom GPTs, plugins", toolB: "Projects, Artifacts" },
				{ feature: "Starting price", toolA: "Free / $20 mo", toolB: "Free / $20 mo" },
			],
			verdict: "<p>Both are excellent general-purpose assistants. Choose ChatGPT if you want the broadest ecosystem and voice features; choose Claude if you work with very long documents and prefer more structured writing.</p>",
			faq: [{ question: "Can I use both?", answer: "Yes — many teams use ChatGPT and Claude side by side for different tasks." }],
		},
	})

	// --- Articles ------------------------------------------------------------
	const articles: Array<{
		slug: string
		title: string
		excerpt: string
		content: string
		categorySlug: string
		authorId: string
		status: ArticleStatus
		featured?: boolean
		trending?: boolean
		tags?: string[]
		readingTime?: number
	}> = [
		{
			slug: "how-ai-agents-are-replacing-repetitive-workflows",
			title: "How AI Agents Are Replacing Repetitive Workflows",
			excerpt: "Autonomous agents are quietly taking over the repetitive, multi-step tasks that used to eat up entire workdays.",
			content: "<p>Across support, operations and sales teams, AI agents are being deployed to handle multi-step tasks that once required constant human attention — triaging tickets, updating records, and following up automatically.</p><h2>What changed</h2><p>Longer context windows and reliable tool-calling made it possible for agents to complete entire workflows, not just answer single questions.</p><h2>Where it works best</h2><p>Well-defined, rules-based processes with clear success criteria see the fastest returns.</p>",
			categorySlug: "ai-agents",
			authorId: leadEditor.id,
			status: ArticleStatus.PUBLISHED,
			featured: false,
			trending: true,
			tags: ["Multi-Agent", "Enterprise"],
			readingTime: 6,
		},
		{
			slug: "best-ai-automation-tools-2026",
			title: "Best AI Automation Tools in 2026",
			excerpt: "We tested the leading automation platforms to see which ones actually save teams time this year.",
			content: "<p>Automation tools have moved well beyond simple if-this-then-that rules. Here's what stood out in our testing this year.</p><h2>Our methodology</h2><p>We ran the same five workflows through each platform and measured setup time, reliability and cost.</p>",
			categorySlug: "automation",
			authorId: contributingAuthor.id,
			status: ArticleStatus.PUBLISHED,
			trending: true,
			tags: ["No-Code", "Case Study"],
			readingTime: 8,
		},
		{
			slug: "building-multi-agent-systems-for-your-business",
			title: "Building Multi-Agent Systems for Your Business",
			excerpt: "A practical framework for deciding when multiple coordinated agents make sense — and when one agent is enough.",
			content: "<p>Multi-agent architectures add real complexity, so they should be reserved for problems that a single agent genuinely can't handle well.</p><h2>A simple framework</h2><p>Start with one agent. Split into multiple only when a step needs a fundamentally different tool set or trust boundary.</p>",
			categorySlug: "ai-agents",
			authorId: leadEditor.id,
			status: ArticleStatus.PUBLISHED,
			trending: true,
			tags: ["Multi-Agent", "Enterprise"],
			readingTime: 9,
		},
		{
			slug: "ai-productivity-workflows-that-actually-work",
			title: "AI Productivity Workflows That Actually Work",
			excerpt: "Beyond the hype: the specific, repeatable ways people are using AI to get more done each week.",
			content: "<p>The most durable AI productivity gains tend to be boring: faster first drafts, faster search over your own notes, and fewer context switches.</p>",
			categorySlug: "productivity",
			authorId: contributingAuthor.id,
			status: ArticleStatus.PUBLISHED,
			trending: true,
			tags: ["Prompting"],
			readingTime: 5,
		},
		{
			slug: "the-complete-guide-to-ai-automation-for-businesses",
			title: "The Complete Guide to AI Automation for Businesses",
			excerpt: "Everything a growing company needs to know before rolling out AI automation across email, CRM, documents and analytics.",
			content: "<p>Rolling out AI automation across a whole business works best as a staged process rather than a single big-bang launch.</p><h2>Stage 1: Pick one workflow</h2><p>Choose a process with clear inputs, outputs and a way to measure success.</p><h2>Stage 2: Connect your systems</h2><p>Most of the real work is integration — email, CRM, documents and analytics all need to talk to each other reliably.</p><h2>Stage 3: Expand deliberately</h2><p>Only add new workflows once the first one is stable and trusted by the team using it.</p>",
			categorySlug: "business-ai",
			authorId: leadEditor.id,
			status: ArticleStatus.PUBLISHED,
			featured: true,
			tags: ["Enterprise", "Case Study"],
			readingTime: 11,
		},
		{
			slug: "chatgpt-review-is-it-still-worth-it-in-2026",
			title: "ChatGPT Review: Is It Still Worth It in 2026?",
			excerpt: "An updated, hands-on review of ChatGPT's strengths, weaknesses, and where it fits against newer competitors.",
			content: "<p>We revisited ChatGPT after two weeks of daily use across writing, coding and research tasks.</p>",
			categorySlug: "reviews",
			authorId: contributingAuthor.id,
			status: ArticleStatus.PUBLISHED,
			tags: ["Prompting"],
			readingTime: 7,
		},
		{
			slug: "a-beginners-guide-to-prompting-ai-agents",
			title: "A Beginner's Guide to Prompting AI Agents",
			excerpt: "The core principles for giving agents clear goals, constraints, and tools — explained without the jargon.",
			content: "<p>Prompting an agent is different from prompting a chat model: you're describing a goal and the tools available, not a single response.</p>",
			categorySlug: "guides",
			authorId: leadEditor.id,
			status: ArticleStatus.DRAFT,
			tags: ["Prompting"],
			readingTime: 6,
		},
		{
			slug: "the-future-of-work-is-agentic",
			title: "The Future of Work Is Agentic",
			excerpt: "Why the next wave of workplace software is being built around autonomous agents rather than dashboards.",
			content: "<p>Software is shifting from tools people operate to agents people delegate to — and that changes how teams should think about hiring, training and process design.</p>",
			categorySlug: "ai-agents",
			authorId: leadEditor.id,
			status: ArticleStatus.SCHEDULED,
			tags: ["Multi-Agent"],
			readingTime: 6,
		},
	]

	for (const article of articles) {
		const created = await prisma.article.upsert({
			where: { slug: article.slug },
			update: {},
			create: {
				slug: article.slug,
				title: article.title,
				excerpt: article.excerpt,
				content: article.content,
				heroImage: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80`,
				status: article.status,
				featured: article.featured ?? false,
				trending: article.trending ?? false,
				readingTime: article.readingTime,
				publishedAt: article.status === ArticleStatus.PUBLISHED ? new Date() : null,
				scheduledAt: article.status === ArticleStatus.SCHEDULED ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) : null,
				authorId: article.authorId,
				categoryId: categories.get(article.categorySlug)!,
				seoTitle: article.title,
				seoDescription: article.excerpt,
			},
		})

		for (const tagName of article.tags ?? []) {
			const tagId = tagIds.get(tagName)
			if (!tagId) continue
			await prisma.articleTag.upsert({
				where: { articleId_tagId: { articleId: created.id, tagId } },
				update: {},
				create: { articleId: created.id, tagId },
			})
		}
	}

	// --- Site settings ---------------------------------------------------------
	await prisma.siteSettings.upsert({
		where: { id: "singleton" },
		update: {},
		create: {
			id: "singleton",
			siteName: "NEXORA",
			description: "NEXORA is a premium AI technology publication covering agents, automation, and the future of work.",
			defaultSeoTitle: "NEXORA — AI Agents, Automation & The Future of Work",
			defaultSeoDescription: "In-depth reporting, reviews and guides on AI agents, automation, and business AI.",
			socialLinks: { twitter: "https://twitter.com/nexora", linkedin: "https://linkedin.com/company/nexora" },
			newsletterEnabled: true,
			adsEnabled: false,
			affiliateEnabled: true,
		},
	})

	console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword ? "(from ADMIN_PASSWORD env var)" : "NexoraAdmin!2026 (DEV ONLY -- set ADMIN_PASSWORD for production)"}`)
}

main()
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
