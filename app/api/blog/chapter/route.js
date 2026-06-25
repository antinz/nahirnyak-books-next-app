import { ConnectDB } from "../../../../lib/config/db.js";
import ChapterModel from "../../../../lib/config/models/ChapterModel.js";
import { normalizeHtml } from "../../../../utils/normalizeHtml.js";

const { NextResponse } = require("next/server");
export async function GET(request) {
  await ConnectDB();
  try {
    const url = request.nextUrl;
    const blogId = url.searchParams.get("id");
    const chapterId = url.searchParams.get("chapterId");
    const latest = url.searchParams.get("latest");
    const all = url.searchParams.get("all");

    // ✅ Return only the last chapter number for a blog
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

    // ✅ Return only all chapters for a blog (used for sidebar)
    if (all === "true" && blogId) {
      const chapters = await ChapterModel.find({ blogId }).sort(
        "chapterNumber",
      );
      return NextResponse.json(chapters);
    }

    // ✅ Return a specific chapter with navigation
    if (chapterId) {
      const chapter = await ChapterModel.findById(chapterId);

      const [nextChapter, prevChapter, firstChapter, lastChapter] =
        await Promise.all([
          ChapterModel.findOne({
            blogId,
            chapterNumber: chapter.chapterNumber + 1,
          }),
          ChapterModel.findOne({
            blogId,
            chapterNumber: chapter.chapterNumber - 1,
          }),
          ChapterModel.findOne({ blogId }).sort({ chapterNumber: 1 }),
          ChapterModel.findOne({ blogId }).sort({ chapterNumber: -1 }),
        ]);

      return NextResponse.json({
        currentChapter: chapter,
        nextChapter,
        prevChapter,
        firstChapter,
        lastChapter,
      });
    }

    // ✅ Return all chapters (fallback if no query provided)
    const chapters = await ChapterModel.find();
    return NextResponse.json({
      success: true,
      chapters,
      firstChapter: { _id: null, isBlogIntro: true },
    });
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
  await ConnectDB();
  try {
    const body = await request.json();
    const { blogId, title, content, blogTitle, footnotes } = body;

    const latestChapter = await ChapterModel.findOne({ blogId }).sort({
      chapterNumber: -1,
    });
    const chapterNumber = latestChapter ? latestChapter.chapterNumber + 1 : 1;

    const newChapter = await ChapterModel.create({
      blogId,
      blogTitle,
      title,
      content: normalizeHtml(content),
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
      { status: 500 },
    );
  }
}

//API endpoint to delete blog

export async function DELETE(request) {
  await ConnectDB();
  try {
    const chapterId = request.nextUrl.searchParams.get("id");

    if (!chapterId) {
      return NextResponse.json(
        { success: false, message: "ID главы не предоставлен" },
        { status: 400 },
      );
    }

    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      return NextResponse.json(
        { success: false, message: "Глава не найдена" },
        { status: 404 },
      );
    }

    await ChapterModel.findByIdAndDelete(chapterId);
    return NextResponse.json({ success: true, message: "Глава удалена" });
  } catch (error) {
    console.error("Ошибка при удалении главы:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера при удалении главы" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  await ConnectDB();
  try {
    const chapterId = request.nextUrl.searchParams.get("id");
    const body = await request.json();

    const updatedChapter = await ChapterModel.findByIdAndUpdate(
      chapterId,
      {
        title: body.title,
        content: normalizeHtml(body.content),
        blogId: body.blogId,
        blogTitle: body.blogTitle,
        chapterNumber: body.chapterNumber,
        footnotes: body.footnotes,
      },
      { new: true },
    );

    if (!updatedChapter) {
      return NextResponse.json(
        { success: false, message: "Глава не найдена" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, updatedChapter });
  } catch (error) {
    console.error("PUT Chapter Error:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка при обновлении главы" },
      { status: 500 },
    );
  }
}
