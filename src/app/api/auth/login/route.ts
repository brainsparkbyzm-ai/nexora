import { NextRequest, NextResponse } from "next/server"
import { apiError, apiRateLimited } from "@/lib/apiResponse"
import { checkRateLimit, getClientIp } from "@/lib/rateLimit"
import {
    authenticate,
    createSessionCookie,
} from "@/lib/auth"

const COOKIE_NAME =
    process.env.AUTH_COOKIE_NAME || "nexora_session"

export async function POST(request: NextRequest) {
    const ip = getClientIp(request.headers)

    const rateLimit = checkRateLimit(`login:${ip}`, {
        windowMs: 60_000,
        limit: 8,
    })

    if (!rateLimit.allowed) {
        return apiRateLimited(
            Math.max(
                1,
                Math.ceil(
                    (rateLimit.resetAt - Date.now()) / 1000,
                ),
            ),
        )
    }

    let body: {
        email?: string
        password?: string
    }

    try {
        body = await request.json()
    } catch {
        return apiError("Invalid JSON body.")
    }

    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
        return apiError("Email and password are required.")
    }

    const user = await authenticate(email, password)

    if (!user) {
        return apiError("Invalid email or password.", 401)
    }

    const token = await createSessionCookie({
        sub: user.id,
        email: user.email,
        role: user.role,
    })

    /*
     * IMPORTANT:
     * Set the session cookie directly on the exact Response that
     * is returned to the browser. This guarantees that the cookie
     * created during login is attached to the HTTP response.
     */
    const response = NextResponse.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    })

    response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })

    return response
}