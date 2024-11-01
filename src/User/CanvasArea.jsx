import React, { useEffect, useRef, useState } from "react";
//import * as fabric from 'fabric';
import FabricButton from "../classes/button";
import FabricText from "../classes/text";
import ButtonImage from "../classes/imageButton";
import FabricInputField from "../classes/inputField";

const CanvasArea = ({
  elements,
  onUpdatePosition,
  onUpdateSize,
  onScaleElement,
  setSelectedElement,
  onAddElement,
  onRemoveElement,
  setPOSITION,
  positions,
  Height,
  Width,
  selectedIndex,
  Image,
  bgColor,
}) => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [selected, setSelected] = useState(null);
  const [elementData, setElementData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 }); // State for height and width
  const [copiedElement, setCopiedElement] = useState(null);
  const alignmentLines = useRef([]); // Store alignment lines

  // Initialize Fabric canvas
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const canvas = new fabric.Canvas(canvasEl, {
      width: Width || 700,
      height: Height || 400,
      backgroundColor: "#f3f3f3",
      selection: false,
    });
    setCanvasObj(canvas);

    return () => {
      // Clean up: dispose alignment lines
      alignmentLines.current.forEach((line) => {
        canvas.remove(line);
      });
      canvas.dispose();
    };
  }, [Height, Width]);

  const onSelectedElement = () => {
    selectedIndex(elementData);
  };

  const handleScaling = (id, fabricElement) => {
    requestAnimationFrame(() => {
      const rect = fabricElement.getBoundingRect();
      onScaleElement(id, rect.width, rect.height);
    });
  };

  // Update canvas with new elements
  useEffect(() => {
    if (canvasObj) {
      canvasObj.clear();
      const keys = Object.keys(positions);
      console.log(elements);
      elements.forEach(async (element) => {
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].toString() === element.id.toString()) {
            const key = keys[i];
            let obj = positions[key];
            element.x = Number(obj.x);
            element.y = Number(obj.y);
            break;
          }
        }
        try {
          const fabricElement = await createFabricElement(element);
          console.log(fabricElement);
          if (fabricElement) {
            canvasObj.add(fabricElement);
            fabricElement.on("moving", () => {
              handleElementMovement(fabricElement, element.id);
              requestAnimationFrame(() => updateAlignmentLines(fabricElement));
            });

            fabricElement.on("selected", () => {
              setSelected(fabricElement);
              setSelectedElement(fabricElement);
              handleElementMovement(fabricElement, element.id);
              setElementData(element);
              onSelectedElement();
              handleElementSizing(fabricElement, element.id); // Update size when selected
            });
            fabricElement.on("mouseup", () => {
              clearAlignmentLines();
            });
          }
        } catch (error) {
          console.error("Error creating fabric element:", error);
        }
      });
    }
  }, [elements, canvasObj, elementData]);

  // Listen for Ctrl + C and Ctrl + V (or Cmd + C and Cmd + V on Mac)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCopy = (e.ctrlKey || e.metaKey) && e.key === "c"; // Check for both Ctrl and Cmd
      const isPaste = (e.ctrlKey || e.metaKey) && e.key === "v";
      const isDelete = (e.ctrlKey || e.metaKey) && e.key === "d";
      if (isCopy && elementData) {
        // Ctrl + C or Cmd + C (Copy)
        const copiedData = elements.find((el) => el.id === elementData.id);
        if (copiedData) {
          setCopiedElement(copiedData); // Store the copied element
          console.log("Element copied:", copiedData);
        }
      }

      if (isPaste && copiedElement) {
        // Ctrl + V or Cmd + V (Paste)
        const newElement = {
          ...copiedElement,
          id: Date.now(), // Create a new unique ID for the copied element
          x: elementData.x + 10, // Offset position slightly
          y: elementData.y + 10, // Offset position slightly
        };

        onAddElement(newElement.type, newElement); // Send new element to parent to append in elements array
        console.log("Element pasted:", newElement);
      }

      if (isDelete && elementData) {
        // Ctrl + D or Cmd + D (Delete)
        onRemoveElement(elementData.id); // Send selected element's ID to remove
        console.log("Element deleted:", elementData.id);
      }
      // Arrow key handling to move elements
      if (elementData && e.shiftKey) {
        let updatedPosition = positions[elementData.id];
        // Ensure x and y are numbers before performing operations
        let x = parseInt(updatedPosition.x, 10); // Convert x to a number (integer)
        let y = parseInt(updatedPosition.y, 10); // Convert y to a number (integer)

        switch (e.key) {
          case "ArrowUp":
            y -= 1; // Move element up by 10 units
            break;
          case "ArrowDown":
            y += 1; // Move element down by 10 units
            break;
          case "ArrowLeft":
            x -= 1; // Move element left by 10 units
            break;
          case "ArrowRight":
            x += 1; // Move element right by 10 units
            break;
          default:
            return;
        }

        // Update the position in the parent component via setPositions
        setPOSITION({
          ...positions,
          [elementData.id]: { ...updatedPosition, x, y }, // Update position in parent
        });
        console.log("Element moved:", positions);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [copiedElement, elements, onAddElement, onRemoveElement, positions]);

  // Create Fabric element based on type
  const createFabricElement = (element) => {
    if (!canvasObj) return null;

    switch (element.type) {
      case "BasicButton":
        return new FabricButton(
          canvasObj,
          element.x,
          element.y,
          element.width,
          element.height,
          element.text,
          element.fontFamily,
          element.fontSize,
          element.textColor,
          element.idleColor,
          element.hoverColor,
          element.clickedColor,
          element.borderColor,
          element.borderThickness,
          element.onClick,
          element.onHover,
          element.onRelease
        ).buttonGroup;

      case "InputField":
        return new FabricInputField(
          canvasObj,
          element.x,
          element.y,
          element.width,
          element.height,
          element.placeholder,
          element.bgColor,
          element.borderColor,
          element.borderThickness,
          element.textColor,
          element.dropdownBgColor,
          element.fontSize,
          element.cursorBlinkSpeed,
          element.padding,
          element.fontFamily
        ).inputGroup;

      case "Text":
        return new FabricText(
          element.x,
          element.y,
          element.text,
          element.scale,
          element.fontPath || null,
          element.color,
          element.fontFamily || "sans-serif",
          element.fontSize,
          element.bold,
          element.italic,
          element.underline,
          element.strikethrough
        );

      case "Toggle":
        return new FabricToggle(
          canvasObj,
          element.x || 50,
          element.y || 50,
          element.width || 50,
          element.height || 25,
          element.initialState || false,
          element.borderColor || "#e1e1e1",
          element.borderThickness || 1,
          element.colors || null,
          element.scale || 1
        ).toggleGroup;

      case "Slider":
        const slider = new FabricSlider(
          canvasObj,
          element.x,
          element.y,
          element.width,
          element.height,
          element.minValue,
          element.maxValue,
          element.initialValue,
          element.colors,
          element.knobSize,
          element.scale,
          element.fontSize,
          element.textColor,
          element.textOffset,
          element.fontPath,
          element.showText !== undefined ? element.showText : true
        );
        return slider.getElement();

      case "Checkbox":
        return new FabricCheckbox(
          canvasObj,
          element.x,
          element.y,
          element.width,
          element.height,
          element.checked,
          element.scale,
          element.colors,
          element.borderColor,
          element.borderThickness,
          element.tickImagePath
        ).checkboxGroup;

      case "RadioButton":
        const radio = new FabricRadioButton(
          canvasObj,
          element.x,
          element.y,
          element.numButtons,
          element.size,
          element.selectedIndex,
          element.layout,
          element.gap,
          element.scale,
          element.colors,
          element.borderColor,
          element.borderThickness,
          element.innerBoxScale,
          element.labels,
          element.fontSize,
          element.textColor,
          element.textOffset
        );
        return radio.getElement();

      case "ProgressBar":
        return new FabricProgressBar(
          canvasObj,
          element.x,
          element.y,
          element.width,
          element.height,
          element.minValue,
          element.maxValue,
          element.initialValue,
          element.colors,
          element.scale,
          element.fontSize,
          element.textColor,
          element.textOffset,
          element.fontPath,
          element.showText !== undefined ? element.showText : true,
          element.textPosition || "middle"
        ).group;

      case "DropdownMenu":
        return new FabricDropdownMenu(
          canvasObj,
          element.x,
          element.y,
          element.options,
          element.width,
          element.height,
          element.placeholder,
          element.fontSize,
          element.textColor,
          element.bgColor,
          element.borderColor,
          element.borderThickness,
          element.dropdownBgColor,
          element.hoverColor,
          element.padding
        ).getFabricElement();

      case "Image":
        return new Promise((resolve, reject) => {
          fabric.Image.fromURL(
            element.url,
            (img) => {
              if (!img) {
                return reject(new Error("Failed to load image"));
              }
              img.set({
                left: element.x,
                top: element.y,
                scaleX: element.scale_value || 1,
                scaleY: element.scale_value || 1,
                originX: "center",
                originY: "center",
                selectable: true,
                hasControls: true,
                
              });
              canvasObj.add(img);
              canvasObj.renderAll();
              resolve(img);
            },
            { crossOrigin: "anonymous" }
          );
        });

      case "ButtonImage":
        return new ButtonImage(
          canvasObj,
          element.x,
          element.y,
          element.idleImage,
          element.hoverImage,
          element.clickedImage,
          element.scale,
          element.text, // Default text
          element.textColor || "#000000", // Default text color
          element.fontFamily || "Arial", // Default font
          element.fontSize || 16 // Default font size
        ).getFabricElementAsync();

      case "Line":
        return new fabric.Line(
          [element.x1, element.y1, element.x2, element.y2],
          {
            stroke: element.Color, // Stroke color
            strokeWidth: element.strokeWidth, // Line width
          }
        );
      case "Circle":
        return new fabric.Circle({
          left: element.x, // X coordinate
          top: element.y, // Y coordinate
          radius: element.radius, // Radius of the circle
          fill: element.Color, // Fill color
        });
      case "Rect":
        return new fabric.Rect({
          left: element.x, // X coordinate
          top: element.y, // Y coordinate
          fill: element.Color, // Fill color
          width: element.width, // Width of the rectangle
          height: element.height, // Height of the rectangle
        });

      default:
        return null;
    }
  };

  // Handle element movement and update position
  const handleElementMovement = (element, id) => {
    const xPos = element.left.toFixed(0);
    const yPos = element.top.toFixed(0);
    setPosition({ x: xPos, y: yPos });
    onUpdatePosition({ id, x: xPos, y: yPos });
  };

  // Handle element sizing and update width/height
  const handleElementSizing = (element, id) => {
    const width = element.width * element.scaleX; // scaled width
    const height = element.height * element.scaleY; // scaled height
    // Only update size if it has changed
    if (size.width !== width.toFixed(0) || size.height !== height.toFixed(0)) {
      setSize({ width: width.toFixed(0), height: height.toFixed(0) });
      //console.log(id + " - " + height);
    }
    onUpdateSize({ id, width: width.toFixed(0), height: height.toFixed(0) });
  };

  const updateAlignmentLines = (movingElement) => {
    const objects = canvasObj
      .getObjects()
      .filter((obj) => obj !== movingElement);
    clearAlignmentLines();

    const movingLeft = movingElement.left;
    const movingTop = movingElement.top;
    const movingRight = movingLeft + movingElement.width;
    const movingBottom = movingTop + movingElement.height;

    const alignmentThreshold = 2;

    const addLine = (line) => {
      canvasObj.add(line);
      alignmentLines.current.push(line);
    };

    objects.forEach((obj) => {
      const objLeft = obj.left;
      const objTop = obj.top;
      const objRight = objLeft + obj.width;
      const objBottom = objTop + obj.height;

      // Check vertical alignment
      if (Math.abs(objLeft - movingLeft) <= alignmentThreshold) {
        movingElement.left = objLeft; // Snap to align left
        addLine(
          new fabric.Line([objLeft, 0, objLeft, canvasObj.height], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
      if (Math.abs(objRight - movingLeft) <= alignmentThreshold) {
        movingElement.left = objRight; // Snap to align right
        addLine(
          new fabric.Line([objRight, 0, objRight, canvasObj.height], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
      if (Math.abs(objLeft - movingRight) <= alignmentThreshold) {
        movingElement.left = objLeft - movingElement.width; // Snap moving element right to obj left
        addLine(
          new fabric.Line([objLeft, 0, objLeft, canvasObj.height], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
      if (Math.abs(objRight - movingRight) <= alignmentThreshold) {
        movingElement.left = objRight - movingElement.width; // Snap to align right
        addLine(
          new fabric.Line([objRight, 0, objRight, canvasObj.height], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }

      // Check horizontal alignment
      if (Math.abs(objTop - movingTop) <= alignmentThreshold) {
        movingElement.top = objTop; // Snap to align top
        addLine(
          new fabric.Line([0, objTop, canvasObj.width, objTop], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
      if (Math.abs(objBottom - movingTop) <= alignmentThreshold) {
        movingElement.top = objBottom; // Snap to align bottom
        addLine(
          new fabric.Line([0, objBottom, canvasObj.width, objBottom], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
      if (Math.abs(objTop - movingBottom) <= alignmentThreshold) {
        movingElement.top = objTop - movingElement.height; // Snap moving element bottom to obj top
        addLine(
          new fabric.Line([0, objTop, canvasObj.width, objTop], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
      if (Math.abs(objBottom - movingBottom) <= alignmentThreshold) {
        movingElement.top = objBottom - movingElement.height; // Snap to align bottom
        addLine(
          new fabric.Line([0, objBottom, canvasObj.width, objBottom], {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
    });

    // Render the changes on the canvas
    canvasObj.renderAll();
  };

  const clearAlignmentLines = () => {
    alignmentLines.current.forEach((line) => canvasObj.remove(line));
    alignmentLines.current = [];
  };

  return (
    <div className="flex items-center justify-center p-4 relative">
      <div
        style={{
          backgroundImage: Image ? `url('${Image}')` : "none",
          backgroundColor: Image ? "transparent" : bgColor || "#ffffff", // Set BgColor or a fallback color
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: `${Width || 700}px`,
          height: `${Height || 400}px`,
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)", // Equivalent to shadow-xl
        }}
      >
        <canvas ref={canvasRef} id="canvas" className="shadow-xl" />
      </div>

      {selected && (
        <div className="absolute top-2 left-2 p-2 bg-blue-100 border border-blue-300 rounded">
          <p>X: {position.x}</p>
          <p>Y: {position.y}</p>
          <p>width: {size.width}</p>
          <p>height: {size.height}</p>
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
