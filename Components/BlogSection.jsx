"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogList from "../Components/BlogList.jsx";
import LoadingSpinner from "../Components/LoadingSpinner";
import { ToastContainer } from "react-toastify";

export default function BlogSection() {
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

  if (loading) return <LoadingSpinner loading={loading} />;

  return (
    <>
      <ToastContainer theme="dark" />
      <BlogList blogs={blogs} />
    </>
  );
}
