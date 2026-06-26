import { assets } from "../../Assets/assets";
import Image from "next/image";
import React from "react";

function BlogTableItem({
  authorImg,
  title,
  author,
  date,
  deleteBlog,
  mongoId,
  onViewComments,
}) {
  const blogDate = new Date(date);
  return (
    <tr className="bg-white border-b">
      <th
        scope="row"
        className="items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        <Image
          src={authorImg ? authorImg : assets.profile_icon}
          width={40}
          height={40}
          alt=""
        />
        <p>{author ? author : "N/A"}</p>
      </th>
      <td className="px-6 py-4">{title ? title : "no title"}</td>
      <td className="px-6 py-4">{blogDate.toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Кнопка комментариев */}
          <button
            onClick={onViewComments}
            title="Комментарии"
            className="text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          {/* Удалить */}
          <button
            onClick={() => deleteBlog(mongoId)}
            title="Удалить книгу"
            className="text-red-400 hover:text-red-600 font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}

export default BlogTableItem;
