"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { SiteSettings } from "@prisma/client"

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings | null }) {
	const router = useRouter()
	const [form, setForm] = useState({
		siteName: initialSettings?.siteName ?? "NEXORA",
		logoUrl: initialSettings?.logoUrl ?? "",
		description: initialSettings?.description ?? "",
		defaultSeoTitle: initialSettings?.defaultSeoTitle ?? "",
		defaultSeoDescription: initialSettings?.defaultSeoDescription ?? "",
		newsletterEnabled: initialSettings?.newsletterEnabled ?? true,
		adsEnabled: initialSettings?.adsEnabled ?? false,
		affiliateEnabled: initialSettings?.affiliateEnabled ?? true,
	})
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setSaving(true)
		setSaved(false)
		try {
			await fetch("/api/settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			})
			setSaved(true)
			router.refresh()
		} finally {
			setSaving(false)
		}
	}

	return (
		<form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-4">
			<div>
				<label className="mb-1 block text-caption text-admin-muted">Site name</label>
				<input
					value={form.siteName}
					onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
					className="w-full rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
				/>
			</div>
			<div>
				<label className="mb-1 block text-caption text-admin-muted">Logo URL</label>
				<input
					value={form.logoUrl}
					onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
					className="w-full rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
				/>
			</div>
			<div>
				<label className="mb-1 block text-caption text-admin-muted">Description</label>
				<textarea
					value={form.description}
					onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
					rows={2}
					className="w-full rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
				/>
			</div>
			<div>
				<label className="mb-1 block text-caption text-admin-muted">Default SEO title</label>
				<input
					value={form.defaultSeoTitle}
					onChange={(e) => setForm((prev) => ({ ...prev, defaultSeoTitle: e.target.value }))}
					className="w-full rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
				/>
			</div>
			<div>
				<label className="mb-1 block text-caption text-admin-muted">Default SEO description</label>
				<textarea
					value={form.defaultSeoDescription}
					onChange={(e) => setForm((prev) => ({ ...prev, defaultSeoDescription: e.target.value }))}
					rows={2}
					className="w-full rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-small text-white"
				/>
			</div>
			<label className="flex items-center gap-2 text-small text-white">
				<input
					type="checkbox"
					checked={form.newsletterEnabled}
					onChange={(e) => setForm((prev) => ({ ...prev, newsletterEnabled: e.target.checked }))}
				/>
				Newsletter signups enabled
			</label>
			<label className="flex items-center gap-2 text-small text-white">
				<input
					type="checkbox"
					checked={form.adsEnabled}
					onChange={(e) => setForm((prev) => ({ ...prev, adsEnabled: e.target.checked }))}
				/>
				Ads enabled
			</label>
			<label className="flex items-center gap-2 text-small text-white">
				<input
					type="checkbox"
					checked={form.affiliateEnabled}
					onChange={(e) => setForm((prev) => ({ ...prev, affiliateEnabled: e.target.checked }))}
				/>
				Affiliate links enabled
			</label>
			<button type="submit" disabled={saving} className="w-fit rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white disabled:opacity-60">
				{saving ? "Saving…" : "Save settings"}
			</button>
			{saved ? <p className="text-caption text-admin-success">Saved.</p> : null}
		</form>
	)
}
