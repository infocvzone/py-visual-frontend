import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ButtonSvg from "../assets/categories/button-svg.svg";
import ButtonComponent from "../components/buttonComponet";
import TextSvg from "../assets/categories/text-svg.svg";
import LogoutSvg from "../assets/log-out.svg";
import InputSvg from "../assets/categories/input-svg.svg";
import ShapesSvg from "../assets/categories/shapes.svg";
import IconSvg from "../assets/categories/icons.svg";
import BackgroundSvg from "../assets/categories/background.svg";
import GraphicsSvg from "../assets/search-svg.svg";
import LoadingGif from "../assets/loading1.gif";
import WindowSvg from "../assets/categories/window.svg";
import closeSvg from "../assets/close.svg";
import TextComponent from "../components/textComponent";
import ImageSvg from "../assets/categories/image-pen.svg";
import { API_KEY } from "../constant";
import InputComponent from "../components/InputComponent";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Userlogout } from "../Redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from "react-color";

const Sidebar = ({
  onAddElement,
  onBgImageChange,
  Height,
  Width,
  onWindowSizeChange,
}) => {
  const hiddenFileInput = React.useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [buttonData, setButtonData] = useState([]);
  const [inputfield, setInputfield] = useState([]);
  const [textData, setTextData] = useState([]);
  const [ImageData, setImageData] = useState([]);
  const [CircleData, setCircleData] = useState([]);
  const [LineData, setLineData] = useState([]);
  const [RectData, setRectData] = useState([]);
  const [iconsData, setIconsData] = useState([]);
  const [buttonimageData, setButtonImageData] = useState([]); // New state for images
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [Project, setProjects] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [width, setWidth] = useState(700);
  const [height, setHeight] = useState(400);
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    // Set default values if width or height are null
    if (Height === null) {
      setHeight(400);
    } else {
      setHeight(Height);
    }

    if (Width === null) {
      setWidth(700);
    } else {
      setWidth(Width);
    }
  }, [Height, Width]);

  const [searchTerm, setSearchTerm] = useState("");
  const [ImagesData, setImagesData] = useState([]);
  const [GraphicsData, setGraphicsData] = useState([]);
  const [Graphics, setGraphics] = useState([]);
  const [page, setPage] = useState(1);
  const [Loading, SetLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const KEY = "47140599-1bb65ee8bbdb1fdf35ec80ea9";

  /*-------------------------------------------------------------------*/

  /* Shapes Fetching */
  const [ShapesData, setShapesData] = useState([]);
  const [shapesLoading, setShapesLoading] = useState(false);
  const [shapesPage, setShapesPage] = useState(0);
  const [shapesHasMore, setShapesHasMore] = useState(true);

  const fetchShapes = useCallback(
    async (newSearchTerm, nextPage) => {
      if (shapesLoading || !shapesHasMore) return;

      setShapesLoading(true);

      try {
        const response = await axios.get(`${API_KEY}api/shape/`, {
          params: {
            page: nextPage, // page number
            limit: 30, // number of results per page
            tag: newSearchTerm, // search tag
          },
        });
        console.log(response.data.data);
        const newShapes = response.data.data;
        const pagination = response.data.pagination;
        if (nextPage === 0) {
          setShapesData(newShapes);
        } else {
          setShapesData((prevShapes) => [...prevShapes, ...newShapes]);
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
        fetchShapes(searchTerm, shapesPage);
      }
    };

    const divElement = document.getElementById("shape-container");
    divElement?.addEventListener("scroll", handleScroll);

    return () => divElement?.removeEventListener("scroll", handleScroll);
  }, [fetchShapes, searchTerm, shapesPage]);

  /* ------------------------------------------------------------------------- */

  /* Shapes Fetching */
  const [iconsLoading, setIconsLoading] = useState(false);
  const [iconsPage, setIconsPage] = useState(0);
  const [iconHasMore, setIconsHasMore] = useState(true);

  const fetchIcons = useCallback(
    async (newSearchTerm, nextPage) => {
      if (iconsLoading || !iconHasMore) return;
      setIconsLoading(true);
      try {
        const response = await axios.get(`${API_KEY}api/icons/`, {
          params: {
            page: nextPage, // page number
            limit: 50, // number of results per page
            tag: newSearchTerm, // search tag
          },
        });

        const newShapes = response.data.data;
        const pagination = response.data.pagination;
        if (nextPage === 0) {
          setIconsData(newShapes);
        } else {
          setIconsData((prevShapes) => [...prevShapes, ...newShapes]);
        }

        setIconsHasMore(
          newShapes.length > 0 && pagination.currentPage < pagination.totalPages
        );
        setIconsPage(nextPage + 1);
      } catch (error) {
        console.error("Failed to fetch shapes:", error);
      } finally {
        setIconsLoading(false);
      }
    },
    [iconsLoading, iconHasMore]
  );

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.getElementById("icon-container");
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight - 10
      ) {
        fetchIcons(searchTerm, iconsPage);
      }
    };

    const divElement = document.getElementById("icon-container");
    divElement?.addEventListener("scroll", handleScroll);

    return () => divElement?.removeEventListener("scroll", handleScroll);
  }, [fetchIcons, searchTerm, iconsPage]);

  /*-------------------------------------------------------------------*/

  const fetchImages = useCallback(
    async (newSearchTerm, nextPage) => {
      if (Loading || !hasMore) return;
      SetLoading(true);

      try {
        const response = await axios.get(
          `https://pixabay.com/api/?key=${KEY}&q=${newSearchTerm}&image_type=photo&page=${nextPage}&per_page=20`
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

  const [graphicsLoading, setGraphicsLoading] = useState(false);
  const [graphicsPage, setGraphicsPage] = useState(0);
  const [graphicsHasMore, setGraphicsHasMore] = useState(true);

  const fetchGraphics = useCallback(
    async (newSearchTerm, nextPage) => {
      if (Loading || !hasMore) return;
      SetLoading(true);

      try {
        const response = await axios.get(
          `https://pixabay.com/api/?key=${KEY}&q=${newSearchTerm}&image_type=vector&page=${nextPage}&per_page=40`
        );
        const newImages = response.data.hits;
        // Append new images for lazy loading
        setGraphicsData(newImages);

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

  const fetchgraphicsData = useCallback(async () => {
    if (graphicsLoading || !graphicsHasMore) return;

    setGraphicsLoading(true);

    try {
      const response = await axios.get(`${API_KEY}api/graphic`, {
        params: {
          page: graphicsPage, // page number
          limit: 40, // number of results per page
          tag: "", // search tag
        },
      });

      const newShapes = response.data.data;
      const pagination = response.data.pagination;

      if (graphicsPage === 0) {
        setGraphicsData(newShapes);
      } else {
        setGraphicsData((prevShapes) => [...prevShapes, ...newShapes]);
      }

      setGraphicsHasMore(
        newShapes.length > 0 && pagination.currentPage < pagination.totalPages
      );
      setGraphicsPage(graphicsPage + 1);
    } catch (error) {
      console.error("Failed to fetch shapes:", error);
    } finally {
      setGraphicsLoading(false);
    }
  }, [graphicsLoading, graphicsHasMore]);

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.getElementById("graphics-container");
      if (
        divElement &&
        divElement.scrollTop + divElement.clientHeight >=
          divElement.scrollHeight - 10
      ) {
        console.log("print");
        fetchgraphicsData();
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
          `https://pixabay.com/api/?key=${KEY}&q=${newSearchTerm}&image_type=illustration&category=backgrounds&page=${nextPage}&per_page=20`
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
      } else if (activeCategory === "Window") {
        fetchBackgroundImages(searchTerm, 1);
      } else if (activeCategory === "graphics") {
        fetchGraphics(searchTerm, 1);
      } else if (activeCategory === "Shapes") {
        fetchShapes(searchTerm);
      } else if (activeCategory === "Icons") {
        setIconsData([]);
        setIconsPage(0);
        fetchIcons(searchTerm);
      } else if (activeCategory === "element") {
        fetchImages(searchTerm, 1);
        fetchGraphics(searchTerm, 1);
        fetchShapes(searchTerm);

        setIconsData([]);
        setIconsPage(0);
        fetchIcons(searchTerm);
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

    const fetchCircle = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/circle`);
        setCircleData(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchRect = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/rect`);
        setRectData(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchLine = async () => {
      try {
        const response = await axios.get(`${API_KEY}api/line`);
        setLineData(response.data); // Fetch and store image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchButtonData();
    fetchTextData();
    // fetchImageData(); // Fetch images
    fetchInputfieldData();

    fetchCircle();
    fetchLine();
    fetchRect();
  }, []);

  const handleWindowSizeChange = () => {
    if (width > 800) {
      setWidth(800);
      onWindowSizeChange(800, height, color);
    } else {
      onWindowSizeChange(width, height, color);
    }
  };

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
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(Userlogout());
        navigate("/login");
      } else {
        return; // Do nothing if the user cancels
      }
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

  if (loading) {
    return <div>Loading...</div>; // Loading indicator while data is being fetched
  }

  return (
    <div className={`flex max-w-[40%] absolute top-0 left-0 z-10`}>
      {activeCategory !== null && (
        <button
          onClick={() => {
            setActiveCategory(null);
          }}
          className="absolute top-3 right-3"
        >
          <img src={closeSvg} alt="close" />
        </button>
      )}

      <div
        className={`py-[25px] p-1 flex flex-col items-center justify-center border-r border-gray-300 w-[90px] min-h-screen ${
          activeCategory === null ? "transparent" : "bg-[#ffffff]"
        } flex flex-col justify-between h-auto`}
      >
        <div className="flex flex-col items-center justify-center space-y-[25px]">
          {/* Button category */}
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => {
                fetchBackgroundImages("backgrounds", 1);
                toggleCategory("Window");
              }}
            >
              <img
                src={WindowSvg}
                alt="Window"
                className={`w-6 h-6${
                  activeCategory === "Window"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Window
              </h1>
            </button>
          </div>

          {/* buttonImage Button */}
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => {
                toggleCategory("element");
                fetchImages("photos", 1);

                fetchgraphicsData();

                setIconsData([]);
                setSearchTerm("");
                setIconsLoading(false);
                setIconsHasMore(true);
                fetchIcons("", 0);

                setShapesData([]);
                setSearchTerm("");
                setShapesLoading(false);
                setShapesHasMore(true);
                fetchShapes("", 0);
              }}
            >
              <img
                src={ImageSvg}
                alt="Image"
                className={`w-6 h-6 ${
                  activeCategory === "Image"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Graphics
              </h1>
            </button>
          </div>

          {/* Button category */}
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => toggleCategory("BasicButton")}
            >
              <img
                src={ButtonSvg}
                alt="Button"
                className={`w-6 h-6 ${
                  activeCategory === "BasicButton"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Button
              </h1>
            </button>
          </div>

          {/* Text category */}
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => toggleCategory("Text")}
            >
              <img
                src={TextSvg}
                alt="Text"
                className={`w-6 h-6${
                  activeCategory === "Text" ? "border-blue-400" : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Text
              </h1>
            </button>
          </div>
          {/* buttonImage Button */}
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => toggleCategory("InputField")}
            >
              <img
                src={InputSvg}
                alt="InputField"
                className={`w-6 h-6 ${
                  activeCategory === "InputField"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Input
              </h1>
            </button>
          </div>

          {/* buttonImage Button 
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => {
                toggleCategory("background");
                fetchBackgroundImages("backgrounds", 1);
              }}
            >
              <img
                src={BackgroundSvg}
                alt="background"
                className={`w-6 h-6 ${
                  activeCategory === "background"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Background
              </h1>
            </button>
          </div>*/}

          {/* buttonImage Button 
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => {
                toggleCategory("graphics");
                fetchgraphicsData();
              }}
            >
              <img
                src={GraphicsSvg}
                alt="Image"
                className={`w-6 h-6 ${
                  activeCategory === "graphics"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Graphics
              </h1>
            </button>
          </div>
          */}

          {/* buttonImage Button 
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => {
                setShapesData([]);
                setSearchTerm("");
                setShapesLoading(false);
                setShapesHasMore(true);
                fetchShapes("", 0);
                toggleCategory("Shapes");
              }}
            >
              <img
                src={ShapesSvg}
                alt="Shapes"
                className={`w-6 h-6 ${
                  activeCategory === "Shapes"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Shapes
              </h1>
            </button>
          </div>*/}
          {/* buttonImage Button 
          <div className="flex items-center">
            <button
              className="flex items-center justify-center flex-col"
              onClick={() => {
                setIconsData([]);
                setSearchTerm("");
                setIconsLoading(false);
                setIconsHasMore(true);
                fetchIcons("", 0);
                toggleCategory("Icons");
              }}
            >
              <img
                src={IconSvg}
                alt="Icons"
                className={`w-6 h-6 ${
                  activeCategory === "Icons"
                    ? "border-blue-400"
                    : "border-black"
                }`}
              />
              <h1 className="text-[10px] mt-[14px] text-center text-black">
                Icons
              </h1>
            </button>
          </div>*/}
        </div>

        {/* Line Button */}
        <div className="flex items-center mt-[25px]">
          <button
            className="flex items-center justify-center flex-col"
            onClick={() => handleLogout()}
          >
            <img
              src={LogoutSvg}
              alt="Line"
              className={`w-6 h-6 ${
                activeCategory === "Line" ? "border-blue-400" : "border-black"
              }`}
            />
            <h1 className="text-[10px] mt-[14px] text-center text-black">
              Logout
            </h1>
          </button>
        </div>
      </div>

      {/* Second sidebar for category options */}
      {activeCategory && (
        <div className="p-4 w-full bg-[#ffffff] h-screen overflow-y-auto border pt-[50px]">
          <div className="space-y-4">
            {/* Show elements for the active category */}

            {activeCategory === "BasicButton" && (
              <div className="grid grid-cols-2 gap-[5px]">
                {buttonData.map((button) => {
                  // Define the maximum width
                  const maxWidth = 100;

                  // Check if the button's width exceeds the maximum allowed width
                  let scaleFactor = 1;
                  if (button.width > maxWidth) {
                    scaleFactor = maxWidth / button.width;
                  }

                  // Scale down the width and height while maintaining the aspect ratio
                  const scaledWidth = button.width * scaleFactor;
                  const scaledHeight = button.height * scaleFactor;

                  // Adjust font size based on the scaled height or width
                  const baseFontSize = button.fontSize; // Default font size if not provided
                  const scaledFontSize = baseFontSize * scaleFactor;

                  return (
                    <button
                      key={button._id}
                      className=""
                      onClick={() => {
                        let data = {
                          ...button,
                          visibility: true,
                          diabled: false,
                          disabled_opacity: 0.3,
                        };
                        onAddElement("BasicButton", data);
                      }}
                    >
                      <ButtonComponent
                        text={button.text}
                        idleColor={button.idleColor}
                        hoverColor={button.hoverColor}
                        clickedColor={button.clickedColor}
                        textColor={button.textColor}
                        width={scaledWidth} // Use scaled width
                        height={scaledHeight} // Use scaled height
                        fontSize={scaledFontSize} // Use scaled font size
                        border_thickness={button.borderThickness}
                        borderColor={button.borderColor}
                        fontFamily={button.fontFamily}
                        borderRadius={button.borderRadius}
                      />
                    </button>
                  );
                })}

                {/*buttonimageData.map((Button, index) => (
                  <button
                    key={index}
                    className=""
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
                      className="max-w-[60px] max-h-[60px] m-auto"
                    />
                  </button>
                ))*/}
              </div>
            )}

            {activeCategory === "Window" && (
              <>
                <div className="bg-gray-800 rounded-lg p-2">
                  <div className="flex w-full space-x-2 justify-between">
                    {/* Width Input */}
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <label className="text-sm font-medium text-white">
                        Width
                      </label>
                      <input
                        type="text"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-[80px] h-[30px] px-2 text-sm text-gray-800 placeholder-gray-500 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Enter width"
                      />
                    </div>

                    {/* Height Input */}
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <label className="text-sm font-medium text-white">
                        Height
                      </label>
                      <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-[80px] h-[30px] px-2 text-sm text-gray-800 placeholder-gray-500 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Enter height"
                      />
                    </div>

                    {/* Background Color Picker */}
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <label className="text-sm font-medium text-white">
                        Background
                      </label>

                      <div className="relative">
                        {/* Button with dynamic background color using inline styles */}
                        <button
                          onClick={() => setOpen(!open)} // Toggle open state
                          className="rounded-full text-xs p-[15px] border-2"
                          style={{ backgroundColor: color }}
                        ></button>

                        {/* Color picker only visible when 'open' is true */}
                        {open && (
                          <>
                            {" "}
                            <button
                              onClick={() => {
                                setOpen(!open);
                              }}
                              className="absolute z-20 top-8 left-0 p-0"
                            >
                              <img
                                src={closeSvg}
                                alt="close"
                                className="w-[17px]"
                              />
                            </button>
                            <SketchPicker
                              className="absolute z-10"
                              color={color || "#FFFFFF"}
                              onChange={(col) => {
                                const rgbaColor = `rgba(${col.rgb.r}, ${col.rgb.g}, ${col.rgb.b}, ${col.rgb.a})`; // Construct the RGBA string
                                setColor(rgbaColor); // Pass the RGBA string
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Set Button */}
                  <div className="flex justify-center sm:col-span-2 mt-4">
                    <button
                      className="w-full h-[40px] px-6 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
                      onClick={handleWindowSizeChange}
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div>
                  {/* Search input and button */}
                  <div className="mb-4 flex justify-center w-full relative">
                    <input
                      type="text"
                      placeholder="Search for images..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="border border-gray-300 text-sm w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs pr-12"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none"
                    >
                      <img
                        src={GraphicsSvg}
                        alt="Search Icon"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <div
                    id="bgimage-container"
                    className="grid grid-cols-2 gap-[5px] h-screen overflow-auto"
                  >
                    <button
                      className=""
                      onClick={() => handleImageChange(null)}
                    >
                      <img
                        src="https://img.freepik.com/free-photo/white-png-base_23-2151645368.jpg?size=626&ext=jpg&ga=GA1.1.1880011253.1728950400&semt=ais_hybrid-rr-similar"
                        alt="null"
                        className="w-[120px] border m-auto"
                      />
                    </button>
                    {ImageData.map((image, index) => (
                      <button
                        key={index}
                        className=""
                        onClick={() => handleImageChange(image.webformatURL)}
                      >
                        <img
                          src={image.previewURL}
                          alt={image.tags}
                          className="w-[120px] m-auto"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeCategory === "Text" && (
              <div className="grid grid-cols-2 gap-1">
                {textData.map((textItem) => (
                  <button
                    key={textItem._id}
                    className=""
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

            {activeCategory === "background" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center w-full relative">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="border border-gray-300 text-sm w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs pr-12"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none"
                  >
                    <img
                      src={GraphicsSvg}
                      alt="Search Icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-[5px] h-screen overflow-auto">
                  <button className="" onClick={() => handleImageChange(null)}>
                    <img
                      src="https://img.freepik.com/free-photo/white-png-base_23-2151645368.jpg?size=626&ext=jpg&ga=GA1.1.1880011253.1728950400&semt=ais_hybrid-rr-similar"
                      alt="null"
                      className="w-[120px] border m-auto"
                    />
                  </button>
                  {ImageData.map((image, index) => (
                    <button
                      key={index}
                      className=""
                      onClick={() => handleImageChange(image.webformatURL)}
                    >
                      <img
                        src={image.previewURL}
                        alt={image.tags}
                        className="w-[120px] m-auto"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeCategory === "Image" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center w-full relative">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="border border-gray-300 text-sm w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs pr-12"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none"
                  >
                    <img
                      src={GraphicsSvg}
                      alt="Search Icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* Image grid container with lazy loading */}
                <div
                  id="image-container"
                  className="grid grid-cols-2 gap-[5px] h-screen overflow-auto"
                >
                  {ImagesData.map((image, index) => (
                    <button
                      key={index}
                      className=""
                      onClick={() => {
                        // Add the additional properties to the image object
                        const modifiedImage = {
                          ...image,
                          x: 100,
                          y: 100,
                          variableName: "Image",
                          name: null,
                          hidden: true,
                          type: "Image",
                          scale_value: 0.3,
                          makeButton: false,
                          id: Date.now(),
                          opacity: 1,
                        };
                        // Pass the modified image object to onAddElement
                        onAddElement("Image", modifiedImage);
                      }}
                    >
                      <img
                        src={image.previewURL}
                        alt={image.tags}
                        className="w-[120px] border object-cover"
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

            {activeCategory === "Icons" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center w-full relative">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="border border-gray-300 text-sm w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs pr-12"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none"
                  >
                    <img
                      src={GraphicsSvg}
                      alt="Search Icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* Image grid container with lazy loading */}
                <div
                  id="icon-container"
                  className="grid grid-cols-4 gap-1 h-screen overflow-auto"
                >
                  {iconsData.map((image, index) => (
                    <button
                      key={index}
                      className="border p-1 m-auto"
                      onClick={() => {
                        // Function to calculate scale_value
                        const calculateScaleValue = (
                          svgString,
                          canvasHeight
                        ) => {
                          try {
                            // Parse the SVG string
                            const parser = new DOMParser();
                            const svgDoc = parser.parseFromString(
                              svgString,
                              "image/svg+xml"
                            );
                            const svgElement = svgDoc.querySelector("svg");

                            if (!svgElement) throw new Error("Invalid SVG");

                            // Get the height of the SVG
                            let svgHeight = parseFloat(
                              svgElement.getAttribute("height")
                            );

                            // If no explicit height, derive it from viewBox
                            if (isNaN(svgHeight)) {
                              const viewBox =
                                svgElement.getAttribute("viewBox");
                              if (viewBox) {
                                const [, , , viewBoxHeight] = viewBox
                                  .split(" ")
                                  .map(Number);
                                svgHeight = viewBoxHeight;
                              } else {
                                throw new Error(
                                  "No height or viewBox found in SVG"
                                );
                              }
                            }

                            // Calculate scale_value to make the SVG 30% of canvas height
                            return (canvasHeight * 0.3) / svgHeight;
                          } catch (error) {
                            console.error(
                              "Error calculating scale_value:",
                              error.message
                            );
                            return 0.5; // Default scale value if an error occurs
                          }
                        };

                        // Assume canvasHeight is known or fetched dynamically

                        // Calculate the scale_value
                        const scaleValue = calculateScaleValue(
                          image.svg,
                          height
                        );

                        // Add the additional properties to the image object
                        const modifiedImage = {
                          x: 100,
                          y: 100,
                          variableName: "Image",
                          webformatURL: image.svg,
                          name: null,
                          hiden: false,
                          type: "Svg",
                          makeButton: false,
                          scale_value: scaleValue,
                          id: Date.now(),
                        };
                        // Pass the modified image object to onAddElement
                        onAddElement("Image", modifiedImage);
                      }}
                    >
                      <div
                        style={{ width: "70px", margin: "auto" }}
                        dangerouslySetInnerHTML={{
                          __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                        }}
                      />
                    </button>
                  ))}
                  {loading && <p className="text-center">Loading...</p>}
                  {!hasMore && (
                    <p className="text-center text-gray-500">
                      No more icons to load.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeCategory === "Shapes" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center w-full relative">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="border border-gray-300 text-sm w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs pr-12"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none"
                  >
                    <img
                      src={GraphicsSvg}
                      alt="Search Icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* Image grid container with lazy loading */}
                <div
                  id="shape-container"
                  className="grid grid-cols-4 gap-1 h-[450px] overflow-auto"
                >
                  {ShapesData.map((image, index) => (
                    <button
                      key={index}
                      className="border p-1 m-auto"
                      onClick={() => {
                        // Function to calculate scale_value
                        const calculateScaleValue = (
                          svgString,
                          canvasHeight
                        ) => {
                          try {
                            // Parse the SVG string
                            const parser = new DOMParser();
                            const svgDoc = parser.parseFromString(
                              svgString,
                              "image/svg+xml"
                            );
                            const svgElement = svgDoc.querySelector("svg");

                            if (!svgElement) throw new Error("Invalid SVG");

                            // Get the height of the SVG
                            let svgHeight = parseFloat(
                              svgElement.getAttribute("height")
                            );

                            // If no explicit height, derive it from viewBox
                            if (isNaN(svgHeight)) {
                              const viewBox =
                                svgElement.getAttribute("viewBox");
                              if (viewBox) {
                                const [, , , viewBoxHeight] = viewBox
                                  .split(" ")
                                  .map(Number);
                                svgHeight = viewBoxHeight;
                              } else {
                                throw new Error(
                                  "No height or viewBox found in SVG"
                                );
                              }
                            }

                            // Calculate scale_value to make the SVG 30% of canvas height
                            return (canvasHeight * 0.3) / svgHeight;
                          } catch (error) {
                            console.error(
                              "Error calculating scale_value:",
                              error.message
                            );
                            return 0.5; // Default scale value if an error occurs
                          }
                        };

                        // Assume canvasHeight is known or fetched dynamically

                        // Calculate the scale_value
                        const scaleValue = calculateScaleValue(
                          image.svg,
                          height
                        );

                        // Add the additional properties to the image object
                        const modifiedImage = {
                          x: 100,
                          y: 100,
                          variableName: "Image",
                          webformatURL: image.svg,
                          name: null,
                          hiden: false,
                          type: "Svg",
                          scale_value: scaleValue, // Use the calculated scale_value
                          id: Date.now(),
                        };

                        // Pass the modified image object to onAddElement
                        onAddElement("Image", modifiedImage);
                      }}
                    >
                      <div
                        style={{ width: "70px", margin: "auto" }}
                        dangerouslySetInnerHTML={{
                          __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                        }}
                      />
                    </button>
                  ))}

                  {loading && <p className="text-center">Loading...</p>}
                  {!hasMore && (
                    <p className="text-center text-gray-500">
                      No more shapes to load.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeCategory === "graphics" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center w-full relative">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="border border-gray-300 text-sm w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs pr-12"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none"
                  >
                    <img
                      src={GraphicsSvg}
                      alt="Search Icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* Image grid container with lazy loading */}

                {GraphicsData.length < 1 ? (
                  <div>
                    <img src={LoadingGif} className="w-[200px] m-auto" />
                  </div>
                ) : (
                  <div
                    id="graphics-container"
                    className="grid grid-cols-3 gap-1 h-screen overflow-auto"
                  >
                    {GraphicsData.map((image, index) => (
                      <button
                        key={index}
                        className="border p-1 items-center justify-center"
                        onClick={() => {
                          let scaleValue = 0.3;

                          if (image.type === "Svg") {
                            // Function to calculate scale_value
                            const calculateScaleValue = (
                              svgString,
                              canvasHeight
                            ) => {
                              try {
                                // Parse the SVG string
                                const parser = new DOMParser();
                                const svgDoc = parser.parseFromString(
                                  svgString,
                                  "image/svg+xml"
                                );
                                const svgElement = svgDoc.querySelector("svg");

                                if (!svgElement) throw new Error("Invalid SVG");

                                // Get the height of the SVG
                                let svgHeight = parseFloat(
                                  svgElement.getAttribute("height")
                                );

                                // If no explicit height, derive it from viewBox
                                if (isNaN(svgHeight)) {
                                  const viewBox =
                                    svgElement.getAttribute("viewBox");
                                  if (viewBox) {
                                    const [, , , viewBoxHeight] = viewBox
                                      .split(" ")
                                      .map(Number);
                                    svgHeight = viewBoxHeight;
                                  } else {
                                    throw new Error(
                                      "No height or viewBox found in SVG"
                                    );
                                  }
                                }

                                // Calculate scale_value to make the SVG 30% of canvas height
                                return (canvasHeight * 0.3) / svgHeight;
                              } catch (error) {
                                console.error(
                                  "Error calculating scale_value:",
                                  error.message
                                );
                                return 0.5; // Default scale value if an error occurs
                              }
                            };

                            // Assume canvasHeight is known or fetched dynamically

                            // Calculate the scale_value
                            scaleValue = calculateScaleValue(image.svg, height);
                          }

                          // Add the additional properties to the image object
                          const modifiedImage = {
                            x: 100,
                            y: 100,
                            webformatURL:
                              image.type !== "Image" && image.type !== "Svg"
                                ? image.webformatURL
                                : image.svg,
                            variableName: "Image",
                            name: null,
                            hidden: false,
                            type: image.type !== "Svg" ? "Image" : image.type,
                            scale_value: scaleValue,
                            id: Date.now(),
                          };
                          // Pass the modified image object to onAddElement
                          onAddElement("Image", modifiedImage);
                        }}
                      >
                        {image.type !== "Svg" ? (
                          <img
                            src={image.previewURL || image.svg}
                            alt={image.tags || "Image"}
                            className="w-[70px] object-cover m-auto"
                          />
                        ) : (
                          <div
                            style={{ width: "70px", margin: "auto" }}
                            dangerouslySetInnerHTML={{
                              __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {loading && <p className="text-center">Loading...</p>}
                {!hasMore && (
                  <p className="text-center text-gray-500">
                    No more images to load.
                  </p>
                )}
              </div>
            )}

            {activeCategory === "element" && (
              <div>
                {/* Search input and button */}
                <div className="mb-4 flex justify-center w-full relative">
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="border border-gray-300 text-sm w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs pr-12"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none"
                  >
                    <img
                      src={GraphicsSvg}
                      alt="Search Icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {GraphicsData.length < 1 &&
                ImageData.length < 1 &&
                iconsData.length < 1 ? (
                  <div>
                    <img src={LoadingGif} className="w-[200px] m-auto" />
                  </div>
                ) : (
                  <>
                    {/* Label */}

                    <div className="flex justify-between items-center mt-6 mb-2">
                      <h1 className="text-md font-semibold text-gray-700">
                        Images
                      </h1>
                      <button
                        onClick={() => {
                          toggleCategory("Image");
                          fetchImages(searchTerm, page);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-400"
                      >
                        See All..
                      </button>
                    </div>
                    <div className="flex flex-col h-full w-[350px]">
                      {/* Image display with horizontal scroll */}
                      <div className="h-full w-[350px]">
                        <div className="flex h-[120px] space-x-2 overflow-x-auto">
                          {ImagesData.map((image, index) => (
                            <div key={index}>
                              <button
                                className="w-[120px]"
                                key={index}
                                onClick={() => {
                                  const modifiedImage = {
                                    ...image,
                                    x: 100,
                                    y: 100,
                                    variableName: "Image",
                                    name: null,
                                    hidden: true,
                                    type: "Image",
                                    scale_value: 0.3,
                                    makeButton: false,
                                    id: Date.now(),
                                    opacity: 1,
                                  };
                                  onAddElement("Image", modifiedImage);
                                }}
                              >
                                <img
                                  src={image.previewURL}
                                  alt={image.tags}
                                  className="w-[120px] border"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="flex justify-between items-center mt-4 mb-2">
                      <h1 className="text-md font-semibold text-gray-700">
                        Vectors
                      </h1>

                      <button
                        onClick={() => {
                          setGraphicsPage(0);
                          toggleCategory("graphics");
                          fetchgraphicsData();
                        }}
                        className="text-xs text-gray-600 hover:text-gray-400"
                      >
                        See All..
                      </button>
                    </div>
                    <div className="flex flex-col h-full">
                      {/* Image display with horizontal scroll */}
                      <div className="h-full w-[350px]">
                        <div className="flex space-x-2 overflow-x-auto">
                          {GraphicsData.map((image, index) => (
                            <div key={index}>
                              <button
                                className="border p-1 items-center justify-center w-[120px]"
                                onClick={() => {
                                  let scaleValue = 0.3;

                                  if (image.type === "Svg") {
                                    // Function to calculate scale_value
                                    const calculateScaleValue = (
                                      svgString,
                                      canvasHeight
                                    ) => {
                                      try {
                                        // Parse the SVG string
                                        const parser = new DOMParser();
                                        const svgDoc = parser.parseFromString(
                                          svgString,
                                          "image/svg+xml"
                                        );
                                        const svgElement =
                                          svgDoc.querySelector("svg");

                                        if (!svgElement)
                                          throw new Error("Invalid SVG");

                                        // Get the height of the SVG
                                        let svgHeight = parseFloat(
                                          svgElement.getAttribute("height")
                                        );
                                        // If no explicit height, derive it from viewBox
                                        if (isNaN(svgHeight)) {
                                          const viewBox =
                                            svgElement.getAttribute("viewBox");
                                          if (viewBox) {
                                            const [, , , viewBoxHeight] =
                                              viewBox.split(" ").map(Number);
                                            svgHeight = viewBoxHeight;
                                          } else {
                                            throw new Error(
                                              "No height or viewBox found in SVG"
                                            );
                                          }
                                        }

                                        // Calculate scale_value to make the SVG 30% of canvas height
                                        return (canvasHeight * 0.3) / svgHeight;
                                      } catch (error) {
                                        console.error(
                                          "Error calculating scale_value:",
                                          error.message
                                        );
                                        return 0.5; // Default scale value if an error occurs
                                      }
                                    };

                                    // Assume canvasHeight is known or fetched dynamically

                                    // Calculate the scale_value
                                    scaleValue = calculateScaleValue(
                                      image.svg,
                                      height
                                    );
                                  }

                                  // Add the additional properties to the image object
                                  const modifiedImage = {
                                    x: 100,
                                    y: 100,
                                    webformatURL:
                                      image.type !== "Image" &&
                                      image.type !== "Svg"
                                        ? image.webformatURL
                                        : image.svg,
                                    variableName: "Image",
                                    name: null,
                                    hidden: false,
                                    type:
                                      image.type !== "Svg"
                                        ? "Image"
                                        : image.type,
                                    scale_value: scaleValue,
                                    id: Date.now(),
                                  };
                                  // Pass the modified image object to onAddElement
                                  onAddElement("Image", modifiedImage);
                                }}
                              >
                                {image.type !== "Svg" ? (
                                  <img
                                    src={image.previewURL || image.svg}
                                    alt={image.tags || "Image"}
                                    className="w-[120px]"
                                  />
                                ) : (
                                  <div
                                    style={{ width: "70px", margin: "auto" }}
                                    dangerouslySetInnerHTML={{
                                      __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                                    }}
                                  />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Label */}

                    <div className="flex justify-between items-center mt-6 mb-2">
                      <h1 className="text-md font-semibold text-gray-700">
                        Icons
                      </h1>

                      <button
                        onClick={() => {
                          setIconsData([]);
                          setSearchTerm("");
                          setIconsLoading(false);
                          setIconsHasMore(true);
                          fetchIcons("", 0);
                          toggleCategory("Icons");
                        }}
                        className="text-xs text-gray-600 hover:text-gray-400"
                      >
                        See All..
                      </button>
                    </div>
                    <div className="flex flex-col h-full">
                      {/* Image display with horizontal scroll */}
                      <div className="h-full w-[350px]">
                        <div className="flex space-x-2 overflow-x-auto">
                          {iconsData.map((image, index) => (
                            <button
                              key={index}
                              className="border p-1 m-auto"
                              onClick={() => {
                                // Function to calculate scale_value
                                const calculateScaleValue = (
                                  svgString,
                                  canvasHeight
                                ) => {
                                  try {
                                    // Parse the SVG string
                                    const parser = new DOMParser();
                                    const svgDoc = parser.parseFromString(
                                      svgString,
                                      "image/svg+xml"
                                    );
                                    const svgElement =
                                      svgDoc.querySelector("svg");

                                    if (!svgElement)
                                      throw new Error("Invalid SVG");

                                    // Get the height of the SVG
                                    let svgHeight = parseFloat(
                                      svgElement.getAttribute("height")
                                    );

                                    // If no explicit height, derive it from viewBox
                                    if (isNaN(svgHeight)) {
                                      const viewBox =
                                        svgElement.getAttribute("viewBox");
                                      if (viewBox) {
                                        const [, , , viewBoxHeight] = viewBox
                                          .split(" ")
                                          .map(Number);
                                        svgHeight = viewBoxHeight;
                                      } else {
                                        throw new Error(
                                          "No height or viewBox found in SVG"
                                        );
                                      }
                                    }

                                    console.log(svgHeight);

                                    // Calculate scale_value to make the SVG 30% of canvas height
                                    return (canvasHeight * 0.3) / svgHeight;
                                  } catch (error) {
                                    console.error(
                                      "Error calculating scale_value:",
                                      error.message
                                    );
                                    return 0.5; // Default scale value if an error occurs
                                  }
                                };

                                // Assume canvasHeight is known or fetched dynamically

                                // Calculate the scale_value
                                const scaleValue = calculateScaleValue(
                                  image.svg,
                                  height
                                );

                                // Add the additional properties to the image object
                                const modifiedImage = {
                                  x: 100,
                                  y: 100,
                                  variableName: "Image",
                                  webformatURL: image.svg,
                                  name: null,
                                  hiden: false,
                                  type: "Svg",
                                  makeButton: false,
                                  scale_value: scaleValue,
                                  id: Date.now(),
                                };
                                // Pass the modified image object to onAddElement
                                onAddElement("Image", modifiedImage);
                              }}
                            >
                              <div
                                style={{ width: "70px", margin: "auto" }}
                                dangerouslySetInnerHTML={{
                                  __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Label */}

                    <div className="flex justify-between items-center mt-6 mb-2">
                      <h1 className="text-md font-semibold text-gray-700">
                        Shapes
                      </h1>
                      <button
                        onClick={() => {
                          setShapesData([]);
                          setSearchTerm("");
                          setShapesLoading(false);
                          setShapesHasMore(true);
                          fetchShapes("", 0);
                          toggleCategory("Shapes");
                        }}
                        className="text-xs text-gray-600 hover:text-gray-400"
                      >
                        See All..
                      </button>
                    </div>

                    <div className="flex flex-col h-full">
                      {/* Image display with horizontal scroll */}
                      <div className="h-full w-[350px]">
                        <div className="flex h-[100px] space-x-2 overflow-x-auto">
                          {ShapesData.map((image, index) => (
                            <button
                              key={index}
                              className="border p-1 m-auto"
                              onClick={() => {
                                // Function to calculate scale_value
                                const calculateScaleValue = (
                                  svgString,
                                  canvasHeight
                                ) => {
                                  try {
                                    // Parse the SVG string
                                    const parser = new DOMParser();
                                    const svgDoc = parser.parseFromString(
                                      svgString,
                                      "image/svg+xml"
                                    );
                                    const svgElement =
                                      svgDoc.querySelector("svg");

                                    if (!svgElement)
                                      throw new Error("Invalid SVG");

                                    // Get the height of the SVG
                                    let svgHeight = parseFloat(
                                      svgElement.getAttribute("height")
                                    );

                                    // If no explicit height, derive it from viewBox
                                    if (isNaN(svgHeight)) {
                                      const viewBox =
                                        svgElement.getAttribute("viewBox");
                                      if (viewBox) {
                                        const [, , , viewBoxHeight] = viewBox
                                          .split(" ")
                                          .map(Number);
                                        svgHeight = viewBoxHeight;
                                      } else {
                                        throw new Error(
                                          "No height or viewBox found in SVG"
                                        );
                                      }
                                    }

                                    // Calculate scale_value to make the SVG 30% of canvas height
                                    return (canvasHeight * 0.3) / svgHeight;
                                  } catch (error) {
                                    console.error(
                                      "Error calculating scale_value:",
                                      error.message
                                    );
                                    return 0.5; // Default scale value if an error occurs
                                  }
                                };

                                // Assume canvasHeight is known or fetched dynamically

                                // Calculate the scale_value
                                const scaleValue = calculateScaleValue(
                                  image.svg,
                                  height
                                );

                                // Add the additional properties to the image object
                                const modifiedImage = {
                                  x: 100,
                                  y: 100,
                                  variableName: "Image",
                                  webformatURL: image.svg,
                                  name: null,
                                  hiden: false,
                                  type: "Svg",
                                  scale_value: scaleValue, // Use the calculated scale_value
                                  id: Date.now(),
                                };

                                // Pass the modified image object to onAddElement
                                onAddElement("Image", modifiedImage);
                              }}
                            >
                              <div
                                style={{ width: "70px", margin: "auto" }}
                                dangerouslySetInnerHTML={{
                                  __html: setSvgSize(image.svg, "70", "70"), // Set width and height dynamically
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {CircleData.map((circle, index) => (
                        <button
                          onClick={() => {
                            let data = {
                              ...circle,
                              borderColor: "rgba(0,0,0,1)",
                              borderWidth: 0,
                              visibility: true,
                              tag: null,
                              variableName: "CircleShape",
                            };
                            onAddElement("Circle", data);
                          }}
                          className="border p-1"
                          key={index}
                        >
                          <svg
                            width={`${circle.radius * 2}`}
                            height={`${circle.radius * 2}`}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx={`${circle.radius}`}
                              cy={`${circle.radius}`}
                              r={`${circle.radius}`}
                              fill={`${circle.Color}`}
                            />
                          </svg>
                        </button>
                      ))}
                      {LineData.map((line, index) => (
                        <button
                          onClick={() => {
                            let data = {
                              ...line,
                              visibility: true,
                              tag: null,
                              variableName: "LineShape",
                            };
                            onAddElement("Line", data);
                          }}
                          className="border p-1"
                          key={index}
                        >
                          <svg
                            width={`${Math.abs(line.x2 - line.x1)}`}
                            height={`${Math.abs(line.y2 - line.y1)}`}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <line
                              x1={`${line.x1}`}
                              y1={`${line.y1}`}
                              x2={`${line.x2}`}
                              y2={`${line.y2}`}
                              stroke={`${line.Color}`}
                              strokeWidth={`${line.strokeWidth}`}
                            />
                          </svg>
                        </button>
                      ))}
                      {RectData.map((rect, index) => (
                        <button
                          onClick={() => {
                            let data = {
                              type:"GroupLayout"
                            };
                            onAddElement("GroupLayout", data);
                          }}
                          className="border p-1"
                          key={index}
                        >
                          <svg
                            width={`${rect.width}`}
                            height={`${rect.height}`}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width={`${rect.width}`}
                              height={`${rect.height}`}
                              fill={`${rect.Color}`}
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </>
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
