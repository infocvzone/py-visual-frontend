// OTPVerification.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-otp", { email, otp });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-teal-100 via-purple-100 to-sky-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-teal-700 mb-6">
          Verify OTP
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-3 border border-sky-300 rounded-lg focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
