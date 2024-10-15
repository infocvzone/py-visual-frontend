import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonSvg from "../assets/categories/button-svg.svg";
import ButtonComponent from "../components/buttonComponet";
import TextSvg from "../assets/categories/text-svg.svg";
import TextComponent from "../components/textComponent";
import ImageSvg from "../assets/categories/image-svg.svg";
import { API_KEY } from "../constant";

const Sidebar = ({ onAddElement, onBgImageChange}) => {
  const hiddenFileInput = React.useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [buttonData, setButtonData] = useState([]);
  const [inputfield, setInputfield] = useState([]);
  const [textData, setTextData] = useState([]);
  const [ImageData, setImageData] = useState([]);
  const [buttonimageData, setButtonImageData] = useState([]); // New state for images
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchButtonData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/buttons/`);
        setButtonData(response.data);
      } catch (error) {
        console.error("Error fetching button data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTextData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/texts/`);
        setTextData(response.data);
      } catch (error) {
        console.error("Error fetching text data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImageData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/buttonImages/`);
        setButtonImageData(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchInputfieldData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/inputfields`);
        setInputfield(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    const fetchBgImagesData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/images`);
        setImageData(response.data); // Fetch and store image data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchButtonData();
    fetchTextData();
    fetchImageData(); // Fetch images
    fetchInputfieldData();
    fetchBgImagesData();
  }, []);

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleClick = () => {
    hiddenFileInput.current.click(); // Trigger the hidden input when the button is clicked
  };

  const handleImageChange = (image)=>{
    onBgImageChange(image);
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // After uploading, fetch the updated list of images
      const response = await axios.get("http://localhost:3000/api/image/");
      setImageData(response.data); // Update image list
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading indicator while data is being fetched
  }

  return (
    <div className={`flex max-w-1/3`}>
      <div
        className={`p-4 border-r w-[85px] ${
          activeCategory === null ? "bg-white" : "bg-[#f6f7f8]"
        } flex flex-col justify-start h-screen`}
      >
        {/* Styled button to upload file 
                <button
                    onClick={handleClick}
                    className="bg-green-500 hover:bg-green-700 text-white text-xs mb-4 font-bold py-2 px-1 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-50"
                >
                    Upload
                </button>*/}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={hiddenFileInput}
          className="hidden" // Hide the default file input
        />
        <div className="space-y-4">
          {/* Button category */}
          <div className="flex items-center">
            <button onClick={() => toggleCategory("BasicButton")}>
              <img
                src={ButtonSvg}
                alt="Button"
                className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                  activeCategory === "Button"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-xs mt-1 text-center text-black">Button</h1>
            </button>
          </div>

          {/* Text category */}
          <div className="flex items-center">
            <button onClick={() => toggleCategory("Text")}>
              <img
                src={TextSvg}
                alt="Text"
                className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                  activeCategory === "Text" ? "border-blue-400" : "border-black"
                }`}
              />
              <h1 className="text-xs mt-1 text-center text-black">Text</h1>
            </button>
          </div>

          {/* buttonImage Button */}
          <div className="flex items-center">
            <button onClick={() => toggleCategory("InputField")}>
              <img
                src={ImageSvg}
                alt="InputField"
                className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                  activeCategory === "InputField"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-xs mt-1 text-center text-black">Input</h1>
            </button>
          </div>

          {/* buttonImage Button */}
          <div className="flex items-center">
            <button onClick={() => toggleCategory("background")}>
              <img
                src={ImageSvg}
                alt="background"
                className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                  activeCategory === "background"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-xs mt-1 text-center text-black">
                Background
              </h1>
            </button>
          </div>
        </div>
      </div>

      {/* Second sidebar for category options */}
      {activeCategory && (
        <div className="p-4 w-full bg-white h-1/2 mt-2 ml-1 rounded-lg border shadow-xl overflow-y-auto">
          <div className="space-y-4">
            {/* Show elements for the active category */}
            {activeCategory === "BasicButton" && (
              <div className="grid grid-cols-2 gap-1">
                {buttonData.map((button) => (
                  <button
                    key={button._id}
                    className="border h-[80px] bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => onAddElement("BasicButton", button)}
                  >
                    <ButtonComponent
                      text={button.text}
                      idleColor={button.idleColor}
                      hoverColor={button.hoverColor}
                      clickedColor={button.clickedColor}
                      textColor={button.textColor}
                      width={130}
                      height={40}
                      border_thickness={button.borderThickness}
                      borderColor={button.borderColor}
                    />
                  </button>
                ))}
                {buttonimageData.map((Button, index) => (
                  <button
                    key={index}
                    className="border h-[80px] bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => onAddElement("ButtonImage", Button)}
                    onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
                    onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
                  >
                    <img
                      src={
                        hoveredIndex === index
                          ? Button.hoverImage
                          : Button.idleImage
                      } // Change source based on hover state
                      alt="Button"
                      className="max-w-[110px] max-h-[70px] m-auto p-2"
                    />
                  </button>
                ))}
              </div>
            )}

            {activeCategory === "Text" && (
              <div className="grid grid-cols-2 gap-1">
                {textData.map((textItem) => (
                  <button
                    key={textItem._id}
                    className="w-full border h-[80px] bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => onAddElement("Text", textItem)}
                  >
                    <TextComponent
                      text={
                        textItem.text.length > 10
                          ? textItem.text.slice(0, 10)
                          : textItem.text
                      }
                      color={textItem.color}
                      fontFamily={textItem.fontFamily}
                      italic={textItem.italic}
                      bold={textItem.bold}
                      underline={textItem.underline}
                      strikethrough={textItem.strikethrough}
                    />
                  </button>
                ))}
              </div>
            )}

            {activeCategory === "InputField" && (
              <div className="grid grid-cols-2 gap-1">
                {inputfield.map((input) => (
                  <button
                    key={input._id}
                    className="w-full border h-[80px] bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => onAddElement("InputField", input)}
                  ></button>
                ))}
              </div>
            )}

            {activeCategory === "background" && (
              <div className="grid grid-cols-2 gap-1">
                {ImageData.map((image) => (
                  <button
                    key={image._id}
                    className="w-full border h-[150px] bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => handleImageChange(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-[150px] h-[120px]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
