/**
 * Targeted, reversible editorial update for one published comparison.
 *
 * Run only against the intended production database after reviewing the backup
 * revision created by this script. This does not run the general seed.
 */
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not configured.")

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
})

const slugs = ["zapier-vs-make-vs-n8n", "zapier-vs-make-vs-n8n-which-automation-platform-is-best"]
const expectedTitle = "Zapier vs Make vs n8n: Which Automation Tool Is Right for You?"

const title = "Zapier vs Make vs n8n: Which Automation Tool Is Best in 2026?"
const excerpt =
  "Compare Zapier, Make and n8n by workflow cost, integrations, technical effort, hosting and reliability. A practical decision guide for small teams, with official pricing sources checked November 26, 2026."

const content = `
<h2>The short answer</h2>
<p>Choose <strong>Zapier</strong> when the priority is getting a workflow running quickly across a wide range of business apps and the expected task volume is modest. Choose <strong>Make</strong> when you need visual, multi-step workflows with branching and want to understand each operation in a scenario. Choose <strong>n8n</strong> when your team can handle more technical setup and wants code-level flexibility, self-hosting options or billing based on complete workflow executions.</p>
<p>There is no universal winner. The right platform depends on the number of steps in each workflow, how often it runs, who will maintain it and what happens when a step fails.</p>

<h2>What this comparison covers</h2>
<p><strong>Editorial method:</strong> This is a source-led product comparison, not a claim that NEXORA independently load-tested or hands-on benchmarked all three platforms. We compared the vendors' public product and pricing documentation, then assessed the practical trade-offs those published models create for a small team. Pricing and plan details were checked on November 26, 2026. Vendors can change features, limits, regional prices and billing rules; confirm the live plan before purchasing.</p>
<ul>
<li>Official pricing and usage units</li>
<li>Workflow design, integrations and technical learning curve</li>
<li>Hosting, data control and maintenance responsibilities</li>
<li>Failure handling, monitoring and team collaboration</li>
<li>Which platform fits common small-business scenarios</li>
</ul>

<h2>Zapier: best for speed and broad app connectivity</h2>
<p>Zapier is designed to connect business applications with minimal setup. A Zap starts with a trigger and continues through one or more actions. Its main advantage is accessibility: a non-developer can often connect a form, inbox, CRM and spreadsheet without managing a server or writing code. Zapier advertises more than 9,000 app connections on its platform.</p>
<h3>Where Zapier fits</h3>
<ul>
<li>Sending new website leads into a CRM and notifying a sales channel.</li>
<li>Creating support tickets from form submissions or shared inbox messages.</li>
<li>Moving approved records between common SaaS applications.</li>
<li>Simple marketing and sales hand-offs owned by non-technical staff.</li>
</ul>
<h3>Costs and limits to understand</h3>
<p>Zapier's usage model is task-based. A task is generally a successful action performed by a Zap; triggers and some built-in logic steps are treated differently under its billing rules. A workflow with many successful action steps can therefore consume its task allowance faster than a simple two-step automation. The public pricing page lists a free plan and paid Professional and Team tiers, with Professional starting at US$19.99 per month when billed annually at the time checked. The actual price depends on the selected task tier, billing period and currency.</p>
<p><strong>Trade-offs:</strong> The easiest interface does not automatically mean the lowest total cost. High-volume, multi-action workflows can become expensive. Advanced branching and data transformations are possible, but complex flows can become harder to reason about when spread across many Zaps.</p>
<p><strong>Best fit:</strong> A small business that values fast setup, a broad app catalogue and low maintenance more than deep technical control.</p>

<h2>Make: best for visual multi-step workflows</h2>
<p>Make uses a visual scenario builder. You connect modules, route data, add filters and build branches so a workflow can make decisions rather than simply pass information from one app to another. This makes it useful when a process has several conditions or needs to transform data between systems.</p>
<h3>Where Make fits</h3>
<ul>
<li>Routing enquiries to different teams based on form answers or region.</li>
<li>Processing orders through several checks before updating inventory and notifying staff.</li>
<li>Combining spreadsheet, CRM and email data with filters and transformations.</li>
<li>Building repeatable content or reporting pipelines with human review steps.</li>
</ul>
<h3>Costs and limits to understand</h3>
<p>Make bills in credits. Its documentation explains that most module actions consume credits, while some AI-powered features can consume more. A scenario with many modules, frequent polling or repeated processing can use credits faster than expected. Make states that its free plan includes 1,000 credits per month; paid plan prices and allowances depend on the selected plan, credit volume, region and billing period. Check the live pricing calculator rather than relying on an old fixed price copied into a review.</p>
<p><strong>Trade-offs:</strong> The visual builder gives more control than a basic trigger-action workflow, but the learning curve is steeper. You need to understand bundles, filters, routers, module execution and error handling. A poorly designed scenario can be difficult to debug.</p>
<p><strong>Best fit:</strong> A process owner or operations team that wants visual control over multi-step workflows and is willing to learn the builder.</p>

<h2>n8n: best for technical control and self-hosting</h2>
<p>n8n is a workflow automation platform aimed at technical users as well as teams that need more control over their infrastructure. Workflows are assembled from nodes; developers can use code and API requests where a prebuilt integration is not enough. n8n offers a hosted cloud service and a self-hosted Community Edition.</p>
<h3>Where n8n fits</h3>
<ul>
<li>Internal workflows that connect APIs, databases and business systems.</li>
<li>Automations that need custom JavaScript or Python steps.</li>
<li>Teams that want to run automation infrastructure in an environment they control.</li>
<li>AI workflows that combine model calls, tools, routing and human approval.</li>
</ul>
<h3>Costs and limits to understand</h3>
<p>n8n Cloud pricing is based on complete workflow executions rather than charging separately for every step in a run. Its pricing page lists the Starter cloud plan at €20 per month when billed annually for 2,500 executions, with unlimited steps per execution. The Pro plan is listed at €50 per month billed annually for 10,000 executions. Prices are shown in euros on the vendor page and monthly billing costs more. The Community Edition can be self-hosted, but “free software” does not mean zero operating cost: you still need hosting, backups, upgrades, security, monitoring and someone responsible for the instance.</p>
<p><strong>Trade-offs:</strong> n8n offers flexibility, but setup and maintenance require more technical skill. Self-hosting transfers operational responsibility to your team. If a workflow handles customer data or business-critical actions, credential security, access controls, backups and alerting are essential.</p>
<p><strong>Best fit:</strong> A developer or technically capable operations team that values flexibility, control and execution-based billing enough to accept the extra responsibility.</p>

<h2>Side-by-side comparison</h2>
<table>
<thead><tr><th>Decision factor</th><th>Zapier</th><th>Make</th><th>n8n</th></tr></thead>
<tbody>
<tr><td>Primary strength</td><td>Fast setup and broad app connections</td><td>Visual multi-step logic</td><td>Technical flexibility and control</td></tr>
<tr><td>Usage model</td><td>Tasks for successful actions, subject to billing rules</td><td>Credits consumed by modules and some features</td><td>Cloud plans count full workflow executions</td></tr>
<tr><td>Workflow design</td><td>Trigger, actions and built-in logic</td><td>Visual scenarios, routers and filters</td><td>Node-based workflows, code and APIs</td></tr>
<tr><td>Learning curve</td><td>Lowest for common workflows</td><td>Moderate</td><td>Highest for non-technical users</td></tr>
<tr><td>Self-hosting</td><td>No</td><td>No</td><td>Community Edition available</td></tr>
<tr><td>Best owner</td><td>Business user or generalist</td><td>Operations/process owner</td><td>Developer or technical operator</td></tr>
<tr><td>Main risk</td><td>Task costs rise with successful action volume</td><td>Credit use can be hard to estimate in complex scenarios</td><td>Infrastructure and security become your responsibility when self-hosted</td></tr>
</tbody>
</table>

<h2>Example: estimate the cost of one real workflow</h2>
<p>Imagine a lead form starts a workflow that validates the submission, enriches the record, creates a CRM contact, sends an internal notification and adds a follow-up task. Before choosing a plan, write down:</p>
<ol>
<li><strong>Runs per month:</strong> How many new leads or records will trigger it?</li>
<li><strong>Billable actions:</strong> Which successful actions count as tasks, credits or executions on the platform?</li>
<li><strong>Polling frequency:</strong> Does the workflow repeatedly check for new data, and does that check consume usage?</li>
<li><strong>AI usage:</strong> Are model calls or premium AI features billed separately or at a different usage rate?</li>
<li><strong>Failure and retry behavior:</strong> Will retries, incomplete executions or reprocessing consume more allowance?</li>
</ol>
<p>For illustration, if a workflow completes 300 times a month and contains 10 successful action steps, Zapier's task-based model can count many more billable actions than the 300 full runs counted by an execution-based model. Make's credit total depends on which modules execute, including checks and transformations. This is why comparing only the headline monthly plan price is misleading. Build a small pilot and inspect its actual usage before committing to an annual plan.</p>

<h2>Reliability, privacy and security: what buyers should check</h2>
<p>All three products can connect systems that contain customer or company data. Before enabling a workflow, decide what information it may read, where credentials are stored, who can edit it and what the system should do when an action fails.</p>
<ul>
<li><strong>Least privilege:</strong> Connect accounts with only the permissions the workflow needs.</li>
<li><strong>Human approval:</strong> Require review before sending sensitive customer messages, issuing refunds, changing payments or deleting records.</li>
<li><strong>Failure alerts:</strong> Notify a named owner when a workflow stops or repeatedly fails.</li>
<li><strong>Duplicate protection:</strong> Use stable record IDs or idempotency checks so retries do not create duplicate orders or contacts.</li>
<li><strong>Data retention:</strong> Review execution logs, stored payloads, subprocessors and retention settings against your privacy obligations.</li>
<li><strong>Ownership:</strong> Document who maintains the workflow and how another person can take over.</li>
</ul>

<h2>Which one should you choose?</h2>
<h3>Choose Zapier if…</h3>
<p>You are non-technical, your apps are already supported, the workflow is relatively straightforward and you want the quickest route from idea to a working automation. Start with the free tier or a small paid allowance and monitor tasks before scaling.</p>
<h3>Choose Make if…</h3>
<p>Your workflow needs branches, filters, transformations or several connected steps, and you prefer a visual builder. Model the expected monthly credit use before selecting a plan, especially if the scenario polls frequently.</p>
<h3>Choose n8n if…</h3>
<p>You have someone who can own the technical setup, you need custom code or APIs, or you want to evaluate self-hosting. Include server operations, backups, security updates and incident response in the total cost—not just the licence price.</p>

<h2>A practical 30-minute selection test</h2>
<ol>
<li>Pick one repetitive process that currently wastes time, such as routing new leads.</li>
<li>Draw the trigger, each action, decision branch and failure path on paper.</li>
<li>Estimate monthly runs and the number of billable actions or credits.</li>
<li>Build a low-risk test using sample data; do not connect production payment or sensitive customer records first.</li>
<li>Test missing fields, duplicate submissions, expired credentials and failed downstream apps.</li>
<li>Record setup time, monthly usage, errors and the amount of manual work still required.</li>
<li>Only then compare the plan cost with the time saved and maintenance effort.</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>Is Zapier better than Make?</h3>
<p>Zapier is usually easier to start with and has a very broad app directory. Make offers more visual control over complex scenarios. The better option depends on workflow complexity, expected usage and the team's willingness to learn.</p>
<h3>Is n8n really free?</h3>
<p>n8n provides a self-hosted Community Edition. The software licence may not have a subscription fee for eligible internal use, but hosting, maintenance, backups, monitoring and security still cost time or money. n8n Cloud is a separate paid service.</p>
<h3>Which platform is best for AI automation?</h3>
<p>All three can be used in AI-enabled workflows. Compare the model providers, AI features, usage charges, tool permissions and human-approval options for the exact task. Do not choose solely because a product markets itself as “AI-powered.”</p>
<h3>Can I switch platforms later?</h3>
<p>Usually, but workflows do not transfer perfectly. App connections, field mappings, filters, custom code, credentials and error handling may need to be rebuilt. Keep a written workflow map and export or document important logic before migrating.</p>
<h3>What should a small business automate first?</h3>
<p>Start with a frequent, low-risk hand-off where the input and desired output are clear—for example, copying a qualified enquiry into a CRM and notifying a staff member. Avoid automating high-impact decisions until you have monitoring and human review.</p>

<h2>Sources and further reading</h2>
<ul>
<li><a href="https://zapier.com/pricing" rel="nofollow">Zapier official pricing and plan details</a></li>
<li><a href="https://help.zapier.com/hc/en-us/articles/15279018245901-How-pay-per-task-billing-works-in-Zapier" rel="nofollow">Zapier Help: how pay-per-task billing works</a></li>
<li><a href="https://www.make.com/pricing" rel="nofollow">Make official pricing</a></li>
<li><a href="https://help.make.com/" rel="nofollow">Make Help Center: credits, scenarios and operations</a></li>
<li><a href="https://n8n.io/pricing/" rel="nofollow">n8n official pricing and plan comparison</a></li>
<li><a href="https://docs.n8n.io/hosting/" rel="nofollow">n8n documentation: hosting and self-hosting</a></li>
</ul>
<p><em>Last checked: November 26, 2026. Plan prices, included usage, currencies and features can change. Verify the linked vendor pages for your country and billing period before buying.</em></p>
`.trim()

async function main() {
  try {
    const article = await prisma.article.findFirst({ where: { slug: { in: slugs } } })
    if (!article) throw new Error(`Comparison article not found under either known slug. No changes made.`)
    if (article.title !== expectedTitle) {
      throw new Error(`Unexpected article title for ${article.slug}. No changes made.`)
    }

    const wordCount = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 220))

    // Preserve the exact existing title, excerpt and HTML in the revision table first.
    await prisma.revision.create({
      data: {
        articleId: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        editedBy: "NEXORA editorial update 2026-11-26",
      },
    })

    await prisma.article.update({
      where: { id: article.id },
      data: {
        title,
        excerpt,
        content,
        readingTime,
        seoTitle: "Zapier vs Make vs n8n: Best Automation Tool (2026)",
        seoDescription:
          "Zapier vs Make vs n8n compared by pricing model, workflow complexity, integrations, hosting and team fit. See which automation platform suits your business.",
        canonicalUrl: `https://www.nexorahub.space/articles/${article.slug}`,
      },
    })

    console.log(`Updated ${article.slug}; previous version saved as a Revision; ${wordCount} words; ${readingTime} min read.`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error("Targeted article update failed:", error)
  process.exitCode = 1
})
