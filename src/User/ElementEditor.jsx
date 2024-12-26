import React, { useState, useEffect } from "react";
import axios from "axios"; // Add Axios for API requests
import { API_KEY } from "../constant";
import deleteImage from "../assets/delete.png";
import upSvg from "../assets/up.svg";
import downSvg from "../assets/down.svg";
import hideEye from "../assets/eye-off.svg";
import UnhideEye from "../assets/eye.svg";
import { SketchPicker } from "react-color";
import ColorComponent from "./colorComponent";
import SvgColorComponent from "./SvgColorComponent";
import closeSvg from "../assets/close.svg";
import SvgButtonWithRange from "./opacityComponent";
import centerSvg from "../assets/center.svg";
import leftSvg from "../assets/left.svg";
import rightSvg from "../assets/right.svg";

const ElementEditor = ({ selectedElement, elements, setElements }) => {
  const [editedElement, setEditedElement] = useState(null);
  const [Fonts, setFont] = useState([]);
  const [colorIndexMap, setColorIndexMap] = useState({});
  const [svgFills, setSvgFills] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [openPickers, setOpenPickers] = useState({}); // State to track open pickers

  const togglePicker = (index) => {
    setOpenPickers((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific picker's open state
    }));
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

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Update elements list with the modified element
  const updateElementsList = (updatedElement) => {
    const updatedElements = elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    );
    setElements(updatedElements);
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
      }
    }
  }, [selectedElement]);

  const extractFillValuesbyMakingButton = async (svgString) => {
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

    // Function to convert hex to rgb
    const hexToRgb = (hex) => {
      if (hex.startsWith("#")) {
        hex = hex.slice(1);
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    };

    // Function to modify the color to include opacity
    const modifyColorOpacity = (color, opacity) => {
      if (color.startsWith("rgba")) {
        // Update alpha in existing RGBA color
        return color.replace(
          /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
          (match, r, g, b) => {
            return `rgba(${r.trim()}, ${g.trim()}, ${b.trim()}, ${opacity})`;
          }
        );
      } else if (color.startsWith("rgb")) {
        // Convert RGB to RGBA
        return color.replace(
          /rgb\(([^,]+),([^,]+),([^)]+)\)/,
          (match, r, g, b) => {
            return `rgba(${r.trim()}, ${g.trim()}, ${b.trim()}, ${opacity})`;
          }
        );
      } else if (color.startsWith("#")) {
        // Convert HEX to RGBA
        return `rgba(${hexToRgb(color)}, ${opacity})`;
      }
      // If color is not recognized, return as-is
      return color;
    };

    // Generate the three SVG versions (Idle, Hover, Clicked)
    const createModifiedSvg = (svg, opacity) => {
      return svg.replace(/fill="([^"]*)"/g, (match, color) => {
        // Modify the fill attribute by adding/updating opacity
        const modifiedColor = modifyColorOpacity(color, opacity);
        return `fill="${modifiedColor}"`;
      });
    };

    // Create the three versions
    const setIdle = svgString; // The original SVG as Idle
    const setHover = createModifiedSvg(svgString, 0.75); // Modify the SVG for hover (opacity 0.75)
    const setClicked = createModifiedSvg(svgString, 0.5); // Modify the SVG for clicked (opacity 0.5)

    return { setIdle, setHover, setClicked };
  };

  /*----------------------------------------------------------------------------------------*/
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

  const updateSvgFill = async (color, newFill) => {
    if (!editedElement.webformatURL) return;

    let svgString = editedElement.webformatURL;

    // Get the indexes of the color that needs to be updated
    const indexesToUpdate = colorIndexMap[color] || [];

    // Replace all occurrences of the selected color
    const updatedSvgString = await svgString.replace(
      /fill="([^"]*)"/g,
      (matchStr, currentColor) => {
        if (indexesToUpdate.length > 0 && currentColor === color) {
          return `fill="${newFill}"`; // Replace with the RGBA color
        }
        return matchStr; // Keep other fills unchanged
      }
    );

    // Update the element and state
    const updatedElement = {
      ...editedElement,
      webformatURL: updatedSvgString,
    };

    setEditedElement(updatedElement);
    updateElementsList(updatedElement);
    extractFillValues(updatedSvgString); // Pass updated string, not element
  };

  /*---------------------------------------------------------------------------------*/

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "fontFamily") {
      loadFont(value);
    }
    if (
      (editedElement.type === "ButtonImage" ||
        editedElement.type === "Image") &&
      (name === "scale" || name === "scale_value" || name === "opacity")
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
      name === "borderWidth" ||
      name === "strokeWidth" ||
      name === "opacity" ||
      name === "boxWidth"
    ) {
      updatedValue = parseFloat(value);
    }

    if (
      name === "textColor" ||
      name === "idleColor" ||
      name === "hoverColor" ||
      name === "clickedColor" ||
      name === "borderColor" ||
      name === "bgColor" ||
      name === "color" ||
      name === "Color"
    ) {
      updatedValue = `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
    }

    if (
      name === "borderThickness" ||
      name === "borderWidth" ||
      name === "radius" ||
      name === "strokeWidth" ||
      name === "width" ||
      name === "height" ||
      name === "borderRadius" ||
      name === "opacity"
    ) {
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
        textColor: "rgba(0,0,0,1)",
        type: "ButtonImage",
        scale: editedElement.scale_value,
        id: editedElement.id,
        variableName: "ButtonImage",
        name: null,
        tag: null,
        fromImage: true,
        zIndex: 1,
      };
    }
    if (
      updatedElement.type === "Svg" &&
      name === "makeButton" &&
      value === true
    ) {
      let svgs = await extractFillValuesbyMakingButton(
        editedElement.webformatURL
      );
      updatedElement = {
        idleImage: svgs.setIdle,
        hoverImage: svgs.setHover,
        clickedImage: svgs.setClicked,
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
        zIndex: 1,
      };
    }

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

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs text-transparent">Text</label>
              <ColorComponent
                Name="textColor"
                elementColor={editedElement.textColor}
                Function={handleChange}
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
              <button onClick={toggleDropdown} className="">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="-2.4 -2.4 20.80 20.80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#787878"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8Z"
                      fill="#787878"
                    ></path>{" "}
                    <path
                      d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z"
                      fill="#787878"
                    ></path>{" "}
                    <path
                      d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z"
                      fill="#787878"
                    ></path>{" "}
                  </g>
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right- top-16 mt-2 bg-white shadow-lg rounded-lg p-4 w-48 z-10">
                  <h3 className="text-sm font-semibold mb-2">Font Styles</h3>

                  {/* Bold checkbox */}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="bold"
                      name="bold"
                      checked={!!editedElement.bold} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: { name: "bold", value: e.target.checked },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="bold" className="text-sm">
                      Bold
                    </label>
                  </div>

                  {/* Italic checkbox */}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="italic"
                      name="italic"
                      checked={!!editedElement.italic} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: { name: "italic", value: e.target.checked },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="italic" className="text-sm">
                      Italic
                    </label>
                  </div>

                  {/* Underline checkbox */}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="underline"
                      name="underline"
                      checked={!!editedElement.underline} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: "underline",
                            value: e.target.checked,
                          },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="underline" className="text-sm">
                      Underline
                    </label>
                  </div>

                  {/* Strikethrough checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="strikethrough"
                      name="strikethrough"
                      checked={!!editedElement.strikethrough} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: "strikethrough",
                            value: e.target.checked,
                          },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="strikethrough" className="text-sm">
                      Strikethrough
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs">Colors</label>
              <ColorComponent
                Name="idleColor"
                elementColor={editedElement.idleColor}
                Function={handleChange}
              />
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

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

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Radius</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderRadius",
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
                  name="borderRadius"
                  value={editedElement.borderRadius || 0}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderRadius",
                        value: (editedElement.borderRadius || 0) + 1,
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
              <label className="block text-xs">Border</label>
              <ColorComponent
                Name="borderColor"
                elementColor={editedElement.borderColor}
                Function={handleChange}
              />
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
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
              <ColorComponent
                Name="bgColor"
                elementColor={editedElement.bgColor}
                Function={handleChange}
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
              <ColorComponent
                Name="textColor"
                elementColor={editedElement.textColor}
                Function={handleChange}
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            {/* Border Color */}
            <div className="flex flex-col justify-center">
              <label className="block text-xs ">Border</label>
              <ColorComponent
                Name="borderColor"
                elementColor={editedElement.borderColor}
                Function={handleChange}
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
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center items-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Visibility</label>
              <button
                onClick={() =>
                  handleChange({
                    target: {
                      name: "visibility",
                      value: editedElement.visibility === false ? true : false,
                    },
                  })
                }
                className="flex items-center"
              >
                <img
                  src={editedElement.visibility === true ? UnhideEye : hideEye} // Change the image paths
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
            </div>
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
              <label className="block text-xs text-transparent">Color</label>
              <ColorComponent
                Name="color"
                elementColor={editedElement.color}
                Function={handleChange}
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

            <div className="mx-1">
              <label className="block text-xs text-transparent">Font</label>
              <div className="flex items-center justify-center">
                {editedElement.textAlignment === "left" ? (
                  <button
                    onClick={() => {
                      handleChange({
                        target: {
                          name: "textAlignment",
                          value: "center",
                        },
                      });
                    }}
                  >
                    <img src={leftSvg} alt="" className="w-6" />
                  </button>
                ) : editedElement.textAlignment === "center" ? (
                  <button
                    onClick={() => {
                      handleChange({
                        target: {
                          name: "textAlignment",
                          value: "right",
                        },
                      });
                    }}
                  >
                    <img src={centerSvg} alt="" className="w-6" />
                  </button>
                ) : editedElement.textAlignment === "right" ? (
                  <button
                    onClick={() => {
                      handleChange({
                        target: {
                          name: "textAlignment",
                          value: "left",
                        },
                      });
                    }}
                  >
                    <img src={rightSvg} alt="" className="w-6" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs text-transparent">Text</label>
              <button onClick={toggleDropdown} className="">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="-2.4 -2.4 20.80 20.80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#787878"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8Z"
                      fill="#787878"
                    ></path>{" "}
                    <path
                      d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z"
                      fill="#787878"
                    ></path>{" "}
                    <path
                      d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z"
                      fill="#787878"
                    ></path>{" "}
                  </g>
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right- top-16 mt-2 bg-white shadow-lg rounded-lg p-4 w-48 z-10">
                  <h3 className="text-sm font-semibold mb-2">Font Styles</h3>

                  {/* Bold checkbox */}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="bold"
                      name="bold"
                      checked={!!editedElement.bold} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: { name: "bold", value: e.target.checked },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="bold" className="text-sm">
                      Bold
                    </label>
                  </div>

                  {/* Italic checkbox */}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="italic"
                      name="italic"
                      checked={!!editedElement.italic} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: { name: "italic", value: e.target.checked },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="italic" className="text-sm">
                      Italic
                    </label>
                  </div>

                  {/* Underline checkbox */}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="underline"
                      name="underline"
                      checked={!!editedElement.underline} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: "underline",
                            value: e.target.checked,
                          },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="underline" className="text-sm">
                      Underline
                    </label>
                  </div>

                  {/* Strikethrough checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="strikethrough"
                      name="strikethrough"
                      checked={!!editedElement.strikethrough} // Ensure boolean value
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: "strikethrough",
                            value: e.target.checked,
                          },
                        });
                        toggleDropdown();
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="strikethrough" className="text-sm">
                      Strikethrough
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Box Width</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <input
                  type="text"
                  name="boxWidth"
                  value={editedElement.boxWidth}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
              </div>
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
                <div className="relative">
                  {/* Button with dynamic background color */}
                  <button
                    onClick={() => togglePicker(index)} // Toggle only this picker
                    className="rounded-full text-xs p-[15px] border-2"
                    style={{ backgroundColor: color }}
                  ></button>

                  {/* Color picker only visible when its specific 'open' state is true */}
                  {openPickers[index] && (
                    <>
                      <button
                        onClick={() => togglePicker(index)}
                        className="absolute z-20 top-8 left-0 p-0"
                      >
                        <img src={closeSvg} alt="close" className="w-[17px]" />
                      </button>
                      <SketchPicker
                        className="absolute z-10"
                        color={color || "#000000"}
                        onChange={(col) => {
                          const rgbaColor = `rgba(${col.rgb.r}, ${col.rgb.g}, ${col.rgb.b}, ${col.rgb.a})`; // Construct the RGBA string
                          updateSvgFill(color, rgbaColor); // Pass the RGBA string
                        }}
                      />
                    </>
                  )}
                </div>
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
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center items-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Visibility</label>
              <button
                onClick={() =>
                  handleChange({
                    target: {
                      name: "visibility",
                      value: editedElement.visibility === false ? true : false,
                    },
                  })
                }
                className="flex items-center"
              >
                <img
                  src={editedElement.visibility === true ? UnhideEye : hideEye} // Change the image paths
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
            </div>
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

            <div className="flex flex-col justify-center items-center">
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
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
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
              <ColorComponent
                Name="textColor"
                elementColor={editedElement.textColor}
                Function={handleChange}
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center items-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Visibility</label>
              <button
                onClick={() =>
                  handleChange({
                    target: {
                      name: "visibility",
                      value: editedElement.visibility === false ? true : false,
                    },
                  })
                }
                className="flex items-center"
              >
                <img
                  src={editedElement.visibility === true ? UnhideEye : hideEye} // Change the image paths
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
            </div>
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
              <ColorComponent
                Name="textColor"
                elementColor={editedElement.textColor}
                Function={handleChange}
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center items-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Visibility</label>
              <button
                onClick={() =>
                  handleChange({
                    target: {
                      name: "visibility",
                      value: editedElement.visibility === false ? true : false,
                    },
                  })
                }
                className="flex items-center"
              >
                <img
                  src={editedElement.visibility === true ? UnhideEye : hideEye} // Change the image paths
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
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
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Point-A</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "x1",
                        value: (editedElement.x1 || 1) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="x1"
                  value={editedElement.x1 || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "x1",
                        value: (editedElement.x1 || 1) + 1,
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
              <label className="block text-xs text-transparent">Radius</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "y1",
                        value: (editedElement.y1 || 1) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="y1"
                  value={editedElement.y1 || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "y1",
                        value: (editedElement.y1 || 1) + 1,
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
              <label className="block text-xs">Point-B</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "x2",
                        value: (editedElement.x2 || 1) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="x2"
                  value={editedElement.x2 || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "x2",
                        value: (editedElement.x2 || 1) + 1,
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
              <label className="block text-xs text-transparent">Radius</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "y2",
                        value: (editedElement.y2 || 1) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="y2"
                  value={editedElement.y2 || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "y2",
                        value: (editedElement.y2 || 1) + 1,
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
              <label className="block text-xs">Width</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "strokeWidth",
                        value: (editedElement.strokeWidth || 1) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="strokeWidth"
                  value={editedElement.strokeWidth || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "strokeWidth",
                        value: (editedElement.strokeWidth || 1) + 1,
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
              <label className="block text-xs">Color</label>
              <ColorComponent
                Name="Color"
                elementColor={editedElement.Color}
                Function={handleChange}
              />
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center items-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Visibility</label>
              <button
                onClick={() =>
                  handleChange({
                    target: {
                      name: "visibility",
                      value: editedElement.visibility === false ? true : false,
                    },
                  })
                }
                className="flex items-center"
              >
                <img
                  src={editedElement.visibility === true ? UnhideEye : hideEye} // Change the image paths
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        );
      case "Circle":
        return (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col justify-center">
              <label className="block text-xs">Radius</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "radius",
                        value: (editedElement.radius || 1) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="radius"
                  value={editedElement.radius || 1}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "radius",
                        value: (editedElement.radius || 1) + 1,
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
              <label className="block text-xs">Color</label>
              <ColorComponent
                Name="Color"
                elementColor={editedElement.Color}
                Function={handleChange}
              />
            </div>
            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs">Border</label>
              <ColorComponent
                Name="borderColor"
                elementColor={editedElement.borderColor}
                Function={handleChange}
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
                        name: "borderWidth",
                        value: (editedElement.borderWidth || 0) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="borderWidth"
                  value={editedElement.borderWidth || 0}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderWidth",
                        value: (editedElement.borderWidth || 0) + 1,
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
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center items-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Visibility</label>
              <button
                onClick={() =>
                  handleChange({
                    target: {
                      name: "visibility",
                      value: editedElement.visibility === false ? true : false,
                    },
                  })
                }
                className="flex items-center"
              >
                <img
                  src={editedElement.visibility === true ? UnhideEye : hideEye} // Change the image paths
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        );
      case "Rect":
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
            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs">Color</label>
              <ColorComponent
                Name="Color"
                elementColor={editedElement.Color}
                Function={handleChange}
              />
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>

            <div className="flex flex-col items-center justify-center">
              <label className="block text-xs">Border</label>
              <ColorComponent
                Name="borderColor"
                elementColor={editedElement.borderColor}
                Function={handleChange}
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
                        name: "borderWidth",
                        value: (editedElement.borderWidth || 0) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="borderWidth"
                  value={editedElement.borderWidth || 0}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "borderWidth",
                        value: (editedElement.borderWidth || 0) + 1,
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
              <label className="block text-xs">Rounded</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "radius",
                        value: (editedElement.radius || 0) - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  -
                </button>
                <input
                  type="text"
                  name="radius"
                  value={editedElement.radius || 0}
                  onChange={handleChange}
                  className="text-center w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "radius",
                        value: (editedElement.radius || 0) + 1,
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
              <label className="block text-xs">Layers</label>
              <div className="flex items-center space-x-1 border rounded-lg px-[3px]">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex - 1,
                      },
                    })
                  }
                  className="bg-transparent text-lg"
                >
                  <img src={downSvg} className="w-3" />
                </button>
                <input
                  type="text"
                  name="zIndex"
                  value={editedElement.zIndex}
                  onChange={handleChange}
                  className="text-center h-[27px] w-[40px] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "zIndex",
                        value: editedElement.zIndex + 1,
                      },
                    })
                  }
                  className="bg-bg-transparent text-md"
                >
                  <img src={upSvg} className="w-3" />
                </button>
              </div>
            </div>

            <div className="h-[40px] my-auto border-l border-gray-300"></div>
            <div className="flex flex-col justify-center items-center">
              {/* Hidden Checkbox */}
              <label className="block text-xs">Visibility</label>
              <button
                onClick={() =>
                  handleChange({
                    target: {
                      name: "visibility",
                      value: editedElement.visibility === false ? true : false,
                    },
                  })
                }
                className="flex items-center"
              >
                <img
                  src={editedElement.visibility === true ? UnhideEye : hideEye} // Change the image paths
                  alt="Toggle visibility"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
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
      case "Circle":
        return (
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-lg py-1">General</h1>
            <div className="flex flex-col">
              <label className="block text-xs">Tag</label>
              <input
                type="text"
                name="tag"
                value={editedElement.tag || ""}
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
      case "Rect":
        return (
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-lg py-1">General</h1>
            <div className="flex flex-col">
              <label className="block text-xs">Tag</label>
              <input
                type="text"
                name="tag"
                value={editedElement.tag || ""}
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

      case "Line":
        return (
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-lg py-1">General</h1>
            <div className="flex flex-col">
              <label className="block text-xs">Tag</label>
              <input
                type="text"
                name="tag"
                value={editedElement.tag || ""}
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
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col justify-center items-center">
              <SvgButtonWithRange
                Name={"opacity"}
                value={editedElement.opacity}
                onChange={handleChange}
              />
            </div>
            <button onClick={handleRemoveElement}>
              <img
                src={deleteImage}
                alt="remove"
                className="w-[17px] h-[22px]"
              />
            </button>
          </div>
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
