class FabricText {
  constructor(
    canvas,
    x = 50,
    y = 50,
    text = "Text",
    font = "Roboto",
    fontSize = 20,
    fontColor = "#666666",
    bold = false,
    italic = false,
    underline = false,
    strikethrough = false,
    bgColor = "rgba(0, 0, 0, 0)",
    boxWidth = 200,
    textAlignment = "center",
    isVisible = true,
    opacity = 1,
    tag = null
  ) {
    this.canvas = canvas;
    this.text = text;
    this.x = x;
    this.y = y;
    this.font = font;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.bold = bold;
    this.italic = italic;
    this.underline = underline;
    this.strikethrough = strikethrough;
    this.bgColor = bgColor;
    this.boxWidth = boxWidth;
    this.textAlignment = textAlignment;
    this.isVisible = isVisible;
    this.opacity = opacity;
    this.tag = tag;

    // Create background rectangle
    this.bgRect = new fabric.Rect({
      left: this.x,
      top: this.y-3,
      width: this.boxWidth,
      height: this.fontSize + 3,
      fill: this.bgColor,
      selectable: false,
    });

    // Create text with styles and alignment
    this.textObj = new fabric.Textbox(this.text, {
      left: this.x,
      top: this.y,
      width: this.boxWidth,
      fontFamily: this.font,
      fontSize: this.fontSize,
      fill: this.fontColor,
      fontWeight: this.bold ? "bold" : "normal",
      fontStyle: this.italic ? "italic" : "normal",
      underline: this.underline,
      linethrough: this.strikethrough,
      textAlign: this.textAlignment,
      selectable: true,
    });

    // Group the rectangle and text
    this.group = new fabric.Group([this.bgRect, this.textObj], {
      left: this.x,
      top: this.y,
      opacity: this.opacity,
      selectable: true,
    });

    // Add to canvas
    this.canvas.add(this.group);

    // Set visibility
    this.setVisibility(this.isVisible);
  }

  setText(newText) {
    this.text = newText;
    this.textObj.text = newText;
    this.canvas.requestRenderAll();
  }

  setFontSize(newFontSize) {
    this.fontSize = newFontSize;
    this.textObj.fontSize = newFontSize;
    this.bgRect.height = newFontSize + 10;
    this.canvas.requestRenderAll();
  }

  setFontColor(newFontColor) {
    this.fontColor = newFontColor;
    this.textObj.fill = newFontColor;
    this.canvas.requestRenderAll();
  }

  setBgColor(newBgColor) {
    this.bgColor = newBgColor;
    this.bgRect.fill = newBgColor;
    this.canvas.requestRenderAll();
  }

  setTextAlignment(newAlignment) {
    this.textAlignment = newAlignment;
    this.textObj.textAlign = newAlignment;
    this.canvas.requestRenderAll();
  }

  setVisibility(isVisible) {
    this.isVisible = isVisible;
    this.group.visible = isVisible;
    this.canvas.requestRenderAll();
  }

  setOpacity(newOpacity) {
    this.opacity = newOpacity;
    this.group.opacity = newOpacity;
    this.canvas.requestRenderAll();
  }

  // Add the object to a layout (e.g., another group or canvas layer)
  addToLayout(layout) {
    layout.add(this.group);
  }

  // Get plain text (removing formatting if needed)
  getText() {
    return this.text;
  }
}

export default FabricText;