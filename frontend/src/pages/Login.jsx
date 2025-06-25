import React, { useState } from "react";
import API from "../context/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/user/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed ❌");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔐 Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full p-2 border mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full p-2 border mb-2"
      />
      <button onClick={handleLogin} className="bg-purple-600 text-white px-4 py-2">Login</button>
    </div>
  );
};

export default Login;
