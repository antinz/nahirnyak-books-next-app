"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CommentsModal({ blogId, onClose, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`/api/blog/comments?blogId=${blogId}`);
      if (res.data.success) {
        setComments(res.data.comments);
        onCountChange?.(res.data.comments.length);
      }
    } catch {
      // тихо игнорируем
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Закрытие по Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Блокировка скролла фона
  useEffect(() => {
    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!text.trim()) {
      setError("Напишите комментарий");
      return;
    }
    if (text.trim().length > 1000) {
      setError("Максимум 1000 символов");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`/api/blog/comments?blogId=${blogId}`, {
        name: name.trim() || undefined,
        text: text.trim(),
      });
      if (res.data.success) {
        setName("");
        setText("");
        fetchComments();
      }
    } catch {
      setError("Не удалось отправить комментарий, попробуйте позже");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-black">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black">
          <h2 className="text-lg font-semibold uppercase tracking-wide">
            Комментарии
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl leading-none cursor-pointer"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Загрузка...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Будьте первым, кто оставит комментарий 💬
            </p>
          ) : (
            comments.map((c) => (
              <div
                key={c._id}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-semibold text-sm text-black">
                    {c.name || "Аноним"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {c.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input form */}
        <div className="px-6 py-4 border-t border-black bg-gray-50 space-y-3">
          <input
            type="text"
            placeholder="Ваше имя (необязательно)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors"
          />
          <textarea
            placeholder="Ваш комментарий..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black transition-colors resize-none"
          />
          <div className="flex items-center justify-between">
            {error ? (
              <p className="text-xs text-red-500">{error}</p>
            ) : (
              <span className="text-xs text-gray-400">{text.length}/1000</span>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-black text-white text-sm px-5 py-2 hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsModal;
