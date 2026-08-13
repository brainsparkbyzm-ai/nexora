import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CORE_CATEGORIES = [
  {
    slug: "ai-agents",
    name: "AI Agents",
    description:
      "Autonomous and multi-agent systems reshaping how work gets done.",
  },
  {
    slug: "automation",
    name: "Automation",
    description:
      "Workflow automation, RPA, and orchestration for modern teams.",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    description:
      "Software built on top of modern AI models.",
  },
  {
    slug: "productivity",
    name: "Productivity",
    description:
      "AI-powered productivity workflows and habits.",
  },
  {
    slug: "business-ai",
    name: "Business AI",
    description:
      "How companies deploy AI in real operations.",
  },
  {
    slug: "reviews",
    name: "Reviews",
    description:
      "Independent, hands-on AI software reviews.",
  },
  {
    slug: "guides",
    name: "Guides",
    description:
      "Step-by-step tutorials for working with AI.",
  },
];

const TOOL_CATEGORIES = [
  { slug: "chatbots", name: "Chatbots & Assistants" },
  { slug: "writing", name: "Writing & Content" },
  { slug: "productivity-tools", name: "Productivity" },
  { slug: "automation-tools", name: "Automation" },
  { slug: "design", name: "Design & Creative" },
];

const TOOLS = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    description:
      "General-purpose AI assistant for writing, research, coding, analysis, and everyday productivity.",
    websiteUrl: "https://chatgpt.com",
    pricing: "Free / Paid",
    featured: true,
    category: "chatbots",
  },
  {
    slug: "claude",
    name: "Claude",
    description:
      "AI assistant focused on reasoning, long-context work, writing, analysis, and coding.",
    websiteUrl: "https://claude.ai",
    pricing: "Free / Paid",
    featured: true,
    category: "chatbots",
  },
  {
    slug: "zapier",
    name: "Zapier",
    description:
      "Automation platform for connecting applications and building AI-powered workflows.",
    websiteUrl: "https://zapier.com",
    pricing: "Free / Paid",
    featured: true,
    category: "automation-tools",
  },
];

const TAG_NAMES = [
  "Multi-Agent",
  "LLM",
  "No-Code",
  "Enterprise",
  "Prompting",
  "Case Study",
  "Automation",
  "AI Tools",
  "Productivity",
  "Business AI",
  "Reviews",
  "Guides",
];

