import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../context/api";
import { toast } from "react-toastify";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    API.get(`/blog/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLikes(res.data.likes || 0);
        setSummary(res.data.summary || "");
      })
      .catch((err) => {
        toast.error("❌ Failed to load blog");
        console.error(err);
      });
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await API.post(`/blog/${id}/like`);
      setLikes(res.data.likes);
      toast.success("❤️ Blog liked!");
    } catch (err) {
      toast.error("❌ Failed to like blog");
    }
  };

  const handleComment = async () => {
    try {
      await API.post(`/blog/${id}/comment`, { comment });
      toast.success("💬 Comment posted!");
      setComment("");
    } catch (err) {
      toast.error("❌ Failed to post comment");
    }
  };

  if (!blog) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
      <p className="text-gray-500 mb-4">By {blog.author?.name || "Anonymous"}</p>
      {blog.image && <img src={blog.image} alt="cover" className="w-full mb-4 rounded" />}

      <div
        className="prose max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {blog.thread?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">🧵 Thread-style Story</h3>
          <ul className="list-disc list-inside space-y-1">
            {blog.thread.map((para, idx) => (
              <li key={idx}>{para}</li>
            ))}
          </ul>
        </div>
      )}

      {summary && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h4 className="font-bold text-purple-700">🧠 AI Summary</h4>
          <p className="mt-2 text-sm text-gray-700">{summary}</p>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className="bg-red-500 text-white px-4 py-2 rounded shadow"
        >
          ❤️ Like ({likes})
        </button>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-2">🗨️ Add Comment</h4>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleComment}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default SingleBlog;
