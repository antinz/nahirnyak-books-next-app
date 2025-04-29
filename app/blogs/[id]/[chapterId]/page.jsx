"use client";
import React, { use } from "react";
import parse, { domToReact } from "html-react-parser";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "/Components/LoadingSpinner.jsx";
import Link from "next/link";
import Image from "next/image";
import Footer from "/Components/Footer.jsx";
import { assets } from "/Assets/assets";

function ChapterPage({ params }) {
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

  const renderContentWithInlineFootnotes = () => {
    return parse(chapterData.currentChapter.content, {
      replace: (node) => {
        if (node.name === "sup" && node.children?.[0]?.data?.trim()) {
          const key = node.children[0].data.trim();
          const footnoteObj = chapterData.currentChapter.footnotes?.find(
            (obj) => Object.keys(obj)[0] === key
          );
          const footnoteIndex = chapterData.currentChapter.footnotes?.findIndex(
            (obj) => Object.keys(obj)[0] === key
          );
          if (!footnoteObj || footnoteIndex === -1) return;
          if (expandedFootnotes[footnoteIndex]) {
            const rawNote = Object.values(footnoteObj)[0];
            const cleanedNote = rawNote?.replace(/<sup>.*?<\/sup>/i, "").trim();
            return (
              <span
                className="mt-3 mb-4 p-3 border-l-4 rounded border-gray-400 bg-gray-100 text-xs sm:text-sm block cursor-pointer"
                onClick={() => toggleFootnote(footnoteIndex)}
                title="Нажмите, чтобы скрыть сноску"
              >
                {parse(cleanedNote || "Сноска не найдена")}
              </span>
            );
          } else {
            return (
              <sup
                className="cursor-pointer text-blue-600 underline"
                onClick={() => toggleFootnote(footnoteIndex)}
                title="Нажмите, чтобы показать сноску"
              >
                {key}
              </sup>
            );
          }
        }
      },
    });
  };

  const fetchChapters = async () => {
    try {
      const res = await axios.get("/api/blog/chapter", {
        params: { id, chapterId },
      });
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

      <div className="mx-4 sm:mx-6 md:mx-10 max-w-[800px] md:mx-auto mt-4 mb-10 flex-grow">
        <div className="blog-content prose prose-sm sm:prose-base break-words max-w-none text-justify sm:text-start hyphens-auto">
          {renderContentWithInlineFootnotes()}
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  ) : (
    <p className="text-center mt-10">Глава не найдена.</p>
  );
}

export default ChapterPage;
