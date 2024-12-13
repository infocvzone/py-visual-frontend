import React, { useState, useEffect } from "react";
import axios from "axios"; // Add Axios for API requests
import { API_KEY } from "../constant";
import deleteImage from "../assets/delete.png";

const ElementEditor = ({ selectedElement, elements, setElements }) => {
  const [editedElement, setEditedElement] = useState(null);
  const [Fonts, setFont] = useState([]);
  const [colorIndexMap, setColorIndexMap] = useState({});
  const [svgFills, setSvgFills] = useState([]);

  const [idelcolorIndexMap, setIdelColorIndexMap] = useState({});
  const [idelsvgFills, setIdelSvgFills] = useState([]);

  const [hovercolorIndexMap, setHoverColorIndexMap] = useState({});
  const [hoversvgFills, setHoverSvgFills] = useState([]);

  const [clickedcolorIndexMap, setClickedColorIndexMap] = useState({});
  const [clickedsvgFills, setClickedSvgFills] = useState([]);

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
      // Extract fill values from SVG string and update state
      if (selectedElement.webformatURL) {
        extractFillValues(selectedElement.webformatURL);
      } else if (selectedElement.type === "ButtonSvg") {
        extractIdleSvgFillValues(selectedElement.idleImage);
        extractHoverSvgFillValues(selectedElement.hoverImage);
        extractClickedSvgFillValues(selectedElement.clickedImage);
      }
    }
  }, [selectedElement]);

  const extractIdleSvgFillValues = (svgString) => {
    const regex = /fill="([^"]*)"/g;
    let matches = [];
    let match;
    while ((match = regex.exec(svgString)) !== null) {
      matches.push(match[1]); // Push fill values to the array
    }
    const colorMap = {};
    matches.forEach((color, index) => {
      if (!colorMap[color]) {
        colorMap[color] = [];
      }
      colorMap[color].push(index);
    });
    const uniqueColors = [...new Set(matches)];
    setIdelSvgFills(uniqueColors);
    setIdelColorIndexMap(colorMap);
  };
  const extractHoverSvgFillValues = (svgString) => {
    const regex = /fill="([^"]*)"/g;
    let matches = [];
    let match;
    while ((match = regex.exec(svgString)) !== null) {
      matches.push(match[1]); // Push fill values to the array
    }
    const colorMap = {};
    matches.forEach((color, index) => {
      if (!colorMap[color]) {
        colorMap[color] = [];
      }
      colorMap[color].push(index);
    });
    const uniqueColors = [...new Set(matches)];
    setHoverSvgFills(uniqueColors);
    setHoverColorIndexMap(colorMap);
  };
  const extractClickedSvgFillValues = (svgString) => {
    const regex = /fill="([^"]*)"/g;
    let matches = [];
    let match;
    while ((match = regex.exec(svgString)) !== null) {
      matches.push(match[1]); // Push fill values to the array
    }
    const colorMap = {};
    matches.forEach((color, index) => {
      if (!colorMap[color]) {
        colorMap[color] = [];
      }
      colorMap[color].push(index);
    });
    const uniqueColors = [...new Set(matches)];
    setClickedSvgFills(uniqueColors);
    setClickedColorIndexMap(colorMap);
  };
  const extractFillValues = (svgString) => {
    const regex = /fill="([^"]*)"/g; // Regex to find fill attributes
    let matches = [];
    let match;

    // Extract all colors and map them to their indices
    while ((match = regex.exec(svgString)) !== null) {
      matches.push(match[1]); // Push fill values to the array
    }

    // Create a mapping from color to their indices
    const colorMap = {};
    matches.forEach((color, index) => {
      if (!colorMap[color]) {
        colorMap[color] = [];
      }
      colorMap[color].push(index);
    });

    // Extract unique colors (to display as input fields)
    const uniqueColors = [...new Set(matches)];

    setSvgFills(uniqueColors); // Update state with unique fill values
    setColorIndexMap(colorMap);
  };

  /*---------------------------------------------------------------------------------*/

  const updateIdelSvgFill = (color, newFill) => {
    if (!editedElement.idleImage) return;

    let svgString = editedElement.idleImage;

    // Get the indexes of the color that needs to be updated
    const indexesToUpdate = idelcolorIndexMap[color] || [];

    // Replace all occurrences of the selected color
    let updatedSvgString = svgString.replace(
      /fill="([^"]*)"/g,
      (matchStr, currentColor) => {
        if (indexesToUpdate.length > 0 && currentColor === color) {
          return `fill="${newFill}"`; // Replace all instances of the selected color
        }
        return matchStr; // Keep other fills unchanged
      }
    );

    // Update the SVG string in editedElement
    const updatedElement = {
      ...editedElement,
      idleImage: updatedSvgString,
    };
    setEditedElement(updatedElement);
    updateElementsList(updatedElement); // Update elements list
  };

  const updateHoverSvgFill = (color, newFill) => {
    if (!editedElement.hoverImage) return;
    let svgString = editedElement.hoverImage;
    const indexesToUpdate = hovercolorIndexMap[color] || [];
    let updatedSvgString = svgString.replace(
      /fill="([^"]*)"/g,
      (matchStr, currentColor) => {
        if (indexesToUpdate.length > 0 && currentColor === color) {
          return `fill="${newFill}"`;
        }
        return matchStr;
      }
    );
    const updatedElement = {
      ...editedElement,
      hoverImage: updatedSvgString,
    };
    setEditedElement(updatedElement);
    updateElementsList(updatedElement); // Update elements list
  };

  const updateClickedSvgFill = (color, newFill) => {
    if (!editedElement.clickedImage) return;
    let svgString = editedElement.clickedImage;
    const indexesToUpdate = clickedcolorIndexMap[color] || [];
    let updatedSvgString = svgString.replace(
      /fill="([^"]*)"/g,
      (matchStr, currentColor) => {
        if (indexesToUpdate.length > 0 && currentColor === color) {
          return `fill="${newFill}"`;
        }
        return matchStr;
      }
    );
    const updatedElement = {
      ...editedElement,
      clickedImage: updatedSvgString,
    };
    setEditedElement(updatedElement);
    updateElementsList(updatedElement); // Update elements list
  };

  const updateSvgFill = (color, newFill) => {
    if (!editedElement.webformatURL) return;

    let svgString = editedElement.webformatURL;

    // Get the indexes of the color that needs to be updated
    const indexesToUpdate = colorIndexMap[color] || [];

    // Replace all occurrences of the selected color
    let updatedSvgString = svgString.replace(
      /fill="([^"]*)"/g,
      (matchStr, currentColor) => {
        if (indexesToUpdate.length > 0 && currentColor === color) {
          return `fill="${newFill}"`; // Replace all instances of the selected color
        }
        return matchStr; // Keep other fills unchanged
      }
    );

    // Update the SVG string in editedElement
    const updatedElement = {
      ...editedElement,
      webformatURL: updatedSvgString,
    };
    setEditedElement(updatedElement);
    updateElementsList(updatedElement); // Update elements list
  };

  /*---------------------------------------------------------------------------------*/

  // Update elements list with the modified element
  const updateElementsList = (updatedElement) => {
    const updatedElements = elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    );
    setElements(updatedElements);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "fontFamily") {
      loadFont(value);
    }
    if (
      (editedElement.type === "ButtonImage" ||
        editedElement.type === "Image") &&
      (name === "scale" || name === "scale_value")
    ) {
      if (updatedValue > 1) {
        updatedValue = 1;
      }
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

    if (name === "borderThickness") {
      if (updatedValue < 0) {
        updatedValue = 0;
      }
    }

    let updatedElement = {
      ...editedElement,
      [name]: updatedValue,
    };

    if (
      updatedElement.type === "Image" &&
      name === "makeButton" &&
      value === true
    ) {
      updatedElement = {
        idleImage: editedElement.webformatURL,
        hoverImage: editedElement.webformatURL,
        clickedImage: editedElement.webformatURL,
        onHover: null,
        onClick: null,
        onRelease: null,
        text: "",
        fontFamily: "Roboto",
        fontSize: 12,
        textColor: "#ffffff",
        type: "ButtonImage",
        scale: editedElement.scale_value,
        id: editedElement.id,
        variableName: "ButtonImage",
        name: null,
        tag: null,
        fromImage: true,
      };
    }
    if (
      updatedElement.type === "Svg" &&
      name === "makeButton" &&
      value === true
    ) {
      updatedElement = {
        idleImage: editedElement.webformatURL,
        hoverImage: editedElement.webformatURL,
        clickedImage: editedElement.webformatURL,
        onHover: null,
        onClick: null,
        onRelease: null,
        text: "",
        fontFamily: "Roboto",
        fontSize: 12,
        textColor: "#ffffff",
        type: "ButtonSvg",
        scale: editedElement.scale_value,
        id: editedElement.id,
        variableName: "ButtonSvg",
        name: null,
        tag: null,
      };
    }

    console.log(updatedElement);
    setEditedElement(updatedElement);
    updateElementsList(updatedElement);
  };

  /*---------------------------------------------------------------------------------*/

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
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Dimensions</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "width",
                        value: (editedElement.width || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="width"
                  value={editedElement.width || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "width",
                        value: (editedElement.width || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Height</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "height",
                        value: (editedElement.height || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="height"
                  value={editedElement.height || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "height",
                        value: (editedElement.height || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Font</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-[5px]  w-[90px] border text-xs rounded-lg"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">
                Font Family
              </label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border text-xs rounded-lg px-[5px] py-[5px] w-[100px]"
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

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Font</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="fontSize"
                  value={editedElement.fontSize || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs text-transparent">Text</label>
              <input
                type="color"
                name="textColor"
                value={editedElement.textColor || "#00000"}
                onChange={handleChange}
                className="color"
              />
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs">Colors</label>
              <input
                type="color"
                name="idleColor"
                value={editedElement.idleColor || "#00000"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs text-transparent">Hover</label>
              <input
                type="color"
                name="hoverColor"
                value={editedElement.hoverColor || "#00000"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs text-transparent">Clicked</label>
              <input
                type="color"
                name="clickedColor"
                value={editedElement.clickedColor || "#00000"}
                onChange={handleChange}
                className="color"
              />
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs">Border</label>
              <input
                type="color"
                name="borderColor"
                value={editedElement.borderColor || "#00000"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Border</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderThickness",
                        value: (editedElement.borderThickness || 0) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="borderThickness"
                  value={editedElement.borderThickness || 0}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderThickness",
                        value: (editedElement.borderThickness || 0) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
          </div>
        );
      case "InputField":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Dimensions</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "width",
                        value: (editedElement.width || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="width"
                  value={editedElement.width || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "width",
                        value: (editedElement.width || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Height */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Height</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "height",
                        value: (editedElement.height || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="height"
                  value={editedElement.height || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "height",
                        value: (editedElement.height || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            {/* Placeholder */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Placeholder</label>
              <input
                type="text"
                name="placeholder"
                value={editedElement.placeholder || ""}
                onChange={handleChange}
                className="p-[5px]  w-[90px] border text-xs rounded-lg"
              />
            </div>

            {/* Default Text */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Text</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-[5px]  w-[80px] border text-xs rounded-lg"
              />
            </div>

            {/* Input Type */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Input Type</label>
              <select
                name="input_type"
                value={editedElement.input_type || "text"}
                onChange={handleChange}
                className="p-[5px]  w-[80px] border text-xs rounded-lg"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
              </select>
            </div>
            {/* Placeholder Color 
            <div className="">
              <label className="block text-xs">Placeholder Color</label>
              <input
                type="color"
                name="placeholderColor"
                value={editedElement.placeholderColor || "#c8c8c8"}
                onChange={handleChange}
                className="color"
              />
            </div>*/}
            {/* Background Color */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Color</label>
              <input
                type="color"
                name="bgColor"
                value={editedElement.bgColor || "#ffffff"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            {/* Font Size */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Font</label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border text-xs rounded-lg px-[5px] py-[5px] w-[100px]"
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

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Font</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="fontSize"
                  value={editedElement.fontSize || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Text Color */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Color</label>
              <input
                type="color"
                name="textColor"
                value={editedElement.textColor || "#323232"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            {/* Border Color */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs ">Border</label>
              <input
                type="color"
                name="borderColor"
                value={editedElement.borderColor || "#c8c8c8"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Font</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderThickness",
                        value: (editedElement.borderThickness || 0) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="borderThickness"
                  value={editedElement.borderThickness || 0}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderThickness",
                        value: (editedElement.borderThickness || 0) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
          </div>
        );
      case "Text":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Font</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-[5px]  w-[80px] border text-xs rounded-lg"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Font</label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border text-xs rounded-lg px-[5px] py-[5px] w-[100px]"
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

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Font</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="fontSize"
                  value={editedElement.fontSize || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Color</label>
              <input
                type="color"
                name="color"
                value={editedElement.color || ""}
                onChange={handleChange}
                className="color"
              />
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            {/* New properties for text styling */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Bold</label>
              <input
                type="checkbox"
                name="bold"
                checked={!!editedElement.bold} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "bold", value: e.target.checked },
                  })
                }
                className="h-5 w-5 border rounded"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Italic</label>
              <input
                type="checkbox"
                name="italic"
                checked={!!editedElement.italic} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "italic", value: e.target.checked },
                  })
                }
                className="h-5 w-5 border rounded"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">U-line</label>
              <input
                type="checkbox"
                name="underline"
                checked={!!editedElement.underline} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "underline", value: e.target.checked },
                  })
                }
                className="h-5 w-5 border rounded"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Strike</label>
              <input
                type="checkbox"
                name="strikethrough"
                checked={!!editedElement.strikethrough} // Ensure boolean value
                onChange={(e) =>
                  handleChange({
                    target: { name: "strikethrough", value: e.target.checked },
                  })
                }
                className="h-5 w-5 border rounded"
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
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

      case "Svg":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Scale</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale_value",
                        value: (editedElement.scale_value || 1) - 0.1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="scale_value"
                  value={editedElement.scale_value || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale_value",
                        value: (editedElement.scale_value || 1) + 0.1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            {/* Loop through all the fill values and display them as color pickers */}
            {svgFills.map((color, index) => (
              <div key={index} className="flex flex-col">
                <label className="block text-xs text-transparent">Scale</label>
                {/* <label className="block">{`Fill ${index + 1}`}</label> */}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateSvgFill(color, e.target.value)}
                  className="color"
                />
              </div>
            ))}

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Hidden:</label>
              <input
                type="checkbox"
                name="hiden"
                checked={editedElement.hiden || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "hiden", value: e.target.checked },
                  })
                }
                className="p-2 h-5 w-5 border rounded"
              />
            </div>
            <div className="flex flex-col justify-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Make Button</label>
              <input
                type="checkbox"
                name="makeButton"
                checked={editedElement.makeButton || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "makeButton", value: e.target.checked },
                  })
                }
                className="p-2 w-5 h-5 border rounded"
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            {/* Other SVG properties */}
          </div>
        );
      case "Image":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Scale</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale_value",
                        value: (editedElement.scale_value || 1) - 0.1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="scale_value"
                  value={editedElement.scale_value || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale_value",
                        value: (editedElement.scale_value || 1) + 0.1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            {/* <div>
               Scale Range Input 
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
            </div>*/}
            <div className="flex flex-col justify-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Hidden</label>
              <input
                type="checkbox"
                name="hiden"
                checked={editedElement.hiden || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "hiden", value: e.target.checked },
                  })
                }
                className="p-2 w-5 h-5 border rounded"
              />
            </div>
            <div className="flex flex-col justify-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Make Button</label>
              <input
                type="checkbox"
                name="makeButton"
                checked={editedElement.makeButton || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "makeButton", value: e.target.checked },
                  })
                }
                className="p-2 w-5 h-5 border rounded"
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
          </div>
        );

      case "ButtonSvg":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Scale</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale",
                        value: (editedElement.scale || 1) - 0.1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="scale"
                  value={editedElement.scale || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale",
                        value: (editedElement.scale || 1) + 0.1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Font</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-[5px]  w-[90px] border text-xs rounded-lg"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">
                Font Family
              </label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border text-xs rounded-lg px-[5px] py-[5px] w-[100px]"
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

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Font</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="fontSize"
                  value={editedElement.fontSize || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs text-transparent">Text</label>
              <input
                type="color"
                name="textColor"
                value={editedElement.textColor || "#00000"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            {/* Loop through all the fill values and display them as color pickers */}
            {idelsvgFills.map((color, index) => (
              <div key={index} className="flex flex-col">
                <label className="block text-xs text-transparent">Idle</label>
                {/* <label className="block">{`Fill ${index + 1}`}</label> */}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateIdelSvgFill(color, e.target.value)}
                  className="color"
                />
              </div>
            ))}

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            {/* Loop through all the fill values and display them as color pickers */}
            {hoversvgFills.map((color, index) => (
              <div key={index} className="flex flex-col">
                <label className="block text-xs text-transparent">Hover</label>
                {/* <label className="block">{`Fill ${index + 1}`}</label> */}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateHoverSvgFill(color, e.target.value)}
                  className="color"
                />
              </div>
            ))}

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            {/* Loop through all the fill values and display them as color pickers */}
            {clickedsvgFills.map((color, index) => (
              <div key={index} className="flex flex-col">
                <label className="block text-xs text-transparent">
                  Clicked
                </label>
                {/* <label className="block">{`Fill ${index + 1}`}</label> */}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateClickedSvgFill(color, e.target.value)}
                  className="color"
                />
              </div>
            ))}

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
          </div>
        );

      case "ButtonImage":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Scale</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale",
                        value: (editedElement.scale || 1) - 0.1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="scale"
                  value={editedElement.scale || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "scale",
                        value: (editedElement.scale || 1) + 0.1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Font</label>
              <input
                type="text"
                name="text"
                value={editedElement.text || ""}
                onChange={handleChange}
                className="p-[5px]  w-[90px] border text-xs rounded-lg"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">
                Font Family
              </label>
              <select
                name="fontFamily"
                value={editedElement.fontFamily}
                onChange={handleChange}
                className="border text-xs rounded-lg px-[5px] py-[5px] w-[100px]"
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

            <div className="flex flex-col justify-center">
              <label className="block text-xs text-transparent">Font</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="fontSize"
                  value={editedElement.fontSize || 150}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "fontSize",
                        value: (editedElement.fontSize || 150) + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs text-transparent">Text</label>
              <input
                type="color"
                name="textColor"
                value={editedElement.textColor || "#00000"}
                onChange={handleChange}
                className="color"
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
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

  const renderPropertiesForFunctionalities = () => {
    switch (editedElement.type) {
      case "BasicButton":
        return (
          <div className="flex flex-col space-y-[10px]">
            <h1 className="text-lg py-1">General</h1>
            <div className="flex flex-col">
              <label className="block text-[10px]">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-[10px]">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <h1 className="text-lg py-1">Functions</h1>
            <div className="flex flex-col">
              <label className="block text-[10px]">On_hover</label>
              <input
                type="text"
                name="onHover"
                value={editedElement.onHover || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-[10px]">On_Click</label>
              <input
                type="text"
                name="onClick"
                value={editedElement.onClick || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-[10px]">On_Release</label>
              <input
                type="text"
                name="onRelease"
                value={editedElement.onRelease || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
          </div>
        );

      case "InputField":
        return (
          <div>
            <h1 className="text-lg py-1">General</h1>
            {/* Padding Left */}
            <div className="flex flex-col">
              <label className="block text-[10px]">Padding Left</label>
              <input
                type="number"
                name="padding_left"
                value={editedElement.padding_left || 10}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>

            {/* Padding Right */}
            <div className="flex flex-col">
              <label className="block text-[10px]">Padding Right</label>
              <input
                type="number"
                name="padding_right"
                value={editedElement.padding_right || 10}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>

            {/* Padding Top */}
            <div className="flex flex-col">
              <label className="block text-[10px]">Padding Top</label>
              <input
                type="number"
                name="padding_top"
                value={editedElement.padding_top || 0}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>

            {/* Padding Bottom */}
            <div className="flex flex-col">
              <label className="block text-[10px]">Padding Bottom</label>
              <input
                type="number"
                name="padding_bottom"
                value={editedElement.padding_bottom || 10}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>

            {/* onInput (Optional) */}
            <h1 className="text-lg py-1">Functions</h1>
            <div className="flex flex-col">
              <label className="block text-[10px]">On Input (Function)</label>
              <input
                type="text"
                name="on_input"
                value={editedElement.on_input || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-[10px]">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-[10px]">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
          </div>
        );
      case "Text":
        return (
          <div className="flext felx-col space-y-2">
            <h1 className="text-lg py-1">Functions</h1>
            <div className="flex flex-col">
              <label className="bloc text-xs">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-xs">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
          </div>
        );
      case "ButtonImage":
        return (
          <div className="flex flex-col space-y-[10px]">
            <h1 className="text-lg py-1">General</h1>
            <div className="flex flex-col">
              <label className="block text-xs">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-xs">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <h1 className="text-lg py-1">Functions</h1>

            <div className="flex flex-col">
              <label className="block text-xs">On_hover</label>
              <input
                type="text"
                name="onHover"
                value={editedElement.onHover || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-xs">On_Click</label>
              <input
                type="text"
                name="onClick"
                value={editedElement.onClick || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-xs">On_Release</label>
              <input
                type="text"
                name="onRelease"
                value={editedElement.onRelease || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
          </div>
        );
      case "Image":
        return (
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-lg py-1">General</h1>
            <div className="flex flex-col">
              <label className="block text-xs">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-xs">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
          </div>
        );

      case "Svg":
        return (
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-lg py-1">General</h1>
            <div className="flex flex-col">
              <label className="block text-xs">Tag</label>
              <input
                type="text"
                name="name"
                value={editedElement.name || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-xs">Variable Name</label>
              <input
                type="text"
                name="variableName"
                value={editedElement.variableName || ""}
                onChange={handleChange}
                className="p-1 w-full text-xs h-8 border rounded"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header className="flex gap-2 py-3 px-1 items-center justify-center bg-white shadow-md w-[90%] mx-auto rounded-xl mt-2">
        <div>{renderPropertiesByType()}</div>
        <div className="flex flex-col justify-center">
          <label className="block text-xs">Others</label>
          <button onClick={handleRemoveElement}>
            <img src={deleteImage} alt="remove" className="w-[17px] h-[20px]" />
          </button>
        </div>
      </header>
      {/* Main Content */}
      <div className="relative">
        <aside className="absolute top-5 right-0 rounded-l-xl z-10 p-4 bg-[#ffffff] shadow-md border min-h-96 w-48">
          {renderPropertiesForFunctionalities()}
        </aside>
      </div>
    </div>
  );
};

export default ElementEditor;
