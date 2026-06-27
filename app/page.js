import Footer from "../Components/Footer";
import Header from "../Components/Header";
import BlogList from "../Components/BlogList";

export const metadata = {
  title: "Книги Михаила Нагирняка — Христианская литература",
  description:
    "Читайте христианские книги и проповеди Михаила Нагирняка онлайн. Духовные размышления, библейские главы и наставления на основе баптистского вероучения.",
  alternates: {
    canonical: "https://mihailnahirniak.blog",
  },
  openGraph: {
    url: "https://mihailnahirniak.blog",
    type: "website",
  },
};

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
    next: { revalidate: 120 },
  });
  const data = await res.json();
  return data.blogs || [];
}

export default async function Home() {
  const blogs = await getBlogs();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <BlogList blogs={blogs} />
      </main>
      <Footer />
    </div>
  );
}
