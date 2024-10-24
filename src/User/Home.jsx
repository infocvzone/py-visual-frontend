import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CanvasArea from "./CanvasArea";
import CodeDisplay from "./CodeDisplay";
import ElementEditor from "./ElementEditor";
import Header from "./Header";
import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";
import { API_KEY } from "../constant";

// Home component definition
const Home = () => {
  // State for holding UI elements, their positions, the selected element, and generated code
  const [elements, setElements] = useState([]);
  const [positions, setPositions] = useState([]);
  const [heights, setHeights] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeDisplay, setCodeDisplay] = useState(false);
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();
  const [color, setColor] = useState();
  const [bgImage, setBgImage] = useState(null);

  // Function to add a new element
  const handleAddElement = (type, element) => {
    // Update the element's id to the current timestamp
    const updatedElement = { ...element, id: Date.now() };

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

  // Function to scale an element
  const handleScaleElement = (fabricElement) => {
    const updatedElements = elements.map((el) =>
      el.id === fabricElement.id ? { ...el, scale: fabricElement.scaleX } : el
    );
    setElements(updatedElements);
  };

  // Function to generate Python code based on current elements
  const handleGenerateCode = async () => {
    setCodeDisplay(!codeDisplay);

    // Collect all element names for the global declaration
    let globalElementNames = elements
      .map(
        (el, index) =>
          `${
            el.type === "BasicButton" || el.type === "ButtonImage"
              ? "Button"
              : el.type
          }_${index + 1}`
      )
      .join(", ");

    let pythonCode = `
def create_ui(window):

  ${
    elements.length > 0
      ? `global ${globalElementNames}  # Declaring all UI elements globally`
      : `pass`
  } 
`; // Initial code string

    elements.forEach((el, index) => {
      const pos = positions[el.id] || { x: 50, y: 50 }; // Get position or default
      const elHeight = heights[el.id]?.height || 0;
      let params = `(window=window, x=${pos.x}, y=${
        !height ? 400 - pos.y - elHeight : height - pos.y - elHeight
      }`;

      // Handle parameters for each element type
      switch (el.type) {
        case "BasicButton":
          params += `, width=${el.width}, height=${el.height}, text='${
            el.text
          }',
          font="assets/fonts/${el.fontFamily}/${
            el.fontFamily
          }.ttf", font_size=${el.fontSize}, font_color = '${el.textColor}',
                idle_color = '${el.idleColor}', hover_color = '${
            el.hoverColor
          }', clicked_color = '${el.clickedColor}' ,  
                border_color='${el.borderColor}', border_thickness=${
            el.borderThickness
          },
                on_hover=${
                  el.onHover === null ? "None" : el.onHover
                }, on_click=${
            el.onClick === null ? "None" : el.onClick
          }, on_release=${
            el.onRelease === null ? "None" : el.onRelease
          }, name = "Button_${index + 1}"
                `;
          break;

        case "InputField":
          params += `, width=${el.width}, height=${
            el.height
          }, background_color='${el.bgColor}', input_type='${el.input_type}',
          placeholder='${el.placeholder}', default_text="${el.text}", 
          text_padding_left=${el.padding_left}, text_padding_right=${
            el.padding_right
          }, text_padding_top=${el.padding_top}, text_padding_bottom=${
            el.padding_bottom
          },
          font="assets/fonts/${el.fontFamily}/${
            el.fontFamily
          }.ttf", font_size=${el.fontSize}, font_color="${el.textColor}",
          border_color='${el.borderColor}', border_thickness=${
            el.borderThickness
          }, 
          border_style= ["${el.border_style[0]}", "${el.border_style[1]}", "${
            el.border_style[2]
          }", "${el.border_style[3]}"], on_input=${
            !el.on_input ? "None" : `"${el.on_input}"`
          }`;

          break;

        case "Text":
          let Bold = el.bold === true ? "True" : "False";
          let Italic = el.italic === true ? "True" : "False";
          let Underline = el.underline === true ? "True" : "False";
          let Strike = el.strikethrough === true ? "True" : "False";
          params += `, text='${el.text}',
                font="assets/fonts/${el.fontFamily}/${el.fontFamily}.ttf", font_color='${el.color}', font_size=${el.fontSize},
                bold=${Bold} , italic=${Italic}, underline=${Underline}, strikethrough=${Strike}`;
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
          params += `, image_path = "${el.imageName}" scale_value = ${el.scale_value}`;

        case "ButtonImage":
          params += `, scale = ${el.scale}, text="${el.text}", 
          idle_image = "assets/Buttons/Button_${index + 1}/idle.png",
          hover_image = "assets/Buttons/Button_${index + 1}/hover.png",
          clicked_image = "assets/Buttons/Button_${index + 1}/clicked.png",
          font="assets/fonts/${el.fontFamily}/${
            el.fontFamily
          }.ttf", font_size=${el.fontSize},font_color="${el.textColor}",
          on_hover=${el.onHover === null ? "None" : el.onHover}, on_click=${
            el.onClick === null || el.name === "" ? "None" : el.onClick
          }, on_release=${
            el.onRelease === null || el.name === "" ? "None" : el.onRelease
          }, 
          name = ${
            el.name === null || el.name === ""
              ? `"Button_${index + 1}"`
              : `"${el.name}"`
          }`;

        default:
          break;
      }

      params += ")";
      pythonCode += ` 
    #Element ${index + 1}\n   ${
        el.type === "BasicButton"
          ? "Button"
          : el.type === "BasicTextInput"
          ? "InputField"
          : el.type === "ButtonImage"
          ? "Button"
          : el.type
      }_${index + 1} = pv.${
        el.type === "InputField"
          ? "BasicTextInput"
          : el.type === "ButtonImage"
          ? "CustomButton"
          : el.type
      }${params}\n`;
    });

    pythonCode += `
    
