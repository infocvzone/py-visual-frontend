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
  const alignmentLines = useRef([]); // Store alignment lines
  const [AlignmentLines, setAlignmentLines] = useState([]);

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
    console.log(Image);

    return () => {
      // Clean up: dispose alignment lines
      alignmentLines.current.forEach((line) => {
        canvas.remove(line);
      });
      canvas.dispose();
    };
  }, [Height, Width, Image]);

  const onSelectedElement = () => {
    selectedIndex(elementData);
    console.log(elementData);
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
          if (fabricElement) {
            console.log(fabricElement);
            canvasObj.add(fabricElement);
            fabricElement.on("moving", () => {
              setSelected(fabricElement);
              setSelectedElement(fabricElement);
              handleElementMovement(fabricElement, element.id);
              setElementData(element);
              onSelectedElement();
              handleElementSizing(fabricElement, element.id); // Update size when selected
            });
            fabricElement.on("scaling", () => onScaleElement(fabricElement));
            fabricElement.on("selected", () => {
              setSelected(fabricElement);
              setSelectedElement(fabricElement);
              handleElementMovement(fabricElement, element.id);
              setElementData(element);
              onSelectedElement();
              handleElementSizing(fabricElement, element.id); // Update size when selected
              drawAlignmentLines();
            });
          }
        } catch (error) {
          console.error("Error creating fabric element:", error);
        }
      });
    }
  }, [elements, canvasObj, elementData]);

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
            element.imageUrl,
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
                hasBorders: true,
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
      console.log(id + " - " + height);
    }
    onUpdateSize({ id, width: width.toFixed(0), height: height.toFixed(0) });
  };

  // Function to update alignment lines
  const updateAlignmentLines = (movingElement) => {
    const objects = canvasObj
      .getObjects()
      .filter((obj) => obj !== movingElement);

    // Clear existing alignment lines
    clearAlignmentLines();

    objects.forEach((obj) => {
      // Check for vertical alignment
      // Left edge of the object with left edge of movingElement
      if (Math.abs(obj.left - movingElement.left) <= 0) {
        const line = new fabric.Line(
          [obj.left, 0, obj.left, canvasObj.height],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

      // Right edge of the object with left edge of movingElement
      if (Math.abs(obj.left + obj.width - movingElement.left) <= 0) {
        const line = new fabric.Line(
          [obj.left + obj.width, 0, obj.left + obj.width, canvasObj.height],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

      // Left edge of the object with right edge of movingElement
      if (
        Math.abs(obj.left - (movingElement.left + movingElement.width)) <= 0
      ) {
        const line = new fabric.Line(
          [obj.left, 0, obj.left, canvasObj.height],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

      // Right edge of the object with right edge of movingElement
      if (
        Math.abs(
          obj.left + obj.width - (movingElement.left + movingElement.width)
        ) <= 0
      ) {
        const line = new fabric.Line(
          [obj.left + obj.width, 0, obj.left + obj.width, canvasObj.height],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

      // Check for horizontal alignment
      // Top edge of the object with top edge of movingElement
      if (Math.abs(obj.top - movingElement.top) <= 0) {
        const line = new fabric.Line([0, obj.top, canvasObj.width, obj.top], {
          stroke: "red",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

      // Bottom edge of the object with top edge of movingElement
      if (Math.abs(obj.top + obj.height - movingElement.top) <= 0) {
        const line = new fabric.Line(
          [0, obj.top + obj.height, canvasObj.width, obj.top + obj.height],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

      // Top edge of the object with bottom edge of movingElement
      if (Math.abs(obj.top - (movingElement.top + movingElement.height)) <= 0) {
        const line = new fabric.Line([0, obj.top, canvasObj.width, obj.top], {
          stroke: "red",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

      // Bottom edge of the object with bottom edge of movingElement
      if (
        Math.abs(
          obj.top + obj.height - (movingElement.top + movingElement.height)
        ) <= 0
      ) {
        const line = new fabric.Line(
          [0, obj.top + obj.height, canvasObj.width, obj.top + obj.height],
          {
            stroke: "red",
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        canvasObj.add(line);
        alignmentLines.current.push(line); // Store the line
      }

    });

    canvasObj.renderAll();
  };

  // Clear alignment lines
  const clearAlignmentLines = () => {
    alignmentLines.current.forEach((line) => {
      canvasObj.remove(line);
    });
    alignmentLines.current = []; // Clear the reference
  };

  // Draw alignment lines (center of the canvas)
  const drawAlignmentLines = () => {
    const verticalLine = new fabric.Line(
      [canvasObj.width / 2, 0, canvasObj.width / 2, canvasObj.height],
      {
        stroke: "rgba(0, 0, 0, 0.5)",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }
    );
    const horizontalLine = new fabric.Line(
      [0, canvasObj.height / 2, canvasObj.width, canvasObj.height / 2],
      {
        stroke: "rgba(0, 0, 0, 0.5)",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }
    );
    setAlignmentLines([verticalLine, horizontalLine]);
    canvasObj.add(verticalLine, horizontalLine);
    canvasObj.renderAll();
  };

  // Remove alignment lines from the canvas
  const removeAlignmentLines = () => {
    AlignmentLines((line) => canvasObj.remove(line));
    setAlignmentLines([]);
    canvasObj.renderAll();
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
