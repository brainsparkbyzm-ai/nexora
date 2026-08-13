import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { LogoutButton } from "@/components/admin/LogoutButton"

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/articles/new", label: "New Article" },
  { href: "/admin/articles?status=DRAFT", label: "Drafts" },
  { href: "/admin/articles?status=SCHEDULED", label: "Scheduled" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/authors", label: "Authors" },
  { href: "/admin/tools", label: "AI Tools" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/comparisons", label: "Comparisons" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/users", label: "Users" },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen bg-admin-bg text-admin-text">
      <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-admin-border bg-admin-surface p-4 lg:flex">
        <div className="mb-6 px-2 text-h4 font-semibold text-white">
          NEXORA CMS
        </div>

        <nav className="flex flex-col gap-0.5">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-small text-admin-muted hover:bg-admin-surface-raised hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="mt-auto flex items-center justify-between px-2 pt-4 text-caption text-admin-muted">
            <span>
              {user.email} &middot; {user.role}
            </span>

            <LogoutButton />
          </div>
        ) : null}
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        {children}
      </main>
    </div>
  )
}