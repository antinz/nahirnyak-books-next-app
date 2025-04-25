"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        localStorage.setItem("isAdmin", "true");
        toast.success("Авторизация успешна");
        router.push("/admin");
        setUsername("");
        setPassword("");
      } else {
        toast.error("Неверные данные!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
            Админ панель
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 transition"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
