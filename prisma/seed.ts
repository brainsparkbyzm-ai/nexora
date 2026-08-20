import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// ============================================================
// CATEGORIES
// ============================================================

const CORE_CATEGORIES = [
	{
		slug: "ai-agents",
		name: "AI Agents",
		description:
			"AI agents, autonomous systems, multi-agent workflows and agentic software.",
	},
	{
		slug: "automation",
		name: "Automation",
		description:
			"AI automation, workflow automation, integrations and intelligent orchestration.",
	},
	{
		slug: "ai-tools",
		name: "AI Tools",
		description:
			"The best AI software, assistants, generators and productivity tools.",
	},
	{
		slug: "productivity",
		name: "Productivity",
		description:
			"AI-powered productivity systems, workflows, note-taking and knowledge management.",
	},
	{
		slug: "business-ai",
		name: "Business AI",
		description:
			"Practical AI adoption, business workflows, strategy, operations and enterprise AI.",
	},
	{
		slug: "reviews",
		name: "Reviews",
		description:
			"Independent AI software reviews, comparisons, pricing and practical testing.",
	},
	{
		slug: "guides",
		name: "Guides",
		description:
			"Practical step-by-step guides for using AI, automation and modern AI software.",
	},
]

// ============================================================
// TOOL CATEGORIES
// ============================================================

const TOOL_CATEGORIES = [
	{ slug: "chatbots", name: "Chatbots & Assistants" },
	{ slug: "writing", name: "Writing & Content" },
	{ slug: "productivity-tools", name: "Productivity" },
	{ slug: "automation-tools", name: "Automation" },
	{ slug: "design", name: "Design & Creative" },
	{ slug: "developer-tools", name: "Developer Tools" },
]

// ============================================================
// TAGS
// ============================================================

const TAG_NAMES = [
	"AI Agents",
	"Multi-Agent",
	"LLM",
	"Generative AI",
	"No-Code",
	"Enterprise",
	"Automation",
	"Productivity",
	"Business AI",
	"AI Tools",
	"Reviews",
	"Guides",
	"Prompting",
	"AI Writing",
	"AI Image",
	"AI Video",
	"Research",
	"Marketing",
	"Developer Tools",
	"Future of Work",
]

// ============================================================
// 50 TOOLS
// 25 FREE + 25 PAID
// ============================================================

