import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_KEY } from "../constant";
import backgroundImage from "../assets/Background.png";
import Swal from "sweetalert2";

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      Swal.fire({
        title: "You Are Not Allow To Register As Admin",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      /*const response = await axios.post(`${API_KEY}api/admins/signup`, {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        // Redirect to verification page with email
        navigate(`/admin-verify/${email}`);
      } else {
        setError(response.data.message || "Signup failed. Please try again.");
      }*/
    } catch (err) {
      // Log error for debugging
      console.error("Signup error:", err);

      // Set error message for user
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover", // Optional: to cover the entire div
        backgroundPosition: "center", // Optional: to center the image
        height: "100vh", // Optional: to give the div height
      }}
      className="flex h-screen"
    >
      {/* Left Pane */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-cover bg-center">
        <div className="max-w-md text-center">
          {/* Add any content or images here */}
        </div>
      </div>
      {/* Right Pane */}
      <div className="flex items-center justify-center flex-1  text-black">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-2xl border rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-sky-400">
            Admin SignUp
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 relative"
            >
              Sign Up
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600"></span>
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/admin-login"
                  className="font-medium text-sky-400 hover:text-sky-500"
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
