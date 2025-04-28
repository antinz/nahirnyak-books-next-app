"use client";
import Footer from "/Components/Footer.jsx";
import Header from "/Components/Header.jsx";
import { ToastContainer } from "react-toastify";
import BlogList from "/Components/BlogList.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer theme="dark" />
      <Header />
      <main className="flex-grow">
        <BlogList />
      </main>
      <Footer />
    </div>
  );
}
