import { assets } from "/Assets/assets";
import Image from "next/image";
import Link from "next/link";

function BlogItem({ title, content, category, image, id, pdfUrl }) {
  return (
    <div className="max-w-[330px] sm:max-w-[300px] w-full bg-white border border-black hover:shadow-[_7px_7px_0px_#000000] flex flex-col h-[530px]">
      <Link href={`/blogs/${id}`}>
        <Image
          src={image}
          alt=""
          width={400}
          height={230}
          className="border-black border-b w-full h-[230px] object-cover"
          priority
        />
      </Link>

      <div className="flex flex-col justify-between flex-grow p-5">
        <div>
          <p className="mb-3 inline-block bg-black text-white text-sm px-2 py-1">
            {category}
          </p>
          <h5 className="mb-2 text-lg font-medium tracking-tight text-gray-900 uppercase line-clamp-2">
            {title}
          </h5>
          <p
            className="text-sm text-gray-700 break-words line-clamp-3"
            dangerouslySetInnerHTML={{ __html: content.slice(0, 200) + "..." }}
          ></p>
        </div>

        <div className="flex items-center justify-between mt-5">
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
