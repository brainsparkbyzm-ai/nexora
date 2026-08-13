import Link from "next/link"

const stats = [
    {
        label: "Total Articles",
        value: "0",
        href: "/admin/articles",
    },
    {
        label: "Drafts",
        value: "0",
        href: "/admin/articles?status=DRAFT",
    },
    {
        label: "Scheduled",
        value: "0",
        href: "/admin/articles?status=SCHEDULED",
    },
    {
        label: "Reviews",
        value: "0",
        href: "/admin/reviews",
    },
]

const quickLinks = [
    {
        title: "Articles",
        description: "Create and manage your articles.",
        href: "/admin/articles",
    },
    {
        title: "New Article",
        description: "Create a new article.",
        href: "/admin/articles/new",
    },
    {
        title: "Media",
        description: "Manage uploaded media.",
        href: "/admin/media",
    },
    {
        title: "Analytics",
        description: "View site analytics.",
        href: "/admin/analytics",
    },
]

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm text-admin-muted">
                    Welcome to the Nexora CMS administration panel.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="rounded-xl border border-admin-border bg-admin-surface p-6 transition hover:bg-admin-surface-raised"
                    >
                        <p className="text-sm text-admin-muted">
                            {stat.label}
                        </p>

                        <p className="mt-3 text-3xl font-bold text-white">
                            {stat.value}
                        </p>
                    </Link>
                ))}
            </div>

            <section>
                <h2 className="mb-4 text-xl font-semibold text-white">
                    Quick Actions
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {quickLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-xl border border-admin-border bg-admin-surface p-6 transition hover:bg-admin-surface-raised"
                        >
                            <h3 className="text-base font-semibold text-white">
                                {item.title}
                            </h3>

                            <p className="mt-2 text-sm text-admin-muted">
                                {item.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="rounded-xl border border-admin-border bg-admin-surface p-6">
                <h2 className="text-xl font-semibold text-white">
                    Nexora CMS
                </h2>

                <p className="mt-2 text-sm text-admin-muted">
                    Your admin authentication is working correctly.
                    You are now inside the protected CMS dashboard.
                </p>
            </section>
        </div>
    )
}