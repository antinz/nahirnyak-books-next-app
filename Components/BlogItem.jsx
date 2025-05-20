import { assets } from "/Assets/assets";
import Image from "next/image";
import Link from "next/link";

function BlogItem({ title, category, image, id, pdfUrl }) {
  return (
    <div className="max-w-[330px] sm:max-w-[300px] w-full bg-white border border-black hover:shadow-[_7px_7px_0px_#000000] flex flex-col h-[430px]">
      <Link href={`/blogs/${id}`}>
        <div className="relative w-full h-[230px]">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              className="object-cover w-full h-full border-black border-b"
              priority
            />
          ) : null}

          {category === "Беседы о воле Божией" && (
            <span className="absolute top-5 left-0 bg-opacity-60 text-white font-extrabold text-3xl md:text-3xl p-2 w-full text-center uppercase">
              {title}
            </span>
          )}
          {category === "Проповеди и статьи" && (
            <span className="absolute top-5 left-0 bg-opacity-60 text-white font-extrabold text-2xl md:text-2xl p-2 w-full text-center italic uppercase">
              {title}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-col justify-between flex-grow p-6">
        <div>
          <p className="mb-3 inline-block bg-black text-white text-sm px-2 py-1">
            {category}
          </p>
          <h5 className="mb-1 text-lg font-medium tracking-tight text-gray-900 uppercase line-clamp-2">
            {title}
          </h5>
        </div>

        <div className="flex items-center justify-between mt-2">
          <Link
            href={`/blogs/${id}`}
            className="inline-flex items-center font-semibold text-center"
          >
            Читать{" "}
            <Image
              src={assets.right_arrow}
              alt=">"
              width={12}
              className="ml-2"
            />
          </Link>
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
              title="Открыть книгу в PDF"
            >
              <Image src={assets.download} alt="Читать PDF" width={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogItem;
