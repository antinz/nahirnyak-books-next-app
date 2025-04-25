import { assets } from "/Assets/assets";
import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <div className="flex justify-between px-20 flex-col gap-2 sm:gap-0 sm:flex-row bg-black py-1 items-center">
      <Image src={assets.logo_light} alt="" width={80} />
      <p className="text-sm text-white">
        Все права защищены. Copyright @Nahirniak
      </p>
    </div>
  );
}

export default Footer;
