const BlogPost = require("../models/BlogPost");

exports.createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const newPost = new BlogPost({
      title,
      body,
      tags,
      author: req.userId,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
