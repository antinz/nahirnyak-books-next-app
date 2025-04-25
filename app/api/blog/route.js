import { ConnectDB } from "/lib/config/db.js";
import BlogModel from "/lib/config/models/BlogModel.js";
import { writeFile } from "fs/promises";
const fs = require("fs");

const { NextResponse } = require("next/server");
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

// API Endpoint to get all blogs
export async function GET(request) {
  try {
    const blogId = await request.nextUrl.searchParams.get("id");
    if (blogId) {
      const blog = await BlogModel.findById(blogId);
      return NextResponse.json(blog);
    } else {
      const blogs = await BlogModel.find({});
      blogs.reverse();
      return NextResponse.json({
        success: true,
        blogs,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// API endpoint for uploading blogs
export async function POST(request) {
  const formData = await request.formData();
  const timestamp = Date.now();
  const image = formData.get("image");
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${image.name}`;
  await writeFile(path, buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title: `${formData.get("title")}`,
    subTitle: `${formData.get("subTitle")}`,
    description: `${formData.get("description")}`,
    content: `${formData.get("content")}`,
    category: `${formData.get("category")}`,
    author: `${formData.get("author")}`,
    image: `${imgUrl}`,
    authorImg: `${formData.get("authorImg")}`,
  };

  await BlogModel.create(blogData);
  console.log("Blog Saved");
  return NextResponse.json({ success: true, message: "Blog Added" });
}

//API endpoint to delete blog

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public/${blog.image}`, () => {});
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "Blog Deleted" });
}
