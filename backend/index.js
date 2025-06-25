const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const blogRoutes = require("./routes/blog"); // ✅ Import blog routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/api/blog", blogRoutes);           // ✅ Use blog routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI,
{
useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("IntelliBlog Backend is Running 🧠");
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
