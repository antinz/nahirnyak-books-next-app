import { ConnectDB } from "/lib/config/db.js";
import ChapterModel from "/lib/config/models/ChapterModel.js";

const { NextResponse } = require("next/server");
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

// API Endpoint to get all book chapters
export async function GET(request) {
  try {
    const blogId = await request.nextUrl.searchParams.get("id");
    const chapterId = await request.nextUrl.searchParams.get("chapterId");

    if (chapterId) {
      // Fetch current chapter by its _id
      const chapter = await ChapterModel.findById(chapterId);

      const nextChapter = await ChapterModel.findOne({
        blogId,
        chapterNumber: chapter.chapterNumber + 1,
      });

      // Fetch the previous chapter by chapterNumber
      const prevChapter = await ChapterModel.findOne({
        blogId,
        chapterNumber: chapter.chapterNumber - 1,
      });

      return NextResponse.json({
        currentChapter: chapter,
        nextChapter,
        prevChapter,
      });
    } else if (blogId) {
      const chapters = await ChapterModel.find({ blogId }).sort(
        "chapterNumber"
      );
      return NextResponse.json(chapters);
    } else {
      const chapters = await ChapterModel.find();
      return NextResponse.json(chapters);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

// API endpoint for uploading book chapters
export async function POST(request) {
  try {
    const body = await request.json();
    const { blogId, title, content, chapterNumber, blogTitle, footnotes } =
      body;

    const newChapter = await ChapterModel.create({
      blogId,
      blogTitle,
      title,
      content,
      chapterNumber,
      footnotes,
    });

    return NextResponse.json({
      success: true,
      newChapter,
    });
  } catch (error) {
    console.error("POST Chapter Error:", error);
    return NextResponse.json(
      { error: "Ошибка при добавлении главы" },
      { status: 500 }
    );
  }
}

//API endpoint to delete blog

export async function DELETE(request) {
  const chapterId = await request.nextUrl.searchParams.get("id");
  const chapter = await ChapterModel.findById(chapterId);
  await ChapterModel.findByIdAndDelete(chapter);
  return NextResponse.json({ message: "Глава удалена" });
}
