import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_KEY } from "../constant";
import backgroundImage from "../assets/Background.png";

const AdminVerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("OTP is required.");
      return;
    }
    try {
      const response = await axios.post(`${API_KEY}api/admins/otp-verify`, {
        email,
        otp,
      });
      if (response.status === 200) {
        navigate("/admin-login");
      } else {
        setError("Verification failed. try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Verification failed. Please try again.");
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
      <div className="flex items-center justify-center flex-1 text-black">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-2xl rounded-lg border">
          <h1 className="text-3xl font-bold mb-6 text-center text-sky-400">
            Verify Account
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-600"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleChange}
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter OTP sent to your email"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            >
              Verify
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500"></span>
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Didn't receive the OTP?{" "}
                <a
                  href="/signup"
                  className="font-medium text-sky-400 hover:text-sky-500"
                >
                  Resend
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminVerifyAccount;
