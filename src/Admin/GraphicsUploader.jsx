import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_KEY } from "../constant";

const GraphicUploader = () => {
  const [file, setFile] = useState(null); // Single file
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type.includes("svg") ? "svg" : "image";
    const filePreview =
      fileType === "svg" ? null : URL.createObjectURL(selectedFile);

    const fileData = {
      file: selectedFile,
      preview: filePreview,
      name: selectedFile.name.split(".")[0],
      tags: selectedFile.name.split(".")[0],
      type: fileType,
    };

    if (fileType === "svg") {
      const reader = new FileReader();
      reader.onload = () => {
        fileData.preview = reader.result;
        setFile(fileData);
      };
      reader.readAsText(selectedFile);
    } else {
      setFile(fileData);
    }
  };

  const handleFileMetadataChange = (key, value) => {
    if (file) {
      setFile({ ...file, [key]: value });
    }
  };

  const handleCancelFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      return setMessage("Please select a file to upload.");
    }

    setIsUploading(true);

    try {
      if (file.type === "svg") {
        // SVG upload
        const data = {
          svgs: [
            {
              svg: file.preview,
              name: file.name,
              tags: file.tags.split("-").map((tag) => tag.trim()),
              type: "Svg",
            },
          ],
        };

        await axios.post(`${API_KEY}api/graphic/upload-svg`, data);

        Swal.fire({
          title: "SVG Uploaded Successfully",
          icon: "success",
        });
      } else {
        // Image upload
        const formData = new FormData();
        formData.append("imageFile", file.file);
        formData.append("name", file.name);
        formData.append("tags", file.tags);
        formData.append("type", "Image");

        await axios.post(`${API_KEY}api/graphic/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Swal.fire({
          title: "Image Uploaded Successfully",
          icon: "success",
        });
      }

      setFile(null);
      setMessage("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const setSvgSize = (svgString, width, height) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    svgElement.setAttribute("width", width);
    svgElement.setAttribute("height", height);

    return new XMLSerializer().serializeToString(svgElement);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Upload Graphic</h1>

        <input
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="block w-full mb-4 text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100"
        />

        {file && (
          <div className="mb-4 relative">
            {file.preview && file.type === "svg" && (
              <div
                className="border border-gray-300 p-4 rounded-lg w-[300px]"
                dangerouslySetInnerHTML={{
                  __html: setSvgSize(file.preview, "200", "200"),
                }}
              />
            )}
            {file.preview && file.type === "image" && (
              <img
                src={file.preview}
                alt={file.name}
                className="w-[200px] h-[200px] object-contain border rounded-lg"
              />
            )}
            <button
              onClick={handleCancelFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-2 text-xs shadow-md hover:bg-red-600"
            >
              X
            </button>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={file.name}
              onChange={(e) => handleFileMetadataChange("name", e.target.value)}
              className="block w-full p-2 mb-4 border rounded-lg"
              placeholder="Enter name"
            />

            <label className="block text-gray-700 font-semibold mb-2">
              Tags
            </label>
            <input
              type="text"
              value={file.tags}
              onChange={(e) => handleFileMetadataChange("tags", e.target.value)}
              className="block w-full p-2 mb-4 border rounded-lg"
              placeholder="Enter tags (comma-separated)"
            />
          </div>
        )}

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

        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default GraphicUploader;
