"use client";
import { assets } from "../Assets/assets";
import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="py-1 px-4 sm:px-6 md:px-12 lg:px-28">
      <div className="flex justify-start items-center">
        <Image src={assets.logo} alt="logo" width={150} height={150} />
      </div>

      <div className="text-center sm:mt-1 mb-8">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium leading-tight">
          Книги Михаила Нагирняка
        </h1>
        <p className="mt-6 italic font-semibold sm:mt-10 max-w-[740px] mx-auto text-sm sm:text-xl px-2">
          На этой странице опубликованы христианские книги и статьи!
        </p>
      </div>
    </div>
  );
}

export default Header;
