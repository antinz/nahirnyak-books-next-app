import React, { useEffect, useState, useMemo } from "react";
import BlogItem from "./BlogItem.jsx";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { assets } from "/Assets/assets.js";
import Image from "next/image.js";
import { toast } from "react-toastify";

function BlogList() {
  const [menu, setMenu] = useState("Все");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blog");

      if (res.data.success) {
        setBlogs(res.data.blogs);
      } else {
        toast.error("Не удалось загрузить книги");
      }
    } catch (error) {
      console.error("Ошибка при загрузке книг:", error);
      toast.error("Произошла ошибка при получении книг");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = [
    "Все",
    "Христианские рассказы",
    "Богословие",
    "Беседы о воле Божией",
    "Брак и семья",
    "Для служителей",
    "Проповеди и статьи",
  ];

  const sortedFilteredBlogs = useMemo(() => {
    const filtered = blogs.filter(
      (item) => menu === "Все" || item.category === menu
    );

    if (menu === "Беседы о воле Божией") {
      const desiredOrder = [
        "Послание Иакова",
        "1-е Послание Петра",
        "2-е Послание Петра",
        "1-е Послание Иоанна",
        "2-е Послание Иоанна",
        "3-е Послание Иоанна",
        "Послание Иуды",
        "Послание к Римлянам Часть 1",
        "Послание к Римлянам Часть 2",
        "Послание к Римлянам Часть 3",
        "Послание к Римлянам Часть 4",
        "1-е Послание к Коринфянам Часть 1",
        "1-е Послание  к Коринфянам Часть 2",
        "1-е Послание к Коринфянам Часть 3",
        "2-е Послание к Коринфянам Часть 1",
        "2-е Послание к Коринфянам Часть 2",
        "Послание к Галатам",
        "Послание к Ефесянам",
        "Послание к Филиппийцам",
        "Послание к Колоссянам",
        "1-е Послание к Фессалоникийцам",
        "2-е Послание к Фессалоникийцам",
        "1-е Послание к Тимофею",
        "2-е Послание к Тимофею",
        "Послание к Титу",
        "Послание к Филимону",
        "Послание к Евреям Часть 1",
        "Послание к Евреям Часть 2",
      ];

      return filtered.sort(
        (a, b) => desiredOrder.indexOf(a.title) - desiredOrder.indexOf(b.title)
      );
    }

    return filtered;
  }, [blogs, menu]);

  return (
    <div className="px-4 sm:px-8">
      {/* Mobile dropdown title */}
      <p className="text-base text-center mt-4 mb-2 sm:hidden font-semibold">
        Категории
      </p>

      {/* Mobile dropdown button */}
      <div className="flex justify-center my-4 sm:hidden">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-black text-white py-2 px-4 rounded-sm flex items-center justify-between w-60"
        >
          <span>{menu}</span>
          <Image
            src={dropdownOpen ? assets.up_arrow : assets.down_arrow}
            alt=""
            width={10}
          />
        </button>
      </div>

      {/* Mobile dropdown items */}
      {dropdownOpen && (
        <div className="flex flex-col items-center gap-2 mb-6 sm:hidden">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setMenu(category);
                setDropdownOpen(false);
              }}
              className={`${
                menu === category ? "bg-black text-white" : "bg-gray-100"
              } py-1 px-4 rounded-sm w-60 text-center`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Desktop category buttons */}
      <div className="hidden sm:flex justify-center flex-wrap gap-4 my-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setMenu(category)}
            className={`${
              menu === category ? "bg-black text-white" : "bg-gray-100"
            } py-1 px-4 rounded-sm`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog items */}
      {loading ? (
        <div className="flex justify-center items-center my-16">
          <LoadingSpinner loading={loading} />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="max-w-7xl mb-16">
            {sortedFilteredBlogs.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                Здесь пока пусто😢
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-20">
                {sortedFilteredBlogs.map((item) => (
                  <BlogItem
                    key={item._id}
                    id={item._id}
                    image={item.image}
                    title={item.title}
                    description={item.description}
                    content={item.content}
                    category={item.category}
                    pdfUrl={item.pdfUrl}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogList;
