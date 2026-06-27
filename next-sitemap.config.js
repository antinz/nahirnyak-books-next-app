/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://mihailnahirniak.blog",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/**", "/login"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/login", "/api/*"],
      },
    ],
    additionalSitemaps: ["https://mihailnahirniak.blog/sitemap-blogs.xml"],
  },
  // Генерация дополнительных URL для блогов и глав
  additionalPaths: async (config) => {
    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_URL || "https://mihailnahirniak.blog";
    const results = [];

    try {
      // Получаем все блоги
      const blogsRes = await fetch(`${BASE_URL}/api/blog`);
      const blogsData = await blogsRes.json();
      const blogs = blogsData.blogs || [];

      for (const blog of blogs) {
        // Добавляем страницу блога
        results.push({
          loc: `/blogs/${blog._id}`,
          changefreq: "weekly",
          priority: 0.8,
          lastmod: blog.date
            ? new Date(blog.date).toISOString()
            : new Date().toISOString(),
        });

        // Получаем главы этого блога
        try {
          const chaptersRes = await fetch(
            `${BASE_URL}/api/blog/chapter?id=${blog._id}&all=true`,
          );
          const chapters = await chaptersRes.json();
          if (Array.isArray(chapters)) {
            for (const chapter of chapters) {
              results.push({
                loc: `/blogs/${blog._id}/${chapter._id}`,
                changefreq: "monthly",
                priority: 0.6,
                lastmod: chapter.updatedAt
                  ? new Date(chapter.updatedAt).toISOString()
                  : new Date().toISOString(),
              });
            }
          }
        } catch {
          // Пропускаем если главы недоступны
        }
      }
    } catch (err) {
      console.warn("Sitemap: не удалось получить блоги:", err.message);
    }

    return results;
  },
};
