import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_KEY } from "../constant";

const IconUploader = () => {
  const [selectedSvg, setSelectedSvg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle SVG selection
  const handleSvgChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/svg+xml") {
      setSelectedSvg(file);

      // Preview the SVG
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsText(file);
    } else {
      setMessage("Please select a valid SVG file.");
    }
  };
  // Function to set SVG size
  const setSvgSize = (svgString, width, height) => {
    // Parse the SVG string to modify width and height
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // Set width and height
    svgElement.setAttribute("width", width);
    svgElement.setAttribute("height", height);

    // Return the modified SVG string
    return new XMLSerializer().serializeToString(svgElement);
  };
  // Handle SVG upload
  const handleUpload = async () => {
    if (!selectedSvg) {
      return setMessage("Please select an SVG file.");
    }

    if (!name || !tags) {
      return setMessage("Please provide both name and tags for the SVG.");
    }

    setIsUploading(true);

    // Convert SVG to a string
    const reader = new FileReader();
    reader.onload = async () => {
      const svgString = reader.result;

      // Data to send to the server
      const data = {
        svg: svgString,
        name,
        tags: tags.split(",").map((tag) => tag.trim()), // Convert tags to an array
      };

      console.log(data);

      try {
        const response = await axios.post(
          `${API_KEY}api/icons/`,
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setMessage("SVG uploaded successfully!");
        console.log(response.data);
        Swal.fire({
          title: "SVG Uploaded Successfully",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        setMessage("SVG upload failed.");
      } finally {
        setIsUploading(false);
        setSelectedSvg(null);
        setPreview(null);
        setName("");
        setTags("");
      }
    };

    reader.readAsText(selectedSvg);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Upload SVG</h1>

        {/* File input */}
        <input
          type="file"
          accept=".svg"
          onChange={handleSvgChange}
          className="block w-full mb-4 text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100"
        />

        {/* SVG preview */}
        {preview && (
          <div className="mb-4">
            <div
              className="border border-gray-300 p-4 rounded-lg w-[400px]"
              dangerouslySetInnerHTML={{ __html: setSvgSize(preview, "300", "300") }}
            />
          </div>
        )}

        {/* Name input */}
        <label className="block text-gray-700 font-semibold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full p-2 mb-4 border rounded-lg"
          placeholder="Enter SVG name"
        />

        {/* Tags input */}
        <label className="block text-gray-700 font-semibold mb-2">Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="block w-full p-2 mb-4 border rounded-lg"
          placeholder="Enter tags (comma-separated)"
        />

        {/* Upload button */}
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
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {/* Upload message */}
        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default IconUploader;
