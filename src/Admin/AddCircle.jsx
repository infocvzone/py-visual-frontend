import React, { useEffect, useRef, useState } from "react";
import FabricButton from "../classes/button";
import axios from "axios";
import Swal from "sweetalert2";
import load from "../assets/loading.gif";
import { API_KEY } from "../constant";

const AddCircle = () => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [boundingBox, setBoundingBox] = useState({ width: 0, height: 0 });
  const [elementData, setElementData] = useState({
    type:"Circle",
    x: 100,
    y1: 100,
    radius: 30,
    Color: "#0f0f0f",
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
  const addElementToCanvas = async () => {
    if (!canvasObj) return;
    canvasObj.clear(); // Clear canvas before adding new elements
    const fabricElement = await createFabricElement(elementData);
    if (fabricElement) {
      canvasObj.add(fabricElement);
      fabricElement.on("selected", () => {
        setElementData((prev) => ({
          ...prev,
          id: fabricElement.id,
        }));
      });
      // Calculate bounding box once the element is added
      const boundingRect = fabricElement.getBoundingRect();
      setBoundingBox({
        width: boundingRect.width,
        height: boundingRect.height,
      });
    }
  };

  const calculateCenterPosition = (canvas) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    return { centerX, centerY };
  };

  useEffect(() => {
    addElementToCanvas();
  }, [canvasObj, elementData]); // Trigger when canvasObj or elementData changes

  const createFabricElement = (element) => {
    if (!canvasObj) return null;

    return new fabric.Circle({
      left: element.x, // X coordinate
      top: element.y1, // Y coordinate
      radius: element.radius, // Radius of the circle
      fill: element.Color, // Fill color
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the field should be a number and convert if necessary
    const updatedValue = ["x", "y1", "radius"].includes(name)
      ? parseFloat(value) || 0 // Convert to float, default to 0 if NaN
      : value || ""; // Keep as string or empty string

    setElementData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Handle submit to send data to API
  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log(elementData);
      const response = await axios.post(
        `${API_KEY}api/circle/`,
        elementData
      );
      const result = await response.data;
      console.log("Circle saved:", result);
      setLoading(false);
      Swal.fire({
        title: "Circle Added Successfully",
        showCancelButton: false,
        confirmButtonText: "ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error saving Circle:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex border rounded shadow-sm">
      <div className=" w-[30%] h-[400px] p-4 overflow-auto">
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
                {/* Map the fetched fonts to options */}
                {Fonts.map((font, index) => (
                  <option key={index} value={font.name}>
                    {font.name}{" "}
                    {/* Assuming 'family' is the property holding the font name */}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  key.includes("Color")
                    ? "color"
                    : key.includes("x") ||
                      key.includes("y1") ||
                      key.includes("radius")
                    ? "number"
                    : "text"
                }
                name={key}
                value={elementData[key]}
                onChange={handleInputChange}
                className="border p-1 rounded"
                readOnly={["type"].includes(key)}
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
          <img src={load} alt="loading" className="w-[50px] h-[50px]" />
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

export default AddCircle;
