/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{ protocol: "https", hostname: "**.s3.**.amazonaws.com" },
			{ protocol: "https", hostname: "**.r2.dev" },
			{ protocol: "https", hostname: "cdn.nexora.ai" },
			{ protocol: "https", hostname: "images.unsplash.com" },
		],
	},
	experimental: {
		optimizePackageImports: ["lucide-react", "framer-motion"],
	},
	// 3D packages (three.js / react-three-fiber) are only ever imported through
	// dynamic(() => import(...), { ssr: false }) call sites — see
	// src/components/hero/Hero3D.tsx — so they never inflate the shared bundle
	// or block non-hero pages (see docs/ARCHITECTURE.md, section 6 & 33).
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
				],
			},
			{
				source: "/admin/:path*",
				headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
			},
			{
				source: "/api/:path*",
				headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
			},
		]
	},
	async redirects() {
		return [{ source: "/post", destination: "/articles", permanent: true }]
	},
}

export default nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