const TOOLS = [
	// ---------------- FREE ----------------

	{
		slug: "chatgpt",
		name: "ChatGPT",
		description:
			"General-purpose AI assistant for writing, research, coding, analysis and everyday productivity.",
		websiteUrl: "https://chatgpt.com",
		pricing: "Free",
		category: "chatbots",
	},
	{
		slug: "claude",
		name: "Claude",
		description:
			"AI assistant for reasoning, long documents, writing, research and software development.",
		websiteUrl: "https://claude.ai",
		pricing: "Free",
		category: "chatbots",
	},
	{
		slug: "gemini",
		name: "Google Gemini",
		description:
			"Google's AI assistant for research, writing, analysis, multimodal tasks and productivity.",
		websiteUrl: "https://gemini.google.com",
		pricing: "Free",
		category: "chatbots",
	},
	{
		slug: "microsoft-copilot",
		name: "Microsoft Copilot",
		description:
			"AI assistant for search, writing, productivity and everyday tasks across Microsoft's ecosystem.",
		websiteUrl: "https://copilot.microsoft.com",
		pricing: "Free",
		category: "chatbots",
	},
	{
		slug: "perplexity",
		name: "Perplexity",
		description:
			"AI-powered answer engine designed for research, search and source-backed responses.",
		websiteUrl: "https://www.perplexity.ai",
		pricing: "Free",
		category: "chatbots",
	},
	{
		slug: "grammarly",
		name: "Grammarly",
		description:
			"AI writing assistant for grammar, clarity, rewriting and professional communication.",
		websiteUrl: "https://www.grammarly.com",
		pricing: "Free",
		category: "writing",
	},
	{
		slug: "quillbot",
		name: "QuillBot",
		description:
			"AI writing and paraphrasing assistant for rewriting, summarizing and improving text.",
		websiteUrl: "https://quillbot.com",
		pricing: "Free",
		category: "writing",
	},
	{
		slug: "rytr",
		name: "Rytr",
		description:
			"AI writing assistant for creating marketing copy, emails, blog content and social posts.",
		websiteUrl: "https://rytr.me",
		pricing: "Free",
		category: "writing",
	},
	{
		slug: "notion",
		name: "Notion",
		description:
			"Workspace for notes, documents, project management and knowledge organization.",
		websiteUrl: "https://www.notion.so",
		pricing: "Free",
		category: "productivity-tools",
	},
	{
		slug: "trello",
		name: "Trello",
		description:
			"Visual project management tool for organizing tasks, workflows and team projects.",
		websiteUrl: "https://trello.com",
		pricing: "Free",
		category: "productivity-tools",
	},
	{
		slug: "clickup",
		name: "ClickUp",
		description:
			"All-in-one productivity and project management platform with AI-assisted workflows.",
		websiteUrl: "https://clickup.com",
		pricing: "Free",
		category: "productivity-tools",
	},
	{
		slug: "zapier",
		name: "Zapier",
		description:
			"Automation platform connecting apps and creating no-code business workflows.",
		websiteUrl: "https://zapier.com",
		pricing: "Free",
		category: "automation-tools",
	},
	{
		slug: "make",
		name: "Make",
		description:
			"Visual automation platform for connecting applications and building complex workflows.",
		websiteUrl: "https://www.make.com",
		pricing: "Free",
		category: "automation-tools",
	},
	{
		slug: "ifttt",
		name: "IFTTT",
		description:
			"Simple automation platform for connecting services and creating trigger-based workflows.",
		websiteUrl: "https://ifttt.com",
		pricing: "Free",
		category: "automation-tools",
	},
	{
		slug: "canva",
		name: "Canva",
		description:
			"Design platform for presentations, social graphics, documents and AI-assisted creative work.",
		websiteUrl: "https://www.canva.com",
		pricing: "Free",
		category: "design",
	},
	{
		slug: "adobe-express",
		name: "Adobe Express",
		description:
			"Accessible creative platform for graphics, social content, video and AI-assisted design.",
		websiteUrl: "https://www.adobe.com/express",
		pricing: "Free",
		category: "design",
	},
	{
		slug: "google-ai-studio",
		name: "Google AI Studio",
		description:
			"Developer-focused environment for experimenting with Google's generative AI models.",
		websiteUrl: "https://aistudio.google.com",
		pricing: "Free",
		category: "developer-tools",
	},
	{
		slug: "hugging-face",
		name: "Hugging Face",
		description:
			"Open AI platform providing models, datasets, demos and developer resources.",
		websiteUrl: "https://huggingface.co",
		pricing: "Free",
		category: "developer-tools",
	},
	{
		slug: "github-copilot-free",
		name: "GitHub Copilot Free",
		description:
			"AI coding assistance for developers with a free usage tier.",
		websiteUrl: "https://github.com/features/copilot",
		pricing: "Free",
		category: "developer-tools",
	},
	{
		slug: "v0-free",
		name: "v0",
		description:
			"AI-powered interface generation and application prototyping from natural language.",
		websiteUrl: "https://v0.dev",
		pricing: "Free",
		category: "developer-tools",
	},
	{
		slug: "replit-free",
		name: "Replit",
		description:
			"Browser-based development environment with AI-assisted coding and application building.",
		websiteUrl: "https://replit.com",
		pricing: "Free",
		category: "developer-tools",
	},
	{
		slug: "cursor-free",
		name: "Cursor",
		description:
			"AI-first code editor with codebase understanding and AI-assisted development workflows.",
		websiteUrl: "https://cursor.com",
		pricing: "Free",
		category: "developer-tools",
	},
	{
		slug: "ideogram-free",
		name: "Ideogram",
		description:
			"AI image generation platform focused on creative visuals and text rendering.",
		websiteUrl: "https://ideogram.ai",
		pricing: "Free",
		category: "design",
	},
	{
		slug: "descript-free",
		name: "Descript",
		description:
			"AI-powered audio and video editor that makes editing possible through text.",
		websiteUrl: "https://www.descript.com",
		pricing: "Free",
		category: "design",
	},
	{
		slug: "gamma",
		name: "Gamma",
		description:
			"AI-powered tool for creating presentations, documents and visual content.",
		websiteUrl: "https://gamma.app",
		pricing: "Free",
		category: "productivity-tools",
	},

	// ---------------- PAID ----------------

	{
		slug: "chatgpt-plus",
		name: "ChatGPT Plus",
		description:
			"Premium ChatGPT plan with expanded access to advanced models and productivity features.",
		websiteUrl: "https://chatgpt.com",
		pricing: "Paid",
		category: "chatbots",
	},
	{
		slug: "claude-pro",
		name: "Claude Pro",
		description:
			"Premium Claude plan providing increased usage and access to advanced capabilities.",
		websiteUrl: "https://claude.ai",
		pricing: "Paid",
		category: "chatbots",
	},
	{
		slug: "gemini-advanced",
		name: "Gemini Advanced",
		description:
			"Premium Gemini experience with advanced AI capabilities and Google ecosystem integration.",
		websiteUrl: "https://gemini.google.com",
		pricing: "Paid",
		category: "chatbots",
	},
	{
		slug: "jasper",
		name: "Jasper",
		description:
			"AI marketing platform for content creation, brand workflows and campaign production.",
		websiteUrl: "https://www.jasper.ai",
		pricing: "Paid",
		category: "writing",
	},
	{
		slug: "copy-ai",
		name: "Copy.ai",
		description:
			"AI platform for marketing content, sales workflows and business process automation.",
		websiteUrl: "https://www.copy.ai",
		pricing: "Paid",
		category: "writing",
	},
	{
		slug: "writesonic",
		name: "Writesonic",
		description:
			"AI content platform for articles, marketing copy, SEO and business content.",
		websiteUrl: "https://writesonic.com",
		pricing: "Paid",
		category: "writing",
	},
	{
		slug: "surfer-seo",
		name: "Surfer SEO",
		description:
			"AI-assisted SEO platform for content optimization, keyword research and search performance.",
		websiteUrl: "https://surferseo.com",
		pricing: "Paid",
		category: "writing",
	},
	{
		slug: "grammarly-pro",
		name: "Grammarly Pro",
		description:
			"Advanced AI writing assistance for professional communication and content creation.",
		websiteUrl: "https://www.grammarly.com",
		pricing: "Paid",
		category: "writing",
	},
	{
		slug: "notion-ai",
		name: "Notion AI",
		description:
			"AI features integrated into Notion for writing, search, summarization and knowledge work.",
		websiteUrl: "https://www.notion.so/product/ai",
		pricing: "Paid",
		category: "productivity-tools",
	},
	{
		slug: "clickup-ai",
		name: "ClickUp AI",
		description:
			"AI productivity features for project management, writing, summaries and team workflows.",
		websiteUrl: "https://clickup.com/ai",
		pricing: "Paid",
		category: "productivity-tools",
	},
	{
		slug: "motion",
		name: "Motion",
		description:
			"AI-powered calendar and task management platform for automated scheduling and planning.",
		websiteUrl: "https://www.usemotion.com",
		pricing: "Paid",
		category: "productivity-tools",
	},
	{
		slug: "reclaim-ai",
		name: "Reclaim AI",
		description:
			"AI scheduling assistant for automatically protecting time for tasks, habits and meetings.",
		websiteUrl: "https://reclaim.ai",
		pricing: "Paid",
		category: "productivity-tools",
	},
	{
		slug: "zapier-premium",
		name: "Zapier",
		description:
			"Advanced automation platform for connecting applications and building scalable workflows.",
		websiteUrl: "https://zapier.com",
		pricing: "Paid",
		category: "automation-tools",
	},
	{
		slug: "make-pro",
		name: "Make",
		description:
			"Advanced visual automation platform for complex integrations and business workflows.",
		websiteUrl: "https://www.make.com",
		pricing: "Paid",
		category: "automation-tools",
	},
	{
		slug: "n8n",
		name: "n8n",
		description:
			"Workflow automation platform designed for technical teams, APIs and AI workflows.",
		websiteUrl: "https://n8n.io",
		pricing: "Paid",
		category: "automation-tools",
	},
	{
		slug: "activepieces",
		name: "Activepieces",
		description:
			"Open-source automation platform for connecting apps and building AI-powered workflows.",
		websiteUrl: "https://www.activepieces.com",
		pricing: "Paid",
		category: "automation-tools",
	},
	{
		slug: "midjourney",
		name: "Midjourney",
		description:
			"AI image generation platform known for high-quality artistic and photorealistic visuals.",
		websiteUrl: "https://www.midjourney.com",
		pricing: "Paid",
		category: "design",
	},
	{
		slug: "ideogram",
		name: "Ideogram",
		description:
			"AI image generation platform for creative visuals, typography and professional design concepts.",
		websiteUrl: "https://ideogram.ai",
		pricing: "Paid",
		category: "design",
	},
	{
		slug: "descript",
		name: "Descript",
		description:
			"AI-powered audio and video editor that makes editing possible through text.",
		websiteUrl: "https://www.descript.com",
		pricing: "Paid",
		category: "design",
	},
	{
		slug: "github-copilot",
		name: "GitHub Copilot Business",
		description:
			"AI coding assistant for professional developers and engineering teams.",
		websiteUrl: "https://github.com/features/copilot",
		pricing: "Paid",
		category: "developer-tools",
	},
	{
		slug: "cursor-pro",
		name: "Cursor Pro",
		description:
			"AI-first code editor with agentic coding, codebase understanding and advanced development workflows.",
		websiteUrl: "https://cursor.com",
		pricing: "Paid",
		category: "developer-tools",
	},
	{
		slug: "replit",
		name: "Replit",
		description:
			"AI-powered development platform for building, deploying and collaborating on applications.",
		websiteUrl: "https://replit.com",
		pricing: "Paid",
		category: "developer-tools",
	},
	{
		slug: "v0",
		name: "v0",
		description:
			"AI development tool for generating web interfaces and application code from natural language.",
		websiteUrl: "https://v0.dev",
		pricing: "Paid",
		category: "developer-tools",
	},
	{
		slug: "lovable",
		name: "Lovable",
		description:
			"AI app builder for creating web applications from natural-language descriptions.",
		websiteUrl: "https://lovable.dev",
		pricing: "Paid",
		category: "developer-tools",
	},
]

