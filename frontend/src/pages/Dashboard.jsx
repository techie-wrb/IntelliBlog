import React, { useEffect, useState } from "react";
import API from "../context/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ blogs: 0, likes: 0, lastPostDate: "", topBlog: "" });

  useEffect(() => {
    API.get("/user/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">📊 Dashboard</h2>
      <div className="bg-white rounded shadow p-4 space-y-3">
        <p>Total Blogs: <strong>{stats.blogs}</strong></p>
        <p>Total Likes: <strong>{stats.likes}</strong></p>
        <p>Last Blog Posted: <strong>{stats.lastPostDate}</strong></p>
        <p>Top Blog: <strong>{stats.topBlog}</strong></p>
      </div>
    </div>
  );
};

export default Dashboard;
