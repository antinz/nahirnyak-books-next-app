"use client";

import { assets } from "/Assets/assets";
import Footer from "/Components/Footer.jsx";
import LoadingSpinner from "/Components/LoadingSpinner.jsx";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

function Page({ params }) {
  const unwrappedParams = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapterData, setChapterData] = useState(null);

  const fetchBlogData = async () => {
    const res = await axios.get("/api/blog", {
      params: {
        id: unwrappedParams.id,
      },
    });
    setData(res.data);
  };

  const fetchChapters = async () => {
    try {
      const res = await axios.get("/api/blog/chapter", {
        params: {
          id: unwrappedParams.id,
          chapterId: unwrappedParams.chapterId,
        },
      });
      setChapterData(res.data);
    } catch (err) {
      console.error("Failed to load chapter", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchChapters();
  }, []);

  useEffect(() => {
    fetchBlogData();
    setLoading(false);
  }, []);

  const prefix = "Послание к";
  let displayTitle = data?.title;
  if (displayTitle && displayTitle.includes(prefix)) {
    displayTitle = displayTitle.split(new RegExp(`\\s*${prefix}\\s*`))[1];
  }

  return loading ? (
    <LoadingSpinner loading={loading} />
  ) : data ? (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
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
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          <h3 className="text-base italic sm:text-2xl font-semibold max-w-[700px] mx-auto">
            {data.subTitle}
          </h3>
          <Image
            className="mx-auto mt-6 border border-white rounded-full"
            src={data.authorImg}
            width={60}
            height={60}
            alt="Автор"
          />
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>
      </div>
      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <div className="relative">
          <Image
            src={data.image}
            width={1280}
            height={720}
            alt=""
            className="border-4 border-white w-full h-auto sm:h-[550px] object-cover"
            priority
          />
          {data.category === "Беседы о воле Божией" && (
            <span className="absolute md:top-35 lg:top-40 sm:30 top-22 left-0 bg-opacity-60 text-white font-extrabold text-xl sm:text-3xl md:text-4xl lg:text-5xl p-2 w-full text-center uppercase">
              {displayTitle}
            </span>
          )}
        </div>
        <div
          className="blog-description px-4 sm:px-6 md:px-8 lg:px-0"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
        <div
          className="blog-content mt-8 px-4 sm:px-6 md:px-8 lg:px-0 text-sm text-justify hyphens-auto sm:text-start sm:text-base leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        ></div>

        {chapterData && chapterData.length > 0 && (
          <div className="text-center mt-10">
            <Link href={`/blogs/${unwrappedParams.id}/${chapterData[0]._id}`}>
              <button className="flex items-center bg-white gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black cursor-pointer shadow-[_7px_7px_0px_#000000]">
                Читать далее <Image src={assets.right_arrow} alt="" />
              </button>
            </Link>
          </div>
        )}

        <div className="my-24"></div>
      </div>
      <Footer />
    </>
  ) : (
    <></>
  );
}

export default Page;
