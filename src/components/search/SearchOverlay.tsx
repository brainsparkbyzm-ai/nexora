"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Search as SearchIcon, X } from "lucide-react"

/**
 * Header search modal (see Header.tsx). Submits to /search?q=... rather than
 * duplicating result rendering here -- the full experience already lives at
 * src/app/search -- so this stays a thin, accessible input overlay.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
	const router = useRouter()
	const [query, setQuery] = useState("")
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!open) return
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50)

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose()
		}
		window.addEventListener("keydown", onKeyDown)

		return () => {
			document.body.style.overflow = previousOverflow
			window.clearTimeout(focusTimer)
			window.removeEventListener("keydown", onKeyDown)
		}
	}, [open, onClose])

	function onSubmit(event: FormEvent) {
		event.preventDefault()
		const trimmed = query.trim()
		if (!trimmed) return
		onClose()
		router.push("/search?q=" + encodeURIComponent(trimmed))
	}

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-50 flex items-start justify-center bg-nexora-bg/90 px-4 pt-24 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-label="Search"
					onClick={onClose}
				>
					<motion.div
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.2 }}
						className="w-full max-w-xl"
						onClick={(event) => event.stopPropagation()}
					>
						<form
							onSubmit={onSubmit}
							className="flex items-center gap-2 rounded-md border border-nexora-border bg-nexora-surface px-4 py-3 shadow-2xl"
						>
							<SearchIcon size={20} className="text-nexora-muted" aria-hidden="true" />
							<label htmlFor="header-search-input" className="sr-only">
								Search NEXORA
							</label>
							<input
								id="header-search-input"
								ref={inputRef}
								type="search"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search articles, tools, guides..."
								className="min-w-0 flex-1 bg-transparent text-body text-nexora-text placeholder:text-nexora-muted-2 focus:outline-none"
							/>
							<button
								type="button"
								aria-label="Close search"
								onClick={onClose}
								className="rounded-full p-1.5 text-nexora-muted hover:bg-nexora-surface-raised hover:text-nexora-text"
							>
								<X size={18} aria-hidden="true" />
							</button>
						</form>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}
