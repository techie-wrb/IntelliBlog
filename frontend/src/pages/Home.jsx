import React, { useEffect, useState } from "react";
import API from "../context/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    try {
      const res = await API.get(`/blog?page=${page}&limit=5`);
      setBlogs(res.data.blogs);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("❌ Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">
        🧠 IntelliBlog - All Blogs
      </h2>

      <input
        type="text"
        placeholder="🔍 Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-purple-300"
      />

      <div className="space-y-4">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-purple-800">
              <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
            </h3>
            <p className="text-gray-600 text-sm">By {blog.author?.username || "Anonymous"}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅️ Prev
        </button>
        <span className="text-lg">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default Home;
