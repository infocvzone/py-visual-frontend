class PlainText {
  constructor(
    parentElement,
    text = "Default Text",
    color = "#000000", // Default text color
    scale = 1.0,
    fontSize = 20,
    fontFamily = "Roboto",
    bold = false,
    italic = false,
    underline = false,
    strikethrough = false,
  ) {
    this.text = text;
    this.color = color;
    this.scale = scale;
    this.fontSize = Math.round(fontSize * scale); // Adjust font size based on scale
    this.fontFamily = fontFamily;
    this.bold = bold;
    this.italic = italic;
    this.underline = underline;
    this.strikethrough = strikethrough;

    // Create a text element (h1 or span)
    this.textElement = document.createElement("span");
    this.textElement.textContent = this.text;

    // Set initial styles
    this.textElement.style.color = this.color;
    this.textElement.style.fontSize = `${this.fontSize}px`;
    this.textElement.style.fontFamily = this.fontFamily;
    this.textElement.style.fontWeight = this.bold ? "bold" : "normal";
    this.textElement.style.fontStyle = this.italic ? "italic" : "normal";
    this.textElement.style.textDecoration = `${
      this.underline ? "underline " : ""
    }${this.strikethrough ? "line-through" : ""}`;
    this.textElement.style.transform = `scale(${this.scale})`;

    // Append the text element to the parent element
    parentElement.appendChild(this.textElement);
  }

  // Method to update the text content
  updateText(newText) {
    this.text = newText;
    this.textElement.textContent = newText;
  }

  // Method to update text color
  updateColor(newColor) {
    this.color = newColor;
    this.textElement.style.color = newColor;
  }

  // Method to update font size and scale
  updateScale(newScale) {
    this.scale = newScale;
    this.fontSize = Math.round(20 * this.scale);
    this.textElement.style.fontSize = `${this.fontSize}px`;
    this.textElement.style.transform = `scale(${this.scale})`;
  }

  // Method to update bold style
  setBold(isBold) {
    this.bold = isBold;
    this.textElement.style.fontWeight = isBold ? "bold" : "normal";
  }

  // Method to update italic style
  setItalic(isItalic) {
    this.italic = isItalic;
    this.textElement.style.fontStyle = isItalic ? "italic" : "normal";
  }

  // Method to toggle underline style
  setUnderline(isUnderline) {
    this.underline = isUnderline;
    this.textElement.style.textDecoration = `${
      this.underline ? "underline " : ""
    }${this.strikethrough ? "line-through" : ""}`;
  }

  // Method to toggle strikethrough style
  setStrikethrough(isStrikethrough) {
    this.strikethrough = isStrikethrough;
    this.textElement.style.textDecoration = `${
      this.underline ? "underline " : ""
    }${this.strikethrough ? "line-through" : ""}`;
  }


  // Method to change position
  setPosition(x, y) {
    this.textElement.style.position = "absolute";
    this.textElement.style.left = `${x}px`;
    this.textElement.style.top = `${y}px`;
  }

  // Method to change font family
  updateFontFamily(newFontFamily) {
    this.fontFamily = newFontFamily;
    this.textElement.style.fontFamily = newFontFamily;
  }
}

export default PlainText;
