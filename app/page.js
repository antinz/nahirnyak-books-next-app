"use client";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { ToastContainer } from "react-toastify";
import BlogList from "../Components/BlogList";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blog");
        setBlogs(res.data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return loading ? (
    <LoadingSpinner loading={loading} />
  ) : (
    <div className="min-h-screen flex flex-col">
      <ToastContainer theme="dark" />
      <Header />

      <main className="flex-grow px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <BlogList blogs={blogs} />
      </main>

      <Footer />
    </div>
  );
}
