const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
   image: { type: String
 },
thread: [
    {
      type: String, // each paragraph or thread entry
    },
  ],


  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you'll create User model later
    required: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Blog", blogSchema);
