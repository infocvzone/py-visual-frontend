import React, { useEffect, useState } from "react";
import ColorComponent from "../editors/colorComponent";
import upSvg from "../../../assets/up.svg";
import downSvg from "../../../assets/down.svg";
import { API_KEY } from "../../../constant";
import axios from "axios";

function ButtonEditor({ editedElement, handleChange }) {
  const [Fonts, setFont] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  return (
    <div className="flex flex-wrap gap-2 w-full">
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
        <label className="block text-xs text-transparent">Font Family</label>
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
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
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
}

export default ButtonEditor;
