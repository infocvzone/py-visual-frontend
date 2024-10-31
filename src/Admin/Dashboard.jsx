import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import ButtonComponent from "../components/buttonComponet";
import TextComponent from "../components/textComponent";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../constant";
import InputComponent from "../components/InputComponent";

function Dashboard() {
  const [buttonData, setButtonData] = useState([]); // To store fetched button data
  const [textData, setTextData] = useState([]); // To store fetched text data
  const [buttonImmageData, setButtonImageData] = useState([]);
  const [InputFieldData, setInputFieldData] = useState([]);
  const [RectData, setRectData] = useState([]);
  const [CircleData, setCircleData] = useState([]);
  const [LineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fetch button data from API when component mounts
  useEffect(() => {
    const fetchButtonData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/buttons/`); // Replace with your actual API endpoint
        setButtonData(response.data); // Set fetched button data
      } catch (error) {
        console.error("Error fetching button data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    const fetchButtonImageData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/buttonImages/`); // Replace with your actual API endpoint
        setButtonImageData(response.data); // Set fetched button data
      } catch (error) {
        console.error("Error fetching button data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    const fetchTextData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/texts/`); // Replace with your actual API endpoint for text
        setTextData(response.data); // Set fetched text data
      } catch (error) {
        console.error("Error fetching text data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    const fetchInputFieldData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/inputfields/`); // Replace with your actual API endpoint for text
        setInputFieldData(response.data); // Set fetched text data
      } catch (error) {
        console.error("Error fetching text data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    const fetchRectData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/rect/`); // Replace with your actual API endpoint for text
        setRectData(response.data); // Set fetched text data
      } catch (error) {
        console.error("Error fetching text data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    const fetchCircleData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/circle/`); // Replace with your actual API endpoint for text
        setCircleData(response.data); // Set fetched text data
      } catch (error) {
        console.error("Error fetching text data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };
    const fetchLineData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/line/`); // Replace with your actual API endpoint for text
        setLineData(response.data); // Set fetched text data
      } catch (error) {
        console.error("Error fetching text data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    // Call both APIs
    fetchButtonData();
    fetchTextData();
    fetchButtonImageData();
    fetchInputFieldData();
    fetchRectData();
    fetchCircleData();
    fetchLineData();
  }, []);

  const onAddElement = (type, element) => {
    navigate("/edit-element", { state: { type, element } });
  };

  return (
    <div className=" flex flex-col antialiased">
      <Header />
      <Sidebar />
      {/* Main content area */}
      <div className="flex-grow p-6 ml-64 mt-14">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Buttons</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {buttonData.map((button) => (
            <button
              key={button._id} // Use _id from the API response
              onClick={() => onAddElement("Button", button)}
              className="bg-gray-100 p-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <ButtonComponent
                text={button.text}
                idleColor={button.idleColor} // Green idle color
                hoverColor={button.hoverColor} // Light green hover color
                clickedColor={button.clickedColor} // Dark green clicked color
                textColor={button.textColor} // White text
                width={150}
                height={40}
                border_thickness={button.borderThickness}
                borderColor={button.borderColor}
                fontFamily={button.fontFamily}
              />
            </button>
          ))}
          {buttonImmageData.map((Button, index) => (
            <button
              key={index}
              className="bg-gray-100 p-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
              onClick={() => onAddElement("ButtonImage", Button)}
              onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
            >
              <img
                src={
                  hoveredIndex === index ? Button.hoverImage : Button.idleImage
                }
                alt="Button"
                className="max-w-[110px] max-h-[70px] m-auto p-2"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow p-6 ml-64 mt-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Text</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {textData.map((textItem) => (
            <button
              key={textItem._id} // Use _id from the API response
              className="w-full border p-3 rounded-lg shadow-lg transition-all transform hover:scale-105 bg-gray-100"
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
      </div>
      <div className="flex-grow p-6 ml-64 mt-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Input Field</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {InputFieldData.map((input) => (
            <button
              key={input._id} // Use _id from the API response
              className="w-full border p-3 rounded-lg shadow-lg transition-all transform hover:scale-105 bg-gray-100"
              onClick={() => onAddElement("InputField", input)}
            >
              <InputComponent
                width={input.width}
                height={input.height}
                placeholder={input.placeholder}
                bgColor={input.bgColor}
                borderColor={input.borderColor}
                textColor={input.textColor}
                fontSize={input.fontSize}
                fontFamily={input.fontFamily}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow p-6 ml-64 mt-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Shapes</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RectData.map((rect) => (
            <button
              key={rect._id} // Use _id from the API response
              className=" border p-3 rounded-lg shadow-lg transition-all transform hover:scale-105 bg-gray-100"
              onClick={() => onAddElement("Rect", rect)}
            >
              <svg className="flex items-center justify-center w-full h-full">
                {/* Rectangle */}
                <rect
                  width={rect.width}
                  height={rect.height}
                  fill={rect.Color}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow p-6 ml-64 mt-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Circle</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CircleData.map((circle) => (
            <button
              key={circle._id} // Use _id from the API response
              className=" border p-3 rounded-lg shadow-lg transition-all transform hover:scale-105 bg-gray-100"
              onClick={() => onAddElement("Circle", circle)}
            >
              <svg className="flex items-center justify-center">
                {/* Rectangle */}
                <circle
                  cx={circle.x}
                  cy="70"
                  r={circle.radius}
                  fill={circle.Color}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow p-6 ml-64 mt-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Line</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LineData.map((line) => (
            <button
              key={line._id} // Use _id from the API response
              className=" border p-3 rounded-lg shadow-lg transition-all transform hover:scale-105 bg-gray-100"
              onClick={() => onAddElement("Line", line)}
            >
              <svg className="flex items-center justify-center">
                {/* Line */}
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.Color}
                  strokeWidth={line.strokeWidth}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
