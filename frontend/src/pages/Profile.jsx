import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../context/api";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get(`/user/${username}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch user profile", err));
  }, [username]);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">
        👤 {user.username}'s Profile
      </h2>
      <p className="mb-2 text-gray-700">📝 Bio: {user.bio || "No bio available."}</p>
      <p className="mb-2 text-gray-700">📝 Total Blogs: {user.blogs?.length || 0}</p>
      <p className="mb-2 text-gray-700">❤️ Total Likes: {user.totalLikes || 0}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">🧠 Blogs by {user.username}</h3>
        <ul className="space-y-2">
          {user.blogs?.map((blog) => (
            <li key={blog._id} className="bg-white p-4 shadow rounded">
              <a href={`/blog/${blog._id}`} className="text-purple-800 font-semibold">
                {blog.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;

