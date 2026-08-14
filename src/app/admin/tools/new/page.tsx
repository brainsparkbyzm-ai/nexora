"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

type ToolForm = {
	name: string
	categoryId: string
	websiteUrl: string
	description: string
	pricing: string
}

export default function NewToolPage() {
	const router = useRouter()

	const [form, setForm] = useState<ToolForm>({
		name: "",
		categoryId: "",
		websiteUrl: "",
		description: "",
		pricing: "",
	})

	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	function updateField(field: keyof ToolForm, value: string) {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const res = await fetch("/api/tools", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: form.name.trim(),
					categoryId: form.categoryId.trim(),
					websiteUrl: form.websiteUrl.trim(),
					description: form.description.trim(),
					pricing: form.pricing.trim(),
				}),
			})

			const data = await res.json().catch(() => null)

			if (!res.ok) {
				setError(data?.error?.message ?? "Failed to create tool.")
				return
			}

			router.push("/admin/tools")
			router.refresh()
		} catch {
			setError("Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			onSubmit={onSubmit}
			className="flex max-w-lg flex-col gap-4"
		>
			<h1 className="text-h2 text-white">Add AI Tool</h1>

			{error ? (
				<p className="text-small text-admin-danger">
					{error}
				</p>
			) : null}

			<input
				type="text"
				placeholder="Name"
				required
				value={form.name}
				onChange={(e) => updateField("name", e.target.value)}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>

			<input
				type="text"
				placeholder="Category ID"
				required
				value={form.categoryId}
				onChange={(e) => updateField("categoryId", e.target.value)}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>

			<input
				type="url"
				placeholder="Website URL"
				value={form.websiteUrl}
				onChange={(e) => updateField("websiteUrl", e.target.value)}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>

			<textarea
				placeholder="Description"
				required
				rows={5}
				value={form.description}
				onChange={(e) => updateField("description", e.target.value)}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>

			<input
				type="text"
				placeholder="Pricing (e.g. Free / $20 mo)"
				value={form.pricing}
				onChange={(e) => updateField("pricing", e.target.value)}
				className="rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
			/>

			<button
				type="submit"
				disabled={loading}
				className="rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
			>
				{loading ? "Creating..." : "Create Tool"}
			</button>
		</form>
	)
}