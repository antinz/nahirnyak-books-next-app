"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "/Components/LoadingSpinner.jsx";
import Link from "next/link";
import Image from "next/image";
import { assets } from "/Assets/assets";
import { renderContentWithInlineFootnotes } from "/utils/renderContentWithInlineFootnotes";

function ChapterPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id, chapterId } = unwrappedParams;
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedFootnotes, setExpandedFootnotes] = useState({});

  const toggleFootnote = (index) => {
    setExpandedFootnotes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const fetchChapters = async () => {
    try {
      const res = await axios.get("/api/blog/chapter", {
        params: { id, chapterId },
      });
      if (!res.data.currentChapter) {
        if (res.data.prevChapter) {
          router.replace(`/blogs/${id}/${res.data.prevChapter._id}`);
        } else if (res.data) {
          router.replace(`/blogs/${id}`);
        } else {
          router.replace("/");
        }
        return;
      }
      setChapterData(res.data);
    } catch (err) {
      console.error("Failed to load chapter", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [chapterId]);

  return loading ? (
    <LoadingSpinner loading={loading} />
  ) : chapterData ? (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image src={assets.logo} width={150} alt="Logo" />
          </Link>
        </div>
        <div className="text-center mt-16 mb-8 px-3">
          <h1 className="text-xl sm:text-3xl font-semibold max-w-[700px] mx-auto">
            {chapterData.currentChapter.title}
          </h1>
        </div>
      </div>
      <div className="mx-4 sm:mx-6 md:mx-10 max-w-[800px] md:mx-auto mt-4 mb-10">
        <div className="blog-content max-w-none text-justify sm:text-start">
          {renderContentWithInlineFootnotes(
            chapterData,
            expandedFootnotes,
            toggleFootnote
          )}
        </div>

        <div className="text-center mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          {chapterData.prevChapter && (
            <Link href={`/blogs/${id}/${chapterData.prevChapter._id}`}>
              <button className="flex items-center bg-white gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 border border-black cursor-pointer shadow-[_7px_7px_0px_#000000]">
                <Image src={assets.arrow} alt="" /> Предыдущая глава
              </button>
            </Link>
          )}
          {chapterData.nextChapter && (
            <Link href={`/blogs/${id}/${chapterData.nextChapter._id}`}>
              <button className="flex items-center bg-white gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 border border-black cursor-pointer shadow-[_7px_7px_0px_#000000]">
                Следующая глава <Image src={assets.right_arrow} alt="" />
              </button>
            </Link>
          )}
        </div>
        <Link
          href="/"
          className="fixed bottom-4 right-2 sm:bottom-6 sm:right-6 z-50"
        >
          <button className="bg-white p-2 sm:p-3 rounded-full shadow-lg hover:opacity-100 transition duration-200 cursor-pointer opacity-30">
            <Image
              src={assets.home_icon}
              alt="Home"
              width={20}
              height={20}
              className="w-4 h-4"
            />
          </button>
        </Link>
      </div>
    </div>
  ) : (
    <p className="text-center mt-10">Глава не найдена.</p>
  );
}

export default ChapterPage;
