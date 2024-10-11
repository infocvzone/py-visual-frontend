import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_KEY } from "../constant";

const TypeComponent = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");

  // Fetch types from the API when the component mounts
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/types/`); // Update with your actual API endpoint
        setTypes(response.data);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchTypes();
  }, []);

  // Add a new type to the database
  const addType = async () => {
    if (!newType) return; // Prevent empty submissions
    try {
      const response = await axios.post(`${API_KEY}api/types/`, {
        name: newType,
      }); // Update with your actual API endpoint
      setTypes([...types, response.data]); // Update the state with the new type
      setNewType("");
      setIsAdding(false); // Close dropdown
    } catch (error) {
      console.error("Error adding type:", error);
    }
  };

  // Update an existing type in the database
  const updateType = async (typeId) => {
    if (!updatedValue) return; // Prevent empty submissions
    try {
      const response = await axios.put(`${API_KEY}api/types/${typeId}`, {
        name: updatedValue,
      }); // Update with your actual API endpoint
      setTypes(
        types.map((type) => (type._id === typeId ? response.data : type))
      ); // Update the state with the modified type
      setEditingType(null); // Clear editing state
      setUpdatedValue(""); // Clear input field
    } catch (error) {
      console.error("Error updating type:", error);
    }
  };

  // Delete a type from the database
  const deleteType = async (typeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this type?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${API_KEY}api/types/${typeId}`); // Update with your actual API endpoint
        setTypes(types.filter((type) => type._id !== typeId)); // Remove deleted type from state
      } catch (error) {
        console.error("Error deleting type:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Existing Element Types...</h1>
      <ul className="mb-4">
        {types.map((type) => (
          <li
            key={type._id}
            className=" flex items-center justify-between px-8 mb-2 p-2 border border-gray-300 rounded shadow-sm"
          >
            {type.name}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingType(type._id);
                  setUpdatedValue(type.name);
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded shadow-md hover:bg-yellow-600 transition duration-200"
              >
                Update
              </button>
              <button
                onClick={() => deleteType(type._id)}
                className="bg-red-500 text-white px-2 py-1 rounded shadow-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
            {editingType === type._id && (
              <div className="mt-2 flex">
                <input
                  type="text"
                  value={updatedValue}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  placeholder="New type name"
                  className="border border-gray-300 rounded px-2 py-1 mr-2 flex-grow"
                />
                <button
                  onClick={() => updateType(type._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition duration-200"
                >
                  Update Element
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition duration-200"
        >
          {isAdding ? "Cancel" : "Add New Type"}
        </button>
        {isAdding && (
          <div className="mt-3 flex">
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Type name"
              className="border border-gray-300 rounded px-2 py-1 mr-2 flex-grow"
            />
            <button
              onClick={addType}
              className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition duration-200"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeComponent;
