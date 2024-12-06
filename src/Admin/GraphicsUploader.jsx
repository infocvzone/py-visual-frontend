import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_KEY } from "../constant";

const GraphicUploader = () => {
  const [mode, setMode] = useState(null); // User's choice: "svg" or "image"
  const [files, setFiles] = useState([]); // Array of selected files
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    setFiles([]); // Reset files when switching modes
    setMessage("");
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    if (mode === "svg") {
      // Limit selection to SVG files
      const svgFiles = selectedFiles.filter((file) =>
        file.type.includes("svg")
      );
      if (svgFiles.length !== selectedFiles.length) {
        Swal.fire("Error", "Only SVG files are allowed!", "error");
        return;
      }

      const svgData = svgFiles.map((file) => ({
        file,
        name: file.name.split(".")[0],
        tags: file.name.split(".")[0],
        preview: null, // SVG previews are set later after reading file content
      }));

      // Read SVG file content for previews
      svgData.forEach((svg, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          svgData[index].preview = reader.result;
          setFiles([...svgData]); // Update files array after reading
        };
        reader.readAsText(svg.file);
      });
    } else if (mode === "image") {
      // Limit selection to 5 images
      if (selectedFiles.length > 5) {
        Swal.fire("Error", "You can upload up to 5 images!", "error");
        return;
      }

      const imageData = selectedFiles.map((file) => ({
        file,
        name: file.name.split(".")[0],
        tags: file.name.split(".")[0],
        preview: URL.createObjectURL(file),
      }));

      setFiles(imageData);
    }
  };

  const handleFileMetadataChange = (index, key, value) => {
    const updatedFiles = [...files];
    updatedFiles[index][key] = value;
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (!files.length) {
      return setMessage("Please select files to upload.");
    }

    setIsUploading(true);

    try {
      if (mode === "svg") {
        // SVG upload
        const data = {
          svgs: files.map((svg) => ({
            svg: svg.preview,
            name: svg.name,
            tags: svg.tags.split("-").map((tag) => tag.trim()),
            type: "Svg",
          })),
        };

        await axios.post(`${API_KEY}api/graphic/upload-svg`, data);
        Swal.fire("Success", "SVGs uploaded successfully!", "success");
      } else if (mode === "image") {
        // Image upload
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("imageFiles", file.file);
          formData.append("names[]", file.name);
          formData.append("tags[]", file.tags);
        });

        await axios.post(
          `${API_KEY}api/graphic/upload-image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("Success", "Images uploaded successfully!", "success");
      }

      setFiles([]);
      setMessage("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage("File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Upload Graphics</h1>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`py-2 px-4 rounded-lg font-semibold ${
              mode === "svg"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleModeChange("svg")}
          >
            Add SVGs
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-semibold ${
              mode === "image"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleModeChange("image")}
          >
            Add Images
          </button>
        </div>

        {mode && (
          <input
            type="file"
            accept={mode === "svg" ? ".svg" : ".png,.jpg,.jpeg"}
            multiple={mode === "svg" || mode === "image"}
            onChange={handleFileChange}
            className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        )}

        {files.map((file, index) => (
          <div className="mb-4 relative" key={index}>
            {file.preview && mode === "svg" && (
              <div
                className="border border-gray-300 p-4 rounded-lg w-[300px]"
                dangerouslySetInnerHTML={{
                  __html: file.preview,
                }}
              />
            )}
            {file.preview && mode === "image" && (
              <img
                src={file.preview}
                alt={file.name}
                className="w-[200px] h-[200px] object-contain border rounded-lg"
              />
            )}
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={file.name}
              onChange={(e) =>
                handleFileMetadataChange(index, "name", e.target.value)
              }
              className="block w-full p-2 mb-4 border rounded-lg"
              placeholder="Enter name"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Tags
            </label>
            <input
              type="text"
              value={file.tags}
              onChange={(e) =>
                handleFileMetadataChange(index, "tags", e.target.value)
              }
              className="block w-full p-2 mb-4 border rounded-lg"
              placeholder="Enter tags (comma-separated)"
            />
          </div>
        ))}

        <button
          onClick={handleUpload}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition duration-300 ${
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
