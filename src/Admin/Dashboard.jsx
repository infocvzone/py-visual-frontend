import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import ButtonComponent from "../components/buttonComponet";
import TextComponent from "../components/textComponent";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "../constant";
import InputComponent from "../components/InputComponent";
import Swal from "sweetalert2";

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

  /* Shapes Fetching */
  const [shapesLoading, setShapesLoading] = useState(false);
  const [shapesPage, setShapesPage] = useState(0);
  const [shapesHasMore, setShapesHasMore] = useState(true);

  const fetchShapes = useCallback(
    async (nextPage) => {
      if (shapesLoading || !shapesHasMore) return;
      setShapesLoading(true);
      try {
        const response = await axios.get(`${API_KEY}api/shape/`, {
          params: {
            page: nextPage, // page number
            limit: 40, // number of results per page
            tag: "", // search tag
          },
        });
        const newShapes = response.data.data;
        const pagination = response.data.pagination;
        if (nextPage === 0) {
          setRectData(newShapes);
        } else {
          setRectData((prevShapes) => [...prevShapes, ...newShapes]);
        }

        setShapesHasMore(
          newShapes.length > 0 && pagination.currentPage < pagination.totalPages
        );
        setShapesPage(nextPage + 1);
      } catch (error) {
        console.error("Failed to fetch shapes:", error);
      } finally {
        setShapesLoading(false);
      }
    },
    [shapesLoading, shapesHasMore]
  );

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.getElementById("shape-container");
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight - 10
      ) {
        fetchShapes(shapesPage);
      }
    };

    const divElement = document.getElementById("shape-container");
    divElement?.addEventListener("scroll", handleScroll);

    return () => divElement?.removeEventListener("scroll", handleScroll);
  }, [fetchShapes, shapesPage]);

  /* Shapes Fetching */
  const [iconsLoading, setIconsLoading] = useState(false);
  const [iconssPage, setIconsPage] = useState(0);
  const [iconsHasMore, setIconHasMore] = useState(true);

  const fetchIcons = useCallback(
    async (nextPage) => {
      if (iconsLoading || !iconsHasMore) return;
      setIconsLoading(true);
      try {
        const response = await axios.get(`${API_KEY}api/icons/`, {
          params: {
            page: nextPage, // page number
            limit: 40, // number of results per page
            tag: "", // search tag
          },
        });
        const newShapes = response.data.data;
        const pagination = response.data.pagination;
        if (nextPage === 0) {
          setCircleData(newShapes);
        } else {
          setCircleData((prevShapes) => [...prevShapes, ...newShapes]);
        }

        setIconHasMore(
          newShapes.length > 0 && pagination.currentPage < pagination.totalPages
        );
        setIconsPage(nextPage + 1);
      } catch (error) {
        console.error("Failed to fetch shapes:", error);
      } finally {
        setIconsLoading(false);
      }
    },
    [iconsLoading, iconsHasMore]
  );

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.getElementById("icons-container");
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight - 10
      ) {
        fetchIcons(shapesPage);
      }
    };

    const divElement = document.getElementById("icons-container");
    divElement?.addEventListener("scroll", handleScroll);

    return () => divElement?.removeEventListener("scroll", handleScroll);
  }, [fetchIcons, iconssPage]);

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

    fetchButtonData();
    fetchTextData();
    fetchButtonImageData();
    fetchInputFieldData();
    fetchShapes(0);
    fetchIcons(0);
    fetchLineData();
  }, []);

  // Function to set SVG size
  const setSvgSize = (svgString, width, height) => {
    // Parse the SVG string to modify width and height
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // Set width and height
    svgElement.setAttribute("width", width);
    svgElement.setAttribute("height", height);

    // Return the modified SVG string
    return new XMLSerializer().serializeToString(svgElement);
  };

  const onAddElement = (type, element) => {
    navigate("/edit-element", { state: { type, element } });
  };
  // Delete image by ID
  const handleDeleteShapes = (id) => {
    axios
      .delete(`${API_KEY}api/shape/${id}`)
      .then(() => {
        setRectData(RectData.filter((image) => image._id !== id));
        Swal.fire({
          title: "Shape Deleted Successfully",
          showCancelButton: false,
          confirmButtonText: "ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };
  // Delete icons by ID
  const handleDeleteIcons = (id) => {
    axios
      .delete(`${API_KEY}api/icons/${id}`)
      .then(() => {
        setCircleData(CircleData.filter((image) => image._id !== id));
        Swal.fire({
          title: "Shape Deleted Successfully",
          showCancelButton: false,
          confirmButtonText: "ok",
        });
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
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
        {RectData && (
          <div
            id="shape-container"
            className="h-[500px] overflow-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
          >
            {RectData.map((image) => (
              <div
                key={image._id}
                className="image-item h-[200px] bg-white p-2 shadow-lg rounded-lg flex flex-col items-center justify-center gap-1"
              >
                <div
                  style={{ width: "70px", margin: "auto" }}
                  dangerouslySetInnerHTML={{
                    __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                  }}
                />
                <button
                  onClick={() => handleDeleteShapes(image._id)} // Wrap it in an anonymous function
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-[80%]"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-grow p-6 ml-64 mt-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Icons</h1>
        {CircleData && (
          <div
            id="shape-container"
            className="h-[500px] overflow-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
          >
            {CircleData.map((image) => (
              <div
                key={image._id}
                className="image-item h-[200px] bg-white p-2 shadow-lg rounded-lg flex flex-col items-center justify-center gap-1"
              >
                <div
                  style={{ width: "70px", margin: "auto" }}
                  dangerouslySetInnerHTML={{
                    __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                  }}
                />
                <button
                  onClick={() => handleDeleteIcons(image._id)} // Wrap it in an anonymous function
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-[80%]"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
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
