import React, { useEffect, useRef, useState } from "react";
import FabricText from "../classes/output/text";
import axios from "axios";
import Swal from "sweetalert2";
import load from "../assets/loading.gif";
import { API_KEY } from "../constant";

const AddText = () => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [boundingBox, setBoundingBox] = useState({ width: 0, height: 0 });
  const [Fonts, setFont] = useState([]);
  const [elementData, setElementData] = useState({
    type: "Text",
    x: 150,
    y: 150,
    text: "Text",
    scale: 1.0,
    color: "#000000",
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const [loading, setLoading] = useState(false);
  const [fontFile, setFontFile] = useState(null);
  const [fontName, setFontName] = useState("");

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
    addElementToCanvas();
  }, [canvasObj, elementData]); // Trigger when canvasObj or elementData changes

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

    // Calculate the canvas center position
    const { centerX, centerY } = calculateCenterPosition(canvasObj);

    // Create the FabricText object and use the center position for display
    const fabricElement = new FabricText(
      centerX - element.fontSize, // Set text's initial display at canvas center
      centerY - element.fontSize, // Set text's initial display at canvas center
      element.text,
      element.scale,
      element.fontPath || null,
      element.color,
      element.fontFamily || "Roboto-Bold",
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

    // Calculate bounding box and set it in the state
    const boundingRect = fabricElement.getBoundingRect();
    setBoundingBox({
      width: boundingRect.width,
      height: boundingRect.height,
    });

    return fabricElement;
  };
  // Handle input changes, including parsing numerical values and handling checkboxes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "fontFamily") {
      loadFont(value);
    }

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

  // Handle submit to send text data to API
  const handleTextSubmit = async () => {
    setLoading(true);
    try {
      console.log(elementData);
      const response = await axios.post(`${API_KEY}api/texts/`, elementData);
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
      setLoading(false);
    }
  };

  // Handle font upload
  const handleFontUpload = async () => {
    if (!fontFile || !fontName) {
      Swal.fire({
        title: "Error!",
        text: "Please provide a font file and font name.",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("fontFile", fontFile);
    formData.append("fontName", fontName);

    try {
      setLoading(true);
      // Send font file to API
      const response = await axios.post(`${API_KEY}api/fonts/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Fetch updated font list
        const updatedFontsResponse = await axios.get(`${API_KEY}api/fonts/`);
        setFont(updatedFontsResponse.data);
        Swal.fire({
          title: "Font Uploaded Successfully!",
          text: `Font ${fontName} added.`,
          icon: "success",
        });
        // Clear input fields
        setFontFile(null);
        setFontName("");
      }
    } catch (error) {
      console.error("Error uploading font:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to upload font.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex border rounded shadow-sm">
      <div className="w-[30%] h-[400px] p-4 overflow-auto">
        <h2 className="text-lg font-bold">Properties</h2>
        {Object.keys(elementData).map(
          (key) =>
            key !== "scale" && ( // Exclude 'scale' from rendering
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
                    readOnly={["type", "x", "y"].includes(key)} // Make specific fields non-editable
                  />
                )}
              </div>
            )
        )}
        {!loading ? (
          <button
            onClick={handleTextSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        ) : (
          <img src={load} alt="loading" className="w-[50px] h-[50px]" />
        )}

        {/* Font Upload Section */}
        <h2 className="text-lg font-bold mt-6">Upload Font</h2>
        <input
          type="file"
          accept=".ttf,.otf" // Accepting only font files
          onChange={(e) => setFontFile(e.target.files[0])}
          className="border p-1 rounded"
        />
        <input
          type="text"
          placeholder="Font Name"
          value={fontName}
          onChange={(e) => setFontName(e.target.value)}
          className="border p-1 rounded mt-2"
        />
        <button
          onClick={handleFontUpload}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Upload Font
        </button>
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
