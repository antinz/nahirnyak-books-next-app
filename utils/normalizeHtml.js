export function normalizeHtml(html) {
  if (!html || typeof html !== "string") return html;

  return html
    .replace(/\u00A0/g, " ") // U+00A0 — реальный неразрывный пробел
    .replace(/&#160;/gi, " ") // decimal entity
    .replace(/&nbsp;/gi, " ") // named entity
    .replace(/\u202F/g, " ") // narrow no-break space
    .replace(/\u00AD/g, "") // soft hyphen
    .replace(/[\u200B\u200C\uFEFF]/g, ""); // zero-width chars
}
