"use client";
import ChapterTableItem from "/Components/AdminComponents/ChapterTableItem.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 20;

function Page() {
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchChapters = async () => {
    try {
      const res = await axios.get("/api/blog/chapter");
      if (res.data) {
        setChapters(res.data.reverse());
      } else {
        toast.error("Не удалось загрузить главы");
      }
    } catch (error) {
      console.error("Ошибка при загрузке глав:", error);
      toast.error("Произошла ошибка при получении глав");
    }
  };

  const deleteChapter = async (mongoId, title) => {
    const confirmDelete = window.confirm(
      `ВЫ ТОЧНО УВЕРЕНЫ, ЧТО ХОТИТЕ УДАЛИТЬ ГЛАВУ "${title.toUpperCase()}"? ЭТО НАВСЕГДА УДАЛИТ ГЛАВУ ИЗ БАЗЫ ДАННЫХ!!!`
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete("/api/blog/chapter", {
        params: { id: mongoId },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchChapters();
      } else {
        toast.error("Не удалось удалить главу");
      }
    } catch (error) {
      console.error("Ошибка при удалении главы:", error);
      toast.error("Произошла ошибка при удалении главы");
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const totalPages = Math.ceil(chapters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedChapters = chapters.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-3xl font-semibold">Все главы</h1>

      <div className="relative h-auto max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-sm text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Название книги</th>
              <th className="px-6 py-3">Название главы</th>
              <th className="px-6 py-3">Дата</th>
              <th className="px-6 py-3">Действие</th>
            </tr>
          </thead>
          <tbody>
            {paginatedChapters.map((item, i) => (
              <ChapterTableItem
                key={item._id}
                mongoId={item._id}
                blogTitle={item.blogTitle}
                title={item.title}
                date={item.date}
                deleteChapter={() => deleteChapter(item._id, item.title)}
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
    </div>
  );
}

export default Page;
