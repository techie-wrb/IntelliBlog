require("dotenv").config();
const express = require("express");
const Blog = require("../models/Blog");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");

// 👉 GET all blog posts
router.get("/user", authMiddleware, async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

      const total = await Blog.countDocuments();
    const blogs = await Blog.find({ author: req.user.id });


      sort({ createdAt: -1 }) // newest first
      skip(skip)
      limit(limit)
      populate("author", "name");

    const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes || 0), 0);
    const mostLiked = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), { likes: 0 });
    const lastPosted = blogs.reduce((latest, blog) =>
      new Date(blog.createdAt) > new Date(latest.createdAt) ? blog : latest,
    { createdAt: 0 });

    res.json({
      blogs,
       total,
      page,
      pages: Math.ceil(total / limit),
      stats: {
        totalBlogs: blogs.length,
        totalLikes,
        mostLikedTitle: mostLiked.title || "N/A",
        lastPostedDate: lastPosted.createdAt || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// 👉 GET a single blog post
router.get("/:id", authMiddleware , async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// 👉 POST: create a blog post
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const newBlog = new Blog({
      title,
      content,
      author: req.user, // comes from auth middleware
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog" });
  }
});
// 👉 PUT: update a blog post
router.put("/:id", authMiddleware , async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ error: "Failed to update blog" });
  }
});

router.post("/summarize", authMiddleware , async (req, res) => {
  const { content } = req.body;
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Summarize this blog:\n\n${content}` }],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const summary = response.data.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to summarize blog" });
  }
});




// 👉 DELETE: delete a blog post
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;
