import readingTime from "reading-time"

export function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
}

/** Returns whole-minute reading time (minimum 1) for a plain-text/HTML string. */
export function computeReadingTimeMinutes(content: string): number {
	const stats = readingTime(content)
	return Math.max(1, Math.round(stats.minutes))
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
	const d = typeof date === "string" ? new Date(date) : date
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		...opts,
	}).format(d)
}

export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text
	return `${text.slice(0, maxLength - 1).trimEnd()}\u2026`
}

export function cx(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(" ")
}

/** Clamp a rating to the 0-5 range and format to one decimal place for display. */
export function formatRating(rating: number | null | undefined): string | null {
	if (rating == null) return null
	return Math.max(0, Math.min(5, rating)).toFixed(1)
}
