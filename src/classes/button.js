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
    idleColor = "#38b6ff",
    hoverColor = "#7cc8f4",
    clickedColor = "#155980",
    borderColor = "#000000",
    borderThickness = 0,
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
    this.hoverColor = hoverColor;
    this.clickedColor = clickedColor;

    this.borderColor = borderColor;
    this.borderThickness = borderThickness;

    this.onClick = onClick;
    this.onHover = onHover;
    this.onRelease = onRelease;

    this.isPressed = false;

    // Create the Fabric button rectangle
    this.buttonRect = new fabric.Rect({
      left: this.x + this.borderThickness / 2,
      top: this.y + this.borderThickness / 2,
      width: this.width - this.borderThickness,
      height: this.height - this.borderThickness,
      fill: this.idleColor,
      stroke: this.borderColor,
      strokeWidth: this.borderThickness,
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
      selectable: true,
      hoverCursor: "pointer",
    });

    // Add the button to the canvas
    this.canvas.add(this.buttonGroup);

    // Bind events for hover, click, and release
    this.bindEvents();
  }

  // Bind hover, click, and release events
  bindEvents() {
    this.buttonGroup.on("mouseover", () => this.handleHover());
    this.buttonGroup.on("mouseout", () => this.handleMouseOut());
    this.buttonGroup.on("mousedown", () => this.handleClick());
    this.buttonGroup.on("mouseup", () => this.handleRelease());
  }

  handleHover() {
    this.updateButtonColor(this.hoverColor);
    if (this.onHover) this.onHover(this); // Call the hover callback if provided
  }

  handleMouseOut() {
    this.updateButtonColor(this.isPressed ? this.clickedColor : this.idleColor);
  }

  handleClick() {
    this.isPressed = true;
    this.updateButtonColor(this.clickedColor);
    if (this.onClick) this.onClick(this); // Call the click callback if provided
  }

  handleRelease() {
    this.isPressed = false;
    this.updateButtonColor(this.hoverColor); // Revert to hover color on release
    if (this.onRelease) this.onRelease(this); // Call the release callback if provided
  }

  updateButtonColor(color) {
    this.buttonRect.set("fill", color);
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
