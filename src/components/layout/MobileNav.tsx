"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { mobileNav } from "@/config/site"

/**
 * Full-screen mobile menu. Transform/opacity-only animation (GPU-friendly,
 * see docs/ARCHITECTURE.md §6), locks body scroll while open, closes on
 * overlay click, Escape, or navigation.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
	useEffect(() => {
		if (!open) return
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", onKeyDown)
		return () => {
			document.body.style.overflow = previousOverflow
			window.removeEventListener("keydown", onKeyDown)
		}
	}, [open, onClose])

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.24 }}
					className="fixed inset-0 z-50 bg-nexora-bg/95 backdrop-blur-glass lg:hidden"
					role="dialog"
					aria-modal="true"
					aria-label="Mobile navigation"
					onClick={onClose}
				>
					<motion.div
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.24 }}
						className="flex h-full flex-col gap-8 px-6 py-8"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-end">
							<button aria-label="Close menu" onClick={onClose} className="p-2 text-nexora-muted">
								<X size={24} aria-hidden="true" />
							</button>
						</div>
						<nav className="flex flex-1 flex-col gap-1" aria-label="Mobile">
							{mobileNav.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={onClose}
									className="border-b border-nexora-border py-4 text-h4 text-nexora-text"
								>
									{item.label}
								</Link>
							))}
						</nav>
						<Link
							href="/newsletter"
							onClick={onClose}
							className="rounded-pill bg-nexora-blue px-5 py-3 text-center text-small font-semibold text-white"
						>
							Subscribe to the Newsletter
						</Link>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	)
}
