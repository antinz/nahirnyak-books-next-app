"use client";

import BlogTableItem from "../../../Components/AdminComponents/BlogTableItem";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 6;

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

function Page() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Управление комментариями
  const [showComments, setShowComments] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blog");
      if (res.data.success) {
        setBlogs(res.data.blogs);
      } else {
        toast.error("Не удалось загрузить блоги");
      }
    } catch (error) {
      console.error("Ошибка при загрузке блогов:", error);
      toast.error("Произошла ошибка при получении блогов");
    }
  };

  const deleteBlog = async (mongoId, title) => {
    const confirmDelete = window.confirm(
      `ВЫ ТОЧНО УВЕРЕНЫ, ЧТО ХОТИТЕ УДАЛИТЬ КНИГУ "${title.toUpperCase()}"? ЭТО НАВСЕГДА УДАЛИТ КНИГУ ИЗ БАЗЫ ДАННЫХ!!!`,
    );
    if (!confirmDelete) return;
    try {
      const res = await axios.delete("/api/blog", {
        params: { id: mongoId },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchBlogs();
      } else {
        toast.error("Не удалось удалить книгу");
      }
    } catch (error) {
      console.error("Ошибка при удалении книги:", error);
      toast.error("Произошла ошибка при удалении книги");
    }
  };

  const openComments = async (blog) => {
    setSelectedBlog(blog);
    setShowComments(true);
    setCommentsLoading(true);
    try {
      const res = await axios.get(`/api/blog/comments?blogId=${blog._id}`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch {
      toast.error("Не удалось загрузить комментарии");
    } finally {
      setCommentsLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Удалить этот комментарий?")) return;
    try {
      const res = await axios.delete(
        `/api/blog/comments?commentId=${commentId}`,
      );
      if (res.data.success) {
        toast.success("Комментарий удалён");
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch {
      toast.error("Не удалось удалить комментарий");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-3xl font-semibold">Все книги</h1>
      <div className="relative h-auto max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide mb-10">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-sm text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="hidden sm:block px-6 py-3">
                Автор
              </th>
              <th scope="col" className="px-6 py-3">
                Название
              </th>
              <th scope="col" className="px-6 py-3">
                Дата
              </th>
              <th scope="col" className="px-6 py-3">
                Действие
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlogs.map((item) => (
              <BlogTableItem
                key={item._id}
                mongoId={item._id}
                title={item.title}
                author={item.author}
                authorImg={item.authorImg}
                date={item.date}
                deleteBlog={() => deleteBlog(item._id, item.title)}
                onViewComments={() => openComments(item)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-4 mr-80">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 flex items-center justify-center py-1 mb-10 border rounded ${
              currentPage === i + 1
                ? "bg-black text-white"
                : "bg-white border-gray-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Модальное окно комментариев (админка) */}
      {showComments && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowComments(false)
          }
        >
          <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-black">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black">
              <div>
                <h2 className="text-base font-semibold uppercase tracking-wide">
                  Комментарии
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {selectedBlog?.title}
                </p>
              </div>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-500 hover:text-black text-2xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {commentsLoading ? (
                <p className="text-center text-gray-400 py-8">Загрузка...</p>
              ) : comments.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  Комментариев пока нет
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-1">
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
                      <button
                        onClick={() => deleteComment(c._id)}
                        title="Удалить комментарий"
                        className="text-red-400 hover:text-red-600 transition-colors text-lg leading-none flex-shrink-0 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-400">
              Всего комментариев: {comments.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
