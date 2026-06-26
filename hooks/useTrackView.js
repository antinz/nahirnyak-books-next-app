// hooks/useTrackView.js
// Вставь этот хук в страницу [id]/page.jsx

import { useEffect } from "react";
import axios from "axios";

function getFingerprint() {
  if (typeof window === "undefined") return null;
  let fp = localStorage.getItem("_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("_fp", fp);
  }
  return fp;
}

export function useTrackView(blogId) {
  useEffect(() => {
    if (!blogId) return;
    const fp = getFingerprint();
    if (!fp) return;

    axios
      .patch(`/api/blog/interact?id=${blogId}&action=view`, {
        fingerprint: fp,
      })
      .catch(() => {
        // Тихо игнорируем
      });
  }, [blogId]);
}
