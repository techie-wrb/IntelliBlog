import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../context/api";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

const handleRegister = async () => {
  console.log("🔼 Sending Data:", formData);
  try {
    const res = await API.post("/api/user/register", formData);

    // Log the response
    console.log("🔼 API Response:", res);

    if (res.status === 201 || res.data.message === "User registered") {
      toast.success("✅ Registration successful!");
      navigate("/login");
    }
  } catch (err) {
    toast.error("❌ Registration failed");
    console.error("Error:", err.response?.data || err.message);
  }
};

  return (
    <div>
      <h2>📝 Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"  // Changed to email for better validation
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