const ARTICLES = [
  {
    slug: "the-complete-guide-to-ai-automation-for-businesses",
    title: "The Complete Guide to AI Automation for Businesses",
    excerpt:
      "Everything a growing company needs to know before rolling out AI automation across email, CRM, documents and analytics.",
    content:
      "<p>Rolling out AI automation across a business works best as a staged process rather than a single big-bang launch.</p>" +
      "<h2>Stage 1: Pick one workflow</h2>" +
      "<p>Choose a process with clear inputs, outputs and a measurable definition of success. Good starting points include customer support triage, lead qualification, document processing and internal reporting.</p>" +
      "<h2>Stage 2: Connect your systems</h2>" +
      "<p>Most of the real work is integration. Email, CRM, documents, databases and analytics systems need to exchange information reliably.</p>" +
      "<h2>Stage 3: Add intelligence carefully</h2>" +
      "<p>Use AI where interpretation or judgment is required, while keeping deterministic rules for simple operations that do not need a language model.</p>" +
      "<h2>Stage 4: Expand deliberately</h2>" +
      "<p>Only add new workflows once the first automation is stable, measurable and trusted by the team using it.</p>",
    categorySlug: "business-ai",
    authorSlug: "elena-cho",
    featured: true,
    trending: true,
    tags: ["Enterprise", "Case Study"],
    readingTime: 11,
  },
  {
    slug: "how-businesses-are-using-ai-agents",
    title: "How Businesses Are Using AI Agents in 2026",
    excerpt:
      "From customer support to internal operations, these are the business workflows where AI agents are creating practical value.",
    content:
      "<p>Businesses are moving beyond AI experiments and beginning to integrate agents into everyday operations.</p>" +
      "<h2>Customer operations</h2>" +
      "<p>Agents can classify incoming requests, gather account information, prepare responses and route complex cases to the right employee.</p>" +
      "<h2>Sales operations</h2>" +
      "<p>AI systems can research prospects, summarize customer histories and prepare personalized follow-ups for sales teams.</p>" +
      "<h2>Internal knowledge</h2>" +
      "<p>Agents can search company documentation and provide employees with answers based on internal sources.</p>" +
      "<h2>Business intelligence</h2>" +
      "<p>AI can turn raw reports into summaries and highlight unusual changes that deserve human attention.</p>",
    categorySlug: "business-ai",
    authorSlug: "marcus-webb",
    tags: ["Enterprise", "Case Study"],
    readingTime: 8,
  },
  {
    slug: "ai-business-strategy-guide-for-leaders",
    title: "An AI Strategy Guide for Business Leaders",
    excerpt:
      "A practical framework for deciding where AI belongs in a company and where traditional software still makes more sense.",
    content:
      "<p>AI strategy should begin with business outcomes rather than technology trends. Leaders need to understand which problems actually benefit from intelligent automation.</p>" +
      "<h2>Start with business problems</h2>" +
      "<p>Identify expensive, repetitive or slow processes before evaluating specific AI products.</p>" +
      "<h2>Choose measurable use cases</h2>" +
      "<p>A good first project has a clear baseline and an outcome that can be measured after implementation.</p>" +
      "<h2>Build governance early</h2>" +
      "<p>Security, permissions, data handling and human oversight should be part of the design from the beginning.</p>" +
      "<h2>Scale what works</h2>" +
      "<p>Once an AI workflow proves its value, document it and create a repeatable process for deploying similar solutions elsewhere.</p>",
    categorySlug: "business-ai",
    authorSlug: "elena-cho",
    tags: ["Enterprise"],
    readingTime: 8,
  },
  {
    slug: "chatgpt-review-is-it-still-worth-it-in-2026",
    title: "ChatGPT Review: Is It Still Worth It in 2026?",
    excerpt:
      "An updated, hands-on review of ChatGPT's strengths, weaknesses and where it fits against newer competitors.",
    content:
      "<p>We revisited ChatGPT across writing, coding, research, analysis and everyday productivity workflows.</p>" +
      "<h2>What it does well</h2>" +
      "<p>ChatGPT remains a highly versatile assistant with strong general-purpose capabilities across a wide range of tasks.</p>" +
      "<h2>Where it struggles</h2>" +
      "<p>Like every general-purpose AI assistant, it can produce incorrect information and may require careful verification for important work.</p>" +
      "<h2>Who should use it</h2>" +
      "<p>It is particularly useful for people who want one flexible AI workspace covering writing, research, coding and general problem solving.</p>" +
      "<h2>Our verdict</h2>" +
      "<p>ChatGPT remains one of the strongest all-round options, but the best choice depends on the user's workflow and the features they value most.</p>",
    categorySlug: "reviews",
    authorSlug: "marcus-webb",
    featured: true,
    trending: true,
    tags: ["Prompting"],
    readingTime: 7,
  },
  {
    slug: "claude-review-is-it-the-best-ai-assistant",
    title: "Claude Review: Is It the Best AI Assistant?",
    excerpt:
      "A practical review of Claude for writing, research, long documents, coding and professional workflows.",
    content:
      "<p>Claude has built a strong reputation around long-form reasoning, structured writing and working with large amounts of context.</p>" +
      "<h2>Writing quality</h2>" +
      "<p>Claude is particularly strong when a task requires clear structure, careful explanation and long-form output.</p>" +
      "<h2>Working with documents</h2>" +
      "<p>Large documents and complex instructions are among the areas where Claude can be especially useful.</p>" +
      "<h2>For developers</h2>" +
      "<p>Claude can also be useful for code generation, debugging, explanation and working through larger software tasks.</p>" +
      "<h2>Our verdict</h2>" +
      "<p>Claude is an excellent option for users who prioritize long-context work, thoughtful writing and structured analysis.</p>",
    categorySlug: "reviews",
    authorSlug: "marcus-webb",
    tags: ["LLM", "Prompting"],
    readingTime: 8,
  },
  {
    slug: "zapier-ai-review-automation-workflows",
    title: "Zapier AI Review: Is It Worth Using for Automation?",
    excerpt:
      "A hands-on look at Zapier's AI-powered automation features, integrations and real-world workflow capabilities.",
    content:
      "<p>Zapier has long been one of the most accessible ways to connect business applications without writing traditional integration code.</p>" +
      "<h2>Ease of use</h2>" +
      "<p>The platform's visual workflow approach makes it approachable for teams that need automation without maintaining custom infrastructure.</p>" +
      "<h2>AI capabilities</h2>" +
      "<p>AI-assisted workflow creation and intelligent steps can reduce the amount of manual configuration required for certain automations.</p>" +
      "<h2>Where it fits</h2>" +
      "<p>Zapier works especially well for connecting SaaS applications, moving information between systems and triggering routine business processes.</p>" +
      "<h2>Our verdict</h2>" +
      "<p>For teams that value simplicity and a large integration ecosystem, Zapier remains a compelling automation platform.</p>",
    categorySlug: "reviews",
    authorSlug: "marcus-webb",
    tags: ["No-Code", "Case Study"],
    readingTime: 7,
  },
  {
    slug: "a-beginners-guide-to-prompting-ai-agents",
    title: "A Beginner's Guide to Prompting AI Agents",
    excerpt:
      "The core principles for giving agents clear goals, constraints and tools — explained without the jargon.",
    content:
      "<p>Prompting an AI agent is different from prompting a normal chat model. Instead of requesting a single response, you are describing a goal and the environment in which the agent should operate.</p>" +
      "<h2>Start with a clear goal</h2>" +
      "<p>Tell the agent exactly what successful completion looks like. Avoid vague instructions when the task can be described more precisely.</p>" +
      "<h2>Define constraints</h2>" +
      "<p>Explain what the agent is allowed to do, what it should avoid and when it should ask for human approval.</p>" +
      "<h2>Give the right tools</h2>" +
      "<p>An agent can only perform actions through the tools and permissions available to it, so keep its toolset focused.</p>" +
      "<h2>Test with real examples</h2>" +
      "<p>Start with a small number of representative tasks and review the results before expanding the workflow.</p>",
    categorySlug: "guides",
    authorSlug: "elena-cho",
    featured: true,
    trending: true,
    tags: ["Prompting", "Multi-Agent"],
    readingTime: 6,
  },
  {
    slug: "how-to-build-your-first-ai-agent",
    title: "How to Build Your First AI Agent",
    excerpt:
      "A beginner-friendly guide to designing an AI agent with a clear goal, tools, instructions and human oversight.",
    content:
      "<p>Building an AI agent does not have to begin with a complicated architecture. A focused workflow is usually the best starting point.</p>" +
      "<h2>Step 1: Choose one task</h2>" +
      "<p>Select a task with a clear beginning, end and measurable outcome.</p>" +
      "<h2>Step 2: Define the agent's role</h2>" +
      "<p>Give the agent a specific responsibility rather than asking it to handle every possible task.</p>" +
      "<h2>Step 3: Add tools</h2>" +
      "<p>Provide only the tools needed to complete the workflow, such as search, databases or application APIs.</p>" +
      "<h2>Step 4: Add safeguards</h2>" +
      "<p>Define approval requirements, permission boundaries and failure handling before putting the agent into production.</p>" +
      "<h2>Step 5: Test and improve</h2>" +
      "<p>Review failures, refine instructions and gradually expand the agent's responsibilities.</p>",
    categorySlug: "guides",
    authorSlug: "elena-cho",
    tags: ["Multi-Agent", "Prompting"],
    readingTime: 8,
  },
  {
    slug: "how-to-create-an-ai-workflow-step-by-step",
    title: "How to Create an AI Workflow Step by Step",
    excerpt:
      "A simple framework for turning repetitive work into a reliable AI-assisted workflow.",
    content:
      "<p>An effective AI workflow combines human judgment, deterministic automation and AI reasoning where each is most useful.</p>" +
      "<h2>Map the current process</h2>" +
      "<p>Document the existing workflow before changing it. This reveals unnecessary steps and potential failure points.</p>" +
      "<h2>Find the AI step</h2>" +
      "<p>Use AI where the workflow requires interpreting text, generating content, classifying information or making a bounded decision.</p>" +
      "<h2>Connect the systems</h2>" +
      "<p>Make sure information can move reliably between the applications involved in the workflow.</p>" +
      "<h2>Add review points</h2>" +
      "<p>Important or irreversible actions should have an appropriate human approval step.</p>" +
      "<h2>Measure the result</h2>" +
      "<p>Compare the automated workflow against the original process using time, cost, accuracy and completion rate.</p>",
    categorySlug: "guides",
    authorSlug: "elena-cho",
    tags: ["No-Code", "Prompting"],
    readingTime: 7,
  },
];

