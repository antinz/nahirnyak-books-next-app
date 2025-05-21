import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Книги Михаила Нагирняка",
  description:
    "Христианские книги, основанные на баптистском вероучении. Глубокие библейские размышления, духовное наставление и вдохновляющие тексты для укрепления веры",
  keywords: [
    "христианские книги",
    "баптисты",
    "библейские главы",
    "духовное наставление",
    "христианская литература",
  ],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${outfit.variable}`}>{children}</body>
    </html>
  );
}
