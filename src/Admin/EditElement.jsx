import React, { useEffect, useRef, useState } from "react";
import FabricButton from "../classes/button";
import FabricText from "../classes/text";
import ButtonImage from "../classes/imageButton";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import load from "../assets/loading.gif";
import { API_KEY } from "../constant";
import FabricInputField from "../classes/inputField";

function EditElement({ type, element }) {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [Fonts, setFont] = useState([]);
  const [elementData, setElementData] = useState(element);
  const navigate = useNavigate();
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

  const calculateCenterPosition = (canvas) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    return { centerX, centerY };
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
    }
  };

  useEffect(() => {
    addElementToCanvas();
  }, [canvasObj, elementData]); // Trigger when canvasObj or elementData changes

  const createFabricElement = (element) => {
    if (!canvasObj) return null;
    const { centerX, centerY } = calculateCenterPosition(canvasObj);

    switch (element.type) {
      case "BasicButton":
        const fabricButtonElement = new FabricButton(
          canvasObj,
          centerX - element.width / 2 || element.fontSize || 20, // Set text's initial display at canvas center
          centerY - element.height / 2 || element.fontSize || 20,
          element.width,
          element.height,
          element.text,
          element.fontFamily,
          element.fontSize,
          element.textColor,
          element.idleColor,
          element.hoverColor,
          element.clickedColor,
          element.borderColor,
          element.borderThickness,
          element.onClick,
          element.onHover,
          element.onRelease
        ).buttonGroup;

        fabricButtonElement.set({
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });

        return fabricButtonElement;

      case "Text":
        const fabricTextElement = new FabricText(
          centerX - element.fontSize, // Set text's initial display at canvas center
          centerY - element.fontSize,
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

        fabricTextElement.set({
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });

        return fabricTextElement;

      case "InputField":
        const fabricElement = new FabricInputField(
          canvasObj,
          centerX - element.width / 2, // Set text's initial display at canvas center
          centerY - element.height / 2,
          element.width,
          element.height,
          element.placeholder,
          element.bgColor,
          element.borderColor,
          element.borderThickness,
          element.textColor,
          element.placeholderColor,
          element.fontSize,
          element.cursorBlinkSpeed,
          element.padding,
          element.fontFamily
        ).inputGroup;

        fabricElement.set({
          selectable: true, // Allow dragging
          hasControls: true, // Show controls for resizing, etc.
          hasBorders: true, // Show borders
        });

        return fabricElement;

      case "ButtonImage":
        const fabricButtonImageElement = new ButtonImage(
          canvasObj,
          element.x,
          element.y,
          [element.idleImage, element.hoverImage, element.clickedImage],
          element.scale
        ).getFabricElementAsync();

        return fabricButtonImageElement;

      default:
        return null;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name === "fontFamily") {
      loadFont(value);
    }

    const updatedValue =
      type === "checkbox"
        ? checked
        : [
            "width",
            "height",
            "borderThickness",
            "scale",
            "x",
            "y",
            "fontSize",
            "padding",
          ].includes(name)
        ? parseFloat(value) || 0
        : value || ""; // This ensures it will never be null

    setElementData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Handle image selection and convert to base64
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setElementData((prev) => ({
          ...prev,
          [name]: reader.result, // Base64 image data
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let response = null;
      if (elementData.type === "BasicButton") {
        response = await axios.put(
          `${API_KEY}api/buttons/${elementData._id}`,
          elementData
        );
      } else if (elementData.type === "Text") {
        response = await axios.put(
          `${API_KEY}api/texts/${elementData._id}`,
          elementData
        );
      } else if (elementData.type === "ButtonImage") {
        response = await axios.put(
          `${API_KEY}api/buttonImages/${elementData._id}`,
          elementData
        );
      } else if (elementData.type === "InputField") {
        response = await axios.put(
          `${API_KEY}api/inputfields/${elementData._id}`,
          elementData
        );
      }

      const result = await response.data;
      console.log("Element Updated:", result);
      setLoading(false);
      Swal.fire({
        title: "Element Updated Successfully",
        showCancelButton: false,
        confirmButtonText: "ok",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin");
        }
      });
    } catch (error) {
      console.error("Error saving button:", error);
      setLoading(false);
    }
  };

  // Fields to hide
  const excludedFields = [
    "_id",
    "id",
    "type",
    "createdAt",
    "updatedAt",
    "__v",
    "fontPath",
    "name",
    "onHover",
    "onRelease",
    "onClick",
    "scale",
    "cursorBlinkSpeed",
    "default_text",
    "padding_left",
    "padding_right",
    "padding_top",
    "padding_bottom",
    "on_input",
    "border_style",
  ];

  return (
    <div className="flex border rounded shadow-sm">
      <div className="w-[30%] h-[400px] p-4 overflow-auto">
        <h2 className="text-lg font-bold">Properties</h2>
        {Object.keys(elementData)
          .filter((key) => !excludedFields.includes(key)) // Exclude specific fields
          .map((key) => (
            <div key={key} className="mb-2">
              <label className="block">{key}:</label>

              {/* Handle image selection for ButtonImage */}
              {key === "idleImage" ||
              key === "hoverImage" ||
              key === "clickedImage" ? (
                <input
                  type="file"
                  accept="image/*"
                  name={key}
                  onChange={handleImageChange}
                  className="border p-1 rounded w-full"
                />
              ) : key === "input_type" ? (
                <select
                  name="input_type"
                  value={elementData.input_type || "text"}
                  onChange={handleInputChange}
                  className="p-2 w-[150px] border rounded"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                </select>
              ) : key === "fontFamily" ? (
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
                    key.includes("Color") || key.includes("color")
                      ? "color"
                      : key.includes("scale")
                      ? "number"
                      : key.includes("text")
                      ? "text"
                      : "text"
                  }
                  name={key}
                  value={elementData[key] || ""} // Ensure value is never null
                  onChange={handleInputChange}
                  className="border p-1 rounded w-full"
                />
              )}
            </div>
          ))}
        {!loading ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Update
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
}

export default EditElement;
