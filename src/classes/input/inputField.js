class FabricInputField {
  constructor(
    canvas,
    x,
    y,
    width = 300,
    height = 40,
    placeholder = "Enter text...",
    bgColor = "#ffffff",
    borderColor = "#c8c8c8",
    borderThickness = 1,
    textColor = "#323232",
    placeholderColor = "#c8c8c8",
    fontSize = 15,
    cursorBlinkSpeed = 500,
    padding = 10,
    fontFamily = "Roboto",
    id = 1,
    input_type = "text",
    default_text = "",
    padding_left = 10,
    padding_right = 10,
    padding_top = 0,
    padding_bottom = 10,
    border_style = ["bottom", "top", "right", "left"],
    on_input = null
  ) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.placeholder = placeholder;
    this.text = "";
    this.cursorPosition = 0;
    this.cursorVisible = true;
    this.lastBlinkTime = Date.now();

    // Store all individual style-related parameters
    this.bgColor = bgColor;
    this.borderColor = borderColor;
    this.borderThickness = borderThickness;
    this.textColor = textColor;
    this.placeholderColor = placeholderColor;
    this.fontSize = fontSize;
    this.cursorBlinkSpeed = cursorBlinkSpeed;
    this.padding = padding;
    this.fontFamily = fontFamily;
    this.input_type = input_type;
    this.padding_left = padding_left;
    this.padding_right = padding_right;
    this.padding_top = padding_top;
    this.padding_bottom = padding_bottom;
    this.default_text = default_text;
    this.border_style = border_style;
    this.on_input = on_input;
    this.id = id;

    // Create a Fabric rectangle to represent the input field
    this.inputRect = new fabric.Rect({
      left: this.x + borderThickness / 2,
      top: this.y + borderThickness / 2,
      width: this.width - borderThickness,
      height: this.height - borderThickness,
      fill: this.bgColor,
      stroke: this.borderColor,
      strokeWidth: this.borderThickness,
    });

    // Create the text for the input field (initially with placeholder text)
    this.inputText = new fabric.Text(this.placeholder, {
      left: this.x + this.padding + borderThickness/ 2,
      top: this.y + this.padding + this.fontSize / 2 + borderThickness / 2,
      originX: "left",
      originY: "top",
      fill: this.placeholderColor,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      selectable: false,
    });

    // Group the rectangle and text into a single input field object
    this.inputGroup = new fabric.Group([this.inputRect, this.inputText], {
      left: this.x,
      top: this.y,
      selectable: true,
      hoverCursor: "text",
      id : id,
    });

    // Add the input field to the canvas
    this.canvas.add(this.inputGroup);

    // Bind event handlers
    this.bindEvents();
  }

  // Bind events
  bindEvents() {
    this.inputGroup.on("mousedown", (event) => this.handleMouseDown(event));
    this.inputGroup.on("keydown", (event) => this.handleKeyDown(event));
    this.inputGroup.on("keyup", (event) => this.handleKeyUp(event));
    this.inputGroup.on("mouseover", () => this.handleHover());
    this.inputGroup.on("mouseout", () => this.handleMouseOut());
    this.inputGroup.on("moving", () => this.update());
  }

  // Handle mouse down events
  handleMouseDown(event) {
    if (event.e.button === 0) {
      // Left click
      this.setActive(true);
    }
  }

  // Handle key down events (can be extended if needed)
  handleKeyDown(event) {}

  // Handle key up events
  handleKeyUp(event) {
    if (event.e.key === "Backspace") {
      if (this.cursorPosition > 0) {
        this.text =
          this.text.slice(0, this.cursorPosition - 1) +
          this.text.slice(this.cursorPosition);
        this.cursorPosition--;
      }
    } else if (event.e.key === "Delete") {
      this.text =
        this.text.slice(0, this.cursorPosition) +
        this.text.slice(this.cursorPosition + 1);
    } else if (event.e.key === "ArrowLeft") {
      if (this.cursorPosition > 0) this.cursorPosition--;
    } else if (event.e.key === "ArrowRight") {
      if (this.cursorPosition < this.text.length) this.cursorPosition++;
    } else {
      this.text =
        this.text.slice(0, this.cursorPosition) +
        event.e.key +
        this.text.slice(this.cursorPosition);
      this.cursorPosition++;
    }
    this.update();
  }

  // Handle hover events
  handleHover() {}

  // Handle mouse out events
  handleMouseOut() {}

  // Update the input field rendering
  update() {
    this.inputRect.set({
      fill: this.bgColor,
      stroke: this.borderColor,
    });

    if (this.text.length === 0 && !this.isActive) {
      this.inputText.set({
        text: this.placeholder,
        fill: this.placeholderColor,
      });
    } else {
      this.inputText.set({
        text: this.text,
        fill: this.textColor,
      });
    }

    this.canvas.renderAll();
  }

  // Set the input field as active
  setActive(active) {
    this.isActive = active;
    if (active) {
      this.inputText.set({
        fill: this.textColor,
      });
    } else {
      this.update();
    }
  }
}

export default FabricInputField;
