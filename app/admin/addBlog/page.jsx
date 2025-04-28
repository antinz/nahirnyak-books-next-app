"use client";

import { assets } from "/Assets/assets";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

function page() {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    title: "",
    subTitle: "",
    description: "",
    content: "",
    category: "",
    author: "Нагирняк Михаил Павлович",
    authorImg: "/author_img.jpg",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subTitle", data.subTitle);
    formData.append("description", data.description);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("author", data.author);
    formData.append("authorImg", data.authorImg);
    formData.append("image", image);
    const res = await axios.post(`/api/blog`, formData);
    if (res.data.success) {
      toast.success(res.data.message);
      console.log(data);
      setImage(false);
      setData({
        title: "",
        subTitle: "",
        description: "",
        content: "",
        category: "",
        author: "Нагирняк Михаил Павлович",
        authorImg: "/author_img.jpg",
      });
    } else {
      console.log(res.data);
      toast.error(res.data.message);
    }
  };
  return (
    <>
      <form onSubmit={onSubmitHandler} className="pt-5 px-5 sm:pt-12 sm:pl-16">
        <p className="text-xl">Загрузить картинку</p>
        <label htmlFor="image">
          <Image
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
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
          required
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
          placeholder="Введите название книги"
          className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
        />

        <p className="text-xl mt-4">Описание книги</p>
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={data.description}
          type="text"
          placeholder="Введите описание..."
          required
          className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
          rows={4}
        />
        <p className="text-xl mt-4">
          Содержание книги (первая глава или пролог)
        </p>
        <textarea
          name="content"
          onChange={onChangeHandler}
          value={data.content}
          type="text"
          placeholder="Начните писать..."
          required
          className="w-full sm:w-[1000px] mt-4 px-4 py-3 border"
          rows={15}
        />
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
          <option value="Для супругов">Для супругов</option>
        </select>
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

export default page;
