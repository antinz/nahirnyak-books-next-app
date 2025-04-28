import { assets } from "/Assets/assets";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

function Header() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);

      const res = await axios.post("/api/email", formData);
      if (res.data.success) {
        toast.success(res.data.message);
        setEmail("");
      } else {
        toast.error(res.data.message); // Handle the case when success is false
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        <Image
          src={assets.logo}
          alt="logo"
          width={150}
          height={150}
          className=" sm:w-auto"
        />
        <Link href="/author">
          <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-soli cursor-pointer shadow-[_7px_7px_0px_#000000]">
            Об авторе <Image src={assets.right_arrow} alt="" />
          </button>
        </Link>
      </div>
      <div className="text-center my-8 ">
        <h1 className="text-3xl sm:text-5xl font-medium">
          Книги Михаила Нагирняка
        </h1>
        <p className="mt-10 max-w-[740px] m-auto text-xs sm:text-base">
          На этом сайте вы сможете прочитать множество разобразных духовных
          книг!
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-[650px] sm:max-w-[500px]  scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[_7px_7px_0px_#000000]"
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Введите ваш email"
            className="pl-4 outline-none"
          />
          <button
            disabled={isLoading}
            type="submit"
            className="border-l border-black py-4 px-2 sm:px-8 active:bg-gray-600 active:text-white"
          >
            Подписаться
          </button>
        </form>
      </div>
    </div>
  );
}

export default Header;
