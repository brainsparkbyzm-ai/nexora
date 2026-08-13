import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { UserRole } from "@prisma/client"

const COOKIE_NAME =
    process.env.AUTH_COOKIE_NAME || "nexora_session"

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getSecretKey() {
    const secret = process.env.AUTH_SECRET

    if (!secret || secret.length < 16) {
        throw new Error(
            "AUTH_SECRET is missing or too short. Set a long random value in .env."
        )
    }

    return new TextEncoder().encode(secret)
}

export type SessionPayload = {
    sub: string
    email: string
    role: UserRole
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export async function createSessionCookie(
    payload: SessionPayload
): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
        .sign(getSecretKey())
}

export async function verifySessionToken(
    token: string
): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(
            token,
            getSecretKey()
        )

        if (
            typeof payload.sub !== "string" ||
            typeof payload.email !== "string" ||
            typeof payload.role !== "string"
        ) {
            return null
        }

        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role as UserRole,
        }
    } catch {
        return null
    }
}

export async function setSessionCookie(
    token: string
): Promise<void> {
    const store = await cookies()

    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
    })
}

export async function clearSessionCookie(): Promise<void> {
    const store = await cookies()
    store.delete(COOKIE_NAME)
}

export async function getSession(): Promise<SessionPayload | null> {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value

    if (!token) {
        return null
    }

    return verifySessionToken(token)
}

export async function getCurrentUser() {
    const session = await getSession()

    if (!session) {
        return null
    }

    return prisma.user.findUnique({
        where: {
            id: session.sub,
        },
    })
}

const ROLE_RANK: Record<UserRole, number> = {
    AUTHOR: 1,
    EDITOR: 2,
    ADMIN: 3,
}

export function roleSatisfies(
    role: UserRole,
    minimumRole: UserRole
): boolean {
    return ROLE_RANK[role] >= ROLE_RANK[minimumRole]
}

export async function requireRole(
    minimumRole: UserRole
) {
    const session = await getSession()

    if (
        !session ||
        !roleSatisfies(session.role, minimumRole)
    ) {
        return null
    }

    return session
}

export async function requireRoleOrRedirect(
    minimumRole: UserRole
) {
    const session = await getSession()

    if (
        !session ||
        !roleSatisfies(session.role, minimumRole)
    ) {
        redirect("/admin/login")
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.sub,
        },
        include: {
            author: true,
        },
    })

    if (!user?.author) {
        redirect("/admin/login")
    }

    return {
        ...session,
        authorId: user.author.id,
    }
}

export async function authenticate(
    email: string,
    password: string
) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (!user) {
        return null
    }

    const valid = await verifyPassword(
        password,
        user.passwordHash
    )

    if (!valid) {
        return null
    }

    return user
}