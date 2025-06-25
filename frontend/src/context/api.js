// src/context/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Matches your Express backend route prefix
  withCredentials: true, // optional: for cookies, sessions if you ever need
});

// Attach JWT token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
