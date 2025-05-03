import React from "react";

function ChapterTableItem({ title, date, deleteChapter, mongoId, blogTitle }) {
  const chapterDate = new Date(date);
  return (
    <tr className="bg-white border-b ">
      <th
        scope="row"
        className="items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        <p>{blogTitle ? blogTitle : "N/A"}</p>
      </th>

      <td className="px-6 py-4">{title ? title : "no title"}</td>
      <td className="px-6 py-4">{chapterDate.toLocaleDateString()}</td>
      <td
        className="px-6 py-4 cursor-pointer"
        onClick={() => deleteChapter(mongoId, title)}
      >
        X
      </td>
    </tr>
  );
}

export default ChapterTableItem;
