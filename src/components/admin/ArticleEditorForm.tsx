"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED"

type EditorCategory = {
	id: string
	name: string
}

type EditorArticle = {
	id?: string
	title: string
	slug: string
	content: string
	excerpt?: string | null
	categoryId?: string | null
	heroImage?: string | null
	featured?: boolean | null
	trending?: boolean | null
	seoTitle?: string | null
	seoDescription?: string | null
	canonicalUrl?: string | null
	schemaType?: string | null
	status?: ArticleStatus | null
	publishedAt?: Date | string | null
	scheduledAt?: Date | string | null
	authorId?: string | null
	createdAt?: Date | string
	updatedAt?: Date | string
	[key: string]: unknown
}

type PersistExtra = Record<string, unknown>

type ArticleEditorFormProps = {
	initialArticle: EditorArticle
	categories: EditorCategory[]
	mode: "create" | "edit"
}

/**
 * Shared create/edit article form.
 *
 * Uses the real /api/articles endpoints for persistence.
 * Autosaves edited articles every 20 seconds.
 */
export function ArticleEditorForm({
	initialArticle,
	categories,
	mode,
}: ArticleEditorFormProps): ReactNode {
	const router = useRouter()

	const [article, setArticle] = useState<EditorArticle>(initialArticle)
	const [saving, setSaving] = useState(false)
	const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
	const [error, setError] = useState<string | null>(null)

	const autosaveTimer = useRef<ReturnType<typeof setInterval> | null>(null)

	async function persist(
		status?: ArticleStatus,
		extra?: PersistExtra,
	): Promise<void> {
		setSaving(true)
		setError(null)

		try {
			const payload = {
				...article,
				...(status ? { status } : {}),
				...(extra ?? {}),
			}

			const endpoint =
				mode === "create"
					? "/api/articles"
					: `/api/articles/${article.slug}`

			const method = mode === "create" ? "POST" : "PUT"

			const res = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			})

			const data: {
				data?: EditorArticle
				error?: {
					message?: string
				}
			} = await res.json()

			if (!res.ok) {
				setError(data.error?.message ?? "Failed to save article.")
				return
			}

			setLastSavedAt(new Date())

			if (mode === "create" && data.data?.slug) {
				router.push(`/admin/articles/${data.data.slug}`)
				return
			}

			if (mode === "edit" && data.data) {
				setArticle((prev) => ({
					...prev,
					...data.data,
				}))
			}
		} catch {
			setError("Failed to save article. Please try again.")
		} finally {
			setSaving(false)
		}
	}

	useEffect(() => {
		if (mode !== "edit") {
			return
		}

		autosaveTimer.current = setInterval(() => {
			void persist()
		}, 20_000)

		return () => {
			if (autosaveTimer.current) {
				clearInterval(autosaveTimer.current)
				autosaveTimer.current = null
			}
		}

		// Autosave intentionally follows the current article content.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, article.title, article.content])

	function onSubmit(e: FormEvent<HTMLFormElement>): void {
		e.preventDefault()

		void persist(mode === "create" ? "DRAFT" : undefined)
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-h2 text-white">
					{mode === "create" ? "New Article" : "Edit Article"}
				</h1>

				<div className="flex gap-2">
					<button
						type="button"
						disabled={saving}
						onClick={() => void persist("DRAFT")}
						className="rounded-md border border-admin-border px-4 py-2 text-small text-white disabled:opacity-60"
					>
						Save Draft
					</button>

					{mode === "edit" ? (
						<a
							href={`/articles/${article.slug}?preview=1`}
							target="_blank"
							rel="noreferrer"
							className="rounded-md border border-admin-border px-4 py-2 text-small text-white"
						>
							Preview
						</a>
					) : null}

					<button
						type="button"
						disabled={saving}
						onClick={() =>
							void persist("PUBLISHED", {
								publishedAt: new Date().toISOString(),
							})
						}
						className="rounded-md bg-nexora-blue px-4 py-2 text-small font-semibold text-white disabled:opacity-60"
					>
						Publish
					</button>

					{article.status === "PUBLISHED" ? (
						<button
							type="button"
							disabled={saving}
							onClick={() => void persist("ARCHIVED")}
							className="rounded-md border border-admin-danger px-4 py-2 text-small text-admin-danger disabled:opacity-60"
						>
							Unpublish
						</button>
					) : null}
				</div>
			</div>

			{error ? (
				<p className="text-small text-admin-danger">{error}</p>
			) : null}

			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				<div className="flex flex-col gap-4">
					<input
						value={article.title}
						onChange={(e) =>
							setArticle((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
						placeholder="Article title"
						className="rounded-md border border-admin-border bg-admin-surface px-4 py-3 text-h4 text-white placeholder:text-admin-muted"
					/>

					<input
						value={article.slug}
						onChange={(e) =>
							setArticle((prev) => ({
								...prev,
								slug: e.target.value,
							}))
						}
						placeholder="url-slug"
						className="rounded-md border border-admin-border bg-admin-surface px-4 py-2 text-small text-admin-muted"
					/>

					<textarea
						value={article.excerpt ?? ""}
						onChange={(e) =>
							setArticle((prev) => ({
								...prev,
								excerpt: e.target.value,
							}))
						}
						placeholder="Excerpt"
						rows={2}
						className="rounded-md border border-admin-border bg-admin-surface px-4 py-3 text-small text-white placeholder:text-admin-muted"
					/>

					<textarea
						value={article.content}
						onChange={(e) =>
							setArticle((prev) => ({
								...prev,
								content: e.target.value,
							}))
						}
						placeholder="Article body (HTML)"
						rows={18}
						className="rounded-md border border-admin-border bg-admin-surface px-4 py-3 font-mono text-small text-white placeholder:text-admin-muted"
					/>
				</div>

				<div className="flex flex-col gap-4">
					<div className="rounded-card border border-admin-border bg-admin-surface p-4">
						<label className="mb-1 block text-caption text-admin-muted">
							Category
						</label>

						<select
							value={article.categoryId ?? ""}
							onChange={(e) =>
								setArticle((prev) => ({
									...prev,
									categoryId: e.target.value,
								}))
							}
							className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-small text-white"
						>
							<option value="">Select category</option>

							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>

						<label className="mb-1 mt-4 block text-caption text-admin-muted">
							Hero image URL
						</label>

						<input
							value={article.heroImage ?? ""}
							onChange={(e) =>
								setArticle((prev) => ({
									...prev,
									heroImage: e.target.value,
								}))
							}
							className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-small text-white"
						/>

						<label className="mb-1 mt-4 flex items-center gap-2 text-caption text-admin-muted">
							<input
								type="checkbox"
								checked={Boolean(article.featured)}
								onChange={(e) =>
									setArticle((prev) => ({
										...prev,
										featured: e.target.checked,
									}))
								}
							/>
							Featured
						</label>

						<label className="flex items-center gap-2 text-caption text-admin-muted">
							<input
								type="checkbox"
								checked={Boolean(article.trending)}
								onChange={(e) =>
									setArticle((prev) => ({
										...prev,
										trending: e.target.checked,
									}))
								}
							/>
							Trending
						</label>

						<label className="mb-1 mt-4 block text-caption text-admin-muted">
							Schedule for
						</label>

						<input
							type="datetime-local"
							value={
								article.scheduledAt
									? String(article.scheduledAt).slice(0, 16)
									: ""
							}
							onChange={(e) =>
								setArticle((prev) => ({
									...prev,
									scheduledAt: e.target.value,
								}))
							}
							className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-small text-white"
						/>

						<button
							type="button"
							disabled={saving || !article.scheduledAt}
							onClick={() => void persist("SCHEDULED")}
							className="mt-2 w-full rounded-md border border-admin-border px-3 py-2 text-caption text-white disabled:opacity-50"
						>
							Schedule
						</button>
					</div>

					<div className="rounded-card border border-admin-border bg-admin-surface p-4">
						<h3 className="mb-3 text-small font-semibold text-white">
							SEO
						</h3>

						<label className="mb-1 block text-caption text-admin-muted">
							SEO title
						</label>

						<input
							value={article.seoTitle ?? ""}
							onChange={(e) =>
								setArticle((prev) => ({
									...prev,
									seoTitle: e.target.value,
								}))
							}
							className="mb-3 w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-small text-white"
						/>

						{article.seoTitle &&
						article.seoTitle.length > 60 ? (
							<p className="mb-3 text-caption text-admin-warning">
								Title is longer than 60 characters.
							</p>
						) : null}

						<label className="mb-1 block text-caption text-admin-muted">
							SEO description
						</label>

						<textarea
							value={article.seoDescription ?? ""}
							onChange={(e) =>
								setArticle((prev) => ({
									...prev,
									seoDescription: e.target.value,
								}))
							}
							rows={3}
							className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-small text-white"
						/>

						{!article.seoDescription ? (
							<p className="mt-2 text-caption text-admin-warning">
								Missing meta description.
							</p>
						) : null}

						{!article.heroImage ? (
							<p className="mt-2 text-caption text-admin-warning">
								Missing hero image.
							</p>
						) : null}
					</div>

					{lastSavedAt ? (
						<p className="text-caption text-admin-muted">
							Last saved {lastSavedAt.toLocaleTimeString()}
						</p>
					) : null}
				</div>
			</div>
		</form>
	)
}