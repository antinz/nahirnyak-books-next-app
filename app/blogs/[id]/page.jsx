"use client";

import { assets } from "/Assets/assets";
import Footer from "/Components/Footer.jsx";
import LoadingSpinner from "/Components/LoadingSpinner.jsx";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { renderContentWithInlineFootnotesForBlogPage } from "../../../utils/renderContentWithInlineFootnotesForBlogPage.js";
import { toast } from "react-toastify";

function Page({ params }) {
  const unwrappedParams = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapterData, setChapterData] = useState(null);
  const [expandedFootnotes, setExpandedFootnotes] = useState({});

  const toggleFootnote = (index) => {
    setExpandedFootnotes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const visitorId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("visitorId="))
        ?.split("=")[1];
      const res = await axios.get("/api/blog", {
        params: {
          id: unwrappedParams.id,
        },
        headers: {
          "x-visitor-id": visitorId,
        },
      });
      setData(res.data);
    } catch (err) {
      toast.error("Не удалось загрузить книгу");
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const res = await axios.get("/api/blog/chapter", {
        params: {
          id: unwrappedParams.id,
          all: true,
        },
      });
      setChapterData(res.data);
    } catch (err) {
      toast.error("Не удалось загрузить главу");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchChapters();
  }, []);

  useEffect(() => {
    if (!document.cookie.includes("visitorId")) {
      const id = crypto.randomUUID();
      document.cookie = `visitorId=${id}; path=/; max-age=31536000`;
    }
  }, []);

  return loading ? (
    <LoadingSpinner loading={loading} />
  ) : data ? (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src={assets.logo}
              width={150}
              alt=""
              className="w-[130px] sm:w-auto"
            />
          </Link>
        </div>
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          <h3 className="text-base italic sm:text-2xl font-semibold max-w-[700px] mx-auto">
            {data.subTitle}
          </h3>
          <Image
            className="mx-auto mt-6 border border-white rounded-full"
            src={data.authorImg}
            width={60}
            height={60}
            alt="Автор"
          />
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>
      </div>
      <div
        className={`mx-5 max-w-[800px] md:mx-auto mb-10 ${
          data.category === "Видео-проповеди" ? "mt-[0px]" : "mt-[-100px]"
        }`}
      >
        {data.category !== "Видео-проповеди" && (
          <div className="relative">
            <Image
              src={data.image}
              width={1280}
              height={720}
              alt=""
              className="border-4 border-white w-full h-auto sm:h-[550px] object-cover"
            />
          </div>
        )}

        <div className="quill-description px-4 sm:px-6 md:px-8 lg:px-0">
          <div
            className="quill-description"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
        <div className="quill-content max-w-none sm:text-start">
          {data.isQuillFormat ? (
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          ) : (
            renderContentWithInlineFootnotesForBlogPage(
              data,
              expandedFootnotes,
              toggleFootnote
            )
          )}
        </div>

        {chapterData && chapterData.length > 0 && (
          <div className="text-center mt-10">
            <Link href={`/blogs/${unwrappedParams.id}/${chapterData[0]._id}`}>
              <button className="flex items-center bg-white gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black cursor-pointer shadow-[_7px_7px_0px_#000000]">
                Читать далее <Image src={assets.right_arrow} alt="" />
              </button>
            </Link>
          </div>
        )}

        <div className="my-24"></div>
      </div>
      <Footer />
    </>
  ) : (
    <></>
  );
}

export default Page;
