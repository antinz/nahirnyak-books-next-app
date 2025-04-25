import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem.jsx";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.jsx";

function BlogList() {
  const [menu, setMenu] = useState("Все");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    const res = await axios.get("/api/blog");
    setBlogs(res.data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
    setLoading(false);
  }, []);
  return (
    <div>
      <div className="flex justify-center gap-6 my-10 ">
        <button
          onClick={() => setMenu("Все")}
          className={
            menu === "Все" ? "bg-black text-white py-1 px-4 rounded-sm" : ""
          }
        >
          Все
        </button>
        <button
          className={
            menu === "Христианские рассказы"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : ""
          }
          onClick={() => setMenu("Христианские рассказы")}
        >
          Христианские рассказы
        </button>
        <button
          className={
            menu === "Богословие"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : ""
          }
          onClick={() => setMenu("Богословие")}
        >
          Богословие
        </button>
        <button
          className={
            menu === "Беседы о воле Божией"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : ""
          }
          onClick={() => setMenu("Беседы о воле Божией")}
        >
          Беседы о воле Божией
        </button>
        <button
          className={
            menu === "Для супругов"
              ? "bg-black text-white py-1 px-4 rounded-sm"
              : ""
          }
          onClick={() => setMenu("Для супругов")}
        >
          Для супругов
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-5 gap-y-10 mb-16 xl:mx-24">
        <LoadingSpinner loading={loading} />
        {!loading &&
          blogs
            .filter((item) => (menu === "Все" ? true : item.category === menu))
            .map((item, i) => {
              return (
                <BlogItem
                  key={i}
                  id={item._id}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  content={item.content}
                  category={item.category}
                />
              );
            })}
      </div>
    </div>
  );
}

export default BlogList;
