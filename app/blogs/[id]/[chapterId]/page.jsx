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
import { Chathura } from "next/font/google";

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

          // Find the footnote with this exact key
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
                className="mt-2 mb-4 p-3 border block border-l-5 rounded-xs border-grey-500 bg-grey-150 text-xs sm:text-sm cursor-pointer"
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
      const res = await axios.get(
        "https://nahirnyak-books-next-app.vercel.app/api/blog/chapter",
        {
          params: {
            id: unwrappedParams.id,
            chapterId: unwrappedParams.chapterId,
          },
        }
      );
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
        <div className="text-center my-24 mb-5">
          <h1 className="text-2xl sm:text-3xl font-semibold max-w-[700px] mx-auto">
            {chapterData.currentChapter.title}
          </h1>
        </div>
      </div>
      <div className="mx-5  max-w-[800px] md:mx-auto mt-[20px] mb-10 flex-grow">
        <div className="blog-content">{renderContentWithInlineFootnotes()}</div>
        <div className="text-center mt-7 flex gap-10 items-center">
          {!chapterData.prevChapter ? null : (
            <Link href={`/blogs/${id}/${chapterData.prevChapter?._id}`}>
              <button className="flex items-center bg-white gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black cursor-pointer shadow-[_7px_7px_0px_#000000]">
                <Image src={assets.arrow} alt="" /> Предыдущая глава
              </button>
            </Link>
          )}

          {!chapterData.nextChapter ? null : (
            <Link href={`/blogs/${id}/${chapterData.nextChapter?._id}`}>
              <button className="flex items-center bg-white gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black cursor-pointer shadow-[_7px_7px_0px_#000000]">
                Следующая глава <Image src={assets.right_arrow} alt="" />
              </button>
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <p className="text-center mt-10">Глава не найдена.</p>
  );
}

export default ChapterPage;