def main():
  # Create a window for the calculator
  window = pv.Window(width=${!width ? 700 : width},height=${
      !height ? 400 : height
    }, title="PyVisual", background_image=${
      !bgImage ? "None" : `"assets/background/background.jpg"`
    } , background_color="${!color ? "#ffffff" : color}")
  create_ui(window)
  # Display the window
  window.show()

if __name__ == '__main__':
  import pyvisual as pv
  main()`;

    setGeneratedCode(pythonCode); // Update the generated code state
  };

  const handleDownloadProject = async () => {
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets"); // Create folder for assets
    const fontsFolder = assetsFolder.folder("fonts"); // Create folder for fonts
    const backgroundFolder = assetsFolder.folder("background");
    const Buttons = assetsFolder.folder("Buttons");

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

    let index = 0;
    // Loop through elements and handle ButtonImage types
    for (const element of elements) {
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
    <div className="home bg-cover bg-center h-screen overflow-y-auto">
      <Header
        onGenerateCode={handleGenerateCode} // Pass down the generate code handler
        onDownloadProject={handleDownloadProject}
        onWindowSizeChange={(width, height, color) => {
          setHeight(height);
          setWidth(width);
          setColor(color);
        }}
      />
      <div className="flex h-screen">
        {" "}
        {/* Main container for layout */}
        <Sidebar
          onAddElement={handleAddElement} // Pass down the add element handler
          onBgImageChange={(image) => {
            setBgImage(image);
          }}
        />
        <div className="flex-1 relative">
          {" "}
          {/* Flex container for the canvas and code display */}
          {/* Add the ElementEditor component here */}
          {selectedElement && (
            <ElementEditor
              selectedElement={selectedElement}
              elements={elements}
              setElements={setElements}
            />
          )}
          <CanvasArea
            elements={elements} // Pass down the elements to CanvasArea
            onUpdatePosition={handleUpdatePosition} // Pass down the position update handler
            onUpdateSize={handleUpdateSize}
            onScaleElement={handleScaleElement} // Pass down the scale element handler
            setSelectedElement={setSelectedElement} // Pass down the selected element setter
            onAddElement={handleAddElement}
            onRemoveElement={removeElement}
            setPOSITION={setPositions}
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
      {codeDisplay ? (
        <CodeDisplay code={generatedCode} setCodeDisplay={setCodeDisplay} />
      ) : null}
    </div>
  );
};

export default Home; // Export the App component
