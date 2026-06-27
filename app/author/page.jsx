import Image from "next/image";
import Link from "next/link";
import { assets } from "../../Assets/assets";

export const metadata = {
  title: "Об авторе — Нагирняк Михаил Павлович",
  description:
    "Михаил Павлович Нагирняк — пресвитер, пастор церкви евангельских христиан-баптистов, магистр церковного служения. Автор христианских книг и проповедей.",
  alternates: {
    canonical: "https://mihailnahirniak.blog/author",
  },
  openGraph: {
    title: "Об авторе — Нагирняк Михаил Павлович",
    description:
      "Пастор церкви евангельских христиан-баптистов, автор христианских книг.",
    url: "https://mihailnahirniak.blog/author",
    type: "profile",
    images: [
      {
        url: "/author_image.png",
        width: 300,
        height: 300,
        alt: "Нагирняк Михаил Павлович",
      },
    ],
  },
};

export default function AboutAuthor() {
  return (
    <>
      <div className="py-5 px-4 sm:px-6 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src={assets.logo}
              width={150}
              alt="Логотип"
              className="w-[120px] sm:w-[150px]"
            />
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-4 sm:px-10 py-10 text-justify">
        <Image
          src="/author_image.png"
          alt="Фото автора Нагирняк Михаил Павлович"
          width={300}
          height={300}
          className="rounded-full shadow-lg object-cover w-[200px] sm:w-[300px] h-auto"
          placeholder="blur"
          blurDataURL="/author_image_min.png"
        />

        <div className="max-w-2xl leading-relaxed text-sm sm:text-base lg:text-lg">
          <h1 className="text-2xl font-bold mb-4">Нагирняк Михаил Павлович</h1>
          <p>
            <strong>Нагирняк Михаил Павлович</strong>, пресвитер, пастор церкви
            евангельских христиан-баптистов. Начинал свое пасторское служение в
            церкви ЕХБ «Пробуждение» г. Енакиево, Донецкой области. В дальнейшем
            совершал служение в церкви «Голгофа» г. Енакиево. Кроме этого,
            принимал участие в работе Областного Объединения ЕХБ Донецкой
            области сначала в качестве члена Пресвитерского Совета и
            Исполнительного Секретаря Объединения, а затем Заместителя Старшего
            Пресвитера. Магистр церковного служения.
          </p>
          <br />
          <p>
            В настоящее время проживает в селе Гениевка Харьковской области, где
            автор вынужден находиться как странник и пришелец.
          </p>
        </div>
      </div>
    </>
  );
}
