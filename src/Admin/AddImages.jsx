import React, { useState } from "react";
import axios from "axios";
import { API_KEY } from "../constant";
import Swal from "sweetalert2";

const ImagesUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [scaleValue, setScaleValue] = useState(1.0); // Initialize scale_value state

  // Handle file selection and set preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle image upload to the server
  const handleUpload = async () => {
    if (!selectedImage) {
      return setMessage("Please select an image.");
    }

    setIsUploading(true); // Show loading indicator

    const formData = new FormData();
    formData.append("imageFile", selectedImage);
    formData.append("scale_value", scaleValue); // Send the scale_value

    try {
      const response = await axios.post(
        `${API_KEY}api/picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Image uploaded successfully!");
      console.log(response.data); // Handle response data as needed
      Swal.fire({
        title: "Image Added Successfully",
        showCancelButton: false,
        confirmButtonText: "ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Image upload failed.");
    } finally {
      setIsUploading(false); // Hide loading indicator
      setSelectedImage(null);
      setPreview(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Upload Background Image
        </h1>

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full mb-4 text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100"
        />

        {/* Image preview */}
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Selected"
              className="rounded-lg border border-gray-300 w-full object-cover"
            />
          </div>
        )}

        {/* Scale Value Input */}
        <label className="block text-gray-700 font-semibold mb-2">
          Scale Value (0.1 - 1.0)
        </label>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={scaleValue}
          onChange={(e) => setScaleValue(parseFloat(e.target.value))}
          className="w-full mb-4"
        />
        <p className="text-center text-gray-700 mb-4">{scaleValue}</p>

        {/* Upload button or loading indicator */}
        <button
          onClick={handleUpload}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg 
                      transition duration-300 ${
                        isUploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500"
                      }`}
          disabled={isUploading}
        >
          {isUploading ? (
            <img
              src="./assets/loading.gif"
              alt="Loading"
              className="h-6 mx-auto"
            />
          ) : (
            "Upload"
          )}
        </button>

        {/* Upload message */}
        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default ImagesUploader;
