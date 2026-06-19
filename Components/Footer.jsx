import { assets } from "../Assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white py-4 px-6 sm:px-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Logo */}
        <Image src={assets.logo_light} alt="Логотип" width={80} />

        {/* Copyright Text */}
        <p className="text-xs sm:text-sm">
          Все права защищены. Copyright @Nahirniak
        </p>

        {/* About Button */}
        <Link href="/author">
          <button className="flex items-center gap-1 py-2 px-2 sm:py-3 sm:px-6 border border-white bg text-white cursor-pointer shadow-[_5px_5px_0px_#ffffff] hover:bg-white hover:border-black hover:text-black transition text-xs sm:text-sm">
            Об авторе
          </button>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
