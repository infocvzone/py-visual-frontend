import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CanvasArea from "./CanvasArea";
import CodeDisplay from "./CodeDisplay";
import ElementEditor from "./ElementEditor";
import Header from "./Header";
import JSZip from "jszip";
import FileSaver from "file-saver";

// Home component definition
const Home = () => {
  // State for holding UI elements, their positions, the selected element, and generated code
  const [elements, setElements] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeDisplay, setCodeDisplay] = useState(false);
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();

  // Function to add a new element
  const handleAddElement = (type, element) => {
    // Update the element's id to the current timestamp
    const updatedElement = { ...element, id: Date.now() };

    // Set the updated element and position
    setElements((prev) => [...prev, updatedElement]);
    setPositions((prev) => ({
      ...prev,
      [updatedElement.id]: { x: 100, y: 100 }, // Initialize position for the new element
    }));
  };

  // Function to update the position of an element
  const handleUpdatePosition = (element) => {
    setPositions((prev) => ({
      ...prev,
      [element.id]: { x: element.x, y: element.y }, // Update position for the specific element
    }));
  };

  // Function to scale an element
  const handleScaleElement = (fabricElement) => {
    const updatedElements = elements.map((el) =>
      el.id === fabricElement.id ? { ...el, scale: fabricElement.scaleX } : el
    );
    setElements(updatedElements);
  };

  // Function to generate Python code based on current elements
  const handleGenerateCode = () => {
    setCodeDisplay(!codeDisplay);

    let pythonCode = `
def create_ui(window):
`; // Initial code string

    elements.forEach((el, index) => {
      const pos = positions[el.id] || { x: 50, y: 50 }; // Get position or default
      let params = `(window=window, x=${pos.x}, y=${pos.y}`;

      // Handle parameters for each element type
      switch (el.type) {
        case "BasicButton":
          params += `, width=${el.width}, height=${el.height}, text='${el.text}',
          font = '${el.fontFamily}', font_size=${el.fontSize}, font_color = '${el.textColor}',
          idle_color = '${el.idleColor}', hover_color = '${el.hoverColor}',  
          border_color='${el.borderColor}', border_thickness=${el.borderThickness},
          on_hover=${el.type}${index}_on_hover, on_click=${el.type}${index}_on_click, on_release=${el.type}${index}_on_release, name = "${el.type}${index}_name"
          `;
          break;

        case "InputField":
          params += `, ${el.width}, ${el.height}, placeholder='${el.placeholder}', 
                     bg_color='${el.bgColor}', border_color='${el.borderColor}', 
                     border_thickness=${el.borderThickness}, text_color='${el.textColor}', 
                     placeholder_color='${el.placeholderColor}', font_size=${el.fontSize}, 
                     cursor_blink_speed=${el.cursorBlinkSpeed}, padding=${el.padding}`;
          break;

        case "Text":
          let Bold = (el.bold === true) ? 'True' : 'False'
          let Italic = (el.italic === true) ? 'True' : 'False'
          let Underline = (el.underline === true) ? 'True' : 'False'
          let Strike = (el.strikethrough === true) ? 'True' : 'False'
          params += `, text='${el.text}',
          font="Roboto", font_color='${el.color}', font_size=${el.fontSize},
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
                     layout='${el.layout}', gap=${el.gap}, scale=${el.scale}, 
                     border_color='${el.borderColor}', border_thickness=${
            el.borderThickness
          }, 
                     colors={'selectedColor': '${
                       el.colors.selectedColor
                     }', 'unselectedColor': '${el.colors.unselectedColor}'}, 
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
                     placeholder='${el.placeholder}', font_size=${el.fontSize}, 
                     text_color='${el.textColor}', bg_color='${el.bgColor}', 
                     border_color='${el.borderColor}', border_thickness=${
            el.borderThickness
          }, 
                     dropdown_bg_color='${el.dropdownBgColor}', hover_color='${
            el.hoverColor
          }', padding=${el.padding}`;
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
          params += `, idle_image = "./assets/${el.id}-idle.png",
                     hover_image = "./assets/${el.id}-hover.png",
                       clicked_image = "./assets/${el.id}-clicked.png",
                        scale = ${el.scale}`;

        default:
          break;
      }

      params += ")";
      pythonCode += ` #Element ${index + 1}
  ${el.type}${index + 1} = pv.${
        el.type
      }${params}\n`;
      //pythonCode += 'ui_elements.append(' + el.type + ')\n';
    });

    pythonCode += `
    
    
def main():
  # Create a window for the calculator
  window = pv.Window(width=${!width ? 700 : width},height=${!height ? 400 : height}, title="PyVisual")
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
    const folder = zip.folder("assets"); // Create folder for assets

    // Generate the main.py file
    zip.file("main.py", generatedCode);

    // Loop through elements and handle ButtonImage types
    for (const element of elements) {
      if (element.type === "ButtonImage") {
        // Convert the Base64 images into blobs and save them in the assets folder
        if (element.idleImage) {
          const idleImageBlob = base64ToBlob(element.idleImage);
          folder.file(`${element.id}-idle.png`, idleImageBlob);
        }
        if (element.hoverImage) {
          const hoverImageBlob = base64ToBlob(element.hoverImage);
          folder.file(`${element.id}-hover.png`, hoverImageBlob);
        }
        if (element.clickedImage) {
          const clickImageBlob = base64ToBlob(element.clickedImage);
          folder.file(`${element.id}-clicked.png`, clickImageBlob);
        }
      }
    }

    // Generate the zip file and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, "project.zip"); // Save the zip file as project.zip
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
        onWindowSizeChange={(width, height) => {
          setHeight(height);
          setWidth(width);
        }}
      />
      <div className="flex h-screen">
        {" "}
        {/* Main container for layout */}
        <Sidebar
          onAddElement={handleAddElement} // Pass down the add element handler
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
            onScaleElement={handleScaleElement} // Pass down the scale element handler
            setSelectedElement={setSelectedElement} // Pass down the selected element setter
            positions={positions}
            Height={height}
            Width={width}
            selectedIndex={(elementData) => {
              setSelectedElement(elementData);
            }}
          />
        </div>
      </div>
      {codeDisplay ? <CodeDisplay code={generatedCode} /> : null}
    </div>
  );
};

export default Home; // Export the App component
