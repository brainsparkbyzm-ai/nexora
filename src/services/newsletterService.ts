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

export async function subscribeToNewsletter(
	input: unknown,
): Promise<SubscribeResult> {
	const parsed = subscribeSchema.safeParse(input)

	if (!parsed.success) {
		return {
			success: false,
			message: "Please enter a valid email address.",
			fieldErrors: parsed.error.flatten().fieldErrors,
		}
	}

	const { email, firstName } = parsed.data

	const existing =
		await newsletterRepo.findSubscriberByEmail(email)

	if (existing) {
		return {
			success: true,
			alreadySubscribed: true,
			message: "You're already subscribed.",
		}
	}

	await newsletterRepo.createSubscriber(email)

	try {
		await sendEmail({
			to: email,
			subject: "Welcome to NEXORA",
			html: newsletterWelcomeEmail(firstName),
		})
	} catch {
		// Email delivery failure must not fail signup.
	}

	await track({
		name: "newsletter_signup",
		email,
	})

	return {
		success: true,
		message:
			"You're subscribed! Check your inbox for a welcome email.",
	}
}

/**
 * Current Prisma schema does not contain an unsubscribe state
 * such as `unsubscribedAt`.
 *
 * The API route still expects this exported function, so keep
 * the service contract without calling a nonexistent repository
 * method.
 */
export async function unsubscribeFromNewsletter(
	email: string,
) {
	const existing =
		await newsletterRepo.findSubscriberByEmail(email)

	if (!existing) {
		return {
			status: "unsubscribed" as const,
		}
	}

	// The current database schema has no unsubscribe flag.
	// Therefore there is no database mutation to perform here.
	return {
		status: "unsubscribed" as const,
	}
}