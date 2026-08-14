import { prisma } from "@/lib/prisma"

export async function createSubscriber(
	email: string,
	_firstName?: string | null,
) {
	return prisma.newsletterSubscriber.create({
		data: {
			email,
		},
	})
}

export async function findSubscriberByEmail(email: string) {
	return prisma.newsletterSubscriber.findUnique({
		where: {
			email,
		},
	})
}

export async function unsubscribeSubscriber(email: string) {
	return prisma.newsletterSubscriber.delete({
		where: {
			email,
		},
	})
}

export async function listSubscribers() {
	return prisma.newsletterSubscriber.findMany({
		orderBy: {
			createdAt: "desc",
		},
	})
}

