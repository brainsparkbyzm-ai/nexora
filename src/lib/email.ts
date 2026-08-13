import { Resend } from "resend"

/**
 * Transactional email abstraction. All application code sends mail through
 * `sendEmail()` below; only this file knows about the concrete provider
 * (Resend by default). Swapping to Postmark/SES/SendGrid means editing this
 * file only.
 */

export type SendEmailInput = {
	to: string
	subject: string
	html: string
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; error?: string }> {
	const provider = process.env.EMAIL_PROVIDER || "resend"
	const apiKey = process.env.EMAIL_API_KEY
	const from = process.env.EMAIL_FROM || "NEXORA <newsletter@nexora.ai>"

	if (!apiKey) {
		// No provider configured (e.g. local dev) — log instead of throwing so
		// flows like newsletter signup still succeed end-to-end locally.
		console.info(`[email:${provider}] (no API key set) would send to ${input.to}: ${input.subject}`)
		return { ok: true }
	}

	try {
		switch (provider) {
			case "resend": {
				const resend = new Resend(apiKey)
				await resend.emails.send({ from, to: input.to, subject: input.subject, html: input.html })
				return { ok: true }
			}
			default:
				throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`)
		}
	} catch (error) {
		console.error("sendEmail failed", error)
		return { ok: false, error: error instanceof Error ? error.message : "unknown error" }
	}
}

export function newsletterWelcomeEmail(firstName?: string | null): string {
	const greeting = firstName ? `Hi ${firstName},` : "Hi,"
	return `
		<div style="font-family:sans-serif;max-width:520px;margin:0 auto">
			<h1 style="font-size:20px">${greeting}</h1>
			<p>Thanks for subscribing to NEXORA. You'll get our best AI agent, automation, and tool coverage in your inbox.</p>
			<p style="color:#93a0b4;font-size:13px">You can unsubscribe at any time from any newsletter email.</p>
		</div>
	`
}
