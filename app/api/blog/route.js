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

    // Delete image from Cloudinary
    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Книга удалена" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
