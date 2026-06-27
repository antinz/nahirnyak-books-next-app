import ChapterPageClient from "./ChapterPageClient";
import { ConnectDB } from "../../../../lib/config/db.js";
import ChapterModel from "../../../../lib/config/models/ChapterModel.js";

async function getChapterMeta(chapterId) {
  try {
    await ConnectDB();
    const chapter = await ChapterModel.findById(chapterId)
      .select("title content")
      .lean();
    return chapter;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id, chapterId } = await params;
  const chapter = await getChapterMeta(chapterId);

  if (!chapter) return { title: "Глава не найдена" };

  const description = chapter.content
    ? chapter.content.replace(/<[^>]+>/g, "").slice(0, 160)
    : `Глава: ${chapter.title}`;

  return {
    title: chapter.title,
    description,
    alternates: {
      canonical: `https://mihailnahirniak.blog/blogs/${id}/${chapterId}`,
    },
    openGraph: {
      title: chapter.title,
      description,
      url: `https://mihailnahirniak.blog/blogs/${id}/${chapterId}`,
      type: "article",
    },
  };
}

export default async function ChapterPage({ params }) {
  const { id, chapterId } = await params;
  return <ChapterPageClient id={id} chapterId={chapterId} initialData={null} />;
}
