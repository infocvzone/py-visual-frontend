import FabricButton from "../input/button";
import FabricInputField from "../input/inputField";
import FabricText from "../output/text";

class GroupLayout {
  constructor(
    canvas,
    x = 100,
    y = 100,
    orientation = "horizontal",
    spacing = 10,
    padding = [10, 10, 10, 10],
    backgroundColor = "rgba(255, 255, 255, 0)",
    borderColor = "red",
    borderWidth = 1,
    radius = 0,
    id = 1,
    elements = []
  ) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.orientation = orientation;
    this.spacing = spacing;
    this.padding = padding;
    this.backgroundColor = backgroundColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.radius = radius;
    this.elements = elements;
    this.id = id;

    // Create a background rectangle
    this.bgRect = new fabric.Rect({
      left: this.x,
      top: this.y,
      fill: this.backgroundColor,
      stroke: this.borderColor,
      strokeWidth: this.borderWidth,
      rx: this.radius,
      ry: this.radius,
      selectable: false,
    });

    this.group = new fabric.Group([], {
      left: this.x,
      top: this.y,
      selectable: true,
      id: this.id,
    });

    this.updateGroupLayout(); // Apply layout and add elements
    this.canvas.add(this.group); // Add the group to the canvas
  }

  async updateGroupLayout() {
    let currentX = this.x + this.padding[3]; // Start with left padding
    let currentY = this.y + this.padding[0]; // Start with top padding
    const children = [];

    for (const element of this.elements) {
      
      const child = await this.createElement(element);

      // Get dimensions using getBoundingRect to handle cases where width or height is missing
      const boundingRect = child.getBoundingRect();

      const childWidth = boundingRect.width; // Fallback to 0 if not defined
      const childHeight = boundingRect.height;

      if (this.orientation === "horizontal") {
        child.left = currentX;
        child.top = currentY;
        currentX += childWidth + this.spacing;
      } else if (this.orientation === "vertical") {
        child.left = currentX;
        child.top = currentY;
        currentY += childHeight + this.spacing;
      }

      children.push(child);
    }

    // Update the background rectangle to fit the group size
    const totalWidth =
      this.orientation === "horizontal"
        ? currentX - this.x - this.spacing + this.padding[1]
        : Math.max(...children.map((child) => child.getBoundingRect().width)) +
          this.padding[1] +
          this.padding[3];

    const totalHeight =
      this.orientation === "vertical"
        ? currentY - this.y - this.spacing + this.padding[2]
        : Math.max(...children.map((child) => child.getBoundingRect().height)) +
          this.padding[0] +
          this.padding[2];

    this.bgRect.set({
      width: this.elements.length > 0 ? totalWidth : 100,
      height: this.elements.length > 0 ? totalHeight : 100,
    });

    // Add background and elements to the group
    this.group._objects = [this.bgRect, ...children];
    this.group.customType = "GroupLayout";
    this.group.addWithUpdate();
    this.canvas.renderAll();
  }

  async createElement(element) {
    // Implementation of createElement as in your code
    switch (element.type) {
      case "BasicButton":
        return new FabricButton(
          this.canvas,
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
          this.canvas,
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
          this.canvas,
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
          this.canvas,
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
          this.canvas,
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
          this.canvas,
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
          this.canvas,
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
          this.canvas,
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
          this.canvas,
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

              this.canvas.add(img);
              this.canvas.renderAll();
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
                this.canvas.add(svgGroup);
                this.canvas.renderAll();
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
          this.canvas,
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
          this.canvas,
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

          this.canvas.add(circle);
          this.canvas.renderAll();
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

          this.canvas.add(rect);
          this.canvas.renderAll();
          resolve(rect);
        });

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

          this.canvas.add(line);
          this.canvas.renderAll();
          resolve(line);
        });

      default:
        throw new Error(`Unsupported element type: ${element.type}`);
    }
  }

  async getFabricElement() {
    await this.updateGroupLayout();
    return this.group;
  }

  addElements(elements) {
    this.elements = elements;
    this.updateGroupLayout();
  }
}

export default GroupLayout;
