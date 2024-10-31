// Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../constant";
import { useDispatch } from "react-redux";
import { Userlogin } from "../Redux/authSlice";
import logo from "../assets/logo.png"; // Add your logo image in assets folder
import backgroundImage from "../assets/Background.png"; // Background image for styling

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_KEY}api/users/login`, formData);
      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
        dispatch(Userlogin({ token, user }));
        navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-opacity-90 bg-white shadow-md">
        <img src={logo} alt="Py-Visual Logo" className="h-10"/>
        <button
          onClick={() => navigate("/signup")}
          className="text-white bg-sky-400 rounded-full px-4 py-2 hover:bg-sky-500 shadow-md"
        >
          Sign Up
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white rounded-lg shadow-lg border p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-[#4cb1e9] mb-6">
            Login to Your Account
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#4cb1e9] hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className=" py-4">
        <div className="text-center text-[#4cb1e9]">
          <p>© 2024 Py-Visual. All rights reserved.</p>
          <div className="space-x-4">
            <a href="/about" className="hover:underline">
              About
            </a>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
