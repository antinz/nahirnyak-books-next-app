"use client";

import ChapterTableItem from "/Components/AdminComponents/ChapterTableItem.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [chapters, setChapters] = useState([]);

  const fetchChapters = async () => {
    try {
      const res = await axios.get("/api/blog/chapter");
      if (res.data) {
        setChapters(res.data);
      } else {
        toast.error("Не удалось загрузить главы");
      }
    } catch (error) {
      console.error("Ошибка при загрузке глав:", error);
      toast.error("Произошла ошибка при получении глав");
    }
  };

  const deleteChapter = async (mongoId) => {
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
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-3xl font-semibold">Все книги</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-sm text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Название книги
              </th>
              <th scope="col" className="px-6 py-3">
                Название главы
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
            {chapters.map((item, i) => {
              return (
                <ChapterTableItem
                  key={i}
                  mongoId={item._id}
                  blogTitle={item.blogTitle}
                  title={item.title}
                  date={item.date}
                  deleteChapter={deleteChapter}
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
