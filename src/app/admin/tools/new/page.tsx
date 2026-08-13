"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function NewToolPage() {
	const router = useRouter()
	const [form, setForm] = useState({ name: "", categoryId: "", websiteUrl: "", description: "", pricing: "" })
	const [error, setError] = useState<string | null>(null)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		const res = await fetch("/api/tools", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		})
		if (!res.ok) {
			const data = await res.json().catch(() => null)
			setError(data?.error?.message ?? "Failed to create tool.")
			return
		}
		router.push("/admin/tools")
	}

	return (
		<form onSubmit={onSubmit} className="flex max-w-lg flex-col gap-4">
			<h1 className="text-h2 text-white">Add AI Tool</h1>
			{error ? <p className="text-small text-admin-danger">{error}</p> : null}
			<input
				placeholder="Name"
				value={form.name}
				onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>
			<input
				placeholder="Category ID"
				value={form.categoryId}
				onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>
			<input
				placeholder="Website URL"
				value={form.websiteUrl}
				onChange={(e) => setForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>
			<textarea
				placeholder="Description"
				value={form.description}
				onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>
			<input
				placeholder="Pricing (e.g. Free / $20 mo)"
				value={form.pricing}
				onChange={(e) => setForm((prev) => ({ ...prev, pricing: e.target.value }))}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>
			<button type="submit" className="rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white">
				Create Tool
			</button>
		</form>
	)
}
