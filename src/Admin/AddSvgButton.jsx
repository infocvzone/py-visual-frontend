import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_KEY } from "../constant";
import ButtonSVG from "../classes/SvgButton";

const AddSvgButton = () => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [elementData, setElementData] = useState({
    id: Date.now(),
    x: 100,
    y: 100,
    scale: 1.5,
    idleSvg: `<?xml version="1.0" encoding="UTF-8"?>
    <svg id="Layer_1" data-name="Layer 1" height="64" width="64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 63 63">
      <defs>
        <style>
          .cls-1 {
            fill: #f8f8f8;
            filter: url(#drop-shadow-1);
            stroke-width: 0px;
          }
        </style>
        <filter id="drop-shadow-1" filterUnits="userSpaceOnUse">
          <feOffset dx="2.78" dy="2.78"/>
          <feGaussianBlur result="blur" stdDeviation="4.63"/>
          <feFlood flood-color="#000" flood-opacity=".19"/>
          <feComposite in2="blur" operator="in"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <circle class="cls-1" cx="31.5" cy="31.5" r="25"/>
    </svg>`,
    hoverSvg: `<?xml version="1.0" encoding="UTF-8"?>
    <svg id="Layer_1" data-name="Layer 1" height="64" width="64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 63 63">
      <defs>
        <style>
          .cls-1 {
            fill: #f8f8f8;
            filter: url(#drop-shadow-2);
            stroke-width: 0px;
          }
        </style>
        <filter id="drop-shadow-2" filterUnits="userSpaceOnUse">
          <feOffset dx="2.78" dy="2.78"/>
          <feGaussianBlur result="blur" stdDeviation="4.63"/>
          <feFlood flood-color="#000" flood-opacity=".38"/>
          <feComposite in2="blur" operator="in"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <circle `,
    clickedSvg: `<?xml version="1.0" encoding="UTF-8"?>
    <svg id="Layer_1" data-name="Layer 1" height="64" width="64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 63 63">
      <defs>
        <style>
          .cls-1 {
            fill: #ddd;
            filter: url(#drop-shadow-3);
            stroke-width: 0px;
          }
        </style>
        <filter id="drop-shadow-3" filterUnits="userSpaceOnUse">
          <feOffset dx="2.78" dy="2.78"/>
          <feGaussianBlur result="blur" stdDeviation="4.63"/>
          <feFlood flood-color="#000" flood-opacity=".38"/>
          <feComposite in2="blur" operator="in"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <circle class="cls-1" cx="32" cy="31" r="25"/>
    </svg>`,
  });

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

  // Function to load SVG into Fabric and add to canvas
  const addElementToCanvas = async () => {
    if (!canvasObj) return null;

    const fabricElement = new ButtonSVG(
      canvasObj,
      element.x,
      element.y,
      [element.idleImage, element.hoverImage, element.clickedImage],
      element.scale
    );

    return await fabricElement.getFabricElementAsync(); // Ensure the element is added correctly
  };

  useEffect(() => {
    addElementToCanvas();
  }, [canvasObj, elementData]);

  // Handle SVG file uploads and convert to Base64 strings
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setElementData((prev) => ({
          ...prev,
          [type]: reader.result, // Store the Base64 string
        }));
      };
      reader.readAsText(file); // Read SVG as text
    }
  };

  // Handle input changes for non-SVG fields (e.g., scale)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setElementData((prev) => ({
      ...prev,
      [name]: name === "scale" ? parseFloat(value) : value, // Ensure scale is a number
    }));
  };

  // Submit SVG button data to the API
  const handleSubmit = async () => {
    try {
      console.log(elementData);
      const response = await axios.post(
        `${API_KEY}api/svgButtons/`,
        elementData
      );
      const result = await response.data;
      console.log("SVG Button saved:", result);

      Swal.fire({
        title: "SVG Button Added Successfully",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error saving SVG button:", error);
    }
  };

  return (
    <div className="flex border rounded shadow-sm gap-4 items-center justify-between p-4">
      <div className="w-[30%] h-[400px] p-4 overflow-auto">
        <h2 className="text-lg font-bold">SVG Button Properties</h2>

        {/* Scale Input */}
        <div className="mb-4">
          <label className="block">Scale:</label>
          <input
            type="range"
            name="scale"
            min="0.1"
            max="3"
            step="0.1"
            value={elementData.scale}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
          <span>{elementData.scale}</span>
        </div>

        {/* Idle SVG Input */}
        <div className="mb-4">
          <label className="block">Idle SVG:</label>
          <input
            type="file"
            accept=".svg"
            onChange={(e) => handleFileChange(e, "idleSvg")}
            className="border p-1 rounded"
          />
        </div>

        {/* Hover SVG Input */}
        <div className="mb-4">
          <label className="block">Hover SVG:</label>
          <input
            type="file"
            accept=".svg"
            onChange={(e) => handleFileChange(e, "hoverSvg")}
            className="border p-1 rounded"
          />
        </div>

        {/* Clicked SVG Input */}
        <div className="mb-4">
          <label className="block">Clicked SVG:</label>
          <input
            type="file"
            accept=".svg"
            onChange={(e) => handleFileChange(e, "clickedSvg")}
            className="border p-1 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit
        </button>
      </div>

      {/* Canvas to Display SVG */}
      <div>
        <canvas ref={canvasRef} id="canvas" className="border shadow-lg" />
      </div>
    </div>
  );
};

export default AddSvgButton;
