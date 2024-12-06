import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_KEY } from "../constant";

const ShapesUploader = () => {
  const [svgs, setSvgs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSvgChange = (event) => {
    const files = Array.from(event.target.files);
    const validSvgs = files.filter((file) => file.type === "image/svg+xml");

    const newSvgs = validSvgs.map((file) => ({
      file,
      preview: null,
      name: file.name.split(".")[0], // Default name from file name
      tags: file.name.split(".")[0], // Default tags from file name
    }));

    // Generate previews
    const readers = newSvgs.map(
      (svg) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            svg.preview = reader.result;
            resolve(svg);
          };
          reader.readAsText(svg.file);
        })
    );

    Promise.all(readers).then((result) => {
      setSvgs((prev) => [...prev, ...result]);
    });
  };

  const handleUpload = async () => {
    if (svgs.length === 0) {
      return setMessage("Please select at least one SVG file.");
    }

    if (svgs.some((svg) => !svg.name || !svg.tags)) {
      return setMessage("Please provide a name and tags for all SVGs.");
    }

    setIsUploading(true);

    const data = svgs.map((svg) => ({
      svg: svg.preview,
      name: svg.name,
      tags: svg.tags.split("-").map((tag) => tag.trim()),
    }));

    try {
      const response = await axios.post(
        `${API_KEY}api/shape`,
        { svgs: data },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Swal.fire({
        title: "SVGs Uploaded Successfully",
        text: response.data.message,
        icon: "success",
      });

      setSvgs([]);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("SVG upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSvgNameChange = (index, value) => {
    const updatedSvgs = [...svgs];
    updatedSvgs[index].name = value;
    setSvgs(updatedSvgs);
  };

  const handleSvgTagsChange = (index, value) => {
    const updatedSvgs = [...svgs];
    updatedSvgs[index].tags = value;
    setSvgs(updatedSvgs);
  };

  const handleCancelSvg = (index) => {
    const updatedSvgs = svgs.filter((_, i) => i !== index);
    setSvgs(updatedSvgs);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Upload SVGs</h1>

        {/* File input */}
        <input
          type="file"
          accept=".svg"
          multiple
          onChange={handleSvgChange}
          className="block w-full mb-4 text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100"
        />

        {/* SVG Preview and Inputs */}
        {svgs.map((svg, index) => (
          <div key={index} className="mb-4 relative">
            {svg.preview && (
              <div
                className="border border-gray-300 p-4 rounded-lg w-[300px]"
                dangerouslySetInnerHTML={{
                  __html: setSvgSize(svg.preview, "200", "200"),
                }}
              />
            )}
            <button
              onClick={() => handleCancelSvg(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-2 text-xs shadow-md hover:bg-red-600"
            >
              X
            </button>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={svg.name}
              onChange={(e) => handleSvgNameChange(index, e.target.value)}
              className="block w-full p-2 mb-4 border rounded-lg"
              placeholder="Enter SVG name"
            />

            <label className="block text-gray-700 font-semibold mb-2">
              Tags
            </label>
            <input
              type="text"
              value={svg.tags}
              onChange={(e) => handleSvgTagsChange(index, e.target.value)}
              className="block w-full p-2 mb-4 border rounded-lg"
              placeholder="Enter tags (comma-separated)"
            />
          </div>
        ))}

        {/* Upload Button */}
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
          {isUploading ? "Uploading..." : "Upload All"}
        </button>

        {/* Message */}
        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default ShapesUploader;
