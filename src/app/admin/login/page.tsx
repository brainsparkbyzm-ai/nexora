"use client"

import { useState, type FormEvent } from "react"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (loading) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            })

            const data = await response.json().catch(() => null)

            if (!response.ok) {
                setError(
                    data?.error?.message ||
                        data?.error ||
                        "Invalid email or password.",
                )
                setLoading(false)
                return
            }

            // Login succeeded and the API response has set the
            // HTTP-only session cookie.
            //
            // Force a complete browser navigation. Do not use
            // router.push() here because the admin layout is a
            // Server Component and must read the newly-created cookie.
            window.location.assign("/admin")
			return 
        } catch (error) {
            console.error("Admin login error:", error)

            setError(
                "Unable to connect to the server. Please make sure the server is running.",
            )

            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm rounded-card border border-admin-border bg-admin-surface p-8"
            >
                <h1 className="mb-1 text-h3 text-white">
                    NEXORA CMS
                </h1>

                <p className="mb-6 text-small text-admin-muted">
                    Sign in to manage articles, tools and settings.
                </p>

                <label
                    htmlFor="email"
                    className="mb-1 block text-caption font-medium text-admin-muted"
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="mb-4 w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2.5 text-small text-white outline-none focus:border-nexora-blue disabled:opacity-60"
                />

                <label
                    htmlFor="password"
                    className="mb-1 block text-caption font-medium text-admin-muted"
                >
                    Password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="mb-6 w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2.5 text-small text-white outline-none focus:border-nexora-blue disabled:opacity-60"
                />

                {error && (
                    <p className="mb-4 rounded-md border border-admin-danger/30 bg-admin-danger/10 px-3 py-2 text-caption text-admin-danger">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-nexora-blue px-4 py-2.5 text-small font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    )
}