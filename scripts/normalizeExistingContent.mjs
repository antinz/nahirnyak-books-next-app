/**
 * Одноразовая миграция: чистит уже сохранённые в БД главы и книги от
 * неразрывных пробелов (&nbsp; / U+00A0) и невидимых символов, из-за которых
 * слова рвались посередине при рендеринге («местно-сти», «синкретиз-м»).
 *
 * Запуск:
 *   MONGODB_URI="<строка-подключения>" node scripts/normalizeExistingContent.mjs
 *
 * Сначала прогон вхолостую (ничего не пишет, только показывает, что изменится):
 *   MONGODB_URI="..." node scripts/normalizeExistingContent.mjs --dry-run
 */
import mongoose from "mongoose";
import { normalizeHtml } from "../utils/normalizeHtml.js";
import ChapterModel from "../lib/config/models/ChapterModel.js";
import BlogModel from "../lib/config/models/BlogModel.js";

const DRY_RUN = process.argv.includes("--dry-run");
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Не задана переменная окружения MONGODB_URI");
  process.exit(1);
}

function changed(before, after) {
  return typeof before === "string" && before !== after;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Подключено к БД${DRY_RUN ? " (режим dry-run)" : ""}`);

  let chaptersFixed = 0;
  let blogsFixed = 0;

  // --- Главы ---
  const chapters = await ChapterModel.find({});
  for (const ch of chapters) {
    const cleaned = normalizeHtml(ch.content);
    if (changed(ch.content, cleaned)) {
      chaptersFixed++;
      console.log(`  Глава "${ch.title}" (${ch._id}) — будет очищена`);
      if (!DRY_RUN) {
        ch.content = cleaned;
        await ch.save();
      }
    }
  }

  // --- Книги (content + description) ---
  const blogs = await BlogModel.find({});
  for (const blog of blogs) {
    const cleanedContent = normalizeHtml(blog.content);
    const cleanedDesc = normalizeHtml(blog.description);
    const contentChanged = changed(blog.content, cleanedContent);
    const descChanged = changed(blog.description, cleanedDesc);

    if (contentChanged || descChanged) {
      blogsFixed++;
      console.log(`  Книга "${blog.title}" (${blog._id}) — будет очищена`);
      if (!DRY_RUN) {
        if (contentChanged) blog.content = cleanedContent;
        if (descChanged) blog.description = cleanedDesc;
        await blog.save();
      }
    }
  }

  console.log(
    `\nГотово. Глав ${DRY_RUN ? "к очистке" : "очищено"}: ${chaptersFixed}, ` +
      `книг ${DRY_RUN ? "к очистке" : "очищено"}: ${blogsFixed}.`,
  );
  if (DRY_RUN) console.log("Это был dry-run — изменения НЕ сохранены.");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Ошибка миграции:", err);
  process.exit(1);
});
