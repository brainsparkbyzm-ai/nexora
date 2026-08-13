"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

export function MediaUploadForm() {
	const router = useRouter()
	const [altText, setAltText] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		if (!file) {
			setError("Choose a file first.")
			return
		}
		setUploading(true)
		setError(null)
		try {
			const formData = new FormData()
			formData.set("file", file)
			formData.set("altText", altText)
			const res = await fetch("/api/media", { method: "POST", body: formData })
			if (!res.ok) {
				const data = await res.json().catch(() => null)
				setError(data?.error?.message ?? "Upload failed.")
				return
			}
			setAltText("")
			setFile(null)
			router.refresh()
		} finally {
			setUploading(false)
		}
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3 rounded-card border border-admin-border bg-admin-surface p-4">
			<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-small text-white" />
			<input
				value={altText}
				onChange={(e) => setAltText(e.target.value)}
				placeholder="Meaningful alt text (required)"
				className="min-w-[240px] flex-1 rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-small text-white placeholder:text-admin-muted"
			/>
			<button type="submit" disabled={uploading} className="rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white disabled:opacity-60">
				{uploading ? "Uploading…" : "Upload"}
			</button>
			{error ? <p className="w-full text-caption text-admin-danger">{error}</p> : null}
		</form>
	)
}
