import React, { useEffect, useRef, useState } from "react";
//import * as fabric from 'fabric';
import pyVisualIcon from "../assets/PyVisual-icon.png";
import FabricButton from "../classes/button";
import FabricText from "../classes/text";
import ButtonImage from "../classes/imageButton";
import FabricInputField from "../classes/inputField";
import ButtonSvg from "../classes/buttonSvg";
import svg from "../assets/categories/image-pen.svg";
import GroupLayout from "../classes/groupLayout";

const CanvasArea = ({
  elements,
  onUpdatePosition,
  onUpdateSize,
  onScaleElement,
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
          if (tempRef.current.currentHeight !== tempRef.current.firstHeight) {
            let fontSize = Math.round(
              (tempRef.current.currentHeight / tempRef.current.firstHeight) *
                tempRef.current.fontSize
            );
            onScaleElement(
              tempRef.current.id,
              tempRef.current.firstWidth,
              tempRef.current.currentHeight,
              fontSize
            );
          } else {
            onScaleElement(
              tempRef.current.id,
              tempRef.current.currentWidth,
              tempRef.current.currentHeight,
              tempRef.current.fontSize
            );
          }
        } else if (tempRef.current.type === "ButtonImage") {
          let scale_value =
            (tempRef.current.currentHeight / tempRef.current.firstHeight) *
            tempRef.current.scale_value;
          onScaleElement(
            tempRef.current.id,
            tempRef.current.currentWidth,
            tempRef.current.currentHeight,
            scale_value > 1 ? 1 : scale_value
          );
        } else if (tempRef.current.type === "Circle") {
          onScaleElement(tempRef.current.id, 100, 100, tempRef.current.radius);
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

        // Sort elements by their zIndex property (default to 1 if not defined)
        const sortedElements = [...elements].sort(
          (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
        );

        console.log(sortedElements);

        sortedElements.forEach(async (element) => {
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
            // console.log(element);
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
                // handleElementMovement(fabricElement, element.id);
                setElementData(element);
                selectedIndex(element);
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
                } else if (element.type === "Circle") {
                  isScaling.current = true;
                  const rect = fabricElement.getBoundingRect();
                  console.log(rect);

                  let data = {
                    id: element.id,
                    type: element.type,
                    radius: rect.width / 2,
                  };

                  setTemp(data);
                  tempRef.current = data;
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
          element.borderColor,
          element.borderThickness,
          element.opacity,
          element.borderRadius,
          element.onClick,
          element.onHover,
          element.onRelease,
          element.bold,
          element.italic,
          element.underline,
          element.strikethrough
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
          canvasObj,
          element.x,
          element.y,
          element.text,
          element.fontFamily || "Roboto",
          element.fontSize,
          element.color,
          element.bold,
          element.italic,
          element.underline,
          element.strikethrough,
          element.bgColor,
          element.boxWidth,
          element.textAlignment,
          element.isVisible || true,
          element.opacity
        ).group;

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
                opacity: element.opacity,
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
          element.fontSize || 16, // Default font size
          !element.fromImage ? false : element.fromImage
        ).getFabricElementAsync();

      case "ButtonSvg":
        return new ButtonSvg(
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

      case "Circle":
        return new Promise((resolve, reject) => {
          const circle = new fabric.Circle({
            radius: element.radius, // Circle radius
            left: element.x, // X position
            top: element.y, // Y position
            fill: element.Color, // Fill color
            stroke: element.borderColor, // Border color (default to black)
            strokeWidth: element.borderWidth, // Border width (default to 1)
            selectable: true, // Allow selecting the circle
            hasControls: true, // Allow controls to resize
            opacity: element.opacity,
          });

          // Disable vertical and horizontal scaling controls
          circle.setControlsVisibility({
            mt: false, // middle-top
            mb: false, // middle-bottom
            ml: false, // middle-left
            mr: false, // middle-right
          });

          canvasObj.add(circle);
          canvasObj.renderAll();
          resolve(circle);
        });

      case "Rect":
        return new Promise((resolve, reject) => {
          const rect = new fabric.Rect({
            width: element.width, // Rectangle width
            height: element.height, // Rectangle height
            left: element.x, // X position
            top: element.y, // Y position
            fill: element.Color, // Color
            stroke: element.borderColor, // Border color
            strokeWidth: element.borderWidth, // Border width
            selectable: true, // Allow selecting the rectangle
            hasControls: true, // Allow controls to resize
            rx: element.radius || 0, // Rounded corners in X direction
            ry: element.radius || 0, // Rounded corners in Y direction
            opacity: element.opacity, // Opacity (default is 1, fully opaque)
          });

          canvasObj.add(rect);
          canvasObj.renderAll();
          resolve(rect);
        });
      case "GroupLayout":
        return new GroupLayout(
          canvasObj,
          50,
          50,
          "horizontal",
          20,
          [20, 20, 20, 20],
          "rgba(200,200,200,0.5)",
          "black",
          2,
          10,
          [
            {
              variableName: "Button",
              opacity: 1,
              borderRadius: 0,
              bold: false,
              italic: false,
              underline: false,
              strikethrough: false,
              _id: "6710ab5af770facc291ab934",
              id: 1735713131534,
              type: "BasicButton",
              x: 468,
              y: 137,
              width: 63,
              height: 63,
              text: "0",
              fontFamily: "Time New Roman",
              fontSize: 18,
              textColor: "#4a4a4a",
              idleColor: "#e0e0e0",
              hoverColor: "#b7b8b8",
              clickedColor: "#6b6b6b",
              borderColor: "#000000",
              borderThickness: 0,
              onClick: null,
              onRelease: null,
              onHover: null,
              name: null,
              createdAt: "2024-10-17T06:14:50.354Z",
              updatedAt: "2024-10-17T06:14:50.354Z",
              __v: 0,
              visibility: true,
              diabled: false,
              disabled_opacity: 0.3,
              lock: false,
              zIndex: 1,
            },
            {
              id: 1735713151188,
              pageURL:
                "https://pixabay.com/photos/photo-waterfall-forest-rocks-moss-8434386/",
              type: "Image",
              tags: "photo, waterfall, forest",
              previewURL:
                "https://cdn.pixabay.com/photo/2023/12/06/21/07/photo-8434386_150.jpg",
              previewWidth: 150,
              previewHeight: 99,
              webformatURL:
                "https://pixabay.com/get/g803fcf4239c6da75324c0c3f5bd2c99cac2ecdfc796967e133a918c59fb6207404b42b68c6a44df648c96c5defc9e89b02b943fcea38cb25420fff26a0fdb032_640.jpg",
              webformatWidth: 640,
              webformatHeight: 423,
              largeImageURL:
                "https://pixabay.com/get/g7a997ce7fac9a20d9882645f7cf2d5f46c23fb1b9882ef3184c8048d8ac51c93dbb36bbc7b3ed541eccd58275e194e3141094914293a15ad0274b857da2970ac_1280.jpg",
              imageWidth: 3937,
              imageHeight: 2604,
              imageSize: 3885295,
              views: 39258,
              downloads: 30968,
              collections: 1585,
              likes: 158,
              comments: 28,
              user_id: 33702380,
              user: "DUCTINH91",
              userImageURL:
                "https://cdn.pixabay.com/user/2024/12/09/07-44-50-391_250x250.jpeg",
              x: 318,
              y: 139,
              variableName: "Image",
              name: null,
              hidden: true,
              scale_value: 0.1608157225184471,
              makeButton: false,
              opacity: 1,
              lock: false,
              zIndex: 1,
              visibility: true,
            },
            {
              x: 225,
              y: 289,
              webformatURL:
                '<?xml version="1.0" encoding="utf-8"?>\r\n<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\r\n<svg width="800px" height="800px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M301.738667 425.403733a320.4096 319.146667 0 1 0 640.8192 0 320.4096 319.146667 0 1 0-640.8192 0Z" fill="#EADAC5" /><path d="M782.108444 903.566222l-96.415288 39.549156a87.552 87.552 0 0 1-77.482667-5.461334L584.817778 923.943822c-175.024356-102.570667-356.465778-283.261156-459.423289-457.614222l-13.767111-23.313067a86.539378 86.539378 0 0 1-5.461334-77.141333l39.708445-96.0512 61.019022-28.797156 122.072178 182.3744-42.473245 59.517156-28.660622 40.129422c27.773156 48.753778 70.815289 102.172444 119.136711 150.311822 48.310044 48.150756 101.967644 91.022222 150.926223 118.692978l40.288711-28.558222 59.756089-42.2912L811.019378 842.752l-28.910934 60.814222z" fill="#47A7DD" /><path d="M819.5072 830.077156L636.427378 708.5056a15.36 15.36 0 0 0-17.351111 0.261689l-92.012089 65.160533c-44.145778-26.259911-93.252267-65.479111-139.275378-111.354311-46.068622-45.886578-85.435733-94.788267-111.763911-138.706489l65.422222-91.648a15.200711 15.200711 0 0 0 0.261689-17.282844l-122.083556-182.363022a15.337244 15.337244 0 0 0-19.273955-5.313423l-61.019022 28.797156c-3.436089 1.627022-6.144 4.471467-7.588978 7.964444l-39.708445 96.0512a102.365867 102.365867 0 0 0 6.417067 90.669511l13.767111 23.313067c4.278044 7.247644 13.653333 9.671111 20.935111 5.415822 7.281778-4.266667 9.716622-13.607822 5.4272-20.855466l-13.767111-23.313067a71.793778 71.793778 0 0 1-4.5056-63.624533l28.660622-69.3248 118.670223 180.667733-22.266311 31.197867a15.200711 15.200711 0 0 0-0.841956 16.361244c27.522844 48.310044 70.712889 102.843733 121.617067 153.543111 50.847289 50.676622 105.608533 93.707378 154.180266 121.173334a15.36 15.36 0 0 0 16.418134-0.830578l31.311644-22.175289 76.765867 50.016711a15.268978 15.268978 0 0 0 21.162666-4.4032 15.212089 15.212089 0 0 0-4.425955-21.0944l-66.730667-43.485867 33.371022-23.631644 163.328 108.4416-15.746844 33.109333-77.266489-50.358044c-7.076978-4.596622-16.554667-2.616889-21.174044 4.414578s-2.639644 16.475022 4.425955 21.0944l67.663645 44.100266-69.575111 28.535467a72.544711 72.544711 0 0 1-63.886223-4.5056l-23.404089-13.710222c-156.899556-91.932444-319.988622-247.853511-425.597155-406.9376a15.337244 15.337244 0 0 0-21.1968-4.3008 15.189333 15.189333 0 0 0-4.312178 21.105777c108.020622 162.7136 274.932622 322.264178 435.598222 416.403912l23.404089 13.710222a103.1168 103.1168 0 0 0 52.110222 14.051555 102.718578 102.718578 0 0 0 38.946134-7.634489l96.415289-39.549155c3.515733-1.444978 6.371556-4.141511 7.998577-7.566222l28.910934-60.814223a15.212089 15.212089 0 0 0-5.336178-19.205688zM168.288711 276.104533l33.211733-15.678577 108.896712 162.690844-23.722667 33.234489-118.385778-180.246756zM317.405867 325.393067a15.303111 15.303111 0 0 0 19.751822-8.772267c22.550756-58.5728 62.179556-108.145778 114.596978-143.371378a15.189333 15.189333 0 0 0 4.130133-21.139911 15.325867 15.325867 0 0 0-21.230933-4.107378c-57.6512 38.729956-101.239467 93.263644-126.0544 157.707378a15.223467 15.223467 0 0 0 8.8064 19.683556zM622.159644 91.022222c-47.661511 0-93.730133 9.750756-136.920177 28.990578a15.223467 15.223467 0 0 0-7.714134 20.127289 15.325867 15.325867 0 0 0 20.206934 7.691378 303.775289 303.775289 0 0 1 124.427377-26.328178c168.231822 0 305.106489 136.339911 305.106489 303.911822a301.249422 301.249422 0 0 1-54.317511 173.135645 304.605867 304.605867 0 0 1-139.389155 109.897955 15.212089 15.212089 0 0 0 5.575111 29.411556c1.865956 0 3.754667-0.341333 5.586489-1.058134a335.109689 335.109689 0 0 0 153.349689-120.866133 331.525689 331.525689 0 0 0 59.778844-190.520889C957.8496 241.026844 807.253333 91.022222 622.159644 91.022222z" fill="" /><path d="M607.220622 368.890311c0-39.571911-32.312889-71.759644-72.032711-71.759644s-72.032711 32.187733-72.032711 71.759644c0 8.419556 6.849422 15.234844 15.291733 15.234845 8.453689 0 15.291733-6.826667 15.291734-15.234845a41.403733 41.403733 0 0 1 41.437866-41.278578c22.869333 0 41.460622 18.511644 41.460623 41.278578 0 32.381156-12.652089 62.816711-35.646578 85.7088L467.626667 527.6672a15.212089 15.212089 0 0 0 10.820266 26.0096h113.493334c8.442311 0 15.291733-6.815289 15.291733-15.234844 0-8.408178-6.849422-15.234844-15.291733-15.234845h-76.561067l47.251911-47.069867a150.380089 150.380089 0 0 0 44.589511-107.246933zM728.996978 297.688178a15.303111 15.303111 0 0 0-17.2032 6.872178L620.726044 456.476444a15.223467 15.223467 0 0 0 13.118578 23.051378h75.776v58.925511c0 8.419556 6.849422 15.234844 15.303111 15.234845s15.303111-6.826667 15.303111-15.234845v-58.925511h25.622756c8.442311 0 15.291733-6.826667 15.291733-15.234844s-6.849422-15.234844-15.291733-15.234845h-25.622756V312.376889a15.246222 15.246222 0 0 0-11.229866-14.688711z m-19.364978 69.916444v81.453511h-48.833422l48.833422-81.453511z" fill="" /></svg>',
              variableName: "Image",
              name: null,
              hidden: false,
              type: "Svg",
              scale_value: 0.08183197021484369,
              id: 1735713160216,
              lock: false,
              zIndex: 1,
              visibility: true,
              opacity: 1,
            },
            {
              x: 418,
              y: 302,
              variableName: "Image",
              webformatURL:
                '<?xml version="1.0" encoding="utf-8"?>\r\n\r\n\r\n<svg fill="#000000" height="800px" width="800px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \r\n\t viewBox="0 0 32 32" xml:space="preserve">\r\n<g>\r\n\t<path d="M16,25c-0.6,0-1.1-0.2-1.6-0.6l-9.4-9.3c-0.7-0.7-1-1.6-1-2.5c0-1,0.4-1.8,1-2.5c1.4-1.4,3.6-1.4,5,0l5.8,5.7\r\n\t\tc0.1,0.1,0.2,0.1,0.3,0l5.8-5.7c1.4-1.4,3.6-1.4,5,0c0.7,0.7,1,1.6,1,2.5c0,1-0.4,1.8-1,2.5l-9.4,9.3C17.1,24.8,16.6,25,16,25z"/>\r\n</g>\r\n</svg>',
              name: null,
              hiden: false,
              type: "Svg",
              makeButton: false,
              scale_value: 3.39539781796035,
              id: 1735713168157,
              lock: false,
              zIndex: 1,
              visibility: true,
              opacity: 1,
            },
            {
              variableName: "CircleShape",
              tag: null,
              _id: "671783f435a256803f266845",
              id: 1735713218875,
              type: "Circle",
              name: "Circle",
              x: 120,
              y: 310,
              radius: 30.351043701171875,
              Color: "#00a8f0",
              createdAt: "2024-10-22T10:52:36.570Z",
              updatedAt: "2024-10-24T06:33:54.666Z",
              __v: 0,
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 0,
              visibility: true,
              lock: false,
              zIndex: 1,
              opacity: 1,
            },
            {
              variableName: "Text",
              name: null,
              bgColor: "rgba(255,255,255,0)",
              boxWidth: 200,
              textAlignment: "left",
              _id: "6710b3fead0d114f9ddcd0a3",
              id: 1735713232017,
              type: "Text",
              x: 97,
              y: 227,
              text: "Text",
              scale: 1,
              fontPath: null,
              fontSize: 24,
              fontFamily: "Orbitron",
              color: "#666666",
              bold: true,
              italic: false,
              underline: false,
              strikethrough: false,
              createdAt: "2024-10-17T06:51:42.747Z",
              updatedAt: "2024-10-17T06:51:42.747Z",
              __v: 0,
              lock: false,
              zIndex: 1,
              visibility: true,
              opacity: 1,
            },
            {
              variableName: "InputField",
              name: null,
              _id: "6710a2bbaf7467b2dbddb19a",
              id: 1735713242155,
              type: "InputField",
              x: 100,
              y: 100,
              width: 200,
              height: 35,
              text: "Text",
              placeholder: "Enter text..",
              bgColor: "#fafafa",
              borderColor: "#c0bfbf",
              borderThickness: 1,
              textColor: "#4d4d4d",
              placeholderColor: "#bfbfbf",
              fontSize: 14,
              cursorBlinkSpeed: 500,
              padding: 5,
              fontFamily: "Poppins",
              input_type: "text",
              default_text: "",
              padding_left: 5,
              padding_right: 5,
              padding_top: 5,
              padding_bottom: 5,
              border_style: ["bottom", "top", "right", "left"],
              on_input: null,
              __v: 0,
              lock: false,
              zIndex: 1,
              visibility: true,
              opacity: 1,
            },
          ]
        ).group;

      case "Line":
        return new Promise((resolve, reject) => {
          const line = new fabric.Line(
            [element.x1, element.y1, element.x2, element.y2], // Line coordinates
            {
              stroke: element.Color, // Line color
              strokeWidth: element.strokeWidth || 1, // Stroke width
              selectable: true, // Allow selecting the line
              hasControls: true, // Allow controls to resize
              opacity: element.opacity, // Opacity (default is 1, fully opaque)
            }
          );

          canvasObj.add(line);
          canvasObj.renderAll();
          resolve(line);
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
      className={`flex flex-col ${
        !selected ? "top-20" : "top-10"
      } items-center h-full relative`}
    >
      {/* Status Bar at the top */}
      <div
        style={{
          width: `${Width}px`,
          // Height of the status bar
          height: "40px",
          backgroundColor: "#FFFFFF", // Status bar color
          color: "#000000", // Text color
          display: "flex",
          paddingLeft: "10px",
          fontSize: "14px", // Ensure it stays above the canvas
        }}
        className="justify-between px-2"
      >
        <div className="flex items-center justify-center gap-1">
          <img src={pyVisualIcon} alt="Py-Visual" className="w-6" />
          <div className="text-sm text-black">
            {Height >= 250 ? "PyVisual Window" : ""}
          </div>
        </div>
        <div className="flex items-center justify-center gap-[20px]">
          <div className="h-4 mr-[20px]">
            <svg
              width="14px"
              height="14px"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#000000"
              stroke="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>minimize_line</title>{" "}
                <g
                  id="页面-1"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  {" "}
                  <g
                    id="System"
                    transform="translate(-192.000000, -192.000000)"
                  >
                    {" "}
                    <g
                      id="minimize_line"
                      transform="translate(192.000000, 192.000000)"
                    >
                      {" "}
                      <path
                        d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
                        id="MingCute"
                        fill-rule="nonzero"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M3,12 C3,11.4477 3.44772,11 4,11 L20,11 C20.5523,11 21,11.4477 21,12 C21,12.5523 20.5523,13 20,13 L4,13 C3.44772,13 3,12.5523 3,12 Z"
                        id="路径"
                        fill="#000000"
                      >
                        {" "}
                      </path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </div>
          <div className="h-4 mr-[20px]">
            <svg
              width="12px"
              height="12px"
              viewBox="0 0 17 17"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#949494"
              stroke="#949494"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M0 0v17h17v-17h-17zM16 16h-15v-15h15v15z"
                  fill="#949494"
                ></path>{" "}
              </g>
            </svg>
          </div>
          <div className="h-4">
            <svg
              width="14px"
              height="14px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#949494"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                  fill="#000000"
                ></path>{" "}
              </g>
            </svg>
          </div>
          <div></div>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        style={{
          backgroundImage: Image ? `url('${Image}')` : "none",
          backgroundColor: Image ? "transparent" : bgColor || "#ffffff", // Set BgColor or a fallback color
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: `${Width || 700}px`,
          height: `${Height || 400}px`,
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)", // Equivalent to shadow-xl
          // Push canvas below the status bar
        }}
      >
        <canvas ref={canvasRef} id="canvas" className="shadow-xl" />
      </div>

      {/* Optional: Show selected position information */}
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
