"use client"

import { useState, type FormEvent } from "react"
import { cx } from "@/lib/utils"

export function NewsletterForm({
	placement,
	className,
}: {
	placement: "homepage" | "article" | "category" | "footer" | "page"
	className?: string
}) {
	const [email, setEmail] = useState("")
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle")

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setStatus("loading")
		try {
			const res = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, source: placement }),
			})
			const data = await res.json()
			if (!res.ok) {
				setStatus("error")
				return
			}
			setStatus(data.status === "already_subscribed" ? "duplicate" : "success")
		} catch {
			setStatus("error")
		}
	}

	if (status === "success") {
		return <p className={cx("text-small text-nexora-cyan", className)}>You&apos;re subscribed. Welcome to NEXORA.</p>
	}

	return (
		<form onSubmit={onSubmit} className={cx("flex w-full max-w-sm flex-col gap-2", className)}>
			<label htmlFor={`newsletter-email-${placement}`} className="sr-only">
				Email address
			</label>
			<div className="flex gap-2">
				<input
					id={`newsletter-email-${placement}`}
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@company.com"
					className="min-w-0 flex-1 rounded-md border border-nexora-border bg-nexora-surface px-3 py-2.5 text-small text-nexora-text placeholder:text-nexora-muted-2 focus:border-nexora-blue"
				/>
				<button
					type="submit"
					disabled={status === "loading"}
					className="shrink-0 rounded-md bg-nexora-blue px-4 py-2.5 text-caption font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
				>
					{status === "loading" ? "Subscribing…" : "Subscribe"}
				</button>
			</div>
			{status === "duplicate" ? (
				<p className="text-caption text-nexora-muted">You&apos;re already subscribed.</p>
			) : null}
			{status === "error" ? (
				<p className="text-caption text-nexora-danger">Something went wrong. Please try again.</p>
			) : null}
		</form>
	)
}
