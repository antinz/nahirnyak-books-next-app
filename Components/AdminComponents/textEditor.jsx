"use client";

import "react-quill-new/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill-new";
import { useEffect } from "react";
import { ClassAttributor, Scope } from "parchment";
const LineHeightClass = new ClassAttributor("line-height", "ql-line-height", {
  scope: Scope.BLOCK,
});
Quill.register(LineHeightClass, true);

// Line height values and their user-friendly labels
const lineHeights = ["0.5", "0.7", "0.8", "0.9", "1", "1.5", "2", "2.5", "3"];

const lineHeightLabels = {
  0.5: "0.5x",
  0.7: "0.7x",
  0.8: "0.8x",
  0.9: "0.9x",
  1: "Single",
  1.5: "1.5x",
  2: "Double",
  2.5: "2.5x",
  3: "Triple",
};

export default function RichTextEditor({ value, onChange }) {
  // Inject CSS styles for each line-height class once
  useEffect(() => {
    if (typeof document === "undefined") return;

    lineHeights.forEach((val) => {
      // Escape dot for CSS class selector
      const className = `ql-line-height-${val.replace(".", "\\5c ")}`;
      if (!document.querySelector(`style[data-lineheight='${val}']`)) {
        const style = document.createElement("style");
        style.setAttribute("data-lineheight", val);
        style.innerHTML = `.ql-editor .${className} { line-height: ${val} !important; }`;
        document.head.appendChild(style);
      }
    });
  }, []);

  // Set user-friendly text labels on the line-height picker items once after toolbar renders
  useEffect(() => {
    const setPickerLabels = () => {
      const pickerItems = document.querySelectorAll(
        ".ql-picker.ql-line-height .ql-picker-item",
      );

      if (!pickerItems.length) return;

      pickerItems.forEach((item) => {
        const value = item.getAttribute("data-value");
        if (value && lineHeightLabels[value] && !item.textContent) {
          item.textContent = lineHeightLabels[value];
        }
      });
    };

    // Delay a bit to ensure toolbar has rendered
    const timeoutId = setTimeout(setPickerLabels, 200);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }, { size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        [{ direction: "rtl" }, { direction: "ltr" }],
        [{ "line-height": lineHeights }],
        ["link", "image", "video", "formula"],
        ["clean"],
      ],
      handlers: {
        "line-height": function (value) {
          if (value) {
            this.quill.format("line-height", value);
          } else {
            this.quill.format("line-height", false);
          }
        },
      },
    },
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "header",
    "list",
    "indent",
    "align",
    "direction",
    "link",
    "image",
    "video",
    "formula",
    "line-height",
  ];

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      theme="snow"
    />
  );
}
