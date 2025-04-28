import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem.jsx";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { assets } from "/Assets/assets.js";
import Image from "next/image.js";

function BlogList() {
  const [menu, setMenu] = useState("Все");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchBlogs = async () => {
    const res = await axios.get("/api/blog");
    setBlogs(res.data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
    setLoading(false);
  }, []);

  const categories = [
    "Все",
    "Христианские рассказы",
    "Богословие",
    "Беседы о воле Божией",
    "Для супругов",
  ];

  return (
    <div>
      <p className="text-base text-center m-2 sm:hidden">Категории</p>
      {/* Mobile Dropdown */}
      <div className="flex justify-center my-6 sm:hidden">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-black text-white py-2 px-6 rounded-sm flex flex-col items-center justify-center w-48"
        >
          {menu}{" "}
          <Image
            src={dropdownOpen ? assets.up_arrow : assets.down_arrow}
            alt=""
            width={10}
          />
        </button>
      </div>
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
              } py-1 px-4 rounded-sm w-48 text-center`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Desktop Buttons */}
      <div className="hidden sm:flex justify-center gap-4 my-10 p-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setMenu(category)}
            className={`${
              menu === category ? "bg-black text-white" : ""
            } py-1 px-4 rounded-sm`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blogs */}
      <div className="flex flex-wrap justify-center gap-5 gap-y-10 mb-16 xl:mx-24">
        <LoadingSpinner loading={loading} />
        {!loading &&
          blogs
            .filter((item) => (menu === "Все" ? true : item.category === menu))
            .map((item, i) => (
              <BlogItem
                key={i}
                id={item._id}
                image={item.image}
                title={item.title}
                description={item.description}
                content={item.content}
                category={item.category}
              />
            ))}
      </div>
    </div>
  );
}

export default BlogList;
