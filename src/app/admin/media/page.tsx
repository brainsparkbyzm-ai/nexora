import { prisma } from "@/lib/prisma"
import { MediaUploadForm } from "@/components/admin/MediaUploadForm"

type MediaRow = {
	id: string
	url: string
	alt: string | null
	title: string | null
	createdAt: Date
}

export default async function AdminMediaPage() {
	const media: MediaRow[] = await prisma.media.findMany({
		orderBy: {
			createdAt: "desc",
		},
		take: 60,
		select: {
			id: true,
			url: true,
			alt: true,
			title: true,
			createdAt: true,
		},
	})

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-h2 text-white">Media Library</h1>

			<MediaUploadForm />

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
				{media.map((item) => (
					<div
						key={item.id}
						className="overflow-hidden rounded-card border border-admin-border bg-admin-surface"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={item.url}
							alt={item.alt ?? item.title ?? "Media"}
							className="aspect-square w-full object-cover"
						/>

						<p className="truncate p-2 text-caption text-admin-muted">
							{item.title ?? "Untitled"}
						</p>
					</div>
				))}

				{media.length === 0 ? (
					<p className="text-small text-admin-muted">
						No media uploaded yet.
					</p>
				) : null}
			</div>
		</div>
	)
}