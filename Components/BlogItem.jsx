"use client";

import { assets } from "../Assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommentsModal from "./CommentsModal";

// Получаем или создаём уникальный fingerprint для этого браузера
const getFingerprint = () => {
  let fp = localStorage.getItem("_fp");

  if (!fp) {
    fp =
      (typeof crypto !== "undefined" &&
        crypto.randomUUID &&
        crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    localStorage.setItem("_fp", fp);
  }

  return fp;
};

function BlogItem({
  title,
  category,
  image,
  id,
  pdfUrl,
  views: initialViews = 0,
  likes: initialLikes = 0,
  commentsCount: initialCommentsCount = 0,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [views, setViews] = useState(initialViews);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [showComments, setShowComments] = useState(false);

  // При монтировании — получаем актуальные данные и статус лайка для этого юзера
  useEffect(() => {
    const fp = getFingerprint();
    if (!fp || !id) return;

    axios
      .get(`/api/blog/interact?id=${id}&fingerprint=${fp}`)
      .then((res) => {
        if (res.data.success) {
          setViews(res.data.views);
          setLikes(res.data.likes);
          setIsLiked(res.data.isLiked);
        }
      })
      .catch(() => {});

    // Получаем кол-во комментариев
    axios
      .get(`/api/blog/comments?blogId=${id}`)
      .then((res) => {
        if (res.data.success) {
          setCommentsCount(res.data.comments.length);
        }
      })
      .catch(() => {});
  }, [id]);

  const handleLike = useCallback(async () => {
    if (likeLoading) return;
    const fp = getFingerprint();
    if (!fp) return;

    setLikeLoading(true);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const res = await axios.patch(`/api/blog/interact?id=${id}&action=like`, {
        fingerprint: fp,
      });
      if (res.data.success) {
        setLikes(res.data.likes);
        setIsLiked(res.data.isLiked);
      }
    } catch {
      setIsLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  }, [id, isLiked, likeLoading]);

  function getDriveDownloadLink(shareUrl) {
    if (!shareUrl) return null;
    const match = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match?.[1]
      ? `https://drive.google.com/uc?export=download&id=${match[1]}`
      : shareUrl;
  }

  return (
    <>
      <div className="max-w-[330px] sm:max-w-[300px] w-full bg-white border border-black hover:shadow-[_7px_7px_0px_#000000] flex flex-col h-[430px]">
        <div className="relative w-full h-[230px]">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              className="object-cover w-full h-full border-black border-b"
              priority
            />
          )}

          {category === "Беседы о воле Божией" && (
            <span className="absolute top-5 left-0 bg-opacity-60 text-white font-extrabold text-3xl md:text-3xl p-2 w-full text-center uppercase">
              {title}
            </span>
          )}
          {category === "Проповеди и статьи" && (
            <span className="absolute top-5 left-0 bg-opacity-60 text-white font-extrabold text-2xl md:text-2xl p-2 w-full text-center italic uppercase">
              {title}
            </span>
          )}
          {category === "Видео-проповеди" && (
            <span className="absolute top-5 left-0 bg-opacity-60 text-white font-extrabold text-2xl md:text-2xl p-2 w-full text-center italic uppercase">
              {title}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-between flex-grow p-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="inline-block bg-black text-white text-sm px-2 py-1">
                {category}
              </p>
            </div>

            <h5 className="mb-1 text-lg font-medium tracking-tight text-gray-900 uppercase line-clamp-2 break-words">
              {title}
            </h5>
          </div>

          <div className="flex items-center justify-between mt-2">
            <Link
              href={`/blogs/${id}`}
              className="inline-flex items-center font-semibold text-center"
            >
              {category === "Видео-проповеди" ? "Смотреть " : "Читать "}
              <Image
                src={assets.right_arrow}
                alt=">"
                width={12}
                className="ml-2"
              />
            </Link>

            {/* Лайки, просмотры, комментарии, PDF */}
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              {/* Лайки */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                title={isLiked ? "Убрать лайк" : "Нравится"}
                className="flex items-center gap-1 transition-transform active:scale-125 disabled:opacity-60 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "#ef4444" : "none"}
                  stroke={isLiked ? "#ef4444" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-200"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likes}
              </button>
              {/* Комментарии */}
              <button
                onClick={() => setShowComments(true)}
                title="Комментарии"
                className="flex items-center gap-1 hover:text-black transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {commentsCount}
              </button>

              {/* Просмотры */}
              <span className="flex items-center gap-1" title="Просмотры">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {views}
              </span>

              {/* PDF скачать */}
              {pdfUrl && (
                <a
                  href={getDriveDownloadLink(pdfUrl)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  title="Скачать книгу в PDF"
                >
                  <Image src={assets.download} alt="Скачать PDF" width={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно комментариев */}
      {showComments && (
        <CommentsModal
          blogId={id}
          onClose={() => setShowComments(false)}
          onCountChange={setCommentsCount}
        />
      )}
    </>
  );
}

export default BlogItem;
