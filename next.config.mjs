/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	serverExternalPackages: [
	"@prisma/client",
],

	outputFileTracingIncludes: {
	"*": ["node_modules/.prisma/client/**/*"],
},

	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.s3.**.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "**.r2.dev",
			},
			{
				protocol: "https",
				hostname: "cdn.nexora.ai",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},

	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"framer-motion",
		],
	},

	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value:
							"camera=(), microphone=(), geolocation=()",
					},
				],
			},
			{
				source: "/admin/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			},
			{
				source: "/api/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			},
		]
	},

	async redirects() {
		return [
			{
				source: "/post",
				destination: "/articles",
				permanent: true,
			},
		]
	},
}

export default nextConfig

