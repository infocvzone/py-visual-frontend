// Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../constant";
import logo from "../assets/logo.png"; // Add your logo image in assets folder
import backgroundImage from "../assets/Background.png"; // Background image for styling

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_KEY}api/users/signup`, formData);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
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
          onClick={() => navigate("/login")}
          className="text-white bg-sky-400 rounded-full px-4 py-2 hover:bg-sky-500 shadow-md"
        >
          Login
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white rounded-lg shadow-lg border p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-teal-700 mb-6">
            Create an Account
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-sky-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-sky-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-sky-300 rounded-lg focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-teal-700 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4">
        <div className="text-center text-teal-700">
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
