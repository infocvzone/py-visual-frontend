import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ButtonSvg from "../assets/categories/button-svg.svg";
import ButtonComponent from "../components/buttonComponet";
import TextSvg from "../assets/categories/text-svg.svg";
import LogoutSvg from "../assets/log-out.svg";
import InputSvg from "../assets/categories/input-svg.svg";
import ShapesSvg from "../assets/categories/shapes.svg";
import BackgroundSvg from "../assets/categories/background.svg";
import GraphicsSvg from "../assets/categories/image-pen.svg";
import TextComponent from "../components/textComponent";
import ImageSvg from "../assets/categories/image-svg.svg";
import { API_KEY } from "../constant";
import InputComponent from "../components/InputComponent";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Userlogout } from "../Redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onAddElement, onBgImageChange, onCreateProject }) => {
  const hiddenFileInput = React.useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [buttonData, setButtonData] = useState([]);
  const [inputfield, setInputfield] = useState([]);
  const [textData, setTextData] = useState([]);
  const [ImageData, setImageData] = useState([]);
  const [LineData, setLineData] = useState([]);
  const [CircleData, setCircleData] = useState([]);
  const [RectData, setRectData] = useState([]);
  const [buttonimageData, setButtonImageData] = useState([]); // New state for images
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [Project, setProjects] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [ImagesData, setImagesData] = useState([]);
  const [GraphicsData, setGraphicsData] = useState([]);
  const [page, setPage] = useState(1);
  const [Loading, SetLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const KEY = "47140599-1bb65ee8bbdb1fdf35ec80ea9";

  /*-------------------------------------------------------------------*/

  const fetchImages = useCallback(
    async (newSearchTerm, nextPage) => {
      if (Loading || !hasMore) return;
      SetLoading(true);

      try {
        const response = await axios.get(
          `https://pixabay.com/api/?key=${KEY}&q=${newSearchTerm}&image_type=illustration&page=${nextPage}&per_page=10`
        );
        const newImages = response.data.hits;

        if (nextPage === 1) {
          // Reset images for a new search term
          setImagesData(newImages);
        } else {
          // Append new images for lazy loading
          setImagesData((prevImages) => [...prevImages, ...newImages]);
        }

        setHasMore(newImages.length > 0); // Check if there are more images
        setPage(nextPage + 1);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    },
    [API_KEY, loading, hasMore]
  );

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.getElementById("image-container");
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight - 10
      ) {
        fetchImages(searchTerm, page);
      }
    };

    const divElement = document.getElementById("image-container");
    divElement?.addEventListener("scroll", handleScroll);

    return () => divElement?.removeEventListener("scroll", handleScroll);
  }, [fetchImages, searchTerm, page]);

  /*-------------------------------------------------------------------*/

  const fetchGraphics = useCallback(
    async (newSearchTerm, nextPage) => {
      if (Loading || !hasMore) return;
      SetLoading(true);

      try {
        const response = await axios.get(
          `https://pixabay.com/api/?key=${KEY}&q=${newSearchTerm}&image_type=vector&page=${nextPage}&per_page=10`
        );
        const newImages = response.data.hits;

        if (nextPage === 1) {
          // Reset images for a new search term
          setGraphicsData(newImages);
        } else {
          // Append new images for lazy loading
          setGraphicsData((prevImages) => [...prevImages, ...newImages]);
        }

        setHasMore(newImages.length > 0); // Check if there are more images
        setPage(nextPage + 1);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    },
    [API_KEY, loading, hasMore]
  );

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.getElementById("graphics-container");
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight - 10
      ) {
        fetchGraphics(searchTerm, page);
      }
    };

    const divElement = document.getElementById("graphics-container");
    divElement?.addEventListener("scroll", handleScroll);

    return () => divElement?.removeEventListener("scroll", handleScroll);
  }, [fetchGraphics, searchTerm, page]);

  /*-------------------------------------------------------------------*/

  const fetchBackgroundImages = useCallback(
    async (newSearchTerm, nextPage) => {
      if (Loading || !hasMore) return;
      SetLoading(true);

      try {
        const response = await axios.get(
          `https://pixabay.com/api/?key=${KEY}&q=${newSearchTerm}&image_type=photo&category=backgrounds&page=${nextPage}&per_page=10`
        );
        const newImages = response.data.hits;

        if (nextPage === 1) {
          // Reset images for a new search term
          setImageData(newImages);
        } else {
          // Append new images for lazy loading
          setImageData((prevImages) => [...prevImages, ...newImages]);
        }

        setHasMore(newImages.length > 0); // Check if there are more images
        setPage(nextPage + 1);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    },
    [API_KEY, loading, hasMore]
  );

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.getElementById("bgimage-container");
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight - 10
      ) {
        fetchBackgroundImages(searchTerm, page);
      }
    };

    const divElement = document.getElementById("bgimage-container");
    divElement?.addEventListener("scroll", handleScroll);

    return () => divElement?.removeEventListener("scroll", handleScroll);
  }, [fetchBackgroundImages, searchTerm, page]);

  /*-------------------------------------------------------------------*/

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setPage(1);
      if (activeCategory === "Image") {
        fetchImages(searchTerm, 1);
      } else if (activeCategory === "background") {
        fetchBackgroundImages(searchTerm, 1);
      } else if (activeCategory === "graphics") {
        fetchGraphics(searchTerm, 1);
      }
    }
  };

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

    const fetchLineData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/line`);
        setLineData(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    const fetchCircleData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/circle`);
        setCircleData(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    const fetchRectData = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/rect`);
        setRectData(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_KEY}api/projects/user/${user._id}`
        );
        setProjects(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchButtonData();
    fetchTextData();
    fetchImageData(); // Fetch images
    fetchInputfieldData();
    fetchLineData();
    fetchCircleData();
    fetchRectData();
    fetchProjects();
  }, []);

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleClick = () => {
    hiddenFileInput.current.click(); // Trigger the hidden input when the button is clicked
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      dispatch(Userlogout());
      navigate("/login");
    });
  };

  const handleImageChange = (image) => {
    onBgImageChange(image);
  };

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
    <div className={`flex max-w-1/3 `}>
      <div
        className={`p-4 border-r w-[85px] ${
          activeCategory === null ? "bg-white" : "bg-[#f6f7f8]"
        } flex flex-col justify-between h-screen`}
      >
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
                src={InputSvg}
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
                src={BackgroundSvg}
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
          {/* buttonImage Button */}
          <div className="flex items-center">
            <button onClick={() => toggleCategory("Image")}>
              <img
                src={ImageSvg}
                alt="Image"
                className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                  activeCategory === "Image"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-xs mt-1 text-center text-black">Images</h1>
            </button>
          </div>
          {/* Line Button */}
          <div className="flex items-center">
            <button onClick={() => toggleCategory("Line")}>
              <img
                src={ShapesSvg}
                alt="Line"
                className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                  activeCategory === "Line" ? "border-blue-400" : "border-black"
                }`}
              />
              <h1 className="text-xs mt-1 text-center text-black">Shapes</h1>
            </button>
          </div>
          {/* buttonImage Button */}
          <div className="flex items-center">
            <button onClick={() => toggleCategory("graphics")}>
              <img
                src={GraphicsSvg}
                alt="Image"
                className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                  activeCategory === "graphics"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-xs mt-1 text-center text-black">Graphics</h1>
            </button>
          </div>
        </div>
        {/* Line Button */}
        <div className="flex items-center">
          <button onClick={() => handleLogout()}>
            <img
              src={LogoutSvg}
              alt="Line"
              className={`w-10 h-8 border p-1 rounded-lg shadow-md ${
                activeCategory === "Line" ? "border-blue-400" : "border-black"
              }`}
            />
            <h1 className="text-xs mt-1 text-center text-black">Logout</h1>
          </button>
        </div>
      </div>

      {/* Second sidebar for category options */}
      {activeCategory && (
        <div className="p-4 w-full bg-white h-1/2 mt-2 ml-1 rounded-lg border shadow-xl overflow-y-auto">
          <div className="space-y-4">
            {/* Show elements for the active category */}

            {activeCategory === "projects" && (
              <div className="grid grid-cols-1 gap-2">
                {Project.map((project) => (
                  <button
                    key={project._id}
                    className="w-full border h-[80px] bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => onCreateProject(project)}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}

            {activeCategory === "BasicButton" && (
              <div className="grid grid-cols-2 gap-1">
                {buttonData.map((button) => (
                  <button
                    key={button._id}
                    className="border bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => onAddElement("BasicButton", button)}
                  >
                    <ButtonComponent
                      text={button.text}
                      idleColor={button.idleColor}
                      hoverColor={button.hoverColor}
                      clickedColor={button.clickedColor}
                      textColor={button.textColor}
                      width={button.width}
                      height={button.height}
                      border_thickness={button.borderThickness}
                      borderColor={button.borderColor}
                      fontFamily={button.fontFamily}
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
              <div className="grid grid-cols-1 gap-1">
                {inputfield.map((input) => (
                  <button
                    key={input._id}
                    className="w-full border h-[80px] bg-white p-2 shadow-lg rounded-lg"
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
            )}
            {activeCategory === "Line" && (
              <div className="grid grid-cols-1 gap-1">
                {RectData.map((rect) => (
                  <button
                    key={rect._id}
                    className="w-full border bg-white p-2 shadow-lg rounded-lg"
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
                {CircleData.map((circle) => (
                  <button
                    key={circle._id}
                    className="w-full border bg-white p-2 shadow-lg rounded-lg"
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

                {LineData.map((line) => (
                  <button
                    key={line._id}
                    className="w-full border bg-white p-2 shadow-lg rounded-lg"
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
            )}

            {activeCategory === "background" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded-l-lg"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                  >
                    Search
                  </button>
                </div>
                <div
                  id="bgimage-container"
                  className="grid grid-cols-2 gap-1 h-[500px] overflow-auto"
                >
                  <button
                    className="w-full border h-[150px] bg-white p-2 shadow-lg rounded-lg"
                    onClick={() => handleImageChange(null)}
                  >
                    <img
                      src="https://img.freepik.com/free-photo/white-png-base_23-2151645368.jpg?size=626&ext=jpg&ga=GA1.1.1880011253.1728950400&semt=ais_hybrid-rr-similar"
                      alt="null"
                      className="w-[150px] h-[120px] border"
                    />
                  </button>
                  {ImageData.map((image, index) => (
                    <button
                      key={index}
                      className="w-full border h-[150px] bg-white p-2 shadow-lg rounded-lg"
                      onClick={() => handleImageChange(image.webformatURL)}
                    >
                      <img
                        src={image.previewURL}
                        alt={image.tags}
                        className="w-[150px] h-[120px]"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeCategory === "Image" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded-l-lg"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                  >
                    Search
                  </button>
                </div>

                {/* Image grid container with lazy loading */}
                <div
                  id="image-container"
                  className="grid grid-cols-2 gap-1 h-[500px] overflow-auto"
                >
                  {ImagesData.map((image, index) => (
                    <button
                      key={index}
                      className="w-full border h-[150px] bg-white p-2 shadow-lg rounded-lg"
                      onClick={() => {
                        // Add the additional properties to the image object
                        const modifiedImage = {
                          ...image,
                          x: 100,
                          y: 100,
                          variableName: "Image",
                          name: null,
                          hidden: false,
                          type: "Image",
                          scale_value: 0.5,
                          id: Date.now(),
                        };
                        // Pass the modified image object to onAddElement
                        onAddElement("Image", modifiedImage);
                      }}
                    >
                      <img
                        src={image.previewURL}
                        alt={image.tags}
                        className="w-[100px] h-[100px] object-cover"
                      />
                    </button>
                  ))}
                </div>
                {loading && <p className="text-center">Loading...</p>}
                {!hasMore && (
                  <p className="text-center text-gray-500">
                    No more images to load.
                  </p>
                )}
              </div>
            )}

            {activeCategory === "graphics" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded-l-lg"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                  >
                    Search
                  </button>
                </div>

                {/* Image grid container with lazy loading */}
                <div
                  id="graphics-container"
                  className="grid grid-cols-2 gap-1 h-[500px] overflow-auto"
                >
                  {GraphicsData.map((image, index) => (
                    <button
                      key={index}
                      className="w-full border h-[150px] bg-white p-2 shadow-lg rounded-lg"
                      onClick={() => {
                        // Add the additional properties to the image object
                        const modifiedImage = {
                          ...image,
                          x: 100,
                          y: 100,
                          variableName: "Image",
                          name: null,
                          hidden: false,
                          type: "Image",
                          scale_value: 0.3,
                          id: Date.now(),
                        };
                        // Pass the modified image object to onAddElement
                        onAddElement("Image", modifiedImage);
                      }}
                    >
                      <img
                        src={image.previewURL}
                        alt={image.tags}
                        className="w-[100px] h-[100px] object-cover"
                      />
                    </button>
                  ))}
                </div>
                {loading && <p className="text-center">Loading...</p>}
                {!hasMore && (
                  <p className="text-center text-gray-500">
                    No more images to load.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
