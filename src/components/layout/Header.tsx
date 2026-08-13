"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Menu } from "lucide-react"
import { primaryNav, siteConfig } from "@/config/site"
import { MobileNav } from "@/components/layout/MobileNav"
import { SearchOverlay } from "@/components/search/SearchOverlay"

export function Header() {
    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="nexora-navbar sticky top-0 z-40">
            <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4">

                {/* LOGO */}
                <Link
                    href="/"
                    className="nexora-logo group flex items-center gap-3"
                >
                    <span
                        className="
                            relative flex h-8 w-8 items-center justify-center
                            rounded-full
                            bg-gradient-to-br
                            from-nexora-candy-blue
                            via-nexora-turquoise
                            to-nexora-vanilla
                            shadow-[0_0_22px_rgba(153,225,217,0.22)]
                            transition-all duration-500
                            group-hover:scale-110
                            group-hover:rotate-6
                            group-hover:shadow-[0_0_32px_rgba(153,225,217,0.45)]
                        "
                    >
                        <span
                            className="
                                h-3 w-3 rounded-full
                                bg-nexora-bg
                                shadow-[0_0_10px_rgba(241,254,200,0.45)]
                            "
                        />
                    </span>

                    <span
                        className="
                            nexora-gradient-text
                            text-h4 font-semibold tracking-tight
                        "
                    >
                        {siteConfig.name}
                    </span>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <nav
                    className="hidden items-center gap-8 lg:flex"
                    aria-label="Primary"
                >
                    {primaryNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="nexora-nav-link text-small text-nexora-muted"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* ACTIONS */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* SEARCH */}
                    <button
                        type="button"
                        aria-label="Search"
                        onClick={() => setSearchOpen(true)}
                        className="
                            nexora-button
                            group rounded-full p-2.5
                            text-nexora-muted
                            border border-transparent
                            hover:border-nexora-turquoise/20
                            hover:bg-nexora-surface
                            hover:text-nexora-turquoise
                        "
                    >
                        <Search
                            size={20}
                            aria-hidden="true"
                            className="
                                relative z-10
                                transition-transform duration-300
                                group-hover:scale-110
                            "
                        />
                    </button>

                    {/* NEWSLETTER */}
                    <Link
                        href="/newsletter"
                        className="
                            nexora-button
                            hidden rounded-pill
                            border border-nexora-turquoise/20
                            bg-gradient-to-r
                            from-nexora-candy-blue/90
                            via-nexora-turquoise/90
                            to-nexora-vanilla/90
                            px-5 py-2.5
                            text-caption font-semibold
                            text-nexora-bg
                            shadow-[0_0_20px_rgba(153,225,217,0.10)]
                            hover:border-nexora-turquoise/50
                            hover:shadow-[0_0_30px_rgba(153,225,217,0.25)]
                            lg:inline-block
                        "
                    >
                        <span className="relative z-10">
                            Newsletter
                        </span>
                    </Link>

                    {/* MOBILE MENU */}
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setMobileOpen(true)}
                        className="
                            nexora-button
                            group rounded-full p-2.5
                            text-nexora-muted
                            hover:bg-nexora-surface
                            hover:text-nexora-turquoise
                            lg:hidden
                        "
                    >
                        <Menu
                            size={22}
                            aria-hidden="true"
                            className="
                                relative z-10
                                transition-transform duration-300
                                group-hover:rotate-90
                            "
                        />
                    </button>
                </div>
            </div>

            <MobileNav
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <SearchOverlay
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </header>
    )
}