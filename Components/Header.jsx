import { assets } from "../Assets/assets";
import axios from "axios";
import Image from "next/image";
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
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-1 px-4 sm:px-6 md:px-12 lg:px-28">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Image src={assets.logo} alt="logo" width={150} height={150} />
        <form
          onSubmit={onSubmitHandler}
          className="flex hidden sm:block flex-col sm:flex-row items-stretch sm:items-center max-w-[650px] border border-black shadow-[_7px_7px_0px_#000000] bg-white"
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Введите ваш email"
            className="flex-grow px-4 py-3 text-sm sm:text-base outline-none border-b sm:border-b-0 sm:border-r border-black"
          />
          <button
            disabled={isLoading}
            type="submit"
            className="px-6 py-3 text-sm sm:text-base whitespace-nowrap bg-white hover:bg-black hover:text-white transition-colors active:bg-gray-700"
          >
            Подписаться
          </button>
        </form>
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
