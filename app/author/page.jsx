"use client";

import Image from "next/image";
import { assets } from "/Assets/assets";
import Link from "next/link";

export default function AboutAuthor() {
  return (
    <>
      <div className="py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src={assets.logo}
              width={150}
              alt=""
              className="w-[130px] sm:w-auto"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row justify-center items-center text-justify sm:text-lg px-10">
        <Image
          src="/author_image.png"
          alt="Фото автора Нагирняк Михаил Павлович"
          width={350}
          height={350}
          className="rounded-full shadow-lg object-cover"
          placeholder="blur"
          blurDataURL="/author_image_min.png"
        />
        <div className="max-w-2xl leading-relaxed mb-15">
          <p className="lg:pt-15">
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
