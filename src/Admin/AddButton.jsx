import React, { useEffect, useRef, useState } from "react";
import FabricButton from "../classes/button";
import axios from "axios";
import Swal from "sweetalert2";
import load from "../assets/loading.gif";
import { API_KEY } from "../constant";
import ColorComponent from "../User/colorComponent";
//import { fabric } from 'fabric';

const AddButton = () => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [boundingBox, setBoundingBox] = useState({ width: 0, height: 0 });
  const [Fonts, setFont] = useState([]);
  const [elementData, setElementData] = useState({
    type: "BasicButton",
    x: 150,
    y: 150,
    name: "Button",
    width: 150,
    height: 30,
    text: "Submit",
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    textColor: "rgba(255,255,255,100)",
    idleColor: "rgba(155,155,155,1)",
    borderColor: "rgba(0,0,0,1",
    borderThickness: 0,
    opacity: 1, // Default opacity
    borderRadius: 0,
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

  useEffect(() => {
    WebFont.load({
      google: {
        families: [elementData.fontFamily],
      },
    });
  }, []);

  const loadFont = (fontName) => {
    WebFont.load({
      google: {
        families: [fontName],
      },
    });
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

  const createFabricElement = (element) => {
    if (!canvasObj) return null;
    const { centerX, centerY } = calculateCenterPosition(canvasObj);

    const fabricElement = new FabricButton(
      canvasObj,
      centerX - element.width / 2, // Set text's initial display at canvas center
      centerY - element.height / 2,
      element.width,
      element.height,
      element.text,
      element.fontFamily,
      element.fontSize,
      element.textColor,
      element.idleColor,
      element.borderColor,
      element.borderThickness,
      element.opacity, // Default opacity
      element.borderRadius,
      element.onClick,
      element.onHover,
      element.onRelease,
      element.bold,
      element.italic,
      element.underline,
      element.strikethrough
    ).buttonGroup;

    fabricElement.set({
      selectable: true, // Allow dragging
      hasControls: true, // Show controls for resizing, etc.
      hasBorders: true, // Show borders
    });
    // Calculate bounding box and set it in the state
    const boundingRect = fabricElement.getBoundingRect();
    setBoundingBox({
      width: boundingRect.width,
      height: boundingRect.height,
    });

    return fabricElement;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "fontFamily") {
      loadFont(value);
    }

    // Determine the updated value based on the input type
    let updatedValue =
      type === "checkbox"
        ? checked // Handle checkbox values
        : [
            "width",
            "height",
            "borderThickness",
            "fontSize",
            "opacity",
            "borderRadius",
          ].includes(name)
        ? parseFloat(value) || 0 // Convert to float, default to 1 if NaN for specific fields
        : value || ""; // Keep as string for other fields

    if (name.includes("Color")) {
      updatedValue = `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
    }

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
      const response = await axios.post(`${API_KEY}api/buttons/`, elementData);
      const result = await response.data;
      console.log("Button saved:", result);
      setLoading(false);
      Swal.fire({
        title: "Button Added Successfully",
        showCancelButton: false,
        confirmButtonText: "ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error saving button:", error);
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
            ) : key.includes("Color") ? (
              <div>
                <ColorComponent
                  Name={key}
                  elementColor={elementData[key]}
                  Function={handleInputChange}
                />
              </div>
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
                  key.includes("Color")
                    ? "color"
                    : key.includes("borderThickness") ||
                      key.includes("height") ||
                      key.includes("width") ||
                      key.includes("opacity") ||
                      key.includes("borderRadius")
                    ? "number"
                    : "text"
                }
                name={key}
                value={elementData[key]}
                onChange={handleInputChange}
                className="border p-1 rounded"
                readOnly={["type", "x", "y"].includes(key)}
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

export default AddButton;
