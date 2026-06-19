"use client";

import BlogTableItem from "../../../Components/AdminComponents/BlogTableItem";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 6;

function Page() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
            {paginatedBlogs.map((item, i) => (
              <BlogTableItem
                key={item._id}
                mongoId={item._id}
                title={item.title}
                author={item.author}
                authorImg={item.authorImg}
                date={item.date}
                deleteBlog={() => deleteBlog(item._id, item.title)}
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
