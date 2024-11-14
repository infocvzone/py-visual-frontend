import React, { useState, useEffect } from "react";
import axios from "axios"; // Add Axios for API requests
import { API_KEY } from "../constant";

const ElementEditor = ({ selectedElement, elements, setElements }) => {
  const [editedElement, setEditedElement] = useState(null);
  const [Fonts, setFont] = useState([]);

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

  // Update the local state when the selected element changes
  useEffect(() => {
    if (selectedElement) {
      console.log(selectedElement);
      setEditedElement({
        ...selectedElement,
      });
    }
  }, [selectedElement]);

  // Update elements list with the modified element
  const updateElementsList = (updatedElement) => {
    const updatedElements = elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    );
    setElements(updatedElements);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "fontFamily") {
      loadFont(value);
    }
    if (
      name === "borderThickness" ||
      name === "width" ||
      name === "height" ||
      name === "x1" ||
      name === "y1" ||
      name === "x2" ||
      name === "y2" ||
      name === "strokeWidth"
    ) {
      updatedValue = parseFloat(value);
    }
    const updatedElement = {
      ...editedElement,
      [name]: updatedValue,
    };

    setEditedElement(updatedElement);
    updateElementsList(updatedElement);
  };

  // Handle file input for selecting an image and upload it to the API
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      // Create a FormData object
      const formData = new FormData();
      formData.append("file", file); // Append the file with key 'file' (as multer expects)

      try {
        // Send a POST request to upload the image to your API
        const response = await axios.post(`${API_KEY}/api/upload/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Make sure it's multipart/form-data
          },
        });
        // Assuming the API returns the file information (with URL or ID) in response.data.file
        const imageUrl = `${API_KEY}` + response.data.fileUrl;
        const imageName = response.data.imageName;
        // Get the filename (or modify this based on your backend response)

        // Update the edited element with the new image URL
        const updatedElement = {
          ...editedElement,
          imageUrl: imageUrl,
          imageName: imageName, // Store the image URL (or ID) for further use
        };
        setEditedElement(updatedElement); // Update state with the new image URL
        updateElementsList(updatedElement); // Update the elements list with the new image URL
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  // Handle Save Changes if you still want to manually save changes
  const handleSaveChanges = () => {
    if (editedElement) {
      const updatedElements = elements.map((el) =>
        el.id === editedElement.id ? editedElement : el
      );
      setElements(updatedElements);
    }
  };

  // Handle removing the selected element from the list
  const handleRemoveElement = () => {
    const updatedElements = elements.filter((el) => el.id !== editedElement.id);
    setElements(updatedElements);
    setEditedElement(null); // Clear the editor once the element is removed
  };

  if (!editedElement) return null;

  // Function to render properties based on the type of element
  const renderPropertiesByType = () => {
    switch (editedElement.type) {
      case "BasicButton":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col items-center justify-center">
              <label className="block">Text</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-2 h-8 w-[100px] border rounded"
              />
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="block">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={editedElement.fontSize || 12}
                onChange={handleChange}
                className="p-2 h-8 w-[60px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Width</label>
              <input
                type="number"
                name="width"
                value={editedElement.width || 150}
                onChange={handleChange}
                className="p-2 h-8 w-[60px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Height</label>
              <input
                type="number"
                name="height"
                value={editedElement.height || 30}
                onChange={handleChange}
                className="p-2 h-8 w-[60px] border rounded"
              />
            </div>
            <div className="">
              <label className="block">Font Family</label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
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
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Border</label>
              <input
                type="number"
                name="borderThickness"
                value={editedElement.borderThickness || ""}
                onChange={handleChange}
                className="p-2 h-8 w-[60px] border rounded"
              />
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="block">Idle</label>
              <input
                type="color"
                name="idleColor"
                value={editedElement.idleColor || "#00000"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Hover</label>
              <input
                type="color"
                name="hoverColor"
                value={editedElement.hoverColor || "#00000"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Clicked</label>
              <input
                type="color"
                name="clickedColor"
                value={editedElement.clickedColor || "#00000"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Text</label>
              <input
                type="color"
                name="textColor"
                value={editedElement.textColor || "#00000"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Stroke</label>
              <input
                type="color"
                name="borderColor"
                value={editedElement.borderColor || "#00000"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">On_hover</label>
              <input
                type="text"
                name="onHover"
                value={editedElement.onHover || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">On_Click</label>
              <input
                type="text"
                name="onClick"
                value={editedElement.onClick || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">On_Release</label>
              <input
                type="text"
                name="onRelease"
                value={editedElement.onRelease || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </div>
        );
      case "InputField":
        return (
          <div className="flex flex-wrap gap-2">
            {/* Placeholder */}
            <div className="">
              <label className="block">Placeholder</label>
              <input
                type="text"
                name="placeholder"
                value={editedElement.placeholder || ""}
                onChange={handleChange}
                className="p-2 h-8 w-[120px] border rounded"
              />
            </div>

            {/* Default Text */}
            <div className="">
              <label className="block">Default Text</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-2 h-8 w-[120px] border rounded"
              />
            </div>

            {/* Input Type */}
            <div className="">
              <label className="block">Input Type</label>
              <select
                name="input_type"
                value={editedElement.input_type || "text"}
                onChange={handleChange}
                className="px-1 h-8 w-[140px] border rounded"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
              </select>
            </div>

            {/* Width */}
            <div className="">
              <label className="block">Width</label>
              <input
                type="number"
                name="width"
                value={editedElement.width || 300}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>

            {/* Height */}
            <div className="">
              <label className="block">Height</label>
              <input
                type="number"
                name="height"
                value={editedElement.height || 40}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>

            {/* Background Color */}
            <div className="">
              <label className="block">Background</label>
              <input
                type="color"
                name="bgColor"
                value={editedElement.bgColor || "#ffffff"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>

            {/* Border Color */}
            <div className="">
              <label className="block">Stroke</label>
              <input
                type="color"
                name="borderColor"
                value={editedElement.borderColor || "#c8c8c8"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>

            {/* Border Thickness */}
            <div className="">
              <label className="block">Border Thickness</label>
              <input
                type="number"
                name="borderThickness"
                value={editedElement.borderThickness || 1}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>

            {/* Text Color */}
            <div className="">
              <label className="block">Text Color</label>
              <input
                type="color"
                name="textColor"
                value={editedElement.textColor || "#323232"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>

            {/* Placeholder Color 
            <div className="">
              <label className="block">Placeholder Color</label>
              <input
                type="color"
                name="placeholderColor"
                value={editedElement.placeholderColor || "#c8c8c8"}
                onChange={handleChange}
                className="p-2 h-8 border rounded"
              />
            </div>*/}

            {/* Font Size */}
            <div className="">
              <label className="block">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={editedElement.fontSize || 15}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>

            {/* Font Family */}
            <div className="">
              <label className="block">Font Family</label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border w-[120px] p-1 rounded"
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

            {/* Padding Left */}
            <div className="">
              <label className="block">Padding Left</label>
              <input
                type="number"
                name="padding_left"
                value={editedElement.padding_left || 10}
                onChange={handleChange}
                className="p-2 h-8 w-[120px] border rounded"
              />
            </div>

            {/* Padding Right */}
            <div className="">
              <label className="block">Padding Right</label>
              <input
                type="number"
                name="padding_right"
                value={editedElement.padding_right || 10}
                onChange={handleChange}
                className="p-2 h-8 w-[120px] border rounded"
              />
            </div>

            {/* Padding Top */}
            <div className="">
              <label className="block">Padding Top</label>
              <input
                type="number"
                name="padding_top"
                value={editedElement.padding_top || 0}
                onChange={handleChange}
                className="p-2 h-8 w-[120px] border rounded"
              />
            </div>

            {/* Padding Bottom */}
            <div className="">
              <label className="block">Padding Bottom</label>
              <input
                type="number"
                name="padding_bottom"
                value={editedElement.padding_bottom || 10}
                onChange={handleChange}
                className="p-2 h-8 w-[120px] border rounded"
              />
            </div>

            {/* Border Style 
            <div className="">
              <label className="block">Border Style</label>
              <select
                name="border_style"
                value={
                  editedElement.border_style || [
                    "bottom",
                    "top",
                    "right",
                    "left",
                  ]
                }
                onChange={handleChange}
                className="p-2 h-8 w-full border rounded"
                multiple
              >
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>*/}

            {/* onInput (Optional) */}
            <div className="">
              <label className="block">On Input (Function)</label>
              <input
                type="text"
                name="on_input"
                value={editedElement.on_input || ""}
                onChange={handleChange}
                className="p-2 h-8 w-[120px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </div>
        );
      case "Text":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="">
              <label className="block">Text</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Color</label>
              <input
                type="color"
                name="color"
                value={editedElement.color || ""}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>

            <div className="">
              <label className="block">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={editedElement.fontSize || 20}
                onChange={handleChange}
                className="p-1 w-[70px] h-8 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Font Family</label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border w-[120px] p-1 rounded"
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

            {/* New properties for text styling */}
            <div className="">
              <label className="block">Bold</label>
              <input
                type="checkbox"
                name="bold"
                checked={!!editedElement.bold} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "bold", value: e.target.checked },
                  })
                }
                className="h-4 w-4 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Italic</label>
              <input
                type="checkbox"
                name="italic"
                checked={!!editedElement.italic} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "italic", value: e.target.checked },
                  })
                }
                className="h-4 w-4 border rounded"
              />
            </div>

            <div className="">
              <label className="block">U-line</label>
              <input
                type="checkbox"
                name="underline"
                checked={!!editedElement.underline} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "underline", value: e.target.checked },
                  })
                }
                className="h-4 w-4 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Strike</label>
              <input
                type="checkbox"
                name="strikethrough"
                checked={!!editedElement.strikethrough} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "strikethrough", value: e.target.checked },
                  })
                }
                className="h-4 w-4 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </div>
        );
      case "Toggle":
        return (
          <>
            <div className="">
              <label className="block">State</label>
              <input
                type="checkbox"
                name="initialState"
                checked={editedElement.initialState}
                onChange={(e) =>
                  handleChange({
                    target: { name: "initialState", value: e.target.checked },
                  })
                }
                className="p-2 h-6 w-8 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Scale</label>
              <input
                type="number"
                name="scale"
                value={editedElement.scale || ""}
                onChange={handleChange}
                className="p-2 h-8 w-10 border rounded"
              />
            </div>
          </>
        );
      case "Slider":
        return (
          <>
            <div className="">
              <label className="block">Min Value</label>
              <input
                type="number"
                name="minValue"
                value={editedElement.minValue || 0}
                onChange={handleChange}
                className="p-2 h-8 w-18 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Max Value</label>
              <input
                type="number"
                name="maxValue"
                value={editedElement.maxValue || 100}
                onChange={handleChange}
                className="p-2 h-8 w-18 border rounded"
              />
            </div>
          </>
        );
      case "Image":
        return (
          <div className="flex flex-wrap gap-2">
            <div>
              {/* Scale Range Input */}
              <label className="block">Scale:</label>
              <input
                type="range"
                name="scale_value"
                min="0.1"
                max="1.0"
                step="0.1"
                value={editedElement.scale_value || 1}
                onChange={handleChange}
                className="p-2 border rounded w-full mb-4"
              />
            </div>
            <div>
              {/* Hidden Checkbox */}
              <label className="block">Hidden:</label>
              <input
                type="checkbox"
                name="hiden"
                checked={editedElement.hiden || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "hiden", value: e.target.checked },
                  })
                }
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </div>
        );

      case "ButtonImage":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="">
              <label className="block">Scale:</label>
              <input
                type="number"
                name="scale"
                value={editedElement.scale || 1}
                onChange={handleChange}
                className="p-2 h-8 w-[60px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Text</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-2 h-8 w-[100px] border rounded"
              />
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="block">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={editedElement.fontSize || 12}
                onChange={handleChange}
                className="p-2 h-8 w-[60px] border rounded"
              />
            </div>
            <div className="">
              <label className="block">Font Family</label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border w-[120px] p-1 rounded w-[120px]"
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
            <div className="flex flex-col items-center justify-center">
              <label className="block">Color</label>
              <input
                type="color"
                name="textColor"
                value={editedElement.textColor || "#00000"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">On_hover</label>
              <input
                type="text"
                name="onHover"
                value={editedElement.onHover || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">On_Click</label>
              <input
                type="text"
                name="onClick"
                value={editedElement.onClick || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">On_Release</label>
              <input
                type="text"
                name="onRelease"
                value={editedElement.onRelease || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </div>
        );
      case "Checkbox":
        return (
          <>
            <div className="">
              <label className="block">Checked:</label>
              <input
                type="checkbox"
                name="checked"
                checked={editedElement.checked}
                onChange={(e) =>
                  handleChange({
                    target: { name: "checked", value: e.target.checked },
                  })
                }
                className="p-2 border rounded"
              />
            </div>
            <div className="">
              <label className="block">Checked / Unchecked Color:</label>
              <input
                type="text"
                name="colors"
                value={`${editedElement.colors.checkedColor}, ${editedElement.colors.uncheckedColor}`}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </div>
          </>
        );
      case "DropdownMenu":
        return (
          <>
            <div className="">
              <label className="block">Placeholder:</label>
              <input
                type="text"
                name="placeholder"
                value={editedElement.placeholder || ""}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Options (comma separated):</label>
              <input
                type="text"
                name="options"
                value={
                  editedElement.options ? editedElement.options.join(", ") : ""
                }
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "options",
                      value: e.target.value
                        .split(",")
                        .map((option) => option.trim()),
                    },
                  })
                }
                className="p-2 border rounded"
              />
            </div>

            <div className="">
              <label className="block">Background Color:</label>
              <input
                type="color"
                name="bgColor"
                value={editedElement.bgColor || "#ffffff"}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </div>
          </>
        );

      case "Line":
        return (
          <>
            <div className="flex flex-col items-center justify-center">
              <label className="block">X1</label>
              <input
                type="number"
                name="x1"
                value={editedElement.x1 || 100}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Y1</label>
              <input
                type="number"
                name="y1"
                value={editedElement.y1 || 100}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">X2</label>
              <input
                type="number"
                name="x2"
                value={editedElement.x2 || 300}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Y2</label>
              <input
                type="number"
                name="y2"
                value={editedElement.y2 || 100}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Width</label>
              <input
                type="number"
                name="strokeWidth"
                value={editedElement.strokeWidth || 2}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Color</label>
              <input
                type="color"
                name="Color"
                value={editedElement.Color || "#0f0f0f"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="tag"
                value={editedElement.tag || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </>
        );
      case "Circle":
        return (
          <>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Radius</label>
              <input
                type="number"
                name="radius"
                value={editedElement.radius || 15}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Color</label>
              <input
                type="color"
                name="Color"
                value={editedElement.Color || "#0f0f0f"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="tag"
                value={editedElement.tag || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </>
        );
      case "Rect":
        return (
          <>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Width</label>
              <input
                type="number"
                name="width"
                value={editedElement.width || 250}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Height</label>
              <input
                type="number"
                name="height"
                value={editedElement.height || 100}
                onChange={handleChange}
                className="p-2 h-8 w-[80px] border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Color</label>
              <input
                type="color"
                name="Color"
                value={editedElement.Color || "#0f0f0f"}
                onChange={handleChange}
                className="p-2 h-8 border rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Tag</label>
              <input
                type="text"
                name="tag"
                value={editedElement.tag || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-2 w-[120px] h-8 border rounded"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2 p-2 border mb-2 items-center justify-center bg-white shadow-md w-[95%]  mt-4 rounded-xs mx-auto">
      {renderPropertiesByType()}
      <div className="mt-6 flex justify-between">
        <button
          className="bg-red-500 text-white px-2 h-8 rounded-md"
          onClick={handleRemoveElement}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default ElementEditor;
