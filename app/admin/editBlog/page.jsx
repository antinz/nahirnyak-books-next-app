"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("../../../Components/AdminComponents/textEditor"),
  {
    ssr: false,
  }
);
function EditBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(""); // to preview current
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blog");
        if (res.data.success && Array.isArray(res.data.blogs)) {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        console.error("Ошибка при загрузке списка книг", err);
        toast.error("Ошибка при загрузке списка книг");
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!selectedBlogId) return;

    const fetchBlogDetails = async () => {
      try {
        const res = await axios.get(`/api/blog?id=${selectedBlogId}`);
        const blog = res.data;
        setTitle(blog.title || "");
        setDescription(blog.description || "");
        setContent(blog.content || "");
        setCurrentImage(blog.image || "");
        setCategory(blog.category || "");
        setSubTitle(blog.subTitle || "");
        setResetKey((prev) => prev + 1);
      } catch (err) {
        console.error("Ошибка при загрузке книги", err);
        toast.error("Ошибка при загрузке книги");
      }
    };

    fetchBlogDetails();
  }, [selectedBlogId]);

  const handleSave = async () => {
    if (!selectedBlogId) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("subTitle", subTitle);
      if (image) formData.append("image", image); // optional

      const res = await axios.put(`/api/blog?id=${selectedBlogId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Изменения успешно сохранены");
      } else {
        toast.error(res.data.message || "Не удалось сохранить изменения");
      }
    } catch (error) {
      console.error("Ошибка при сохранении изменений", error);
      toast.error("Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center">Редактировать книгу</h1>
      <h2 className="text-xl font-semibold mb-4">Выберите книгу</h2>

      <select
        value={selectedBlogId}
        onChange={(e) => setSelectedBlogId(e.target.value)}
        className="w-full sm:w-[1000px] border px-4 py-3 text-gray-700"
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
          <div className="mt-6">
            <p className="text-lg font-medium">Название книги</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название книги"
              className="mt-2 w-full sm:w-[1000px] px-4 py-3 border"
            />
          </div>
          <div className="mt-6">
            <p className="text-lg font-medium">Подзаголовок книги</p>
            <input
              type="text"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="Подзаголовок книги"
              className="mt-2 w-full sm:w-[1000px] px-4 py-3 border"
            />
          </div>

          <div className="mt-6">
            <p className="text-lg font-medium">Изображение книги</p>
            {(image || currentImage) && (
              <img
                src={image ? URL.createObjectURL(image) : currentImage}
                alt="Текущее изображение"
                className="w-40 h-auto mt-4"
              />
            )}
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="mt-2"
            />
          </div>

          <div className="mt-6">
            <p className="text-lg font-medium">Описание книги</p>
            <RichTextEditor
              key={`desc-${resetKey}`}
              value={description}
              onChange={setDescription}
              toolbarId="toolbar-description" // optional, if your editor supports custom toolbar IDs
            />
          </div>

          <div className="mt-6">
            <p className="text-lg font-medium">Содержание</p>
            <RichTextEditor
              key={`content-${resetKey}`}
              value={content}
              onChange={setContent}
              toolbarId="toolbar-content" // optional
            />
          </div>
          <div className="mt-6">
            <p className="text-lg font-medium">Категория книги</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-60 mt-4 px-4 py-3 border text-gray-500"
            >
              <option value="" disabled>
                -- Выберите категорию --
              </option>
              <option value="Христианские рассказы">
                Христианские рассказы
              </option>
              <option value="Богословие">Богословие</option>
              <option value="Беседы о воле Божией">Беседы о воле Божией</option>
              <option value="Брак и семья">Брак и семья</option>
              <option value="Для служителей">Для служителей</option>
              <option value="Проповеди и статьи">Проповеди и статьи</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </>
      )}
    </div>
  );
}

export default EditBlogPage;
