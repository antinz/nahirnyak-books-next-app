"use client";

import { useRouter } from "next/navigation";
import Sidebar from "/Components/AdminComponents/Sidebar.jsx";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/login");
    }
  }, [router]);
  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); // ✅ Remove flag
    router.push("/login"); // ✅ Redirect
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <ToastContainer theme="dark" />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto w-full">
        <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
          <h3 className="font-medium">Админ панель</h3>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-medium py-1 px-3 sm:py-1 sm:px-6 border border-soli cursor-pointer shadow-[_7px_7px_0px_#000000]"
          >
            Выйти
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
