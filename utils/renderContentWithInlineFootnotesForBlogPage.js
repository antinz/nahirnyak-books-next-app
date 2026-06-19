import { assets } from "../Assets/assets";
import parse from "html-react-parser";
import Image from "next/image";

export function renderContentWithInlineFootnotesForBlogPage(
  data,
  expandedFootnotes,
  toggleFootnote,
) {
  if (typeof data.content !== "string") {
    console.error(
      "Expected content to be a string, but got:",
      typeof data.content,
    );
    return null;
  }
  return parse(data.content, {
    replace: (node) => {
      if (node.name === "sup" && node.children?.[0]?.data?.trim()) {
        const key = node.children[0].data.trim();
        const footnoteObj = data.footnotes?.find(
          (obj) => Object.keys(obj)[0] === key,
        );
        const footnoteIndex = data.footnotes?.findIndex(
          (obj) => Object.keys(obj)[0] === key,
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
              className="relative text-blue-600 underline cursor-pointer"
              onClick={() => toggleFootnote(footnoteIndex)}
              title="Нажмите, чтобы показать сноску"
            >
              <span className="invisible">{key}</span>
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 visible w-4 h-4"
              >
                <Image
                  src={assets.comment_icon}
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
            </sup>
          );
        }
      }
    },
  });
}
