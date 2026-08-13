"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

export function CategoryCreateForm() {
	const router = useRouter()
	const [name, setName] = useState("")
	const [error, setError] = useState<string | null>(null)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		const res = await fetch("/api/categories", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		})
		if (!res.ok) {
			const data = await res.json().catch(() => null)
			setError(data?.error?.message ?? "Failed to create category.")
			return
		}
		setName("")
		router.refresh()
	}

	return (
		<form onSubmit={onSubmit} className="flex gap-2">
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="New category name"
				className="flex-1 rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white placeholder:text-admin-muted"
			/>
			<button type="submit" className="rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white">
				Add
			</button>
			{error ? <p className="self-center text-caption text-admin-danger">{error}</p> : null}
		</form>
	)
}
