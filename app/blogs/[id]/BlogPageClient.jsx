"use client";

import { assets } from "../../../Assets/assets";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { renderContentWithInlineFootnotesForBlogPage } from "../../../utils/renderContentWithInlineFootnotesForBlogPage.js";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useTrackView } from "../../../hooks/useTrackView";

const processContent = (html) => {
  if (!html) return html;
  return html.replace(/\u00A0/g, " ").replace(/&nbsp;/gi, " ");
};

export default function BlogPageClient({ id, initialData, initialChapters }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [chapterData, setChapterData] = useState(initialChapters || []);
  const [expandedFootnotes, setExpandedFootnotes] = useState({});

  useTrackView(id);

  const toggleFootnote = (index) => {
    setExpandedFootnotes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Если данные не пришли с сервера — подгружаем на клиенте
  useEffect(() => {
    if (!initialData) {
      const fetchBlogData = async () => {
        try {
          setLoading(true);
          const visitorId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("visitorId="))
            ?.split("=")[1];
          const res = await axios.get("/api/blog", {
            params: { id },
            headers: { "x-visitor-id": visitorId },
          });
          setData(res.data);
        } catch {
          toast.error("Не удалось загрузить книгу");
        } finally {
          setLoading(false);
        }
      };
      fetchBlogData();
    }

    if (!initialChapters || initialChapters.length === 0) {
      axios
        .get("/api/blog/chapter", { params: { id, all: true } })
        .then((res) => setChapterData(res.data))
        .catch(() => {});
    }
  }, [id, initialData, initialChapters]);

  // Установка visitorId cookie
  useEffect(() => {
    if (!document.cookie.includes("visitorId")) {
      const newId = uuidv4();
      document.cookie = `visitorId=${newId}; path=/; max-age=31536000`;
    }
  }, []);

  if (loading) return <LoadingSpinner loading={loading} />;
  if (!data) return null;

  return (
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
            alt={data.title}
            className="border-4 border-white w-full h-auto sm:h-[550px] object-cover"
            priority
          />
        </div>
      )}

      <div className="quill-description px-4 sm:px-6 md:px-8 lg:px-0">
        <div
          className="quill-description"
          dangerouslySetInnerHTML={{ __html: processContent(data.description) }}
        />
      </div>

      <div className="quill-content max-w-none sm:text-start">
        {data.isQuillFormat ? (
          <div
            className="quill-content"
            dangerouslySetInnerHTML={{ __html: processContent(data.content) }}
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
          <Link href={`/blogs/${id}/${chapterData[0]._id}`}>
            <button className="flex items-center bg-white gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black cursor-pointer shadow-[_7px_7px_0px_#000000]">
              Читать далее <Image src={assets.right_arrow} alt="Следующая глава" />
            </button>
          </Link>
        </div>
      )}

      <div className="my-24"></div>
    </div>
  );
}