const ARTICLE_HERO_IMAGES: Record<string, string> = {
  "the-complete-guide-to-ai-automation-for-businesses":
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=85",
  "how-businesses-are-using-ai-agents":
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85",
  "ai-business-strategy-guide-for-leaders":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85",
  "chatgpt-review-is-it-still-worth-it-in-2026":
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1600&q=85",
  "claude-review-is-it-the-best-ai-assistant":
    "https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=1600&q=85",
  "zapier-ai-review-automation-workflows":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
  "a-beginners-guide-to-prompting-ai-agents":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85",
  "how-to-build-your-first-ai-agent":
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&q=85",
  "how-to-create-an-ai-workflow-step-by-step":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
};

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nexora.dev";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn(
      "[seed] ADMIN_PASSWORD not set. Using development credentials: admin@nexora.dev / NexoraAdmin!2026",
    );
  }

  const passwordHash = await bcrypt.hash(
    adminPassword || "NexoraAdmin!2026",
    12,
  );

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
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

  const leadEditor = await prisma.author.upsert({
    where: { slug: "elena-cho" },
    update: {
      name: "Elena Cho",
      role: "Senior AI Editor",
      bio:
        "Elena covers agentic AI, automation platforms, and enterprise AI adoption. Previously a data infrastructure engineer.",
      userId: adminUser.id,
    },
    create: {
      slug: "elena-cho",
      name: "Elena Cho",
      role: "Senior AI Editor",
      bio:
        "Elena covers agentic AI, automation platforms, and enterprise AI adoption. Previously a data infrastructure engineer.",
      userId: adminUser.id,
    },
  });

  const contributingAuthor = await prisma.author.upsert({
    where: { slug: "marcus-webb" },
    update: {
      name: "Marcus Webb",
      role: "AI Tools Reviewer",
      bio:
        "Marcus tests and reviews AI software full-time, focusing on real workflows over marketing claims.",
    },
    create: {
      slug: "marcus-webb",
      name: "Marcus Webb",
      role: "AI Tools Reviewer",
      bio:
        "Marcus tests and reviews AI software full-time, focusing on real workflows over marketing claims.",
    },
  });

  const categoryIds = new Map<string, string>();

  for (const category of CORE_CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
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

  const tagIds = new Map<string, string>();

  for (const name of TAG_NAMES) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const row = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: {
        slug,
        name,
      },
    });

    tagIds.set(name, row.id);
  }

  const toolCategoryIds = new Map<string, string>();

  for (const toolCategory of TOOL_CATEGORIES) {
    const row = await prisma.toolCategory.upsert({
      where: { slug: toolCategory.slug },
      update: { name: toolCategory.name },
      create: {
        slug: toolCategory.slug,
        name: toolCategory.name,
      },
    });

    toolCategoryIds.set(toolCategory.slug, row.id);
  }

  const toolIds = new Map<string, string>();

  for (const tool of TOOLS) {
    const categoryId = toolCategoryIds.get(tool.category);

    if (!categoryId) {
      throw new Error(
        `[seed] Tool category not found for ${tool.slug}: ${tool.category}`,
      );
    }

    const row = await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        pricing: tool.pricing,
        featured: tool.featured,
        categoryId,
      },
      create: {
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        pricing: tool.pricing,
        featured: tool.featured,
        categoryId,
      },
    });

    toolIds.set(tool.slug, row.id);
  }

  await prisma.comparison.upsert({
    where: { slug: "chatgpt-vs-claude" },
    update: {
      title: "ChatGPT vs Claude: Which AI Assistant Should You Use?",
      summary:
        "A side-by-side look at ChatGPT and Claude across reasoning, writing, coding and pricing.",
      toolAId: toolIds.get("chatgpt")!,
      toolBId: toolIds.get("claude")!,
      winnerToolId: null,
      featureTable: [
        {
          feature: "Context window",
          toolA: "128K tokens",
          toolB: "200K tokens",
        },
        {
          feature: "Ecosystem",
          toolA: "Custom GPTs and integrations",
          toolB: "Projects and Artifacts",
        },
        {
          feature: "Starting price",
          toolA: "Free / $20 mo",
          toolB: "Free / $20 mo",
        },
      ],
      verdict:
        "<p>Both are excellent general-purpose assistants. Choose ChatGPT if you want a broad ecosystem and strong multimodal features; choose Claude if you work with very long documents and prefer structured writing.</p>",
      faq: [
        {
          question: "Can I use both ChatGPT and Claude?",
          answer:
            "Yes. Many teams use both assistants side by side for different workflows.",
        },
      ],
    },
    create: {
      slug: "chatgpt-vs-claude",
      title: "ChatGPT vs Claude: Which AI Assistant Should You Use?",
      summary:
        "A side-by-side look at ChatGPT and Claude across reasoning, writing, coding and pricing.",
      toolAId: toolIds.get("chatgpt")!,
      toolBId: toolIds.get("claude")!,
      winnerToolId: null,
      featureTable: [
        {
          feature: "Context window",
          toolA: "128K tokens",
          toolB: "200K tokens",
        },
        {
          feature: "Ecosystem",
          toolA: "Custom GPTs and integrations",
          toolB: "Projects and Artifacts",
        },
        {
          feature: "Starting price",
          toolA: "Free / $20 mo",
          toolB: "Free / $20 mo",
        },
      ],
      verdict:
        "<p>Both are excellent general-purpose assistants. Choose ChatGPT if you want a broad ecosystem and strong multimodal features; choose Claude if you work with very long documents and prefer structured writing.</p>",
      faq: [
        {
          question: "Can I use both ChatGPT and Claude?",
          answer:
            "Yes. Many teams use both assistants side by side for different workflows.",
        },
      ],
    },
  });

  for (const article of ARTICLES) {
    const categoryId = categoryIds.get(article.categorySlug);

    if (!categoryId) {
      throw new Error(
        `[seed] Category not found for article: ${article.slug}`,
      );
    }

    const authorId =
      article.authorSlug === "elena-cho"
        ? leadEditor.id
        : contributingAuthor.id;

    const tagConnect = article.tags
      .map((tagName) => tagIds.get(tagName))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({ id }));

    const heroImage =
      ARTICLE_HERO_IMAGES[article.slug] ?? DEFAULT_HERO_IMAGE;

    await prisma.article.upsert({
      where: { slug: article.slug },
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
          create: tagConnect.map((tag) => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      },
      create: {
        slug: article.slug,
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
          create: tagConnect.map((tag) => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      },
    });
  }

  console.log(
    `[seed] Articles created/updated: ${ARTICLES.length}`,
  );

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      siteName: "NEXORA",
      description:
        "NEXORA is a premium AI technology publication covering AI agents, automation, productivity, business AI, and the future of work.",
      defaultSeoTitle:
        "NEXORA — AI Agents, Automation & The Future of Work",
      defaultSeoDescription:
        "In-depth AI agent guides, automation workflows, tool reviews and comparisons for people building the future of work.",
      socialLinks: {
        twitter: "https://twitter.com/nexora",
        linkedin: "https://linkedin.com/company/nexora",
        youtube: "https://youtube.com/@nexoraAI",
      },
      newsletterEnabled: true,
      adsEnabled: false,
      affiliateEnabled: true,
    },
    create: {
      id: "singleton",
      siteName: "NEXORA",
      description:
        "NEXORA is a premium AI technology publication covering AI agents, automation, productivity, business AI, and the future of work.",
      defaultSeoTitle:
        "NEXORA — AI Agents, Automation & The Future of Work",
      defaultSeoDescription:
        "In-depth AI agent guides, automation workflows, tool reviews and comparisons for people building the future of work.",
      socialLinks: {
        twitter: "https://twitter.com/nexora",
        linkedin: "https://linkedin.com/company/nexora",
        youtube: "https://youtube.com/@nexoraAI",
      },
      newsletterEnabled: true,
      adsEnabled: false,
      affiliateEnabled: true,
    },
  });

  console.log("[seed] Site settings updated.");
  console.log(
    `[seed] Seed complete. Admin login: ${adminEmail} / ${
      adminPassword
        ? "(from ADMIN_PASSWORD env var)"
        : "NexoraAdmin!2026 (DEV ONLY -- set ADMIN_PASSWORD for production)"
    }`,
  );
}

main()
  .catch((error) => {
    console.error("[seed] Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("[seed] Database connection closed.");
    console.log("[seed] NEXORA seed completed successfully.");
  });