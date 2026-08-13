import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { nanoid } from "nanoid"

/**
 * S3-compatible object storage abstraction. Works unmodified against AWS S3,
 * Cloudflare R2, Backblaze B2, MinIO, etc. — only the .env values change.
 * Callers (media library, article editor image uploads) only ever import
 * from this file, never `@aws-sdk/*` directly, so switching storage
 * providers never touches UI code.
 */

function getClient() {
	return new S3Client({
		region: process.env.STORAGE_REGION || "us-east-1",
		endpoint: process.env.STORAGE_ENDPOINT,
		credentials: {
			accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
			secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
		},
	})
}

function publicUrlFor(key: string): string {
	const base = process.env.STORAGE_PUBLIC_BASE_URL || ""
	return `${base.replace(/\/$/, "")}/${key}`
}

export async function uploadMedia(input: {
	buffer: Buffer
	contentType: string
	filename: string
}): Promise<{ key: string; url: string }> {
	const extension = input.filename.split(".").pop() || "bin"
	const key = `uploads/${new Date().getFullYear()}/${nanoid(12)}.${extension}`

	await getClient().send(
		new PutObjectCommand({
			Bucket: process.env.STORAGE_BUCKET,
			Key: key,
			Body: input.buffer,
			ContentType: input.contentType,
			CacheControl: "public, max-age=31536000, immutable",
		}),
	)

	return { key, url: publicUrlFor(key) }
}

export async function deleteMedia(key: string): Promise<void> {
	await getClient().send(new DeleteObjectCommand({ Bucket: process.env.STORAGE_BUCKET, Key: key }))
}

export async function getSignedUploadUrl(key: string, contentType: string): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: process.env.STORAGE_BUCKET,
		Key: key,
		ContentType: contentType,
	})
	return getSignedUrl(getClient(), command, { expiresIn: 60 * 5 })
}

/** Allow-listed upload types — never accept executables (see docs/ARCHITECTURE.md §72). */
export const ALLOWED_MEDIA_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif",
	"image/svg+xml",
] as const

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10MB

export function isAllowedMediaFile(contentType: string, sizeBytes: number): boolean {
	return (
		(ALLOWED_MEDIA_MIME_TYPES as readonly string[]).includes(contentType) &&
		sizeBytes > 0 &&
		sizeBytes <= MAX_UPLOAD_BYTES
	)
}
