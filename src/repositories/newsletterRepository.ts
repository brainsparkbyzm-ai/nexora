import { prisma } from "@/lib/prisma"

export async function findSubscriberByEmail(email: string) {
	return prisma.newsletterSubscriber.findUnique({ where: { email } })
}

export async function createSubscriber(email: string, firstName?: string | null) {
	return prisma.newsletterSubscriber.create({ data: { email, firstName: firstName ?? null } })
}

export async function unsubscribe(email: string) {
	return prisma.newsletterSubscriber.updateMany({
		where: { email },
		data: { unsubscribedAt: new Date() },
	})
}

export async function resubscribe(email: string) {
	return prisma.newsletterSubscriber.update({
		where: { email },
		data: { unsubscribedAt: null },
	})
}

export async function countActiveSubscribers() {
	return prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } })
}
