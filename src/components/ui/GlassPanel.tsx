import { cx } from "@/lib/utils"
import type { HTMLAttributes } from "react"

/**
 * Shared "glass card" surface used by article cards, tool cards, hero
 * floating chips, etc. Radius/shadow/border all come from Tailwind tokens
 * that are wired to src/config/theme.ts, so restyling globally is a
 * one-file change.
 */
export function GlassPanel({
	className,
	as: Component = "div",
	...props
}: HTMLAttributes<HTMLDivElement> & { as?: "div" | "article" | "section" }) {
	const Comp = Component as "div"
	return (
		<Comp
			className={cx(
				"nexora-glass rounded-card shadow-panel transition-transform duration-normal ease-standard",
				className,
			)}
			{...props}
		/>
	)
}
