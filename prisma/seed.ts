// ============================================================
// NEXORA — PRODUCTION SEED
// PART 1 / 6
// ============================================================

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
			"AI assistant for research, writing, productivity and Microsoft ecosystem workflows.",
		websiteUrl: "https://copilot.microsoft.com",
		pricing: "Free",
		category: "chatbots",
	},

	{
		slug: "perplexity",
		name: "Perplexity",
		description:
			"AI-powered answer engine designed for research, web search and source-backed responses.",
		websiteUrl: "https://www.perplexity.ai",
		pricing: "Free",
		category: "chatbots",
	},

	{
		slug: "meta-ai",
		name: "Meta AI",
		description:
			"General-purpose AI assistant integrated across Meta's consumer ecosystem.",
		websiteUrl: "https://www.meta.ai",
		pricing: "Free",
		category: "chatbots",
	},

	{
		slug: "deepseek",
		name: "DeepSeek",
		description:
			"AI assistant focused on reasoning, coding, mathematics and general-purpose tasks.",
		websiteUrl: "https://www.deepseek.com",
		pricing: "Free",
		category: "chatbots",
	},

	{
		slug: "mistral-le-chat",
		name: "Mistral Le Chat",
		description:
			"General-purpose AI assistant from Mistral for research, writing, reasoning and productivity.",
		websiteUrl: "https://chat.mistral.ai",
		pricing: "Free",
		category: "chatbots",
	},

	{
		slug: "hugging-chat",
		name: "HuggingChat",
		description:
			"Open-model conversational AI interface for experimenting with a range of language models.",
		websiteUrl: "https://huggingface.co/chat",
		pricing: "Free",
		category: "chatbots",
	},

	{
		slug: "poe",
		name: "Poe",
		description:
			"Multi-model AI platform that provides access to multiple assistants and specialized bots.",
		websiteUrl: "https://poe.com",
		pricing: "Free",
		category: "chatbots",
	},

	{
		slug: "grammarly",
		name: "Grammarly",
		description:
			"AI-powered writing assistant for grammar, rewriting, tone and communication improvement.",
		websiteUrl: "https://www.grammarly.com",
		pricing: "Free",
		category: "writing",
	},

	{
		slug: "quillbot",
		name: "QuillBot",
		description:
			"AI writing tool for paraphrasing, summarization, grammar improvement and rewriting.",
		websiteUrl: "https://quillbot.com",
		pricing: "Free",
		category: "writing",
	},

	{
		slug: "copy-ai",
		name: "Copy.ai",
		description:
			"AI-powered content and go-to-market platform for marketing and business workflows.",
		websiteUrl: "https://www.copy.ai",
		pricing: "Free",
		category: "writing",
	},

	{
		slug: "canva",
		name: "Canva",
		description:
			"Visual design platform with AI-powered tools for presentations, graphics, images and content.",
		websiteUrl: "https://www.canva.com",
		pricing: "Free",
		category: "design",
	},

	{
		slug: "gamma",
		name: "Gamma",
		description:
			"AI-powered platform for creating presentations, documents and visual content.",
		websiteUrl: "https://gamma.app",
		pricing: "Free",
		category: "design",
	},

	{
		slug: "notion",
		name: "Notion",
		description:
			"Workspace for notes, documents, project management and team knowledge.",
		websiteUrl: "https://www.notion.so",
		pricing: "Free",
		category: "productivity-tools",
	},

	{
		slug: "clickup",
		name: "ClickUp",
		description:
			"Project management and productivity platform with AI-assisted work management.",
		websiteUrl: "https://clickup.com",
		pricing: "Free",
		category: "productivity-tools",
	},

	{
		slug: "trello",
		name: "Trello",
		description:
			"Visual project management platform for organizing tasks, workflows and team projects.",
		websiteUrl: "https://trello.com",
		pricing: "Free",
		category: "productivity-tools",
	},

	{
		slug: "zapier",
		name: "Zapier",
		description:
			"Workflow automation platform connecting applications and automating repetitive business tasks.",
		websiteUrl: "https://zapier.com",
		pricing: "Free",
		category: "automation-tools",
	},

	{
		slug: "make",
		name: "Make",
		description:
			"Visual automation platform for building sophisticated integrations and business workflows.",
		websiteUrl: "https://www.make.com",
		pricing: "Free",
		category: "automation-tools",
	},

	{
		slug: "n8n",
		name: "n8n",
		description:
			"Flexible workflow automation platform designed for technical teams and advanced integrations.",
		websiteUrl: "https://n8n.io",
		pricing: "Free",
		category: "automation-tools",
	},

	{
		slug: "tally",
		name: "Tally",
		description:
			"Simple form builder for collecting structured information and connecting business workflows.",
		websiteUrl: "https://tally.so",
		pricing: "Free",
		category: "productivity-tools",
	},

	{
		slug: "descript",
		name: "Descript",
		description:
			"AI-powered audio and video editor for transcription, editing and content production.",
		websiteUrl: "https://www.descript.com",
		pricing: "Free",
		category: "design",
	},

	{
		slug: "remove-bg",
		name: "remove.bg",
		description:
			"AI-powered image background removal tool for fast visual asset preparation.",
		websiteUrl: "https://www.remove.bg",
		pricing: "Free",
		category: "design",
	},

	{
		slug: "photopea",
		name: "Photopea",
		description:
			"Browser-based image editor supporting advanced design and photo-editing workflows.",
		websiteUrl: "https://www.photopea.com",
		pricing: "Free",
		category: "design",
	},

	// ---------------- PAID ----------------

	{
		slug: "chatgpt-plus",
		name: "ChatGPT Plus",
		description:
			"Premium ChatGPT plan for users who need expanded access and advanced AI capabilities.",
		websiteUrl: "https://chatgpt.com",
		pricing: "Paid",
		category: "chatbots",
	},

	{
		slug: "claude-pro",
		name: "Claude Pro",
		description:
			"Premium Claude plan for higher usage limits and advanced AI workflows.",
		websiteUrl: "https://claude.ai",
		pricing: "Paid",
		category: "chatbots",
	},

	{
		slug: "gemini-advanced",
		name: "Google Gemini Advanced",
		description:
			"Premium Gemini experience with expanded capabilities for demanding AI workflows.",
		websiteUrl: "https://gemini.google.com",
		pricing: "Paid",
		category: "chatbots",
	},

	{
		slug: "perplexity-pro",
		name: "Perplexity Pro",
		description:
			"Premium research assistant with expanded access to advanced search and AI capabilities.",
		websiteUrl: "https://www.perplexity.ai",
		pricing: "Paid",
		category: "chatbots",
	},

	{
		slug: "jasper",
		name: "Jasper",
		description:
			"AI marketing platform for brand-aware content creation and marketing workflows.",
		websiteUrl: "https://www.jasper.ai",
		pricing: "Paid",
		category: "writing",
	},

	{
		slug: "writesonic",
		name: "Writesonic",
		description:
			"AI content platform for SEO writing, marketing content and business publishing workflows.",
		websiteUrl: "https://writesonic.com",
		pricing: "Paid",
		category: "writing",
	},

	{
		slug: "surfer-seo",
		name: "Surfer",
		description:
			"AI-powered SEO platform for content optimization, keyword research and organic growth.",
		websiteUrl: "https://surferseo.com",
		pricing: "Paid",
		category: "writing",
	},

	{
		slug: "grammarly-pro",
		name: "Grammarly Pro",
		description:
			"Advanced Grammarly plan for professional writing, rewriting and communication workflows.",
		websiteUrl: "https://www.grammarly.com",
		pricing: "Paid",
		category: "writing",
	},

	{
		slug: "midjourney",
		name: "Midjourney",
		description:
			"AI image generation platform known for highly creative and visually rich image generation.",
		websiteUrl: "https://www.midjourney.com",
		pricing: "Paid",
		category: "design",
	},

	{
		slug: "adobe-firefly",
		name: "Adobe Firefly",
		description:
			"Generative AI tools for image creation, editing and creative production.",
		websiteUrl: "https://firefly.adobe.com",
		pricing: "Paid",
		category: "design",
	},

	{
		slug: "runway",
		name: "Runway",
		description:
			"AI creative platform for video generation, editing and visual experimentation.",
		websiteUrl: "https://runwayml.com",
		pricing: "Paid",
		category: "design",
	},

	{
		slug: "pika",
		name: "Pika",
		description:
			"AI video generation and creative editing platform for producing visual content.",
		websiteUrl: "https://pika.art",
		pricing: "Paid",
		category: "design",
	},

	{
		slug: "notion-ai",
		name: "Notion AI",
		description:
			"AI assistance integrated into Notion for writing, summarization, search and knowledge work.",
		websiteUrl: "https://www.notion.so/product/ai",
		pricing: "Paid",
		category: "productivity-tools",
	},

	{
		slug: "clickup-ai",
		name: "ClickUp Brain",
		description:
			"AI workspace assistant for project management, knowledge retrieval and productivity.",
		websiteUrl: "https://clickup.com/ai",
		pricing: "Paid",
		category: "productivity-tools",
	},

	{
		slug: "motion",
		name: "Motion",
		description:
			"AI-powered productivity platform for scheduling, task planning and project management.",
		websiteUrl: "https://www.usemotion.com",
		pricing: "Paid",
		category: "productivity-tools",
	},

	{
		slug: "reclaim-ai",
		name: "Reclaim AI",
		description:
			"AI scheduling assistant that automatically protects time for tasks, habits and meetings.",
		websiteUrl: "https://reclaim.ai",
		pricing: "Paid",
		category: "productivity-tools",
	},

	{
		slug: "otter-ai",
		name: "Otter.ai",
		description:
			"AI meeting assistant for transcription, summaries, action items and searchable conversations.",
		websiteUrl: "https://otter.ai",
		pricing: "Paid",
		category: "productivity-tools",
	},

	{
		slug: "fireflies-ai",
		name: "Fireflies.ai",
		description:
			"AI meeting assistant for transcription, summaries, search and automated meeting workflows.",
		websiteUrl: "https://fireflies.ai",
		pricing: "Paid",
		category: "productivity-tools",
	},

	{
		slug: "zapier-premium",
		name: "Zapier Premium",
		description:
			"Advanced Zapier automation for higher-volume workflows, integrations and business automation.",
		websiteUrl: "https://zapier.com",
		pricing: "Paid",
		category: "automation-tools",
	},

	{
		slug: "make-pro",
		name: "Make Pro",
		description:
			"Advanced Make automation capabilities for complex multi-step workflows and integrations.",
		websiteUrl: "https://www.make.com",
		pricing: "Paid",
		category: "automation-tools",
	},

	{
		slug: "n8n-cloud",
		name: "n8n Cloud",
		description:
			"Hosted n8n automation for technical teams building production AI and integration workflows.",
		websiteUrl: "https://n8n.io",
		pricing: "Paid",
		category: "automation-tools",
	},

	{
		slug: "hubspot-ai",
		name: "HubSpot AI",
		description:
			"AI-powered CRM and business automation capabilities for marketing, sales and customer service.",
		websiteUrl: "https://www.hubspot.com",
		pricing: "Paid",
		category: "automation-tools",
	},

	{
		slug: "salesforce-einstein",
		name: "Salesforce Einstein",
		description:
			"Enterprise AI capabilities integrated into Salesforce CRM and business workflows.",
		websiteUrl: "https://www.salesforce.com/einstein/",
		pricing: "Paid",
		category: "automation-tools",
	},

	{
		slug: "grammarly-business",
		name: "Grammarly Business",
		description:
			"Team-focused AI writing and communication platform for organizations.",
		websiteUrl: "https://www.grammarly.com/business",
		pricing: "Paid",
		category: "writing",
	},

	{
		slug: "copy-ai-pro",
		name: "Copy.ai Pro",
		description:
			"Advanced AI workflow and content capabilities for marketing and go-to-market teams.",
		websiteUrl: "https://www.copy.ai",
		pricing: "Paid",
		category: "writing",
	},
]

