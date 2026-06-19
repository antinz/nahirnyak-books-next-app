import DOMPurify from "dompurify";

export function sanitizeHTML(html) {
  if (typeof window === "undefined") return html;

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "iframe", "form", "style"],
  });
}
