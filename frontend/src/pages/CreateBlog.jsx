import React, { useState } from "react";
import API from "../context/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateBlog = () => {
  const [formData, setFormData] = useState({ title: "", content: "", tags: "", image: "" });
  const [summary, setSummary] = useState("");
  const [thread, setThread] = useState([""]);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, image: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const generateSummary = async () => {
    try {
      const res = await API.post("/blog/summarize", { content: formData.content });
      setSummary(res.data.summary);
    } catch (err) {
      toast.error("❌ Failed to generate summary");
    }
  };

  const addParagraph = () => setThread([...thread, ""]);
  const updateParagraph = (i, val) => {
    const t = [...thread];
    t[i] = val;
    setThread(t);
  };

  const handleSubmit = async () => {
    try {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim());
      await API.post("/blog", { ...formData, tags: tagsArray, thread });
      toast.success("✅ Blog created!");
      navigate("/dashboard");
    } catch {
      toast.error("❌ Failed to create blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">✍️ Create Blog</h2>
      <input
        className="w-full border p-2 my-2"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <ReactQuill
        theme="snow"
        value={formData.content}
        onChange={(value) => setFormData({ ...formData, content: value })}
        className="mb-4"
      />
      <input
        className="w-full border p-2 mb-2"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
      {formData.image && <img src={formData.image} alt="preview" className="w-full mb-4" />}
      <button onClick={generateSummary} className="bg-blue-500 text-white px-4 py-2 rounded">🧠 Generate Summary</button>
      {summary && <textarea value={summary} readOnly className="w-full p-2 border my-2" />}

      <h3 className="text-lg mt-4">🧵 Thread-style Paragraphs</h3>
      {thread.map((para, i) => (
        <textarea
          key={i}
          className="w-full border p-2 mb-2"
          placeholder={`Paragraph ${i + 1}`}
          value={para}
          onChange={(e) => updateParagraph(i, e.target.value)}
        />
      ))}
      <button onClick={addParagraph} className="bg-gray-200 px-3 py-1 rounded mb-2">+ Add Paragraph</button>

      <button onClick={handleSubmit} className="block w-full bg-purple-700 text-white py-2 mt-4 rounded">
        Publish
      </button>
    </div>
  );
};

export default CreateBlog;
