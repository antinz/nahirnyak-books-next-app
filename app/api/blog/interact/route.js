// app/api/blog/interact/route.js
// Отдельный роут для просмотров и лайков

import { ConnectDB } from "../../../../lib/config/db.js";
import BlogModel from "../../../../lib/config/models/BlogModel.js";
import { NextResponse } from "next/server";

// PATCH /api/blog/interact?id=<blogId>&action=view|like
// Body: { fingerprint: "uuid" }
export async function PATCH(request) {
  await ConnectDB();

  try {
    const blogId = request.nextUrl.searchParams.get("id");
    const action = request.nextUrl.searchParams.get("action"); // "view" или "like"

    if (!blogId || !action) {
      return NextResponse.json(
        { success: false, message: "Missing id or action" },
        { status: 400 },
      );
    }

    const { fingerprint } = await request.json();

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, message: "Missing fingerprint" },
        { status: 400 },
      );
    }

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    if (action === "view") {
      // Добавляем fingerprint только если его ещё нет
      if (!blog.uniqueViewers.includes(fingerprint)) {
        await BlogModel.findByIdAndUpdate(blogId, {
          $addToSet: { uniqueViewers: fingerprint },
        });
      }

      const updated = await BlogModel.findById(blogId).select(
        "uniqueViewers likedBy",
      );
      return NextResponse.json({
        success: true,
        views: updated.uniqueViewers.length,
        likes: updated.likedBy.length,
        isLiked: updated.likedBy.includes(fingerprint),
      });
    }

    if (action === "like") {
      const alreadyLiked = blog.likedBy.includes(fingerprint);

      if (alreadyLiked) {
        // Убираем лайк (toggle)
        await BlogModel.findByIdAndUpdate(blogId, {
          $pull: { likedBy: fingerprint },
        });
      } else {
        // Ставим лайк
        await BlogModel.findByIdAndUpdate(blogId, {
          $addToSet: { likedBy: fingerprint },
        });
      }

      const updated = await BlogModel.findById(blogId).select("likedBy");
      return NextResponse.json({
        success: true,
        likes: updated.likedBy.length,
        isLiked: !alreadyLiked,
      });
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Interact error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// GET /api/blog/interact?id=<blogId>&fingerprint=<fp>
// Получить текущие просмотры, лайки и статус лайка для этого юзера
export async function GET(request) {
  await ConnectDB();

  try {
    const blogId = request.nextUrl.searchParams.get("id");
    const fingerprint = request.nextUrl.searchParams.get("fingerprint");

    if (!blogId) {
      return NextResponse.json(
        { success: false, message: "Missing id" },
        { status: 400 },
      );
    }

    const blog = await BlogModel.findById(blogId).select(
      "uniqueViewers likedBy",
    );
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      views: blog.uniqueViewers.length,
      likes: blog.likedBy.length,
      isLiked: fingerprint ? blog.likedBy.includes(fingerprint) : false,
    });
  } catch (error) {
    console.error("Get interact error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
