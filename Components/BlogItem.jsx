import { assets } from "/Assets/assets";
import Image from "next/image";
import Link from "next/link";

function BlogItem({ title, content, category, image, id, pdfUrl }) {
  return (
    <div className="max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[_7px_7px_0px_#000000] sm:w-full w-full">
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
      <p className="ml-5 mt-5 px-1 inline-block bg-black text-white text-sm">
        {category}
      </p>
      <div className="p-5">
        <h5 className="mb-2 text-lg font-medium tracking-tight text-gray-900 uppercase">
          {title}
        </h5>
        <p
          className="mb-3 text-sm text-gray-700 break-words"
          dangerouslySetInnerHTML={{ __html: content.slice(0, 200) + "..." }}
        ></p>
        <div className="flex sm:flex-row items-center justify-between gap-3">
          <Link
            href={`/blogs/${id}`}
            className="inline-flex items-center py-2 font-semibold text-center"
          >
            Читать{" "}
            <Image
              src={assets.right_arrow}
              alt=""
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
