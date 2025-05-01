"use client";

import BlogTableItem from "/Components/AdminComponents/BlogTableItem.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [blogs, setBlogs] = useState([]);

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

  const deleteBlog = async (mongoId) => {
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
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-3xl font-semibold">Все книги</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
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
            {blogs.map((item, i) => {
              return (
                <BlogTableItem
                  key={i}
                  mongoId={item._id}
                  title={item.title}
                  author={item.author}
                  authorImg={item.authorImg}
                  date={item.date}
                  deleteBlog={deleteBlog}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default page;
