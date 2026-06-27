import BlogPageClient from "./BlogPageClient";
import { ConnectDB } from "../../../lib/config/db.js";
import BlogModel from "../../../lib/config/models/BlogModel.js";
import ChapterModel from "../../../lib/config/models/ChapterModel.js";

// Только для Google — лёгкий запрос напрямую в БД
async function getBlogMeta(id) {
  try {
    await ConnectDB();
    const blog = await BlogModel.findById(id)
      .select("title description image author date")
      .lean();
    return blog;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getBlogMeta(id);

  if (!data) return { title: "Книга не найдена" };

  const description = data.description
    ? data.description.replace(/<[^>]+>/g, "").slice(0, 160)
    : "Христианская книга Михаила Нагирняка";

  return {
    title: data.title,
    description,
    authors: [{ name: data.author }],
    alternates: {
      canonical: `https://mihailnahirniak.blog/blogs/${id}`,
    },
    openGraph: {
      title: data.title,
      description,
      url: `https://mihailnahirniak.blog/blogs/${id}`,
      type: "book",
      images: data.image
        ? [{ url: data.image, width: 1200, height: 630, alt: data.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: data.image ? [data.image] : [],
    },
  };
}

export default async function BlogPage({ params }) {
  const { id } = await params;
  return <BlogPageClient id={id} initialData={null} initialChapters={null} />;
}
