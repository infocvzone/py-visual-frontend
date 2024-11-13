import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_KEY } from "../constant";
import Swal from "sweetalert2";

const AssetManagement = () => {
  const [images, setImages] = useState([]);
  const [Picture, setPicture] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [editingFontId, setEditingFontId] = useState(null);
  const [fontUpdateInput, setFontUpdateInput] = useState("");

  // Fetching data from APIs
  useEffect(() => {
    // Fetch images
    axios
      .get(`${API_KEY}api/images`)
      .then((response) => {
        setImages(response.data); // Assuming response.data is the array of image data
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });

    // Fetch images
    axios
      .get(`${API_KEY}api/picture`)
      .then((response) => {
        setPicture(response.data); // Assuming response.data is the array of image data
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });

    // Fetch fonts
    axios
      .get(`${API_KEY}api/fonts`)
      .then((response) => {
        setFonts(response.data); // Assuming response.data is the array of font data
      })
      .catch((error) => {
        console.error("Error fetching fonts:", error);
      });
  }, []);

  // Delete image by ID
  const handleDeleteImage = (id) => {
    axios
      .delete(`${API_KEY}api/images/${id}`)
      .then(() => {
        setImages(images.filter((image) => image._id !== id));
        Swal.fire({
          title: "Image Deleted Successfully",
          showCancelButton: false,
          confirmButtonText: "ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  // Delete image by ID
  const handleDeletePicture = (id) => {
    axios
      .delete(`${API_KEY}api/picture/${id}`)
      .then(() => {
        setPicture(Picture.filter((image) => image._id !== id));
        Swal.fire({
          title: "Image Deleted Successfully",
          showCancelButton: false,
          confirmButtonText: "ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  // Delete font by ID
  const handleDeleteFont = (id) => {
    console.log(id);
    axios
      .delete(`${API_KEY}api/fonts/${id}`)
      .then(() => {
        setFonts(fonts.filter((font) => font._id !== id));
        Swal.fire({
          title: "Font Deleted Successfully",
          showCancelButton: false,
          confirmButtonText: "ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("Error deleting font:", error);
      });
  };

  // Start editing a font
  const handleEditFont = (id, currentFontName) => {
    setEditingFontId(id);
    setFontUpdateInput(currentFontName);
  };

  // Update font by ID
  const handleUpdateFont = (id) => {
    axios
      .put(`${API_KEY}api/fonts/${id}`, { name: fontUpdateInput })
      .then(() => {
        setFonts(
          fonts.map((font) =>
            font._id === id ? { ...font, name: fontUpdateInput } : font
          )
        );
        setEditingFontId(null); // Close input field after update
      })
      .catch((error) => {
        console.error("Error updating font:", error);
      });
  };

  // Cancel font update
  const handleCancelEdit = () => {
    setEditingFontId(null); // Close the input field
    setFontUpdateInput(""); // Clear the input field
  };

  return (
    <div className="asset-management p-6 bg-gray-100 min-h-screen">
      {/* Display Images */}
      <div className="images-section mb-8">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">
          Background Images
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="image-item bg-white p-4 shadow rounded-lg"
            >
              <img
                src={image.url}
                alt="Background"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                onClick={() => handleDeleteImage(image._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Display Images */}
      <div className="images-section mb-8">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">
          Images
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Picture.map((image) => (
            <div
              key={image._id}
              className="image-item bg-white p-4 shadow rounded-lg"
            >
              <img
                src={image.url}
                alt="Image"
                className="w-full h-32 object-cover rounded mb-2"
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                onClick={() => handleDeletePicture(image._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display Fonts */}
      <div className="fonts-section">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Fonts</h2>
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Font Name
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font._id} className="border-t border-gray-200">
                <td className="py-3 px-4">
                  {editingFontId === font._id ? (
                    <input
                      type="text"
                      value={fontUpdateInput}
                      onChange={(e) => setFontUpdateInput(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (
                    font.name
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingFontId === font._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateFont(font._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditFont(font._id, font.name)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFont(font._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetManagement;
