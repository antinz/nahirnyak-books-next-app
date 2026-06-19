import { assets } from "../../Assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin/addBlog",
      icon: assets.add_icon,
      label: "Добавить книгу",
    },
    {
      href: "/admin/addChapter",
      icon: assets.add_icon,
      label: "Добавить главу",
    },
    {
      href: "/admin/blogList",
      icon: assets.blog_icon,
      label: "Список всех книг",
    },
    {
      href: "/admin/chapterList",
      icon: assets.blog_icon,
      label: "Список всех глав",
    },
    {
      href: "/admin/subscriptions",
      icon: assets.email_icon,
      label: "Подписки",
    },
    {
      href: "/admin/editChapter",
      icon: assets.edit_icon,
      label: "Редактировать главу",
    },
    {
      href: "/admin/editBlog",
      icon: assets.edit_icon,
      label: "Редактировать книгу",
    },
  ];

  return (
    <div className="flex flex-col bg-slate-100">
      <div className="px-2 sm:pl-14 py-3 border border-black">
        <Link href="/">
          <Image src={assets.logo} width={100} alt="" />
        </Link>
      </div>
      <div className="w-28 sm:w-80 h-screen relative py-12 border-r border-black ">
        <div className="w-[50%] sm:w-[80%] absolute right-0">
          {links.map(({ href, icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 shadow-[_-5px_5px_0px_#000000] ${
                  isActive ? "bg-[darkblue] text-white" : "bg-white"
                }`}
              >
                <Image src={icon} alt="" width={28} />
                <p>{label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
