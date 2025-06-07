"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { assets } from "/Assets/assets";
import LoadingSpinner from "/Components/LoadingSpinner.jsx";
import { renderContentWithInlineFootnotes } from "../../../../utils/renderContentWithInlineFootnotes.js";

function ChapterPage({ params }) {
  const router = useRouter();
  const { id, chapterId } = React.use(params);

  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedFootnotes, setExpandedFootnotes] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chapterList, setChapterList] = useState([]);
  const [showFooter, setShowFooter] = useState(true);

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

  const fetchChapterList = async () => {
    try {
      const res = await axios.get("/api/blog/chapter", {
        params: { id, all: true },
      });
      setChapterList(res.data);
    } catch (error) {
      console.error("Failed to fetch chapter list", error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [chapterId]);

  useEffect(() => {
    fetchChapterList();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowFooter(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sidebarOpen && window.innerWidth < 640) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return loading ? (
    <LoadingSpinner loading={loading} />
  ) : chapterData ? (
    <div className="flex min-h-screen relative">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed bottom-0 h-full w-full sm:w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b font-semibold text-lg">
          Главы
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 text-2xl font-bold hover:text-black"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        <ul className="pt-4 pb-4 space-y-2 overflow-y-auto max-h-[calc(100%-4rem)]">
          {chapterList.map((chapter) => (
            <li key={chapter._id}>
              <Link
                href={`/blogs/${id}/${chapter._id}`}
                className={`block px-3 py-2 w-full hover:bg-gray-100 ${
                  chapter._id === chapterId ? "font-semibold text-blue-600" : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {chapter.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white hidden sm:block p-2 sm:top-12 sm:left-12 fixed rounded-full shadow-lg transition duration-200 cursor-pointer hover:bg-gray-100 cursor-pointer"
            >
              <Image src={assets.chapter_icon} alt="" />
            </button>
          )}

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
          <div className="quill-content max-w-none text-justify sm:text-start">
            {chapterData.currentChapter.isQuillFormat ? (
              <div
                className="quill-content"
                dangerouslySetInnerHTML={{
                  __html: chapterData.currentChapter.content,
                }}
              />
            ) : (
              renderContentWithInlineFootnotes(
                chapterData,
                expandedFootnotes,
                toggleFootnote
              )
            )}
          </div>

          <div className="text-center sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center">
            {chapterData.firstChapter && (
              <Link href={`/blogs/${id}`}>
                <button className="bg-white sm:text-2xl py-1 px-4 sm:py-3 sm:px-6 cursor-pointer">
                  ⏮
                </button>
              </Link>
            )}
            {chapterData.prevChapter && (
              <Link href={`/blogs/${id}/${chapterData.prevChapter._id}`}>
                <button className="flex items-center bg-white gap-1 font-medium py-2 px-4 sm:py-3 sm:px-6 border border-black shadow-[_7px_7px_0px_#000000]">
                  <Image src={assets.arrow} alt="" /> Предыдущая
                </button>
              </Link>
            )}
            {chapterData.nextChapter && (
              <Link href={`/blogs/${id}/${chapterData.nextChapter._id}`}>
                <button className="flex items-center bg-white gap-1 font-medium py-2 px-4 sm:py-3 sm:px-6 border border-black shadow-[_7px_7px_0px_#000000]">
                  Следующая <Image src={assets.right_arrow} alt="" />
                </button>
              </Link>
            )}
            {chapterData.lastChapter && (
              <Link href={`/blogs/${id}/${chapterData.lastChapter._id}`}>
                <button className="bg-white py-1 px-4 mb-50 sm:mb-0 sm:py-3 sm:px-6 sm:text-2xl cursor-pointer">
                  ⏭
                </button>
              </Link>
            )}
          </div>
          <Link
            href="/"
            className="fixed hidden sm:block sm:bottom-12 sm:right-12 z-50"
          >
            <button className="bg-white p-2 sm:p-3 rounded-full shadow-lg transition duration-200 cursor-pointer hover:bg-gray-100">
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

      {/* Mobile Fixed Footer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center py-3 transition-transform duration-300 ${
          showFooter ? "translate-y-0" : "translate-y-full"
        } sm:hidden`}
      >
        {/* Sidebar Toggle Button */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 cursor-pointer"
          >
            <Image src={assets.chapter_icon} alt="" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Home Button */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <button className="p-2 cursor-pointer">
              <Image
                src={assets.home_icon}
                alt="Home"
                width={24}
                height={24}
                className="w-5 h-5"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center mt-10">Глава не найдена.</p>
  );
}

export default ChapterPage;
