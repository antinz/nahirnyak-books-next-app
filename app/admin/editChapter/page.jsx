"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function EditChapterForm() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blog");
        if (res.data.success) {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        console.error("Ошибка при загрузке книг", err);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedBlogId) return;
      try {
        const res = await axios.get(
          `/api/blog/chapter?all=true&id=${selectedBlogId}`
        );
        setChapters(res.data || []);
        setSelectedChapterId("");
        setChapterTitle("");
        setChapterContent("");
      } catch (err) {
        console.error("Ошибка при загрузке глав", err);
      }
    };
    fetchChapters();
  }, [selectedBlogId]);

  useEffect(() => {
    const fetchChapterData = async () => {
      if (!selectedChapterId) return;
      try {
        const res = await axios.get(
          `/api/blog/chapter?chapterId=${selectedChapterId}`
        );
        const { currentChapter } = res.data;
        setChapterTitle(currentChapter.title || "");
        setChapterContent(currentChapter.content || "");
      } catch (err) {
        console.error("Ошибка при получении главы", err);
      }
    };
    fetchChapterData();
  }, [selectedChapterId]);

  const handleSave = async () => {
    if (!selectedChapterId || !selectedBlogId) return;

    try {
      const selectedBlog = blogs.find((b) => b._id === selectedBlogId);
      const res = await axios.put(`/api/blog/chapter?id=${selectedChapterId}`, {
        title: chapterTitle,
        content: chapterContent,
        blogId: selectedBlogId,
        blogTitle: selectedBlog?.title || "",
      });

      if (res.data.success) {
        toast.success("Глава обновлена");
      } else {
        toast.error(res.data.message || "Ошибка при обновлении");
      }
    } catch (err) {
      console.error("Ошибка при обновлении главы", err);
      toast.error("Ошибка при обновлении главы");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center">Редактировать главу</h1>
      <h2 className="text-xl font-semibold">Выберите книгу</h2>
      <select
        value={selectedBlogId}
        onChange={(e) => setSelectedBlogId(e.target.value)}
        className="mt-4 px-4 py-3 border w-full sm:w-[1000px] text-gray-700"
      >
        <option value="" disabled>
          -- Выберите книгу --
        </option>
        {blogs.map((blog) => (
          <option key={blog._id} value={blog._id}>
            {blog.title}
          </option>
        ))}
      </select>

      {selectedBlogId && (
        <>
          <h3 className="mt-6 text-lg font-semibold">Выберите главу</h3>
          <select
            value={selectedChapterId}
            onChange={(e) => setSelectedChapterId(e.target.value)}
            className="mt-4 px-4 py-3 border w-full sm:w-[1000px] text-gray-700"
          >
            <option value="" disabled>
              -- Выберите главу --
            </option>
            {chapters.map((chapter) => (
              <option key={chapter._id} value={chapter._id}>
                {chapter.chapterNumber}. {chapter.title}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedChapterId && (
        <>
          <div className="mt-6">
            <p className="text-lg font-medium">Название главы</p>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="mt-2 w-full sm:w-[1000px] px-4 py-3 border"
            />
          </div>

          <div className="mt-6">
            <p className="text-lg font-medium">Содержание главы</p>
            <textarea
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
              rows={15}
              className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
          >
            Сохранить изменения
          </button>
        </>
      )}
    </div>
  );
}

export default EditChapterForm;
