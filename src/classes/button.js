class FabricButton {
  constructor(
    canvas,
    x,
    y,
    width = 150,
    height = 30,
    text = "CLICK ME",
    fontFamily = "Roboto",
    fontSize = 16,
    textColor = "#FFFFFF",
    idleColor = "#38b6ff",  // Only idleColor passed
    borderColor = "#000000",
    borderThickness = 0,
    opacity = 1,  // Default opacity
    borderRadius = 0,  // Default border radius
    onClick = null,
    onHover = null,
    onRelease = null
  ) {
    // Initialize button properties
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.textColor = textColor;

    this.idleColor = idleColor;
    this.borderColor = borderColor;
    this.borderThickness = borderThickness;
    this.opacity = opacity;  // Set the opacity
    this.borderRadius = borderRadius;  // Set the border radius

    this.onClick = onClick;
    this.onHover = onHover;
    this.onRelease = onRelease;

    this.isPressed = false;

    // Generate hover and clicked colors based on idle color
    const { r, g, b, a } = this.parseColor(idleColor);
    this.hoverColor = `rgba(${r}, ${g}, ${b}, ${a * 0.75})`; // Hover color with 75% opacity
    this.clickedColor = `rgba(${r}, ${g}, ${b}, ${a * 0.50})`; // Clicked color with 50% opacity

    // Create the Fabric button rectangle with border radius and opacity
    this.buttonRect = new fabric.Rect({
      left: this.x + this.borderThickness / 2,
      top: this.y + this.borderThickness / 2,
      width: this.width - this.borderThickness,
      height: this.height - this.borderThickness,
      fill: this.idleColor,
      stroke: this.borderColor,
      strokeWidth: this.borderThickness,
      rx: this.borderRadius,  // Apply border radius for rounded corners
      ry: this.borderRadius,  // Apply border radius for rounded corners
      
    });

    // Create the Fabric text for the button
    this.buttonText = new fabric.Text(this.text, {
      left: this.x + this.borderThickness / 2 + this.width / 2,
      top: this.y + this.borderThickness / 2 + this.height / 2,
      originX: "center",
      originY: "center",
      fill: this.textColor,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
    });

    // Group the button rectangle and text
    this.buttonGroup = new fabric.Group([this.buttonRect, this.buttonText], {
      left: this.x,
      top: this.y,
      opacity: this.opacity,
      selectable: true,
      hoverCursor: "pointer",

    });

    // Add the button to the canvas
    this.canvas.add(this.buttonGroup);

    // Bind events for hover, click, and release
    this.bindEvents();
  }

  // Parse color string (hex, rgb, rgba) and return an object with r, g, b, a values
  parseColor(color) {
    let r, g, b, a = 1;

    if (color.startsWith("#")) {
      // Hex color code (e.g., #ff0000 or #ff0000ff)
      const hex = color.slice(1);
      if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        a = parseInt(hex.slice(6, 8), 16) / 255;
      }
    } else if (color.startsWith("rgb")) {
      // RGB or RGBA color (e.g., rgb(255, 0, 0) or rgba(255, 0, 0, 0.5))
      const rgba = color.match(/(\d+), (\d+), (\d+),? ?(\d*\.?\d*)/);
      if (rgba) {
        r = parseInt(rgba[1]);
        g = parseInt(rgba[2]);
        b = parseInt(rgba[3]);
        a = rgba[4] ? parseFloat(rgba[4]) : 1;
      }
    }

    return { r, g, b, a };
  }

  // Bind hover, click, and release events
  bindEvents() {
    this.buttonGroup.on("mouseover", () => this.handleHover());
    this.buttonGroup.on("mouseout", () => this.handleMouseOut());
    this.buttonGroup.on("mousedown", () => this.handleClick());
    this.buttonGroup.on("mouseup", () => this.handleRelease());
  }

  handleHover() {
    // On hover, change color and set opacity to 0.75
    this.updateButtonColor(this.hoverColor, 0.75);
    if (this.onHover) this.onHover(this); // Call the hover callback if provided
  }

  handleMouseOut() {
    // On mouse out, reset color and revert opacity to original
    this.updateButtonColor(this.isPressed ? this.clickedColor : this.idleColor, this.opacity);
  }

  handleClick() {
    this.isPressed = true;
    // On click, change color and set opacity to 0.50
    this.updateButtonColor(this.clickedColor, 0.50);
    if (this.onClick) this.onClick(this); // Call the click callback if provided
  }

  handleRelease() {
    this.isPressed = false;
    // On release, revert to hover color with normal opacity
    this.updateButtonColor(this.hoverColor, 0.75);
    if (this.onRelease) this.onRelease(this); // Call the release callback if provided
  }

  updateButtonColor(color, opacity) {
    // Update both the color and opacity of the button rectangle
    this.buttonRect.set({
      fill: color,
      opacity: opacity,
    });
    this.canvas.renderAll(); // Re-render the canvas
  }

  setBorder(borderThickness, borderColor) {
    // Update the border color and thickness
    this.borderThickness = borderThickness;
    this.buttonRect.set({
      stroke: borderColor,
      strokeWidth: borderThickness,
      left: this.x + borderThickness / 2,
      top: this.y + borderThickness / 2,
      width: this.width - borderThickness,
      height: this.height - borderThickness,
    });
    this.canvas.renderAll(); // Re-render the canvas
  }

  setFont(fontFamily, fontSize) {
    // Update the font family and size
    this.buttonText.set({
      fontFamily: fontFamily,
      fontSize: fontSize,
      left: this.x + this.borderThickness / 2 + this.width / 2,
      top: this.y + this.borderThickness / 2 + this.height / 2,
    });
    this.canvas.renderAll(); // Re-render the canvas
  }
}

export default FabricButton;
