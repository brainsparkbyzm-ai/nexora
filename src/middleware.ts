import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const COOKIE_NAME =
    process.env.AUTH_COOKIE_NAME || "nexora_session"

type SessionPayload = {
    sub: string
    email: string
    role: "ADMIN" | "EDITOR" | "AUTHOR"
}

async function verifySession(
    token: string | undefined,
): Promise<SessionPayload | null> {
    if (!token) return null

    const secret = process.env.AUTH_SECRET

    if (!secret) {
        console.error("[middleware] AUTH_SECRET is missing")
        return null
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret),
        )

        if (
            typeof payload.sub !== "string" ||
            typeof payload.email !== "string" ||
            !["ADMIN", "EDITOR", "AUTHOR"].includes(
                String(payload.role),
            )
        ) {
            return null
        }

        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role as SessionPayload["role"],
        }
    } catch {
        return null
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isAdminLogin = pathname === "/admin/login"
    const isAdminPage =
        pathname === "/admin" ||
        pathname.startsWith("/admin/")

    const isAdminApi =
        pathname === "/api/admin" ||
        pathname.startsWith("/api/admin/")

    /*
     * Login page must ALWAYS be accessible.
     *
     * This is important because middleware should never redirect
     * /admin/login back to itself.
     */
    if (isAdminLogin) {
        return NextResponse.next()
    }

    if (!isAdminPage && !isAdminApi) {
        return NextResponse.next()
    }

    const token = request.cookies.get(COOKIE_NAME)?.value
    const session = await verifySession(token)

    if (!session) {
        if (isAdminApi) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            )
        }

        const loginUrl = new URL(
            "/admin/login",
            request.url,
        )

        loginUrl.searchParams.set(
            "next",
            pathname,
        )

        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/api/admin",
        "/api/admin/:path*",
    ],
}