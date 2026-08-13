import { z } from "zod"
import * as newsletterRepo from "@/repositories/newsletterRepository"
import { sendEmail, newsletterWelcomeEmail } from "@/lib/email"
import { track } from "@/lib/analytics"

export const subscribeSchema = z.object({
	email: z.string().email(),
	firstName: z.string().max(80).optional(),
})

export type SubscribeResult = {
	success: boolean
	message: string
	fieldErrors?: Record<string, string[] | undefined>
	alreadySubscribed?: boolean
}

export async function subscribeToNewsletter(input: unknown): Promise<SubscribeResult> {
	const parsed = subscribeSchema.safeParse(input)
	if (!parsed.success) {
		return {
			success: false,
			message: "Please enter a valid email address.",
			fieldErrors: parsed.error.flatten().fieldErrors,
		}
	}

	const { email, firstName } = parsed.data
	const existing = await newsletterRepo.findSubscriberByEmail(email)

	if (existing && !existing.unsubscribedAt) {
		return { success: true, alreadySubscribed: true, message: "You're already subscribed." }
	}

	if (!existing) {
		await newsletterRepo.createSubscriber(email, firstName)
	} else {
		await newsletterRepo.resubscribe(email)
	}

	try {
		await sendEmail({
			to: email,
			subject: "Welcome to NEXORA",
			html: newsletterWelcomeEmail(firstName),
		})
	} catch {
		// Signup must not fail just because the email provider is unavailable
		// or unconfigured -- the subscriber row is already saved (Rule 27).
	}
	await track({ name: "newsletter_signup", email })

	return { success: true, message: "You're subscribed! Check your inbox for a welcome email." }
}

export async function unsubscribeFromNewsletter(email: string) {
	await newsletterRepo.unsubscribe(email)
	return { status: "unsubscribed" as const }
}