// ============================================================
// ARTICLE CONTENT HELPER
// ============================================================

type ArticleSection = [heading: string, body: string]

function articleContent(
	intro: string,
	sections: ArticleSection[],
) {
	return JSON.stringify({
		intro,
		sections: sections.map(([heading, body]) => ({
			heading,
			body,
		})),
	})
}



	// ========================================================
	// AI AGENTS — 5
	// ========================================================

	{
		categorySlug: "ai-agents",
		title: "AI Agents in 2026: What They Are and How They Actually Work",
		excerpt:
			"Understand AI agents, how agentic systems differ from chatbots, and where businesses can use them today.",
		authorSlug: "elena-cho",
		tags: ["AI Agents", "LLM", "Guides"],
		readingTime: 10,
		featured: true,
		content: articleContent(
			"AI agents are software systems that can interpret goals, use tools, make decisions and complete multi-step tasks.",
			[
				[
					"What Is an AI Agent?",
					"An AI agent combines a language model with instructions, context, tools and a process for completing tasks.",
				],
				[
					"How Agents Differ From Chatbots",
					"Traditional chatbots mainly respond to messages, while agents can take actions across connected systems.",
				],
				[
					"Common Agent Workflows",
					"Research, customer support, data processing, sales operations and internal knowledge tasks are common use cases.",
				],
				[
					"Where Agents Struggle",
					"Agents can make incorrect decisions, misuse tools or fail when instructions and available data are ambiguous.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "AI Agents vs Chatbots: What's the Difference?",
		excerpt:
			"Learn the practical difference between AI chatbots and AI agents, including tools, memory, actions and autonomy.",
		authorSlug: "marcus-webb",
		tags: ["AI Agents", "LLM", "AI Tools"],
		readingTime: 8,
		content: articleContent(
			"Chatbots and AI agents can use similar language models, but their responsibilities and capabilities are different.",
			[
				[
					"Chatbots",
					"Chatbots are primarily designed to communicate with users and generate responses.",
				],
				[
					"Agents",
					"Agents can combine reasoning, tools, data and actions to complete multi-step objectives.",
				],
				[
					"Tool Use",
					"An agent may call APIs, search systems, update records or trigger workflows.",
				],
				[
					"Autonomy",
					"Greater autonomy can increase usefulness but also increases the need for validation and controls.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "How to Build Your First AI Agent: A Beginner's Guide",
		excerpt:
			"A practical beginner framework for designing an AI agent with a clear goal, tools, context and validation.",
		authorSlug: "elena-cho",
		tags: ["AI Agents", "Guides", "Automation"],
		readingTime: 11,
		content: articleContent(
			"The best first AI agent is usually a narrow system designed to perform one useful job reliably.",
			[
				[
					"Choose One Job",
					"Start with a specific task rather than trying to build a general autonomous employee.",
				],
				[
					"Define the Tools",
					"Give the agent only the tools it actually needs to complete its job.",
				],
				[
					"Provide Context",
					"Connect the agent to the documents, records and information required for accurate decisions.",
				],
				[
					"Add Guardrails",
					"Limit permissions and require review before sensitive or irreversible actions.",
				],
				[
					"Evaluate the Agent",
					"Test successful cases, failure cases, edge cases and tool-use behavior before deployment.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "The Best AI Agent Frameworks in 2026",
		excerpt:
			"A practical overview of popular frameworks and approaches for building production AI agent systems.",
		authorSlug: "marcus-webb",
		tags: ["AI Agents", "Developer Tools", "Reviews"],
		readingTime: 10,
		content: articleContent(
			"Agent frameworks help developers connect models, tools, memory and workflows into repeatable systems.",
			[
				[
					"Agent Frameworks",
					"Frameworks provide reusable building blocks for tool calling, orchestration and state management.",
				],
				[
					"Workflow-Oriented Systems",
					"Explicit workflows can be easier to evaluate and control than fully autonomous loops.",
				],
				[
					"Choosing a Framework",
					"Consider reliability, observability, integrations, developer experience and production requirements.",
				],
				[
					"Production Readiness",
					"Successful systems need testing, logging, permissions, cost controls and clear failure handling.",
				],
			],
		),
	},

	{
		categorySlug: "ai-agents",
		title: "Multi-Agent Systems Explained: When One AI Agent Isn't Enough",
		excerpt:
			"Understand multi-agent architectures, their benefits, limitations and when multiple specialized agents make sense.",
		authorSlug: "elena-cho",
		tags: ["AI Agents", "Multi-Agent", "Enterprise"],
		readingTime: 9,
		content: articleContent(
			"Multi-agent systems divide complex work between specialized AI agents instead of asking one agent to do everything.",
			[
				[
					"Specialized Agents",
					"Different agents can focus on research, analysis, planning, execution or review.",
				],
				[
					"Agent Coordination",
					"A reliable system needs clear rules for how agents communicate and transfer work.",
				],
				[
					"When Multi-Agent Helps",
					"Multiple agents can be useful when a workflow naturally contains independent specialist responsibilities.",
				],
				[
					"The Complexity Cost",
					"More agents also mean more orchestration, latency, debugging and opportunities for failure.",
				],
			],
		),
	},

	// ========================================================
	// AUTOMATION — 5
	// ========================================================

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
	// ========================================================
// ARTICLE DEFINITIONS — PART 2
// ========================================================

	// ========================================================
	// AUTOMATION — 5
	// ========================================================

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

	// ========================================================
	// AI TOOLS — 5
	// ========================================================

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

	// ========================================================
	// PRODUCTIVITY — 5
	// ========================================================

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
	
// ============================================================
// ARTICLES — CONTINUED
// ============================================================

const ARTICLE_DEFINITIONS = [
	{
		categorySlug: "reviews",
		title: "Claude Review 2026: Is It Better Than ChatGPT?",
		excerpt:
			"Our hands-on Claude review covering writing, coding, long documents, reasoning, pricing and everyday use.",
		authorSlug: "marcus-webb",
		tags: ["Reviews", "AI Tools", "LLM"],
		readingTime: 9,
		featured: true,
		content: articleContent(
			"Claude has developed a strong reputation for long-form reasoning and structured writing.",
			[
				[
					"Writing Quality",
					"Claude is particularly effective when instructions require structure and detailed explanation.",
				],
				[
					"Long Documents",
					"Large-context workflows are one of the platform's major strengths.",
				],
				[
					"Coding",
					"Claude can assist with generation, debugging and understanding larger software tasks.",
				],
				[
					"Who Should Use It?",
					"Users who prioritize long documents, careful writing and structured reasoning may find Claude especially useful.",
				],
			],
		),
	},

	{
		categorySlug: "reviews",
		title: "Zapier Review 2026: Is It Still the Best Automation Tool?",
		excerpt:
			"A practical Zapier review covering integrations, ease of use, AI automation, pricing and real-world workflows.",
		authorSlug: "marcus-webb",
		tags: ["Reviews", "Automation", "AI Tools"],
		readingTime: 8,
		content: articleContent(
			"Zapier remains one of the most recognizable workflow automation platforms, but its value depends on the complexity of your needs.",
			[
				[
					"Ease of Use",
					"Zapier is designed to make integrations accessible to non-technical users.",
				],
				[
					"Integrations",
					"The platform supports a large ecosystem of connected applications.",
				],
				[
					"AI Workflows",
					"AI-assisted automation can reduce manual configuration and enable more intelligent workflows.",
				],
				[
					"Verdict",
					"Zapier is a strong option when simplicity and application connectivity are priorities.",
				],
			],
		),
	},

	{
		categorySlug: "reviews",
		title: "Midjourney Review 2026: Is It Still the Best AI Image Generator?",
		excerpt:
			"A hands-on review of Midjourney for photorealistic images, creative design, prompting and professional visual work.",
		authorSlug: "marcus-webb",
		tags: ["Reviews", "AI Image", "AI Tools"],
		readingTime: 8,
		content: articleContent(
			"Midjourney remains one of the best-known AI image generation platforms for creative and visual work.",
			[
				[
					"Image Quality",
					"The platform is particularly well known for visually rich and highly stylized generations.",
				],
				[
					"Prompting",
					"Users can influence composition, style and subject through carefully designed prompts.",
				],
				[
					"Professional Use",
					"Creative teams can use generated imagery for concepts, campaigns and visual experimentation.",
				],
				[
					"Verdict",
					"Midjourney remains compelling for creators who prioritize image quality and creative control.",
				],
			],
		),
	},

	{
		categorySlug: "reviews",
		title: "Notion AI Review 2026: Is It Worth Adding to Your Workspace?",
		excerpt:
			"A practical review of Notion AI for notes, knowledge management, writing, search and team productivity.",
		authorSlug: "marcus-webb",
		tags: ["Reviews", "Productivity", "AI Tools"],
		readingTime: 8,
		content: articleContent(
			"Notion AI is most useful when AI assistance is integrated directly into the workspace where your information already lives.",
			[
				[
					"Writing",
					"Notion AI can help draft, rewrite and summarize documents.",
				],
				[
					"Knowledge",
					"AI assistance can make large collections of internal notes easier to search and understand.",
				],
				[
					"Team Work",
					"Teams can use AI to summarize projects and turn information into actionable content.",
				],
				[
					"Verdict",
					"Notion AI is especially attractive to users already invested in the Notion workspace.",
				],
			],
		),
	},

	// ========================================================
	// GUIDES — 5
	// ========================================================

	{
		categorySlug: "guides",
		title: "How to Use AI Like a Pro: 15 Practical Tips That Actually Work",
		excerpt:
			"Improve your AI results with better instructions, context, examples, verification and repeatable workflows.",
		authorSlug: "elena-cho",
		tags: ["Guides", "Prompting", "AI Tools"],
		readingTime: 10,
		featured: true,
		content: articleContent(
			"Better AI results usually come from better workflow design rather than complicated prompting tricks.",
			[
				[
					"Give Clear Instructions",
					"State the objective, context and expected output clearly.",
				],
				[
					"Provide Examples",
					"Examples help the model understand the style and structure you expect.",
				],
				[
					"Break Large Tasks Down",
					"Complex work often produces better results when divided into smaller stages.",
				],
				[
					"Ask for Verification",
					"Important outputs should be checked against reliable sources and requirements.",
				],
				[
					"Create Repeatable Prompts",
					"Save successful instructions and turn them into reusable workflows.",
				],
			],
		),
	},

	{
		categorySlug: "guides",
		title: "How to Write Better AI Prompts: The Complete Beginner's Guide",
		excerpt:
			"Learn a simple prompt framework for getting clearer, more accurate and more useful AI responses.",
		authorSlug: "elena-cho",
		tags: ["Guides", "Prompting", "LLM"],
		readingTime: 9,
		content: articleContent(
			"Prompting becomes easier when you treat an AI request as a clear specification rather than a casual question.",
			[
				[
					"Define the Goal",
					"Explain exactly what you want the AI to accomplish.",
				],
				[
					"Add Context",
					"Provide the information the model needs to make an informed response.",
				],
				[
					"Specify the Format",
					"Tell the AI whether you want a table, list, explanation, code or another output format.",
				],
				[
					"Set Constraints",
					"Include word limits, tone, audience, exclusions and other important requirements.",
				],
			],
		),
	},

	{
		categorySlug: "guides",
		title: "How to Build an AI Workflow From Scratch",
		excerpt:
			"Create your first reliable AI workflow by combining triggers, context, AI reasoning, actions and validation.",
		authorSlug: "elena-cho",
		tags: ["Guides", "Automation", "AI Agents"],
		readingTime: 10,
		content: articleContent(
			"AI workflows work best when every stage has a clearly defined responsibility.",
			[
				[
					"Define the Trigger",
					"Start with a clear event that should begin the workflow.",
				],
				[
					"Collect Context",
					"Gather the data the AI needs before making a decision.",
				],
				[
					"Process With AI",
					"Use AI for interpretation, classification or generation.",
				],
				[
					"Perform an Action",
					"Connect the workflow to the application where the result needs to be used.",
				],
				[
					"Validate the Output",
					"Check important results before allowing high-impact actions.",
				],
			],
		),
	},

	{
		categorySlug: "guides",
		title: "How to Start an AI Side Hustle in 2026: A Practical Roadmap",
		excerpt:
			"A realistic roadmap for using AI to create services, content, automation systems and digital products.",
		authorSlug: "marcus-webb",
		tags: ["Guides", "Business AI", "AI Tools"],
		readingTime: 11,
		content: articleContent(
			"AI can reduce the cost of starting small digital businesses, but success still depends on solving a real customer problem.",
			[
				[
					"Choose a Valuable Problem",
					"Start with a service or workflow people are already willing to pay to improve.",
				],
				[
					"Use AI to Increase Output",
					"AI can accelerate research, writing, design and repetitive production tasks.",
				],
				[
					"Build a Repeatable Process",
					"Document successful workflows so delivery becomes faster and more consistent.",
				],
				[
					"Find Customers",
					"Focus on a specific audience and communicate a clear business outcome.",
				],
				[
					"Improve Over Time",
					"Customer feedback should determine which services and workflows you continue developing.",
				],
			],
		),
	},

	{
		categorySlug: "guides",
		title: "How to Automate Content Creation With AI Without Losing Quality",
		excerpt:
			"Build an AI content workflow that speeds up research and production while keeping human editorial quality.",
		authorSlug: "elena-cho",
		tags: ["Guides", "AI Writing", "Automation"],
		readingTime: 10,
		content: articleContent(
			"AI can accelerate content production, but quality depends on having a strong editorial process around the model.",
			[
				[
					"Research First",
					"Collect reliable information before asking AI to create content.",
				],
				[
					"Create an Outline",
					"Use AI to structure the article around reader intent and useful subtopics.",
				],
				[
					"Draft",
					"Generate a first draft while keeping factual and editorial requirements explicit.",
				],
				[
					"Fact Check",
					"Verify important claims rather than publishing AI-generated information blindly.",
				],
				[
					"Human Edit",
					"Add original insight, examples, experience and editorial judgment before publishing.",
				],
			],
		),
	},
] as const;

// ============================================================
// HERO IMAGE SYSTEM
// ============================================================

const HERO_IMAGES = [
	"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
	"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=85",
	"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85",
	"https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&q=85",
	"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
	"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85",
	"https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=1600&q=85",
	"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1600&q=85",
] as const;

// ============================================================
// MAIN
// ============================================================

async function main() {
	console.log("[seed] Starting NEXORA seed...");

	// ========================================================
	// ADMIN
	// ========================================================

	const adminEmail =
		process.env.ADMIN_EMAIL || "admin@nexora.dev";

	const adminPassword =
		process.env.ADMIN_PASSWORD || "NexoraAdmin!2026";

	const passwordHash = await bcrypt.hash(
		adminPassword,
		12,
	);

	const adminUser = await prisma.user.upsert({
		where: {
			email: adminEmail,
		},
		update: {
			passwordHash,
			role: "ADMIN",
		},
		create: {
			email: adminEmail,
			passwordHash,
			role: "ADMIN",
		},
	});

	// ========================================================
	// AUTHORS
	// ========================================================

	const leadEditor = await prisma.author.upsert({
		where: {
			slug: "elena-cho",
		},
		update: {
			name: "Elena Cho",
			role: "Senior AI Editor",
			bio:
				"Elena covers AI agents, automation, enterprise AI and the future of work.",
			userId: adminUser.id,
		},
		create: {
			slug: "elena-cho",
			name: "Elena Cho",
			role: "Senior AI Editor",
			bio:
				"Elena covers AI agents, automation, enterprise AI and the future of work.",
			userId: adminUser.id,
		},
	});

	const contributingAuthor =
		await prisma.author.upsert({
			where: {
				slug: "marcus-webb",
			},
			update: {
				name: "Marcus Webb",
				role: "AI Tools Reviewer",
				bio:
					"Marcus tests AI software and reviews tools based on practical workflows rather than marketing claims.",
			},
			create: {
				slug: "marcus-webb",
				name: "Marcus Webb",
				role: "AI Tools Reviewer",
				bio:
					"Marcus tests AI software and reviews tools based on practical workflows rather than marketing claims.",
			},
		});

	// ========================================================
	// CORE CATEGORIES
	// ========================================================

	const categoryIds = new Map<string, string>();

	for (const category of CORE_CATEGORIES) {
		const row = await prisma.category.upsert({
			where: {
				slug: category.slug,
			},
			update: {
				name: category.name,
				description: category.description,
			},
			create: {
				slug: category.slug,
				name: category.name,
				description: category.description,
			},
		});

		categoryIds.set(category.slug, row.id);
	}

	// ========================================================
	// TAGS
	// ========================================================

	const tagIds = new Map<string, string>();

	for (const name of TAG_NAMES) {
		const slug = slugify(name);

		const row = await prisma.tag.upsert({
			where: {
				slug,
			},
			update: {
				name,
			},
			create: {
				slug,
				name,
			},
		});

		tagIds.set(name, row.id);
	}

	// ========================================================
	// TOOL CATEGORIES
	// ========================================================

	const toolCategoryIds = new Map<string, string>();

	for (const category of TOOL_CATEGORIES) {
		const row = await prisma.toolCategory.upsert({
			where: {
				slug: category.slug,
			},
			update: {
				name: category.name,
			},
			create: {
				slug: category.slug,
				name: category.name,
			},
		});

		toolCategoryIds.set(category.slug, row.id);
	}

	const developerCategory =
		await prisma.toolCategory.upsert({
			where: {
				slug: "developer-tools",
			},
			update: {
				name: "Developer Tools",
			},
			create: {
				slug: "developer-tools",
				name: "Developer Tools",
			},
		});

	toolCategoryIds.set(
		"developer-tools",
		developerCategory.id,
	);

	// ========================================================
	// TOOLS
	// ========================================================

	const toolIds = new Map<string, string>();

	let freeTools = 0;
	let paidTools = 0;

	for (const [index, tool] of TOOLS.entries()) {
		const categoryId = toolCategoryIds.get(
			tool.category,
		);

		if (!categoryId) {
			throw new Error(
				`[seed] Missing tool category: ${tool.category}`,
			);
		}

		const isPaid = tool.pricing === "Paid";

		if (isPaid) {
			paidTools++;
		} else {
			freeTools++;
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
		});

		toolIds.set(tool.slug, row.id);
	}

	console.log(
		`[seed] Tools: ${TOOLS.length} total (${freeTools} free, ${paidTools} paid)`,
	);

	// ========================================================
	// ARTICLES
	// ========================================================

	const categoryArticleCounts =
		new Map<string, number>();

	for (const article of ARTICLE_DEFINITIONS) {
		const categoryId = categoryIds.get(
			article.categorySlug,
		);

		if (!categoryId) {
			throw new Error(
				`[seed] Missing article category: ${article.categorySlug}`,
			);
		}

		const authorId =
			article.authorSlug === "elena-cho"
				? leadEditor.id
				: contributingAuthor.id;

		const tagConnect = article.tags
			.map((tag) => tagIds.get(tag))
			.filter(
				(id): id is string => Boolean(id),
			);

		if (tagConnect.length !== article.tags.length) {
			const missingTags = article.tags.filter(
				(tag) => !tagIds.has(tag),
			);

			throw new Error(
				`[seed] Missing article tags for "${article.title}": ${missingTags.join(", ")}`,
			);
		}

		const existingCount =
			categoryArticleCounts.get(
				article.categorySlug,
			) || 0;

		categoryArticleCounts.set(
			article.categorySlug,
			existingCount + 1,
		);

		const articleIndex =
			ARTICLE_DEFINITIONS.indexOf(article);

		const slug = slugify(article.title);

		const heroImage =
			HERO_IMAGES[
				articleIndex % HERO_IMAGES.length
			];

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
		});
	}

	console.log(
		`[seed] Articles created/updated: ${ARTICLE_DEFINITIONS.length}`,
	);

	// ========================================================
	// COMPARISON
	// ========================================================

	const chatgptId = toolIds.get("chatgpt");
	const claudeId = toolIds.get("claude");

	if (chatgptId && claudeId) {
		const comparisonData = {
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
		};

		await prisma.comparison.upsert({
			where: {
				slug: "chatgpt-vs-claude",
			},
			update: comparisonData,
			create: {
				slug: "chatgpt-vs-claude",
				...comparisonData,
			},
		});

		console.log(
			"[seed] Comparison created/updated: chatgpt-vs-claude",
		);
	} else {
		console.warn(
			"[seed] Skipping comparison because ChatGPT or Claude tool was not found.",
		);
	}

	// ========================================================
	// SITE SETTINGS
	// ========================================================

	const socialLinks = {
		twitter: "https://twitter.com/nexora",
		linkedin:
			"https://linkedin.com/company/nexora",
		youtube:
			"https://youtube.com/@nexoraAI",
	};

	const siteSettingsData = {
		siteName: "NEXORA",
		description:
			"NEXORA is a premium AI technology publication covering AI agents, automation, AI tools, productivity, business AI and the future of work.",
		defaultSeoTitle:
			"NEXORA — AI Agents, Automation, AI Tools & The Future of Work",
		defaultSeoDescription:
			"Discover the best AI tools, AI agent guides, automation workflows, software reviews and practical business AI strategies.",
		socialLinks,
		newsletterEnabled: true,
		adsEnabled: false,
		affiliateEnabled: true,
	};

	await prisma.siteSettings.upsert({
		where: {
			id: "singleton",
		},
		update: siteSettingsData,
		create: {
			id: "singleton",
			...siteSettingsData,
		},
	});

	console.log("[seed] Site settings created/updated.");

	// ========================================================
	// VALIDATION
	// ========================================================

	if (TOOLS.length !== 50) {
		throw new Error(
			`[seed] Expected 50 tools, found ${TOOLS.length}`,
		);
	}

	if (freeTools !== 25) {
		throw new Error(
			`[seed] Expected 25 free tools, found ${freeTools}`,
		);
	}

	if (paidTools !== 25) {
		throw new Error(
			`[seed] Expected 25 paid tools, found ${paidTools}`,
		);
	}

	if (ARTICLE_DEFINITIONS.length !== 35) {
		throw new Error(
			`[seed] Expected 35 articles, found ${ARTICLE_DEFINITIONS.length}`,
		);
	}

	for (const category of CORE_CATEGORIES) {
		const count =
			categoryArticleCounts.get(category.slug) || 0;

		if (count !== 5) {
			throw new Error(
				`[seed] Category ${category.slug} expected 5 articles, found ${count}`,
			);
		}
	}

	console.log(
		"[seed] Validation passed: 35 articles + 50 tools.",
	);

	console.log(
		`[seed] Admin login: ${adminEmail} / ${adminPassword}`,
	);

	console.log(
		"[seed] NEXORA seed completed successfully.",
	);
}

// ============================================================
// RUN
// ============================================================

main()
	.catch((error) => {
		console.error("[seed] Error:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});


