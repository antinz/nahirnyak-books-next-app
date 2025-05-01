"use client";
import Footer from "/Components/Footer.jsx";
import Header from "/Components/Header.jsx";
import { ToastContainer } from "react-toastify";
import BlogList from "/Components/BlogList.jsx";
import LoadingSpinner from "/Components/LoadingSpinner.jsx";
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
      <main className="flex-grow">
        <BlogList blogs={blogs} />
      </main>
      <Footer />
    </div>
  );
}
