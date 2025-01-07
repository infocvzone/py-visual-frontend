import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import CanvasArea from "../components/display/CanvasArea";
import CodeDisplay from "../components/display/CodeDisplay";
import ElementEditor from "../components/editors/ElementEditor";
import Header from "../components/layout/Header";
import axios from "axios";
import { API_KEY } from "../../constant";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { handleGenerateCode } from "../utils/codeGenerator";
import { handleDownloadProject } from "../utils/downloadProject";

// Home component definition
const Home = () => {
  // State for holding UI elements, their positions, the selected element, and generated code
  const location = useLocation();
  const { projectData } = location.state;

  const [elements, setElements] = useState([]);
  const [positions, setPositions] = useState([]);
  const [heights, setHeights] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeDisplay, setCodeDisplay] = useState(false);
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(700);
  const [color, setColor] = useState();
  const [ProjectName, SetProjectName] = useState("");
  const [bgImage, setBgImage] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (projectData !== false) {
      createProject(projectData);
    }
  }, []);

  // Function to add a new element
  const handleAddElement = (type, element) => {
    // Update the element's id to the current timestamp
    let updatedElement = {};
    if (type === "BasicButton") {
      updatedElement = {
        ...element,
        id: Date.now(),
        lock: false,
        zIndex: 1,
        visibility: true,
      };
    } else {
      updatedElement = {
        ...element,
        id: Date.now(),
        lock: false,
        zIndex: 1,
        visibility: true,
        opacity: 1,
      };
    }

    // Set the updated element and position
    setElements((prev) => [...prev, updatedElement]);
    setPositions((prev) => ({
      ...prev,
      [updatedElement.id]: { x: Number(element.x), y: Number(element.y) }, // Initialize position for the new element
    }));

    setHeights((prev) => ({
      ...prev,
      [updatedElement.id]: { height: 0 },
    }));
  };

  // Function to update the position of an element
  const handleUpdatePosition = (element) => {
    setPositions((prev) => ({
      ...prev,
      [element.id]: { x: element.x, y: element.y }, // Update position for the specific element
    }));
  };

  const handleUpdateSize = (element) => {
    setHeights((prev) => ({
      ...prev,
      [element.id]: { height: element.height }, // Update height only
    }));
  };

  // Function to handle element removal
  const removeElement = (id) => {
    const updatedElements = elements.filter((el) => el.id !== id); // Filter out the element
    setElements(updatedElements); // Update the state
    setSelectedElement(null);
  };

  const handleScaleElement = (id, width, height, scale_value) => {
    console.log("Before update:", elements); // Log the current state
    console.log(`${id} - ${width} - ${height} - ${scale_value}`);

    setElements((prevElements) => {
      const updatedElements = prevElements.map((el) =>
        el.id.toString() === id.toString()
          ? el.type === "Image"
            ? { ...el, scale_value: scale_value > 1 ? 1 : scale_value }
            : el.type === "Svg"
            ? { ...el, scale_value: scale_value }
            : el.type === "Circle"
            ? {
                ...el,
                radius: scale_value,
              }
            : el.type === "ButtonImage"
            ? { ...el, scale: scale_value }
            : el.type === "Text"
            ? { ...el, boxWidth: width, fontSize: scale_value } // Update fontSize for Text
            : { ...el, width: Math.floor(width), height: Math.floor(height) } // Update width/height for others
          : el
      );
      console.log("Updated elements:", updatedElements);
      return updatedElements;
    });
  };

  // Function to create a new project
  const createProject = async (project) => {
    // Set height and width first
    setPositions(project.positions);
    setElements(project.elements);
    setColor(project.color);
    setBgImage(project.bgImage);
    SetProjectName(project.name);
    // Use setTimeout to delay the setting of other state values by 1 second
    setTimeout(() => {
      setHeight(project.height);
      setWidth(project.width);
    }, 500); // Delay in milliseconds (1000ms = 1 second)
  };

  // Function to save the current project
  const saveProject = async (projectName) => {
    if (projectName === "") {
      Swal.fire({
        title: "Error!",
        text: "Please provide Project Name",
        icon: "error",
      });
      return;
    }
    try {
      const response = await axios.put(`${API_KEY}api/projects/`, {
        name: projectName, // replace with dynamic project name if needed
        user: user._id,
        color: color,
        bgImage: bgImage,
        width: width,
        height: height,
        elements: elements,
        positions: positions,
      });
      Swal.fire({
        title: `Project ${projectName} Saved!`,
        showCancelButton: false,
        confirmButtonText: "ok",
      });
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div className="home bg-[#f0f1f5] overflow-y-auto">
      {/* Header at the top */}
      <Header
        onGenerateCode={() => {
          handleGenerateCode(
            elements,
            positions,
            heights,
            width,
            height,
            color,
            bgImage,
            setCodeDisplay,
            codeDisplay,
            setGeneratedCode
          );
        }} // Pass down the generate code handler
        onSaveProject={saveProject}
        ProjectName={ProjectName}
      />

      <div className="relative flex h-screen">
        {/* Sidebar on the left */}
        <Sidebar
          onAddElement={handleAddElement} // Pass down the add element handler
          Height={!projectData ? null : projectData.height}
          Width={!projectData ? null : projectData.width}
          onWindowSizeChange={(width, height, color) => {
            setHeight(height);
            setWidth(width);
            setColor(color);
          }}
          onBgImageChange={(image) => {
            setBgImage(image);
          }}
        />

        {/* Main content area */}
        <div className="flex flex-1 flex-col ml-24">
          {/* Editable element */}
          {selectedElement && (
            <ElementEditor
              selectedElement={selectedElement}
              elements={elements}
              setElements={setElements}
            />
          )}

          {/* Canvas area */}
          <CanvasArea
            elements={elements} // Pass down the elements to CanvasArea
            onUpdatePosition={handleUpdatePosition} // Pass down the position update handler
            onUpdateSize={handleUpdateSize}
            onScaleElement={handleScaleElement} // Pass down the scale element handler
            onAddElement={handleAddElement}
            onRemoveElement={removeElement}
            setPOSITION={setPositions}
            setELEMENTS={setElements}
            positions={positions}
            Height={height}
            Width={width}
            Image={bgImage}
            bgColor={color}
            selectedIndex={(elementData) => {
              setSelectedElement(elementData);
            }}
          />
        </div>
      </div>

      {/* Optional code display */}
      {codeDisplay && (
        <CodeDisplay
          code={generatedCode}
          setCodeDisplay={setCodeDisplay}
          onDownloadProject={() => {
            handleDownloadProject(elements, bgImage, generatedCode);
          }}
        />
      )}
    </div>
  );
};

export default Home; // Export the App component
