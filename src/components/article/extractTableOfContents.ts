export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractTableOfContents(html: string): TocItem[] {
  if (!html || typeof html !== "string") {
    return [];
  }

  const matches = Array.from(
    html.matchAll(
      /<h([23])(?:\s[^>]*)?\sid=["']([^"']+)["'](?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi
    )
  );

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
      .replace(/&#39;/gi, "'")
      .trim(),
  }));
}