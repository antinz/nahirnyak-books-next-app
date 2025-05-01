import parse from "html-react-parser";

export function renderContentWithInlineFootnotes(
  chapterData,
  expandedFootnotes,
  toggleFootnote
) {
  return parse(chapterData.currentChapter.content, {
    replace: (node) => {
      if (node.name === "sup" && node.children?.[0]?.data?.trim()) {
        const key = node.children[0].data.trim();
        const footnoteObj = chapterData.currentChapter.footnotes?.find(
          (obj) => Object.keys(obj)[0] === key
        );
        const footnoteIndex = chapterData.currentChapter.footnotes?.findIndex(
          (obj) => Object.keys(obj)[0] === key
        );
        if (!footnoteObj || footnoteIndex === -1) return;
        if (expandedFootnotes[footnoteIndex]) {
          const rawNote = Object.values(footnoteObj)[0];
          const cleanedNote = rawNote?.replace(/<sup>.*?<\/sup>/i, "").trim();
          return (
            <span
              className="mt-3 mb-4 p-3 border-l-4 rounded border-gray-400 bg-gray-100 text-xs sm:text-sm block cursor-pointer"
              onClick={() => toggleFootnote(footnoteIndex)}
              title="Нажмите, чтобы скрыть сноску"
            >
              {parse(cleanedNote || "Сноска не найдена")}
            </span>
          );
        } else {
          return (
            <sup
              className="cursor-pointer text-blue-600 underline"
              onClick={() => toggleFootnote(footnoteIndex)}
              title="Нажмите, чтобы показать сноску"
            >
              {key}
            </sup>
          );
        }
      }
    },
  });
}
