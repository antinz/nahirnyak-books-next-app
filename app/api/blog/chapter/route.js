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
    const url = request.nextUrl;
    const blogId = url.searchParams.get("id");
    const chapterId = url.searchParams.get("chapterId");
    const latest = url.searchParams.get("latest");

    if (latest && blogId) {
      const latestChapter = await ChapterModel.findOne({ blogId })
        .sort({ chapterNumber: -1 })
        .select("chapterNumber");

      const lastNumber = latestChapter ? latestChapter.chapterNumber : 0;

      return NextResponse.json({
        success: true,
        lastChapterNumber: lastNumber,
      });
    }

    if (chapterId) {
      const chapter = await ChapterModel.findById(chapterId);

      const nextChapter = await ChapterModel.findOne({
        blogId,
        chapterNumber: chapter.chapterNumber + 1,
      });

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
    const { blogId, title, content, blogTitle, footnotes } = body;

    const latestChapter = await ChapterModel.findOne({ blogId }).sort({
      chapterNumber: -1,
    });
    const chapterNumber = latestChapter ? latestChapter.chapterNumber + 1 : 1;

    const existingChapter = await ChapterModel.findOne({
      blogId,
      chapterNumber,
    });

    if (existingChapter) {
      return NextResponse.json({
        success: false,
        message: `Глава №${chapterNumber} уже существует для этой книги.`,
      });
    }

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
  try {
    const chapterId = request.nextUrl.searchParams.get("id");

    if (!chapterId) {
      return NextResponse.json(
        { success: false, message: "ID главы не предоставлен" },
        { status: 400 }
      );
    }

    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      return NextResponse.json(
        { success: false, message: "Глава не найдена" },
        { status: 404 }
      );
    }

    await ChapterModel.findByIdAndDelete(chapterId);
    return NextResponse.json({ success: true, message: "Глава удалена" });
  } catch (error) {
    console.error("Ошибка при удалении главы:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера при удалении главы" },
      { status: 500 }
    );
  }
}
