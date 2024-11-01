import React, { useEffect, useRef, useState } from "react";
import ButtonImage from "../classes/imageButton";
import axios from "axios";
import Swal from "sweetalert2";
import { API_KEY } from "../constant";

import idle from "../assets/buttons/sample/idle.png";
import clicked from "../assets/buttons/sample/clicked.png";
import hover from "../assets/buttons/sample/hover.png";

const AddButtonImage = () => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [Fonts, setFont] = useState([]);
  const [elementData, setElementData] = useState({
    x: 100,
    y: 100,
    scale: 1.0,
    Name: "ButtonImage",
    idleImage: idle,
    hoverImage: clicked,
    clickedImage: hover,
    text: "",
    text_ancher: "center",
    textColor: "#000000",
    fontFamily: "Roboto-Bold",
    fontSize: 16,
  });

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

  const addElementToCanvas = async () => {
    if (!canvasObj) return;
    canvasObj.clear();

    const fabricElement = await createFabricElement(elementData);
    if (fabricElement) {
      canvasObj.add(fabricElement);
      canvasObj.renderAll();
    }
  };

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/fonts/`);
        setFont(response.data); // Assuming response.data contains an array of font objects
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchFonts();
  }, []); // Added empty dependency array to run only once on mount

  const loadFont = (fontName) => {
    WebFont.load({
      google: {
        families: [fontName],
      },
    });
  };

  useEffect(() => {
    addElementToCanvas();
  }, [canvasObj, elementData]);

  const createFabricElement = async (element) => {
    if (!canvasObj) return null;

    const fabricElement = new ButtonImage(
      canvasObj,
      element.x,
      element.y,
      element.idleImage,
      element.hoverImage,
      element.clickedImage,
      element.scale,
      element.text,
      element.textColor,
      element.fontFamily,
      element.fontSize
    );

    return await fabricElement.getFabricElementAsync();
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setElementData((prev) => ({
          ...prev,
          [type]: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fontfamily") {
      loadFont(value);
    }
    setElementData((prev) => ({
      ...prev,
      [name]: ["scale", "fontSize", "x", "y"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log(elementData);
      const response = await axios.post(
        `${API_KEY}api/buttonImages/`,
        elementData
      );
      const result = response.data;
      console.log("Button Image saved:", result);
      Swal.fire({
        title: "Button Image Added Successfully",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error saving button image:", error);
    }
  };

  return (
    <div className="flex border rounded shadow-sm gap-4 items-center justify-between p-4">
      <div className="w-[30%] h-[400px] p-4 overflow-auto">
        <h2 className="text-lg font-bold">Button Images Properties</h2>

        {/** X Position */}
        <div className="mb-4">
          <label className="block">X Position:</label>
          <input
            type="number"
            name="x"
            value={elementData.x}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
        </div>

        {/** Y Position */}
        <div className="mb-4">
          <label className="block">Y Position:</label>
          <input
            type="number"
            name="y"
            value={elementData.y}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block">Name:</label>
          <input
            type="text"
            name="Name"
            value={elementData.Name}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
        </div>

        {/** Scale */}
        <div className="mb-4">
          <label className="block">Scale:</label>
          <input
            type="range"
            name="scale"
            min="0.1"
            max="1.0"
            step="0.1"
            value={elementData.scale}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
          <span>{elementData.scale}</span>
        </div>

        {/** Text */}
        <div className="mb-4">
          <label className="block">Button Text:</label>
          <input
            type="text"
            name="text"
            value={elementData.text}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
        </div>

        {/** Text Color */}
        <div className="mb-4">
          <label className="block">Text Color:</label>
          <input
            type="color"
            name="textColor"
            value={elementData.textColor}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
        </div>

        {/** Font Family */}
        <div className="mb-4">
          <label className="block">Font Family</label>
          <select
            name="fontFamily"
            value={elementData.fontFamily}
            onChange={handleInputChange}
            className="border p-1 rounded w-[120px]"
          >
            {/* Map the fetched fonts to options */}
            {Fonts.map((font, index) => (
              <option key={index} value={font.name}>
                {font.name}{" "}
                {/* Assuming 'family' is the property holding the font name */}
              </option>
            ))}
          </select>
        </div>

        {/** Font Size */}
        <div className="mb-4">
          <label className="block">Font Size:</label>
          <input
            type="number"
            name="fontSize"
            value={elementData.fontSize}
            onChange={handleInputChange}
            className="border p-1 rounded"
          />
        </div>

        {/** Idle Image */}
        <div className="mb-4">
          <label className="block">Idle Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "idleImage")}
            className="border p-1 rounded"
          />
        </div>

        {/** Hover Image */}
        <div className="mb-4">
          <label className="block">Hover Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "hoverImage")}
            className="border p-1 rounded"
          />
        </div>

        {/** Clicked Image */}
        <div className="mb-4">
          <label className="block">Clicked Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "clickedImage")}
            className="border p-1 rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit
        </button>
      </div>

      <div>
        <canvas ref={canvasRef} id="canvas" className="border shadow-lg" />
      </div>
    </div>
  );
};

export default AddButtonImage;
