"use client";

import ChapterTableItem from "/Components/AdminComponents/ChapterTableItem.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [chapters, setChapters] = useState([]);

  const fetchChapters = async () => {
    const res = await axios.get("/api/blog/chapter");
    setChapters(res.data);
  };

  const deleteChapter = async (mongoId) => {
    const res = await axios.delete(
      " https://nahirnyak-books-next-app.vercel.app/api/blog/chapter",
      {
        params: {
          id: mongoId,
        },
      }
    );
    toast.success(res.data.message);
    fetchChapters();
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
