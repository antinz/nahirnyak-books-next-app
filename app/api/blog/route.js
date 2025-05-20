import { ConnectDB } from "/lib/config/db.js";
import BlogModel from "/lib/config/models/BlogModel.js";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API Endpoint to get blogs
export async function GET(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
      const blog = await BlogModel.findById(blogId);
      return NextResponse.json(blog);
    } else {
      const blogs = await BlogModel.find({});
      blogs.reverse();
      return NextResponse.json({ success: true, blogs });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

// API endpoint to upload blog
export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json({
        success: false,
        message: "No image uploaded",
      });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const imgUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    const blogData = {
      title: formData.get("title"),
      subTitle: formData.get("subTitle"),
      description: formData.get("description"),
      content: formData.get("content"),
      category: formData.get("category"),
      pdfUrl: formData.get("pdfUrl"),
      author: formData.get("author"),
      authorImg: formData.get("authorImg"),
      image: imgUrl,
      imagePublicId: publicId,
      date: Date.now(),
      footnotes: JSON.parse(formData.get("footnotes") || "[]"),
    };

    await BlogModel.create(blogData);

    return NextResponse.json({
      success: true,
      message: "Книга успешно добавлена",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

// API endpoint to delete blog
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" });
    }

    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Книга удалена" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PUT(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");
    if (!blogId) {
      return NextResponse.json(
        { success: false, message: "ID блога не предоставлен" },
        { status: 400 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const updateFields = {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.content && { content: body.content }),
        ...(body.category && { category: body.category }),
        ...(body.subTitle && { subTitle: body.subTitle }),
      };

      const updatedBlog = await BlogModel.findByIdAndUpdate(
        blogId,
        updateFields,
        { new: true }
      );
      return updatedBlog
        ? NextResponse.json({ success: true, updatedBlog })
        : NextResponse.json(
            { success: false, message: "Блог не найден" },
            { status: 404 }
          );
    }

    // Handle multipart/form-data
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const content = formData.get("content");
    const image = formData.get("image");
    const category = formData.get("category");
    const subTitle = formData.get("subTitle");

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Блог не найден" },
        { status: 404 }
      );
    }

    const updateFields = { title, description, content, category, subTitle };

    // If new image provided
    if (image && typeof image === "object") {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Remove old image if exists
      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      updateFields.image = uploadResult.secure_url;
      updateFields.imagePublicId = uploadResult.public_id;
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      updateFields,
      { new: true }
    );

    return NextResponse.json({ success: true, updatedBlog });
  } catch (error) {
    console.error("PUT Blog Error:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка при обновлении блога" },
      { status: 500 }
    );
  }
}
