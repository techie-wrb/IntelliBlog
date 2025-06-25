import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../context/api";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditBlog = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: "", content: "", tags: "", image: "" });
  const [thread, setThread] = useState([""]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/blog/${id}`)
      .then((res) => {
        setFormData({
          title: res.data.title,
          content: res.data.content,
          tags: res.data.tags?.join(", ") || "",
          image: res.data.image || ""
        });
        setThread(res.data.thread || [""]);
      })
      .catch((err) => {
        toast.error("❌ Failed to load blog");
        console.error(err);
      });
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, image: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const updateParagraph = (i, val) => {
    const t = [...thread];
    t[i] = val;
    setThread(t);
  };

  const addParagraph = () => setThread([...thread, ""]);

  const handleUpdate = async () => {
    try {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim());
      await API.put(`/blog/${id}`, {
        ...formData,
        tags: tagsArray,
        thread,
      });
      toast.success("✅ Blog updated!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("❌ Failed to update blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">✏️ Edit Blog</h2>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
        className="w-full p-2 border my-2"
      />
      <ReactQuill
        value={formData.content}
        onChange={(val) => setFormData({ ...formData, content: val })}
        className="mb-4"
      />
      <input
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border mb-2"
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
      {formData.image && <img src={formData.image} alt="cover" className="w-full mb-4" />}

      <h3 className="text-lg mt-4">🧵 Thread-style Paragraphs</h3>
      {thread.map((para, i) => (
        <textarea
          key={i}
          value={para}
          onChange={(e) => updateParagraph(i, e.target.value)}
          placeholder={`Paragraph ${i + 1}`}
          className="w-full p-2 border mb-2"
        />
      ))}
      <button onClick={addParagraph} className="bg-gray-200 px-3 py-1 rounded mb-2">+ Add Paragraph</button>

      <button onClick={handleUpdate} className="block w-full bg-purple-700 text-white py-2 mt-4 rounded">
        Update Blog
      </button>
    </div>
  );
};

export default EditBlog;
