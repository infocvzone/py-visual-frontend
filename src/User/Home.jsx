import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import CanvasArea from "./CanvasArea";
import CodeDisplay from "./CodeDisplay";
import ElementEditor from "./ElementEditor";
import Header from "./Header";
import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";
import { API_KEY } from "../constant";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

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

  // Function to convert hex to RGB
  const hexToRgb = (hex) => {
    // Remove the '#' if present
    hex = hex.replace(/^#/, "");

    // Parse the hex into RGB components
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `(${r}, ${g}, ${b}, 1)`;
  };

  // Function to generate Python code based on current elements
  const handleGenerateCode = async () => {
    setCodeDisplay(!codeDisplay);

    // Collect all element names for the global declaration
    let globalElementNames = elements
      .map((el, index) => `${el.variableName}_${index + 1}`)
      .join(", ");
    // Sort elements by their zIndex property (default to 1 if not defined)
    const sortedElements = [...elements].sort(
      (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
    );
    let pythonCode = `
#.................... 1. LOGIC CODE ....................#\n\n
#.................... 2. EVENTS BINDING ....................#\n
def attach_events():
    pass

#.................... 3. MAIN FUNCTION ....................#\n
def main():
  # Create a window for the calculator
  window = pv.Window(title="PyVisual Window", width=${
    !width ? 700 : width
  }, height=${!height ? 400 : height}, bg_color=${
      !color ? `(1,1,1,1)` : `${normalizeRgba(color)}`
    },
  icon=None, bg_image=${
    !bgImage ? "None" : `"assets/background/background.jpg"`
  }, is_frameless=False, is_resizable=False)
  create_ui(window)
  attach_events()
  # Display the window
  window.show()

#..................... 4. UI CODE .....................#\n

ui = {}

def create_ui(window):

 
`; // Initial code string

    sortedElements.forEach((el, index) => {
      const pos = positions[el.id] || { x: 50, y: 50 }; // Get position or default
      const elHeight = heights[el.id]?.height || 0;
      let params =
        el.type === "Line"
          ? `(window=window`
          : `(window=window, x=${pos.x}, y=${
              !height ? 400 - pos.y - elHeight : height - pos.y - elHeight
            }`;

      // Handle parameters for each element type
      switch (el.type) {
        case "BasicButton":
          params += `, 
          width=${Math.floor(el.width)}, height=${Math.floor(
            el.height
          )}, text='${el.text}', 
          font="assets/fonts/${el.fontFamily}/${
            el.fontFamily
          }.ttf", font_size=${el.fontSize}, font_color=${normalizeRgba(
            el.textColor
          )},
          bold = ${el.bold === true ? `True` : `False`}, italic = ${
            el.italic === true ? `True` : `False`
          }, underline = ${
            el.underline === true ? `True` : `False`
          }, strikethrough = ${el.strikethrough === true ? `True` : `False`},
          button_color=${normalizeRgba(
            el.idleColor
          )}, hover_opacity= 0.7, clicked_opacity= 0.5,  
          border_color=${normalizeRgba(el.borderColor)}, border_thickness=${
            el.borderThickness
          }, corner_radius = ${el.borderRadius},
          is_visible=${
            el.visibility === true ? `True` : `False`
          }, disabled = False, disabled_opacity = 0.3, opacity=${el.opacity},
          on_hover=${el.onHover === null ? "None" : el.onHover}, on_click=${
            el.onClick === null ? "None" : el.onClick
          }, on_release=${el.onRelease === null ? "None" : el.onRelease}, tag=${
            el.name === null || el.name === "" ? `None` : `"${el.name}"`
          }      
          `;
          break;

        case "InputField":
          params += `, width=${el.width}, height=${el.height}, visibility=${
            el.visibility === true ? `True` : `False`
          }, background_color=${normalizeRgba(el.bgColor)}, input_type='${
            el.input_type
          }',
          placeholder='${el.placeholder}', default_text="${el.text}", 
          text_padding_left=${el.padding_left}, text_padding_right=${
            el.padding_right
          }, text_padding_top=${el.padding_top}, text_padding_bottom=${
            el.padding_bottom
          },
          font="assets/fonts/${el.fontFamily}/${
            el.fontFamily
          }.ttf", font_size=${el.fontSize}, font_color=${normalizeRgba(
            el.textColor
          )},
          border_color=${normalizeRgba(el.borderColor)}, border_thickness=${
            el.borderThickness
          }, 
          border_style= ["${el.border_style[0]}", "${el.border_style[1]}", "${
            el.border_style[2]
          }", "${el.border_style[3]}"], on_input=${
            !el.on_input ? "None" : `"${el.on_input}"`
          }, tag = ${
            el.name === null || el.name === "" ? `None` : `"${el.name}"`
          }`;

          break;

        case "Text":
          let Bold = el.bold === true ? "True" : "False";
          let Italic = el.italic === true ? "True" : "False";
          let Underline = el.underline === true ? "True" : "False";
          let Strike = el.strikethrough === true ? "True" : "False";
          params += `, text='${el.text}',
          font="assets/fonts/${el.fontFamily}/${el.fontFamily}.ttf", font_color=${normalizeRgba(el.color)}, font_size=${el.fontSize},
          bold=${Bold} , italic=${Italic}, underline=${Underline}, strikethrough=${Strike}, 
          bg_color=${normalizeRgba(el.bgColor)}, box_width=${el.boxWidth}, text_alignment="${el.textAlignment}",
          is_visible=${el.visibility === true ? `True` : `False`}, opacity=${el.opacity}, tag = ${el.name === null || el.name === "" ? `None` : `"${el.name}"`
          }`;
          break;

        case "Toggle":
          params += `, ${el.width}, ${el.height}, initial_state=${el.initialState}, 
                         border_color='${el.borderColor}', border_thickness=${el.borderThickness}, 
                         colors={'onColor': '${el.colors.onColor}', 'offColor': '${el.colors.offColor}', 'handleColor': '${el.colors.handleColor}'}, scale=${el.scale}`;
          break;

        case "Slider":
          params += `, ${el.width}, ${el.height}, min_value=${el.minValue}, 
                         max_value=${el.maxValue}, initial_value=${el.initialValue}, 
                         colors={'trackColor': '${el.colors.trackColor}', 'fillColor': '${el.colors.fillColor}', 'knobColor': '${el.colors.knobColor}'}, 
                         knob_size=${el.knobSize}, font_size=${el.fontSize}, 
                         text_color='${el.textColor}', text_offset=${el.textOffset}, 
                         show_text=${el.showText}`;
          break;

        case "Checkbox":
          params += `, ${el.width}, ${el.height}, checked=${el.checked}, 
                         border_color='${el.borderColor}', border_thickness=${el.borderThickness}, 
                         scale=${el.scale}`;
          break;

        case "RadioButton":
          params += `, ${el.size}, num_buttons=${
            el.numButtons
          }, selected_index=${el.selectedIndex}, 
                         layout='${el.layout}', gap=${el.gap}, scale=${
            el.scale
          }, 
                         border_color='${el.borderColor}', border_thickness=${
            el.borderThickness
          }, 
                         colors={'selectedColor': '${
                           el.colors.selectedColor
                         }', 'unselectedColor': '${
            el.colors.unselectedColor
          }'}, 
                         labels=${JSON.stringify(el.labels)}, font_size=${
            el.fontSize
          }, 
                         text_color='${el.textColor}', text_offset=${
            el.textOffset
          }`;
          break;

        case "DropdownMenu":
          params += `, ${el.width}, ${el.height}, options=${JSON.stringify(
            el.options
          )}, 
                         placeholder='${el.placeholder}', font_size=${
            el.fontSize
          }, 
                         text_color='${el.textColor}', bg_color='${
            el.bgColor
          }', 
                         border_color='${el.borderColor}', border_thickness=${
            el.borderThickness
          }, 
                         dropdown_bg_color='${
                           el.dropdownBgColor
                         }', hover_color='${el.hoverColor}', padding=${
            el.padding
          }`;
          break;

        case "ProgressBar":
          params += `, ${el.width}, ${el.height}, min_value=${el.minValue}, 
                         max_value=${el.maxValue}, initial_value=${el.initialValue}, 
                         scale=${el.scale}, font_size=${el.fontSize}, text_color='${el.textColor}', 
                         text_offset=${el.textOffset}, show_text=${el.showText}`;
          break;
        case "Image":
          params += `, image_path="assets/Images/image_${index + 1}", 
          scale=${el.scale_value}, is_visible=${el.visibility === false ? "False" : "True"}, opacity=${el.opacity}, tag=${el.name === null || el.name === "" ? `None` : `"${el.name}"`
          }`;
          break;
        case "Svg":
          params += `, image_path="assets/Images/image_${
            index + 1
          }.svg", scale=${el.scale_value}, visibility=${
            el.visibility === true ? `True` : `False`
          }, tag = ${
            el.name === null || el.name === "" ? `None` : `"${el.name}"`
          }`;
          break;

        case "ButtonImage":
          params += `, scale = ${el.scale}, text="${el.text}", 
          idle_image = "assets/Buttons/Button_${index + 1}/idle.png",
          hover_image = "assets/Buttons/Button_${index + 1}/hover.png",
          clicked_image = "assets/Buttons/Button_${index + 1}/clicked.png",
          font="assets/fonts/${el.fontFamily}/${
            el.fontFamily
          }.ttf", font_size=${el.fontSize},font_color="${normalizeRgba(
            el.textColor
          )}", visibility=${el.visibility === true ? `True` : `False`},
          on_hover=${
            el.onHover === null || el.onHover === "" ? "None" : el.onHover
          }, on_click=${
            el.onClick === null || el.onClick === "" ? "None" : el.onClick
          }, on_release=${
            el.onRelease === null || el.onRelease === "" ? "None" : el.onRelease
          }, 
          tag = ${
            el.name === null || el.name === "" ? `None` : `"${el.name}"`
          }`;
          break;

        case "Rect":
          params += `, width=${Math.floor(el.width)}, height=${Math.floor(
            el.height
          )}, corner_radius=${el.radius}, 
          bg_color=${normalizeRgba(el.Color)}, border_color=${normalizeRgba(
            el.borderColor
          )}, border_thickness=${el.borderWidth}, 
          is_visible=${el.visibility === true ? `True` : `False`}, opacity=${el.opacity}, tag=${
            el.tag === null ? `None` : `"${el.tag}"`
          }`;
          break;

        case "Circle":
          params += `, radius=${Math.floor(el.radius)}, 
            bg_color=${normalizeRgba(el.Color)}, border_color=${normalizeRgba(
            el.borderColor
          )}, border_thickness=${el.borderWidth}, 
            is_visible=${el.visibility === true ? `True` : `False`}, opacity=${el.opacity}, tag=${
            el.tag === null ? `None` : `"${el.tag}"`
          }`;
          break;

        case "Line":
          params += `, points=[${Math.floor(el.x1)} , ${Math.floor(
            height - el.y1
          )}, ${Math.floor(el.x2)}, ${Math.floor(height - el.y2)} ], thickness=${
            el.strokeWidth
          }, 
            color=${normalizeRgba(el.Color)}, is_visible= ${
            el.visibility === true ? `True` : `False`
          }, opacity=${el.opacity}, tag=${el.tag === null ? `None` : `"${el.tag}"`}`;
          break;

        default:
          break;
      }

      params += ")";
      pythonCode += ` 
    #Element ${index + 1}\n   ui["${el.variableName}_${index + 1}"] = pv.${
        el.type === "InputField"
          ? "BasicTextInput"
          : el.type === "ButtonImage"
          ? "CustomButton"
          : el.type === "Svg"
          ? "Image"
          : el.type === "Rect"
          ? "RectangleShape"
          : el.type === "Circle"
          ? "CircleShape"
          : el.type === "Line"
          ? "LineShape"
          : el.type
      }${params}\n`;
    });

    pythonCode += `
    

if __name__ == '__main__':
  import pyvisual as pv
  main()`;

    setGeneratedCode(pythonCode); // Update the generated code state
  };

  function normalizeRgba(color) {
    if (color.startsWith("rgba")) {
      // Match the RGBA components using a regular expression
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);

      if (!match) {
        throw new Error("Invalid RGBA format");
      }

      // Extract RGBA components and normalize
      const r = parseFloat(match[1]) / 255;
      const g = parseFloat(match[2]) / 255;
      const b = parseFloat(match[3]) / 255;
      const a = parseFloat(match[4]);

      return `(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a})`;
    } else if (color.startsWith("#")) {
      // Convert hex to RGB
      const hex = color.replace("#", "");

      if (hex.length === 3) {
        // Expand shorthand hex (#RGB -> #RRGGBB)
        const r = parseInt(hex[0] + hex[0], 16) / 255;
        const g = parseInt(hex[1] + hex[1], 16) / 255;
        const b = parseInt(hex[2] + hex[2], 16) / 255;
        const a = 1; // Default alpha for hex

        return `(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a})`;
      } else if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        const a = 1; // Default alpha for hex

        return `(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a})`;
      } else {
        throw new Error("Invalid Hexadecimal format");
      }
    } else {
      throw new Error("Unsupported color format");
    }
  }

  const handleDownloadProject = async () => {
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets"); // Create folder for assets
    const fontsFolder = assetsFolder.folder("fonts"); // Create folder for fonts
    const backgroundFolder = assetsFolder.folder("background");
    const Buttons = assetsFolder.folder("Buttons");
    const Images = assetsFolder.folder("Images");

    await handleGenerateCode();
    setCodeDisplay(false);

    // Fetch available fonts from the database
    let fontsData = [];
    try {
      const response = await axios.get(`${API_KEY}api/fonts/`); // Replace with your API URL
      fontsData = response.data;
    } catch (error) {
      console.error("Error fetching fonts:", error);
      return;
    }

    // Helper function to download a font or image by URL
    const downloadResource = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to download resource from ${url}`);
      return await res.blob();
    };

    // Sort elements by their zIndex property (default to 1 if not defined)
    const sortedElements = [...elements].sort(
      (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
    );

    let index = 0;
    // Loop through elements and handle ButtonImage types
    for (const element of sortedElements) {
      index += 1;
      if (element.type === "ButtonImage") {
        let Folder = element.Name;
        Folder = Buttons.folder(`Button_${index}`);
        // Convert the Base64 images into blobs and save them in the assets folder
        if (element.idleImage) {
          const idleImageBlob = base64ToBlob(element.idleImage);
          Folder.file(`idle.png`, idleImageBlob);
        }
        if (element.hoverImage) {
          const hoverImageBlob = base64ToBlob(element.hoverImage);
          Folder.file(`hover.png`, hoverImageBlob);
        }
        if (element.clickedImage) {
          const clickImageBlob = base64ToBlob(element.clickedImage);
          Folder.file(`clicked.png`, clickImageBlob);
        }
      }

      // Check if the element has a font that matches any fetched font
      if (element.fontFamily) {
        const matchedFont = fontsData.find(
          (font) => font.name === element.fontFamily
        );
        if (matchedFont) {
          try {
            const fontBlob = await downloadResource(matchedFont.url);

            // Create a sub-folder for the font inside the fonts folder
            const fontSubFolder = fontsFolder.folder(matchedFont.name);
            fontSubFolder.file(`${matchedFont.name}.ttf`, fontBlob);
          } catch (error) {
            console.error(
              `Failed to download font: ${matchedFont.name}`,
              error
            );
          }
        }
      }
      if (element.type === "Image") {
        try {
          const image = await downloadResource(element.webformatURL);
          Images.file(`image_${index}`, image);
        } catch (error) {
          console.error("Failed to download background image:", error);
        }
      }
      if (element.type === "Svg") {
        try {
          // Directly save the SVG string to a file
          const svgBlob = new Blob([element.webformatURL], {
            type: "image/svg+xml",
          });
          Images.file(`image_${index}.svg`, svgBlob);
        } catch (error) {
          console.error("Failed to save SVG:", error);
        }
      }
    }

    // Download background image if the URL is provided and save it as background.jpg
    if (bgImage) {
      try {
        const backgroundImageBlob = await downloadResource(bgImage);
        backgroundFolder.file("background.jpg", backgroundImageBlob);
      } catch (error) {
        console.error("Failed to download background image:", error);
      }
    }

    // Generate the main.py file
    zip.file("main.py", generatedCode);

    // Generate the ZIP file
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "project.zip");
    });
  };

  // Helper function to convert Base64 to Blob
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="home bg-[#f0f1f5] overflow-y-auto">
      {/* Header at the top */}
      <Header
        onGenerateCode={handleGenerateCode} // Pass down the generate code handler
        onDownloadProject={handleDownloadProject}
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
          onDownloadProject={handleDownloadProject}
        />
      )}
    </div>
  );
};

export default Home; // Export the App component
