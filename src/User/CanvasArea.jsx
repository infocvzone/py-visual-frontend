import React, { useEffect, useRef, useState } from "react";
//import * as fabric from 'fabric';
import FabricButton from "../classes/button";
import FabricText from "../classes/text";
import ButtonImage from "../classes/imageButton";
import FabricInputField from "../classes/inputField";
import svg from "../assets/categories/image-pen.svg";

const CanvasArea = ({
  elements,
  onUpdatePosition,
  onUpdateSize,
  onScaleElement,
  setSelectedElement,
  onAddElement,
  onRemoveElement,
  setPOSITION,
  setELEMENTS,
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
  const [isTracking, setTracking] = useState(false);
  const undoStack = useRef([]);
  const [temp, setTemp] = useState(null);
  const tempRef = useRef(null); // Add a ref for temp
  let isScaling = useRef(false);

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

    canvas.on("mouse:up", updateSize);

    // Clean up event listeners and alignment lines
    return () => {
      alignmentLines.current.forEach((line) => {
        canvas.remove(line);
      });
      canvas.dispose();
    };
  }, [Height, Width]);

  const onSelectedElement = () => {
    selectedIndex(elementData);
  };

  const updateSize = () => {
    if (isScaling.current === true) {
      if (tempRef.current !== null) {
        console.log(tempRef.current); // Access the latest value from the ref
        if (!tempRef.current.type) {
          onScaleElement(
            tempRef.current.id,
            tempRef.current.width,
            tempRef.current.height
          );
        } else if (tempRef.current.type === "Text") {
          let fontSize = Math.round(
            (tempRef.current.currentHeight / tempRef.current.firstHeight) *
              tempRef.current.fontSize
          );
          onScaleElement(
            tempRef.current.id,
            tempRef.current.currentWidth,
            tempRef.current.currentHeight,
            fontSize
          );
        } else if (tempRef.current.type === "ButtonImage") {
          let scale_value =
            (tempRef.current.currentHeight / tempRef.current.firstHeight) *
            tempRef.current.scale_value;
          onScaleElement(
            tempRef.current.id,
            tempRef.current.currentWidth,
            tempRef.current.currentHeight,
            scale_value
          );
        } else {
          let scale_value =
            (tempRef.current.currentHeight / tempRef.current.firstHeight) *
            tempRef.current.scale_value;
          onScaleElement(
            tempRef.current.id,
            tempRef.current.currentWidth,
            tempRef.current.currentHeight,
            scale_value
          );
        }

        tempRef.current = null;
        isScaling.current = false;
      }
    } else {
      console.log("not scaling");
    }
  };

  // Update canvas with new elements
  useEffect(
    () => {
      if (canvasObj) {
        debounce(
          requestAnimationFrame(() => undoStack.current.push([...elements])),
          500
        );
        canvasObj.clear();
        const keys = Object.keys(positions);
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
            console.log(element);
            if (fabricElement) {
              canvasObj.add(fabricElement);
              setTracking(false);
              handleElementSizing(fabricElement, element.id); // Update size when selected
              fabricElement.on("moving", () => {
                handleElementMovement(fabricElement, element.id);
                debounce(
                  requestAnimationFrame(() =>
                    updateAlignmentLines(fabricElement)
                  ),
                  300
                );
              });

              fabricElement.on("selected", () => {
                setSelected(fabricElement);
                setSelectedElement(fabricElement);
                // handleElementMovement(fabricElement, element.id);
                setElementData(element);
                onSelectedElement();
                //handleElementSizing(fabricElement, element.id); // Update size when selected
              });

              fabricElement.on("scaling", () => {
                isScaling.current = true;
                if (element.type === "Image" || element.type === "Svg") {
                  isScaling.current = true;
                  const rect = fabricElement.getBoundingRect();
                  if (
                    !tempRef.current ||
                    !tempRef.current.firstWidth ||
                    !tempRef.current.firstHeight
                  ) {
                    tempRef.current = {
                      id: element.id,
                      firstWidth: rect.width,
                      firstHeight: rect.height,
                      type: element.type,
                      scale_value: element.scale_value,
                    };
                  }
                  // Update the current width and height during scaling
                  tempRef.current = {
                    ...tempRef.current, // Keep the initial values
                    currentWidth: rect.width,
                    currentHeight: rect.height,
                  };
                } else if (element.type === "ButtonImage") {
                  isScaling.current = true;
                  const rect = fabricElement.getBoundingRect();
                  if (
                    !tempRef.current ||
                    !tempRef.current.firstWidth ||
                    !tempRef.current.firstHeight
                  ) {
                    tempRef.current = {
                      id: element.id,
                      firstWidth: rect.width,
                      firstHeight: rect.height,
                      type: element.type,
                      scale_value: element.scale,
                    };
                  }
                  // Update the current width and height during scaling
                  tempRef.current = {
                    ...tempRef.current, // Keep the initial values
                    currentWidth: rect.width,
                    currentHeight: rect.height,
                  };
                } else if (element.type === "Text") {
                  isScaling.current = true;
                  const rect = fabricElement.getBoundingRect();
                  if (
                    !tempRef.current ||
                    !tempRef.current.firstWidth ||
                    !tempRef.current.firstHeight
                  ) {
                    tempRef.current = {
                      id: element.id,
                      firstWidth: rect.width,
                      firstHeight: rect.height,
                      type: element.type,
                      fontSize: element.fontSize,
                    };
                  }
                  // Update the current width and height during scaling
                  tempRef.current = {
                    ...tempRef.current, // Keep the initial values
                    currentWidth: rect.width,
                    currentHeight: rect.height,
                  };
                } else {
                  const rect = fabricElement.getBoundingRect();
                  let data = {
                    id: element.id,
                    width: rect.width,
                    height: rect.height,
                  };
                  setTemp(data);
                  tempRef.current = data;
                }
                console.log("temp (inside scaling):", tempRef.current);
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
    },
    isTracking
      ? [elements, canvasObj, elementData, positions]
      : [elements, canvasObj, elementData]
  );

  // Listen for Ctrl + C and Ctrl + V (or Cmd + C and Cmd + V on Mac)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCopy = (e.ctrlKey || e.metaKey) && e.key === "c"; // Check for both Ctrl and Cmd
      const isPaste = (e.ctrlKey || e.metaKey) && e.key === "v";
      const isDelete = (e.ctrlKey || e.metaKey) && e.key === "Backspace";
      const isUndo = (e.ctrlKey || e.metaKey) && e.key === "z";
      if (isCopy && elementData) {
        // Ctrl + C or Cmd + C (Copy)
        const copiedData = elements.find((el) => el.id === elementData.id);
        if (copiedData) {
          setCopiedElement(copiedData); // Store the copied element
          console.log("Element copied:", copiedData);
        }
      }

      if (isUndo) {
        if (undoStack.current.length > 1) {
          // Pop the last state and update the elements
          undoStack.current.pop();
          const previousState = undoStack.current[undoStack.current.length - 1];
          console.log(previousState);
          setELEMENTS(previousState);
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
            setTracking(true);
            y -= 1; // Move element up by 10 units
            break;
          case "ArrowDown":
            setTracking(true);
            y += 1; // Move element down by 10 units
            break;
          case "ArrowLeft":
            setTracking(true);
            x -= 1; // Move element left by 10 units
            break;
          case "ArrowRight":
            setTracking(true);
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
  }, [copiedElement, elements, onAddElement, onRemoveElement]);

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
            element.webformatURL,
            (img) => {
              if (!img) {
                return reject(new Error("Failed to load image"));
              }

              img.set({
                left: element.x,
                top: element.y,
                scaleX: element.scale_value || 1,
                scaleY: element.scale_value || 1,
                selectable: true,
                hasControls: true,
              });

              // Disable vertical and horizontal scaling controls
              img.setControlsVisibility({
                mt: false, // middle-top
                mb: false, // middle-bottom
                ml: false, // middle-left
                mr: false, // middle-right
              });

              // Allow corner scaling only
              img.lockUniScaling = true; // Ensure proportional scaling

              canvasObj.add(img);
              canvasObj.renderAll();
              resolve(img);
            },
            { crossOrigin: "anonymous" }
          );
        });

      case "Svg":
        return new Promise((resolve, reject) => {
          if (!element.webformatURL) {
            return reject(new Error("SVG source string is missing"));
          }
          // Ensure the SVG string is properly formatted and sanitized
          const parser = new DOMParser();
          const svgDocument = parser.parseFromString(
            element.webformatURL,
            "image/svg+xml"
          );
          //console.log(svgDocument.documentElement);
          const sanitizedSVG = new XMLSerializer().serializeToString(
            svgDocument.documentElement
          );
          //console.log("Sanitized SVG:", sanitizedSVG);
          try {
            fabric.loadSVGFromString(`${sanitizedSVG}`, (objects, options) => {
              try {
                const svgGroup = fabric.util.groupSVGElements(objects, options);
                // Set position, scale, and other properties
                svgGroup.set({
                  left: element.x,
                  top: element.y,
                  scaleX: element.scale_value,
                  scaleY: element.scale_value,
                  selectable: true,
                  hasControls: true,
                });

                svgGroup.setControlsVisibility({
                  mt: false, // middle-top
                  mb: false, // middle-bottom
                  ml: false, // middle-left
                  mr: false, // middle-right
                });

                svgGroup.lockUniScaling = true;

                // Add the SVG group to the canvas
                canvasObj.add(svgGroup);
                canvasObj.renderAll();
                resolve(svgGroup);
              } catch (innerError) {
                reject(new Error("Error grouping SVG elements: " + innerError));
              }
            });
          } catch (error) {
            reject(new Error("SVG parsing error: " + error));
          }
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
    const movingCenterX = movingLeft + movingElement.width / 2;
    const movingCenterY = movingTop + movingElement.height / 2;

    const alignmentThreshold = 0.5;

    const addLine = (line) => {
      canvasObj.add(line);
      alignmentLines.current.push(line);
    };

    // Draw vertical and horizontal dotted center lines on the canvas
    const canvasCenterX = canvasObj.width / 2;
    const canvasCenterY = canvasObj.height / 2;

    const centerVerticalLine = new fabric.Line(
      [canvasCenterX, 0, canvasCenterX, canvasObj.height],
      {
        stroke: "green",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5], // Dotted line pattern
      }
    );

    const centerHorizontalLine = new fabric.Line(
      [0, canvasCenterY, canvasObj.width, canvasCenterY],
      {
        stroke: "green",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5], // Dotted line pattern
      }
    );

    addLine(centerVerticalLine);
    addLine(centerHorizontalLine);

    // Aligning logic for other objects
    objects.forEach((obj) => {
      const objLeft = obj.left;
      const objTop = obj.top;
      const objRight = objLeft + obj.width;
      const objBottom = objTop + obj.height;
      const objCenterX = objLeft + obj.width / 2;
      const objCenterY = objTop + obj.height / 2;

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

      // Center alignment check
      if (Math.abs(objCenterX - movingCenterX) <= alignmentThreshold) {
        addLine(
          new fabric.Line([objCenterX, 0, objCenterX, canvasObj.height], {
            stroke: "blue",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
        addLine(
          new fabric.Line([movingCenterX, 0, movingCenterX, canvasObj.height], {
            stroke: "blue",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
      }
      if (Math.abs(objCenterY - movingCenterY) <= alignmentThreshold) {
        addLine(
          new fabric.Line([0, objCenterY, canvasObj.width, objCenterY], {
            stroke: "blue",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          })
        );
        addLine(
          new fabric.Line([0, movingCenterY, canvasObj.width, movingCenterY], {
            stroke: "blue",
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

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  return (
    <div
      className={`flex ${
        !selected ? "top-20" : "top-10"
      } justify-center h-full relative`}
    >
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
          {/*<p>width: {size.width}</p>
          <p>height: {size.height}</p>*/}
        </div>
      )}
    </div>
  );
};

export default CanvasArea;
