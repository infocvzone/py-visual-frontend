import React, { useEffect, useRef, useState } from "react";
import FabricText from "../classes/text";
import axios from "axios";
import Swal from "sweetalert2";
import load from "../assets/loading.gif";
import { API_KEY } from "../constant";

const AddText = () => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [elementData, setElementData] = useState({
    id: Date.now(),
    type: "Text",
    x: 150,
    y: 150,
    text: "Text",
    scale: 1.0,
    color: "#000000",
    fontFamily: "sans-serif",
    fontSize: 20,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const [loading, setLoading] = useState(false);

  // Initialize Fabric canvas
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const canvas = new fabric.Canvas(canvasEl, {
      width: 500,
      height: 350,
      backgroundColor: "#f3f3f3",
      selection: false,
    });
    setCanvasObj(canvas);

    return () => {
      canvas.dispose();
      setCanvasObj(null);
    };
  }, []);

  // Function to create and add the fabric element
  const addElementToCanvas = () => {
    if (!canvasObj) return;
    canvasObj.clear(); // Clear canvas before adding new elements
    const fabricElement = createFabricElement(elementData);
    if (fabricElement) {
      canvasObj.add(fabricElement);
      fabricElement.on("selected", () => {
        setElementData((prev) => ({
          ...prev,
          id: fabricElement.id,
        }));
      });
    }
  };

  useEffect(() => {
    addElementToCanvas();
  }, [canvasObj, elementData]); // Trigger when canvasObj or elementData changes

  const createFabricElement = (element) => {
    if (!canvasObj) return null;

    const fabricElement = new FabricText(
      element.x,
      element.y,
      element.text,
      element.scale,
      element.fontPath || null,
      element.color,
      element.fontFamily || "sans-serif",
      element.fontSize,
      element.bold,
      element.italic,
      element.underline,
      element.strikethrough
    );

    fabricElement.set({
      selectable: true, // Allow dragging
      hasControls: true, // Show controls for resizing, etc.
      hasBorders: true, // Show borders
    });

    return fabricElement;
  };

  // Handle input changes, including parsing numerical values and handling checkboxes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Determine the updated value based on the input type
    const updatedValue =
      type === "checkbox"
        ? checked // Handle checkbox values
        : ["width", "height", "fontSize", "x", "y", "scale"].includes(name)
        ? parseFloat(value) || 1 // Convert to float, default to 1 if NaN for specific fields
        : value || ""; // Keep as string for other fields

    // Update the state with the new value
    setElementData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Handle submit to send data to API
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_KEY}api/texts/`,
        elementData
      );
      const result = await response.data;
      console.log("Text saved:", result);
      setLoading(false);
      Swal.fire({
        title: "Text Added Successfully",
        showCancelButton: false,
        confirmButtonText: "ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error saving button:", error);
      setLoading(false)
    }
  };

  return (
    <div className="flex border rounded shadow-sm">
      <div className="w-[30%] h-[400px] p-4 overflow-auto">
        {" "}
        {/* Added overflow-auto */}
        <h2 className="text-lg font-bold">Properties</h2>
        {Object.keys(elementData).map((key) => (
          <div key={key} className="mb-2">
            <label className="block">{key}:</label>
            {key === "fontFamily" ? (
              <select
                name="fontFamily"
                value={elementData.fontFamily}
                onChange={handleInputChange}
                className="border p-1 rounded"
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Verdana">Verdana</option>
                <option value="sans-serif">Sans-Serif</option>
                <option value="serif">Serif</option>
              </select>
            ) : key === "bold" ||
              key === "italic" ||
              key === "underline" ||
              key === "strikethrough" ? (
              <input
                type="checkbox"
                name={key}
                checked={elementData[key]}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
            ) : (
              <input
                type={
                  key.includes("color")
                    ? "color"
                    : key.includes("fontSize")
                    ? "number"
                    : "text"
                }
                name={key}
                value={elementData[key]}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
            )}
          </div>
        ))}
        {!loading ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        ) : (
          <img src={load} alt="loading" className="w-[50px] h-[50px]"/>
        )}
      </div>
      <div className="w-[70%] h-[450px]">
        <div className="flex items-center justify-center p-4 relative">
          <canvas ref={canvasRef} id="canvas" className="border shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default AddText;
