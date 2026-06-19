"use client";
import dynamic from "next/dynamic";
import { assets } from "../../../Assets/assets";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { extractFootnotesFromHtml } from "../../../utils/extractFootnotes";

const RichTextEditor = dynamic(
  () => import("../../../Components/AdminComponents/textEditor"),
  {
    ssr: false,
  },
);

function Page() {
  const articleImage =
    "https://res.cloudinary.com/dwxck9b1p/image/upload/v1749209149/bibilya-1024x768_s9akev.webp";
  const videoPreachImage =
    "https://res.cloudinary.com/dwxck9b1p/image/upload/v1749205817/video_propoved_s2ntvm.webp";
  const [image, setImage] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [data, setData] = useState({
    title: "",
    subTitle: "",
    description: "",
    pdfUrl: "",
    content: "",
    category: "",
    author: "Нагирняк Михаил Павлович",
    authorImg: "/author_img.jpg",
  });
  const [footnotes, setFootnotes] = useState([]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (
      data.category !== "Проповеди и статьи" &&
      data.category !== "Видео-проповеди" &&
      !image
    ) {
      toast.error("Пожалуйста, выберите изображение.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfUrl", data.pdfUrl);
    formData.append("title", data.title);
    formData.append("subTitle", data.subTitle);
    formData.append("description", data.description);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("author", data.author);
    formData.append("authorImg", data.authorImg);
    formData.append("footnotes", JSON.stringify(footnotes));
    formData.append("isQuillFormat", true);

    if (data.category === "Проповеди и статьи") {
      formData.append("image", articleImage);
    } else if (data.category === "Видео-проповеди") {
      formData.append("image", videoPreachImage);
    } else {
      if (!image) {
        toast.error("Пожалуйста, выберите изображение.");
        return;
      }
      formData.append("image", image);
    }

    const res = await axios.post(`/api/blog`, formData);
    if (res.data.success) {
      toast.success(res.data.message);
      setImage(null);
      setData({
        title: "",
        subTitle: "",
        description: "",
        pdfUrl: "",
        content: "",
        category: "",
        author: "Нагирняк Михаил Павлович",
        authorImg: "/author_img.jpg",
      });
      setResetKey((prev) => prev + 1);
    } else {
      toast.error(res.data.message);
    }
  };

  useEffect(() => {
    const results = extractFootnotesFromHtml(data.content);
    setFootnotes(results);
  }, [data.content]);

  return (
    <>
      <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
        {/* Category Select — Always shown */}
        <p className="text-xl mt-4">Категория книги</p>
        <select
          onChange={onChangeHandler}
          value={data.category}
          name="category"
          required
          className="w-60 mt-4 px-4 py-3 border text-gray-500 "
        >
          <option value="" disabled>
            -- Выберите категорию --
          </option>
          <option value="Христианские рассказы">Христианские рассказы</option>
          <option value="Богословие">Богословие</option>
          <option value="Беседы о воле Божией">Беседы о воле Божией</option>
          <option value="Брак и семья">Брак и семья</option>
          <option value="Для служителей">Для служителей</option>
          <option value="Проповеди и статьи">Проповеди и статьи</option>
          <option value="Видео-проповеди">Видео-проповеди</option>
          <option value="Христианская публицистика">
            Христианская публицистика
          </option>
        </select>

        {/* Common: Image Upload */}
        <p className="text-xl mt-4">Загрузить картинку</p>
        <label htmlFor="image">
          <Image
            src={
              data.category === "Проповеди и статьи"
                ? articleImage
                : data.category === "Видео-проповеди"
                  ? videoPreachImage
                  : !image
                    ? assets.upload_area
                    : URL.createObjectURL(image)
            }
            width={140}
            height={70}
            alt=""
            className="mt-4"
            priority
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          hidden
        />

        {/* VIDEO CATEGORY ONLY */}
        {data.category === "Видео-проповеди" ? (
          <>
            <p className="text-xl mt-4">Название видео-проповеди</p>
            <input
              name="title"
              onChange={onChangeHandler}
              value={data.title}
              type="text"
              placeholder="Введите название"
              required
              className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
            />
            <p className="text-xl mt-4 mb-4">Содержание проповеди</p>
            <RichTextEditor
              key={`content-${resetKey}`}
              value={data.content}
              onChange={(value) => setData({ ...data, content: value })}
              toolbarId="toolbar-content"
            />
          </>
        ) : (
          <>
            {/* NON-VIDEO CATEGORY */}
            <p className="text-xl mt-4">
              Ссылка на скачивание книги с гугл-диска
            </p>
            <input
              name="pdfUrl"
              onChange={onChangeHandler}
              value={data.pdfUrl}
              type="text"
              placeholder="Введите ссылку на книгу"
              className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
            />
            <p className="text-xl mt-4">Название книги</p>
            <input
              name="title"
              onChange={onChangeHandler}
              value={data.title}
              type="text"
              placeholder="Введите название книги"
              required
              className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
            />
            <p className="text-xl mt-4">Подзаголовок книги</p>
            <input
              name="subTitle"
              onChange={onChangeHandler}
              value={data.subTitle}
              type="text"
              placeholder="Введите подзаголовок книги"
              className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
            />
            <p className="text-xl mt-4 mb-4">Описание книги</p>
            <RichTextEditor
              key={`desc-${resetKey}`}
              value={data.description}
              onChange={(value) => setData({ ...data, description: value })}
              toolbarId="toolbar-description"
            />
            <p className="text-xl mt-4 mb-4">Содержание книги</p>
            <RichTextEditor
              key={`content-${resetKey}`}
              value={data.content}
              onChange={(value) => setData({ ...data, content: value })}
              toolbarId="toolbar-content"
            />
          </>
        )}

        {/* Submit Button — always visible */}
        <br />
        <button
          type="submit"
          className="mt-8 w-40 h-12 mb-10 bg-black text-white"
        >
          Добавить
        </button>
      </form>
    </>
  );
}

export default Page;
