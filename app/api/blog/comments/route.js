// app/api/blog/comments/route.js

import { ConnectDB } from "../../../../lib/config/db.js";
import CommentModel from "../../../../lib/config/models/CommentModel.js";
import { NextResponse } from "next/server";

// GET /api/blog/comments?blogId=<id>
// Получить все комментарии к книге
export async function GET(request) {
  await ConnectDB();
  try {
    const blogId = request.nextUrl.searchParams.get("blogId");
    if (!blogId) {
      return NextResponse.json(
        { success: false, message: "Missing blogId" },
        { status: 400 },
      );
    }

    const comments = await CommentModel.find({ blogId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// POST /api/blog/comments?blogId=<id>
// Добавить комментарий
// Body: { name?: string, text: string }
export async function POST(request) {
  await ConnectDB();
  try {
    const blogId = request.nextUrl.searchParams.get("blogId");
    if (!blogId) {
      return NextResponse.json(
        { success: false, message: "Missing blogId" },
        { status: 400 },
      );
    }

    const { name, text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Текст комментария не может быть пустым" },
        { status: 400 },
      );
    }

    if (text.trim().length > 1000) {
      return NextResponse.json(
        { success: false, message: "Комментарий слишком длинный (макс. 1000 символов)" },
        { status: 400 },
      );
    }

    const comment = await CommentModel.create({
      blogId,
      name: name?.trim() || "Аноним",
      text: text.trim(),
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/blog/comments?commentId=<id>
// Удалить комментарий (из админки)
export async function DELETE(request) {
  await ConnectDB();
  try {
    const commentId = request.nextUrl.searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json(
        { success: false, message: "Missing commentId" },
        { status: 400 },
      );
    }

    await CommentModel.findByIdAndDelete(commentId);
    return NextResponse.json({ success: true, message: "Комментарий удалён" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
