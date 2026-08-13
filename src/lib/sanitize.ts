import DOMPurify from "isomorphic-dompurify"

/**
 * Sanitizes editorial/CMS-authored HTML before it is rendered via
 * `dangerouslySetInnerHTML` (Rule 24 -- never trust stored rich text as safe
 * by default, even when it only comes from logged-in Author/Editor/Admin
 * accounts). Runs isomorphically so server-rendered article/tool-review
 * pages are sanitized on the server, not just in the browser.
 *
 * Allows the standard rich-text formatting/embed tags the editor UI can
 * produce, plus safe media/iframe attributes for embedded tweets/YouTube,
 * and strips everything else (scripts, inline event handlers, style/base
 * tags, javascript: URLs, etc).
 */
export function sanitizeHtml(html: string): string {
	if (!html) return ""
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			"p", "br", "hr",
			"h2", "h3", "h4",
			"strong", "b", "em", "i", "u", "s", "mark", "sub", "sup",
			"ul", "ol", "li",
			"a", "img", "figure", "figcaption",
			"blockquote", "code", "pre",
			"table", "thead", "tbody", "tr", "th", "td",
			"iframe", "span", "div",
		],
		ALLOWED_ATTR: [
			"href", "target", "rel", "src", "alt", "title", "width", "height",
			"class", "loading", "allow", "allowfullscreen", "frameborder",
		],
		ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
	})
}
