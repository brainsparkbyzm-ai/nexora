
"use client"

import { useEffect, useState } from "react"

type ConsentChoice = "accepted" | "rejected"

const CONSENT_KEY = "nexora_cookie_consent"
const CONSENT_VERSION = "1.0"

export default function CookieConsent() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		try {
			const saved = localStorage.getItem(CONSENT_KEY)

			if (!saved) {
				setVisible(true)
				return
			}

			const parsed = JSON.parse(saved)

			if (parsed?.version !== CONSENT_VERSION) {
				setVisible(true)
			}
		} catch {
			setVisible(true)
		}
	}, [])

	function saveConsent(choice: ConsentChoice) {
		try {
			localStorage.setItem(
				CONSENT_KEY,
				JSON.stringify({
					choice,
					version: CONSENT_VERSION,
					timestamp: new Date().toISOString(),
				}),
			)
		} catch {
			// Consent UI must never break the website.
		}

		setVisible(false)

		// Notify other client-side components that consent changed.
		window.dispatchEvent(
			new CustomEvent("nexora-consent-change", {
				detail: { choice },
			}),
		)
	}

	if (!visible) return null

	return (
		<div
			role="dialog"
			aria-modal="false"
			aria-labelledby="cookie-consent-title"
			className="fixed inset-x-0 bottom-0 z-[9999] p-3 sm:p-4"
		>
			<div className="mx-auto max-w-5xl rounded-2xl border border-nexora-border bg-nexora-surface/95 p-5 shadow-2xl backdrop-blur-xl">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="max-w-3xl">
						<h2
							id="cookie-consent-title"
							className="text-lg font-semibold text-nexora-text"
						>
							Your privacy matters
						</h2>

						<p className="mt-2 text-sm leading-6 text-nexora-muted">
							NEXORA uses essential technologies to operate the
							website. With your permission, we may also use
							analytics and advertising technologies to improve
							the experience and support the website.
						</p>

						<p className="mt-2 text-sm text-nexora-muted">
							<a
								href="/cookies"
								className="font-medium underline underline-offset-4 hover:opacity-80"
							>
								Cookie Policy
							</a>
							{" · "}
							<a
								href="/privacy"
								className="font-medium underline underline-offset-4 hover:opacity-80"
							>
								Privacy Policy
							</a>
						</p>
					</div>

					<div className="flex shrink-0 flex-col gap-2 sm:flex-row">
						<button
							type="button"
							onClick={() => saveConsent("rejected")}
							className="rounded-xl border border-nexora-border px-5 py-2.5 text-sm font-medium text-nexora-text transition hover:bg-nexora-bg focus:outline-none focus:ring-2 focus:ring-nexora-text/20"
						>
							Reject non-essential
						</button>

						<button
							type="button"
							onClick={() => saveConsent("accepted")}
							className="rounded-xl bg-nexora-text px-5 py-2.5 text-sm font-medium text-nexora-surface transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-nexora-text/30"
						>
							Accept
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
