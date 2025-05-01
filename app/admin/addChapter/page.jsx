"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { extractFootnotesFromHtml } from "../../../utils/extractFootnotes.js";

function page() {
  const [data, setData] = useState({
    blogId: "",
    blogTitle: "",
    title: "",
    content: "",
    chapterNumber: 1,
  });
  const [blogTitles, setBlogTitles] = useState([]);
  const [footnotes, setFootnotes] = useState([]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const getBlogIdandTitle = async () => {
    try {
      const res = await axios.get(`/api/blog`);
      if (res.data.success) {
        setBlogTitles(res.data.blogs);
      } else {
        toast.error("Ошибка при загрузке книг");
      }
    } catch (error) {
      console.error("Ошибка при загрузке книг:", error);
      toast.error("Произошла ошибка при загрузке книг");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const selectedBlog = blogTitles.find((blog) => blog._id === data.blogId);
      const res = await axios.post(`/api/blog/chapter`, {
        blogId: data.blogId,
        blogTitle: selectedBlog?.title || "",
        title: data.title,
        content: data.content,
        chapterNumber: Number(data.chapterNumber),
        footnotes: footnotes,
      });

      if (res.data.success) {
        toast.success("Глава успешно добавлена");
        setData({
          title: "",
          blogTitle: "",
          content: "",
          chapterNumber: 1,
        });
      } else {
        toast.error("Ошибка при добавлении");
      }
    } catch (error) {
      console.error("Ошибка при добавлении главы:", error);
      toast.error("Произошла ошибка при добавлении главы");
    }
  };

  useEffect(() => {
    const results = extractFootnotesFromHtml(data.content);
    setFootnotes(results);
    console.log(footnotes);
  }, [data.content]);

  useEffect(() => {
    getBlogIdandTitle();
  }, []);
  return (
    <>
      <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
        <p className="text-xl mt-4">Выберите книгу</p>
        <select
          onChange={onChangeHandler}
          value={data.blogId}
          name="blogId"
          required
          className="w-60 mt-4 px-4 py-3 border text-gray-500 "
        >
          <option value="" disabled>
            -- Выберите книгу --
          </option>
          {blogTitles.map((blog, i) => {
            return (
              <option value={blog._id} key={i}>
                {blog.title}
              </option>
            );
          })}
        </select>
        <p className="text-xl mt-4">Название главы</p>
        <input
          name="title"
          onChange={onChangeHandler}
          value={data.title}
          type="text"
          placeholder="Введите название главы"
          required
          className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
        />
        <p className="text-xl mt-4">Порядковый номер главы</p>
        <input
          name="chapterNumber"
          onChange={onChangeHandler}
          value={data.chapterNumber}
          type="number"
          required
          className="w-full sm:w-[250px] mt-4 px-4 py-3 border"
        />

        <p className="text-xl mt-4">Содержание главы</p>
        <textarea
          name="content"
          onChange={onChangeHandler}
          value={data.content}
          type="text"
          placeholder="Введите содержание..."
          required
          className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
          rows={15}
        />
        <br />
        <button
          type="submit"
          className="mt-8 w-40 mb-15 h-12 bg-black text-white"
        >
          Добавить
        </button>
      </form>
    </>
  );
}

export default page;
