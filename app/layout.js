import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = "https://mihailnahirniak.blog";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Книги Михаила Нагирняка",
    template: "%s | Михаил Нагирняк",
  },
  description:
    "Христианские книги, основанные на баптистском вероучении. Глубокие библейские размышления, духовное наставление и вдохновляющие тексты для укрепления веры.",
  keywords: [
    "христианские книги",
    "баптисты",
    "библейские главы",
    "духовное наставление",
    "христианская литература",
    "Нагирняк",
    "евангельские христиане",
    "проповеди",
  ],
  authors: [{ name: "Михаил Нагирняк", url: `${BASE_URL}/author` }],
  creator: "Михаил Нагирняк",
  publisher: "Михаил Нагирняк",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_UA",
    url: BASE_URL,
    siteName: "Книги Михаила Нагирняка",
    title: "Книги Михаила Нагирняка",
    description:
      "Христианские книги, основанные на баптистском вероучении. Глубокие библейские размышления и духовное наставление.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Книги Михаила Нагирняка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Книги Михаила Нагирняка",
    description:
      "Христианские книги, основанные на баптистском вероучении.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
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
