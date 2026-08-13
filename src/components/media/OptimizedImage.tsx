import Image, { type ImageProps } from "next/image"
import { cx } from "@/lib/utils"

/**
 * Wraps next/image with NEXORA defaults: forced alt text, blur placeholder,
 * fixed aspect ratio wrapper (prevents CLS), and lazy loading unless the
 * caller marks the image as priority (e.g. LCP hero image).
 */
export function OptimizedImage({
	alt,
	className,
	wrapperClassName,
	aspectRatio = "16/9",
	...props
}: ImageProps & { wrapperClassName?: string; aspectRatio?: string }) {
	if (!alt) {
		throw new Error("OptimizedImage requires meaningful alt text (see docs/ARCHITECTURE.md \u00a763).")
	}

	return (
		<div className={cx("relative overflow-hidden", wrapperClassName)} style={{ aspectRatio }}>
			<Image
				alt={alt}
				fill
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				className={cx("object-cover", className)}
				placeholder="empty"
				loading={props.priority ? undefined : "lazy"}
				{...props}
			/>
		</div>
	)
}
