export function extractFootnotesFromHtml(text) {
  const supRegex = /<sup>(.*?)<\/sup>/g;
  const footNoteRegex = /<p class=["']footnote["']>(.*?)<\/p>/gs;

  const supMatches = [];
  const footnoteMatches = [];
  const results = [];
  let match;

  while ((match = supRegex.exec(text)) !== null) {
    supMatches.push(match[1].trim());
  }

  while ((match = footNoteRegex.exec(text)) !== null) {
    footnoteMatches.push(match[1].trim());
  }

  for (
    let i = 0;
    i < Math.min(supMatches.length, footnoteMatches.length);
    i++
  ) {
    results.push({
      [supMatches[i]]: footnoteMatches[i],
    });
  }

  return results;
}