// ============================================================
// ARTICLE FACTORY
// ============================================================

function articleContent(
	intro: string,
	sections: Array<[string, string]>,
) {
	return (
		`<p>${intro}</p>` +
		sections
			.map(
				([heading, text]) =>
					`<h2>${heading}</h2><p>${text}</p>`,
			)
			.join("")
	)
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
}

// ============================================================
// ARTICLE DEFINITIONS
// ============================================================

const ARTICLE_DEFINITIONS = [
	// ========================================================
	// AI AGENTS — 5
	// ========================================================

	{
		categorySlug: "ai-agents",
		title:
			"AI Agents Explained: What They Are, How They Work, and What They Can Do",
		excerpt:
			"Learn how AI agents work, how they differ from chatbots, and where autonomous AI can deliver real business value.",
		authorSlug: "elena-cho",
		tags: ["AI Agents", "LLM", "Generative AI"],
		readingTime: 10,
		featured: true,
		content: articleContent(
			"AI agents are software systems that can interpret goals, use tools and take actions with varying degrees of autonomy.",
			[
				[
					"What Is an AI Agent?",
					"An AI agent combines a model with instructions, context, tools and actions to complete a defined objective.",
				],
				[
					"How AI Agents Work",
					"Most agent workflows involve receiving a goal, gathering context, reasoning about the next step, using tools and evaluating results.",
				],
				[
					"AI Agents vs Chatbots",
					"Chatbots primarily respond to conversations, while agents can interact with external systems and complete multi-step tasks.",
				],
				[
					"Where Agents Are Useful",
					"Research, customer support, software development, operations and data processing are common applications.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "AI Agent Architecture: The Components Behind Autonomous AI",
		excerpt:
			"Understand the core components of AI agents, including models, memory, tools, planning, execution and evaluation.",
		authorSlug: "elena-cho",
		tags: ["AI Agents", "Multi-Agent", "LLM"],
		readingTime: 9,
		content: articleContent(
			"Reliable AI agents depend on a collection of components working together rather than on a language model alone.",
			[
				[
					"Model",
					"The model interprets instructions, reasons about available information and generates decisions or outputs.",
				],
				[
					"Memory and Context",
					"Context allows an agent to retain relevant information and work with data from previous steps.",
				],
				[
					"Tools",
					"Tools allow agents to search, call APIs, retrieve data or interact with external software.",
				],
				[
					"Planning and Execution",
					"An agent needs a mechanism for deciding what to do next and executing the selected actions.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "AI Agents vs AI Assistants: What's the Difference?",
		excerpt:
			"Learn the practical difference between AI assistants and autonomous agents and when each approach makes sense.",
		authorSlug: "marcus-webb",
		tags: ["AI Agents", "AI Tools", "LLM"],
		readingTime: 8,
		content: articleContent(
			"AI assistants and AI agents overlap, but they usually differ in how much responsibility they take for completing tasks.",
			[
				[
					"AI Assistants",
					"Assistants typically help users generate information, content, recommendations or decisions.",
				],
				[
					"AI Agents",
					"Agents can take actions across tools and systems to complete a multi-step objective.",
				],
				[
					"When to Use an Assistant",
					"Use an assistant when human judgment should remain central and the AI mainly provides support.",
				],
				[
					"When to Use an Agent",
					"Agents are more useful when a workflow contains repeatable steps that can be executed with controlled autonomy.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "How to Build Your First AI Agent in 2026",
		excerpt:
			"A beginner-friendly framework for designing an AI agent with a clear goal, tools, context, actions and validation.",
		authorSlug: "elena-cho",
		tags: ["AI Agents", "Guides", "Automation"],
		readingTime: 11,
		content: articleContent(
			"Building an AI agent becomes easier when the workflow is designed around one narrow and measurable objective.",
			[
				[
					"Choose One Task",
					"Start with a workflow that is repetitive, well understood and easy to evaluate.",
				],
				[
					"Define the Inputs",
					"Identify the information the agent needs before it can make useful decisions.",
				],
				[
					"Connect Tools",
					"Give the agent only the tools required to complete the workflow.",
				],
				[
					"Add Validation",
					"Important outputs should be checked before the agent performs high-impact actions.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "The Biggest AI Agent Mistakes Companies Make",
		excerpt:
			"Avoid common AI agent implementation mistakes involving scope, reliability, permissions, monitoring and human oversight.",
		authorSlug: "marcus-webb",
		tags: ["AI Agents", "Enterprise", "Guides"],
		readingTime: 9,
		content: articleContent(
			"AI agents can create significant value, but poorly designed systems can introduce unnecessary operational and security risks.",
			[
				[
					"Starting Too Broad",
					"Large autonomous projects are harder to evaluate and maintain than focused workflows.",
				],
				[
					"Giving Excessive Permissions",
					"Agents should receive only the access required to perform their assigned tasks.",
				],
				[
					"No Evaluation",
					"Teams need measurable tests to determine whether the agent is actually performing reliably.",
				],
				[
					"Removing Human Oversight",
					"High-impact decisions often require human review even when routine steps are automated.",
				],
				[
					"Scaling Too Early",
					"A successful pilot should be stable and observable before it becomes a company-wide system.",
				],
			],
		),
	},
]

// ============================================================
// AUTOMATION — 5
// ============================================================

	{
		categorySlug: "automation",
		title: "AI Automation in 2026: The Complete Guide for Beginners",
		excerpt:
			"Learn where AI automation fits, which workflows to automate first, and how to avoid expensive implementation mistakes.",
		authorSlug: "elena-cho",
		tags: ["Automation", "AI Tools", "Guides"],
		readingTime: 10,
		featured: true,
		content: articleContent(
			"AI automation combines traditional workflow automation with AI systems that can understand text, classify information and generate decisions or content.",
			[
				[
					"What Is AI Automation?",
					"AI automation uses software rules, integrations and AI models together to reduce manual work.",
				],
				[
					"Best Workflows to Automate",
					"Email triage, lead qualification, document processing, reporting and customer support are common starting points.",
				],
				[
					"AI vs Traditional Automation",
					"Traditional automation works well with predictable rules, while AI is useful when inputs require interpretation.",
				],
				[
					"How to Measure ROI",
					"Track time saved, error reduction, processing volume, cost and employee adoption.",
				],
			],
		),
	},

	{
		categorySlug: "automation",
		title: "25 AI Automation Ideas That Can Save Hours Every Week",
		excerpt:
			"Practical AI automation ideas for email, sales, marketing, customer support, documents and everyday business operations.",
		authorSlug: "marcus-webb",
		tags: ["Automation", "Productivity", "Business AI"],
		readingTime: 12,
		trending: true,
		content: articleContent(
			"Automation becomes valuable when it removes repetitive work without creating more maintenance than the original process required.",
			[
				[
					"Email Automation",
					"Classify messages, summarize long threads, draft responses and route requests to the correct team.",
				],
				[
					"Sales Automation",
					"Research prospects, enrich CRM records and prepare personalized outreach drafts.",
				],
				[
					"Marketing Automation",
					"Repurpose content, classify leads and create campaign summaries.",
				],
				[
					"Operations Automation",
					"Extract information from documents, generate reports and notify teams when thresholds are reached.",
				],
				[
					"Customer Support",
					"Categorize tickets, retrieve knowledge-base information and prepare suggested responses.",
				],
			],
		),
	},

	{
		categorySlug: "automation",
		title: "Zapier vs Make vs n8n: Which Automation Platform Is Best?",
		excerpt:
			"A practical comparison of Zapier, Make and n8n for no-code automation, integrations, AI workflows and technical teams.",
		authorSlug: "marcus-webb",
		tags: ["Automation", "AI Tools", "Reviews"],
		readingTime: 9,
		content: articleContent(
			"Zapier, Make and n8n solve similar problems but target different types of automation users.",
			[
				[
					"Zapier",
					"Zapier is especially approachable for business users who want fast integrations and simple workflows.",
				],
				[
					"Make",
					"Make provides a highly visual approach that works well for more complex workflow logic.",
				],
				[
					"n8n",
					"n8n is attractive to technical teams that want deeper control, APIs and self-hosting options.",
				],
				[
					"Which One Should You Choose?",
					"The right platform depends on workflow complexity, technical skill, integrations, governance and budget.",
				],
			],
		),
	},

	{
		categorySlug: "automation",
		title: "How to Automate Your Business Without Breaking Your Workflow",
		excerpt:
			"A safe framework for introducing automation while protecting data quality, reliability and human oversight.",
		authorSlug: "elena-cho",
		tags: ["Automation", "Business AI", "Enterprise"],
		readingTime: 9,
		content: articleContent(
			"Successful automation changes a process gradually rather than replacing everything at once.",
			[
				[
					"Map the Existing Process",
					"Document what people actually do before deciding which steps should be automated.",
				],
				[
					"Identify Failure Points",
					"Look for exceptions, missing data and steps where human judgment is currently required.",
				],
				[
					"Automate the Predictable Parts",
					"Rules and integrations should handle deterministic operations wherever possible.",
				],
				[
					"Add AI Carefully",
					"Use AI for interpretation, classification and generation where it provides a measurable advantage.",
				],
				[
					"Monitor Everything",
					"Logging, alerts and human review help catch problems before they become systemic.",
				],
			],
		),
	},

	{
		categorySlug: "automation",
		title: "AI Workflow Automation: A Practical Framework That Actually Works",
		excerpt:
			"Use this framework to design reliable AI workflows from trigger to action, review and measurement.",
		authorSlug: "elena-cho",
		tags: ["Automation", "Guides", "AI Agents"],
		readingTime: 8,
		content: articleContent(
			"A reliable AI workflow needs more than an AI model. It needs triggers, data, tools, validation and a clear stopping condition.",
			[
				[
					"Trigger",
					"Define exactly what event starts the workflow.",
				],
				[
					"Context",
					"Give the AI the information required to make a useful decision.",
				],
				[
					"Reasoning",
					"Use AI for interpretation or decisions where traditional rules are insufficient.",
				],
				[
					"Action",
					"Connect the workflow to the application or system that needs to change.",
				],
				[
					"Validation",
					"Verify the output before important actions are completed.",
				],
			],
		),
	},

	// ============================================================
	// AI TOOLS — 5
	// ============================================================

	{
		categorySlug: "ai-tools",
		title: "Best AI Tools in 2026: 50 Tools Worth Knowing",
		excerpt:
			"Our practical guide to the AI tools worth knowing for writing, research, coding, design, automation and productivity.",
		authorSlug: "marcus-webb",
		tags: ["AI Tools", "Reviews", "Guides"],
		readingTime: 14,
		featured: true,
		trending: true,
		content: articleContent(
			"The AI software market is crowded, making it difficult to know which tools are actually worth learning.",
			[
				[
					"Best AI Assistants",
					"General assistants can help with writing, research, coding, analysis and everyday work.",
				],
				[
					"Best AI Writing Tools",
					"Writing platforms focus on drafting, rewriting, SEO and marketing workflows.",
				],
				[
					"Best AI Design Tools",
					"Image and video tools can dramatically reduce the time needed to create visual assets.",
				],
				[
					"Best Automation Tools",
					"Automation platforms connect applications and turn repetitive processes into workflows.",
				],
				[
					"How to Pick the Right Tool",
					"Choose based on your workflow rather than the number of AI features advertised on a product page.",
				],
			],
		),
	},

	{
		categorySlug: "ai-tools",
		title: "ChatGPT vs Claude vs Gemini: Which AI Is Best in 2026?",
		excerpt:
			"A practical comparison of three leading AI assistants across writing, coding, research, reasoning and everyday work.",
		authorSlug: "marcus-webb",
		tags: ["AI Tools", "LLM", "Reviews"],
		readingTime: 10,
		featured: true,
		content: articleContent(
			"ChatGPT, Claude and Gemini are all capable general-purpose AI assistants, but their strengths can differ depending on the workflow.",
			[
				[
					"ChatGPT",
					"ChatGPT offers a broad ecosystem and supports a wide variety of everyday and professional workflows.",
				],
				[
					"Claude",
					"Claude is particularly attractive for long-form writing, reasoning and large document workflows.",
				],
				[
					"Gemini",
					"Gemini is closely connected to Google's ecosystem and can be useful for users already working across Google services.",
				],
				[
					"Which One Wins?",
					"There is no universal winner. The best option depends on the applications, workflow and capabilities a user values most.",
				],
			],
		),
	},

	{
		categorySlug: "ai-tools",
		title: "Best Free AI Tools You Can Use Right Now",
		excerpt:
			"Useful free AI tools for writing, research, coding, design, productivity and automation without an expensive subscription.",
		authorSlug: "marcus-webb",
		tags: ["AI Tools", "Productivity", "Guides"],
		readingTime: 11,
		content: articleContent(
			"You do not need a large AI budget to start using useful AI software.",
			[
				[
					"Free AI Assistants",
					"Several leading AI assistants offer free access suitable for everyday questions and content work.",
				],
				[
					"Free Writing Tools",
					"Grammar, paraphrasing and basic content tools can improve writing without requiring a subscription.",
				],
				[
					"Free Developer Tools",
					"Open models and AI coding assistants can help developers experiment with AI workflows.",
				],
				[
					"Free Design Tools",
					"Browser-based design platforms provide useful image and video capabilities at no initial cost.",
				],
			],
		),
	},

	{
		categorySlug: "ai-tools",
		title: "AI Tools for Small Businesses: The 15 Tools Worth Paying For",
		excerpt:
			"Where small businesses should actually spend money on AI — from marketing and sales to support and operations.",
		authorSlug: "elena-cho",
		tags: ["AI Tools", "Business AI", "Enterprise"],
		readingTime: 10,
		content: articleContent(
			"Small businesses can benefit from AI without building complex internal systems.",
			[
				[
					"Marketing",
					"AI can accelerate content creation, campaign planning and customer research.",
				],
				[
					"Sales",
					"AI tools can support lead research, CRM updates and personalized communication.",
				],
				[
					"Operations",
					"Automation platforms can connect existing business applications and reduce repetitive work.",
				],
				[
					"Customer Support",
					"AI assistants can help classify requests and prepare support responses.",
				],
				[
					"Choosing What to Buy",
					"Start with the workflow that has the clearest financial or time-saving opportunity.",
				],
			],
		),
	},

	{
		categorySlug: "ai-tools",
		title: "How to Choose the Right AI Tool Without Wasting Money",
		excerpt:
			"A simple buying framework for comparing AI tools, pricing, features, integrations, privacy and real-world value.",
		authorSlug: "marcus-webb",
		tags: ["AI Tools", "Guides", "Reviews"],
		readingTime: 8,
		content: articleContent(
			"Choosing AI software based only on feature lists can lead to unnecessary subscriptions and poor adoption.",
			[
				[
					"Start With the Job",
					"Define exactly what you want the tool to accomplish.",
				],
				[
					"Check the Workflow",
					"Make sure the tool fits into the applications and processes you already use.",
				],
				[
					"Compare Total Cost",
					"Look beyond the advertised monthly price and consider usage limits and additional seats.",
				],
				[
					"Check Privacy",
					"Understand how sensitive business or personal information is handled.",
				],
			],
		),
	},
	{
		categorySlug: "productivity",
		title: "AI Productivity in 2026: How to Get More Done With Less Work",
		excerpt:
			"Build a practical AI productivity system for planning, writing, research, meetings and repetitive tasks.",
		authorSlug: "elena-cho",
		tags: ["Productivity", "AI Tools", "Future of Work"],
		readingTime: 10,
		featured: true,
		content: articleContent(
			"AI productivity is less about generating more text and more about reducing the friction between an idea and a finished result.",
			[
				[
					"Use AI for Planning",
					"AI can turn goals into actionable task lists and help identify dependencies.",
				],
				[
					"Use AI for Meetings",
					"Transcription and summarization tools can reduce the time spent reviewing conversations.",
				],
				[
					"Use AI for Research",
					"AI assistants can organize information and help identify the most important points.",
				],
				[
					"Automate Repetitive Work",
					"Connect AI with automation platforms to reduce manual data movement.",
				],
			],
		),
	},

	{
		categorySlug: "productivity",
		title: "10 AI Workflows That Can Save You Hours Every Week",
		excerpt:
			"Simple AI workflows for email, meetings, research, writing, planning and repetitive digital work.",
		authorSlug: "marcus-webb",
		tags: ["Productivity", "Automation", "Guides"],
		readingTime: 9,
		content: articleContent(
			"Small workflow improvements can compound into significant productivity gains over a month.",
			[
				[
					"Email Summaries",
					"Use AI to turn long threads into concise action-oriented summaries.",
				],
				[
					"Meeting Notes",
					"Automatically convert conversations into decisions, action items and follow-ups.",
				],
				[
					"Research Briefs",
					"Turn multiple sources into structured research notes.",
				],
				[
					"Content Repurposing",
					"Transform one long piece of content into several smaller assets.",
				],
			],
		),
	},

	{
		categorySlug: "productivity",
		title: "Best AI Note-Taking Apps in 2026",
		excerpt:
			"The best AI note-taking and knowledge-management tools for meetings, research and personal organization.",
		authorSlug: "marcus-webb",
		tags: ["Productivity", "AI Tools", "Reviews"],
		readingTime: 9,
		content: articleContent(
			"AI note-taking tools are evolving from simple digital notebooks into systems that can search, summarize and connect information.",
			[
				[
					"Meeting Notes",
					"AI transcription can automatically capture discussions and create useful summaries.",
				],
				[
					"Knowledge Search",
					"Modern tools can retrieve information from a growing personal knowledge base.",
				],
				[
					"Automatic Organization",
					"AI can categorize and connect notes without requiring manual filing.",
				],
				[
					"Choosing an App",
					"Look for reliable search, export options, integrations and privacy controls.",
				],
			],
		),
	},

	{
		categorySlug: "productivity",
		title: "How to Build an AI-Powered Personal Productivity System",
		excerpt:
			"A practical system for using AI to plan your week, organize information and automate repetitive digital work.",
		authorSlug: "elena-cho",
		tags: ["Productivity", "Guides", "Automation"],
		readingTime: 10,
		content: articleContent(
			"An AI productivity system should support your existing habits rather than create another complicated workflow to maintain.",
			[
				[
					"Capture",
					"Create one reliable place for ideas, tasks and incoming information.",
				],
				[
					"Organize",
					"Use AI to classify and summarize information where helpful.",
				],
				[
					"Plan",
					"Turn priorities into realistic daily and weekly schedules.",
				],
				[
					"Execute",
					"Use AI to remove repetitive steps while keeping important decisions under human control.",
				],
			],
		),
	},

	{
		categorySlug: "productivity",
		title: "AI Productivity Mistakes That Are Actually Making You Slower",
		excerpt:
			"More AI does not always mean more productivity. Avoid these common mistakes when adding AI to your workflow.",
		authorSlug: "marcus-webb",
		tags: ["Productivity", "AI Tools", "Guides"],
		readingTime: 8,
		content: articleContent(
			"AI can save time, but poorly designed workflows can create more work instead.",
			[
				[
					"Using AI for Everything",
					"Not every task needs an AI model. Simple deterministic actions are often faster without one.",
				],
				[
					"Over-Editing AI Output",
					"If an AI workflow requires extensive correction, the process may not be saving time.",
				],
				[
					"Too Many Tools",
					"Switching between dozens of AI applications creates unnecessary friction.",
				],
				[
					"No Workflow Measurement",
					"Measure actual time saved instead of assuming a new AI tool is improving productivity.",
				],
			],
		),
	},
]

// ============================================================
// TOOLS
// ============================================================

const toolIds = new Map<string, string>()

let freeTools = 0
let paidTools = 0

for (const [index, tool] of TOOLS.entries()) {
	const categoryId = toolCategoryIds.get(tool.category)

	if (!categoryId) {
		throw new Error(
			`[seed] Missing tool category: ${tool.category}`,
		)
	}

	const isPaid = tool.pricing === "Paid"

	if (isPaid) {
		paidTools++
	} else {
		freeTools++
	}

	const row = await prisma.tool.upsert({
		where: {
			slug: tool.slug,
		},
		update: {
			name: tool.name,
			description: tool.description,
			websiteUrl: tool.websiteUrl,
			pricing: tool.pricing,
			featured: index < 12,
			categoryId,
		},
		create: {
			slug: tool.slug,
			name: tool.name,
			description: tool.description,
			websiteUrl: tool.websiteUrl,
			pricing: tool.pricing,
			featured: index < 12,
			categoryId,
		},
	})

	toolIds.set(tool.slug, row.id)
}

console.log(
	`[seed] Tools: ${TOOLS.length} total (${freeTools} free, ${paidTools} paid)`,
)

// ============================================================
// ARTICLES
// ============================================================

const categoryArticleCounts = new Map<string, number>()

for (const article of ARTICLE_DEFINITIONS) {
	const categoryId = categoryIds.get(article.categorySlug)

	if (!categoryId) {
		throw new Error(
			`[seed] Missing article category: ${article.categorySlug}`,
		)
	}

	const authorId =
		article.authorSlug === "elena-cho"
			? leadEditor.id
			: contributingAuthor.id

	const tagConnect = article.tags
		.map((tag) => tagIds.get(tag))
		.filter(
			(id): id is string => Boolean(id),
		)

	const existingCount =
		categoryArticleCounts.get(article.categorySlug) || 0

	categoryArticleCounts.set(
		article.categorySlug,
		existingCount + 1,
	)

	const slug = slugify(article.title)

	const heroImage =
		HERO_IMAGES[
			ARTICLE_DEFINITIONS.indexOf(article) %
				HERO_IMAGES.length
		]

	await prisma.article.upsert({
		where: {
			slug,
		},
		update: {
			title: article.title,
			excerpt: article.excerpt,
			content: article.content,
			categoryId,
			authorId,
			status: "PUBLISHED",
			featured: article.featured ?? false,
			trending: article.trending ?? false,
			readingTime: article.readingTime,
			heroImage,
			tags: {
				deleteMany: {},
				create: tagConnect.map((tagId) => ({
					tag: {
						connect: {
							id: tagId,
						},
					},
				})),
			},
		},
		create: {
			slug,
			title: article.title,
			excerpt: article.excerpt,
			content: article.content,
			categoryId,
			authorId,
			status: "PUBLISHED",
			featured: article.featured ?? false,
			trending: article.trending ?? false,
			readingTime: article.readingTime,
			heroImage,
			tags: {
				create: tagConnect.map((tagId) => ({
					tag: {
						connect: {
							id: tagId,
						},
					},
				})),
			},
		},
	})
}

console.log(
	`[seed] Articles created/updated: ${ARTICLE_DEFINITIONS.length}`,
)

// ============================================================
// COMPARISON
// ============================================================

const chatgptId = toolIds.get("chatgpt")
const claudeId = toolIds.get("claude")

if (chatgptId && claudeId) {
	await prisma.comparison.upsert({
		where: {
			slug: "chatgpt-vs-claude",
		},
		update: {
			title:
				"ChatGPT vs Claude: Which AI Assistant Should You Use?",
			summary:
				"A practical comparison of ChatGPT and Claude across writing, coding, research, reasoning and everyday productivity.",
			toolAId: chatgptId,
			toolBId: claudeId,
			winnerToolId: null,
			featureTable: [
				{
					feature: "General use",
					toolA: "Excellent",
					toolB: "Excellent",
				},
				{
					feature: "Long-form writing",
					toolA: "Excellent",
					toolB: "Excellent",
				},
				{
					feature: "Coding",
					toolA: "Excellent",
					toolB: "Excellent",
				},
				{
					feature: "Research",
					toolA: "Excellent",
					toolB: "Excellent",
				},
			],
			verdict:
				"<p>Both are excellent general-purpose AI assistants. The better choice depends on your workflow, preferred ecosystem and the type of work you do most often.</p>",
			faq: [
				{
					question:
						"Can I use both ChatGPT and Claude?",
					answer:
						"Yes. Many users use both assistants for different workflows.",
				},
			],
		},
		create: {
			slug: "chatgpt-vs-claude",
			title:
				"ChatGPT vs Claude: Which AI Assistant Should You Use?",
			summary:
				"A practical comparison of ChatGPT and Claude across writing, coding, research, reasoning and everyday productivity.",
			toolAId: chatgptId,
			toolBId: claudeId,
			winnerToolId: null,
			featureTable: [
				{
					feature: "General use",
					toolA: "Excellent",
					toolB: "Excellent",
				},
				{
					feature: "Long-form writing",
					toolA: "Excellent",
					toolB: "Excellent",
				},
				{
					feature: "Coding",
					toolA: "Excellent",
					toolB: "Excellent",
				},
				{
					feature: "Research",
					toolA: "Excellent",
					toolB: "Excellent",
				},
			],
			verdict:
				"<p>Both are excellent general-purpose AI assistants. The better choice depends on your workflow, preferred ecosystem and the type of work you do most often.</p>",
			faq: [
				{
					question:
						"Can I use both ChatGPT and Claude?",
					answer:
						"Yes. Many users use both assistants for different workflows.",
				},
			],
		},
	})
}

// ============================================================
// SITE SETTINGS
// ============================================================

await prisma.siteSettings.upsert({
	where: {
		id: "singleton",
	},
	update: {
		siteName: "NEXORA",
		description:
			"NEXORA is a premium AI technology publication covering AI agents, automation, AI tools, productivity, business AI and the future of work.",
		defaultSeoTitle:
			"NEXORA — AI Agents, Automation, AI Tools & The Future of Work",
		defaultSeoDescription:
			"Discover the best AI tools, AI agent guides, automation workflows, software reviews and practical business AI strategies.",
		socialLinks: {
			twitter: "https://twitter.com/nexora",
			linkedin:
				"https://linkedin.com/company/nexora",
			youtube:
				"https://youtube.com/@nexoraAI",
		},
		newsletterEnabled: true,
		adsEnabled: false,
		affiliateEnabled: true,
	},
	create: {
		id: "singleton",
		siteName: "NEXORA",
		description:
			"NEXORA is a premium AI technology publication covering AI agents, automation, AI tools, productivity, business AI and the future of work.",
		defaultSeoTitle:
			"NEXORA — AI Agents, Automation, AI Tools & The Future of Work",
		defaultSeoDescription:
			"Discover the best AI tools, AI agent guides, automation workflows, software reviews and practical business AI strategies.",
		socialLinks: {
			twitter: "https://twitter.com/nexora",
			linkedin:
				"https://linkedin.com/company/nexora",
			youtube:
				"https://youtube.com/@nexoraAI",
		},
		newsletterEnabled: true,
		adsEnabled: false,
		affiliateEnabled: true,
	},
})

// ============================================================
// VALIDATION
// ============================================================

if (TOOLS.length !== 50) {
	throw new Error(
		`[seed] Expected 50 tools, found ${TOOLS.length}`,
	)
}

if (freeTools !== 25) {
	throw new Error(
		`[seed] Expected 25 free tools, found ${freeTools}`,
	)
}

if (paidTools !== 25) {
	throw new Error(
		`[seed] Expected 25 paid tools, found ${paidTools}`,
	)
}

if (ARTICLE_DEFINITIONS.length !== 35) {
	throw new Error(
		`[seed] Expected 35 articles, found ${ARTICLE_DEFINITIONS.length}`,
	)
}

for (const category of CORE_CATEGORIES) {
	const count =
		categoryArticleCounts.get(category.slug) || 0

	if (count !== 5) {
		throw new Error(
			`[seed] Category ${category.slug} expected 5 articles, found ${count}`,
		)
	}
}

console.log(
	"[seed] Validation passed: 35 articles + 50 tools.",
)

console.log(
	`[seed] Admin login: ${adminEmail} / ${adminPassword}`,
)

console.log("[seed] NEXORA seed completed successfully.")

// ============================================================
// RUN
// ============================================================

main()
	.catch((error) => {
		console.error("[seed] Error:", error)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

// ============================================================
// END OF SEED FILE
// ============================================================
//
// Part 4 continues only if your existing seed.ts contains
// additional source data after the section supplied previously.
//
// Paste this part immediately after Part 3.
//
// ============================================================

// No additional code is required here.
//
// The complete main() function, comparison seed, site settings,
// validation, and Prisma disconnect logic are already included
// in Part 3.
//
// ============================================================


