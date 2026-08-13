"use client"

import { useEffect, useState } from "react"

export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

export function extractTableOfContents(html: string): TocItem[] {
  if (!html || typeof html !== "string") {
    return []
  }

  const matches = Array.from(
    html.matchAll(
      /<h([23])(?:\s[^>]*)?\sid=["']([^"']+)["'](?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi
    )
  )

  return matches.map((match) => ({
    level: Number(match[1]) as 2 | 3,
    id: match[2] ?? "",
    text: (match[3] ?? "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .trim(),
  }))
}

export function TableOfContents({
  items,
}: {
  items: TocItem[]
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!items.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(
          (entry) => entry.isIntersecting
        )

        if (visible) {
          setActiveId(visible.target.id)
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)

      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  if (!items.length) {
    return null
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-24 hidden max-h-[70vh] overflow-y-auto lg:block"
    >
      <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-nexora-muted">
        On this page
      </p>

      <ul className="flex flex-col gap-2 border-l border-nexora-border pl-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-3" : undefined}
          >
            <a
              href={`#${item.id}`}
              className={
                activeId === item.id
                  ? "text-small font-medium text-nexora-cyan"
                  : "text-small text-nexora-muted hover:text-nexora-text"
              }
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}